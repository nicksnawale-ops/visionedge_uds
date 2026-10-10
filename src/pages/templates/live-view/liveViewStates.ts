/** Live View states, layouts and surfaces (showcase chips and ?state=&layout=&surface=). */
import type { ShowcaseState } from '../shared/TemplateShowcase';

export type LiveStateId =
  | 'default'
  | 'loading'
  | 'offline'
  | 'reconnecting'
  | 'critical'
  | 'focus'
  | 'detail'
  | 'paused'
  | 'low-bandwidth'
  | 'empty';

export const LIVE_STATES: ShowcaseState<LiveStateId>[] = [
  { id: 'default', label: 'Default', behaviour: 'Cameras stream live; detections arrive in the feed every few seconds and boxes follow moving objects.' },
  { id: 'loading', label: 'Loading', behaviour: 'Tiles show a skeleton shimmer and “Connecting to 9 cameras…”; the activity panel shows skeleton rows.' },
  { id: 'offline', label: 'Camera offline', behaviour: '2 tiles are offline with Retry; stats update and an Info banner offers “View details”.' },
  { id: 'reconnecting', label: 'Reconnecting', behaviour: 'One tile dims with a spinner and “Reconnecting… (attempt 2)” while the rest stay live.' },
  { id: 'critical', label: 'Critical alert', behaviour: 'An alert tile pulses 3 times, a Critical banner sits above the wall, the Alerts count goes up and a toast appears.' },
  { id: 'focus', label: 'Focus mode', behaviour: 'Layout 1 with the focused camera large and the timeline open. Esc returns to the grid.' },
  { id: 'detail', label: 'Detection detail', behaviour: 'The detection drawer is open with snapshot, key facts, recent sightings and actions.' },
  { id: 'paused', label: 'Paused', behaviour: 'Feed and tiles are frozen with a “Paused” chip on every tile; “Resume live” is in the toolbar.' },
  { id: 'low-bandwidth', label: 'Low bandwidth', behaviour: 'Several tiles switch to SD and an Info banner explains the lower quality.' },
  { id: 'empty', label: 'No cameras assigned', behaviour: 'An empty wall asks the user to choose cameras from the list or a saved view.' },
];

export const isLiveState = (v: string | null): v is LiveStateId => LIVE_STATES.some((s) => s.id === v);
export const getLiveState = (id: LiveStateId) => LIVE_STATES.find((s) => s.id === id)!;

export type LayoutId = '1' | '2x2' | '3x3' | '4x4' | '1+5';
export const LAYOUTS: { id: LayoutId; label: string; slots: number; cols: number }[] = [
  { id: '1', label: '1', slots: 1, cols: 1 },
  { id: '2x2', label: '2×2', slots: 4, cols: 2 },
  { id: '3x3', label: '3×3', slots: 9, cols: 3 },
  { id: '4x4', label: '4×4', slots: 16, cols: 4 },
  { id: '1+5', label: '1+5', slots: 6, cols: 3 },
];
export const isLayout = (v: string | null): v is LayoutId => LAYOUTS.some((l) => l.id === v);
export const getLayout = (id: LayoutId) => LAYOUTS.find((l) => l.id === id)!;
/** Layouts allowed on narrow screens (768–1023px). */
export const NARROW_LAYOUTS: LayoutId[] = ['1', '2x2', '1+5'];

export type Surface = 'light' | 'control';
export const isSurface = (v: string | null): v is Surface => v === 'light' || v === 'control';
