/** 64 deterministic vehicle-log rows shared by every table pattern (seeded, never Math.random). */

export type VehicleStatus = 'verified' | 'processing' | 'blacklisted' | 'guest';

export interface VehicleRow {
  id: string;
  plate: string;
  driver: string;
  gate: string;
  vehicleType: string;
  status: VehicleStatus;
  /** Days before today (0 = today). */
  daysAgo: number;
  /** Minutes after midnight IST. */
  minute: number;
  /** "14:05" today, otherwise "28 Sep, 14:05". */
  time: string;
  confidence: number;
  velocity: number;
  /* Expanded-row details */
  cameraId: string;
  direction: 'Entry' | 'Exit';
  color: string;
  lane: number;
  recordedBy: string;
}

export const STATUS_LABEL: Record<VehicleStatus, string> = {
  verified: 'Verified',
  processing: 'Processing',
  blacklisted: 'Blacklisted',
  guest: 'Guest permit',
};

/** Sort order for Status (ascending): most urgent first. */
export const STATUS_ORDER: VehicleStatus[] = ['blacklisted', 'processing', 'guest', 'verified'];

export const STATUSES: VehicleStatus[] = ['verified', 'processing', 'blacklisted', 'guest'];

export const GATES = ['Gate 1 – North', 'Gate 2 – Main', 'Gate 3 – East', 'Gate 4 – Service', 'Gate 5 – Hostel', 'Gate 6 – South'];

const DRIVERS = [
  'Rahul Mehta', 'Anjali Kulkarni', 'Vikram Desai', 'Sneha Patil', 'Arjun Nair', 'Meera Joshi', 'Karan Gupta', 'Divya Rao',
  'Nikhil Shah', 'Pooja Iyer', 'Rohan Bhat', 'Ishita Sen', 'Aditya Kapoor', 'Neha Verma', 'Siddharth Rao', 'Kavya Menon',
  'Unknown driver', 'Delivery – BlueDart', 'Visitor – Pre-approved', 'Staff shuttle',
];
const TYPES = ['Car', 'SUV', 'Two-wheeler', 'Van', 'Truck', 'Bus'];
const COLORS = ['White', 'Silver', 'Black', 'Grey', 'Blue', 'Red'];
const STATES = ['MH12', 'MH14', 'KA01', 'KA03', 'DL3C', 'GJ01', 'TN09', 'MH04'];
const LETTERS = ['AB', 'CD', 'EF', 'GH', 'JK', 'LM', 'NP', 'QR', 'ST', 'UV', 'WX', 'YZ'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TODAY_UTC = Date.UTC(2026, 8, 30);

/** Small deterministic generator (mulberry32). */
function seeded(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

export const dayLabel = (daysAgo: number): string => {
  const d = new Date(TODAY_UTC - daysAgo * 86_400_000);
  return `${pad(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]}`;
};

/** Fixed status mix: 41 Verified, 10 Processing, 5 Blacklisted, 8 Guest permit. */
const STATUS_MIX: VehicleStatus[] = [
  ...Array<VehicleStatus>(41).fill('verified'),
  ...Array<VehicleStatus>(10).fill('processing'),
  ...Array<VehicleStatus>(5).fill('blacklisted'),
  ...Array<VehicleStatus>(8).fill('guest'),
];

function build(): VehicleRow[] {
  const rand = seeded(20260930);
  const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)];
  // Shuffle the status mix deterministically.
  const statuses = [...STATUS_MIX];
  for (let i = statuses.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [statuses[i], statuses[j]] = [statuses[j], statuses[i]];
  }
  // 18 rows today (14:05 back to about 06:00), the other 46 spread over the previous 29 days.
  let todayMinute = 14 * 60 + 5;
  return Array.from({ length: 64 }, (_, i): VehicleRow => {
    let daysAgo: number;
    let minute: number;
    if (i < 18) {
      if (i > 0) todayMinute -= 8 + Math.floor(rand() * 20);
      daysAgo = 0;
      minute = todayMinute;
    } else {
      daysAgo = 1 + Math.floor(((i - 18) * 29) / 46);
      minute = 6 * 60 + Math.floor(rand() * 16 * 60);
    }
    const status = statuses[i];
    const type = pick(TYPES);
    const clock = `${pad(Math.floor(minute / 60))}:${pad(minute % 60)}`;
    return {
      id: `VL-${8800 + i}`,
      plate: `${pick(STATES)} ${pick(LETTERS)} ${1000 + Math.floor(rand() * 9000)}`,
      driver: status === 'guest' ? 'Visitor – Pre-approved' : pick(DRIVERS.slice(0, 18)),
      gate: pick(GATES),
      vehicleType: type,
      status,
      daysAgo,
      minute,
      time: daysAgo === 0 ? clock : `${dayLabel(daysAgo)}, ${clock}`,
      confidence: status === 'processing' ? 62 + Math.floor(rand() * 18) : 86 + Math.floor(rand() * 14),
      velocity: type === 'Two-wheeler' ? 12 + Math.floor(rand() * 14) : 8 + Math.floor(rand() * 26),
      cameraId: `CAM-${pad(1 + Math.floor(rand() * 24))}`,
      direction: rand() < 0.55 ? 'Entry' : 'Exit',
      color: pick(COLORS),
      lane: 1 + Math.floor(rand() * 3),
      recordedBy: rand() < 0.8 ? 'ANPR edge device' : 'Operator (manual)',
    };
  });
}

export const VEHICLES: VehicleRow[] = build();

/** Chronological value: larger = more recent. */
export const timeValue = (r: VehicleRow): number => -r.daysAgo * 1440 + r.minute;
