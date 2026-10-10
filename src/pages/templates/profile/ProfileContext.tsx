/** Screen state shared by the profile header, sections and modals (one source of truth in ProfileScreen). */
import React, { createContext, useContext } from 'react';
import type { ProfileStateId, SectionId, ViewerMode } from './profileStates';
import type { PersonalDetails, ProfileUser } from './data/users';
import type { Session } from './data/sessions';
import type { ActivityRow } from './data/activity';
import type { AccessLevel, ModuleAccess } from './data/access';

export type PersonalField = 'firstName' | 'lastName' | 'displayName' | 'mobile' | 'altContact';
export type PersonalErrors = Partial<Record<PersonalField, string>>;

/** Modals owned by the screen (opened from the header, sections or the Danger zone). */
export type ModalRequest =
  | { kind: 'photo'; sample?: boolean }
  | { kind: 'email'; step?: 'form' | 'code' }
  | { kind: 'password' }
  | { kind: 'two-step-setup' }
  | { kind: 'two-step-off' }
  | { kind: 'backup-codes'; regenerate: boolean }
  | { kind: 'sign-out-all' }
  | { kind: 'sign-out-session'; session: Session }
  | { kind: 'suspend' }
  | { kind: 'request-access' }
  | { kind: 'camera-list' }
  | { kind: 'reset-password' }
  | { kind: 'discard'; next: SectionId };

export interface ProfileContextValue {
  state: ProfileStateId;
  /** Organization shown in the header and Overview. */
  organization: string;
  viewer: ViewerMode;
  user: ProfileUser;
  /** Saved details (header and Overview read these). */
  details: PersonalDetails;
  name: string;
  initials: string;
  photo: string | null;
  setPhoto: (src: string | null) => void;
  email: string;
  pendingEmail: string | null;
  setPendingEmail: (email: string | null) => void;
  setEmail: (email: string) => void;
  twoStep: boolean;
  setTwoStep: (on: boolean) => void;
  requireTwoStep: boolean;
  setRequireTwoStep: (on: boolean) => void;
  backupRemaining: number;
  setBackupRemaining: (n: number) => void;
  suspended: boolean;
  setSuspended: (s: boolean) => void;
  sessions: Session[];
  signOutSessions: (ids: string[]) => void;
  activity: ActivityRow[];

  /* Personal details form */
  draft: PersonalDetails;
  updateDraft: (patch: Partial<PersonalDetails>) => void;
  errors: PersonalErrors;
  blurField: (field: PersonalField) => void;
  fieldRef: (field: PersonalField) => (el: HTMLElement | null) => void;
  saving: boolean;

  /* Access (editable in the admin view) */
  access: ModuleAccess[];
  /** Modules with access, from the saved state (header stats). */
  moduleCount: number;
  setAccessLevel: (module: ModuleAccess['id'], level: AccessLevel) => void;
  sites: string[];
  setSites: (sites: string[]) => void;

  goTo: (section: SectionId) => void;
  openModal: (request: ModalRequest) => void;
  toast: (message: string, type?: 'success' | 'info' | 'critical') => void;
  /** Polite screen-reader announcement. */
  announce: (message: string) => void;
  /** Anatomy marker n (reference page). */
  marker: (n: number, inset?: boolean) => React.ReactNode;
}

export const ProfileContext = createContext<ProfileContextValue | null>(null);

export function useProfile(): ProfileContextValue {
  const value = useContext(ProfileContext);
  if (!value) throw new Error('useProfile must be used inside ProfileScreen');
  return value;
}
