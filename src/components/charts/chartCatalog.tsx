import React from 'react';
import {
  Activity,
  ChartArea,
  ChartBarBig,
  ChartBarDecreasing,
  ChartColumnBig,
  ChartColumnIncreasing,
  ChartColumnStacked,
  ChartNoAxesCombined,
  ChartPie,
  ChartSpline,
  Gauge,
  Grid3x3,
} from 'lucide-react';
import type { ChartEntry } from './ChartShowcase';
import { CHART_CATEGORIES } from './ChartShowcase';
import { formatNumber } from './chartUtils';
import { AreaChart } from './AreaChart';
import { StackedAreaChart } from './StackedAreaChart';
import { BarChart } from './BarChart';
import { GroupedBarChart } from './GroupedBarChart';
import { StackedBarChart } from './StackedBarChart';
import { HorizontalBarChart } from './HorizontalBarChart';
import { ComboChart } from './ComboChart';
import { PieChart } from './PieChart';
import { Heatmap } from './Heatmap';
import { SparklineKpiTiles } from './SparklineKpiTiles';
import { RadialGauge } from './RadialGauge';
import { BulletBars } from './BulletBars';
import {
  HEATMAP_HOURS,
  cameraDetections,
  cameraUptime,
  campusEntriesByType,
  dailyEntriesVsAttempts,
  entriesByGate,
  gateTrafficHeatmap,
  hostelBlocks,
  hostelOccupancyByHour,
  kpiTiles,
  mealsByTypePerDay,
  mealsWeekOverWeek,
  visitorPurpose,
} from './sampleData';

import areaCode from './snippets/AreaChart.tsx.txt?raw';
import stackedAreaCode from './snippets/StackedAreaChart.tsx.txt?raw';
import barCode from './snippets/BarChart.tsx.txt?raw';
import groupedBarCode from './snippets/GroupedBarChart.tsx.txt?raw';
import stackedBarCode from './snippets/StackedBarChart.tsx.txt?raw';
import horizontalBarCode from './snippets/HorizontalBarChart.tsx.txt?raw';
import comboCode from './snippets/ComboChart.tsx.txt?raw';
import pieCode from './snippets/PieChart.tsx.txt?raw';
import heatmapCode from './snippets/Heatmap.tsx.txt?raw';
import sparklineCode from './snippets/SparklineKpiTiles.tsx.txt?raw';
import gaugeCode from './snippets/RadialGauge.tsx.txt?raw';
import bulletCode from './snippets/BulletBars.tsx.txt?raw';

const TODAY = 'Today · 30 Sep 2026';
const THIS_WEEK = '24–30 Sep 2026';

