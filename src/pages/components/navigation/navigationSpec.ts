/** Navigation page data: demo navigation tree, sites, notifications, palette items, specs, rules and content. */
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Camera,
  Car,
  DoorOpen,
  FileText,
  HelpCircle,
  Keyboard,
  LayoutDashboard,
  ListFilter,
  Settings,
  ShieldCheck,
  User,
  UserCheck,
  Users,
  Video,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ── Demo navigation tree ── */

export interface NavChild {
  id: string;
  label: string;
}

export interface NavNode {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: 'NEW' | 'UPDATED';
  count?: number;
  /** Attention dot (8px Cyan) with this screen-reader text. */
  dot?: string;
  /** Disabled with this reason (tooltip). */
  disabled?: string;
  children?: NavChild[];
}

export interface NavGroup {
  id: string;
  heading: string;
  items: NavNode[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'monitor',
    heading: 'Monitor',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'live-view', label: 'Live view', icon: Video, dot: 'live' },
      { id: 'alerts', label: 'Alerts', icon: Bell, count: 12 },
      {
        id: 'events',
        label: 'Events',
        icon: Activity,
        count: 128,
        children: [
          { id: 'all-events', label: 'All events' },
          { id: 'face-matches', label: 'Face matches' },
          { id: 'watchlist-hits', label: 'Watchlist hits' },
        ],
      },
    ],
  },
  {
    id: 'operations',
    heading: 'Operations',
    items: [
      {
        id: 'gates',
        label: 'Gates',
        icon: DoorOpen,
        children: [
          { id: 'entry-gates', label: 'Entry gates' },
          { id: 'exit-gates', label: 'Exit gates' },
        ],
      },
      { id: 'vehicles', label: 'Vehicles', icon: Car },
      { id: 'visitors', label: 'Visitors', icon: UserCheck, badge: 'NEW' },
      {
        id: 'reports',
        label: 'Reports',
        icon: FileText,
        children: [
          { id: 'daily-summary', label: 'Daily summary' },
          { id: 'vehicle-log', label: 'Vehicle log' },
          { id: 'export-history', label: 'Export history' },
        ],
      },
    ],
  },
  {
    id: 'admin',
    heading: 'Administration',
    items: [
      { id: 'cameras', label: 'Cameras', icon: Camera, badge: 'UPDATED' },
      { id: 'users', label: 'Users', icon: Users },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, disabled: 'Available after the analytics add-on is enabled' },
    ],
  },
];

/** Extra group for the long-list scroll demo. */
export const LONG_GROUP: NavGroup = {
  id: 'saved',
  heading: 'Saved views',
  items: [
    { id: 'north-gate-peak', label: 'North gate peak', icon: ListFilter },
    { id: 'night-shift', label: 'Night shift', icon: ListFilter },
    { id: 'visitor-overstays', label: 'Visitor overstays', icon: ListFilter },
    { id: 'blocked-plates', label: 'Blocked plates', icon: ListFilter },
    { id: 'hostel-entries', label: 'Hostel entries', icon: ListFilter },
    { id: 'parking-b2', label: 'Parking B2', icon: ListFilter },
  ],
};

/** Pinned at the bottom of the sidebar, above the user block. */
export const NAV_BOTTOM: NavNode[] = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

export const SITES = ['North campus', 'South campus', 'Hostel block A', 'Hostel block B', 'Main gate complex', 'Research park', 'Staff quarters'];

export const DEMO_USER = { name: 'Anika Kapoor', initials: 'AK', role: 'Security admin', email: 'anika.kapoor@visionedge.in' };

/** Label of any nav id. */
export const navLabel = (id: string): string => {
  for (const g of [...NAV_GROUPS, LONG_GROUP]) {
    for (const i of g.items) {
      if (i.id === id) return i.label;
      const c = i.children?.find((ch) => ch.id === id);
      if (c) return c.label;
    }
  }
  return NAV_BOTTOM.find((b) => b.id === id)?.label ?? id;
};

