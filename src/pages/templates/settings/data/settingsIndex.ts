/**
 * Every setting row (and searchable item) in one index: ids, labels, descriptions, defaults
 * and, for module rows, the module. Sections render rows by id; search reads this list.
 */
import type { ModuleId } from './system';
import { SettingsSectionId, getSettingsSection } from '../settingsStates';

export type SettingValue = string | number | boolean | string[];
export type SettingValues = Record<string, SettingValue>;

export interface SettingDef {
  id: string;
  section: SettingsSectionId;
  /** Card the row sits in. */
  card: string;
  label: string;
  description: string;
  /** Extra search terms. */
  keywords?: string;
  /** Module-specific row (Detection & AI module cards). */
  module?: ModuleId;
  /** Managed by license or policy: the reason shown in the tooltip. */
  locked?: string;
  /** Searchable item that is not a form value (tables, actions). */
  item?: boolean;
}

export interface Option {
  value: string;
  label: string;
}

/* ── Options ─────────────────────────────────────────────────────── */

export const OPTIONS = {
  industry: [
    { value: 'education', label: 'Education' },
    { value: 'corporate', label: 'Corporate campus' },
    { value: 'residential', label: 'Residential' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'other', label: 'Other' },
  ],
  timezone: [
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST, UTC+05:30)' },
    { value: 'Asia/Dubai', label: 'Asia/Dubai (GST, UTC+04:00)' },
    { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT, UTC+08:00)' },
  ],
  dateFormat: [
    { value: 'dd-mmm-yyyy', label: 'DD MMM YYYY (30 Sep 2026)' },
    { value: 'dd-mm-yyyy', label: 'DD-MM-YYYY (30-09-2026)' },
    { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD (2026-09-30)' },
  ],
  timeFormat: [
    { value: '24h', label: '24-hour (14:05)' },
    { value: '12h', label: '12-hour (2:05 PM)' },
  ],
  language: [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिन्दी' },
    { value: 'mr', label: 'मराठी' },
  ],
  weekStart: [
    { value: 'monday', label: 'Monday' },
    { value: 'sunday', label: 'Sunday' },
  ],
  days: [
    { value: 'mon', label: 'Mon' },
    { value: 'tue', label: 'Tue' },
    { value: 'wed', label: 'Wed' },
    { value: 'thu', label: 'Thu' },
    { value: 'fri', label: 'Fri' },
    { value: 'sat', label: 'Sat' },
    { value: 'sun', label: 'Sun' },
  ],
  processing: [
    { value: 'edge', label: 'Edge device' },
    { value: 'cloud', label: 'Cloud' },
    { value: 'hybrid', label: 'Hybrid' },
  ],
  plateFormats: [
    { value: 'indian', label: 'Indian standard' },
    { value: 'bh', label: 'BH series' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'diplomatic', label: 'Diplomatic' },
  ],
  watchlist: [
    { value: 'exact', label: 'Exact match' },
    { value: 'fuzzy', label: 'Allow 1 character difference' },
  ],
  duplicateSeconds: [
    { value: '10', label: '10 s' },
    { value: '30', label: '30 s' },
    { value: '60', label: '60 s' },
    { value: '120', label: '120 s' },
  ],
  minutes: (values: number[]): Option[] => values.map((v) => ({ value: String(v), label: `${v} min` })),
  hours: (values: number[]): Option[] => values.map((v) => ({ value: String(v), label: `${v} h` })),
  clip: [
    { value: '10', label: '10 s' },
    { value: '20', label: '20 s' },
    { value: '30', label: '30 s' },
  ],
  snapshot: [
    { value: '1', label: 'Every 1 s' },
    { value: '5', label: 'Every 5 s' },
    { value: '10', label: 'Every 10 s' },
  ],
  video: [7, 15, 30, 90].map((d) => ({ value: String(d), label: `${d} days` })),
  snapshots: [30, 90, 180].map((d) => ({ value: String(d), label: `${d} days` })),
  events: [1, 2, 5].map((y) => ({ value: String(y), label: `${y} year${y === 1 ? '' : 's'}` })),
  auditRetention: [{ value: '2', label: '2 years' }],
  maintDay: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((d) => ({ value: d, label: d[0].toUpperCase() + d.slice(1) })),
  duration: [1, 2, 4].map((h) => ({ value: String(h), label: `${h} h` })),
  backup: [
    { value: 'daily-0200', label: 'Daily at 02:00' },
    { value: 'daily-2300', label: 'Daily at 23:00' },
    { value: 'weekly', label: 'Weekly on Sunday at 02:00' },
  ],
} as const;

