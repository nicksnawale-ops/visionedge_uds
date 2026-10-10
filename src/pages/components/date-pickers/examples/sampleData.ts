import type { DayMarkers } from '../calendar/DayCell';
import { TODAY, addDays, compareDay, pad2 } from '../utils/dateMath';

/** Fictional, deterministic recordings data for the inline calendar (90-day retention ending TODAY). */
const RETENTION_START = addDays(TODAY, -89);

const seed = (d: Date) => d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate();

export const recordingMarkers = (d: Date): DayMarkers | null => {
  if (compareDay(d, TODAY) > 0 || compareDay(d, RETENTION_START) < 0) return null;
  const s = seed(d);
  const raw = (s * 37) % 17;
  const events = raw < 3 ? 0 : raw;
  const alerts = s % 7 === 0 ? 1 : s % 11 === 0 ? 2 : 0;
  return events || alerts ? { events, alerts } : null;
};

export interface Recording {
  id: string;
  time: string;
  title: string;
  camera: string;
  kind: 'event' | 'alert';
}

const EVENT_TITLES = ['Vehicle entry · MH14 CD 8578', 'Motion · Loading bay', 'Person at turnstile', 'Barrier opened · Gate 3', 'Line crossing · Hostel A'];
const ALERT_TITLES = ['Watchlist vehicle · TN09 AB 6695', 'Camera tamper detected'];
const CAMERAS = ['CAM-04 · Main gate', 'CAM-07 · Loading bay', 'CAM-02 · Gate 3 entry'];

export const recordingsFor = (d: Date): Recording[] => {
  const m = recordingMarkers(d);
  if (!m) return [];
  const s = seed(d);
  const items: Recording[] = [];
  for (let i = 0; i < m.alerts; i += 1) {
    const min = 7 * 60 + ((s * (i + 3)) % 600);
    items.push({ id: `a${i}`, time: `${pad2(Math.floor(min / 60))}:${pad2(min % 60)}`, title: ALERT_TITLES[(s + i) % 2], camera: CAMERAS[(s + i) % 3], kind: 'alert' });
  }
  for (let i = 0; i < Math.min(m.events, 4); i += 1) {
    const min = 6 * 60 + ((s * (i + 5) * 7) % 840);
    items.push({ id: `e${i}`, time: `${pad2(Math.floor(min / 60))}:${pad2(min % 60)}`, title: EVENT_TITLES[(s + i) % 5], camera: CAMERAS[(s + 2 * i) % 3], kind: 'event' });
  }
  return items.sort((a, b) => a.time.localeCompare(b.time));
};