/* ── Notifications ── */

export interface NotificationItem {
  id: string;
  kind: 'alert' | 'vehicle' | 'camera' | 'visitor';
  title: string;
  meta: string;
  time: string;
  unread: boolean;
}

export const NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', kind: 'alert', title: 'Watchlist match at Gate 2', meta: 'Face match · 94% confidence', time: '2 min ago', unread: true },
  { id: 'n2', kind: 'vehicle', title: 'Blocked plate KA 01 AB 1234', meta: 'Entry denied · North gate', time: '8 min ago', unread: true },
  { id: 'n3', kind: 'camera', title: 'CAM-07 offline', meta: 'Hostel block A · No signal', time: '25 min ago', unread: true },
  { id: 'n4', kind: 'visitor', title: 'Visitor overstay', meta: 'Rahul Mehta · 45 min over', time: '1 hr ago', unread: false },
  { id: 'n5', kind: 'vehicle', title: 'Export ready', meta: 'Vehicle log · 1,248 rows', time: '3 hr ago', unread: false },
  { id: 'n6', kind: 'alert', title: 'Tailgating detected', meta: 'Gate 4 · Clip saved', time: 'Yesterday', unread: false },
];

export const NOTIFICATION_ICON: Record<NotificationItem['kind'], LucideIcon> = {
  alert: AlertTriangle,
  vehicle: Car,
  camera: Camera,
  visitor: UserCheck,
};

/* ── Command palette ── */

export interface PaletteItem {
  id: string;
  group: 'Recent' | 'Pages' | 'Actions' | 'Settings';
  label: string;
  path: string;
  icon: LucideIcon;
  shortcut?: string;
}

export const PALETTE_ITEMS: PaletteItem[] = [
  { id: 'r-vehicle-log', group: 'Recent', label: 'Vehicle log', path: 'Reports / Vehicle log', icon: FileText },
  { id: 'r-cam-07', group: 'Recent', label: 'CAM-07', path: 'Cameras / Hostel block A', icon: Camera },
  { id: 'p-dashboard', group: 'Pages', label: 'Dashboard', path: 'Monitor', icon: LayoutDashboard, shortcut: 'G D' },
  { id: 'p-live', group: 'Pages', label: 'Live view', path: 'Monitor', icon: Video, shortcut: 'G L' },
  { id: 'p-alerts', group: 'Pages', label: 'Alerts', path: 'Monitor', icon: Bell, shortcut: 'G A' },
  { id: 'p-visitors', group: 'Pages', label: 'Visitors', path: 'Operations', icon: UserCheck },
  { id: 'p-daily', group: 'Pages', label: 'Daily summary', path: 'Reports / Daily summary', icon: FileText },
  { id: 'a-export', group: 'Actions', label: 'Export vehicle log', path: 'Reports / Vehicle log', icon: FileText },
  { id: 'a-add-visitor', group: 'Actions', label: 'Add visitor', path: 'Operations / Visitors', icon: UserCheck },
  { id: 'a-shortcuts', group: 'Actions', label: 'Show keyboard shortcuts', path: 'Help', icon: Keyboard, shortcut: '?' },
  { id: 's-profile', group: 'Settings', label: 'My profile', path: 'Settings / Profile', icon: User },
  { id: 's-security', group: 'Settings', label: 'Security', path: 'Settings / Security', icon: ShieldCheck },
];

export const SHORTCUTS: [string[], string][] = [
  [['Ctrl', 'K'], 'Open search (Cmd K on Mac; "/" also works)'],
  [['Ctrl', 'B'], 'Collapse or expand the sidebar'],
  [['G', 'then', 'D'], 'Go to Dashboard'],
  [['G', 'then', 'L'], 'Go to Live view'],
  [['G', 'then', 'A'], 'Go to Alerts'],
  [['?'], 'Show keyboard shortcuts'],
];

/* ── Overview ── */

