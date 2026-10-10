import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, Clock, Info, Loader2, MailCheck, ShieldCheck } from 'lucide-react';
import {
  BTN,
  BTN_GHOST,
  BTN_LOADING,
  BTN_PRIMARY,
  BTN_SECONDARY,
  FieldErrorText,
  ICON,
  INLINE_LINK,
  InfoAlert,
  LINK,
  StatusIcon,
  demoLink,
} from '../shared/authUi';
import { LoginCard } from '../login/LoginCard';
import { OtpInput } from '../login/OtpInput';
import { LOGIN_PREVIEW_PATH } from '../login/paths';
import type { BackgroundStyle, UseCaseConfig } from '../login/backgrounds';
import { Stepper } from './Stepper';
import { AccountStep } from './steps/AccountStep';
import { OrganizationStep } from './steps/OrganizationStep';
import { SecurityStep } from './steps/SecurityStep';
import {
  COPY,
  CREATE_DELAY_MS,
  DEMO_CODE,
  FieldErrors,
  FieldKey,
  INVITE,
  OTP_LENGTH,
  RESEND_SECONDS,
  ROLES,
  RegisterData,
  RegisterStateId,
  SITES,
  STEP_FIELDS,
  StepNumber,
  TAKEN_EMAIL,
  evaluatePassword,
  formatCountdown,
  isPersonalEmail,
  isValidEmail,
  maskEmail,
  optionLabel,
} from './registerStates';

/* ── State model ─────────────────────────────────────────────────── */

type View = 'form' | 'verify' | 'pending' | 'expired';
type Banner = 'personal' | 'taken' | null;

interface FlowState {
  view: View;
  step: StepNumber;
  data: RegisterData;
  errors: FieldErrors;
  banner: Banner;
  /** Opened from an invitation: steps 1–2 done, fields locked. */
  invite: boolean;
  submitting: boolean;
  code: string;
  codeError?: string;
  resendRemaining: number;
}

const EMPTY_DATA: RegisterData = {
  fullName: '',
  email: '',
  phone: '',
  organization: '',
  site: '',
  role: '',
  department: '',
  password: '',
  confirm: '',
  terms: false,
  updates: false,
};

/** Example applicant used to prefill states. Fictional. */
const SAMPLE: RegisterData = {
  ...EMPTY_DATA,
  fullName: 'Priya Sharma',
  email: 'priya.sharma@organization.com',
  phone: '9876543210',
  organization: 'Pune Institute of Technology',
  site: 'main',
  role: 'security',
};

const STRONG_PASSWORD = 'Gate-Watch#2026';

const EMPTY: FlowState = {
  view: 'form',
  step: 1,
  data: EMPTY_DATA,
  errors: {},
  banner: null,
  invite: false,
  submitting: false,
  code: '',
  resendRemaining: 0,
};

/** Snapshot shown when a state is picked from the outside (reference page switcher, ?state=). */
function presetFor(state: RegisterStateId): FlowState {
  switch (state) {
    case 'step-account':
      return EMPTY;
    case 'step-organization':
      return { ...EMPTY, step: 2, data: { ...EMPTY_DATA, fullName: SAMPLE.fullName, email: SAMPLE.email, phone: SAMPLE.phone } };
    case 'step-security':
      // "Fair": 3 of 5 requirements met (length, number, no personal info).
      return { ...EMPTY, step: 3, data: { ...SAMPLE, password: 'visionedge24' } };
    case 'validation-error':
      return {
        ...EMPTY,
        data: { ...EMPTY_DATA, email: 'priya.sharma@', phone: '98765' },
        errors: { fullName: COPY.errors.fullName, email: COPY.errors.email, phone: COPY.errors.phone },
      };
    case 'personal-email':
      return { ...EMPTY, data: { ...EMPTY_DATA, fullName: SAMPLE.fullName, email: 'priya.sharma@gmail.com' }, banner: 'personal' };
    case 'email-taken':
      return { ...EMPTY, data: { ...EMPTY_DATA, fullName: SAMPLE.fullName, email: TAKEN_EMAIL }, banner: 'taken' };
    case 'creating':
      return {
        ...EMPTY,
        step: 3,
        data: { ...SAMPLE, password: STRONG_PASSWORD, confirm: STRONG_PASSWORD, terms: true },
        submitting: true,
      };
    case 'verify-email':
      return { ...EMPTY, view: 'verify', data: SAMPLE, resendRemaining: RESEND_SECONDS };
    case 'pending':
      return { ...EMPTY, view: 'pending', data: SAMPLE };
    case 'invite':
      return {
        ...EMPTY,
        step: 3,
        invite: true,
        data: {
          ...EMPTY_DATA,
          fullName: INVITE.fullName,
          email: INVITE.email,
          organization: INVITE.organization,
          site: INVITE.site,
          role: INVITE.role,
        },
      };
    case 'invite-expired':
      return { ...EMPTY, view: 'expired' };
  }
}

