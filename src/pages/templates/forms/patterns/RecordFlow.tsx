/**
 * Create-record flow shared by the patterns: state set-up, submit (with error summary and duplicate
 * check), autosave, the unsaved-changes guard, server error and the success screen.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Info, ShieldAlert } from 'lucide-react';
import { useToast } from '../../../../components/common/Toast';
import { CriticalAlert, InfoAlert, StatusIcon } from '../../shared/authUi';
import { ConfirmDestructiveModal } from '../../profile/modals/ConfirmDestructiveModal';
import { BUTTON } from '../../profile/ui';
import type { FormStateId } from '../formStates';
import { SUBMIT_DELAY_MS } from '../formStates';
import { RecordData, REFERENCE_ID, emptyRecord, fullRecord, invalidRecord, partialRecord } from '../data/sampleRecord';
import { FormState, useFormState } from '../foundations/useFormState';
import { Autosave, useAutosave } from '../foundations/useAutosave';
import { RecordScope, validateRecord } from '../foundations/validators';

/** Initial values for a state. */
export const initialRecord = (state: FormStateId): RecordData =>
  state === 'empty' ? emptyRecord() : state === 'errors' ? invalidRecord() : state === 'submitting' || state === 'server-error' || state === 'read-only' ? fullRecord() : state === 'duplicate' ? { ...partialRecord(), name: 'Sharma Logistics' } : partialRecord();

export interface RecordFlow {
  form: FormState<RecordData>;
  autosave: Autosave;
  busy: boolean;
  done: boolean;
  serverError: boolean;
  duplicate: boolean;
  readOnly: boolean;
  setReadOnly: (v: boolean) => void;
  attempt: number;
  errorKeys: string[];
  submit: () => void;
  cancel: () => void;
  saveDraft: () => void;
  restart: () => void;
  guardOpen: boolean;
  setGuardOpen: (v: boolean) => void;
  announce: (m: string) => void;
  live: string;
  /** "Continue anyway" on the duplicate warning. */
  continueDuplicate: () => void;
  dismissDuplicate: () => void;
}

export function useRecordFlow(state: FormStateId, scopes: RecordScope[], opts: { baseline?: RecordData; onCreated?: (d: RecordData) => void; initial?: RecordData } = {}): RecordFlow {
  const { showToast } = useToast();
  const validate = useCallback((d: RecordData) => validateRecord(d, scopes), [scopes.join()]); // scopes are static per pattern
  const form = useFormState<RecordData>(opts.initial ?? initialRecord(state), validate, {
    baseline: opts.baseline ?? emptyRecord(),
    submitted: state === 'errors',
  });
  const [busy, setBusy] = useState(state === 'submitting');
  const [done, setDone] = useState(state === 'success');
  const [serverError, setServerError] = useState(state === 'server-error');
  const [duplicate, setDuplicate] = useState(state === 'duplicate');
  const [dupAccepted, setDupAccepted] = useState(false);
  const [readOnly, setReadOnly] = useState(state === 'read-only');
  const [guardOpen, setGuardOpen] = useState(state === 'guard');
  const [attempt, setAttempt] = useState(0);
  const [live, setLive] = useState('');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const announce = useCallback((m: string) => setLive(m), []);

  const autosave = useAutosave(JSON.stringify(form.values), form.dirty && !busy && !done && !readOnly, () => announce('Draft saved'), state === 'draft' ? { minutesAgo: 2 } : undefined);

  useEffect(() => {
    if (state === 'draft') showToast('Draft saved', 'success');
  }, []); // Once, when the Draft saved state opens.

  const errorKeys = form.submitted ? Object.keys(form.allErrors) : [];

  /** Validate; returns true when the form can be created. */
  const check = (): boolean => {
    const keys = form.submitAttempt();
    if (!keys.length) return true;
    setAttempt((a) => a + 1);
    announce(`Fix ${keys.length} ${keys.length === 1 ? 'field' : 'fields'} to continue`);
    return false;
  };

  const submit = () => {
    if (busy || !check()) return;
    // Demo duplicate check: an existing record has this exact name.
    if (!dupAccepted && form.values.name.trim().toLowerCase() === 'sharma logistics') {
      setDuplicate(true);
      announce('A similar record already exists.');
      return;
    }
    create();
  };

  const create = () => {
    setServerError(false);
    setBusy(true);
    announce('Creating record');
    timer.current = window.setTimeout(() => {
      setBusy(false);
      setDone(true);
      opts.onCreated?.(form.values);
      showToast('Record created', 'success');
      announce(`${REFERENCE_ID} was created successfully.`);
    }, SUBMIT_DELAY_MS);
  };

  return {
    form,
    autosave,
    busy,
    done,
    serverError,
    duplicate,
    readOnly,
    setReadOnly,
    attempt,
    errorKeys,
    submit,
    cancel: () => (form.dirty ? setGuardOpen(true) : showToast('Back to the list', 'info')),
    saveDraft: () => {
      autosave.saveNow();
      showToast('Draft saved', 'success');
    },
    restart: () => {
      form.reset(emptyRecord());
      setDone(false);
      setDuplicate(false);
      setDupAccepted(false);
      setServerError(false);
      setAttempt(0);
    },
    guardOpen,
    setGuardOpen,
    announce,
    live,
    continueDuplicate: () => {
      setDuplicate(false);
      setDupAccepted(true);
      if (!busy && check()) create();
    },
    dismissDuplicate: () => setDuplicate(false),
  };
}