export const HIERARCHY: [string, string, string][] = [
  ['Global', 'Left sidebar', 'Dashboard, Live view, Reports'],
  ['Utility', 'Top bar', 'Search, notifications, user menu'],
  ['Location', 'Breadcrumbs', 'Reports / Vehicle log / Export'],
  ['Page', 'Page header + back link', '"← Back to vehicle log"'],
  ['Section', 'In-page navigation', 'On this page'],
  ['Process', 'Stepper', 'Step 2 of 4'],
  ['Data', 'Pagination', 'Page 3 of 25'],
];

/* ── Specifications (Component | Property | Value | Token) ── */

export const SPEC_ROWS: [string, string, string, string][] = [
  // Existing rows (kept as they were)
  ['Sidebar', 'Sidebar Width', '240px expanded (72px collapsed icon-only rail)', 'w-[240px] / w-[72px]'],
  ['Sidebar', 'Sidebar Background', '#0B2D6B (Deep Navy), no gradient, 1px right border none', 'bg-[#0B2D6B]'],
  ['Sidebar', 'Sidebar Active Item', 'White text, White 10% fill, 3px Cyan (#00C6FF) left bar', 'bg-white/10 text-white border-l-[#00C6FF]'],
  ['Top bar', 'Top Bar Height', '64px, White, 1px bottom border #DDE2EA', 'h-[64px] bg-white border-b'],
  // New rows
  ['Sidebar', 'Header', '64px high, 16px padding, 32px logo, 1px White 10% divider', 'h-16 px-4 border-b border-white/10'],
  ['Sidebar', 'Group heading', '11px Medium uppercase, +0.08em, #C3CAD5; 24px top / 8px bottom', 'text-[11px] tracking-[0.08em] mt-6 mb-2 pl-4'],
  ['Sidebar', 'Nav item / child item', '40px, 8px radius, 12px padding / 36px, 13px, no icon', 'h-10 rounded-[8px] px-3 / h-9 text-[13px]'],
  ['Sidebar', 'Child indent', '44px, aligned with the parent label', 'pl-[44px]'],
  ['Sidebar', 'Rail tooltip', 'Right side, 8px offset, on hover and focus', 'left-full ml-2'],
  ['Sidebar', 'Rail flyout', '200px white card, elevation-2, 8px radius', 'w-[200px] rounded-[8px] shadow-[0_4px_12px_…]'],
  ['Top bar', 'Position / padding', 'Sticky at the top of the content area; 24px padding (16px mobile)', 'sticky top-0 z-30 px-6 / px-4'],
  ['Top bar', 'Scroll shadow', 'Elevation-1 once content scrolls', 'shadow-[0_1px_3px_rgba(11,45,107,0.08)]'],
  ['Top bar', 'Global search', '320 × 40px, 1px #8C95A6 border, 8px radius, "Ctrl K" chip', 'w-[320px] h-10 border-[#8C95A6]'],
  ['Top bar', 'Icon buttons', 'Ghost, 40 × 40px, 20px icons #4B5465, hover Gray 100', 'w-10 h-10 hover:bg-[#EEF1F6]'],
  ['Notifications', 'Panel', '380px, max 480px high, 12px radius, elevation-2', 'w-[380px] max-h-[480px] rounded-[12px]'],
  ['User menu', 'Panel', '260px, 40px items, 16px icons', 'w-[260px]'],
  ['Command palette', 'Dialog', '640px, top at 15vh, 12px radius, elevation-3, Black 50% scrim', 'w-[640px] mt-[15vh] bg-black/50'],
  ['Breadcrumbs', 'Levels / truncation', 'Max 4 visible levels; labels truncate at 24 characters', 'max-w-[24ch] truncate'],
  ['Stepper', 'Circle', '24px, 1px connecting lines, 12px Medium labels', 'w-6 h-6 h-px text-[12px]'],
  ['Pagination', 'Page item', '32px square, 8px radius, current Royal Blue', 'w-8 h-8 rounded-[8px] bg-[#1E63FF]'],
  ['In-page nav', 'Table of contents', '220px, sticky, 2px Royal Blue active bar', 'w-[220px] sticky'],
  ['In-page nav', 'Back to top', '40px circle, white, elevation-2, 24px from the corner', 'w-10 h-10 rounded-full bottom-6 right-6'],
  ['Mobile', 'Drawer', '280px, 250ms ease-out, Black 50% scrim', 'w-[280px] duration-[250ms] bg-black/50'],
  ['Mobile', 'Bottom bar', '64px, max 5 items, 2px Royal Blue top indicator', 'h-16 border-t border-[#DDE2EA]'],
];