/** "00:00" … "23:30" in 30-minute steps. */
export const TIMES: Option[] = Array.from({ length: 48 }, (_, i) => {
  const t = `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`;
  return { value: t, label: t };
});

/* ── Rows ────────────────────────────────────────────────────────── */

export const SETTING_DEFS: SettingDef[] = [
  // General
  { id: 'org.name', section: 'general', card: 'Organization', label: 'Organization name', description: 'Shown in the product header, reports and emails.' },
  { id: 'org.short', section: 'general', card: 'Organization', label: 'Short name', description: 'Used where space is tight, like SMS alerts. Up to 12 characters.' },
  { id: 'org.logo', section: 'general', card: 'Organization', label: 'Organization logo', description: 'Shown in reports and emails next to the VisionEdge logo.', keywords: 'image brand upload' },
  { id: 'org.industry', section: 'general', card: 'Organization', label: 'Industry', description: 'Tunes suggested rules and report templates.' },
  { id: 'regional.timezone', section: 'general', card: 'Regional', label: 'Time zone', description: 'All times in the product, alerts and reports use this zone.', keywords: 'IST clock' },
  { id: 'regional.dateFormat', section: 'general', card: 'Regional', label: 'Date format', description: 'How dates appear in tables, exports and emails.' },
  { id: 'regional.timeFormat', section: 'general', card: 'Regional', label: 'Time format', description: 'Applies to everyone in the organization.', keywords: '12h 24h clock' },
  { id: 'regional.language', section: 'general', card: 'Regional', label: 'Default language', description: 'New users start in this language; each user can change it.' },
  { id: 'regional.weekStart', section: 'general', card: 'Regional', label: 'Week starts on', description: 'Used by weekly reports and calendars.' },
  { id: 'hours.days', section: 'general', card: 'Working hours', label: 'Working days', description: 'Rules set to "Working hours" only run on these days.', keywords: 'schedule business' },
  { id: 'hours.time', section: 'general', card: 'Working hours', label: 'Working hours', description: 'Start and end time on working days.', keywords: 'schedule shift' },
  { id: 'hours.holidays', section: 'general', card: 'Working hours', label: 'Holidays', description: 'Days treated as non-working, even on a working day.', item: true },
  { id: 'contact.supportEmail', section: 'general', card: 'Contact', label: 'Support email', description: 'Where users are sent when they need help.' },
  { id: 'contact.emergency', section: 'general', card: 'Contact', label: 'Emergency contact number', description: 'Called by VisionEdge support for critical system issues.', keywords: 'phone mobile' },
  // Sites, license, cameras
  { id: 'sites.table', section: 'sites', card: 'Sites', label: 'Sites', description: 'Campuses and buildings with their cameras, gates and zones.', keywords: 'campus location address zone gate', item: true },
  { id: 'license.plan', section: 'license', card: 'Plan', label: 'Plan', description: 'Enterprise plan, license ID and renewal date.', keywords: 'subscription renewal', item: true },
  { id: 'license.usage', section: 'license', card: 'Usage', label: 'Usage', description: 'Cameras, users, storage and edge devices against your limits.', keywords: 'limit quota storage', item: true },
  { id: 'license.modules', section: 'license', card: 'Enabled modules', label: 'Enabled modules', description: 'Modules included in your license.', item: true },
  { id: 'cameras.table', section: 'cameras', card: 'Cameras', label: 'Cameras', description: 'Every camera with its site, type, stream and status.', keywords: 'stream rtsp offline restart', item: true },
  // Detection: General detection
  { id: 'det.model', section: 'detection', card: 'General detection', label: 'Model version', description: 'The detection model running on your edge devices.', keywords: 'release ai', item: true },
  { id: 'det.processing', section: 'detection', card: 'General detection', label: 'Processing', description: 'Where video is analysed. Edge keeps video on site.', keywords: 'cloud hybrid edge' },
  { id: 'det.night', section: 'detection', card: 'General detection', label: 'Night mode enhancement', description: 'Improves low-light reads. Uses about 10% more processing.' },
  { id: 'det.motion', section: 'detection', card: 'General detection', label: 'Motion sensitivity', description: 'Higher values catch smaller movement but raise more events.' },
  { id: 'det.clip', section: 'detection', card: 'General detection', label: 'Event clip length', description: 'Video kept around each event.' },
  { id: 'det.snapshot', section: 'detection', card: 'General detection', label: 'Snapshot interval', description: 'How often a still is saved during an event.' },
  // Module settings: ANPR
  { id: 'det.anpr.confidence', section: 'detection', card: 'ANPR', label: 'Confidence threshold', description: 'Reads below this are marked for review instead of matched.', module: 'anpr', keywords: 'accuracy plate' },
  { id: 'det.anpr.formats', section: 'detection', card: 'ANPR', label: 'Plate formats', description: 'Formats the reader expects. Fewer formats means fewer false reads.', module: 'anpr' },
  { id: 'det.anpr.watchlist', section: 'detection', card: 'ANPR', label: 'Watchlist matching', description: 'How closely a read must match a watchlist plate.', module: 'anpr' },
  { id: 'det.anpr.duplicate', section: 'detection', card: 'ANPR', label: 'Duplicate read window', description: 'Reads of the same plate within this window count once.', module: 'anpr' },
  { id: 'det.anpr.capture', section: 'detection', card: 'ANPR', label: 'Capture image with each read', description: 'Stores a snapshot with every plate read.', module: 'anpr', keywords: 'snapshot photo' },
  // HostelTrack
  { id: 'det.hostel.face', section: 'detection', card: 'HostelTrack', label: 'Face match threshold', description: 'Matches below this are sent to the warden to confirm.', module: 'hosteltrack', keywords: 'accuracy' },
  { id: 'det.hostel.curfew', section: 'detection', card: 'HostelTrack', label: 'Curfew time', description: 'Entries after this time are late.', module: 'hosteltrack' },
  { id: 'det.hostel.grace', section: 'detection', card: 'HostelTrack', label: 'Late-entry grace period', description: 'Entries within this time after curfew are not flagged.', module: 'hosteltrack' },
  { id: 'det.hostel.multiple', section: 'detection', card: 'HostelTrack', label: 'Multiple-entry detection window', description: 'Repeated entries by one student within this window are flagged.', module: 'hosteltrack' },
  { id: 'det.hostel.liveness', section: 'detection', card: 'HostelTrack', label: 'Liveness check', description: 'Rejects photos and screens held up to the camera.', module: 'hosteltrack', keywords: 'spoof' },
  // Meal Pulse
  { id: 'det.meal.windows', section: 'detection', card: 'Meal Pulse', label: 'Meal windows', description: 'When each meal is served. Counts outside these windows are not recorded.', module: 'mealpulse', keywords: 'breakfast lunch dinner snacks' },
  { id: 'det.meal.onePerWindow', section: 'detection', card: 'Meal Pulse', label: 'One meal per window', description: 'A second attempt in the same window is flagged as a duplicate.', module: 'mealpulse' },
  { id: 'det.meal.duplicate', section: 'detection', card: 'Meal Pulse', label: 'Duplicate attempt window', description: 'Attempts by one diner within this time count as duplicates.', module: 'mealpulse' },
  { id: 'det.meal.queue', section: 'detection', card: 'Meal Pulse', label: 'Queue-time alert threshold', description: 'Alert when the estimated wait passes this time.', module: 'mealpulse' },
  // Visitor
  { id: 'det.visitor.validity', section: 'detection', card: 'Visitor Management', label: 'Default pass validity', description: 'How long a visitor pass stays valid after check-in.', module: 'visitor' },
  { id: 'det.visitor.overstay', section: 'detection', card: 'Visitor Management', label: 'Overstay threshold', description: 'Alert when a visitor stays this long past their pass.', module: 'visitor' },
  { id: 'det.visitor.hostNotify', section: 'detection', card: 'Visitor Management', label: 'Host notification on arrival', description: 'Tells the host as soon as their visitor checks in.', module: 'visitor' },
  { id: 'det.visitor.preApproval', section: 'detection', card: 'Visitor Management', label: 'Pre-approval required', description: 'Walk-in visitors wait at reception until a host approves.', module: 'visitor' },
  { id: 'det.visitor.photo', section: 'detection', card: 'Visitor Management', label: 'Visitor photo capture', description: 'Takes a photo at check-in for the visitor pass.', module: 'visitor' },
  // Alerts, users, integrations
  { id: 'alerts.rules', section: 'alerts', card: 'Rules', label: 'Alert rules', description: 'When to alert, whom to notify and how to escalate.', keywords: 'notification escalate trigger', item: true },
  { id: 'users.users', section: 'users', card: 'Users', label: 'Users', description: 'Everyone who can sign in, their role and sites.', keywords: 'people accounts invite', item: true },
  { id: 'users.roles', section: 'users', card: 'Roles & permissions', label: 'Roles & permissions', description: 'What each role can see and do.', keywords: 'permission matrix access', item: true },
  { id: 'users.invites', section: 'users', card: 'Invitations', label: 'Invitations', description: 'Invites waiting to be accepted.', item: true },
  { id: 'int.cards', section: 'integrations', card: 'Integrations', label: 'Connected services', description: 'Email, SMS, sign-on, access controllers and data export.', keywords: 'smtp sms saml sso webhook barrier', item: true },
  { id: 'int.apiKeys', section: 'integrations', card: 'API keys', label: 'API keys', description: 'Keys for your own systems to call the VisionEdge API.', keywords: 'token secret', item: true },
  { id: 'webhook.url', section: 'integrations', card: 'Webhooks', label: 'Endpoint URL', description: 'Where VisionEdge sends event notifications.', keywords: 'webhook https' },
  { id: 'webhook.events', section: 'integrations', card: 'Webhooks', label: 'Events', description: 'Which events are sent to the endpoint.', keywords: 'webhook' },
  // Data & privacy
  { id: 'retention.video', section: 'privacy', card: 'Retention', label: 'Video recordings', description: 'Recordings older than this are deleted every night.', keywords: 'retention storage keep delete' },
  { id: 'retention.snapshots', section: 'privacy', card: 'Retention', label: 'Event snapshots', description: 'Stills captured with events.', keywords: 'retention' },
  { id: 'retention.events', section: 'privacy', card: 'Retention', label: 'Event records', description: 'Detections, alerts and acknowledgements.', keywords: 'retention' },
  { id: 'retention.audit', section: 'privacy', card: 'Retention', label: 'Audit logs', description: 'Changes to settings, users and rules.', keywords: 'retention', locked: 'Set by your organization’s data policy. Contact VisionEdge support to change it.' },
  { id: 'privacy.blurFaces', section: 'privacy', card: 'Privacy', label: 'Blur faces in exports', description: 'Faces are blurred in exported clips and snapshots.' },
  { id: 'privacy.maskPlates', section: 'privacy', card: 'Privacy', label: 'Mask number plates in shared reports', description: 'Plates in shared reports show only the last 4 characters.' },
  { id: 'privacy.personalData', section: 'privacy', card: 'Privacy', label: 'Show personal data only to authorized roles', description: 'Names, photos and plates are hidden from roles without permission.', locked: 'Required by your data policy, so it stays on.' },
  { id: 'privacy.requests', section: 'privacy', card: 'Data requests', label: 'Data subject requests', description: 'Access and erasure requests under the DPDP Act, 2023.', keywords: 'dpdp gdpr export erasure', item: true },
  { id: 'privacy.purge', section: 'privacy', card: 'Danger zone', label: 'Purge recordings', description: 'Permanently delete recordings older than a date.', keywords: 'delete', item: true },
  // Audit, system
  { id: 'audit.table', section: 'audit', card: 'Audit log', label: 'Audit log', description: 'Every change, with before and after values.', keywords: 'history changes', item: true },
  { id: 'system.version', section: 'system', card: 'Version', label: 'Software version', description: 'VisionEdge and edge firmware versions.', keywords: 'update firmware', item: true },
  { id: 'maint.window', section: 'system', card: 'Maintenance window', label: 'Maintenance window', description: 'When updates and restarts may run. Live monitoring may pause.', keywords: 'update schedule' },
  { id: 'system.edge', section: 'system', card: 'Edge devices', label: 'Edge devices', description: 'On-site processors with their load and temperature.', keywords: 'cpu gpu temperature', item: true },
  { id: 'backup.schedule', section: 'system', card: 'Backups', label: 'Backup schedule', description: 'Settings and event records are backed up on this schedule.' },
];

