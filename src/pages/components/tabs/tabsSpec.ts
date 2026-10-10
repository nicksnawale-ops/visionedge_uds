/** Tabs page data: sample tab sets, specifications, choosing tables, accessibility and content rules. */
import { Activity, Bell, Camera, History, KeyRound, LayoutGrid, Monitor, Settings, ShieldCheck, User, Users } from 'lucide-react';
import type { TabItem } from './components/tabStyles';

export const BASIC: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'activity', label: 'Activity' },
  { id: 'settings', label: 'Settings' },
];

export const WITH_ICONS: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'activity', label: 'Activity', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const WITH_COUNTS: TabItem[] = [
  { id: 'all', label: 'All', count: 248 },
  { id: 'open', label: 'Open', count: 12 },
  { id: 'resolved', label: 'Resolved', count: 236 },
];

export const WITH_STATUS: TabItem[] = [
  { id: 'live', label: 'Live feed', status: 'live' },
  { id: 'alerts', label: 'Alerts', status: 'attention', count: 3 },
  { id: 'recordings', label: 'Recordings' },
];

export const VERTICAL: TabItem[] = [
  { id: 'general', label: 'General', icon: LayoutGrid },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'cameras', label: 'Cameras', icon: Camera },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'access', label: 'Access', icon: KeyRound },
];

export const MANY: TabItem[] = ['Overview', 'Gates', 'Vehicles', 'Watchlist', 'Alerts', 'Cameras', 'Reports', 'Visitors', 'Hostel', 'Meals', 'Audit', 'Settings'].map((label) => ({
  id: label.toLowerCase(),
  label,
}));

export const DISPLAY: TabItem[] = [
  { id: 'chart', label: 'Chart' },
  { id: 'table', label: 'Table' },
];

export const PERIOD: TabItem[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
];

export const CAMERAS: TabItem[] = ['CAM-01', 'CAM-03', 'CAM-07'].map((id) => ({ id, label: id, icon: Monitor }));
export const ALL_CAMERAS = ['CAM-01', 'CAM-02', 'CAM-03', 'CAM-04', 'CAM-05', 'CAM-06', 'CAM-07', 'CAM-08', 'CAM-09', 'CAM-10', 'CAM-11', 'CAM-12'];

export const DARK: TabItem[] = [
  { id: 'live', label: 'Live', icon: Activity },
  { id: 'playback', label: 'Playback', icon: History },
  { id: 'events', label: 'Events', icon: Bell },
];

/** Labels for the playground (up to 12). */
export const PLAYGROUND_LABELS = ['Overview', 'Activity', 'Alerts', 'Cameras', 'Reports', 'Users', 'Gates', 'Vehicles', 'Visitors', 'Meals', 'Audit', 'Settings'];

/* ── Specifications ── */

export const SPEC_ROWS = [
  { property: 'Height', value: 'Small 32px · Medium 40px · Large 48px', token: 'h-8 · h-10 · h-12' },
  { property: 'Text', value: '13 / 14 / 16px Medium', token: 'text-[13px] · text-[14px] · text-[16px] font-medium' },
  { property: 'Inactive / Hover / Active', value: 'Gray 600 · Gray 900 · Royal Blue', token: 'text-[#4B5465] · text-[#121722] · text-[#1E63FF]' },
  { property: 'Active Indicator', value: '2px Royal Blue (Cyan on dark), slides 200ms ease-out', token: 'h-[2px] bg-[#1E63FF] duration-200' },
  { property: 'Baseline', value: '1px Gray 200', token: 'border-b border-[#DDE2EA]' },
  { property: 'Gap', value: '32px line tabs · 4px segmented padding', token: 'gap-8 · p-1' },
  { property: 'Segmented Track', value: 'Gray 100, 4px padding, 8px radius; active white, elevation-1, 6px radius', token: 'bg-[#EEF1F6] rounded-[8px] · bg-white shadow-[0_1px_3px_…]' },
  { property: 'Contained Active Tab', value: 'White, 1px Gray 200 top/left/right, 8px top radius', token: 'rounded-t-[8px] border-b-white' },
  { property: 'Vertical Item', value: '40px, 3px Royal Blue left bar, Royal Blue 8% fill', token: 'h-10 w-[3px] bg-[#1E63FF]/[0.08]' },
  { property: 'Count Pill', value: '20px high, 6px padding, 12px Medium mono digits', token: 'h-5 px-1.5 font-mono text-[12px]' },
  { property: 'Status Dot', value: '8px; Cyan live, Deep Navy attention', token: 'w-2 h-2' },
  { property: 'Focus Ring', value: '2px + 2px offset, keyboard only', token: 'focus-visible:ring-2 ring-offset-2' },
  { property: 'Panel Fade', value: '150ms ease-out; none with reduced motion', token: 'duration: 150' },
  { property: 'Recommended Count', value: '2–7 tabs · segmented max 4 · closable max 8', token: '—' },
];

