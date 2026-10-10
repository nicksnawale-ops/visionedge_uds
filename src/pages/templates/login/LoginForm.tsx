import React, { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, Check, Clock, Eye, EyeOff, Loader2, Lock, MailCheck, ShieldAlert } from 'lucide-react';
import {
  BTN,
  BTN_DISABLED,
  BTN_GHOST,
  BTN_LOADING,
  BTN_PRIMARY,
  BTN_SECONDARY,
  CriticalAlert,
  Field,
  ICON,
  InfoAlert,
  LINK,
  StatusIcon,
  demoLink,
} from '../shared/authUi';
import { OtpInput } from './OtpInput';
import {
  COPY,
  DEMO_CODE,
  DEMO_PASSWORD,
  LOCK_SECONDS,
  LoginStateId,
  MAX_ATTEMPTS,
  OTP_LENGTH,
  RESEND_SECONDS,
  SAMPLE_EMAIL,
  SIGN_IN_DELAY_MS,
  formatCountdown,
  formatLockCountdown,
  isValidEmail,
  maskEmail,
} from './loginStates';

/* ── State model ─────────────────────────────────────────────────── */

type Mode = 'signin' | 'forgot' | 'reset-sent' | 'two-step' | 'success';
type Banner = 'wrong' | 'locked' | 'expired' | null;

interface FieldErrors {
  email?: string;
  password?: string;
  code?: string;
}

interface FormState {
  mode: Mode;
  banner: Banner;
  email: string;
  password: string;
  code: string;
  remember: boolean;
  errors: FieldErrors;
  submitting: boolean;
  failedAttempts: number;
  lockRemaining: number;
  resendRemaining: number;
}

const EMPTY: FormState = {
  mode: 'signin',
  banner: null,
  email: '',
  password: '',
  code: '',
  remember: false,
  errors: {},
  submitting: false,
  failedAttempts: 0,
  lockRemaining: 0,
  resendRemaining: 0,
};

/** Snapshot shown when a state is picked from the outside (e.g. the reference page switcher). */
function presetFor(state: LoginStateId): FormState {
  switch (state) {
    case 'default':
      return EMPTY;
    case 'validation-error':
      return { ...EMPTY, email: 'nisha.rao@organization', errors: { email: COPY.errors.email, password: COPY.errors.password } };
    case 'wrong-credentials':
      return { ...EMPTY, email: SAMPLE_EMAIL, banner: 'wrong', failedAttempts: 3 };
    case 'signing-in':
      return { ...EMPTY, email: SAMPLE_EMAIL, password: DEMO_PASSWORD, submitting: true };
    case 'locked':
      return { ...EMPTY, email: SAMPLE_EMAIL, banner: 'locked', failedAttempts: MAX_ATTEMPTS, lockRemaining: LOCK_SECONDS - 1 };
    case 'forgot':
      return { ...EMPTY, mode: 'forgot' };
    case 'reset-sent':
      return { ...EMPTY, mode: 'reset-sent', email: SAMPLE_EMAIL, resendRemaining: RESEND_SECONDS };
    case 'two-step':
      return { ...EMPTY, mode: 'two-step', email: SAMPLE_EMAIL };
    case 'session-expired':
      return { ...EMPTY, email: SAMPLE_EMAIL, banner: 'expired' };
    case 'success':
      return { ...EMPTY, mode: 'success', email: SAMPLE_EMAIL };
  }
}

/** Which named state the form is currently showing. */
function stateIdOf(f: FormState): LoginStateId {
  if (f.mode !== 'signin') return f.mode;
  if (f.banner === 'locked') return 'locked';
  if (f.submitting) return 'signing-in';
  if (f.banner === 'wrong') return 'wrong-credentials';
  if (f.errors.email || f.errors.password) return 'validation-error';
  if (f.banner === 'expired') return 'session-expired';
  return 'default';
}

/* ── Form ────────────────────────────────────────────────────────── */

interface LoginFormProps {
  /** State to show. Changing it from outside resets the form to that state's snapshot. */
  state: LoginStateId;
  /** Called when the user's own actions move the form to another state. */
  onStateChange?: (state: LoginStateId) => void;
  /** Product name in the subtitle, e.g. "VisionEdge ANPR". */
  productName: string;
}

type FocusTarget = 'email' | 'password' | 'heading' | 'otp';