/* ── Accessibility and content ── */

export const ACCESSIBILITY: { title: string; text: string }[] = [
  { title: 'Landmarks', text: 'Sidebar: <nav aria-label="Main">. Top bar: <header>. Breadcrumbs: <nav aria-label="Breadcrumb"> with an ordered list.' },
  { title: 'Current location', text: 'aria-current="page" on the active sidebar item and the last breadcrumb; aria-current="step" on the current step.' },
  { title: 'Disclosure', text: 'Nested parents and the collapse toggle use aria-expanded and aria-controls.' },
  { title: 'Menus', text: 'User menu, breadcrumb overflow and kebab menus use role="menu": ↑/↓ move, Home/End jump, Esc closes and returns focus.' },
  { title: 'Command palette', text: 'role="dialog" with a combobox input and a grouped listbox; aria-activedescendant follows the selection.' },
  { title: 'Focus', text: 'Drawers and dialogs trap focus and restore it on close. The skip link is the first focusable element on the page.' },
  { title: 'Counts and badges', text: 'Screen-reader text spells them out ("Alerts, 12 new"; "Live view, live"). Colour is never the only signal.' },
  { title: 'Focus rings, targets, contrast', text: 'Cyan rings on navy, Royal Blue on white. Touch targets ≥44px. White 80% on Deep Navy passes AA.' },
];

export const CONTENT_RULES = [
  'Sidebar labels: 1–2 words, nouns, sentence case: "Vehicle log", not "View Vehicle Logs".',
  'Group headings: short category nouns: Monitor, Operations, Administration.',
  'Breadcrumbs match page titles exactly.',
  'Back links name the destination: "Back to alerts", not "Back".',
  'Use the same item names in every module.',
];

export const CONTENT_TABLE: [string, string][] = [
  ['View Vehicle Logs', 'Vehicle log'],
  ['MONITORING & SURVEILLANCE', 'Monitor'],
  ['← Back', '← Back to alerts'],
  ['Breadcrumb "Logs" on a page titled "Vehicle log"', 'Breadcrumb "Vehicle log"'],
  ['"Cameras" here, "Devices" there', '"Cameras" everywhere'],
];

/* ── Written rules per section ── */

