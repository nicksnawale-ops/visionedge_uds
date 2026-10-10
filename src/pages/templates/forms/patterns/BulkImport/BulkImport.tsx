import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '../../../../../components/common/Toast';
import { Stepper } from '../../../register/Stepper';
import { ConfirmDestructiveModal } from '../../../profile/modals/ConfirmDestructiveModal';
import type { FormStateId } from '../../formStates';
import { IMPORT_COUNTS, IMPORT_FILE, SKIP, SOURCE_COLUMNS, TARGET_FIELDS } from '../../data/importSample';
import type { UploadedFile } from '../../data/sampleRecord';
import { FormLayout } from '../../foundations/FormLayout';
import { ActionBar } from '../../foundations/ActionBar';
import { LiveRegion } from '../RecordFlow';
import { UploadStep } from './UploadStep';
import { MapStep } from './MapStep';
import { ValidateFilter, ValidateStep } from './ValidateStep';
import { ImportStep } from './ImportStep';
import { DoneStep } from './DoneStep';

type Step = 1 | 2 | 3 | 4 | 5;
const STEPS = [
  { n: 1, label: 'Upload' },
  { n: 2, label: 'Map columns' },
  { n: 3, label: 'Validate' },
  { n: 4, label: 'Import' },
  { n: 5, label: 'Done' },
];

const stepFor = (s: FormStateId): Step =>
  s === 'empty' ? 1 : s === 'partial' || s === 'draft' ? 2 : s === 'errors' || s === 'duplicate' ? 3 : s === 'submitting' || s === 'server-error' || s === 'guard' ? 4 : 5;
const autoMapping = () => Object.fromEntries(SOURCE_COLUMNS.map((c) => [c.name, c.match]));
const uploaded: UploadedFile = { id: 'sample', name: IMPORT_FILE.name, size: IMPORT_FILE.size, progress: 100 };

