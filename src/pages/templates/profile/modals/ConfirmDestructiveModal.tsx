import React, { useId, useRef, useState } from 'react';
import { Field } from '../../shared/authUi';
import { BUTTON, Modal } from '../ui';

interface ConfirmDestructiveModalProps {
  title: string;
  /** What happens, in plain words. */
  body: React.ReactNode;
  /** Repeats the action, e.g. "Suspend user" (never "Yes"). */
  confirmLabel: string;
  /** Secondary label, e.g. "Keep editing". Default "Cancel". */
  cancelLabel?: string;
  /** The admin types this (the user's email) to confirm. */
  confirmText?: string;
  /** Destructive (Gray 900) by default; Primary for safe confirmations such as a reset email. */
  tone?: 'destructive' | 'primary';
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Confirmation for destructive actions: the button repeats the action and, for account-level actions,
 * the admin types the user's email first. Focus starts on the safe choice.
 */
export const ConfirmDestructiveModal: React.FC<ConfirmDestructiveModalProps> = ({
  title,
  body,
  confirmLabel,
  cancelLabel = 'Cancel',
  confirmText,
  tone = 'destructive',
  onConfirm,
  onClose,
}) => {
  const uid = useId();
  const [typed, setTyped] = useState('');
  const [error, setError] = useState('');
  const cancelRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = !confirmText || typed.trim().toLowerCase() === confirmText.toLowerCase();

  const confirm = () => {
    if (!matches) {
      setError(typed ? `That doesn't match. Type ${confirmText} exactly.` : `Type ${confirmText} to confirm`);
      inputRef.current?.focus();
      return;
    }
    onConfirm();
  };

  return (
    <Modal
      title={title}
      role="alertdialog"
      onClose={onClose}
      initialFocus={confirmText ? inputRef : cancelRef}
      footer={
        <>
          <button ref={cancelRef} type="button" onClick={onClose} className={BUTTON.secondary}>
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={confirm}
            aria-disabled={!matches || undefined}
            className={`${tone === 'destructive' ? BUTTON.destructive : BUTTON.primary} ${!matches ? 'opacity-50' : ''}`}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="space-y-4 text-[14px] leading-[20px] text-[#353D4C]">
        <div>{body}</div>
        {confirmText && (
          <Field
            id={`${uid}-confirm`}
            label={`Type ${confirmText} to confirm`}
            autoComplete="off"
            spellCheck={false}
            value={typed}
            inputRef={inputRef}
            error={error}
            onChange={(e) => {
              setTyped(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && confirm()}
          />
        )}
      </div>
    </Modal>
  );
};
