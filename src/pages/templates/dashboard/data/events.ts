/**
 * "Recent events" table: column definitions and 25 deterministic rows per use case.
 * Names, plates and IDs are fictional.
 */
import { between, hashSeed, pad2, pick, seeded } from './seed';
import type { UseCaseId } from './useCases';

export type StatusTone = 'live' | 'info' | 'critical' | 'neutral';

export interface EventStatus {
  label: string;
  tone: StatusTone;
}

export interface EventColumn {
  key: string;
  label: string;
  /** IDs, plates, times: JetBrains Mono. */
  mono?: boolean;
  /** Numbers: right-aligned, tabular. */
  numeric?: boolean;
  sortable?: boolean;
}

export interface EventRow {
  id: string;
  status: EventStatus;
  /** Minutes since midnight, for sorting by time. */
  sortTime: number;
  /** Cell values by column key. */
  [key: string]: string | number | EventStatus;
}

/** Text of a cell (column keys always hold strings). */
export const cellText = (row: EventRow, key: string): string => {
  const v = row[key];
  return typeof v === 'string' ? v : typeof v === 'number' ? String(v) : v.label;
};

export interface EventTable {
  columns: EventColumn[];
  rows: EventRow[];
  statuses: string[];
  noun: string;
}

const FIRST = ['Aarav', 'Ananya', 'Rohan', 'Isha', 'Kabir', 'Meera', 'Arjun', 'Diya', 'Vivaan', 'Sneha', 'Aditya', 'Kavya', 'Ishaan', 'Pooja', 'Rahul', 'Nisha', 'Siddharth', 'Tanvi', 'Yash', 'Riya'];
const LAST = ['Sharma', 'Patel', 'Iyer', 'Kulkarni', 'Deshpande', 'Reddy', 'Nair', 'Joshi', 'Gupta', 'Mehta', 'Rao', 'Banerjee', 'Pawar', 'Singh', 'Menon'];
const STATES = ['MH12', 'MH14', 'MH04', 'KA05', 'GJ01', 'DL3C', 'TS09'];

const plate = (rand: () => number) =>
  `${pick(rand, STATES)} ${String.fromCharCode(65 + between(rand, 0, 25))}${String.fromCharCode(65 + between(rand, 0, 25))} ${between(rand, 1000, 9999)}`;
const person = (rand: () => number) => `${pick(rand, FIRST)} ${pick(rand, LAST)}`;
const studentId = (rand: () => number) => `STU-${between(rand, 1001, 2480)}`;

/** Times count back from 14:05 IST in 1–6 minute steps. */
function timeline(rand: () => number, n: number): { label: string; minutes: number }[] {
  let m = 14 * 60 + 5;
  return Array.from({ length: n }, () => {
    const out = { label: `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`, minutes: m };
    m -= between(rand, 1, 6);
    return out;
  });
}

const S = (label: string, tone: StatusTone): EventStatus => ({ label, tone });

