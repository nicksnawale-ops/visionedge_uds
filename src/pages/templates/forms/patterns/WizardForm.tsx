import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import { useToast } from '../../../../components/common/Toast';
import { Stepper } from '../../register/Stepper';
import { formatPhone } from '../../register/registerStates';
import { BUTTON } from '../../profile/ui';
import { SUBMIT_DELAY_MS } from '../formStates';
import { RecordData, categoryLabel, emptyRecord, formatDate, formatRupees, fullRecord, invalidRecord, partialRecord } from '../data/sampleRecord';
import { useFormState } from '../foundations/useFormState';
import { useAutosave } from '../foundations/useAutosave';
import { RecordScope, validateRecord } from '../foundations/validators';
import { FormLayout } from '../foundations/FormLayout';
import { FormSection } from '../foundations/FormSection';
import { ActionBar } from '../foundations/ActionBar';
import { ErrorSummary } from '../foundations/ErrorSummary';
import { ReadOnlyValue } from '../fields/FieldShell';
import { ConsentCheckbox } from '../fields/SmallFields';
import { DiscardGuard, FlowAlerts, LiveRegion, SuccessCard } from './RecordFlow';
import { AdditionalSection, BasicSection, ClassificationSection, ContactSection, idFor } from './RecordSections';
import type { PatternProps } from './SinglePageForm';

type Step = 1 | 2 | 3 | 4;
const STEPS = [
  { n: 1, label: 'Details' },
  { n: 2, label: 'Configuration' },
  { n: 3, label: 'People' },
  { n: 4, label: 'Review' },
];
const SCOPES: Record<Step, RecordScope[]> = { 1: ['basic', 'contact'], 2: ['classification'], 3: ['additional'], 4: ['documents'] };
const P = 'wizard';

const stepFor = (state: PatternProps['state']): Step =>
  state === 'empty' || state === 'errors' || state === 'duplicate' ? 1 : state === 'submitting' || state === 'server-error' || state === 'read-only' ? 4 : 2;

const valuesFor = (state: PatternProps['state']): RecordData =>
  state === 'empty' ? emptyRecord() : state === 'errors' ? invalidRecord() : state === 'duplicate' ? { ...partialRecord(), name: 'Sharma Logistics', category: 'vendor' } : stepFor(state) === 4 ? fullRecord() : { ...partialRecord(), category: 'vendor' };

/**
 * Pattern 3 — Multi-step wizard: Details · Configuration · People · Review. Data is kept between steps,
 * a step can't advance with errors, and Review shows read-only cards with "Edit" links.
 */