export const getDef = (id: string): SettingDef | undefined => SETTING_DEFS.find((d) => d.id === id);

/* ── Defaults ────────────────────────────────────────────────────── */

export const MEAL_WINDOWS = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'] as const;

export const defaultValues = (): SettingValues => ({
  'org.name': 'Pune Institute of Technology',
  'org.short': 'PIT',
  'org.logo': '',
  'org.industry': 'education',
  'regional.timezone': 'Asia/Kolkata',
  'regional.dateFormat': 'dd-mmm-yyyy',
  'regional.timeFormat': '24h',
  'regional.language': 'en',
  'regional.weekStart': 'monday',
  'hours.days': ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
  'hours.from': '08:00',
  'hours.to': '18:00',
  'contact.supportEmail': 'security@pit.edu.in',
  'contact.emergency': '9876501234',
  'det.processing': 'edge',
  'det.night': true,
  'det.anpr.confidence': 85,
  'det.anpr.formats': ['indian', 'bh', 'temporary'],
  'det.anpr.watchlist': 'exact',
  'det.anpr.duplicate': '30',
  'det.anpr.capture': true,
  'det.hostel.face': 92,
  'det.hostel.curfew': '22:00',
  'det.hostel.grace': '15',
  'det.hostel.multiple': '5',
  'det.hostel.liveness': true,
  'det.meal.windows': ['07:00-09:30', '12:00-14:30', '16:30-17:30', '19:30-21:30'],
  'det.meal.onePerWindow': true,
  'det.meal.duplicate': '10',
  'det.meal.queue': '8',
  'det.visitor.validity': '4',
  'det.visitor.overstay': '30',
  'det.visitor.hostNotify': true,
  'det.visitor.preApproval': false,
  'det.visitor.photo': true,
  'det.motion': 60,
  'det.clip': '20',
  'det.snapshot': '5',
  'webhook.url': 'https://ops.pit.edu.in/hooks/visionedge',
  'webhook.events': ['alert.created', 'alert.acknowledged', 'camera.offline'],
  'retention.video': '30',
  'retention.snapshots': '90',
  'retention.events': '2',
  'retention.audit': '2',
  'privacy.blurFaces': true,
  'privacy.maskPlates': false,
  'privacy.personalData': true,
  'maint.day': 'sunday',
  'maint.time': '02:00',
  'maint.duration': '2',
  'backup.schedule': 'daily-0200',
});

