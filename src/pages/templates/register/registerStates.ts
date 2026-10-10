/**
 * Register template: states, demo rules, options and all user-facing copy.
 * Copy is sentence case, verb-first for actions, and never blames the user.
 */

export { REGISTER_PAGE_PATH, REGISTER_PREVIEW_PATH } from './paths';

export type RegisterStateId =
  | 'step-account'
  | 'step-organization'
  | 'step-security'
  | 'validation-error'
  | 'personal-email'
  | 'email-taken'
  | 'creating'
  | 'verify-email'
  | 'pending'
  | 'invite'
  | 'invite-expired';

export interface RegisterStateMeta {
  id: RegisterStateId;
  label: string;
  /** When this state appears (States table). */
  trigger: string;
  /** What the card does (States table and showcase description). */
  behaviour: string;
}

export const REGISTER_STATES: RegisterStateMeta[] = [
  {
    id: 'step-account',
    label: 'Step 1 — Account',
    trigger: 'First visit',
    behaviour: 'Full name, work email and an optional mobile number. One Primary "Continue".',
  },
  {
    id: 'step-organization',
    label: 'Step 2 — Organization',
    trigger: 'Step 1 completed',
    behaviour: 'Organization, site and role (each role explains its access). Ghost "Back" keeps the data.',
  },
  {
    id: 'step-security',
    label: 'Step 3 — Security',
    trigger: 'Step 2 completed',
    behaviour: 'Password with a 4-segment strength meter and a live checklist; confirm password; terms.',
  },
  {
    id: 'validation-error',
    label: 'Validation error',
    trigger: 'Continue with missing or malformed fields',
    behaviour: '2px Deep Navy border, alert icon and a specific message; focus moves to the first error.',
  },
  {
    id: 'personal-email',
    label: 'Personal email blocked',
    trigger: 'Gmail, Yahoo or Outlook address',
    behaviour: 'Info alert inside the card asking for a work email.',
  },
  {
    id: 'email-taken',
    label: 'Email already registered',
    trigger: 'An account may already exist',
    behaviour: 'Privacy-safe Info alert that never confirms whether the account exists.',
  },
  {
    id: 'creating',
    label: 'Creating account',
    trigger: 'Step 3 submitted',
    behaviour: 'Spinner + "Creating account…" at the same width; fields read-only; Back disabled.',
  },
  {
    id: 'verify-email',
    label: 'Verify email',
    trigger: 'Account created',
    behaviour: '6-digit code to the masked email, resend after 45 seconds, "Change email" goes back.',
  },
  {
    id: 'pending',
    label: 'Pending approval',
    trigger: 'Email verified',
    behaviour: 'Request summary in a Gray 50 box; administrator approval usually within 1 business day.',
  },
  {
    id: 'invite',
    label: 'Invitation',
    trigger: 'Opened from an invite link',
    behaviour: 'Email, organization, site and role pre-filled and locked; stepper skips to Security.',
  },
  {
    id: 'invite-expired',
    label: 'Invite expired',
    trigger: 'Invite link older than 7 days',
    behaviour: 'Explains the 7-day validity and points to the administrator.',
  },
];

export const isRegisterState = (value: string | null | undefined): value is RegisterStateId =>
  REGISTER_STATES.some((s) => s.id === value);

/* ── Steps ── */

export type StepNumber = 1 | 2 | 3;

export const STEPS: { n: StepNumber; label: string }[] = [
  { n: 1, label: 'Account' },
  { n: 2, label: 'Organization' },
  { n: 3, label: 'Security' },
];

/* ── Form data ── */

export interface RegisterData {
  fullName: string;
  email: string;
  /** Digits only. */
  phone: string;
  organization: string;
  site: string;
  role: string;
  department: string;
  password: string;
  confirm: string;
  terms: boolean;
  updates: boolean;
}

export type FieldKey = 'fullName' | 'email' | 'phone' | 'organization' | 'site' | 'role' | 'password' | 'confirm' | 'terms';
export type FieldErrors = Partial<Record<FieldKey, string>>;

