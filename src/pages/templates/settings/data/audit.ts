/** Audit log: 40 deterministic rows with before → after values. Now = 30 Sep 2026, 14:05 IST. */
import { hashSeed, pad2, pick, seeded } from '../../dashboard/data/seed';
import { maskIp } from '../../profile/data/sessions';

export type AuditAction = 'Setting changed' | 'User' | 'Alert rule' | 'Camera' | 'Integration' | 'Sign-in';
export const AUDIT_ACTIONS: AuditAction[] = ['Setting changed', 'User', 'Alert rule', 'Camera', 'Integration', 'Sign-in'];

export interface AuditRow {
  id: string;
  day: number;
  minute: number;
  time: string;
  user: string;
  initials: string;
  action: AuditAction;
  verb: string;
  target: string;
  before: string[];
  after: string[];
  ip: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TODAY = Date.UTC(2026, 8, 30);
const USERS: [string, string][] = [
  ['Priya Sharma', 'PS'],
  ['Rahul Mehta', 'RM'],
  ['Arjun Nair', 'AN'],
  ['Meera Joshi', 'MJ'],
];
const IPS = ['103.21.58.140', '49.36.112.7', '103.21.58.162', '157.32.204.51'];

type Template = { action: AuditAction; verb: string; target: string; before: string[]; after: string[] };

const TEMPLATES: Template[] = [
  { action: 'Setting changed', verb: 'Changed', target: 'Detection & AI › Night mode enhancement', before: ['night_mode: on'], after: ['night_mode: off'] },
  { action: 'Setting changed', verb: 'Changed', target: 'Detection & AI › Processing', before: ['processing: cloud'], after: ['processing: edge'] },
  { action: 'Setting changed', verb: 'Changed', target: 'Data & privacy › Video recordings', before: ['retention: 15 days'], after: ['retention: 30 days'] },
  { action: 'User', verb: 'Changed role', target: 'Arjun Nair', before: ['role: Operator'], after: ['role: Security supervisor'] },
  { action: 'User', verb: 'Invited', target: 'divya.rao@pit.edu.in', before: ['—'], after: ['role: Operator', 'sites: Main campus'] },
  { action: 'Alert rule', verb: 'Edited', target: 'Camera offline > 5 min', before: ['notify: Operators', 'escalate: off'], after: ['notify: Administrators', 'escalate: 10 min'] },
  { action: 'Alert rule', verb: 'Turned off', target: 'Low-confidence reads', before: ['enabled: true'], after: ['enabled: false'] },
  { action: 'Camera', verb: 'Restarted', target: 'CAM-07', before: ['status: offline'], after: ['status: online'] },
  { action: 'Camera', verb: 'Edited', target: 'CAM-12', before: ['recording: continuous'], after: ['recording: events only'] },
  { action: 'Integration', verb: 'Updated', target: 'Webhooks', before: ['events: 2'], after: ['events: 3'] },
  { action: 'Sign-in', verb: 'Signed in', target: 'Web app', before: ['—'], after: ['—'] },
];

let cache: AuditRow[] | null = null;

export function getAudit(): AuditRow[] {
  if (cache) return cache;
  // The seed keeps its original "generic" suffix so the sample rows stay exactly the same.
  const rand = seeded(hashSeed('settings-audit-generic'));
  const templates = TEMPLATES;
  let day = 0;
  let minute = 14 * 60 + 2;
  const rows = Array.from({ length: 40 }, (_, i): AuditRow => {
    if (i > 0) {
      minute -= 30 + Math.floor(rand() * 240);
      if (minute < 8 * 60) {
        day += 1 + Math.floor(rand() * 2);
        minute = 19 * 60 + Math.floor(rand() * 120);
      }
    }
    const t = templates[i < templates.length ? i : Math.floor(rand() * templates.length)];
    const [user, initials] = i < 3 ? USERS[0] : pick(rand, USERS);
    const d = new Date(TODAY - day * 86_400_000);
    return {
      id: `audit-${i}`,
      day,
      minute,
      time: `${pad2(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]} 2026, ${pad2(Math.floor(minute / 60))}:${pad2(minute % 60)}`,
      user,
      initials,
      ...t,
      ip: maskIp(IPS[Math.floor(rand() * IPS.length)]),
    };
  });
  cache = rows;
  return rows;
}
