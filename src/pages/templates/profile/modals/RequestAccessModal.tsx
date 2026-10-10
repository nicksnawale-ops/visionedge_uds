import React, { useId, useRef, useState } from 'react';
import { FieldErrorText, LABEL } from '../../shared/authUi';
import { BUTTON, Modal, Spinner } from '../ui';

interface RequestAccessModalProps {
  /** Who receives the request. */
  approver: string;
  onSent: () => void;
  onClose: () => void;
}

const MIN_LENGTH = 15;

/** Reason textarea → "Send request". The administrator reviews it; nothing changes until they do. */
export const RequestAccessModal: React.FC<RequestAccessModalProps> = ({ approver, onSent, onClose }) => {
  const uid = useId();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const send = () => {
    if (busy) return;
    if (reason.trim().length < MIN_LENGTH) {
      setError('Tell your administrator what you need and why, in a sentence or two');
      ref.current?.focus();
      return;
    }
    setBusy(true);
    timer.current = window.setTimeout(onSent, 800);
  };

  return (
    <Modal
      title="Request access change"
      description={`${approver} reviews requests, usually within 1 business day.`}
      onClose={() => {
        window.clearTimeout(timer.current);
        onClose();
      }}
      footer={
        <>
          <button type="button" onClick={onClose} disabled={busy} className={BUTTON.secondary}>
            Cancel
          </button>
          <button type="button" onClick={send} aria-disabled={busy || undefined} className={`${BUTTON.primary} min-w-[140px]`}>
            {busy ? (
              <>
                <Spinner />
                Sending…
              </>
            ) : (
              'Send request'
            )}
          </button>
        </>
      }
    >
      <label htmlFor={`${uid}-reason`} className={LABEL}>
        What do you need, and why?
      </label>
      <textarea
        id={`${uid}-reason`}
        ref={ref}
        rows={4}
        value={reason}
        readOnly={busy}
        placeholder="e.g. Read-only access to Meal Pulse to check canteen queues during events."
        aria-invalid={error ? true : undefined}
        aria-describedby={`${uid}-hint ${uid}-error`}
        onChange={(e) => {
          setReason(e.target.value);
          setError('');
        }}
        className={`w-full px-3 py-2.5 rounded-[8px] bg-white text-[16px] @min-[640px]:text-[14px] leading-[20px] text-[#121722] placeholder:text-[#6B7485] resize-y outline-none focus:ring-[3px] focus:ring-[#1E63FF]/20 ${
          error ? 'border-2 border-[#0B2D6B]' : 'border border-[#8C95A6] focus:border-[#1E63FF]'
        }`}
      />
      <p id={`${uid}-hint`} className="mt-1.5 text-[12px] leading-[16px] text-[#4B5465]">
        Name the module, the site and the access level you need.
      </p>
      <div id={`${uid}-error`} aria-live="polite">
        {error && <FieldErrorText>{error}</FieldErrorText>}
      </div>
    </Modal>
  );
};