/** Field order per step, used to move focus to the first error. */
export const STEP_FIELDS: Record<StepNumber, FieldKey[]> = {
  1: ['fullName', 'email', 'phone'],
  2: ['organization', 'site', 'role'],
  3: ['password', 'confirm', 'terms'],
};

/** Props shared by the three step components. */
export interface StepProps {
  data: RegisterData;
  errors: FieldErrors;
  onChange: (patch: Partial<RegisterData>) => void;
  onBlurField: (key: FieldKey) => void;
  /** Fields are read-only while the account is being created. */
  readOnly: boolean;
  /** Registers each control so focus can move to the first error. */
  fieldRef: (key: FieldKey) => (el: HTMLElement | null) => void;
  idPrefix: string;
}

/* ── Options ── */

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export const SITES: SelectOption[] = [
  { value: 'main', label: 'Main campus' },
  { value: 'north', label: 'North campus' },
  { value: 'south', label: 'South campus' },
  { value: 'other', label: 'Other' },
];

export const ROLES: SelectOption[] = [
  { value: 'admin', label: 'Administrator', description: 'Manages users, sites and settings' },
  { value: 'security', label: 'Security supervisor', description: 'Monitors gates, alerts and incidents' },
  { value: 'warden', label: 'Hostel warden', description: 'Tracks hostel entries and attendance' },
  { value: 'canteen', label: 'Canteen manager', description: 'Views meal counts and reports' },
  { value: 'operator', label: 'Operator', description: 'Handles day-to-day monitoring' },
  { value: 'viewer', label: 'Viewer (read-only)', description: 'Sees dashboards; cannot make changes' },
];

export const optionLabel = (options: SelectOption[], value: string): string =>
  options.find((o) => o.value === value)?.label ?? '';

/* ── Demo rules (no real backend) ── */

export const DEMO_CODE = '123456';
export const CREATE_DELAY_MS = 1200;
export const RESEND_SECONDS = 45;
export const OTP_LENGTH = 6;
export const PERSONAL_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com'];
export const TAKEN_EMAIL = 'taken@organization.com';

export const INVITE = {
  inviter: 'Rahul Mehta',
  inviterRole: 'Administrator',
  fullName: 'Priya Sharma',
  email: 'priya.sharma@organization.com',
  organization: 'Pune Institute of Technology',
  site: 'main',
  role: 'operator',
} as const;

export const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export const isPersonalEmail = (value: string): boolean =>
  PERSONAL_DOMAINS.some((d) => value.trim().toLowerCase().endsWith(`@${d}`));

/** p****@organization.com */
export const maskEmail = (value: string): string => {
  const [local, domain] = value.trim().split('@');
  if (!local || !domain) return value;
  return `${local[0]}****@${domain}`;
};

