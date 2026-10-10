import React, { useId, useMemo, useRef, useState } from 'react';
import { Field } from '../../shared/authUi';
import { PasswordStrength } from '../../register/PasswordStrength';
import { evaluatePassword } from '../../register/registerStates';
import { BUTTON, Modal, Spinner } from '../ui';

interface ChangePasswordModalProps {
  fullName: string;
  email: string;
  onUpdated: () => void;
  onClose: () => void;
}

type Key = 'current' | 'next' | 'confirm';

/** 480px: current password, new password with the Register strength meter and checklist, confirmation. */
export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ fullName, email, onUpdated, onClose }) => {
  const uid = useId();
  const strengthId = `${uid}-strength`;
  const [values, setValues] = useState<Record<Key, string>>({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [busy, setBusy] = useState(false);
  const refs = { current: useRef<HTMLInputElement>(null), next: useRef<HTMLInputElement>(null), confirm: useRef<HTMLInputElement>(null) };
  const timer = useRef<number | undefined>(undefined);
  const strength = useMemo(() => evaluatePassword(values.next, fullName, email), [values.next, fullName, email]);

  const check = (key: Key, v = values): string | undefined => {
    if (key === 'current') return v.current ? undefined : 'Enter your current password';
    if (key === 'next') {
      if (!strength.allMet && v.next) return 'Choose a password that meets every requirement';
      if (!v.next) return 'Enter a new password';
      if (v.next === v.current) return 'Choose a password you haven’t used here before';
      return undefined;
    }
    return v.confirm === v.next ? undefined : "Passwords don't match";
  };

  const set = (key: Key, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = () => {
    if (busy) return;
    const next: Partial<Record<Key, string>> = { current: check('current'), next: check('next'), confirm: check('confirm') };
    setErrors(next);
    const first = (['current', 'next', 'confirm'] as Key[]).find((k) => next[k]);
    if (first) return refs[first].current?.focus();
    setBusy(true);
    timer.current = window.setTimeout(onUpdated, 1000);
  };

  return (
    <Modal
      title="Change password"
      description="You'll stay signed in here. Other devices will be signed out."
      onClose={() => {
        window.clearTimeout(timer.current);
        onClose();
      }}
      footer={
        <>
          <button type="button" onClick={onClose} disabled={busy} className={BUTTON.secondary}>
            Cancel
          </button>
          <button type="button" onClick={submit} aria-disabled={busy || undefined} className={`${BUTTON.primary} min-w-[164px]`}>
            {busy ? (
              <>
                <Spinner />
                Updating…
              </>
            ) : (
              'Update password'
            )}
          </button>
        </>
      }
    >
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Field
          id={`${uid}-current`}
          label="Current password"
          type="password"
          autoComplete="current-password"
          value={values.current}
          inputRef={refs.current}
          readOnly={busy}
          error={errors.current}
          onChange={(e) => set('current', e.target.value)}
        />
        <div>
          <Field
            id={`${uid}-next`}
            label="New password"
            type="password"
            autoComplete="new-password"
            value={values.next}
            inputRef={refs.next}
            readOnly={busy}
            error={errors.next}
            describedByExtra={strengthId}
            onChange={(e) => set('next', e.target.value)}
            onBlur={() => values.next && setErrors((e) => ({ ...e, next: check('next') }))}
          />
          <PasswordStrength id={strengthId} result={strength} />
        </div>
        <Field
          id={`${uid}-confirm`}
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={values.confirm}
          inputRef={refs.confirm}
          readOnly={busy}
          error={errors.confirm}
          onChange={(e) => set('confirm', e.target.value)}
          onBlur={() => values.confirm && setErrors((e) => ({ ...e, confirm: check('confirm') }))}
        />
        <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
      </form>
    </Modal>
  );
};