/** Which named state the card is currently showing. */
function stateIdOf(f: FlowState): RegisterStateId {
  if (f.view === 'expired') return 'invite-expired';
  if (f.view === 'pending') return 'pending';
  if (f.view === 'verify') return 'verify-email';
  if (f.submitting) return 'creating';
  if (f.invite) return 'invite';
  if (f.banner === 'personal') return 'personal-email';
  if (f.banner === 'taken') return 'email-taken';
  if (f.step === 1) return Object.keys(f.errors).length ? 'validation-error' : 'step-account';
  return f.step === 2 ? 'step-organization' : 'step-security';
}

function validateStep(step: StepNumber, d: RegisterData): FieldErrors {
  const e: FieldErrors = {};
  if (step === 1) {
    if (!d.fullName.trim()) e.fullName = COPY.errors.fullName;
    if (!isValidEmail(d.email)) e.email = COPY.errors.email;
    if (d.phone && d.phone.length !== 10) e.phone = COPY.errors.phone;
  } else if (step === 2) {
    if (!d.organization.trim()) e.organization = COPY.errors.organization;
    if (!d.site) e.site = COPY.errors.site;
    if (!d.role) e.role = COPY.errors.role;
  } else {
    if (!evaluatePassword(d.password, d.fullName, d.email).allMet) e.password = COPY.errors.password;
    if (d.confirm !== d.password || !d.confirm) e.confirm = COPY.errors.confirm;
    if (!d.terms) e.terms = COPY.errors.terms;
  }
  return e;
}

/* ── Motion ─────────────────────────────────────────────────────── */

/** Cross-fades the step content over 150ms when it changes (not on first render; none with reduced motion). */
function useCrossFade(ref: React.RefObject<HTMLElement | null>, key: string): void {
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = ref.current;
    if (!el?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animation = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease-out' });
    return () => animation.cancel();
  }, [ref, key]);
}

/* ── Card ───────────────────────────────────────────────────────── */

interface RegisterCardProps {
  useCase: UseCaseConfig;
  /** Requested background, carried over to the Sign in links. */
  background?: BackgroundStyle;
  state: RegisterStateId;
  onStateChange?: (state: RegisterStateId) => void;
  /** Inside the docs preview, links to the login screen open in a new tab. */
  embedded: boolean;
}

type FocusTarget = 'heading' | 'otp' | FieldKey;

