/** 38 cameras (seeded, never Math.random): 36 online, 2 offline. */
import { between, hashSeed, pad2, seeded } from '../../dashboard/data/seed';
import { getSites } from './sites';

export type CameraType = 'Fixed' | 'PTZ' | 'ANPR';
export type CameraStatus = 'online' | 'offline' | 'maintenance';

export interface SettingsCamera {
  id: string;
  name: string;
  site: string;
  zone: string;
  type: CameraType;
  resolution: string;
  fps: number;
  status: CameraStatus;
  /** "Live" for online cameras, otherwise a relative time. */
  lastSeen: string;
}

const NAMES = ['entry', 'exit', 'perimeter', 'lobby', 'corridor', 'parking row'];

let cache: SettingsCamera[] | null = null;

export function getCameras(): SettingsCamera[] {
  if (cache) return cache;
  // The seed keeps its original "generic" suffix so the sample cameras stay exactly the same.
  const rand = seeded(hashSeed('settings-cameras-generic'));
  const zones = getSites().flatMap((s) => s.zones.map((z) => ({ site: s.name, zone: z })));
  const offline = new Set([6, 21]);
  const list = Array.from({ length: 38 }, (_, i): SettingsCamera => {
    const place = zones[i % zones.length];
    const type: CameraType = i % 7 === 3 ? 'PTZ' : 'Fixed';
    const status: CameraStatus = offline.has(i) ? 'offline' : 'online';
    const names = NAMES;
    return {
      id: `CAM-${pad2(i + 1)}`,
      name: `${place.zone} ${names[i % names.length]}`,
      site: place.site,
      zone: place.zone,
      type,
      resolution: rand() < 0.6 ? '1920×1080' : '2560×1440',
      fps: between(rand, 0, 1) ? 25 : 15,
      status,
      lastSeen: status === 'online' ? 'Live' : i === 6 ? '18 min ago' : '2 hours ago',
    };
  });
  cache = list;
  return list;
}
