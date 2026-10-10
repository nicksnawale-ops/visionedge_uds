/**
 * Activity log: 30 deterministic rows per viewer (seeded, never Math.random).
 * "Now" in the demo is 30 Sep 2026, 14:05 IST, matching the Dashboard template.
 */
import { between, hashSeed, pad2, pick, seeded } from '../../dashboard/data/seed';
import type { ViewerMode } from '../profileStates';
import { maskIp } from './sessions';

export type ActivityType = 'Sign-in' | 'Settings change' | 'Alert action' | 'Export' | 'Access change';
export const ACTIVITY_TYPES: ActivityType[] = ['Sign-in', 'Settings change', 'Alert action', 'Export', 'Access change'];

export type ActivityRange = 'today' | '7d' | '30d';
export const ACTIVITY_RANGES: { id: ActivityRange; label: string; days: number }[] = [
  { id: 'today', label: 'Today', days: 0 },
  { id: '7d', label: '7 days', days: 6 },
  { id: '30d', label: '30 days', days: 29 },
];

export interface ActivityRow {
  id: string;
  /** Days before today (0 = today). */
  day: number;
  /** Minutes after midnight IST. */
  minute: number;
  /** "30 Sep 2026, 09:14" */
  time: string;
  /** Short form for the timeline: "09:14", "Yesterday", "28 Sep". */
  short: string;
  type: ActivityType;
  event: string;
  details: string;
  device: string;
  ip: string;
  result: 'Success' | 'Failed';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TODAY_UTC = Date.UTC(2026, 8, 30);

const dateOf = (day: number): { label: string; dayMonth: string } => {
  const d = new Date(TODAY_UTC - day * 86_400_000);
  const dayMonth = `${pad2(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]}`;
  return { label: `${dayMonth} ${d.getUTCFullYear()}`, dayMonth };
};

const clock = (minute: number): string => `${pad2(Math.floor(minute / 60))}:${pad2(minute % 60)}`;

const PLACES = ['Gate 3', 'Parking B', 'Library', 'Lab wing'];
const EXPORTS = ['Event log (7 days)', 'Camera health report', 'Alerts summary (30 days)'];

const DEVICES = [
  { name: 'Chrome on Windows', ip: '103.21.58.140' },
  { name: 'Safari on iPhone', ip: '49.36.112.7' },
  { name: 'Chrome on Android tablet', ip: '157.32.204.51' },
];
const CITIES = ['Pune', 'Pune', 'Pune', 'Mumbai'];
const SETTINGS = [
  ['Updated notification preferences', 'Email on for Daily summary report'],
  ['Changed date format', 'DD MMM YYYY'],
  ['Updated mobile number', '+91 98765 xxxxx'],
  ['Turned on sign-in alerts', 'New device sign-ins'],
  ['Changed default landing page', 'Dashboard'],
] as const;

const cache = new Map<string, ActivityRow[]>();

export function getActivity(viewer: ViewerMode): ActivityRow[] {
  // The seed key keeps its original "generic-" prefix so the sample rows stay exactly the same.
  const key = `generic-${viewer}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const rand = seeded(hashSeed(`profile-activity-${key}`));
  const grantor = viewer === 'self' ? 'Rahul Mehta' : 'Priya Sharma';
  const rows: ActivityRow[] = [];

  const push = (day: number, minute: number, type: ActivityType, event: string, details: string, deviceIndex: number, result: ActivityRow['result'] = 'Success') => {
    const date = dateOf(day);
    const device = DEVICES[deviceIndex];
    rows.push({
      id: `${key}-${rows.length}`,
      day,
      minute,
      time: `${date.label}, ${clock(minute)}`,
      short: day === 0 ? clock(minute) : day === 1 ? 'Yesterday' : date.dayMonth,
      type,
      event,
      details,
      device: device.name,
      ip: maskIp(device.ip),
      result,
    });
  };

  // The five most recent events are fixed so the Overview timeline reads well.
  push(0, viewer === 'self' ? 9 * 60 + 14 : 8 * 60 + 2, 'Sign-in', 'Signed in', `${DEVICES[0].name} · Pune`, 0);
  push(1, 17 * 60 + 42, 'Alert action', 'Acknowledged alert ALT-3021', PLACES[0], 0);
  push(2, 11 * 60 + 20, 'Export', 'Exported report', EXPORTS[0], 0);
  push(3, 18 * 60 + 5, 'Settings change', SETTINGS[0][0], SETTINGS[0][1], 1);
  push(4, 9 * 60 + 31, 'Access change', 'Site access updated', `North campus added by ${grantor}`, 0);

  // The rest: seeded, spread over the last 30 days, newest first.
  let day = 4;
  while (rows.length < 30) {
    day += rand() < 0.45 ? 0 : between(rand, 1, 2);
    if (day > 29) day = 29;
    const minute = between(rand, 7 * 60, 21 * 60);
    const deviceIndex = rand() < 0.65 ? 0 : rand() < 0.6 ? 1 : 2;
    const roll = rand();
    if (roll < 0.36) {
      const failed = rand() < 0.18;
      push(day, minute, 'Sign-in', failed ? 'Sign-in failed' : 'Signed in', failed ? 'Wrong password' : `${DEVICES[deviceIndex].name} · ${pick(rand, CITIES)}`, deviceIndex, failed ? 'Failed' : 'Success');
    } else if (roll < 0.62) {
      push(day, minute, 'Alert action', `Acknowledged alert ALT-${between(rand, 2700, 3019)}`, pick(rand, PLACES), deviceIndex);
    } else if (roll < 0.8) {
      const [event, details] = pick(rand, SETTINGS);
      push(day, minute, 'Settings change', event, details, deviceIndex);
    } else if (roll < 0.95) {
      push(day, minute, 'Export', 'Exported report', pick(rand, EXPORTS), 0);
    } else {
      push(day, minute, 'Access change', 'Camera access updated', `${between(rand, 2, 4)} cameras added by ${grantor}`, 0);
    }
  }

  // Newest first within each day too.
  rows.sort((a, b) => a.day - b.day || b.minute - a.minute);
  cache.set(key, rows);
  return rows;
}
