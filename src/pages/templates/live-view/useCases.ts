/**
 * Per-use-case configuration for the Live View template: zones, camera names, stats, detection types,
 * overlays and actions. The product shell (sidebar, product name) comes from the Dashboard config (read-only).
 */
import { DashboardUseCase, SceneKind, UseCaseId, getDashboardUseCase } from '../dashboard/data/useCases';

export type { UseCaseId };
export type ObjectKind = 'vehicle' | 'person' | 'tray' | 'mixed';

export interface LiveStat {
  label: string;
  value: string;
  /** Tiny trend, e.g. "+12%" or "−2". */
  trend: string;
  tone: 'up' | 'down' | 'flat';
}

export interface LiveUseCase {
  id: UseCaseId;
  shell: DashboardUseCase;
  scene: SceneKind;
  /** Zone / group select value, e.g. "Main gates". */
  zoneGroup: string;
  /** 12 cameras: [zone, name]. Cameras 1–8 are on Main campus, 9–12 on North campus. */
  cameras: [string, string][];
  stats: LiveStat[];
  /** Stats with 2 cameras offline (Camera offline state). */
  offlineStats: LiveStat[];
  object: ObjectKind;
  detectionTypes: { value: string; label: string }[];
  /** Label of the main identifier ("Plate", "Student ID"…). */
  idLabel: string;
  primaryAction: string;
  criticalAlert: { title: string; cameraIndex: number };
  savedViews: string[];
}

const S = (label: string, value: string, trend: string, tone: LiveStat['tone'] = 'flat'): LiveStat => ({ label, value, trend, tone });