/** Values for the "Unsaved changes" state: 3 rows in General detection changed. */
export const UNSAVED_CHANGES: SettingValues = { 'det.motion': 75, 'det.clip': '30', 'det.night': false };

/** Values for the "Validation error" state (General). */
export const INVALID_VALUES: SettingValues = { 'hours.from': '18:00', 'hours.to': '09:00', 'contact.supportEmail': 'security@pit' };

/** Form settings a row id covers (a row can hold more than one value, e.g. working hours). */
export const ROW_VALUE_IDS: Record<string, string[]> = {
  'hours.time': ['hours.from', 'hours.to'],
  'maint.window': ['maint.day', 'maint.time', 'maint.duration'],
};
export const valueIdsOf = (rowId: string): string[] => ROW_VALUE_IDS[rowId] ?? [rowId];
export const rowOfValue = (valueId: string): string =>
  Object.entries(ROW_VALUE_IDS).find(([, ids]) => ids.includes(valueId))?.[0] ?? valueId;

/* ── Validation ──────────────────────────────────────────────────── */

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Errors by row id. */
export function validateSettings(values: SettingValues): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = String(values['org.name'] ?? '').trim();
  if (!name) errors['org.name'] = 'Enter your organization’s name';
  const short = String(values['org.short'] ?? '').trim();
  if (!short) errors['org.short'] = 'Enter a short name';
  else if (short.length > 12) errors['org.short'] = 'Use 12 characters or fewer';
  if (String(values['hours.to']) <= String(values['hours.from'])) errors['hours.time'] = 'End time must be after start time';
  if ((values['hours.days'] as string[]).length === 0) errors['hours.days'] = 'Choose at least one working day';
  if (!isEmail(String(values['contact.supportEmail'] ?? ''))) errors['contact.supportEmail'] = 'Enter a valid email, like security@pit.edu.in';
  const phone = String(values['contact.emergency'] ?? '');
  if (phone.length !== 10) errors['contact.emergency'] = 'Enter a 10-digit mobile number';
  const url = String(values['webhook.url'] ?? '');
  if (!/^https:\/\/\S+\.\S+/.test(url)) errors['webhook.url'] = 'Enter a URL starting with https://';
  const windows = values['det.meal.windows'] as string[];
  windows.forEach((w, i) => {
    const [from, to] = w.split('-');
    if (to <= from) errors['det.meal.windows'] = `${MEAL_WINDOWS[i]}: end time must be after start time`;
  });
  return errors;
}

/* ── Search ──────────────────────────────────────────────────────── */

export interface SearchGroup {
  section: SettingsSectionId;
  sectionLabel: string;
  results: SettingDef[];
}

export function searchSettings(query: string): SearchGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const groups = new Map<SettingsSectionId, SettingDef[]>();
  for (const d of SETTING_DEFS) {
    const haystack = `${d.label} ${d.description} ${d.card} ${d.keywords ?? ''} ${getSettingsSection(d.section).label}`.toLowerCase();
    if (!haystack.includes(q)) continue;
    groups.set(d.section, [...(groups.get(d.section) ?? []), d]);
  }
  return [...groups.entries()].map(([section, results]) => ({ section, sectionLabel: getSettingsSection(section).label, results }));
}