export const WizardForm: React.FC<PatternProps> = ({ state, marker }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>(stepFor(state));
  const [completed, setCompleted] = useState<number[]>(() => Array.from({ length: stepFor(state) - 1 }, (_, i) => i + 1));
  const validate = useCallback(
    (d: RecordData) => {
      const e = validateRecord(d, SCOPES[step]);
      if (step === 3 && d.contacts.length === 0) e.contacts = 'Add at least one contact person';
      return e;
    },
    [step]
  );
  const form = useFormState<RecordData>(valuesFor(state), validate, { baseline: emptyRecord(), submitted: state === 'errors' });
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(state === 'submitting');
  const [done, setDone] = useState(state === 'success');
  const [serverError, setServerError] = useState(state === 'server-error');
  const [duplicate, setDuplicate] = useState(state === 'duplicate');
  const [dupAccepted, setDupAccepted] = useState(false);
  const [guard, setGuard] = useState(state === 'guard');
  const [readOnly, setReadOnly] = useState(state === 'read-only');
  const [live, setLive] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const autosave = useAutosave(JSON.stringify(form.values), form.dirty && !busy && !done, () => setLive('Draft saved'), state === 'draft' ? { minutesAgo: 2 } : undefined);
  useEffect(() => {
    if (state === 'draft') showToast('Draft saved', 'success');
  }, []); // Once, when the Draft saved state opens.

  const go = (s: Step) => {
    setStep(s);
    setAttempt(0);
    setLive(`Step ${s} of 4: ${STEPS[s - 1].label}`);
    window.setTimeout(() => headingRef.current?.focus(), 0);
  };

  const valid = (): boolean => {
    const keys = form.submitAttempt();
    if (!keys.length) return true;
    setAttempt((a) => a + 1);
    setLive(`Fix ${keys.length} ${keys.length === 1 ? 'field' : 'fields'} to continue`);
    return false;
  };

  const create = () => {
    setServerError(false);
    setBusy(true);
    setLive('Creating entity');
    timer.current = window.setTimeout(() => {
      setBusy(false);
      setDone(true);
      showToast('Entity created', 'success');
    }, SUBMIT_DELAY_MS);
  };

  const next = () => {
    if (busy || !valid()) return;
    if (step === 1 && !dupAccepted && form.values.name.trim().toLowerCase() === 'sharma logistics') {
      setDuplicate(true);
      return;
    }
    if (step === 4) return create();
    setCompleted((c) => [...new Set([...c, step])]);
    form.resetValidation();
    go((step + 1) as Step);
  };

  if (done) return <SuccessCard title="Entity created" text="REC-2026-0142 was set up successfully. People you added will get an email invitation." onAnother={() => (form.reset(emptyRecord()), setDone(false), setCompleted([]), go(1))} anotherLabel="Set up another" />;

  const v = form.values;
  const summary: { step: Step; title: string; rows: [string, string][] }[] = [
    { step: 1, title: 'Details', rows: [['Name', v.name], ['Category', categoryLabel(v.category)], ['Email', v.email], ['Phone', v.phone ? `+91 ${formatPhone(v.phone)}` : '']] },
    {
      step: 2,
      title: 'Configuration',
      rows: [
        ['Entity type', v.entityType === 'organization' ? 'Organization' : v.entityType === 'individual' ? 'Individual' : ''],
        ['GSTIN', v.gstin],
        ['Dates', [formatDate(v.startDate), formatDate(v.endDate)].filter(Boolean).join(' – ')],
        ['Annual budget', formatRupees(v.budget)],
      ],
    },
    { step: 3, title: 'People', rows: v.contacts.map((c, i) => [`Contact person ${i + 1}`, [c.name, c.role, c.phone && `+91 ${formatPhone(c.phone)}`].filter(Boolean).join(' · ')] as [string, string]) },
  ];

  return (
    <>
      <FormLayout
        breadcrumb={['Setup', 'New entity']}
        title="Set up a new entity"
        description="Four short steps. You can go back at any time; nothing is created until you confirm."
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
          (form.submitted && Object.keys(form.allErrors).length > 0) || duplicate || serverError ? (
            <>
              <ErrorSummary keys={form.submitted ? Object.keys(form.allErrors) : []} errors={form.allErrors} idFor={(k) => (k === 'contacts' ? `${P}-contacts-add` : idFor(P, k))} attempt={attempt} overlay={marker(4)} />
              <FlowAlerts
                flow={{
                  duplicate,
                  serverError,
                  submit: create,
                  dismissDuplicate: () => setDuplicate(false),
                  continueDuplicate: () => {
                    setDuplicate(false);
                    setDupAccepted(true);
                    setCompleted((c) => [...new Set([...c, 1])]);
                    form.resetValidation();
                    go(2);
                  },
                }}
              />
            </>
          ) : undefined
        }
        actionBar={
          !readOnly && (
            <ActionBar
              status={form.dirty && autosave.status === 'idle' ? 'unsaved' : autosave.status}
              statusLabel={form.dirty && autosave.status === 'idle' ? 'Unsaved changes' : autosave.label}
              primaryLabel={step === 4 ? 'Create entity' : 'Continue'}
              busyLabel="Creating…"
              busy={busy}
              onPrimary={next}
              cancelLabel={step > 1 ? 'Back' : 'Cancel'}
              onCancel={() => (step > 1 ? go((step - 1) as Step) : form.dirty ? setGuard(true) : showToast('Back to the list', 'info'))}
              onSaveDraft={() => (autosave.saveNow(), showToast('Draft saved', 'success'))}
              markers={{ bar: marker(10), status: marker(11) }}
            />
          )
        }
      >
        <div className="relative">
          {marker(9)}
          <Stepper current={step} completed={completed} steps={STEPS} ariaLabel="Setup progress" />
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="sr-only">
          Step {step} of 4: {STEPS[step - 1].label}
        </h2>
        <form noValidate onSubmit={(e) => (e.preventDefault(), next())} className="space-y-6" aria-busy={busy || undefined}>
          {step === 1 && (
            <>
              <BasicSection form={form} p={P} marker={marker} title="Details" />
              <ContactSection form={form} p={P} />
            </>
          )}
          {step === 2 && <ClassificationSection form={form} p={P} />}
          {step === 3 && (
            <>
              <AdditionalSection form={form} p={P} announce={setLive} marker={marker} />
              {form.errors.contacts && (
                <p id={`${P}-contacts-add`} tabIndex={-1} className="text-[13px] font-medium text-[#0B2D6B] outline-none">
                  {form.errors.contacts}
                </p>
              )}
            </>
          )}
          {step === 4 && (
            <>
              {summary.map((s) => (
                <FormSection
                  key={s.step}
                  title={s.title}
                  action={
                    !readOnly && (
                      <button type="button" onClick={() => go(s.step)} className={BUTTON.ghostSm} aria-label={`Edit ${s.title.toLowerCase()}`}>
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                        Edit
                      </button>
                    )
                  }
                >
                  <dl className="grid grid-cols-1 @min-[640px]:grid-cols-2 gap-x-6 gap-y-4">
                    {s.rows.length ? s.rows.map(([k, val]) => <ReadOnlyValue key={k} label={k} value={val} mono={k === 'GSTIN'} />) : <ReadOnlyValue label="Contact persons" value="" />}
                  </dl>
                </FormSection>
              ))}
              {!readOnly && <ConsentCheckbox id={`${P}-consent`} checked={v.consent} onChange={(x) => (form.set('consent', x), form.touch('consent'))} error={form.errors.consent} readOnly={busy} />}
            </>
          )}
        </form>
      </FormLayout>
      <DiscardGuard open={guard} title="Discard this new entity?" onKeep={() => setGuard(false)} onDiscard={() => (setGuard(false), form.reset(emptyRecord()), setCompleted([]), go(1))} />
      <LiveRegion message={live} />
    </>
  );
};