const CONFIG: Record<UseCaseId, Omit<LiveUseCase, 'id' | 'shell' | 'scene'>> = {
  generic: {
    zoneGroup: 'All cameras',
    cameras: [
      ['Gates', 'Gate 1 entry'],
      ['Gates', 'Gate 3 entry'],
      ['Gates', 'Gate 3 exit'],
      ['Parking', 'Parking B row 2'],
      ['Parking', 'Parking B ramp'],
      ['Buildings', 'Library lobby'],
      ['Buildings', 'Lab wing corridor'],
      ['Buildings', 'Admin block'],
      ['Perimeter', 'North fence east'],
      ['Perimeter', 'North fence west'],
      ['Sports complex', 'Sports entrance'],
      ['Sports complex', 'Pool deck'],
    ],
    stats: [S('Cameras online', '36/38', '−2', 'down'), S('Detections (1h)', '412', '+8%', 'up'), S('Open alerts', '3', '+1', 'up'), S('Avg latency', '180 ms', '−20 ms', 'down')],
    offlineStats: [S('Cameras online', '34/38', '−4', 'down'), S('Detections (1h)', '398', '−3%', 'down'), S('Open alerts', '3', '+1', 'up'), S('Avg latency', '210 ms', '+30 ms', 'up')],
    object: 'mixed',
    detectionTypes: [
      { value: 'person', label: 'Person' },
      { value: 'vehicle', label: 'Vehicle' },
    ],
    idLabel: 'Object',
    primaryAction: 'View event',
    criticalAlert: { title: 'Person in restricted area at Admin block', cameraIndex: 7 },
    savedViews: ['Main gates', 'Night patrol', 'Parking'],
  },
  anpr: {
    zoneGroup: 'Main gates',
    cameras: [
      ['Main gates', 'Gate 1 entry'],
      ['Main gates', 'Gate 1 exit'],
      ['Main gates', 'Gate 3 entry'],
      ['Main gates', 'Gate 3 exit'],
      ['Service gates', 'Gate 5 service'],
      ['Service gates', 'Gate 6 delivery'],
      ['Parking', 'P1 ramp'],
      ['Parking', 'P2 entry'],
      ['North gates', 'Gate 7 entry'],
      ['North gates', 'Gate 7 exit'],
      ['North gates', 'Gate 8 staff'],
      ['North parking', 'P4 ramp'],
    ],
    stats: [S('Vehicles (1h)', '186', '+6%', 'up'), S('Unknown plates', '9', '+2', 'up'), S('Watchlist hits', '1', '0'), S('Barrier status', '4 open / 2 closed', '')],
    offlineStats: [S('Vehicles (1h)', '171', '−8%', 'down'), S('Unknown plates', '9', '+2', 'up'), S('Watchlist hits', '1', '0'), S('Barrier status', '3 open / 2 closed', '1 offline', 'down')],
    object: 'vehicle',
    detectionTypes: [
      { value: 'car', label: 'Car' },
      { value: 'two-wheeler', label: 'Two-wheeler' },
      { value: 'truck', label: 'Truck' },
      { value: 'bus', label: 'Bus' },
    ],
    idLabel: 'Plate',
    primaryAction: 'Add to watchlist',
    criticalAlert: { title: 'Watchlist vehicle MH12 XY 4521 at Gate 3', cameraIndex: 2 },
    savedViews: ['Main gates', 'Night patrol', 'Service gates'],
  },
  hosteltrack: {
    zoneGroup: 'Block A–C',
    cameras: [
      ['Block A', 'Block A entrance'],
      ['Block A', 'Block A corridor'],
      ['Block B', 'Block B entrance'],
      ['Block B', 'Block B stairwell'],
      ['Block C', 'Block C entrance'],
      ['Block C', 'Block C rear door'],
      ['Main hostel gate', 'Hostel gate in'],
      ['Main hostel gate', 'Hostel gate out'],
      ['Block D', 'Block D entrance'],
      ['Block D', 'Block D corridor'],
      ['Block E', 'Block E entrance'],
      ['Girls hostel', 'Girls hostel gate'],
    ],
    stats: [S('Present', '942/1,020', '92%'), S('In (1h)', '64', '+12', 'up'), S('Out (1h)', '51', '−4', 'down'), S('Unauthorized exits', '1', '+1', 'up')],
    offlineStats: [S('Present', '936/1,020', '92%'), S('In (1h)', '58', '+6', 'up'), S('Out (1h)', '49', '−6', 'down'), S('Unauthorized exits', '1', '+1', 'up')],
    object: 'person',
    detectionTypes: [
      { value: 'in', label: 'Entry' },
      { value: 'out', label: 'Exit' },
    ],
    idLabel: 'Student ID',
    primaryAction: 'View student',
    criticalAlert: { title: 'Unauthorized exit STU-1187 at Block C rear door', cameraIndex: 5 },
    savedViews: ['Hostel exits', 'Night patrol', 'Block A–C'],
  },
  mealpulse: {
    zoneGroup: 'Central canteen',
    cameras: [
      ['Central canteen', 'Counter 1'],
      ['Central canteen', 'Counter 2'],
      ['Central canteen', 'Counter 3'],
      ['Central canteen', 'Queue lane'],
      ['Central canteen', 'Billing'],
      ['Central canteen', 'Seating east'],
      ['Central canteen', 'Tray return'],
      ['Central canteen', 'Wash area'],
      ['North canteen', 'Counter 4'],
      ['North canteen', 'Queue lane'],
      ['Staff canteen', 'Counter 5'],
      ['Staff canteen', 'Seating'],
    ],
    stats: [S('Served (1h)', '318', '+14%', 'up'), S('Queue now', '23', '+5', 'up'), S('Avg wait', '6 min', '+1 min', 'up'), S('Duplicate attempts', '2', '0')],
    offlineStats: [S('Served (1h)', '301', '+8%', 'up'), S('Queue now', '23', '+5', 'up'), S('Avg wait', '7 min', '+2 min', 'up'), S('Duplicate attempts', '2', '0')],
    object: 'tray',
    detectionTypes: [
      { value: 'breakfast', label: 'Breakfast' },
      { value: 'lunch', label: 'Lunch' },
      { value: 'dinner', label: 'Dinner' },
    ],
    idLabel: 'Meal',
    primaryAction: 'View meal log',
    criticalAlert: { title: 'Blocked student at Counter 2', cameraIndex: 1 },
    savedViews: ['Main counters', 'Queue lanes', 'Night patrol'],
  },
  visitor: {
    zoneGroup: 'Reception & gates',
    cameras: [
      ['Reception', 'Reception desk'],
      ['Reception', 'Turnstile 1'],
      ['Reception', 'Turnstile 2'],
      ['Reception', 'Lobby'],
      ['Gates', 'Main entrance'],
      ['Gates', 'Side gate'],
      ['Admin block', 'Admin corridor'],
      ['Admin block', 'Lab wing door'],
      ['Guest house', 'Guest house entry'],
      ['Guest house', 'Guest lobby'],
      ['North gate', 'North entrance'],
      ['North gate', 'Parking walkway'],
    ],
    stats: [S('On site', '64', '+6', 'up'), S('Checked in (1h)', '18', '+3', 'up'), S('Overstayed', '3', '+1', 'up'), S('Pending approvals', '5', '−2', 'down')],
    offlineStats: [S('On site', '64', '+6', 'up'), S('Checked in (1h)', '15', '0'), S('Overstayed', '3', '+1', 'up'), S('Pending approvals', '5', '−2', 'down')],
    object: 'person',
    detectionTypes: [
      { value: 'checkin', label: 'Check-in' },
      { value: 'checkout', label: 'Check-out' },
    ],
    idLabel: 'Pass ID',
    primaryAction: 'Check out visitor',
    criticalAlert: { title: 'Watchlisted visitor at Main entrance', cameraIndex: 4 },
    savedViews: ['Reception', 'Night patrol', 'Gates'],
  },
};

export const getLiveUseCase = (id: string | null | undefined): LiveUseCase => {
  const shell = getDashboardUseCase(id);
  return { id: shell.id, shell, scene: shell.scene, ...CONFIG[shell.id] };
};

export const USE_CASE_IDS: UseCaseId[] = ['generic', 'anpr', 'hosteltrack', 'mealpulse', 'visitor'];
export const USE_CASE_LABEL: Record<UseCaseId, string> = {
  generic: 'Generic',
  anpr: 'ANPR',
  hosteltrack: 'HostelTrack',
  mealpulse: 'Meal Pulse',
  visitor: 'Visitor Management',
};
