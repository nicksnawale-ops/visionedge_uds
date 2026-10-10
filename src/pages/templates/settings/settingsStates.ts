/** Settings template: sections (grouped), roles and states (showcase chips and ?state=&section=&role=). */
import { BadgeCheck, BellRing, Building2, Cctv, History, Lock, MapPin, Plug, ScanEye, Server, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export { SETTINGS_PAGE_PATH, SETTINGS_PREVIEW_PATH } from './paths';

/* ── Sections ────────────────────────────────────────────────────── */

export type SettingsSectionId =
  | 'general'
  | 'sites'
  | 'license'
  | 'cameras'
  | 'detection'
  | 'alerts'
  | 'users'
  | 'integrations'
  | 'privacy'
  | 'audit'
  | 'system';

export interface SettingsSectionMeta {
  id: SettingsSectionId;
  label: string;
  icon: LucideIcon;
  description: string;
  /** "Who can edit" in the Sections overview. */
  editors: string;
  purpose: string;
  controls: string;
}

export interface SettingsGroup {
  id: string;
  label: string;
  sections: SettingsSectionMeta[];
}

export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    id: 'organization',
    label: 'Organization',
    sections: [
      {
        id: 'general',
        label: 'General',
        icon: Building2,
        description: 'Your organization’s name, logo, regional formats, working hours and contacts.',
        editors: 'Administrators',
        purpose: 'Identity and regional formats used across the product, reports and emails',
        controls: 'Inputs, Selects, radio groups, day chips, logo upload',
      },
      {
        id: 'sites',
        label: 'Sites & locations',
        icon: MapPin,
        description: 'Campuses and buildings, with the gates and zones cameras are assigned to.',
        editors: 'Administrators',
        purpose: 'Where cameras live; zones feed alert rules and reports',
        controls: 'Table, row actions, Add site drawer, zone chips',
      },
      {
        id: 'license',
        label: 'License & usage',
        icon: BadgeCheck,
        description: 'Your plan, how much of it you use and which modules are licensed.',
        editors: 'Read-only (managed by VisionEdge)',
        purpose: 'Plan limits and licensed modules',
        controls: 'Bullet bars, badges, locked rows',
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    sections: [
      {
        id: 'cameras',
        label: 'Cameras & devices',
        icon: Cctv,
        description: 'Every camera and edge device, its stream, status and recording mode.',
        editors: 'Administrators',
        purpose: 'Connect, monitor and maintain cameras',
        controls: 'Summary strip, filterable table, bulk actions, Add camera drawer',
      },
      {
        id: 'detection',
        label: 'Detection & AI',
        icon: ScanEye,
        description: 'How VisionEdge detects, reads and matches. Changes apply to every camera.',
        editors: 'Administrators',
        purpose: 'Thresholds, windows and model options per module',
        controls: 'Sliders with value boxes, radio groups, toggles, chips',
      },
      {
        id: 'alerts',
        label: 'Alerts & rules',
        icon: BellRing,
        description: 'Rules that turn detections into alerts, who hears about them and when they escalate.',
        editors: 'Administrators, Security supervisors',
        purpose: 'When to alert, whom to notify, how to escalate',
        controls: 'Rules table with inline toggles, sentence-style rule builder',
      },
    ],
  },
  {
    id: 'people',
    label: 'People',
    sections: [
      {
        id: 'users',
        label: 'Users & roles',
        icon: Users,
        description: 'Who can sign in, what each role can do and invitations waiting to be accepted.',
        editors: 'Administrators',
        purpose: 'Accounts, roles and permissions',
        controls: 'Tabs, users table, permission matrix, invite modal',
      },
    ],
  },
  {
    id: 'platform',
    label: 'Platform',
    sections: [
      {
        id: 'integrations',
        label: 'Integrations',
        icon: Plug,
        description: 'Connect VisionEdge to email, SMS, sign-on, access control and your own systems.',
        editors: 'Administrators',
        purpose: 'Outbound notifications, sign-on, APIs and webhooks',
        controls: 'Integration cards, API keys table, webhook settings',
      },
      {
        id: 'privacy',
        label: 'Data & privacy',
        icon: Lock,
        description: 'How long data is kept, who can see personal data and data requests.',
        editors: 'Administrators (some rows locked by policy)',
        purpose: 'Retention, privacy controls and data requests',
        controls: 'Selects, toggles, locked rows, Danger zone',
      },
      {
        id: 'audit',
        label: 'Audit log',
        icon: History,
        description: 'Every change to settings, users and rules. All times IST.',
        editors: 'Read-only',
        purpose: 'Who changed what, and when',
        controls: 'Filters, expandable rows with before → after',
      },
      {
        id: 'system',
        label: 'System',
        icon: Server,
        description: 'Software version, maintenance window, edge devices and backups.',
        editors: 'Administrators',
        purpose: 'Updates, maintenance and backups',
        controls: 'Selects, edge device table, Danger zone',
      },
    ],
  },
];

export const SETTINGS_SECTIONS: SettingsSectionMeta[] = SETTINGS_GROUPS.flatMap((g) => g.sections);

export const getSettingsSection = (id: SettingsSectionId): SettingsSectionMeta =>
  SETTINGS_SECTIONS.find((s) => s.id === id) ?? SETTINGS_SECTIONS[0];

export const isSettingsSection = (value: string | null | undefined): value is SettingsSectionId =>
  SETTINGS_SECTIONS.some((s) => s.id === value);

/* ── Roles ───────────────────────────────────────────────────────── */

export type SettingsRole = 'admin' | 'viewer';
export const isSettingsRole = (value: string | null | undefined): value is SettingsRole => value === 'admin' || value === 'viewer';

/* ── States ──────────────────────────────────────────────────────── */

export type SettingsStateId =
  | 'default'
  | 'loading'
  | 'unsaved'
  | 'validation'
  | 'saving'
  | 'saved'
  | 'search'
  | 'drawer'
  | 'rule-builder'
  | 'integration-error'
  | 'api-key-created'
  | 'destructive'
  | 'empty'
  | 'viewer';

export interface SettingsStateMeta {
  id: SettingsStateId;
  label: string;
  trigger: string;
  behaviour: string;
  section: SettingsSectionId;
}

export const SETTINGS_STATES: SettingsStateMeta[] = [
  { id: 'default', label: 'Default', trigger: 'Opening Settings', behaviour: 'General section with every setting saved; problem counts in the section nav.', section: 'general' },
  { id: 'loading', label: 'Loading', trigger: 'First load', behaviour: 'Nav and card skeletons; the layout stays fixed so nothing jumps.', section: 'general' },
  { id: 'unsaved', label: 'Unsaved changes', trigger: 'Settings changed, not saved', behaviour: '3 rows in Detection & AI show a Royal Blue bar and "Modified"; the sticky bar offers Discard and Save changes.', section: 'detection' },
  { id: 'validation', label: 'Validation error', trigger: 'A value is invalid', behaviour: 'Specific messages under the controls, e.g. "End time must be after start time"; Save moves focus to the first error.', section: 'general' },
  { id: 'saving', label: 'Saving', trigger: '"Save changes" pressed', behaviour: 'Primary shows a spinner and "Saving…"; controls are read-only.', section: 'detection' },
  { id: 'saved', label: 'Saved', trigger: 'Save succeeded', behaviour: 'The bar slides away and a "Settings saved" toast offers Undo for 5 seconds.', section: 'detection' },
  { id: 'search', label: 'Search results', trigger: 'Typing in "Search settings…"', behaviour: 'Results from every section, grouped by section with the match highlighted; choosing one jumps to the row.', section: 'general' },
  { id: 'drawer', label: 'Drawer open', trigger: '"Add camera"', behaviour: '560px drawer with a sticky footer; Test connection checks the stream before saving.', section: 'cameras' },
  { id: 'rule-builder', label: 'Rule builder', trigger: '"Create rule"', behaviour: 'WHEN → IF → THEN → ESCALATE blocks with a live plain-English summary.', section: 'alerts' },
  { id: 'integration-error', label: 'Integration error', trigger: 'A connected service fails', behaviour: 'The SMS gateway card shows Error with the reason and "Fix now"; the nav shows a count.', section: 'integrations' },
  { id: 'api-key-created', label: 'API key created', trigger: 'A new API key', behaviour: 'The full key is shown once with Copy and a warning; afterwards it is masked.', section: 'integrations' },
  { id: 'destructive', label: 'Destructive confirmation', trigger: 'Revoke API key', behaviour: 'The confirmation repeats the action ("Revoke key"); nothing changes until confirmed.', section: 'integrations' },
  { id: 'empty', label: 'Empty', trigger: 'No sites yet', behaviour: 'Sites & locations explains what to do next with one "Add site" action.', section: 'sites' },
  { id: 'viewer', label: 'Viewer (read-only)', trigger: 'A non-administrator opens Settings', behaviour: 'Info banner; every control disabled but visible; Primary and Destructive actions hidden; secrets fully masked.', section: 'general' },
];

export const isSettingsState = (value: string | null | undefined): value is SettingsStateId =>
  SETTINGS_STATES.some((s) => s.id === value);

export const getSettingsState = (id: SettingsStateId): SettingsStateMeta =>
  SETTINGS_STATES.find((s) => s.id === id) ?? SETTINGS_STATES[0];

/** The Viewer state always uses the viewer role. */
export const roleForState = (state: SettingsStateId, requested: SettingsRole): SettingsRole => (state === 'viewer' ? 'viewer' : requested);

export const SAVE_DELAY_MS = 1200;
export const UNDO_MS = 5000;
export const FLASH_MS = 600;
