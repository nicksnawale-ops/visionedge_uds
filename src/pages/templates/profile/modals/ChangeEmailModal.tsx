import React, { useId, useRef, useState } from 'react';
import { Field, FieldErrorText } from '../../shared/authUi';
import { OtpInput } from '../../login/OtpInput';
import { isPersonalEmail, isValidEmail } from '../../register/registerStates';
import { DEMO_CODE } from '../profileStates';
import { BUTTON, Modal, Spinner } from '../ui';

const PLACEHOLDER = 'name@pit.edu.in';

interface ChangeEmailModalProps {
  currentEmail: string;
  /** Open on the code step for an address already waiting for verification. */
  pendingEmail: string | null;
  startOnCode: boolean;
  /** Code sent: the new address is pending until verified. */
  onPending: (email: string) => void;
  onVerified: (email: string) => void;
  onClose: () => void;
}

/** New email + current password → "We sent a verification code" → 6-digit code → done (or pending if closed). */
export const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({ currentEmail, pendingEmail, startOnCode, onPending, onVerified, onClose }) => {
  const uid = useId();
  const codeLabelId = `${uid}-code-label`;
  const codeErrorId = `${uid}-code-error`;
  const [step, setStep] = useState<'form' | 'code'>(startOnCode && pendingEmail ? 'code' : 'form');
  const [email, setEmail] = useState(pendingEmail ?? '');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; code?: string }>({});
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const validateEmail = (value: string): string | undefined => {
    if (!isValidEmail(value)) return 'Enter a valid work email, like name@pit.edu.in';
    if (isPersonalEmail(value)) return "Use your work email. Personal addresses can't be used for VisionEdge accounts.";
    if (value.trim().toLowerCase() === currentEmail) return 'This is already your email. Enter a new one.';
    return undefined;
  };

  const sendCode = () => {
    const next = { email: validateEmail(email), password: password ? undefined : 'Enter your current password' };
    setErrors(next);
    if (next.email) return emailRef.current?.focus();
    if (next.password) return passwordRef.current?.focus();
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      onPending(email.trim());
      setStep('code');
    }, 800);
  };

  const verify = () => {
    if (code.length < 6) return setErrors({ code: 'Enter all 6 digits of your code' });
    if (code !== DEMO_CODE) return setErrors({ code: "That code didn't work. Check your email and try again." });
    window.clearTimeout(timer.current);
    onVerified(email.trim());
  };

  return (
    <Modal
      title={step === 'form' ? 'Change email' : 'Check your new inbox'}
      description={
        step === 'form' ? (
          'Your current email stays active until you verify the new one.'
        ) : (
          <>
            We sent a verification code to the new address, <strong className="font-semibold text-[#121722]">{email}</strong>.
          </>
        )
      }
      onClose={() => {
        window.clearTimeout(timer.current);
        onClose();
      }}
      footer={
        step === 'form' ? (
          <>
            <button type="button" onClick={onClose} className={BUTTON.secondary}>
              Cancel
            </button>
            <button type="button" onClick={sendCode} aria-disabled={busy || undefined} className={`${BUTTON.primary} min-w-[132px]`}>
              {busy ? (
                <>
                  <Spinner />
                  Sending…
                </>
              ) : (
                'Send code'
              )}
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onClose} className={BUTTON.secondary}>
              Verify later
            </button>
            <button type="button" onClick={verify} className={BUTTON.primary}>
              Verify email
            </button>
          </>
        )
      }
    >
      {step === 'form' ? (
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            sendCode();
          }}
        >
          <Field
            id={`${uid}-email`}
            label="New work email"
            type="email"
            autoComplete="email"
            placeholder={PLACEHOLDER}
            value={email}
            inputRef={emailRef}
            readOnly={busy}
            error={errors.email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setErrors((er) => ({ ...er, email: email ? validateEmail(email) : er.email }))}
          />
          <Field
            id={`${uid}-password`}
            label="Current password"
            type="password"
            autoComplete="current-password"
            value={password}
            inputRef={passwordRef}
            readOnly={busy}
            error={errors.password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
        </form>
      ) : (
        <div>
          <span id={codeLabelId} className="block mb-1.5 text-[14px] leading-[20px] font-medium text-[#121722]">
            Verification code
          </span>
          <OtpInput value={code} onChange={(v) => {
            setCode(v);
            setErrors({});
          }} labelledBy={codeLabelId} describedBy={codeErrorId} invalid={Boolean(errors.code)} autoFocus />
          <div id={codeErrorId} aria-live="polite">
            {errors.code && <FieldErrorText>{errors.code}</FieldErrorText>}
          </div>
          <p className="mt-3 text-[12px] leading-[16px] text-[#6B7485]">Demo: use code {DEMO_CODE}. The code expires in 10 minutes.</p>
        </div>
      )}
    </Modal>
  );
};