export const formatCountdown = (totalSeconds: number): string =>
  `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;

/** "9876543210" → "98765 43210" */
export const formatPhone = (digits: string): string =>
  digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;

/* ── Password rules ── */

export interface PasswordRule {
  id: string;
  label: string;
  met: boolean;
}

export type StrengthLabel = 'Weak' | 'Fair' | 'Good' | 'Strong';

export interface PasswordStrengthResult {
  rules: PasswordRule[];
  /** Filled meter segments, 0–4. */
  segments: number;
  label: StrengthLabel | null;
  allMet: boolean;
}

/** Name parts (3+ letters) and the email's local part must not appear in the password. */
const personalTokens = (fullName: string, email: string): string[] =>
  [...fullName.toLowerCase().split(/\s+/), email.toLowerCase().split('@')[0] ?? '']
    .map((t) => t.replace(/[^a-z0-9]/g, ''))
    .filter((t) => t.length >= 3);

export function evaluatePassword(password: string, fullName: string, email: string): PasswordStrengthResult {
  const lower = password.toLowerCase();
  const rules: PasswordRule[] = [
    { id: 'length', label: 'At least 12 characters', met: password.length >= 12 },
    { id: 'case', label: 'One uppercase and one lowercase letter', met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { id: 'number', label: 'One number', met: /\d/.test(password) },
    { id: 'symbol', label: 'One symbol', met: /[^A-Za-z0-9\s]/.test(password) },
    {
      id: 'personal',
      label: "Doesn't contain your name or email",
      met: password.length > 0 && !personalTokens(fullName, email).some((t) => lower.includes(t)),
    },
  ];
  const met = rules.filter((r) => r.met).length;
  if (!password) return { rules, segments: 0, label: null, allMet: false };
  // ≤2 met: Weak · 3: Fair · 4: Good · 5: Strong
  const segments = met <= 2 ? 1 : met - 1;
  const label: StrengthLabel = (['Weak', 'Fair', 'Good', 'Strong'] as const)[segments - 1];
  return { rules, segments, label, allMet: met === rules.length };
}

/* ── Copy ── */

export const COPY = {
  stepOf: (n: number) => `Step ${n} of 3`,
  steps: {
    1: {
      title: 'Create your account',
      subtitle: (productName: string) => `Get started with ${productName} in a few steps.`,
    },
    2: { title: 'Your organization', subtitle: () => 'Tell us where you work so we can set up your access.' },
    3: { title: 'Secure your account', subtitle: () => 'Create a strong password to protect your data.' },
  },
  fields: {
    fullName: { label: 'Full name', placeholder: 'Priya Sharma' },
    email: { label: 'Work email', placeholder: 'name@organization.com', helper: 'Use your official work email.' },
    phone: { label: 'Mobile number', placeholder: '98765 43210', prefix: '+91' },
    organization: { label: 'Organization or institute', placeholder: 'e.g. Pune Institute of Technology' },
    site: { label: 'Site / campus', placeholder: 'Choose a site' },
    role: { label: 'Your role', placeholder: 'Choose a role' },
    department: { label: 'Department', placeholder: 'e.g. Campus security' },
    password: { label: 'Password' },
    confirm: { label: 'Confirm password' },
  },
  terms: { before: 'I agree to the ', terms: 'Terms of use', and: ' and ', privacy: 'Privacy policy' },
  updates: 'Send me product updates and security notices',
  passwordsMatch: 'Passwords match',
  capsLock: 'Caps Lock is on',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  strengthLabel: 'Password strength',
  errors: {
    fullName: 'Enter your full name',
    email: 'Enter a valid work email, like name@organization.com',
    phone: 'Enter a 10-digit mobile number',
    organization: 'Enter your organization or institute',
    site: 'Choose your site or campus',
    role: 'Choose your role',
    password: 'Choose a password that meets every requirement',
    confirm: "Passwords don't match",
    terms: 'Agree to the Terms of use and Privacy policy to continue',
    code: 'Enter all 6 digits of your code',
    wrongCode: "That code didn't work. Check your email and try again.",
  },
  alerts: {
    personal:
      "Please use your work email. Personal addresses (Gmail, Yahoo, Outlook) can't be used for VisionEdge accounts.",
    takenBefore: "If this email can be registered, we'll send a verification code. Already have an account? ",
    takenSignIn: 'Sign in',
    takenOr: ' or ',
    takenReset: 'reset your password',
    invite: (inviter: string, role: string, org: string) => `You've been invited by ${inviter} (${role}) to join ${org}.`,
  },
  actions: {
    continue: 'Continue',
    back: 'Back',
    create: 'Create account',
    creating: 'Creating account…',
    verify: 'Verify email',
    verifying: 'Verifying…',
    changeEmail: 'Change email',
    resend: 'Resend code',
    resendIn: (time: string) => `Resend code in ${time}`,
    backToSignIn: 'Back to sign in',
    contactAdmin: 'Contact administrator',
  },
  signInPrompt: 'Already have an account?',
  signIn: 'Sign in',
  verify: {
    title: 'Verify your email',
    text: (masked: string) => `Enter the 6-digit code we sent to ${masked}.`,
    codeLabel: 'Verification code',
  },
  pending: {
    title: 'Request submitted',
    text: (org: string) =>
      `Your administrator at ${org} will review your access. We'll email you once it's approved, usually within 1 business day.`,
    summary: { name: 'Name', email: 'Email', role: 'Role', site: 'Site' },
  },
  expired: {
    title: 'This invitation has expired',
    text: 'Invitations are valid for 7 days. Ask your administrator to send a new one.',
  },
  demoHint: `Demo: code ${DEMO_CODE} · try ${TAKEN_EMAIL}`,
} as const;