export const RegisterCard: React.FC<RegisterCardProps> = ({ useCase, background, state, onStateChange, embedded }) => {
  const uid = useId();
  const [f, setF] = useState<FlowState>(() => presetFor(state));
  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const otpRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fields = useRef<Partial<Record<FieldKey, HTMLElement | null>>>({});
  const timer = useRef<number | undefined>(undefined);
  const lastState = useRef<RegisterStateId>(state);

  useCrossFade(contentRef, `${f.view}-${f.step}`);

  const update = (patch: Partial<FlowState>) => setF((p) => ({ ...p, ...patch }));
  const afterDelay = (fn: () => void) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(fn, CREATE_DELAY_MS);
  };
  const fieldRef = (key: FieldKey) => (el: HTMLElement | null) => {
    fields.current[key] = el;
  };

  // A state picked from outside resets the card to that snapshot.
  useEffect(() => {
    if (state === lastState.current) return;
    lastState.current = state;
    window.clearTimeout(timer.current);
    setF(presetFor(state));
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
    if (focusTarget === 'heading') headingRef.current?.focus();
    else if (focusTarget === 'otp') otpRef.current?.querySelector('input')?.focus();
    else fields.current[focusTarget]?.focus();
    setFocusTarget(null);
  }, [focusTarget, f.view, f.step]);

  // Resend countdown.
  const resendActive = f.view === 'verify' && f.resendRemaining > 0;
  useEffect(() => {
    if (!resendActive) return;
    const t = window.setInterval(() => setF((p) => ({ ...p, resendRemaining: Math.max(0, p.resendRemaining - 1) })), 1000);
    return () => window.clearInterval(t);
  }, [resendActive]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  /* ── Data and validation ── */

  const onChange = (patch: Partial<RegisterData>) =>
    setF((p) => {
      const data = { ...p.data, ...patch };
      // Re-check fields that already show an error, so it clears as soon as it's fixed.
      const recheck = validateStep(p.step, data);
      const errors: FieldErrors = {};
      (Object.keys(p.errors) as FieldKey[]).forEach((k) => {
        if (recheck[k]) errors[k] = recheck[k];
      });
      return { ...p, data, errors, banner: 'email' in patch ? null : p.banner };
    });

  const onBlurField = (key: FieldKey) => {
    const d = f.data;
    const message =
      key === 'email' && d.email && !isValidEmail(d.email)
        ? COPY.errors.email
        : key === 'phone' && d.phone && d.phone.length !== 10
          ? COPY.errors.phone
          : key === 'confirm' && d.confirm && d.confirm !== d.password
            ? COPY.errors.confirm
            : undefined;
    if (message) update({ errors: { ...f.errors, [key]: message } });
  };

  /* ── Actions ── */

  const submitStep = () => {
    if (f.submitting) return;
    const errors = validateStep(f.step, f.data);
    const firstError = STEP_FIELDS[f.step].find((k) => errors[k]);
    if (firstError) {
      update({ errors });
      setFocusTarget(firstError);
      return;
    }

    if (f.step === 1) {
      if (isPersonalEmail(f.data.email)) {
        update({ errors: {}, banner: 'personal' });
        setFocusTarget('email');
        return;
      }
      if (f.data.email.trim().toLowerCase() === TAKEN_EMAIL) {
        update({ errors: {}, banner: 'taken' });
        setFocusTarget('heading');
        return;
      }
    }

    if (f.step < 3) {
      update({ step: (f.step + 1) as StepNumber, errors: {}, banner: null });
      setFocusTarget('heading');
      return;
    }

    update({ errors: {}, submitting: true });
    afterDelay(() => {
      setF((p) => ({ ...p, submitting: false, view: 'verify', code: '', codeError: undefined, resendRemaining: RESEND_SECONDS }));
      setFocusTarget('otp');
    });
  };

  const submitCode = () => {
    if (f.submitting) return;
    if (f.code.length < OTP_LENGTH) {
      update({ codeError: COPY.errors.code });
      setFocusTarget('otp');
      return;
    }
    const code = f.code;
    update({ submitting: true, codeError: undefined });
    afterDelay(() => {
      if (code === DEMO_CODE) {
        setF((p) => ({ ...p, submitting: false, view: 'pending' }));
        setFocusTarget('heading');
      } else {
        setF((p) => ({ ...p, submitting: false, code: '', codeError: COPY.errors.wrongCode }));
        setFocusTarget('otp');
      }
    });
  };

  const back = () => {
    if (f.submitting || f.step === 1) return;
    update({ step: (f.step - 1) as StepNumber, errors: {}, banner: null });
    setFocusTarget('heading');
  };

  const changeEmail = () => {
    window.clearTimeout(timer.current);
    setF((p) => ({ ...p, view: 'form', step: 1, submitting: false, invite: false, code: '', codeError: undefined, errors: {} }));
    setFocusTarget('email');
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.view === 'verify') submitCode();
    else submitStep();
  };

  /* ── Links ── */

  const loginHref = (loginState?: string) => {
    const params = new URLSearchParams({ usecase: useCase.id });
    if (background) params.set('bg', background);
    if (loginState) params.set('state', loginState);
    return `${LOGIN_PREVIEW_PATH}?${params.toString()}`;
  };
  const linkTarget = embedded ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  /* ── Views ── */

  const heading = (title: string, subtitle: React.ReactNode) => (
    <div className="mb-6">
      <h1 ref={headingRef} tabIndex={-1} className="text-[24px] leading-[32px] font-semibold text-[#121722] outline-none">
        {title}
      </h1>
      <p className="mt-1 text-[14px] leading-[20px] text-[#4B5465]">{subtitle}</p>
    </div>
  );

  const spinner = <Loader2 className={`${ICON} motion-safe:animate-spin`} aria-hidden="true" />;

  const backButton = (label: string, onClick: () => void, disabled = false) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${BTN} !w-auto !px-3 mb-3 ${disabled ? 'text-[#8C95A6] cursor-not-allowed' : BTN_GHOST}`}
    >
      <ArrowLeft className={ICON} aria-hidden="true" />
      {label}
    </button>
  );

  const signInLine = (
    <p className="mt-4 flex flex-wrap items-center justify-center gap-x-1.5 text-[14px] leading-[20px] text-[#4B5465]">
      <span>{COPY.signInPrompt}</span>
      <a href={loginHref()} {...linkTarget} className={LINK}>
        {COPY.signIn}
      </a>
    </p>
  );

  let body: React.ReactNode;

  if (f.view === 'expired') {
    body = (
      <div>
        <StatusIcon icon={Clock} tone="gray" />
        {heading(COPY.expired.title, COPY.expired.text)}
        <a href="#contact-admin" onClick={demoLink} className={`${BTN} ${BTN_SECONDARY}`}>
          {COPY.actions.contactAdmin}
        </a>
        <a href={loginHref()} {...linkTarget} className={`${BTN} ${BTN_GHOST} mt-3`}>
          <ArrowLeft className={ICON} aria-hidden="true" />
          {COPY.actions.backToSignIn}
        </a>
      </div>
    );
  } else if (f.view === 'pending') {
    const summary: [string, string][] = [
      [COPY.pending.summary.name, f.data.fullName],
      [COPY.pending.summary.email, f.data.email],
      [COPY.pending.summary.role, optionLabel(ROLES, f.data.role)],
      [COPY.pending.summary.site, optionLabel(SITES, f.data.site)],
    ];
    body = (
      <div>
        <StatusIcon icon={ShieldCheck} tone="blue" />
        {heading(COPY.pending.title, COPY.pending.text(f.data.organization || INVITE.organization))}
        <dl className="mb-6 grid grid-cols-1 @min-[640px]:grid-cols-2 gap-x-6 gap-y-3 p-4 rounded-[8px] bg-[#F7F9FC] border border-[#DDE2EA]">
          {summary.map(([term, value]) => (
            <div key={term} className="min-w-0">
              <dt className="text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">{term}</dt>
              <dd className="mt-0.5 text-[14px] leading-[20px] text-[#353D4C] break-words">{value || '—'}</dd>
            </div>
          ))}
        </dl>
        <a href={loginHref()} {...linkTarget} className={`${BTN} ${BTN_SECONDARY}`}>
          {COPY.actions.backToSignIn}
        </a>
      </div>
    );
  } else if (f.view === 'verify') {
    const codeLabelId = `${uid}-code-label`;
    const codeErrorId = `${uid}-code-error`;
    body = (
      <form noValidate onSubmit={onSubmit}>
        <StatusIcon icon={MailCheck} />
        {heading(COPY.verify.title, COPY.verify.text(maskEmail(f.data.email)))}
        <p id={codeLabelId} className="mb-1.5 text-[14px] leading-[20px] font-medium text-[#121722]">
          {COPY.verify.codeLabel}
        </p>
        <div ref={otpRef}>
          <OtpInput
            value={f.code}
            onChange={(code) => update({ code, codeError: undefined })}
            length={OTP_LENGTH}
            labelledBy={codeLabelId}
            describedBy={codeErrorId}
            invalid={Boolean(f.codeError)}
            readOnly={f.submitting}
          />
        </div>
        <div id={codeErrorId} aria-live="polite">
          {f.codeError && <FieldErrorText>{f.codeError}</FieldErrorText>}
        </div>
        <button type="submit" disabled={f.submitting} className={`${BTN} mt-6 ${f.submitting ? BTN_LOADING : BTN_PRIMARY}`}>
          {f.submitting ? (
            <>
              {spinner}
              {COPY.actions.verifying}
            </>
          ) : (
            COPY.actions.verify
          )}
        </button>
        <div className="mt-1 flex justify-center">
          {f.resendRemaining > 0 ? (
            <p className="min-h-[44px] flex items-center text-[14px] leading-[20px] text-[#4B5465] tabular-nums" aria-live="off">
              {COPY.actions.resendIn(formatCountdown(f.resendRemaining))}
            </p>
          ) : (
            <button type="button" onClick={() => update({ resendRemaining: RESEND_SECONDS })} className={LINK}>
              {COPY.actions.resend}
            </button>
          )}
        </div>
        <button type="button" onClick={changeEmail} className={`${BTN} ${BTN_GHOST} mt-1`}>
          <ArrowLeft className={ICON} aria-hidden="true" />
          {COPY.actions.changeEmail}
        </button>
      </form>
    );
  } else {
    const stepCopy = COPY.steps[f.step];
    const stepProps = {
      data: f.data,
      errors: f.errors,
      onChange,
      onBlurField,
      readOnly: f.submitting,
      fieldRef,
      idPrefix: uid,
    };
    const completed: StepNumber[] = f.invite ? [1, 2] : f.step === 3 ? [1, 2] : f.step === 2 ? [1] : [];
    const canGoBack = f.step > 1 && !f.invite;
    const isLast = f.step === 3;

    body = (
      <form noValidate onSubmit={onSubmit}>
        {f.invite && (
          <div className="mb-6">
            <InfoAlert icon={Info}>{COPY.alerts.invite(INVITE.inviter, INVITE.inviterRole, INVITE.organization)}</InfoAlert>
          </div>
        )}
        <Stepper current={f.step} completed={completed} />
        {heading(stepCopy.title, stepCopy.subtitle(useCase.productName))}

        {/* Alerts: inside the card, between the subtitle and the first field */}
        <div aria-live="polite">
          {f.banner === 'personal' && (
            <div className="mb-4">
              <InfoAlert icon={Info}>{COPY.alerts.personal}</InfoAlert>
            </div>
          )}
          {f.banner === 'taken' && (
            <div className="mb-4">
              <InfoAlert icon={Info}>
                {COPY.alerts.takenBefore}
                <a href={loginHref()} {...linkTarget} className={INLINE_LINK}>
                  {COPY.alerts.takenSignIn}
                </a>
                {COPY.alerts.takenOr}
                <a href={loginHref('forgot')} {...linkTarget} className={INLINE_LINK}>
                  {COPY.alerts.takenReset}
                </a>
                .
              </InfoAlert>
            </div>
          )}
        </div>

        {f.step === 1 && <AccountStep {...stepProps} />}
        {f.step === 2 && <OrganizationStep {...stepProps} />}
        {f.step === 3 && <SecurityStep {...stepProps} invite={f.invite} />}

        <div className="mt-6">
          {canGoBack && backButton(COPY.actions.back, back, f.submitting)}
          <button
            type="submit"
            disabled={f.submitting}
            className={`${BTN} ${f.submitting ? BTN_LOADING : BTN_PRIMARY}`}
          >
            {f.submitting ? (
              <>
                {spinner}
                {COPY.actions.creating}
              </>
            ) : isLast ? (
              COPY.actions.create
            ) : (
              COPY.actions.continue
            )}
          </button>
        </div>
        {signInLine}
      </form>
    );
  }

  return (
    <LoginCard useCase={useCase} headerClassName="mb-6">
      <div ref={contentRef}>{body}</div>
    </LoginCard>
  );
};