function build(useCase: UseCaseId): EventTable {
  const rand = seeded(hashSeed(`events-${useCase}`));
  const times = timeline(rand, 25);

  switch (useCase) {
    case 'anpr': {
      const statuses = [S('Allowed', 'neutral'), S('Allowed', 'neutral'), S('Allowed', 'neutral'), S('Unknown', 'info'), S('Watchlist', 'critical')];
      return {
        noun: 'vehicle event',
        statuses: ['Allowed', 'Unknown', 'Watchlist'],
        columns: [
          { key: 'plate', label: 'Plate', mono: true, sortable: true },
          { key: 'type', label: 'Vehicle type', sortable: true },
          { key: 'gate', label: 'Gate', sortable: true },
          { key: 'direction', label: 'Direction' },
          { key: 'time', label: 'Time', mono: true, sortable: true },
          { key: 'confidence', label: 'Confidence', numeric: true, sortable: true },
        ],
        rows: times.map((t, i) => ({
          id: `ANPR-${8840 - i}`,
          plate: plate(rand),
          type: pick(rand, ['Car', 'Car', 'Two-wheeler', 'Commercial', 'Bus']),
          gate: `Gate ${between(rand, 1, 6)}`,
          direction: pick(rand, ['In', 'Out']),
          time: t.label,
          confidence: `${(94 + rand() * 5.8).toFixed(1)}%`,
          status: pick(rand, statuses),
          sortTime: t.minutes,
        })),
      };
    }
    case 'hosteltrack': {
      const statuses = [S('On time', 'neutral'), S('On time', 'neutral'), S('On time', 'neutral'), S('Late', 'info'), S('Unauthorized', 'critical')];
      return {
        noun: 'hostel event',
        statuses: ['On time', 'Late', 'Unauthorized'],
        columns: [
          { key: 'student', label: 'Student ID', mono: true, sortable: true },
          { key: 'name', label: 'Name', sortable: true },
          { key: 'block', label: 'Block', sortable: true },
          { key: 'event', label: 'Event' },
          { key: 'time', label: 'Time', mono: true, sortable: true },
          { key: 'camera', label: 'Camera', mono: true },
        ],
        rows: times.map((t, i) => ({
          id: `HT-${5520 - i}`,
          student: studentId(rand),
          name: person(rand),
          block: `Block ${pick(rand, ['A', 'B', 'C', 'D', 'E'])}`,
          event: pick(rand, ['In', 'Out']),
          time: t.label,
          camera: `CAM-${pad2(between(rand, 11, 24))}`,
          status: pick(rand, statuses),
          sortTime: t.minutes,
        })),
      };
    }
    case 'mealpulse': {
      const statuses = [S('Served', 'neutral'), S('Served', 'neutral'), S('Served', 'neutral'), S('Duplicate', 'info'), S('Denied', 'critical')];
      return {
        noun: 'meal event',
        statuses: ['Served', 'Duplicate', 'Denied'],
        columns: [
          { key: 'student', label: 'Student ID', mono: true, sortable: true },
          { key: 'name', label: 'Name', sortable: true },
          { key: 'meal', label: 'Meal', sortable: true },
          { key: 'counter', label: 'Counter', sortable: true },
          { key: 'time', label: 'Time', mono: true, sortable: true },
        ],
        rows: times.map((t, i) => ({
          id: `MP-${7310 - i}`,
          student: studentId(rand),
          name: person(rand),
          meal: 'Lunch',
          counter: `Counter ${between(rand, 1, 4)}`,
          time: t.label,
          status: pick(rand, statuses),
          sortTime: t.minutes,
        })),
      };
    }
    case 'visitor': {
      const statuses = [S('On site', 'live'), S('On site', 'live'), S('Checked out', 'neutral'), S('Checked out', 'neutral'), S('Overstayed', 'critical')];
      return {
        noun: 'visitor',
        statuses: ['On site', 'Checked out', 'Overstayed'],
        columns: [
          { key: 'pass', label: 'Pass ID', mono: true, sortable: true },
          { key: 'visitor', label: 'Visitor', sortable: true },
          { key: 'host', label: 'Host', sortable: true },
          { key: 'purpose', label: 'Purpose', sortable: true },
          { key: 'checkIn', label: 'Check-in', mono: true, sortable: true },
          { key: 'checkOut', label: 'Check-out', mono: true },
        ],
        rows: times.map((t, i) => {
          const status = pick(rand, statuses);
          const outMinutes = t.minutes + between(rand, 20, 95);
          return {
            id: `VP-${3360 - i}`,
            pass: `VP-${3360 - i}`,
            visitor: person(rand),
            host: `Dr. ${person(rand)}`,
            purpose: pick(rand, ['Delivery', 'Parent visit', 'Vendor', 'Interview']),
            checkIn: t.label,
            checkOut: status.label === 'Checked out' ? `${pad2(Math.floor(outMinutes / 60) % 24)}:${pad2(outMinutes % 60)}` : '—',
            status,
            sortTime: t.minutes,
          };
        }),
      };
    }
    default: {
      const statuses = [S('Resolved', 'neutral'), S('Resolved', 'neutral'), S('Open', 'info'), S('Open', 'info'), S('Critical', 'critical')];
      return {
        noun: 'event',
        statuses: ['Resolved', 'Open', 'Critical'],
        columns: [
          { key: 'event', label: 'Event ID', mono: true, sortable: true },
          { key: 'type', label: 'Type', sortable: true },
          { key: 'camera', label: 'Camera', mono: true, sortable: true },
          { key: 'location', label: 'Location', sortable: true },
          { key: 'time', label: 'Time', mono: true, sortable: true },
        ],
        rows: times.map((t, i) => ({
          id: `EV-${90412 - i}`,
          event: `EV-${90412 - i}`,
          type: pick(rand, ['Person detected', 'Vehicle detected', 'Motion', 'Line crossing', 'Tamper']),
          camera: `CAM-${pad2(between(rand, 1, 38))}`,
          location: pick(rand, ['Gate 1', 'Gate 3', 'Library', 'Parking B', 'Admin block', 'Sports complex']),
          time: t.label,
          status: pick(rand, statuses),
          sortTime: t.minutes,
        })),
      };
    }
  }
}

const cache = new Map<UseCaseId, EventTable>();

/** Memoized per use case: the rows never change during a session. */
export function getEvents(useCase: UseCaseId): EventTable {
  let table = cache.get(useCase);
  if (!table) {
    table = build(useCase);
    cache.set(useCase, table);
  }
  return table;
}
