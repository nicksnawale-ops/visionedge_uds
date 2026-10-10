/**
 * Chart datasets per use case × date range × tab, in the exact shapes the
 * Charts-page components expect. Deterministic (seeded), so renders are stable.
 */
import type {
  CategoryValue,
  HeatmapRow,
  HostelBlock,
  MealsByType,
  TimeValue,
  VehicleTypeEntries,
  WeekComparison,
} from '../../../../components/charts/sampleData';
import { WEEKDAYS } from '../../../../components/charts/sampleData';
import { hashSeed, pad2, seeded } from './seed';
import type { HealthBar } from '../charts/HealthBulletBars';
import type { RangeMeta, UseCaseId } from './useCases';

/* ── Shapes for the dashboard-local charts ───────────────────────── */

export interface LineSeries {
  key: string;
  label: string;
  values: number[];
}

export interface LineData {
  labels: string[];
  series: LineSeries[];
}

export interface ComboPoint {
  label: string;
  bars: number;
  line: number;
}

export interface ComboData {
  barLabel: string;
  lineLabel: string;
  points: ComboPoint[];
}

/* ── X axes ──────────────────────────────────────────────────────── */

const HOURS_24 = Array.from({ length: 24 }, (_, h) => `${pad2(h)}:00`);
const DAY_HOURS = HOURS_24.slice(6, 22); // 06:00–21:00

/** Day labels ending on Wed 30 Sep 2026. */
function dayLabels(count: number): string[] {
  const end = new Date(Date.UTC(2026, 8, 30));
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(end);
    d.setUTCDate(end.getUTCDate() - (count - 1 - i));
    return `${d.getUTCDate()} ${d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })}`;
  });
}

/** Today → hours; longer ranges → one point per day. */
function xAxis(range: RangeMeta): string[] {
  if (range.id === 'today') return DAY_HOURS;
  return dayLabels(range.id === '7d' ? 7 : range.id === '30d' ? 30 : 14);
}

/* ── Profiles ────────────────────────────────────────────────────── */

/** Campus traffic shape over 06:00–21:00 (morning and evening peaks). */
const DAY_SHAPE = [0.15, 0.55, 1, 0.85, 0.6, 0.5, 0.55, 0.62, 0.52, 0.48, 0.58, 0.78, 0.95, 0.7, 0.36, 0.2];
/** Weekly shape Thu → Wed (quieter weekend). */
const WEEK_SHAPE = [1, 0.97, 0.52, 0.42, 1.02, 1.04, 1];

function shapeFor(range: RangeMeta, i: number, n: number): number {
  if (range.id === 'today') return DAY_SHAPE[i] ?? 0.5;
  // Day d of the range, aligned so the last point is a Wednesday.
  const weekday = (i - (n - 1) + 6 * 7 + 6) % 7;
  return WEEK_SHAPE[weekday];
}

function makeRand(...parts: (string | number)[]) {
  return seeded(hashSeed(parts.join('|')));
}

/** Count series: peak value × shape × small seeded noise. */
function counts(range: RangeMeta, peak: number, seedKey: string): number[] {
  const labels = xAxis(range);
  const rand = makeRand(seedKey, range.id);
  const perPoint = range.id === 'today' ? peak : (peak * 16) / 3; // a day ≈ 16 busy hours at a third of peak
  return labels.map((_, i) => Math.round(perPoint * shapeFor(range, i, labels.length) * (0.9 + rand() * 0.2)));
}

/* ── Main trend chart ────────────────────────────────────────────── */

export function genericLine(range: RangeMeta, tab: 0 | 1): LineData {
  const labels = xAxis(range);
  return tab === 0
    ? {
        labels,
        series: [
          { key: 'detections', label: 'Detections', values: counts(range, 420, 'gen-det') },
          { key: 'motion', label: 'Motion', values: counts(range, 260, 'gen-mot') },
        ],
      }
    : {
        labels,
        series: [
          { key: 'info', label: 'Info', values: counts(range, 14, 'gen-info') },
          { key: 'critical', label: 'Critical', values: counts(range, 4, 'gen-crit') },
        ],
      };
}

