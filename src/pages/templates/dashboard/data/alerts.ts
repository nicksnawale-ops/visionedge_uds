/**
 * Live alerts per use case. The list starts with 6 alerts and, while Live is on,
 * a new one from the pool arrives every 30 seconds (deterministic order).
 */
import type { UseCaseId } from './useCases';

export type AlertSeverity = 'critical' | 'info' | 'neutral';

export interface DashAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  camera: string;
  location: string;
  /** Minutes before 14:05 IST when the alert fired. */
  minutesAgo: number;
  acknowledged: boolean;
}

type Seed = [AlertSeverity, string, string, string];

const POOLS: Record<UseCaseId, Seed[]> = {
  generic: [
    ['info', 'Person loitering near storeroom', 'CAM-12', 'Admin block'],
    ['info', 'Line crossing after hours', 'CAM-07', 'Parking B'],
    ['neutral', 'Camera reconnected', 'CAM-21', 'Library'],
    ['info', 'Crowd above threshold', 'CAM-03', 'Gate 3'],
    ['neutral', 'Firmware update completed', 'CAM-30', 'Sports complex'],
    ['info', 'Vehicle parked in no-parking zone', 'CAM-09', 'Gate 1'],
    ['neutral', 'Storage rotation finished', 'NVR-02', 'Server room'],
    ['info', 'Door held open for 5 min', 'CAM-15', 'Lab wing'],
  ],
  anpr: [
    ['info', 'Unknown vehicle MH14 KT 2210', 'CAM-03', 'Gate 3 entry'],
    ['info', 'Plate unreadable, manual check needed', 'CAM-05', 'Gate 5 exit'],
    ['neutral', 'Barrier reset after timeout', 'CAM-01', 'Gate 1 entry'],
    ['info', 'Vehicle over speed limit (28 km/h)', 'CAM-02', 'Gate 2 road'],
    ['neutral', 'Visitor pass expired for MH12 PQ 7781', 'CAM-04', 'Gate 4 exit'],
    ['info', 'Commercial vehicle outside delivery hours', 'CAM-06', 'Gate 6 service'],
    ['neutral', 'Camera focus recalibrated', 'CAM-03', 'Gate 3 entry'],
    ['info', 'Tailgating detected', 'CAM-01', 'Gate 1 entry'],
  ],
  hosteltrack: [
    ['info', 'Late entry: STU-1187', 'CAM-14', 'Block C entrance'],
    ['info', 'Outpass overdue: STU-2044', 'CAM-11', 'Main hostel gate'],
    ['neutral', 'Attendance sync completed', 'SYS', 'Hostel office'],
    ['info', 'Door left open after 22:00', 'CAM-18', 'Block A rear door'],
    ['neutral', 'Warden approved 3 outpasses', 'SYS', 'Hostel office'],
    ['info', 'Unregistered face at entrance', 'CAM-12', 'Block B entrance'],
    ['neutral', 'Camera reconnected', 'CAM-20', 'Block E corridor'],
    ['info', 'Late entry: STU-1452', 'CAM-15', 'Block D entrance'],
  ],
  mealpulse: [
    ['info', 'Queue above 12 people', 'CAM-31', 'Counter 2'],
    ['info', 'Duplicate meal attempt: STU-2210', 'CAM-32', 'Counter 3'],
    ['neutral', 'Lunch service started', 'SYS', 'Main canteen'],
    ['info', 'Unregistered diner at counter', 'CAM-33', 'Counter 1'],
    ['neutral', 'Menu updated for dinner', 'SYS', 'Main canteen'],
    ['info', 'Tray return area crowded', 'CAM-35', 'Wash area'],
    ['neutral', 'Counter 4 opened', 'CAM-34', 'Counter 4'],
    ['info', 'Duplicate meal attempt: STU-1309', 'CAM-31', 'Counter 2'],
  ],
  visitor: [
    ['info', 'Visitor overstayed by 25 min', 'CAM-41', 'Admin block'],
    ['info', 'Visitor without pre-approval', 'CAM-40', 'Main entrance'],
    ['neutral', 'Host approved walk-in visitor', 'SYS', 'Reception'],
    ['info', 'Badge not returned at exit', 'CAM-42', 'Side gate'],
    ['neutral', 'Delivery checked out', 'CAM-40', 'Main entrance'],
    ['info', 'Visitor entered restricted wing', 'CAM-44', 'Lab wing'],
    ['neutral', 'Turnstile 2 back online', 'CAM-43', 'Main entrance'],
    ['info', 'Group visit arriving (12 people)', 'CAM-40', 'Main entrance'],
  ],
};

/** The unacknowledged critical alert used by the Critical alert state. */
export const CRITICAL_ALERTS: Record<UseCaseId, { title: string; camera: string; location: string; banner: string }> = {
  generic: {
    title: 'Camera tampering detected',
    camera: 'CAM-07',
    location: 'Parking B',
    banner: 'Camera tampering detected on CAM-07 at Parking B',
  },
  anpr: {
    title: 'Blacklisted vehicle MH12 XY 4521',
    camera: 'CAM-03',
    location: 'Gate 3 entry',
    banner: 'Blacklisted vehicle MH12 XY 4521 detected at Gate 3',
  },
  hosteltrack: {
    title: 'Unauthorized exit: STU-1187',
    camera: 'CAM-18',
    location: 'Block A rear door',
    banner: 'Unauthorized exit by STU-1187 at Block A rear door',
  },
  mealpulse: {
    title: 'Blocked student at counter: STU-2210',
    camera: 'CAM-32',
    location: 'Counter 3',
    banner: 'Blocked student STU-2210 attempting entry at Counter 3',
  },
  visitor: {
    title: 'Watchlisted visitor at entrance',
    camera: 'CAM-40',
    location: 'Main entrance',
    banner: 'Watchlisted visitor detected at the main entrance turnstile',
  },
};

const toAlert = (useCase: UseCaseId, [severity, title, camera, location]: Seed, index: number, minutesAgo: number): DashAlert => ({
  id: `${useCase}-alert-${index}`,
  severity,
  title,
  camera,
  location,
  minutesAgo,
  acknowledged: false,
});

/** First 6 alerts, newest first (plus the critical alert in the Critical state). */
export function initialAlerts(useCase: UseCaseId, withCritical: boolean): DashAlert[] {
  const pool = POOLS[useCase];
  const list = pool.slice(0, 6).map((seed, i) => toAlert(useCase, seed, i, [2, 6, 11, 18, 34, 52][i]));
  if (!withCritical) return list;
  const c = CRITICAL_ALERTS[useCase];
  return [
    { id: `${useCase}-critical`, severity: 'critical', title: c.title, camera: c.camera, location: c.location, minutesAgo: 2, acknowledged: false },
    // Added on top of the usual six, so the bell count goes up by one.
    ...list,
  ];
}

/** The alert that arrives on live tick n (cycles through the rest of the pool). */
export function alertForTick(useCase: UseCaseId, tick: number): DashAlert {
  const pool = POOLS[useCase];
  const index = 6 + ((tick - 1) % (pool.length - 6));
  return { ...toAlert(useCase, pool[index], index, 0), id: `${useCase}-alert-live-${tick}` };
}

/** "2 min ago" under an hour, otherwise the absolute IST time. */
export function relativeTime(minutesAgo: number): string {
  if (minutesAgo < 1) return 'Just now';
  if (minutesAgo < 60) return `${Math.round(minutesAgo)} min ago`;
  const t = 14 * 60 + 5 - Math.round(minutesAgo);
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}