export const SIDEBAR_RULES: [string, string][] = [
  ['Container', 'Deep Navy #0B2D6B, 240px expanded, 72px rail, full height, fixed. No gradients, no shadows, no right border.'],
  ['Header', '64px (aligned with the top bar), 16px padding, 32px logo + product name (White 16px SemiBold) + caption (11px #C3CAD5), 1px White 10% divider.'],
  ['Site switcher', 'Optional. 40px button, White 6% fill, 8px radius, current site + ChevronsUpDown; opens a searchable site list.'],
  ['Group heading', '11px Medium uppercase, +0.08em, #C3CAD5, 16px left padding, 24px top / 8px bottom. A 1px White 10% divider in the rail.'],
  ['Nav item', '40px, 8px radius, 12px padding, 8px side margin, 20px icon + 14px Medium label, 12px gap; White 80%.'],
  ['States', 'Hover: White 6% fill, White text. Active: White 10% fill, 3px Cyan bar, White text. Focus: 2px Cyan outline, 2px offset. Disabled: White 40% + tooltip with the reason.'],
  ['Badges', 'NEW / UPDATED pills and counts: Cyan 16% fill, Cyan text (counts in JetBrains Mono, max 99+). Attention dot: 8px Cyan + screen-reader text.'],
  ['Nested items', 'Max 2 levels. Parent: ChevronDown (180° when open), 200ms accordion. Children: 36px, 13px, 44px indent, no icons. Active child: Cyan bar; parent White text, stays open.'],
  ['Collapsed rail', 'Icons centred, labels hidden; tooltips right (8px) on hover and focus; parents open a 200px flyout; badges become an 8px dot.'],
  ['Scroll', 'Header and footer pinned; only the middle scrolls (thin White 20% thumb); the active item is scrolled into view on load.'],
  ['Footer', 'User block (32px avatar, name, role; opens the user menu upward) + Collapse sidebar (Ctrl B). Collapse state saved in localStorage.'],
  ['Content limits', 'Max 7 items per group, 4 groups, ~25 items. Order by frequency of use; Settings and Help at the bottom.'],
];

export const TOPBAR_RULES: [string, string][] = [
  ['Surface', '64px, White, 1px #DDE2EA bottom border, sticky above content (below modals). Elevation-1 once the content scrolls.'],
  ['Layout', 'Padding 24px (16px mobile). Left: breadcrumbs (desktop) or page title (mobile). Right, 8px gaps: search → site → live → help → notifications → avatar.'],
  ['Global search', '320 × 40px, white, 1px #8C95A6 border, 8px radius, Search icon, "Search…", "Ctrl K" chip (JetBrains Mono, Gray 50). Opens the command palette; an icon button below 1024px.'],
  ['Icon buttons', 'Ghost, 40 × 40px, 20px icons #4B5465, hover Gray 100, tooltip + aria-label.'],
  ['Live indicator', 'Pulsing Cyan dot + "Live" (12px Medium); paused: Gray 400 dot + "Paused".'],
  ['Responsive', 'Below 1024px help and the site selector move into the user menu. Below 768px: menu toggle, title, search icon, notifications and avatar only.'],
];

export const BREADCRUMB_RULES: [string, string][] = [
  ['Style', '12px or 14px #4B5465; "/" separators in Gray 300 with 8px spacing. Ancestors are links (hover Royal Blue + underline); the current page is #121722 Medium, not a link.'],
  ['Length', 'Max 4 visible levels: longer paths collapse the middle into "…" (a menu of hidden levels). Labels truncate at 24 characters with a tooltip. Never wrap.'],
  ['Mobile', 'Only "← Parent page" as a link.'],
  ['First crumb', 'Leave out the product name when it is already in the sidebar header, unless the app is multi-product.'],
];

export const PAGE_HEADER_RULES: [string, string][] = [
  ['Order', 'Breadcrumbs (optional) → back link (detail pages) → H1 + status badge → subtitle; actions on the right.'],
  ['Back link', 'ArrowLeft + "Back to vehicle log" (14px Medium Royal Blue). Returns to the parent list with its filters and scroll kept.'],
  ['Actions', 'Max 1 Primary + 2 Secondary; the rest in a kebab menu.'],
];

export const PAGINATION_RULES: [string, string][] = [
  ['Numbered', 'Tables and long lists. Previous/Next Ghost buttons, 32px pages (current Royal Blue), gaps as "…", rows per page (10/25/50), "Showing 26–50 of 1,248".'],
  ['Compact', 'Cards and mobile: "Page 3 of 25" + previous/next icons.'],
  ['Load more', 'Feeds people browse casually: Secondary "Load more" + "Showing 50 of 1,248".'],
  ['Infinite scroll', 'Live feeds and logs only. Show "New events (12)" to jump to the top; the footer must stay reachable.'],
  ['Always', 'Reset to page 1 when filters change; keep the page number in the URL.'],
];
