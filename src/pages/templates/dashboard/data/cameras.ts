/** Camera tiles per use case (9 each, so the 3×3 grid is full). Fictional. */
import { hashSeed, pad2, seeded } from './seed';
import type { SceneKind, UseCaseId } from './useCases';

export interface CameraDetection {
  label: string;
  /** Box in % of the tile (left, top, width, height). */
  box: [number, number, number, number];
}

export interface DashCamera {
  id: string;
  name: string;
  location: string;
  resolution: string;
  fps: number;
  uptime: string;
  lastSeen: string;
  scene: SceneKind;
  detection: CameraDetection | null;
  /** Recent detections for the camera modal. */
  recent: { time: string; label: string; confidence: string }[];
}

type CamSeed = [string, string, string];

const NAMES: Record<UseCaseId, CamSeed[]> = {
  generic: [
    ['CAM-03', 'Gate 3 entry', 'North boundary'],
    ['CAM-07', 'Parking B', 'Basement level'],
    ['CAM-12', 'Admin corridor', 'Admin block, floor 1'],
    ['CAM-21', 'Library entrance', 'Central library'],
    ['CAM-09', 'Gate 1 entry', 'Main road'],
    ['CAM-15', 'Lab wing', 'Science block'],
    ['CAM-24', 'Cafeteria', 'Student centre'],
    ['CAM-30', 'Sports complex', 'East campus'],
    ['CAM-33', 'Auditorium foyer', 'Cultural centre'],
  ],
  anpr: [
    ['CAM-03', 'Gate 3 entry', 'North boundary'],
    ['CAM-01', 'Gate 1 entry', 'Main road'],
    ['CAM-05', 'Gate 5 exit', 'South road'],
    ['CAM-02', 'Gate 2 road', 'Inner ring road'],
    ['CAM-04', 'Gate 4 exit', 'West boundary'],
    ['CAM-06', 'Gate 6 service', 'Service lane'],
    ['CAM-07', 'Parking B', 'Basement level'],
    ['CAM-08', 'Staff parking', 'Admin block'],
    ['CAM-10', 'Bus bay', 'Main road'],
  ],
  hosteltrack: [
    ['CAM-14', 'Block C entrance', 'Hostel zone'],
    ['CAM-11', 'Main hostel gate', 'Hostel zone'],
    ['CAM-18', 'Block A rear door', 'Hostel zone'],
    ['CAM-12', 'Block B entrance', 'Hostel zone'],
    ['CAM-15', 'Block D entrance', 'Hostel zone'],
    ['CAM-20', 'Block E corridor', 'Hostel zone'],
    ['CAM-16', 'Block C corridor', 'Hostel zone'],
    ['CAM-19', 'Common room', 'Hostel zone'],
    ['CAM-22', 'Laundry area', 'Hostel zone'],
  ],
  mealpulse: [
    ['CAM-31', 'Counter 2', 'Main canteen'],
    ['CAM-32', 'Counter 3', 'Main canteen'],
    ['CAM-33', 'Counter 1', 'Main canteen'],
    ['CAM-34', 'Counter 4', 'Main canteen'],
    ['CAM-35', 'Wash area', 'Main canteen'],
    ['CAM-36', 'Dining hall north', 'Main canteen'],
    ['CAM-37', 'Dining hall south', 'Main canteen'],
    ['CAM-38', 'Kitchen entry', 'Main canteen'],
    ['CAM-39', 'Store room', 'Main canteen'],
  ],
  visitor: [
    ['CAM-40', 'Main entrance', 'Reception'],
    ['CAM-41', 'Admin block lobby', 'Admin block'],
    ['CAM-42', 'Side gate', 'East boundary'],
    ['CAM-43', 'Turnstile 2', 'Reception'],
    ['CAM-44', 'Lab wing door', 'Science block'],
    ['CAM-45', 'Visitor parking', 'Main road'],
    ['CAM-46', 'Reception desk', 'Reception'],
    ['CAM-47', 'Guest house', 'West campus'],
    ['CAM-48', 'Delivery bay', 'Service lane'],
  ],
};

const DETECTIONS: Record<UseCaseId, (rand: () => number) => string> = {
  generic: (rand) => `Person · ${90 + Math.floor(rand() * 9)}%`,
  anpr: (rand) => `MH12 AB ${1000 + Math.floor(rand() * 8999)} · ${95 + Math.floor(rand() * 4)}%`,
  hosteltrack: (rand) => `STU-${1001 + Math.floor(rand() * 1400)} · ${94 + Math.floor(rand() * 5)}%`,
  mealpulse: (rand) => `Meal: Lunch · ${93 + Math.floor(rand() * 6)}%`,
  visitor: (rand) => `VP-${3300 + Math.floor(rand() * 60)} · ${94 + Math.floor(rand() * 5)}%`,
};

/** Detection box positions per scene (where the "subject" sits in the drawing). */
const BOXES: Record<SceneKind, CameraDetection['box']> = {
  gate: [38, 48, 26, 18],
  parking: [52, 44, 22, 26],
  corridor: [44, 30, 14, 46],
  canteen: [34, 26, 18, 40],
  turnstile: [42, 26, 16, 52],
};

const cache = new Map<string, DashCamera[]>();

/** First tile in the list that the spec uses as the example label (e.g. "MH12 AB 1234 · 98%"). */
const FIRST_LABEL: Record<UseCaseId, string> = {
  generic: 'Person · 96%',
  anpr: 'MH12 AB 1234 · 98%',
  hosteltrack: 'STU-1042 · 97%',
  mealpulse: 'Meal: Lunch · 96%',
  visitor: 'VP-3341 · 97%',
};

export function getCameras(useCase: UseCaseId, scene: SceneKind): DashCamera[] {
  const key = `${useCase}-${scene}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const rand = seeded(hashSeed(`cams-${useCase}`));
  const cams = NAMES[useCase].map(([id, name, location], i): DashCamera => {
    const label = i === 0 ? FIRST_LABEL[useCase] : DETECTIONS[useCase](rand);
    return {
      id,
      name,
      location,
      resolution: i % 3 === 2 ? '2560 × 1440' : '1920 × 1080',
      fps: i % 2 === 0 ? 25 : 30,
      uptime: `${(97 + rand() * 2.9).toFixed(1)}%`,
      lastSeen: `14:${pad2(2 - (i % 3))}`,
      scene,
      detection: i % 4 === 2 ? null : { label, box: BOXES[scene] },
      recent: Array.from({ length: 5 }, (_, k) => ({
        time: `14:${pad2(5 - k)}:${pad2(Math.floor(rand() * 59))}`,
        label: (k === 0 ? label : DETECTIONS[useCase](rand)).split(' · ')[0],
        confidence: `${(93 + rand() * 6.5).toFixed(1)}%`,
      })),
    };
  });
  cache.set(key, cams);
  return cams;
}

/** Which tiles are offline: one by default, two in the Degraded state. */
export const offlineIndexes = (degraded: boolean): number[] => (degraded ? [1, 3] : [3]);