export function anprStackedArea(range: RangeMeta, tab: 0 | 1): VehicleTypeEntries[] {
  const labels = xAxis(range);
  const k = tab === 0 ? 1 : 0.92;
  const regular = counts(range, 300 * k, `anpr-reg-${tab}`);
  const commercial = counts(range, 90 * k, `anpr-com-${tab}`);
  const vip = counts(range, 16 * k, `anpr-vip-${tab}`);
  return labels.map((time, i) => ({ time, regular: regular[i], commercial: commercial[i], vip: vip[i] }));
}

/** HostelTrack: residents (or late entries) by hour; longer ranges show the hourly average. */
export function hostelArea(range: RangeMeta, tab: 0 | 1): TimeValue[] {
  const rand = makeRand('hostel', range.id, tab);
  if (tab === 0) {
    const occupancy = [1148, 1152, 1156, 1158, 1160, 1154, 1120, 980, 720, 460, 340, 302, 318, 284, 296, 330, 410, 620, 840, 980, 1068, 1112, 1140, 1162];
    const k = range.id === 'today' ? 1 : 0.97;
    return occupancy.map((v, h) => ({ time: HOURS_24[h], value: Math.round(v * k * (0.98 + rand() * 0.04)) }));
  }
  const late = [6, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 4, 9, 14];
  const k = range.id === 'today' ? 1 : range.factor / 6;
  return late.map((v, h) => ({ time: HOURS_24[h], value: Math.round(v * k * (0.85 + rand() * 0.3)) }));
}

export function mealStackedBar(range: RangeMeta, tab: 0 | 1): MealsByType[] {
  const rand = makeRand('meal', range.id, tab);
  const k = (range.id === 'today' ? 1 : range.factor / 6.6) * (tab === 0 ? 1 : 1.06);
  const weekend = [1, 1, 1, 1, 1, 0.68, 0.62];
  return WEEKDAYS.map((day, i) => {
    const w = weekend[i] * k * (0.96 + rand() * 0.08);
    return {
      day,
      breakfast: Math.round(620 * w),
      lunch: Math.round(845 * w),
      snacks: Math.round(312 * w),
      dinner: Math.round(548 * w),
    };
  });
}

export function visitorCombo(range: RangeMeta, tab: 0 | 1): ComboData {
  const labels = xAxis(range);
  const k = tab === 0 ? 1 : 0.38;
  const checkIns = counts(range, 22 * k, `vis-in-${tab}`);
  const rand = makeRand('vis-out', range.id, tab);
  return {
    barLabel: 'Check-ins',
    lineLabel: 'Check-outs',
    points: labels.map((label, i) => ({
      label,
      bars: checkIns[i],
      line: Math.round(checkIns[Math.max(0, i - 1)] * (0.8 + rand() * 0.3)),
    })),
  };
}

/* ── Insights ────────────────────────────────────────────────────── */

const HOUR_PROFILE = [4, 2, 1, 1, 2, 8, 28, 96, 182, 124, 78, 64, 72, 70, 62, 74, 110, 168, 132, 74, 46, 30, 18, 9];
const WEEKDAY_FACTOR = [1, 0.97, 1.02, 0.99, 0.94, 0.48, 0.36];

/** Weekday × hour grid; scaled by the range so longer ranges show larger totals. */
export function weekHeatmap(range: RangeMeta, seedKey: string, peak: number): HeatmapRow[] {
  const rand = makeRand(seedKey, range.id);
  const k = (range.id === 'today' ? 1 : range.factor / 6.6) * (peak / 182);
  return WEEKDAYS.map((day, d) => ({
    day,
    values: HOUR_PROFILE.map((v) => Math.round(v * WEEKDAY_FACTOR[d] * k * (0.85 + rand() * 0.3))),
  }));
}

