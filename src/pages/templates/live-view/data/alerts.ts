/** Alerts per use case: 3 open alerts; the Critical alert state adds one Critical at the top. */
import type { LiveUseCase } from '../useCases';
import type { LiveCamera } from './cameras';
import { NOW_START } from './seed';

export type LiveAlertSeverity = 'critical' | 'info';

export interface LiveAlert {
  id: string;
  severity: LiveAlertSeverity;
  title: string;
  cameraId: string;
  cameraName: string;
  at: number;
  acknowledged: boolean;
}

const BASE: Record<LiveUseCase['id'], [LiveAlertSeverity, string, number, number][]> = {
  generic: [
    ['info', 'Person loitering near storeroom', 7, 140],
    ['info', 'Line crossing after hours', 3, 410],
    ['info', 'Door held open for 5 min', 6, 900],
  ],
  anpr: [
    ['info', 'Unknown vehicle MH14 KT 2210', 2, 95],
    ['info', 'Plate unreadable, manual check needed', 4, 380],
    ['info', 'Commercial vehicle outside delivery hours', 5, 1100],
  ],
  hosteltrack: [
    ['info', 'Late entry STU-1042 at Block A', 0, 120],
    ['info', 'Tailgating at Hostel gate in', 6, 520],
    ['info', 'Door held open at Block B stairwell', 3, 980],
  ],
  mealpulse: [
    ['info', 'Duplicate meal attempt at Counter 2', 1, 80],
    ['info', 'Queue longer than 8 min at Queue lane', 3, 300],
    ['info', 'Counter 3 idle for 15 min', 2, 1300],
  ],
  visitor: [
    ['info', 'Visitor overstayed 30 min · VIS-2026-0344', 3, 200],
    ['info', 'Pass not scanned at Turnstile 2', 2, 640],
    ['info', 'Walk-in visitor waiting for approval', 0, 1500],
  ],
};

export function getAlerts(uc: LiveUseCase, cameras: LiveCamera[], critical: boolean): LiveAlert[] {
  const list = BASE[uc.id].map(([severity, title, ci, secondsAgo], i): LiveAlert => ({
    id: `ALT-${3020 + i}`,
    severity,
    title,
    cameraId: cameras[ci].id,
    cameraName: cameras[ci].name,
    at: NOW_START - secondsAgo,
    acknowledged: false,
  }));
  if (!critical) return list;
  const cam = cameras[uc.criticalAlert.cameraIndex];
  return [{ id: 'ALT-3031', severity: 'critical', title: uc.criticalAlert.title, cameraId: cam.id, cameraName: cam.name, at: NOW_START - 4, acknowledged: false }, ...list];
}
