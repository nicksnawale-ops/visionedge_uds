/**
 * Sample VisionEdge data for the Charts page. All values are illustrative.
 * "Today" is Wed 30 Sep 2026.
 */

const HOURS_24 = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`);
export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export interface CategoryValue {
  label: string;
  value: number;
}

/* ── Trend ───────────────────────────────────────────────────────── */

export interface TimeValue {
  time: string;
  value: number;
}

/** HostelTrack: residents inside hostels, hourly. Capacity 1,200. */
export const hostelOccupancyByHour: TimeValue[] = [
  1148, 1152, 1156, 1158, 1160, 1154, 1120, 980, 720, 460, 340, 302, 318, 284, 296, 330, 410, 620, 840, 980,
  1068, 1112, 1140, 1162,
].map((value, h) => ({ time: HOURS_24[h], value }));

export interface VehicleTypeEntries {
  time: string;
  regular: number;
  commercial: number;
  vip: number;
}

/** ANPR: campus entries by vehicle type, 06:00–21:00. */
export const campusEntriesByType: VehicleTypeEntries[] = [
  [42, 18, 2], [168, 46, 6], [312, 84, 14], [286, 96, 18], [198, 102, 12], [164, 88, 8], [182, 74, 10], [210, 92, 16],
  [176, 98, 12], [158, 86, 9], [192, 72, 11], [248, 54, 15], [302, 38, 12], [226, 26, 6], [118, 14, 3], [64, 8, 1],
].map(([regular, commercial, vip], i) => ({ time: HOURS_24[i + 6], regular, commercial, vip }));

/* ── Comparison ──────────────────────────────────────────────────── */

export const entriesByGate: CategoryValue[] = [
  { label: 'Gate 1', value: 286 },
  { label: 'Gate 2', value: 198 },
  { label: 'Gate 3', value: 412 },
  { label: 'Gate 4', value: 157 },
  { label: 'Gate 5', value: 233 },
  { label: 'Gate 6', value: 98 },
];

export interface WeekComparison {
  day: Weekday;
  thisWeek: number;
  lastWeek: number;
}

/** Meal Pulse: meals served, this week vs last week. */
export const mealsWeekOverWeek: WeekComparison[] = [
  { day: 'Mon', thisWeek: 2310, lastWeek: 2186 },
  { day: 'Tue', thisWeek: 2284, lastWeek: 2240 },
  { day: 'Wed', thisWeek: 2402, lastWeek: 2318 },
  { day: 'Thu', thisWeek: 2356, lastWeek: 2290 },
  { day: 'Fri', thisWeek: 2298, lastWeek: 2342 },
  { day: 'Sat', thisWeek: 1642, lastWeek: 1590 },
  { day: 'Sun', thisWeek: 1518, lastWeek: 1476 },
];

export interface MealsByType {
  day: Weekday;
  breakfast: number;
  lunch: number;
  snacks: number;
  dinner: number;
}

/** Meal Pulse: meals by type per day (totals match this week above). */
export const mealsByTypePerDay: MealsByType[] = [
  { day: 'Mon', breakfast: 620, lunch: 840, snacks: 310, dinner: 540 },
  { day: 'Tue', breakfast: 604, lunch: 832, snacks: 302, dinner: 546 },
  { day: 'Wed', breakfast: 642, lunch: 868, snacks: 328, dinner: 564 },
  { day: 'Thu', breakfast: 628, lunch: 856, snacks: 318, dinner: 554 },
  { day: 'Fri', breakfast: 612, lunch: 838, snacks: 306, dinner: 542 },
  { day: 'Sat', breakfast: 412, lunch: 604, snacks: 226, dinner: 400 },
  { day: 'Sun', breakfast: 386, lunch: 552, snacks: 204, dinner: 376 },
];

/** Detections per camera today (unsorted; the chart sorts largest first). */
export const cameraDetections: CategoryValue[] = [
  { label: 'CAM_GATE_01_R1', value: 1516 },
  { label: 'CAM_HOSTEL_C_01', value: 962 },
  { label: 'CAM_GATE_03_R1', value: 1842 },
  { label: 'CAM_MESS_01', value: 731 },
  { label: 'CAM_PARK_B_02', value: 1288 },
  { label: 'CAM_GATE_02_R1', value: 874 },
  { label: 'CAM_LIB_EXIT_01', value: 588 },
  { label: 'CAM_GATE_05_R2', value: 1104 },
];

export interface EntriesVsAttempts {
  day: string;
  entries: number;
  attempts: number;
}

export const dailyEntriesVsAttempts: EntriesVsAttempts[] = [
  { day: 'Thu 24', entries: 1302, attempts: 7 },
  { day: 'Fri 25', entries: 1256, attempts: 11 },
  { day: 'Sat 26', entries: 876, attempts: 19 },
  { day: 'Sun 27', entries: 742, attempts: 14 },
  { day: 'Mon 28', entries: 1318, attempts: 6 },
  { day: 'Tue 29', entries: 1347, attempts: 9 },
  { day: 'Wed 30', entries: 1284, attempts: 5 },
];

/* ── Composition ─────────────────────────────────────────────────── */

export const visitorPurpose: CategoryValue[] = [
  { label: 'Delivery', value: 142 },
  { label: 'Parent visit', value: 96 },
  { label: 'Vendor', value: 58 },
  { label: 'Other', value: 24 },
];

/* ── Distribution ────────────────────────────────────────────────── */

export interface HeatmapRow {
  day: Weekday;
  /** 24 hourly counts, 00:00–23:00. */
  values: number[];
}

const HOUR_PROFILE = [4, 2, 1, 1, 2, 8, 28, 96, 182, 124, 78, 64, 72, 70, 62, 74, 110, 168, 132, 74, 46, 30, 18, 9];
const WEEKDAY_FACTOR = [1, 0.97, 1.02, 0.99, 0.94, 0.48, 0.36];

/** ANPR: gate traffic by weekday × hour (deterministic sample). */
export const gateTrafficHeatmap: HeatmapRow[] = WEEKDAYS.map((day, d) => ({
  day,
  values: HOUR_PROFILE.map((base, h) => Math.round(base * WEEKDAY_FACTOR[d]) + ((d * 7 + h * 13) % 9)),
}));

export const HEATMAP_HOURS = HOURS_24;

/* ── KPI & Progress ──────────────────────────────────────────────── */

export interface KpiTileData {
  id: string;
  label: string;
  value: string;
  trend: string;
  direction: 'up' | 'down' | 'flat';
  spark: number[];
}

export const kpiTiles: KpiTileData[] = [
  {
    id: 'vehicles',
    label: 'Vehicles today',
    value: '1,284',
    trend: '+8.2% vs yesterday',
    direction: 'up',
    spark: [38, 52, 61, 58, 74, 80, 77, 92, 98, 104, 110, 118],
  },
  {
    id: 'students',
    label: 'Students present',
    value: '942',
    trend: '−1.4% vs yesterday',
    direction: 'down',
    spark: [960, 958, 955, 951, 949, 950, 947, 945, 944, 943, 942, 942],
  },
  {
    id: 'meals',
    label: 'Meals served',
    value: '2,310',
    trend: '+5.7% vs last week',
    direction: 'up',
    spark: [2186, 2190, 2205, 2198, 2230, 2244, 2251, 2262, 2270, 2288, 2296, 2310],
  },
  {
    id: 'cameras',
    label: 'Active cameras',
    value: '36/38',
    trend: '2 offline since 06:00',
    direction: 'flat',
    spark: [38, 38, 37, 38, 37, 36, 37, 36, 36, 36, 37, 36],
  },
];

export const cameraUptime = { value: 94.7, target: 98 };

export interface HostelBlock {
  block: string;
  occupied: number;
  capacity: number;
  /** Target occupancy, % of capacity. */
  target: number;
}

export const hostelBlocks: HostelBlock[] = [
  { block: 'Block A', occupied: 228, capacity: 240, target: 90 },
  { block: 'Block B', occupied: 196, capacity: 240, target: 90 },
  { block: 'Block C', occupied: 291, capacity: 300, target: 95 },
  { block: 'Block D', occupied: 142, capacity: 200, target: 85 },
  { block: 'Block E', occupied: 170, capacity: 220, target: 85 },
];
