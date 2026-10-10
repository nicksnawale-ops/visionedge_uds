/**
 * Login template: state definitions, demo rules and all user-facing copy.
 * Copy is sentence case, verb-first for actions, and never blames the user.
 */

export type LoginStateId =
  | 'default'
  | 'validation-error'
  | 'wrong-credentials'
  | 'signing-in'
  | 'locked'
  | 'forgot'
  | 'reset-sent'
  | 'two-step'
  | 'session-expired'
  | 'success';

export interface LoginStateMeta {
  id: LoginStateId;
  label: string;
  /** When this state appears (shown in the States table). */
  trigger: string;
  /** What the card does (shown in the States table). */
  behaviour: string;
}

/** States offered in the reference page switcher, in order. "success" is reachable only via the demo flow. */
export const LOGIN_STATES: LoginStateMeta[] = [
  {
    id: 'default',
    label: 'Default',
    trigger: 'First visit',
    behaviour: 'Empty fields and one Primary action.',
  },
  {
    id: 'validation-error',
    label: 'Validation error',
    trigger: 'Blur or submit with a missing or malformed field',
    behaviour: '2px Deep Navy border, alert icon and a specific message; focus moves to the first error.',
  },
  {
    id: 'wrong-credentials',
    label: 'Wrong credentials',
    trigger: 'Server rejects the email + password pair',
    behaviour: 'Critical alert inside the card with attempts left. Password cleared, email kept. Never says which field was wrong.',
  },
  {
    id: 'signing-in',
    label: 'Signing in',
    trigger: 'Valid submit while the request is in flight',
    behaviour: 'Spinner + "Signing in…" at the same width; fields read-only.',
  },
  {
    id: 'locked',
    label: 'Account locked',
    trigger: '5 failed attempts',
    behaviour: 'Info alert with a live countdown; fields and button disabled; link to the administrator.',
  },
  {
    id: 'forgot',
    label: 'Forgot password',
    trigger: '"Forgot password?" link',
    behaviour: 'Replaces the form in the same card: email only, Primary "Send reset link", Ghost "Back to sign in".',
  },
  {
    id: 'reset-sent',
    label: 'Reset link sent',
    trigger: 'Reset link requested',
    behaviour: 'Masked email, 30-minute expiry, resend disabled for 45 seconds.',
  },
  {
    id: 'two-step',
    label: 'Two-step verification',
    trigger: 'Password accepted on an account with 2FA',
    behaviour: '6 code boxes with auto-advance, paste-to-fill and Backspace to go back.',
  },
  {
    id: 'session-expired',
    label: 'Session expired',
    trigger: '30 minutes of inactivity',
    behaviour: 'Info alert inside the card; email prefilled.',
  },
];

export { LOGIN_PAGE_PATH, LOGIN_PREVIEW_PATH } from './paths';

/* ── Demo rules (full-screen route and preview) — no real authentication ── */

export const DEMO_PASSWORD = 'visionedge';
export const DEMO_CODE = '123456';
export const MAX_ATTEMPTS = 5;
export const SIGN_IN_DELAY_MS = 1200;
export const LOCK_SECONDS = 15 * 60;
export const RESEND_SECONDS = 45;
export const OTP_LENGTH = 6;

/** Example account used to prefill states that need an email. Fictional. */
export const SAMPLE_EMAIL = 'nisha.rao@organization.com';

export const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

/** n****@organization.com */
export const maskEmail = (value: string): string => {
  const [local, domain] = value.trim().split('@');
  if (!local || !domain) return value;
  return `${local[0]}****@${domain}`;
};

export const formatCountdown = (totalSeconds: number): string => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

/** mm:ss with a leading zero on minutes, e.g. 14:59. */
export const formatLockCountdown = (totalSeconds: number): string =>
  formatCountdown(totalSeconds).padStart(5, '0');

/* ── Copy ── */

export const COPY = {
  brandName: 'VisionEdge',
  signIn: {
    title: 'Welcome back',
    subtitle: (productName: string) => `Sign in to continue to ${productName}`,
    emailLabel: 'Work email',
    emailPlaceholder: 'name@organization.com',
    passwordLabel: 'Password',
    remember: 'Keep me signed in',
    forgot: 'Forgot password?',
    submit: 'Sign in',
    submitting: 'Signing in…',
    accessNote: "Don't have access? Contact your administrator.",
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    capsLock: 'Caps Lock is on',
  },
  errors: {
    email: 'Enter a valid work email, like name@organization.com',
    password: 'Enter your password',
    code: 'Enter all 6 digits of your code',
    wrongCode: "That code didn't work. Check your authenticator app and try again.",
  },
  wrongCredentials: (attemptsLeft: number) =>
    `Incorrect email or password. ${attemptsLeft} ${attemptsLeft === 1 ? 'attempt' : 'attempts'} left before your account is locked.`,
  locked: {
    message: `Your account is locked for 15 minutes after ${MAX_ATTEMPTS} failed attempts.`,
    countdownLabel: 'Try again in',
    link: 'Contact your administrator',
  },
  sessionExpired: 'Your session expired after 30 minutes of inactivity. Please sign in again.',
  forgot: {
    title: 'Reset your password',
    subtitle: "Enter your work email and we'll send you a secure reset link.",
    submit: 'Send reset link',
    back: 'Back to sign in',
  },
  resetSent: {
    title: 'Check your email',
    text: (masked: string) => `We sent a reset link to ${masked}. It expires in 30 minutes.`,
    resend: 'Resend link',
    resendIn: (time: string) => `Resend in ${time}`,
    back: 'Back to sign in',
  },
  twoStep: {
    title: "Verify it's you",
    subtitle: 'Enter the 6-digit code from your authenticator app.',
    codeLabel: 'Verification code',
    submit: 'Verify',
    backup: 'Use a backup code instead',
    back: 'Back to sign in',
  },
  success: {
    title: 'Signed in successfully',
    text: 'Redirecting to your dashboard…',
  },
  demoHint: `Demo: password ${DEMO_PASSWORD} · code ${DEMO_CODE}`,
} as const;
