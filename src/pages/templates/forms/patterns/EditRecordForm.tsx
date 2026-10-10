import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import { useToast } from '../../../../components/common/Toast';
import { ConfirmDestructiveModal } from '../../profile/modals/ConfirmDestructiveModal';
import { DangerZone } from '../../settings/patterns/DangerZone';
import { BUTTON } from '../../profile/ui';
import { SUBMIT_DELAY_MS } from '../formStates';
import { RecordData, REFERENCE_ID, fullRecord } from '../data/sampleRecord';
import { useFormState } from '../foundations/useFormState';
import { RecordScope, validateRecord } from '../foundations/validators';
import { FormLayout } from '../foundations/FormLayout';
import { ActionBar } from '../foundations/ActionBar';
import { ErrorSummary } from '../foundations/ErrorSummary';
import { DiscardGuard, FlowAlerts, LiveRegion, SuccessCard } from './RecordFlow';
import { AddressSection, AttachmentsSection, BasicSection, ContactSection, NotesSection, RecordReadOnly, idFor } from './RecordSections';
import type { PatternProps } from './SinglePageForm';

const SCOPES: RecordScope[] = ['basic', 'contact', 'address', 'notes'];
const P = 'edit';

/** Edited values per state: two changes by default, mistakes for "errors", a duplicate name. */
const editedFor = (state: PatternProps['state']): RecordData => {
  const base = fullRecord();
  if (state === 'empty' || state === 'read-only' || state === 'success') return base;
  if (state === 'errors') return { ...base, email: 'accounts@sharmalogistics', pin: '41102' };
  if (state === 'duplicate') return { ...base, name: 'Sharma Logistics' };
  return { ...base, email: 'billing@sharmalogistics.in', notes: 'Preferred vendor for gate barriers and boom maintenance across both campuses.' };
};

/**
 * Pattern 6 — Edit record: the create form pre-filled. Changed fields show a 3px Royal Blue bar and
 * "Modified"; the action bar counts the changes; a Danger zone holds Delete (type-to-confirm).
 */
export const EditRecordForm: React.FC<PatternProps> = ({ state, marker }) => {
  const { showToast } = useToast();
  const validate = useCallback((d: RecordData) => validateRecord(d, SCOPES), []);
  const form = useFormState<RecordData>(editedFor(state), validate, { baseline: fullRecord(), submitted: state === 'errors' });
  const [busy, setBusy] = useState(state === 'submitting');
  const [saved, setSaved] = useState(state === 'success');
  const [serverError, setServerError] = useState(state === 'server-error');
  const [duplicate, setDuplicate] = useState(state === 'duplicate');
  const [guard, setGuard] = useState(state === 'guard');
  const [readOnly, setReadOnly] = useState(state === 'read-only');
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [live, setLive] = useState('');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (state === 'draft') showToast('Draft saved', 'success');
  }, []); // Once, when the Draft saved state opens.

  const save = (skipDuplicate = false) => {
    if (busy) return;
    const keys = form.submitAttempt();
    if (keys.length) {
      setAttempt((a) => a + 1);
      setLive(`Fix ${keys.length} ${keys.length === 1 ? 'field' : 'fields'} to continue`);
      return;
    }
    if (!skipDuplicate && form.changed.includes('name') && form.values.name.trim().toLowerCase() === 'sharma logistics') return setDuplicate(true);
    setServerError(false);
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      form.reset(form.values);
      setSaved(true);
      showToast('Changes saved', 'success');
    }, SUBMIT_DELAY_MS);
  };

  if (deleted) return <SuccessCard title="Record deleted" text={`${REFERENCE_ID} was deleted. Its history stays in the audit log.`} onAnother={() => setDeleted(false)} anotherLabel="Undo" />;
  if (saved) return <SuccessCard title="Changes saved" text={`${REFERENCE_ID} was updated.`} onAnother={() => setSaved(false)} anotherLabel="Keep editing" />;

  const n = form.changed.length;
  return (
    <>
      <FormLayout
        breadcrumb={['Records', REFERENCE_ID, readOnly ? 'View' : 'Edit']}
        title={readOnly ? form.values.name : `Edit record · ${REFERENCE_ID}`}
        description={readOnly ? `${REFERENCE_ID} · Vendor` : 'Changed fields are highlighted until you save.'}
        meta="Last updated by Rahul Mehta, 28 Sep 2026"
        requiredNote={!readOnly}
        marker={marker}
        headerAction={
          readOnly && (
            <button type="button" onClick={() => setReadOnly(false)} className={BUTTON.secondary}>
              <Pencil className="w-4 h-4" aria-hidden="true" />
              Edit
            </button>
          )
        }
        alerts={
          !readOnly && ((form.submitted && Object.keys(form.allErrors).length > 0) || duplicate || serverError) ? (
            <>
              <ErrorSummary keys={form.submitted ? Object.keys(form.allErrors) : []} errors={form.allErrors} idFor={(k) => idFor(P, k)} attempt={attempt} overlay={marker(4)} />
              <FlowAlerts
                serverMessage="We couldn't save your changes. Your data is safe — try again."
                flow={{ duplicate, serverError, submit: () => save(), dismissDuplicate: () => setDuplicate(false), continueDuplicate: () => (setDuplicate(false), save(true)) }}
              />
            </>
          ) : undefined
        }
        actionBar={
          !readOnly && (
            <ActionBar
              status={n ? 'changes' : 'none'}
              statusLabel={n ? `${n} ${n === 1 ? 'change' : 'changes'}` : 'No changes'}
              primaryLabel="Save changes"
              busyLabel="Saving…"
              busy={busy}
              onPrimary={() => save()}
              cancelLabel="Discard changes"
              onCancel={() => (n ? setGuard(true) : showToast('Nothing to discard', 'info'))}
              markers={{ bar: marker(10), status: marker(11) }}
            />
          )
        }
      >
        {readOnly ? (
          <RecordReadOnly v={form.values} />
        ) : (
          <form noValidate onSubmit={(e) => (e.preventDefault(), save())} className="space-y-6" aria-busy={busy || undefined}>
            <BasicSection form={form} p={P} readOnly={busy} showChanges marker={marker} />
            <ContactSection form={form} p={P} readOnly={busy} showChanges />
            <AddressSection form={form} p={P} readOnly={busy} showChanges marker={marker} />
            <NotesSection form={form} p={P} readOnly={busy} showChanges />
            <AttachmentsSection form={form} p={P} readOnly={busy} />
            <DangerZone
              actions={[
                {
                  label: 'Delete record',
                  description: 'Removes it from lists and reports. Its history stays in the audit log.',
                  action: (
                    <button type="button" onClick={() => setDeleting(true)} className={BUTTON.destructive}>
                      Delete record
                    </button>
                  ),
                },
              ]}
            />
          </form>
        )}
      </FormLayout>
      <DiscardGuard
        open={guard}
        title="Discard your changes?"
        onKeep={() => setGuard(false)}
        onDiscard={() => {
          setGuard(false);
          form.discard();
          setLive('Changes discarded');
        }}
      />
      {deleting && (
        <ConfirmDestructiveModal
          title={`Delete ${REFERENCE_ID}?`}
          body="The record is removed from lists, reports and searches. This can't be undone from here."
          confirmLabel="Delete record"
          confirmText={REFERENCE_ID}
          onClose={() => setDeleting(false)}
          onConfirm={() => {
            setDeleting(false);
            setDeleted(true);
            showToast('Record deleted', 'success');
          }}
        />
      )}
      <LiveRegion message={live} />
    </>
  );
};
