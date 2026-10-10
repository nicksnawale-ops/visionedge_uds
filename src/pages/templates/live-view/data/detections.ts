/**
 * Detections per use case. Item n is generated from a seed of (use case, n), so the feed is the same on
 * every load: 30 items on screen at start, then one new item every few seconds while live.
 */
import type { LiveUseCase } from '../useCases';
import type { LiveCamera } from './cameras';
import { NOW_START, clock, hashSeed, pick, seeded } from './seed';

export type DetectionStatus = 'verified' | 'unknown' | 'watchlist' | 'duplicate';

export interface Detection {
  /** Sequence number (unique, increasing). */
  seq: number;
  id: string;
  cameraId: string;
  cameraName: string;
  zone: string;
  /** Main identifier: plate, student ID, meal, pass ID or object. */
  primary: string;
  /** Short label on the tile's detection chip. */
  chip: string;
  type: string;
  confidence: number;
  status: DetectionStatus;
  /** Second of day (IST) when it was detected. */
  at: number;
  facts: { label: string; value: string; mono?: boolean }[];
  sightings: { camera: string; time: string }[];
}

export const STATUS_LABEL: Record<DetectionStatus, string> = {
  verified: 'Verified',
  unknown: 'Unknown',
  watchlist: 'Watchlist',
  duplicate: 'Duplicate',
};

const STATES = ['MH12', 'MH14', 'KA01', 'GJ01', 'DL3C', 'TN09'];
const LETTERS = ['AB', 'CD', 'EF', 'KT', 'PQ', 'RS', 'UV', 'XY'];
const NAMES = ['Aarav Shah', 'Isha Kulkarni', 'Rohan Iyer', 'Neha Joshi', 'Kabir Rao', 'Diya Menon', 'Arjun Desai', 'Sara Nair'];
const HOSTS = ['R. Mehta', 'P. Sharma', 'A. Kulkarni', 'V. Desai', 'S. Patil'];
const COLORS = ['White', 'Silver', 'Black', 'Grey', 'Blue', 'Red'];
const VEHICLES: [string, string][] = [
  ['car', 'Car'],
  ['car', 'Car'],
  ['two-wheeler', 'Two-wheeler'],
  ['truck', 'Truck'],
  ['bus', 'Bus'],
];
const MEALS: [string, string][] = [
  ['lunch', 'Lunch · Veg thali'],
  ['lunch', 'Lunch · Rice bowl'],
  ['breakfast', 'Breakfast · Poha'],
  ['dinner', 'Dinner · Roti meal'],
];