const pct = (part: number, whole: number) => `${((part / whole) * 100).toFixed(1)}%`;
const signedPct = (current: number, previous: number) => {
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? '+' : '−'}${Math.abs(change).toFixed(1)}%`;
};

/* ── New charts ─────────────────────────────────────────────────── */

const visitorTotal = visitorPurpose.reduce((sum, d) => sum + d.value, 0);

export const NEW_CHART_ENTRIES: ChartEntry[] = [
  {
    id: 'area',
    label: 'Area',
    category: 'trend',
    icon: ChartArea,
    render: () => (
      <AreaChart
        title="Hostel occupancy through the day"
        subtitle={`HostelTrack · ${TODAY}`}
        seriesLabel="Residents"
        data={hostelOccupancyByHour}
      />
    ),
    code: areaCode,
    whenToUse: 'Show how one measure changes over time, with emphasis on volume.',
    whenNotToUse: 'Comparing unrelated categories, or more than one overlapping series.',
    table: {
      caption: 'Hostel residents by hour, today',
      columns: [
        { key: 'time', label: 'Time' },
        { key: 'value', label: 'Residents', numeric: true },
      ],
      rows: hostelOccupancyByHour.map((d) => ({ ...d })),
    },
  },
  {
    id: 'stacked-area',
    label: 'Stacked area',
    category: 'trend',
    icon: ChartSpline,
    render: () => (
      <StackedAreaChart
        title="Campus entries by vehicle type"
        subtitle={`ANPR · ${TODAY}`}
        data={campusEntriesByType}
      />
    ),
    code: stackedAreaCode,
    whenToUse: 'Show how a total changes over time and how each part contributes to it.',
    whenNotToUse: 'Reading exact values of the upper layers, or more than 4 series.',
    table: {
      caption: 'Campus entries by vehicle type and hour, today',
      columns: [
        { key: 'time', label: 'Time' },
        { key: 'regular', label: 'Regular', numeric: true },
        { key: 'commercial', label: 'Commercial', numeric: true },
        { key: 'vip', label: 'VIP', numeric: true },
        { key: 'total', label: 'Total', numeric: true },
      ],
      rows: campusEntriesByType.map((d) => ({ ...d, total: d.regular + d.commercial + d.vip })),
    },
  },
  {
    id: 'bar',
    label: 'Bar',
    category: 'comparison',
    icon: ChartColumnIncreasing,
    render: () => (
      <BarChart title="Vehicle entries by gate" subtitle={`ANPR · ${TODAY}`} data={entriesByGate} valueLabel="Entries" />
    ),
    code: barCode,
    whenToUse: 'Compare a single value across a handful of categories.',
    whenNotToUse: 'Trends over time — use a line or area chart.',
    table: {
      caption: 'Vehicle entries by gate, today',
      columns: [
        { key: 'label', label: 'Gate' },
        { key: 'value', label: 'Entries', numeric: true },
      ],
      rows: entriesByGate.map((d) => ({ ...d })),
    },
  },
  {
    id: 'grouped-bar',
    label: 'Grouped bar',
    category: 'comparison',
    icon: ChartColumnBig,
    render: () => (
      <GroupedBarChart
        title="Meals served: this week vs last week"
        subtitle={`Meal Pulse · ${THIS_WEEK}`}
        data={mealsWeekOverWeek}
      />
    ),
    code: groupedBarCode,
    whenToUse: 'Compare 2–3 related values side by side for each category.',
    whenNotToUse: 'Many groups or more than 3 bars per group — it becomes hard to scan.',
    table: {
      caption: 'Meals served per day, this week vs last week',
      columns: [
        { key: 'day', label: 'Day' },
        { key: 'thisWeek', label: 'This week', numeric: true },
        { key: 'lastWeek', label: 'Last week', numeric: true },
        { key: 'change', label: 'Change', numeric: true },
      ],
      rows: mealsWeekOverWeek.map((d) => ({ ...d, change: signedPct(d.thisWeek, d.lastWeek) })),
    },
  },
  {
    id: 'stacked-bar',
    label: 'Stacked bar',
    category: 'comparison',
    icon: ChartColumnStacked,
    render: () => (
      <StackedBarChart title="Meals by type per day" subtitle={`Meal Pulse · ${THIS_WEEK}`} data={mealsByTypePerDay} />
    ),
    code: stackedBarCode,
    whenToUse: 'Compare totals across categories and show what each total is made of.',
    whenNotToUse: 'Comparing the middle segments precisely — only the bottom segment shares a baseline.',
    table: {
      caption: 'Meals by type per day, this week',
      columns: [
        { key: 'day', label: 'Day' },
        { key: 'breakfast', label: 'Breakfast', numeric: true },
        { key: 'lunch', label: 'Lunch', numeric: true },
        { key: 'snacks', label: 'Snacks', numeric: true },
        { key: 'dinner', label: 'Dinner', numeric: true },
        { key: 'total', label: 'Total', numeric: true },
      ],
      rows: mealsByTypePerDay.map((d) => ({ ...d, total: d.breakfast + d.lunch + d.snacks + d.dinner })),
    },
  },
  {
    id: 'horizontal-bar',
    label: 'Horizontal bar',
    category: 'comparison',
    icon: ChartBarDecreasing,
    render: () => (
      <HorizontalBarChart
        title="Top 8 cameras by detections"
        subtitle={TODAY}
        data={cameraDetections}
        valueLabel="Detections"
        monoLabels
      />
    ),
    code: horizontalBarCode,
    whenToUse: 'Rank categories, especially with long labels such as camera IDs.',
    whenNotToUse: 'Time series — time should run left to right.',
    table: {
      caption: 'Top 8 cameras by detections, today',
      columns: [
        { key: 'label', label: 'Camera', mono: true },
        { key: 'value', label: 'Detections', numeric: true },
      ],
      rows: [...cameraDetections].sort((a, b) => b.value - a.value).map((d) => ({ ...d })),
    },
  },
  {
    id: 'combo',
    label: 'Combo',
    category: 'comparison',
    icon: ChartNoAxesCombined,
    render: () => (
      <ComboChart
        title="Daily entries vs unauthorized attempts"
        subtitle="ANPR · Last 7 days"
        data={dailyEntriesVsAttempts}
      />
    ),
    code: comboCode,
    whenToUse: 'Relate two measures with different units or scales over the same periods.',
    whenNotToUse: 'Measures that share a unit — use a grouped bar or multi-line chart instead.',
    table: {
      caption: 'Daily entries and unauthorized attempts, last 7 days',
      columns: [
        { key: 'day', label: 'Day' },
        { key: 'entries', label: 'Entries', numeric: true },
        { key: 'attempts', label: 'Unauthorized attempts', numeric: true },
      ],
      rows: dailyEntriesVsAttempts.map((d) => ({ ...d })),
    },
  },
  {
    id: 'pie',
    label: 'Pie',
    category: 'composition',
    icon: ChartPie,
    render: () => (
      <PieChart
        title="Visitor purpose split"
        subtitle={`Visitor desk · ${TODAY}`}
        data={visitorPurpose}
        valueLabel="Visitors"
      />
    ),
    code: pieCode,
    whenToUse: '2–4 parts of a whole where one or two parts clearly dominate.',
    whenNotToUse: 'Comparing similar values or more than 4 parts — use a bar chart.',
    table: {
      caption: 'Visitor purpose split, today',
      columns: [
        { key: 'label', label: 'Purpose' },
        { key: 'value', label: 'Visitors', numeric: true },
        { key: 'share', label: 'Share', numeric: true },
      ],
      rows: visitorPurpose.map((d) => ({ label: d.label, value: d.value, share: pct(d.value, visitorTotal) })),
    },
  },
  {
    id: 'heatmap',
    label: 'Heatmap',
    category: 'distribution',
    icon: Grid3x3,
    render: () => (
      <Heatmap
        title="Gate traffic by hour and weekday"
        subtitle={`ANPR · ${THIS_WEEK}`}
        rows={gateTrafficHeatmap}
        columns={HEATMAP_HOURS}
        valueLabel="Entries"
      />
    ),
    code: heatmapCode,
    whenToUse: 'Spot patterns across two dimensions, such as weekday × hour.',
    whenNotToUse: 'Reading exact values — pair it with the table view or a tooltip.',
    table: {
      caption: 'Gate traffic by weekday and hour',
      columns: [
        { key: 'day', label: 'Day' },
        ...HEATMAP_HOURS.map((h) => ({ key: h, label: h, numeric: true })),
      ],
      rows: gateTrafficHeatmap.map((r) => ({
        day: r.day,
        ...Object.fromEntries(r.values.map((v, i) => [HEATMAP_HOURS[i], v])),
      })),
    },
  },
  {
    id: 'sparkline',
    label: 'Sparkline',
    category: 'kpi',
    icon: Activity,
    render: () => <SparklineKpiTiles tiles={kpiTiles} />,
    code: sparklineCode,
    whenToUse: 'Add a small trend to a KPI tile where the number is the main message.',
    whenNotToUse: 'When readers need axes or exact values — use a full chart.',
    table: {
      caption: 'KPI tiles with the last 12 hourly readings',
      columns: [
        { key: 'label', label: 'Metric' },
        { key: 'value', label: 'Value', numeric: true },
        { key: 'trend', label: 'Trend' },
        { key: 'low', label: '12h low', numeric: true },
        { key: 'high', label: '12h high', numeric: true },
      ],
      rows: kpiTiles.map((t) => ({
        label: t.label,
        value: t.value,
        trend: t.trend,
        low: formatNumber(Math.min(...t.spark)),
        high: formatNumber(Math.max(...t.spark)),
      })),
    },
  },
  {
    id: 'gauge',
    label: 'Radial gauge',
    category: 'kpi',
    icon: Gauge,
    render: () => (
      <RadialGauge
        title="Camera network uptime"
        subtitle="Last 30 days · 38 cameras"
        value={cameraUptime.value}
        target={cameraUptime.target}
        valueLabel="Uptime"
      />
    ),
    code: gaugeCode,
    whenToUse: 'A single percentage measured against a target.',
    whenNotToUse: 'Comparing several values — use bullet bars instead.',
    table: {
      caption: 'Camera network uptime vs target',
      columns: [
        { key: 'metric', label: 'Metric' },
        { key: 'current', label: 'Current', numeric: true },
        { key: 'target', label: 'Target', numeric: true },
        { key: 'gap', label: 'Gap', numeric: true },
      ],
      rows: [
        {
          metric: 'Camera network uptime',
          current: `${cameraUptime.value.toFixed(1)}%`,
          target: `${cameraUptime.target.toFixed(1)}%`,
          gap: `${(cameraUptime.value - cameraUptime.target).toFixed(1)} pts`.replace('-', '−'),
        },
      ],
    },
  },
  {
    id: 'bullet',
    label: 'Bullet bars',
    category: 'kpi',
    icon: ChartBarBig,
    render: () => (
      <BulletBars
        title="Hostel block occupancy"
        subtitle="HostelTrack · Tonight · 30 Sep 2026"
        data={hostelBlocks}
      />
    ),
    code: bulletCode,
    whenToUse: 'Progress of several items against their own targets.',
    whenNotToUse: 'Values without a meaningful maximum or target — use a bar chart.',
    table: {
      caption: 'Hostel block occupancy vs target',
      columns: [
        { key: 'block', label: 'Block' },
        { key: 'occupied', label: 'Occupied', numeric: true },
        { key: 'capacity', label: 'Capacity', numeric: true },
        { key: 'occupancy', label: 'Occupancy', numeric: true },
        { key: 'target', label: 'Target', numeric: true },
      ],
      rows: hostelBlocks.map((b) => ({
        block: b.block,
        occupied: b.occupied,
        capacity: b.capacity,
        occupancy: pct(b.occupied, b.capacity),
        target: `${b.target}%`,
      })),
    },
  },
];

const CATEGORY_ORDER = CHART_CATEGORIES.map((c) => c.id);

/** Stable sort by category (Trend → … → KPI & Progress), keeping order within a category. */
export const orderByCategory = (entries: ChartEntry[]): ChartEntry[] =>
  [...entries].sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));
