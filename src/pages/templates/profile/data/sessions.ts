/** Active sessions and trusted devices. Fixed sample data; IPs are always masked. */
import type { ViewerMode } from '../profileStates';

export type DeviceKind = 'desktop' | 'phone' | 'tablet';

export interface Session {
  id: string;
  kind: DeviceKind;
  /** "Chrome on Windows 11" */
  device: string;
  location: string;
  ip: string;
  signedIn: string;
  lastActive: string;
  /** Absolute time for the relative "Last active" tooltip. */
  lastActiveAbsolute: string;
  /** The device you're using now (self view only). */
  current: boolean;
}

export interface TrustedDevice {
  id: string;
  kind: DeviceKind;
  name: string;
  added: string;
}

/** "103.21.58.140" → "103.21.xx.xx" */
export const maskIp = (ip: string): string => ip.split('.').slice(0, 2).concat('xx', 'xx').join('.');

const SELF_SESSIONS: Session[] = [
  {
    id: 's1',
    kind: 'desktop',
    device: 'Chrome on Windows 11',
    location: 'Pune, MH',
    ip: '103.21.58.140',
    signedIn: 'Today, 09:14',
    lastActive: 'Active now',
    lastActiveAbsolute: '30 Sep 2026, 14:05 IST',
    current: true,
  },
  {
    id: 's2',
    kind: 'phone',
    device: 'Safari on iPhone',
    location: 'Pune, MH',
    ip: '49.36.112.7',
    signedIn: '28 Sep, 19:40',
    lastActive: '2 hours ago',
    lastActiveAbsolute: '30 Sep 2026, 12:02 IST',
    current: false,
  },
  {
    id: 's3',
    kind: 'tablet',
    device: 'Chrome on Android tablet',
    location: 'Mumbai, MH',
    ip: '157.32.204.51',
    signedIn: '24 Sep, 10:05',
    lastActive: '3 days ago',
    lastActiveAbsolute: '27 Sep 2026, 17:48 IST',
    current: false,
  },
];

const OTHER_SESSIONS: Session[] = [
  {
    id: 'o1',
    kind: 'desktop',
    device: 'Edge on Windows 11',
    location: 'Pune, MH',
    ip: '103.21.58.162',
    signedIn: 'Today, 08:02',
    lastActive: '12 min ago',
    lastActiveAbsolute: '30 Sep 2026, 13:53 IST',
    current: false,
  },
  {
    id: 'o2',
    kind: 'phone',
    device: 'Chrome on Android',
    location: 'Pune, MH',
    ip: '49.36.98.230',
    signedIn: '29 Sep, 21:15',
    lastActive: '5 hours ago',
    lastActiveAbsolute: '30 Sep 2026, 09:10 IST',
    current: false,
  },
];

export const getSessions = (viewer: ViewerMode): Session[] => (viewer === 'self' ? SELF_SESSIONS : OTHER_SESSIONS);

export const getTrustedDevices = (viewer: ViewerMode): TrustedDevice[] =>
  viewer === 'self'
    ? [
        { id: 't1', kind: 'desktop', name: 'Office PC · Chrome on Windows 11', added: 'Added 12 Mar 2025' },
        { id: 't2', kind: 'phone', name: 'iPhone · Safari', added: 'Added 02 Jun 2025' },
      ]
    : [{ id: 't1', kind: 'desktop', name: 'Gate office PC · Edge on Windows 11', added: 'Added 04 Jun 2025' }];