/** Duplicate and server-error alerts above the form. */
export const FlowAlerts: React.FC<{
  flow: Pick<RecordFlow, 'duplicate' | 'serverError' | 'continueDuplicate' | 'dismissDuplicate' | 'submit'>;
  serverMessage?: string;
  duplicateName?: string;
}> = ({ flow, serverMessage = "We couldn't create the record. Your data is safe — try again.", duplicateName = 'Sharma Logistics' }) => (
  <>
    {flow.duplicate && (
      <div role="status">
        <InfoAlert icon={Info}>
          <p>
            A similar record already exists: ‘{duplicateName}’ (<span className="font-mono">REC-2026-0098</span>).
          </p>
          <p className="mt-2 flex flex-wrap gap-x-4">
            <a href="#existing" onClick={(e) => e.preventDefault()} className="font-medium text-[#1E63FF] underline underline-offset-2 rounded-[2px] min-h-[44px] inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]">
              View existing
            </a>
            <button type="button" onClick={flow.continueDuplicate} className="font-medium text-[#1E63FF] underline underline-offset-2 rounded-[2px] min-h-[44px] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]">
              Continue anyway
            </button>
            <button type="button" onClick={flow.dismissDuplicate} className="sr-only focus:not-sr-only text-[#1E63FF]">
              Dismiss
            </button>
          </p>
        </InfoAlert>
      </div>
    )}
    {flow.serverError && (
      <div role="alert">
        <CriticalAlert icon={ShieldAlert}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>{serverMessage}</p>
            <button type="button" onClick={flow.submit} className={BUTTON.onDark}>
              Try again
            </button>
          </div>
        </CriticalAlert>
      </div>
    )}
  </>
);

/** Success: 56px Cyan 16% circle with a Deep Navy check, H2, text and three actions. */
export const SuccessCard: React.FC<{ title?: string; text?: string; onAnother: () => void; anotherLabel?: string }> = ({
  title = 'Record created',
  text = `${REFERENCE_ID} was created successfully.`,
  onAnother,
  anotherLabel = 'Create another',
}) => {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus({ preventScroll: true }), []);
  return (
    <div className="min-h-full flex items-center justify-center p-4 @min-[768px]:p-8">
      <div className="w-full max-w-[480px] bg-white rounded-[12px] border border-[#DDE2EA] shadow-[0_1px_3px_rgba(11,45,107,0.08)] p-8 text-center flex flex-col items-center">
        <StatusIcon icon={CheckCircle2} tone="cyan" />
        <h2 ref={ref} tabIndex={-1} className="text-[20px] leading-[28px] font-semibold text-[#121722] outline-none">
          {title}
        </h2>
        <p className="mt-2 text-[14px] leading-[20px] text-[#4B5465]">{text}</p>
        <div className="mt-6 w-full flex flex-col @min-[480px]:flex-row @min-[480px]:justify-center gap-2 [&>*]:w-full @min-[480px]:[&>*]:w-auto">
          <a href="#record" onClick={(e) => e.preventDefault()} className={BUTTON.primary}>
            View record
          </a>
          <button type="button" onClick={onAnother} className={BUTTON.secondary}>
            {anotherLabel}
          </button>
          <a href="#list" onClick={(e) => e.preventDefault()} className={BUTTON.ghost}>
            Back to list
          </a>
        </div>
      </div>
    </div>
  );
};

/** "Discard this new record?" guard (the Profile confirmation modal). */
export const DiscardGuard: React.FC<{ open: boolean; title?: string; onKeep: () => void; onDiscard: () => void }> = ({ open, title = 'Discard this new record?', onKeep, onDiscard }) =>
  open ? (
    <ConfirmDestructiveModal
      title={title}
      body="Your changes haven't been saved. If you leave now, they'll be lost."
      cancelLabel="Keep editing"
      confirmLabel="Discard"
      onClose={onKeep}
      onConfirm={onDiscard}
    />
  ) : null;

/** Screen-reader announcements for a flow. */
export const LiveRegion: React.FC<{ message: string }> = ({ message }) => (
  <div className="sr-only" aria-live="polite">
    {message}
  </div>
);
