/**
 * Sample people for the profile template. Fictional names; initials avatars only.
 * The signed-in user (Priya Sharma) matches the Dashboard shell's CURRENT_USER.
 */
import { CURRENT_USER } from '../../dashboard/data/useCases';
import type { ViewerMode } from '../profileStates';

export type UserStatus = 'active' | 'suspended';

/** Editable personal details (the Personal details form). */
export interface PersonalDetails {
  firstName: string;
  lastName: string;
  displayName: string;
  /** Digits only, up to 10. */
  mobile: string;
  altContact: string;
  language: string;
  dateFormat: string;
  landing: string;
}

export interface ProfileUser {
  details: PersonalDetails;
  email: string;
  employeeId: string;
  department: string;
  role: string;
  roleDescription: string;
  roleAssignedBy: string;
  roleAssignedOn: string;
  sites: string[];
  manager: { name: string; initials: string; title: string };
  memberSince: string;
  lastSignIn: string;
  /** Days since the password was changed. */
  passwordAge: number;
  stats: { modules: number; sites: number; cameras: number; signIns: number };
}

export const fullName = (d: PersonalDetails): string => `${d.firstName} ${d.lastName}`.trim();
export const initialsOf = (d: PersonalDetails): string =>
  `${d.firstName[0] ?? ''}${d.lastName[0] ?? ''}`.toUpperCase() || '?';

/* ── Options ─────────────────────────────────────────────────────── */

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'mr', label: 'मराठी' },
];

export const DATE_FORMATS = [
  { value: 'dd-mmm-yyyy', label: 'DD MMM YYYY (30 Sep 2026)' },
  { value: 'dd-mm-yyyy', label: 'DD-MM-YYYY (30-09-2026)' },
];

export const LANDING_PAGES = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'live', label: 'Live view' },
  { value: 'alerts', label: 'Alerts' },
];

export const TIME_ZONE = { value: 'ist', label: 'IST (UTC+05:30)' };

export const labelOf = (options: { value: string; label: string }[], value: string): string =>
  options.find((o) => o.value === value)?.label ?? value;

/* ── Role and stats ──────────────────────────────────────────────── */

interface RoleProfile {
  role: string;
  roleDescription: string;
  department: string;
  stats: ProfileUser['stats'];
}

const SELF_ROLE: RoleProfile = {
  role: CURRENT_USER.role,
  roleDescription: 'Manages users, sites, cameras and settings across every module.',
  department: 'Campus operations',
  stats: { modules: 3, sites: 2, cameras: 14, signIns: 42 },
};

const OTHER_ROLE: RoleProfile = {
  role: 'Security supervisor',
  roleDescription: 'Monitors gates, alerts and incidents for assigned sites.',
  department: 'Campus security',
  stats: { modules: 2, sites: 2, cameras: 18, signIns: 57 },
};

const SELF_DETAILS: PersonalDetails = {
  firstName: 'Priya',
  lastName: 'Sharma',
  displayName: '',
  mobile: '9876543210',
  altContact: '',
  language: 'en',
  dateFormat: 'dd-mmm-yyyy',
  landing: 'dashboard',
};

const OTHER_DETAILS: PersonalDetails = {
  firstName: 'Rahul',
  lastName: 'Mehta',
  displayName: '',
  mobile: '9822014578',
  altContact: '',
  language: 'en',
  dateFormat: 'dd-mmm-yyyy',
  landing: 'live',
};

/** The person whose profile is open: yourself, or Rahul Mehta in the admin view. */
export function getProfileUser(viewer: ViewerMode): ProfileUser {
  if (viewer === 'self') {
    return {
      details: SELF_DETAILS,
      email: 'priya.sharma@pit.edu.in',
      employeeId: 'EMP-2041',
      department: SELF_ROLE.department,
      role: SELF_ROLE.role,
      roleDescription: SELF_ROLE.roleDescription,
      roleAssignedBy: 'Rahul Mehta',
      roleAssignedOn: '12 Mar 2025',
      sites: ['Main campus', 'North campus'],
      manager: { name: 'Anil Deshpande', initials: 'AD', title: 'Director, Campus operations' },
      memberSince: '12 Mar 2025',
      lastSignIn: 'today, 09:14 IST from Pune',
      passwordAge: 41,
      stats: SELF_ROLE.stats,
    };
  }
  return {
    details: OTHER_DETAILS,
    email: 'rahul.mehta@pit.edu.in',
    employeeId: 'EMP-1187',
    department: OTHER_ROLE.department,
    role: OTHER_ROLE.role,
    roleDescription: OTHER_ROLE.roleDescription,
    roleAssignedBy: CURRENT_USER.name,
    roleAssignedOn: '04 Jun 2025',
    sites: ['Main campus', 'North campus'],
    manager: { name: CURRENT_USER.name, initials: CURRENT_USER.initials, title: CURRENT_USER.role },
    memberSince: '04 Jun 2025',
    lastSignIn: 'today, 08:02 IST from Pune',
    passwordAge: 17,
    stats: OTHER_ROLE.stats,
  };
}

/** Pending new address used by the change-email flow and the "Change email pending" state. */
export const PENDING_EMAIL = 'priya.new@pit.edu.in';

/** Everything in the organization a site chip can be. */
export const ALL_SITES = ['Main campus', 'North campus', 'South campus'];
