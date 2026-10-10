/** Notification preferences: generic event types in four groups, three channels, quiet hours and digest. */

export type Channel = 'inApp' | 'email' | 'sms';
export const CHANNELS: { id: Channel; label: string }[] = [
  { id: 'inApp', label: 'In-app' },
  { id: 'email', label: 'Email' },
  { id: 'sms', label: 'SMS' },
];

export interface NotificationEvent {
  id: string;
  label: string;
  /** Critical events always reach the user in the app (In-app locked on). */
  critical: boolean;
  /** Default channels. */
  defaults: Record<Channel, boolean>;
}

export interface NotificationGroup {
  id: string;
  label: string;
  events: NotificationEvent[];
}

const ev = (id: string, label: string, critical: boolean, email: boolean, sms: boolean): NotificationEvent => ({
  id,
  label,
  critical,
  defaults: { inApp: true, email, sms },
});

/** The same list in every VisionEdge product. */
export const NOTIFICATION_GROUPS: NotificationGroup[] = [
  {
    id: 'alerts',
    label: 'Alerts',
    events: [
      ev('critical-alert', 'Critical alert raised', true, true, true),
      ev('camera-offline', 'Camera offline', true, true, false),
      ev('alert-assigned', 'Alert assigned to me', false, true, false),
      ev('alert-escalated', 'Alert escalated', false, true, false),
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    events: [ev('report-ready', 'Scheduled report ready', false, true, false), ev('export-completed', 'Export completed', false, false, false)],
  },
  {
    id: 'account',
    label: 'Account & security',
    events: [
      ev('new-device', 'Sign-in from a new device', false, true, false),
      ev('password-changed', 'Password changed', false, true, false),
      ev('role-changed', 'Role or access changed', false, true, false),
    ],
  },
  {
    id: 'system',
    label: 'System',
    events: [ev('maintenance', 'Scheduled maintenance', false, true, false), ev('daily-summary', 'Daily summary', false, true, false)],
  },
];

export type NotificationMatrix = Record<string, Record<Channel, boolean>>;

export const defaultMatrix = (groups: NotificationGroup[]): NotificationMatrix =>
  Object.fromEntries(groups.flatMap((g) => g.events.map((e) => [e.id, { ...e.defaults }])));

export type DigestOption = 'off' | 'daily' | 'weekly';
export const DIGEST_OPTIONS: { id: DigestOption; label: string; hint: string }[] = [
  { id: 'off', label: 'Off', hint: 'Only individual notifications' },
  { id: 'daily', label: 'Daily at 08:00', hint: "Yesterday's events in one email" },
  { id: 'weekly', label: 'Weekly on Monday', hint: "Last week's events in one email" },
];

/** 30-minute steps for quiet hours: "00:00" … "23:30". */
export const QUIET_TIMES = Array.from({ length: 48 }, (_, i) => `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`);
