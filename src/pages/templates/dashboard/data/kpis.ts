import { hashSeed, seeded } from './seed';
import type { RangeMeta, UseCaseId } from './useCases';

type KpiFormat = 'count' | 'percent' | 'fraction' | 'minutes';

interface KpiDef {
  id: string;
  /** Label for "Today". */
  label: string;
  /** Label for longer ranges. */
  rangeLabel: string;
  format: KpiFormat;
  /** Today's value. */
  base: number;
  /** For fractions: the denominator (e.g. 38 cameras). */
  of?: number;
  /** Counts scale with the date range; rates and fractions don't. */
  scales: boolean;
  /** Change per 30-second live tick (counts only; can be negative). */
  liveStep: number;
  /** Trend vs the previous period. */
  trendPct: number;
  /** The single most important KPI gets the 4px Cyan top bar. */
  primary?: boolean;
}

export interface Kpi {
  id: string;
  label: string;
  value: string;
  /** Raw number, used to detect changes for the highlight flash. */
  raw: number;
  trend: string;
  direction: 'up' | 'down';
  spark: number[];
  primary: boolean;
}

const KPI_DEFS: Record<UseCaseId, KpiDef[]> = {
  generic: [
    { id: 'cameras', label: 'Active cameras', rangeLabel: 'Active cameras', format: 'fraction', base: 36, of: 38, scales: false, liveStep: 0, trendPct: -2.6, primary: true },
    { id: 'events', label: 'Events today', rangeLabel: 'Events', format: 'count', base: 4812, scales: true, liveStep: 14, trendPct: 6.1 },
    { id: 'alerts', label: 'Open alerts', rangeLabel: 'Open alerts', format: 'count', base: 5, scales: false, liveStep: 0, trendPct: -16.7 },
    { id: 'uptime', label: 'Network uptime', rangeLabel: 'Network uptime', format: 'percent', base: 94.7, scales: false, liveStep: 0, trendPct: -0.8 },
  ],
  anpr: [
    { id: 'vehicles', label: 'Vehicles today', rangeLabel: 'Vehicles', format: 'count', base: 1284, scales: true, liveStep: 6, trendPct: 8.2, primary: true },
    { id: 'unknown', label: 'Unknown vehicles', rangeLabel: 'Unknown vehicles', format: 'count', base: 37, scales: true, liveStep: 1, trendPct: -4.1 },
    { id: 'watchlist', label: 'Watchlist hits', rangeLabel: 'Watchlist hits', format: 'count', base: 3, scales: true, liveStep: 0, trendPct: 50 },
    { id: 'accuracy', label: 'Recognition accuracy', rangeLabel: 'Recognition accuracy', format: 'percent', base: 98.6, scales: false, liveStep: 0, trendPct: 0.3 },
  ],
  hosteltrack: [
    { id: 'present', label: 'Students present', rangeLabel: 'Avg students present', format: 'fraction', base: 942, of: 1020, scales: false, liveStep: 2, trendPct: -1.4, primary: true },
    { id: 'late', label: 'Late entries', rangeLabel: 'Late entries', format: 'count', base: 18, scales: true, liveStep: 1, trendPct: 12.5 },
    { id: 'leave', label: 'On leave', rangeLabel: 'Leave days', format: 'count', base: 46, scales: true, liveStep: 0, trendPct: -6.1 },
    { id: 'unauthorized', label: 'Unauthorized exits', rangeLabel: 'Unauthorized exits', format: 'count', base: 2, scales: true, liveStep: 0, trendPct: -33.3 },
  ],
  mealpulse: [
    { id: 'served', label: 'Meals served', rangeLabel: 'Meals served', format: 'count', base: 2310, scales: true, liveStep: 9, trendPct: 5.7, primary: true },
    { id: 'pending', label: 'Yet to eat', rangeLabel: 'Missed meals', format: 'count', base: 184, scales: true, liveStep: -9, trendPct: -3.2 },
    { id: 'queue', label: 'Avg queue time', rangeLabel: 'Avg queue time', format: 'minutes', base: 6, scales: false, liveStep: 0, trendPct: -14.3 },
    { id: 'duplicates', label: 'Duplicate attempts', rangeLabel: 'Duplicate attempts', format: 'count', base: 9, scales: true, liveStep: 0, trendPct: 28.6 },
  ],
  visitor: [
    { id: 'onsite', label: 'On site now', rangeLabel: 'Avg on site', format: 'count', base: 64, scales: false, liveStep: 1, trendPct: 10.3, primary: true },
    { id: 'expected', label: 'Expected today', rangeLabel: 'Expected visitors', format: 'count', base: 120, scales: true, liveStep: 0, trendPct: 4.3 },
    { id: 'overstayed', label: 'Overstayed', rangeLabel: 'Overstayed', format: 'count', base: 3, scales: true, liveStep: 0, trendPct: -25 },
    { id: 'preapproved', label: 'Pre-approved', rangeLabel: 'Pre-approved', format: 'percent', base: 82, scales: false, liveStep: 0, trendPct: 3.8 },
  ],
};

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

function formatValue(def: KpiDef, value: number): string {
  switch (def.format) {
    case 'percent':
      return `${value.toFixed(def.base % 1 === 0 ? 0 : 1)}%`;
    case 'fraction':
      return `${fmt(value)}/${fmt(def.of ?? 0)}`;
    case 'minutes':
      return `${Math.round(value)} min`;
    default:
      return fmt(value);
  }
}

/** 12-point sparkline that ends on the current value and follows the trend direction. */
function sparkFor(def: KpiDef, end: number, seedKey: string): number[] {
  const rand = seeded(hashSeed(seedKey));
  const start = end / (1 + def.trendPct / 100);
  return Array.from({ length: 12 }, (_, i) => {
    const t = i / 11;
    const wobble = (rand() - 0.5) * Math.abs(end - start) * 0.35;
    return Math.max(0, start + (end - start) * t + (i === 11 ? 0 : wobble));
  });
}

export interface KpiOptions {
  range: RangeMeta;
  /** Live ticks since load (one per 30 seconds). */
  tick: number;
  /** Degraded state: two cameras offline. */
  degraded?: boolean;
}

export function getKpis(useCase: UseCaseId, { range, tick, degraded = false }: KpiOptions): Kpi[] {
  return KPI_DEFS[useCase].map((def) => {
    let value = def.scales ? def.base * range.factor : def.base;
    // Live increments only make sense for "now" figures.
    if (range.id === 'today') value += def.liveStep * tick;
    if (degraded && def.id === 'cameras') value -= 2;
    if (degraded && def.id === 'uptime') value -= 4.9;
    const direction: Kpi['direction'] = def.trendPct >= 0 ? 'up' : 'down';
    return {
      id: def.id,
      label: range.id === 'today' ? def.label : def.rangeLabel,
      value: formatValue(def, value),
      raw: value,
      trend: `${def.trendPct >= 0 ? '+' : '−'}${Math.abs(def.trendPct).toFixed(1)}% ${range.comparison}`,
      direction,
      spark: sparkFor(def, value, `${useCase}-${def.id}-${range.id}`),
      primary: Boolean(def.primary),
    };
  });
}

/** Labels only, for the Empty and Loading states. */
export const getKpiLabels = (useCase: UseCaseId): { id: string; label: string; primary: boolean }[] =>
  KPI_DEFS[useCase].map((d) => ({ id: d.id, label: d.label, primary: Boolean(d.primary) }));
