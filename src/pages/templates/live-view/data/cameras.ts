/** 12 cameras per use case (fixed sample data, fictional). */
import type { LiveUseCase } from '../useCases';

export type CameraType = 'Fixed' | 'PTZ' | 'ANPR';
/** online · offline · recording-only · under maintenance */
export type CameraStatus = 'online' | 'offline' | 'recording' | 'maintenance';

export interface LiveCamera {
  id: string;
  name: string;
  site: string;
  zone: string;
  type: CameraType;
  status: CameraStatus;
  resolution: string;
  fps: number;
  bitrate: string;
  latency: number;
  /** % over the last 30 days. */
  uptime: number;
  modules: string[];
  lastMaintenance: string;
  audio: boolean;
  /** Part of the scene is masked for privacy. */
  privacy: boolean;
  /** ANPR gate cameras show a barrier chip. */
  barrier: boolean;
  /** Index in the camera list (drives the deterministic motion offset). */
  index: number;
}

export const SITES = ['Main campus', 'North campus'];

const MODULES: Record<LiveUseCase['id'], string[]> = {
  generic: ['Person detection', 'Vehicle detection', 'Line crossing'],
  anpr: ['Plate reading', 'Watchlist', 'Vehicle type'],
  hosteltrack: ['Face matching', 'Entry counting', 'Liveness'],
  mealpulse: ['Meal recognition', 'Queue length', 'Duplicate check'],
  visitor: ['Pass scanning', 'Person detection', 'Overstay'],
};

const cache = new Map<string, LiveCamera[]>();

export function getCameras(uc: LiveUseCase): LiveCamera[] {
  const hit = cache.get(uc.id);
  if (hit) return hit;
  const list = uc.cameras.map(([zone, name], i): LiveCamera => {
    const ptz = i === 2 || i === 6;
    const type: CameraType = uc.id === 'anpr' && !ptz ? 'ANPR' : ptz ? 'PTZ' : 'Fixed';
    return {
      id: `CAM-${String(i + 1).padStart(2, '0')}`,
      name,
      site: i < 8 ? SITES[0] : SITES[1],
      zone,
      type,
      status: i === 11 ? 'maintenance' : i === 7 ? 'recording' : 'online',
      resolution: i % 3 === 1 ? '2560 × 1440' : '1920 × 1080',
      fps: i % 4 === 3 ? 15 : 25,
      bitrate: i % 3 === 1 ? '6.2 Mbps' : '4.1 Mbps',
      latency: 140 + ((i * 37) % 120),
      uptime: [99.8, 99.2, 98.7, 99.9, 97.4, 99.5, 99.1, 96.8, 99.6, 98.9, 99.3, 92.1][i],
      modules: MODULES[uc.id],
      lastMaintenance: `${String(3 + ((i * 5) % 24)).padStart(2, '0')} Sep 2026`,
      audio: i === 0 || i === 3,
      privacy: i === 3,
      barrier: uc.id === 'anpr' && /Gate/.test(name),
      index: i,
    };
  });
  cache.set(uc.id, list);
  return list;
}
