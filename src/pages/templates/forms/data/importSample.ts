/** Bulk import sample: a 263-row file with deterministic errors and duplicates. */
import { hashSeed, pick, seeded } from '../../dashboard/data/seed';

export const IMPORT_FILE = { name: 'records-sept-2026.csv', rows: 263, size: 48_200 };
export const MAX_ROWS = 5000;

export interface TargetField {
  value: string;
  label: string;
  required: boolean;
}

export const TARGET_FIELDS: TargetField[] = [
  { value: 'name', label: 'Name', required: true },
  { value: 'category', label: 'Category', required: true },
  { value: 'email', label: 'Email', required: true },
  { value: 'phone', label: 'Phone', required: false },
  { value: 'city', label: 'City', required: false },
  { value: 'state', label: 'State', required: false },
  { value: 'pin', label: 'PIN code', required: true },
];

export const SKIP = 'skip';

export interface SourceColumn {
  name: string;
  sample: string;
  /** Auto-matched field, or SKIP. */
  match: string;
}

export const SOURCE_COLUMNS: SourceColumn[] = [
  { name: 'Company Name', sample: 'Sharma Logistics', match: 'name' },
  { name: 'Type', sample: 'Vendor', match: 'category' },
  { name: 'E-mail', sample: 'accounts@sharma.in', match: 'email' },
  { name: 'Mobile', sample: '98220 14578', match: 'phone' },
  { name: 'Town', sample: 'Pune', match: SKIP },
  { name: 'State', sample: 'Maharashtra', match: 'state' },
  { name: 'Pincode', sample: '411026', match: SKIP },
  { name: 'Internal notes', sample: 'Call before visit', match: SKIP },
];

export const IMPORT_COUNTS = { ready: 248, errors: 12, duplicates: 3 };

export type RowIssue = 'error' | 'duplicate' | null;

export interface PreviewRow {
  row: number;
  name: string;
  category: string;
  email: string;
  pin: string;
  issue: RowIssue;
  /** Field with the problem and why. */
  problem?: { field: 'email' | 'pin' | 'name'; message: string };
}

const NAMES = ['Patil', 'Kulkarni', 'Iyer', 'Reddy', 'Khan', 'Shah', 'Menon', 'Das', 'Joshi', 'Gupta'];
const KINDS = ['Logistics', 'Electricals', 'Security', 'Supplies', 'Services', 'Infra'];

/** 30 preview rows: rows 4, 9, 15, 22 have errors; rows 12 and 27 are duplicates. */
export const PREVIEW_ROWS: PreviewRow[] = (() => {
  const rand = seeded(hashSeed('forms-import'));
  return Array.from({ length: 30 }, (_, i): PreviewRow => {
    const n = i + 2;
    const name = `${pick(rand, NAMES)} ${pick(rand, KINDS)}`;
    const base = { row: n, name, category: pick(rand, ['Vendor', 'Contractor', 'Partner']), email: `${name.split(' ')[0].toLowerCase()}@example.in`, pin: `4110${String(10 + i).padStart(2, '0')}` };
    if ([4, 9].includes(i)) return { ...base, email: base.email.replace('.in', ''), issue: 'error', problem: { field: 'email', message: 'Enter an email like name@example.in' } };
    if ([15, 22].includes(i)) return { ...base, pin: base.pin.slice(0, 5), issue: 'error', problem: { field: 'pin', message: 'Enter a 6-digit PIN code' } };
    if ([12, 27].includes(i)) return { ...base, name: 'Sharma Logistics', issue: 'duplicate', problem: { field: 'name', message: 'Same name and email as REC-2026-0098' } };
    return { ...base, issue: null };
  });
})();
