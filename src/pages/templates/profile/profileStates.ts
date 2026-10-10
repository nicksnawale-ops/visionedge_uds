/** User Profile template: states, sections and viewer modes (showcase chips and ?state=&section=&viewer=). */
import { Bell, History, KeyRound, LayoutGrid, MonitorSmartphone, ShieldCheck, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export { PROFILE_PAGE_PATH, PROFILE_PREVIEW_PATH } from './paths';

/* ── Sections ────────────────────────────────────────────────────── */

export type SectionId = 'overview' | 'personal' | 'security' | 'sessions' | 'notifications' | 'access' | 'activity';

export interface SectionMeta {
  id: SectionId;
  label: string;
  icon: LucideIcon;
  /** 14px description under the section title (self view). */
  description: string;
  /** Description when an administrator views another user. */
  adminDescription: string;
}

export const SECTIONS: SectionMeta[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutGrid,
    description: 'Your details, role and account security at a glance.',
    adminDescription: 'Details, role and account security for this user.',
  },
  {
    id: 'personal',
    label: 'Personal details',
    icon: User,
    description: 'Your name, contact details and preferences. Your administrator manages your employee ID.',
    adminDescription: "This user's name, contact details and preferences.",
  },
  {
    id: 'security',
    label: 'Security',
    icon: ShieldCheck,
    description: 'Password, two-step verification, backup codes and sign-in alerts.',
    adminDescription: 'Reset the password or require two-step verification for this user.',
  },
  {
    id: 'sessions',
    label: 'Sessions & devices',
    icon: MonitorSmartphone,
    description: "Where you're signed in right now. Sign out of any device you don't recognize.",
    adminDescription: 'Where this user is signed in. Signing them out takes effect immediately.',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Choose how you hear about events. Critical alerts always reach you in the app.',
    adminDescription: 'How this user hears about events. Only the user can change these.',
  },
  {
    id: 'access',
    label: 'Access & permissions',
    icon: KeyRound,
    description: 'Your role, the modules you can use and the sites and cameras assigned to you.',
    adminDescription: "Change this user's module access and sites. Changes are recorded in the audit log.",
  },
  {
    id: 'activity',
    label: 'Activity log',
    icon: History,
    description: 'Sign-ins, settings changes and actions from the last 30 days. All times IST.',
    adminDescription: "This user's sign-ins, settings changes and actions from the last 30 days. All times IST.",
  },
];

export const getSection = (id: SectionId): SectionMeta => SECTIONS.find((s) => s.id === id) ?? SECTIONS[0];
export const isSectionId = (value: string | null | undefined): value is SectionId => SECTIONS.some((s) => s.id === value);

/* ── Viewer modes ────────────────────────────────────────────────── */

export type ViewerMode = 'self' | 'admin';
export const isViewerMode = (value: string | null | undefined): value is ViewerMode => value === 'self' || value === 'admin';

/* ── States ──────────────────────────────────────────────────────── */

export type ProfileStateId =
  | 'default'
  | 'loading'
  | 'editing'
  | 'validation-error'
  | 'saving'
  | 'saved'
  | 'photo-crop'
  | 'email-pending'
  | 'two-step-setup'
  | 'two-step-off'
  | 'admin'
  | 'suspended';

export interface ProfileStateMeta {
  id: ProfileStateId;
  label: string;
  /** When this state appears (States table). */
  trigger: string;
  /** One-line description under the showcase and in the States table. */
  behaviour: string;
  /** Section the state opens on. */
  section: SectionId;
  /** States that only exist in the admin view. */
  adminOnly?: boolean;
}

export const PROFILE_STATES: ProfileStateMeta[] = [
  {
    id: 'default',
    label: 'Default',
    trigger: 'Opening My profile',
    behaviour: 'Overview with personal information, organization and role, security status and recent activity.',
    section: 'overview',
  },
  {
    id: 'loading',
    label: 'Loading',
    trigger: 'First load',
    behaviour: 'Skeletons for the header, section nav and cards; the layout stays fixed so nothing jumps.',
    section: 'overview',
  },
  {
    id: 'editing',
    label: 'Editing',
    trigger: 'Any field changes',
    behaviour: 'A sticky bar slides up with Discard and the page’s only Primary, "Save changes". Leaving asks first.',
    section: 'personal',
  },
  {
    id: 'validation-error',
    label: 'Validation error',
    trigger: 'A field is left or saved with a problem',
    behaviour: 'Checked on blur: 2px Deep Navy border, alert icon and a specific message under the field.',
    section: 'personal',
  },
  {
    id: 'saving',
    label: 'Saving',
    trigger: '"Save changes" pressed',
    behaviour: 'Primary shows a spinner and "Saving…" at the same width; inputs are read-only.',
    section: 'personal',
  },
  {
    id: 'saved',
    label: 'Saved',
    trigger: 'Save succeeded',
    behaviour: 'The bar slides away, a "Profile updated" toast appears and the result is announced.',
    section: 'personal',
  },
  {
    id: 'photo-crop',
    label: 'Photo upload & crop',
    trigger: '"Upload photo" with a valid image',
    behaviour: '640px modal: circle mask, zoom slider, drag or arrow keys to reposition, then "Save photo".',
    section: 'personal',
  },
  {
    id: 'email-pending',
    label: 'Change email pending',
    trigger: 'New email entered, not yet verified',
    behaviour: 'Info alert above the form; the current email stays active until the new one is verified.',
    section: 'personal',
  },
  {
    id: 'two-step-setup',
    label: 'Two-step setup',
    trigger: 'Turning on two-step verification',
    behaviour: '3-step modal: scan the code, verify a 6-digit code, then save 10 backup codes.',
    section: 'security',
  },
  {
    id: 'two-step-off',
    label: 'Two-step off',
    trigger: 'Two-step verification turned off',
    behaviour: 'Security shows a warning; the Overview security status asks to turn it on.',
    section: 'security',
  },
  {
    id: 'admin',
    label: 'Admin view',
    trigger: 'An administrator opens another user',
    behaviour: 'Info banner about the audit log, Reset password and a kebab menu, and a Danger zone on Overview.',
    section: 'overview',
    adminOnly: true,
  },
  {
    id: 'suspended',
    label: 'Suspended user',
    trigger: 'An administrator suspended the user',
    behaviour: 'Critical banner "This account is suspended" with a White "Reactivate" button.',
    section: 'overview',
    adminOnly: true,
  },
];

export const isProfileState = (value: string | null | undefined): value is ProfileStateId =>
  PROFILE_STATES.some((s) => s.id === value);

export const getProfileState = (id: ProfileStateId): ProfileStateMeta =>
  PROFILE_STATES.find((s) => s.id === id) ?? PROFILE_STATES[0];

/** The viewer a state needs: admin-only states always use the admin view. */
export const viewerForState = (state: ProfileStateId, requested: ViewerMode): ViewerMode =>
  getProfileState(state).adminOnly ? 'admin' : requested;

/** Demo timings. */
export const SAVE_DELAY_MS = 1200;
export const DEMO_CODE = '123456';
