import React, { useMemo } from 'react';
import { Heatmap } from '../../../../components/charts/Heatmap';
import { HorizontalBarChart } from '../../../../components/charts/HorizontalBarChart';
import { BulletBars } from '../../../../components/charts/BulletBars';
import { GroupedBarChart } from '../../../../components/charts/GroupedBarChart';
import { ChartState, ChartStatus } from '../../../../components/charts/ChartState';
import type { ChartTableData } from '../../../../components/charts/ChartDataTable';
import { HEATMAP_HOURS } from '../../../../components/charts/sampleData';
import type { CategoryValue } from '../../../../components/charts/sampleData';
import { ChartFrame } from '../charts/ChartFrame';
import { DonutChart } from '../charts/DonutChart';
import { Card } from '../primitives';
import {
  anprClasses,
  anprGates,
  genericEventTypes,
  hostelBlocks,
  hostelStatus,
  mealWeekOverWeek,
  visitorPurpose,
  weekHeatmap,
} from '../data/series';
import type { DashboardUseCase, InsightChartKind, RangeMeta } from '../data/useCases';

interface InsightsRowProps {
  useCase: DashboardUseCase;
  range: RangeMeta;
  status: ChartStatus;
  onChangeRange: () => void;
  anatomy?: React.ReactNode;
}

const categoryTable = (caption: string, label: string, valueLabel: string, data: CategoryValue[]): ChartTableData => ({
  caption,
  columns: [
    { key: 'label', label },
    { key: 'value', label: valueLabel, numeric: true },
  ],
  rows: data.map((d) => ({ ...d })),
});

/** Builds one insight chart for the use case. Each use case uses each chart type at most once. */
function buildInsight(useCase: DashboardUseCase, side: 'left' | 'right', kind: InsightChartKind, title: string, range: RangeMeta) {
  const subtitle = range.subtitle;
  switch (kind) {
    case 'horizontal-bar': {
      const data = anprGates(range);
      return {
        chart: <HorizontalBarChart title={title} subtitle={subtitle} data={data} valueLabel="Vehicles" />,
        table: categoryTable(title, 'Gate', 'Vehicles', data),
        bleed: true,
      };
    }
    case 'bullet': {
      const data = hostelBlocks(range);
      return {
        chart: <BulletBars title={title} subtitle={subtitle} data={data} />,
        table: {
          caption: title,
          columns: [
            { key: 'block', label: 'Block' },
            { key: 'occupied', label: 'Occupied', numeric: true },
            { key: 'capacity', label: 'Capacity', numeric: true },
            { key: 'target', label: 'Target %', numeric: true },
          ],
          rows: data.map((d) => ({ ...d })),
        },
      };
    }
    case 'grouped-bar': {
      const data = mealWeekOverWeek(range);
      return {
        chart: <GroupedBarChart title={title} subtitle="Meals served by weekday" data={data} />,
        table: {
          caption: title,
          columns: [
            { key: 'day', label: 'Day' },
            { key: 'thisWeek', label: 'This week', numeric: true },
            { key: 'lastWeek', label: 'Last week', numeric: true },
          ],
          rows: data.map((d) => ({ ...d })),
        },
      };
    }
    case 'heatmap': {
      const seed = `${useCase.id}-${side}-heat`;
      const peak = useCase.id === 'mealpulse' ? 140 : useCase.id === 'visitor' ? 24 : 182;
      const rows = weekHeatmap(range, seed, peak);
      const unit = useCase.id === 'visitor' ? 'Check-ins' : useCase.id === 'mealpulse' ? 'Diners' : 'Events';
      return {
        chart: <Heatmap title={title} subtitle={subtitle} rows={rows} columns={HEATMAP_HOURS} valueLabel={unit} />,
        table: {
          caption: title,
          columns: [{ key: 'day', label: 'Day' }, ...HEATMAP_HOURS.map((h) => ({ key: h, label: h, numeric: true }))],
          rows: rows.map((r) => ({ day: r.day, ...Object.fromEntries(r.values.map((v, i) => [HEATMAP_HOURS[i], v])) })),
        },
      };
    }
    default: {
      const config =
        useCase.id === 'anpr'
          ? { data: anprClasses(range), label: 'Vehicle class', unit: 'Vehicles' }
          : useCase.id === 'hosteltrack'
            ? { data: hostelStatus(range), label: 'Status', unit: 'Students' }
            : useCase.id === 'visitor'
              ? { data: visitorPurpose(range), label: 'Purpose', unit: 'Visitors' }
              : { data: genericEventTypes(range), label: 'Event type', unit: 'Events' };
      return {
        chart: <DonutChart title={title} subtitle={subtitle} data={config.data} valueLabel={config.unit} />,
        table: categoryTable(title, config.label, config.unit, config.data),
      };
    }
  }
}

/** Two complementary charts, 6 + 6 columns from 1024px, stacked below. */
export const InsightsRow: React.FC<InsightsRowProps> = ({ useCase, range, status, onChangeRange, anatomy }) => {
  const left = useMemo(() => buildInsight(useCase, 'left', useCase.insights.left.kind, useCase.insights.left.title, range), [useCase, range]);
  const right = useMemo(() => buildInsight(useCase, 'right', useCase.insights.right.kind, useCase.insights.right.title, range), [useCase, range]);

  return (
    <div className="relative col-span-12 grid grid-cols-12 gap-6">
      {anatomy}
      {[
        { key: 'left', title: useCase.insights.left.title, view: left },
        { key: 'right', title: useCase.insights.right.title, view: right },
      ].map(({ key, title, view }) => (
        <Card key={key} title={title} subtitle={range.subtitle} className="col-span-12 @min-[1024px]:col-span-6">
          <ChartState status={status} height={260} onChangeRange={onChangeRange}>
            <ChartFrame table={view.table} bleed={'bleed' in view && view.bleed}>
              {view.chart}
            </ChartFrame>
          </ChartState>
        </Card>
      ))}
    </div>
  );
};