/** Pattern 7 — Bulk import: Upload · Map columns · Validate · Import · Done. */
export const BulkImport: React.FC<{ state: FormStateId; marker: (n: number) => React.ReactNode }> = ({ state, marker }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>(stepFor(state));
  const [files, setFiles] = useState<UploadedFile[]>(stepFor(state) > 1 ? [uploaded] : []);
  const [uploadError, setUploadError] = useState('');
  const [mapping, setMapping] = useState<Record<string, string>>(autoMapping);
  const [showMissing, setShowMissing] = useState(false);
  const [filter, setFilter] = useState<ValidateFilter>(state === 'errors' ? 'errors' : state === 'duplicate' ? 'duplicates' : 'all');
  const [validOnly, setValidOnly] = useState(state !== 'errors');
  const [blocked, setBlocked] = useState(false);
  const [progress, setProgress] = useState(state === 'server-error' ? 62 : state === 'guard' ? 62 : 0);
  const [failed, setFailed] = useState(state === 'server-error');
  const [cancelAsk, setCancelAsk] = useState(state === 'guard');
  const [cancelledAt, setCancelledAt] = useState<number | undefined>(undefined);
  const [live, setLive] = useState('');
  const [announced, setAnnounced] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state === 'draft') showToast('Mapping saved as a draft', 'success');
  }, []); // Once, when the Draft saved state opens.

  const missing = useMemo(() => TARGET_FIELDS.filter((f) => f.required && !Object.values(mapping).includes(f.value)).map((f) => f.label), [mapping]);

  // Import progress: +4% every 200ms while on step 4 (paused by the cancel question or a failure).
  const running = step === 4 && !failed && !cancelAsk;
  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setProgress((p) => Math.min(100, p + 4)), 200);
    return () => window.clearInterval(t);
  }, [running]);
  useEffect(() => {
    if (step !== 4) return;
    if (progress >= 100) {
      showToast(`${IMPORT_COUNTS.ready} records imported`, 'success');
      go(5);
    } else if (progress > 0 && progress % 25 < 4) setAnnounced(`Import ${Math.floor(progress / 25) * 25}% complete`);
  }, [progress, step]);

  const go = (s: Step) => {
    setStep(s);
    setLive(`Step ${s} of 5: ${STEPS[s - 1].label}`);
    window.setTimeout(() => headingRef.current?.focus(), 0);
  };

  const next = () => {
    if (step === 1) {
      if (!files.some((f) => f.progress === 100 && !f.error)) {
        setUploadError('Upload a CSV or Excel file to continue');
        document.getElementById('import-file')?.focus();
        return;
      }
      setUploadError('');
      go(2);
    } else if (step === 2) {
      if (missing.length) {
        setShowMissing(true);
        window.setTimeout(() => document.getElementById('map-missing')?.focus(), 0);
        return;
      }
      go(3);
    } else if (step === 3) {
      if (!validOnly) {
        setBlocked(true);
        window.setTimeout(() => document.getElementById('validate-blocked')?.focus(), 0);
        return;
      }
      setProgress(0);
      setFailed(false);
      go(4);
    }
  };

  const download = (name: string, text: string) => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restart = () => {
    setFiles([]);
    setMapping(autoMapping());
    setShowMissing(false);
    setFilter('all');
    setValidOnly(true);
    setProgress(0);
    setCancelledAt(undefined);
    go(1);
  };

  return (
    <>
      <FormLayout
        breadcrumb={['Records', 'Import']}
        title="Import records"
        description="Create many records at once from a spreadsheet. Nothing is created until the Import step."
        requiredNote={false}
        marker={marker}
        actionBar={
          step <= 3 && (
            <ActionBar
              status="none"
              statusLabel={step === 1 ? 'Step 1 of 5' : step === 2 ? `${Object.values(mapping).filter((v) => v !== SKIP).length} of ${SOURCE_COLUMNS.length} columns mapped` : `${IMPORT_COUNTS.ready} rows ready`}
              primaryLabel={step === 3 ? `Import ${IMPORT_COUNTS.ready} records` : 'Continue'}
              busyLabel="Starting…"
              busy={false}
              onPrimary={next}
              cancelLabel={step === 1 ? 'Cancel' : 'Back'}
              onCancel={() => (step === 1 ? showToast('Back to the list', 'info') : go((step - 1) as Step))}
              markers={{ bar: marker(10), status: marker(11) }}
            />
          )
        }
      >
        <div className="relative">
          {marker(9)}
          <Stepper current={step} completed={Array.from({ length: step - 1 }, (_, i) => i + 1)} steps={STEPS} ariaLabel="Import progress" />
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="sr-only">
          Step {step} of 5: {STEPS[step - 1].label}
        </h2>
        {step === 1 && (
          <UploadStep
            files={files}
            onFiles={(f) => (setFiles(f), setUploadError(''))}
            error={uploadError || undefined}
            onDownloadTemplate={() => download('records-template.csv', `${TARGET_FIELDS.map((f) => f.label).join(',')}\n`)}
          />
        )}
        {step === 2 && <MapStep mapping={mapping} onMap={(s, t) => setMapping((m) => ({ ...m, [s]: t }))} missing={missing} showMissing={showMissing} />}
        {step === 3 && (
          <ValidateStep
            filter={filter}
            onFilter={setFilter}
            validOnly={validOnly}
            onValidOnly={(v) => (setValidOnly(v), setBlocked(false))}
            blocked={blocked}
            onDownloadReport={() => {
              download('import-error-report.csv', 'Row,Problem\n6,Enter an email like name@example.in\n');
              showToast('Error report downloaded', 'success');
            }}
          />
        )}
        {step === 4 && <ImportStep progress={progress} failed={failed} onCancel={() => setCancelAsk(true)} onRetry={() => setFailed(false)} announced={announced} />}
        {step === 5 && <DoneStep onAnother={restart} cancelledAt={cancelledAt} />}
      </FormLayout>
      {cancelAsk && (
        <ConfirmDestructiveModal
          title="Cancel this import?"
          body={`${Math.round((IMPORT_COUNTS.ready * progress) / 100)} records are already imported and stay. The rest won't be imported.`}
          cancelLabel="Keep importing"
          confirmLabel="Cancel import"
          onClose={() => setCancelAsk(false)}
          onConfirm={() => {
            setCancelAsk(false);
            setCancelledAt(progress);
            go(5);
          }}
        />
      )}
      <LiveRegion message={live} />
    </>
  );
};