const scaled = (range: RangeMeta, items: CategoryValue[], seedKey: string): CategoryValue[] => {
  const rand = makeRand(seedKey, range.id);
  return items.map((it) => ({ label: it.label, value: Math.round(it.value * range.factor * (0.94 + rand() * 0.12)) }));
};

export const anprGates = (range: RangeMeta): CategoryValue[] =>
  scaled(
    range,
    [
      { label: 'Gate 3', value: 412 },
      { label: 'Gate 1', value: 286 },
      { label: 'Gate 5', value: 233 },
      { label: 'Gate 2', value: 198 },
      { label: 'Gate 4', value: 157 },
      { label: 'Gate 6', value: 98 },
    ],
    'anpr-gates'
  );

export const anprClasses = (range: RangeMeta): CategoryValue[] =>
  scaled(
    range,
    [
      { label: 'Cars', value: 706 },
      { label: 'Two-wheelers', value: 318 },
      { label: 'Commercial', value: 193 },
      { label: 'Buses', value: 67 },
    ],
    'anpr-classes'
  );

export const genericEventTypes = (range: RangeMeta): CategoryValue[] =>
  scaled(
    range,
    [
      { label: 'Person detected', value: 2310 },
      { label: 'Vehicle detected', value: 1640 },
      { label: 'Motion', value: 712 },
      { label: 'Tamper / offline', value: 150 },
    ],
    'gen-types'
  );

export const hostelStatus = (range: RangeMeta): CategoryValue[] => {
  const k = range.id === 'today' ? 1 : 0.99;
  return [
    { label: 'Present', value: Math.round(942 * k) },
    { label: 'On leave', value: 46 },
    { label: 'Outpass', value: 21 },
    { label: 'Not checked in', value: 11 },
  ];
};

export const hostelBlocks = (range: RangeMeta): HostelBlock[] => {
  const d = range.id === 'today' ? 0 : -4;
  return [
    { block: 'Block A', occupied: 228 + d, capacity: 240, target: 90 },
    { block: 'Block B', occupied: 196 + d, capacity: 240, target: 90 },
    { block: 'Block C', occupied: 291 + d, capacity: 300, target: 95 },
    { block: 'Block D', occupied: 142 + d, capacity: 200, target: 85 },
    { block: 'Block E', occupied: 170 + d, capacity: 220, target: 85 },
  ];
};

export function mealWeekOverWeek(range: RangeMeta): WeekComparison[] {
  const rand = makeRand('meal-wow', range.id);
  const thisWeek = [2310, 2284, 2402, 2356, 2298, 1642, 1518];
  return WEEKDAYS.map((day, i) => ({
    day,
    thisWeek: thisWeek[i],
    lastWeek: Math.round(thisWeek[i] * (0.93 + rand() * 0.1)),
  }));
}

export const visitorPurpose = (range: RangeMeta): CategoryValue[] =>
  scaled(
    range,
    [
      { label: 'Delivery', value: 42 },
      { label: 'Parent visit', value: 38 },
      { label: 'Vendor', value: 24 },
      { label: 'Interview / other', value: 16 },
    ],
    'vis-purpose'
  );

/* ── System health ───────────────────────────────────────────────── */

export interface HealthData {
  uptime: number;
  target: number;
  bars: HealthBar[];
  lastSync: string;
}

export function systemHealth(degraded: boolean): HealthData {
  return {
    uptime: degraded ? 89.8 : 94.7,
    target: 98,
    bars: [
      { label: 'Storage used', value: 7.4, max: 10, target: 85, detail: '7.4 of 10 TB' },
      { label: 'Edge devices online', value: degraded ? 20 : 22, max: 24, target: 95, detail: `${degraded ? 20 : 22} of 24 devices` },
      { label: 'Recognition queue', value: degraded ? 410 : 120, max: 1000, target: 60, detail: `${degraded ? 410 : 120} of 1,000 frames` },
    ],
    lastSync: degraded ? 'Last sync 14:03 · 2 devices not reporting' : 'Last sync 14:05 · all edge devices reporting',
  };
}