export const LoginForm: React.FC<LoginFormProps> = ({ state, onStateChange, productName }) => {
  const uid = useId();
  const ids = {
    email: `${uid}-email`,
    password: `${uid}-password`,
    remember: `${uid}-remember`,
    codeLabel: `${uid}-code-label`,
    codeError: `${uid}-code-error`,
  };

  const [f, setF] = useState<FormState>(() => presetFor(state));
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const otpRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const lastState = useRef<LoginStateId>(state);

  const update = (patch: Partial<FormState>) => setF((p) => ({ ...p, ...patch }));
  const afterDelay = (fn: () => void) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(fn, SIGN_IN_DELAY_MS);
  };

  // A state picked from outside resets the form to that snapshot.
  useEffect(() => {
    if (state === lastState.current) return;
    lastState.current = state;
    window.clearTimeout(timer.current);
    setF(presetFor(state));
    setShowPassword(false);
    setCapsLock(false);
  }, [state]);

  // Report state changes caused by the user's own actions.
  const current = stateIdOf(f);
  useEffect(() => {
    if (current === lastState.current) return;
    lastState.current = current;
    onStateChange?.(current);
  }, [current, onStateChange]);

  // Move focus only after in-app transitions, never on page load.
  useEffect(() => {
    if (!focusTarget) return;
    if (focusTarget === 'email') emailRef.current?.focus();
    if (focusTarget === 'password') passwordRef.current?.focus();
    if (focusTarget === 'heading') headingRef.current?.focus();
    if (focusTarget === 'otp') otpRef.current?.querySelector('input')?.focus();
    setFocusTarget(null);
  }, [focusTarget, f.mode]);

  // Lockout countdown.
  useEffect(() => {
    if (f.banner !== 'locked') return;
    const t = window.setInterval(
      () =>
        setF((p) => {
          if (p.banner !== 'locked') return p;
          if (p.lockRemaining <= 1) return { ...p, banner: null, lockRemaining: 0, failedAttempts: 0 };
          return { ...p, lockRemaining: p.lockRemaining - 1 };
        }),
      1000
    );
    return () => window.clearInterval(t);
  }, [f.banner]);

  // Resend countdown.
  const resendActive = f.mode === 'reset-sent' && f.resendRemaining > 0;
  useEffect(() => {
    if (!resendActive) return;
    const t = window.setInterval(
      () => setF((p) => ({ ...p, resendRemaining: Math.max(0, p.resendRemaining - 1) })),
      1000
    );
    return () => window.clearInterval(t);
  }, [resendActive]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  /* ── Actions ── */

  const submitSignIn = () => {
    if (f.submitting || f.banner === 'locked') return;
    const errors: FieldErrors = {};
    if (!isValidEmail(f.email)) errors.email = COPY.errors.email;
    if (!f.password) errors.password = COPY.errors.password;
    if (errors.email || errors.password) {
      update({ errors });
      setFocusTarget(errors.email ? 'email' : 'password');
      return;
    }

    const password = f.password;
    update({ errors: {}, submitting: true, banner: null });
    afterDelay(() => {
      if (password === DEMO_PASSWORD) {
        setF((p) => ({ ...p, mode: 'two-step', submitting: false, password: '', code: '', failedAttempts: 0, errors: {} }));
        setFocusTarget('otp');
        return;
      }
      setF((p) => {
        const failedAttempts = p.failedAttempts + 1;
        return failedAttempts >= MAX_ATTEMPTS
          ? { ...p, submitting: false, password: '', failedAttempts, banner: 'locked', lockRemaining: LOCK_SECONDS }
          : { ...p, submitting: false, password: '', failedAttempts, banner: 'wrong' };
      });
      setFocusTarget('password');
    });
  };

  const submitForgot = () => {
    if (f.submitting) return;
    if (!isValidEmail(f.email)) {
      update({ errors: { email: COPY.errors.email } });
      setFocusTarget('email');
      return;
    }
    update({ errors: {}, submitting: true });
    afterDelay(() => {
      setF((p) => ({ ...p, mode: 'reset-sent', submitting: false, resendRemaining: RESEND_SECONDS }));
      setFocusTarget('heading');
    });
  };

  const submitCode = () => {
    if (f.submitting) return;
    if (f.code.length < OTP_LENGTH) {
      update({ errors: { code: COPY.errors.code } });
      setFocusTarget('otp');
      return;
    }
    const code = f.code;
    update({ errors: {}, submitting: true });
    afterDelay(() => {
      if (code === DEMO_CODE) {
        setF((p) => ({ ...p, mode: 'success', submitting: false }));
        setFocusTarget('heading');
      } else {
        setF((p) => ({ ...p, submitting: false, code: '', errors: { code: COPY.errors.wrongCode } }));
        setFocusTarget('otp');
      }
    });
  };

  const goTo = (mode: Mode) => {
    window.clearTimeout(timer.current);
    setF((p) => ({ ...EMPTY, mode, email: isValidEmail(p.email) ? p.email : '' }));
    setShowPassword(false);
    setFocusTarget('heading');
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.mode === 'signin') submitSignIn();
    else if (f.mode === 'forgot') submitForgot();
    else if (f.mode === 'two-step') submitCode();
  };

  const onEmailChange = (value: string) =>
    setF((p) => ({
      ...p,
      email: value,
      // Clear the error as soon as the value becomes valid.
      errors: { ...p.errors, email: p.errors.email && !isValidEmail(value) ? p.errors.email : undefined },
    }));

  const onEmailBlur = () => {
    if (f.email && !isValidEmail(f.email)) update({ errors: { ...f.errors, email: COPY.errors.email } });
  };

  const trackCapsLock = (e: React.KeyboardEvent) => setCapsLock(e.getModifierState('CapsLock'));

  /* ── Views ── */

  const locked = f.banner === 'locked';
  const busy = f.submitting;

  const heading = (title: string, subtitle: React.ReactNode) => (
    <div className="mb-6">
      <h1 ref={headingRef} tabIndex={-1} className="text-[24px] leading-[32px] font-semibold text-[#121722] outline-none">
        {title}
      </h1>
      <p className="mt-1 text-[14px] leading-[20px] text-[#4B5465]">{subtitle}</p>
    </div>
  );

  const backButton = (
    <button type="button" onClick={() => goTo('signin')} className={`${BTN} ${BTN_GHOST} mt-3`}>
      <ArrowLeft className={ICON} aria-hidden="true" />
      {COPY.forgot.back}
    </button>
  );

  const spinner = <Loader2 className={`${ICON} motion-safe:animate-spin`} aria-hidden="true" />;

  const emailField = (
    <Field
      id={ids.email}
      label={COPY.signIn.emailLabel}
      inputRef={emailRef}
      type="email"
      name="email"
      autoComplete="username"
      inputMode="email"
      spellCheck={false}
      placeholder={COPY.signIn.emailPlaceholder}
      value={f.email}
      error={f.errors.email}
      disabled={locked}
      readOnly={busy}
      onChange={(e) => onEmailChange(e.target.value)}
      onBlur={onEmailBlur}
    />
  );

  if (f.mode === 'success') {
    return (
      <div aria-live="polite">
        <StatusIcon icon={Check} />
        {heading(
          COPY.success.title,
          <span className="inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 motion-safe:animate-spin text-[#1E63FF]" aria-hidden="true" />
            {COPY.success.text}
          </span>
        )}
      </div>
    );
  }

  if (f.mode === 'reset-sent') {
    const canResend = f.resendRemaining === 0;
    return (
      <div>
        <StatusIcon icon={MailCheck} />
        {heading(COPY.resetSent.title, COPY.resetSent.text(maskEmail(f.email || SAMPLE_EMAIL)))}
        <button
          type="button"
          disabled={!canResend}
          onClick={() => update({ resendRemaining: RESEND_SECONDS })}
          className={`${BTN} ${canResend ? BTN_SECONDARY : BTN_DISABLED}`}
        >
          {COPY.resetSent.resend}
        </button>
        {!canResend && (
          <p className="mt-2 text-center text-[12px] leading-[16px] text-[#4B5465]" aria-live="off">
            {COPY.resetSent.resendIn(formatCountdown(f.resendRemaining))}
          </p>
        )}
        {backButton}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit}>
      {f.mode === 'forgot' && (
        <>
          {heading(COPY.forgot.title, COPY.forgot.subtitle)}
          {emailField}
          <button type="submit" disabled={busy} className={`${BTN} mt-6 ${busy ? BTN_LOADING : BTN_PRIMARY}`}>
            {busy ? (
              <>
                {spinner}
                Sending…
              </>
            ) : (
              COPY.forgot.submit
            )}
          </button>
          {backButton}
        </>
      )}

      {f.mode === 'two-step' && (
        <>
          {heading(COPY.twoStep.title, COPY.twoStep.subtitle)}
          <p id={ids.codeLabel} className="mb-1.5 text-[14px] leading-[20px] font-medium text-[#121722]">
            {COPY.twoStep.codeLabel}
          </p>
          <div ref={otpRef}>
            <OtpInput
              value={f.code}
              onChange={(code) => setF((p) => ({ ...p, code, errors: {} }))}
              length={OTP_LENGTH}
              labelledBy={ids.codeLabel}
              describedBy={ids.codeError}
              invalid={Boolean(f.errors.code)}
              readOnly={busy}
            />
          </div>
          <div id={ids.codeError} aria-live="polite">
            {f.errors.code && (
              <p className="mt-1.5 flex items-start gap-1.5 text-[12px] leading-[16px] font-medium text-[#0B2D6B]">
                <AlertCircle className="w-3.5 h-3.5 mt-px shrink-0" aria-hidden="true" />
                {f.errors.code}
              </p>
            )}
          </div>
          <button type="submit" disabled={busy} className={`${BTN} mt-6 ${busy ? BTN_LOADING : BTN_PRIMARY}`}>
            {busy ? (
              <>
                {spinner}
                Verifying…
              </>
            ) : (
              COPY.twoStep.submit
            )}
          </button>
          <div className="mt-1 text-center">
            <a href="#backup-code" onClick={demoLink} className={LINK}>
              {COPY.twoStep.backup}
            </a>
          </div>
          {backButton}
        </>
      )}

      {f.mode === 'signin' && (
        <>
          {heading(COPY.signIn.title, COPY.signIn.subtitle(productName))}

          {/* Alerts: inside the card, between the subtitle and the first field */}
          <div aria-live="polite">
            {f.banner === 'expired' && (
              <div className="mb-4">
                <InfoAlert icon={Clock}>{COPY.sessionExpired}</InfoAlert>
              </div>
            )}
            {f.banner === 'wrong' && (
              <div className="mb-4">
                <CriticalAlert icon={ShieldAlert}>{COPY.wrongCredentials(MAX_ATTEMPTS - f.failedAttempts)}</CriticalAlert>
              </div>
            )}
            {locked && (
              <div className="mb-4">
                <InfoAlert icon={Lock}>
                  <p>{COPY.locked.message}</p>
                  <p className="mt-1">
                    {COPY.locked.countdownLabel}{' '}
                    <span role="timer" aria-live="off" className="font-mono font-medium tabular-nums">
                      {formatLockCountdown(f.lockRemaining)}
                    </span>
                    {' · '}
                    <a
                      href="#contact-admin"
                      onClick={demoLink}
                      className="font-medium text-[#1E63FF] rounded-[2px] hover:underline hover:text-[#0B2D6B] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
                    >
                      {COPY.locked.link}
                    </a>
                  </p>
                </InfoAlert>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {emailField}
            <Field
              id={ids.password}
              label={COPY.signIn.passwordLabel}
              inputRef={passwordRef}
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              value={f.password}
              error={f.errors.password}
              disabled={locked}
              readOnly={busy}
              onChange={(e) =>
                setF((p) => ({
                  ...p,
                  password: e.target.value,
                  errors: { ...p.errors, password: e.target.value ? undefined : p.errors.password },
                }))
              }
              onKeyDown={trackCapsLock}
              onKeyUp={trackCapsLock}
              onBlur={() => setCapsLock(false)}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  disabled={locked}
                  aria-label={showPassword ? COPY.signIn.hidePassword : COPY.signIn.showPassword}
                  className="absolute right-0.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-[6px] flex items-center justify-center text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] disabled:text-[#8C95A6] disabled:hover:bg-transparent disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className={ICON} aria-hidden="true" /> : <Eye className={ICON} aria-hidden="true" />}
                </button>
              }
              hint={
                capsLock && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-[12px] leading-[16px] text-[#4B5465]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    {COPY.signIn.capsLock}
                  </p>
                )
              }
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4">
            <label
              htmlFor={ids.remember}
              className="inline-flex items-center gap-2 min-h-[44px] text-[14px] leading-[20px] text-[#353D4C] cursor-pointer"
            >
              <input
                id={ids.remember}
                type="checkbox"
                name="remember"
                checked={f.remember}
                disabled={locked || busy}
                onChange={(e) => update({ remember: e.target.checked })}
                className="w-4 h-4 rounded-[4px] border border-[#8C95A6] accent-[#1E63FF] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2 disabled:cursor-not-allowed"
              />
              {COPY.signIn.remember}
            </label>
            <button type="button" onClick={() => goTo('forgot')} className={LINK}>
              {COPY.signIn.forgot}
            </button>
          </div>

          <button
            type="submit"
            disabled={busy || locked}
            className={`${BTN} mt-4 ${busy ? BTN_LOADING : locked ? BTN_DISABLED : BTN_PRIMARY}`}
          >
            {busy ? (
              <>
                {spinner}
                {COPY.signIn.submitting}
              </>
            ) : (
              COPY.signIn.submit
            )}
          </button>

          <p className="mt-6 text-center text-[12px] leading-[16px] text-[#4B5465]">{COPY.signIn.accessNote}</p>
        </>
      )}
    </form>
  );
};