/** Detection n for a use case, seen on one of the given cameras. */
export function makeDetection(uc: LiveUseCase, cameras: LiveCamera[], n: number, at: number): Detection {
  const rand = seeded(hashSeed(`live-${uc.id}-${n}`));
  const live = cameras.filter((c) => c.status === 'online' || c.status === 'recording');
  const cam = live[Math.floor(rand() * live.length)];
  const confidence = 82 + Math.floor(rand() * 17);
  const r = rand();
  const base = { seq: n, id: `DET-${10400 + n}`, cameraId: cam.id, cameraName: cam.name, zone: cam.zone, confidence, at };
  const sightings = [0, 1, 2].map((k) => {
    const c = live[(cam.index + k * 3 + 1) % live.length];
    return { camera: `${c.id} · ${c.name}`, time: clock(at - (k + 1) * (240 + Math.floor(rand() * 600))) };
  });

  switch (uc.id) {
    case 'anpr': {
      const plate = `${pick(rand, STATES)} ${pick(rand, LETTERS)} ${1000 + Math.floor(rand() * 9000)}`;
      const [type, typeLabel] = pick(rand, VEHICLES);
      const status: DetectionStatus = r < 0.04 ? 'watchlist' : r < 0.2 ? 'unknown' : 'verified';
      return {
        ...base,
        primary: plate,
        chip: `${plate} · ${confidence}%`,
        type,
        status,
        sightings,
        facts: [
          { label: 'Plate', value: plate, mono: true },
          { label: 'Vehicle type', value: typeLabel },
          { label: 'Color', value: pick(rand, COLORS) },
          { label: 'Direction', value: /exit/i.test(cam.name) ? 'Exit' : 'Entry' },
          { label: 'Lane', value: `Lane ${1 + Math.floor(rand() * 2)}` },
          { label: 'Confidence', value: `${confidence}%` },
          { label: 'Watchlist match', value: status === 'watchlist' ? 'Yes · Stolen vehicle report' : 'No' },
        ],
      };
    }
    case 'hosteltrack': {
      const sid = `STU-${1000 + Math.floor(rand() * 900)}`;
      const dir = rand() < 0.55 ? 'in' : 'out';
      const status: DetectionStatus = r < 0.12 ? 'unknown' : 'verified';
      return {
        ...base,
        primary: sid,
        chip: `${sid} · ${confidence}%`,
        type: dir,
        status,
        sightings,
        facts: [
          { label: 'Student ID', value: sid, mono: true },
          { label: 'Name', value: status === 'unknown' ? 'Not matched' : pick(rand, NAMES) },
          { label: 'Block', value: cam.zone },
          { label: 'Direction', value: dir === 'in' ? 'In' : 'Out' },
          { label: 'Confidence', value: `${confidence}%` },
        ],
      };
    }
    case 'mealpulse': {
      const [type, meal] = pick(rand, MEALS);
      const sid = `STU-${1000 + Math.floor(rand() * 900)}`;
      const status: DetectionStatus = r < 0.06 ? 'duplicate' : 'verified';
      return {
        ...base,
        primary: meal,
        chip: `${meal} · ${confidence}%`,
        type,
        status,
        sightings,
        facts: [
          { label: 'Student ID', value: sid, mono: true },
          { label: 'Meal', value: meal },
          { label: 'Counter', value: cam.name },
          { label: 'Window', value: type === 'lunch' ? '12:00–14:30' : type === 'breakfast' ? '07:00–09:30' : '19:30–21:30' },
          { label: 'Duplicate check', value: status === 'duplicate' ? 'Second attempt in this window' : 'Passed' },
        ],
      };
    }
    case 'visitor': {
      const pass = `VIS-2026-0${300 + Math.floor(rand() * 200)}`;
      const host = pick(rand, HOSTS);
      const type = rand() < 0.6 ? 'checkin' : 'checkout';
      const status: DetectionStatus = r < 0.1 ? 'unknown' : 'verified';
      return {
        ...base,
        primary: pass,
        chip: `${pass} · Host: ${host}`,
        type,
        status,
        sightings,
        facts: [
          { label: 'Pass ID', value: pass, mono: true },
          { label: 'Visitor', value: pick(rand, NAMES) },
          { label: 'Host', value: host },
          { label: 'Purpose', value: pick(rand, ['Meeting', 'Interview', 'Delivery', 'Maintenance']) },
          { label: 'Valid until', value: clock(at + 3 * 3600).slice(0, 5) },
        ],
      };
    }
    default: {
      const vehicle = rand() < 0.35;
      const status: DetectionStatus = r < 0.1 ? 'unknown' : 'verified';
      return {
        ...base,
        primary: vehicle ? 'Vehicle' : 'Person',
        chip: `${vehicle ? 'Vehicle' : 'Person'} ${confidence}%`,
        type: vehicle ? 'vehicle' : 'person',
        status,
        sightings,
        facts: [
          { label: 'Object', value: vehicle ? 'Vehicle' : 'Person' },
          { label: 'Zone', value: cam.zone },
          { label: 'Rule', value: vehicle ? 'Vehicle detection' : 'Person detection' },
          { label: 'Confidence', value: `${confidence}%` },
        ],
      };
    }
  }
}

/** The 30 items already in the feed when the screen opens (newest first). */
export const initialDetections = (uc: LiveUseCase, cameras: LiveCamera[]): Detection[] =>
  Array.from({ length: 30 }, (_, i) => makeDetection(uc, cameras, 29 - i, NOW_START - 6 - i * 23));

export const FEED_MAX = 200;