/* ── Choosing ── */

export const CHOOSING: [string, string, string][] = [
  ['Switch between views of one record or page', 'Line tabs', 'Segmented control'],
  ['Tabs inside a card or settings block', 'Contained tabs', 'Vertical tabs'],
  ['Same data, different display (chart/table, day/week)', 'Segmented control', 'Line tabs'],
  ['6+ sections of settings or a profile', 'Vertical tabs', 'Scrollable line tabs'],
  ['Many categories that may not fit', 'Scrollable / overflow tabs', 'Wrapping tabs onto 2 rows'],
  ['Several open items at once (cameras, records)', 'Closable tabs', 'Opening new browser windows'],
  ['Mobile with 2–4 views', 'Full-width tabs', 'Small tabs'],
  ['Monitoring or dark screens', 'Tabs on dark', 'Light tabs on dark backgrounds'],
];

export const NOT_TABS: [string, string][] = [
  ['Sequential steps', 'Stepper (wizard)'],
  ['Filtering a list', 'Filter chips'],
  ['Navigating to another page', 'Links / navigation'],
  ['Showing or hiding detail', 'Accordion / disclosure'],
];

/* ── Accessibility and content ── */

export const ACCESSIBILITY = [
  { title: 'Roles', text: 'role="tablist" (aria-orientation for vertical), role="tab" with aria-selected and aria-controls, role="tabpanel" with aria-labelledby and tabindex="0".' },
  { title: 'Roving tabindex', text: 'Only the selected tab is in the Tab order; arrow keys move between tabs, Home/End jump to the ends.' },
  { title: 'Disabled tabs', text: 'aria-disabled, still focusable, with a tooltip that explains why ("Available after setup is complete").' },
  { title: 'Closable tabs', text: 'Each close button is labelled ("Close CAM-03"); Delete closes the focused tab and focus moves to its neighbour.' },
  { title: 'Counts and dots', text: 'Screen-reader text spells them out: "Alerts, 3 new", "Live feed, live". Colour is never the only signal.' },
  { title: 'Focus, contrast and targets', text: 'Visible 2px focus ring on keyboard focus; Gray 600 and Royal Blue pass AA on white, Cyan only on dark; 44px hit areas on touch.' },
];

export const CONTENT_RULES = [
  'Sentence case: "Live feed", not "Live Feed" or "LIVE FEED".',
  'Nouns, not verbs: "Activity", not "View activity".',
  '1–2 words per tab.',
  'Consistent order across modules: Overview first, Settings last.',
  'Counts use digits with en-IN grouping: 1,248.',
];

export const CONTENT_TABLE: [string, string][] = [
  ['View activity', 'Activity'],
  ['ALERTS', 'Alerts'],
  ['Camera Configuration And Settings', 'Settings'],
  ['Open (1248)', 'Open 1,248'],
  ['Settings · Overview · Activity', 'Overview · Activity · Settings'],
];
