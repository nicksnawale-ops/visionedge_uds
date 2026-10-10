import {
  Bell,
  BookUser,
  CalendarClock,
  CalendarDays,
  Camera,
  CarFront,
  ClipboardCheck,
  FileBarChart,
  LayoutDashboard,
  ListChecks,
  MonitorPlay,
  Plus,
  ScrollText,
  Settings,
  ShieldAlert,
  UserCheck,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UseCaseId } from '../../login/backgrounds';

export type { UseCaseId };

/* ── Date ranges ─────────────────────────────────────────────────── */

export type RangeId = 'today' | '7d' | '30d' | 'custom';

export interface RangeMeta {
  id: RangeId;
  /** Segmented control label. */
  label: string;
  /** Widget subtitle. */
  subtitle: string;
  /** Comparison wording for KPI trends. */
  comparison: string;
  /** Multiplier applied to count totals (Today = 1). */
  factor: number;
}

export const RANGES: RangeMeta[] = [
  { id: 'today', label: 'Today', subtitle: 'Today', comparison: 'vs yesterday', factor: 1 },
  { id: '7d', label: '7 days', subtitle: 'Last 7 days', comparison: 'vs previous 7 days', factor: 6.6 },
  { id: '30d', label: '30 days', subtitle: 'Last 30 days', comparison: 'vs previous 30 days', factor: 27.4 },
  { id: 'custom', label: 'Custom', subtitle: 'Custom range', comparison: 'vs previous period', factor: 12.2 },
];

export const getRange = (id: string | null | undefined): RangeMeta => RANGES.find((r) => r.id === id) ?? RANGES[0];

/* ── Use cases ───────────────────────────────────────────────────── */

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export type MainChartKind = 'line' | 'stacked-area' | 'area' | 'stacked-bar' | 'combo';
export type InsightChartKind = 'heatmap' | 'horizontal-bar' | 'bullet' | 'grouped-bar' | 'donut';
export type SceneKind = 'gate' | 'corridor' | 'canteen' | 'turnstile' | 'parking';

export interface DashboardUseCase {
  id: UseCaseId;
  /** Shown under "VisionEdge" in the shell sidebar. */
  productName: string;
  organization: string;
  site: string;
  nav: NavItem[];
  /** The page's single Primary action. */
  primaryAction: { label: string; icon: LucideIcon };
  main: { kind: MainChartKind; title: string; tabs: [string, string] };
  insights: {
    left: { kind: InsightChartKind; title: string };
    right: { kind: InsightChartKind; title: string };
  };
  scene: SceneKind;
}

const DASHBOARD: NavItem = { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard };
const LIVE: NavItem = { id: 'live', label: 'Live view', icon: MonitorPlay };
const ALERTS: NavItem = { id: 'alerts', label: 'Alerts', icon: Bell };
const REPORTS: NavItem = { id: 'reports', label: 'Reports', icon: FileBarChart };
const CAMERAS: NavItem = { id: 'cameras', label: 'Cameras', icon: Camera };
const SETTINGS: NavItem = { id: 'settings', label: 'Settings', icon: Settings };

const ORG = 'Pune Institute of Technology';
const SITE = 'Main campus';

export const DASHBOARD_USE_CASES: DashboardUseCase[] = [
  {
    id: 'generic',
    productName: 'Vision Platform',
    organization: ORG,
    site: SITE,
    nav: [
      DASHBOARD,
      LIVE,
      { id: 'events', label: 'Events', icon: ScrollText },
      ALERTS,
      REPORTS,
      CAMERAS,
      { id: 'users', label: 'Users', icon: Users },
      SETTINGS,
    ],
    primaryAction: { label: 'Add camera', icon: Plus },
    main: { kind: 'line', title: 'Events by hour', tabs: ['Events', 'Alerts'] },
    insights: {
      left: { kind: 'heatmap', title: 'Activity by hour and weekday' },
      right: { kind: 'donut', title: 'Events by type' },
    },
    scene: 'parking',
  },
  {
    id: 'anpr',
    productName: 'ANPR System',
    organization: ORG,
    site: SITE,
    nav: [
      DASHBOARD,
      LIVE,
      { id: 'vehicle-log', label: 'Vehicle log', icon: CarFront },
      { id: 'watchlist', label: 'Watchlist', icon: ShieldAlert },
      ALERTS,
      REPORTS,
      CAMERAS,
      SETTINGS,
    ],
    primaryAction: { label: 'Add to watchlist', icon: Plus },
    main: { kind: 'stacked-area', title: 'Entries by vehicle type', tabs: ['Entries', 'Exits'] },
    insights: {
      left: { kind: 'horizontal-bar', title: 'Top gates by traffic' },
      right: { kind: 'donut', title: 'Vehicle classification' },
    },
    scene: 'gate',
  },
  {
    id: 'hosteltrack',
    productName: 'HostelTrack',
    organization: ORG,
    site: SITE,
    nav: [
      DASHBOARD,
      LIVE,
      { id: 'attendance', label: 'Attendance', icon: ListChecks },
      { id: 'leave', label: 'Leave & outpass', icon: CalendarClock },
      ALERTS,
      REPORTS,
      CAMERAS,
      SETTINGS,
    ],
    primaryAction: { label: 'Approve outpass', icon: ClipboardCheck },
    main: { kind: 'area', title: 'Occupancy through the day', tabs: ['Occupancy', 'Late entries'] },
    insights: {
      left: { kind: 'bullet', title: 'Block occupancy' },
      right: { kind: 'donut', title: 'Students by status' },
    },
    scene: 'corridor',
  },
  {
    id: 'mealpulse',
    productName: 'Meal Pulse',
    organization: ORG,
    site: SITE,
    nav: [
      DASHBOARD,
      LIVE,
      { id: 'meal-log', label: 'Meal log', icon: UtensilsCrossed },
      { id: 'menu', label: 'Menu & schedule', icon: CalendarDays },
      ALERTS,
      REPORTS,
      CAMERAS,
      SETTINGS,
    ],
    primaryAction: { label: 'Update menu', icon: CalendarDays },
    main: { kind: 'stacked-bar', title: 'Meals by type', tabs: ['Served', 'Planned'] },
    insights: {
      left: { kind: 'grouped-bar', title: 'This week vs last week' },
      right: { kind: 'heatmap', title: 'Counter traffic by hour and weekday' },
    },
    scene: 'canteen',
  },
  {
    id: 'visitor',
    productName: 'Visitor Management',
    organization: ORG,
    site: SITE,
    nav: [
      DASHBOARD,
      LIVE,
      { id: 'visitors', label: 'Visitors', icon: BookUser },
      { id: 'pre-approvals', label: 'Pre-approvals', icon: UserCheck },
      ALERTS,
      REPORTS,
      CAMERAS,
      SETTINGS,
    ],
    primaryAction: { label: 'Pre-approve visitor', icon: UserCheck },
    main: { kind: 'combo', title: 'Check-ins vs check-outs', tabs: ['Main gate', 'Side gate'] },
    insights: {
      left: { kind: 'donut', title: 'Visit purpose' },
      right: { kind: 'heatmap', title: 'Check-ins by hour and weekday' },
    },
    scene: 'turnstile',
  },
];

export const getDashboardUseCase = (id: string | null | undefined): DashboardUseCase =>
  DASHBOARD_USE_CASES.find((u) => u.id === id) ?? DASHBOARD_USE_CASES[0];

/** Signed-in user shown in the shell. Fictional. */
export const CURRENT_USER = { name: 'Priya Sharma', role: 'Administrator', initials: 'PS' } as const;

export const SITES = ['Main campus', 'North campus', 'South campus'] as const;
