import React, { useMemo, useState } from 'react';
import { AreaChart } from '../../../../components/charts/AreaChart';
import { StackedAreaChart } from '../../../../components/charts/StackedAreaChart';
import { StackedBarChart } from '../../../../components/charts/StackedBarChart';
import { ChartState, ChartStatus } from '../../../../components/charts/ChartState';
import type { ChartTableData } from '../../../../components/charts/ChartDataTable';
import { ChartFrame } from '../charts/ChartFrame';
import { LineTrendChart } from '../charts/LineTrendChart';
import { ComboTrendChart } from '../charts/ComboTrendChart';
import { Card, Tabs } from '../primitives';
import { anprStackedArea, genericLine, hostelArea, mealStackedBar, visitorCombo } from '../data/series';
import type { DashboardUseCase, RangeMeta } from '../data/useCases';

interface MainTrendCardProps {
  useCase: DashboardUseCase;
  range: RangeMeta;
  status: ChartStatus;
  onRetry: () => void;
  onChangeRange: () => void;
  className?: string;
  anatomy?: React.ReactNode;
}

type Tab = 'a' | 'b';

/** Primary trend for the module (8 columns on desktop), with a tab switcher in the header. */
export const MainTrendCard: React.FC<MainTrendCardProps> = ({ useCase, range, status, onRetry, onChangeRange, className = '', anatomy }) => {
  const [tab, setTab] = useState<Tab>('a');
  const t = tab === 'a' ? 0 : 1;
  const tabLabel = useCase.main.tabs[t];
  const subtitle = useCase.id === 'hosteltrack' && range.id !== 'today' ? `${range.subtitle} · average by hour` : range.subtitle;
  const chartTitle = `${useCase.main.title} · ${tabLabel}`;

  const { chart, table } = useMemo((): { chart: React.ReactNode; table: ChartTableData } => {
    switch (useCase.main.kind) {
      case 'stacked-area': {
        const data = anprStackedArea(range, t);
        return {
          chart: <StackedAreaChart title={chartTitle} subtitle={subtitle} data={data} />,
          table: {
            caption: chartTitle,
            columns: [
              { key: 'time', label: range.id === 'today' ? 'Time' : 'Day' },
              { key: 'regular', label: 'Regular', numeric: true },
              { key: 'commercial', label: 'Commercial', numeric: true },
              { key: 'vip', label: 'VIP', numeric: true },
            ],
            rows: data.map((d) => ({ ...d })),
          },
        };
      }
      case 'area': {
        const data = hostelArea(range, t);
        const label = t === 0 ? 'Residents' : 'Late entries';
        return {
          chart: <AreaChart title={chartTitle} subtitle={subtitle} seriesLabel={label} data={data} />,
          table: {
            caption: chartTitle,
            columns: [
              { key: 'time', label: 'Time' },
              { key: 'value', label, numeric: true },
            ],
            rows: data.map((d) => ({ ...d })),
          },
        };
      }
      case 'stacked-bar': {
        const data = mealStackedBar(range, t);
        return {
          chart: <StackedBarChart title={chartTitle} subtitle={`${subtitle} · by weekday`} data={data} />,
          table: {
            caption: chartTitle,
            columns: [
              { key: 'day', label: 'Day' },
              { key: 'breakfast', label: 'Breakfast', numeric: true },
              { key: 'lunch', label: 'Lunch', numeric: true },
              { key: 'snacks', label: 'Snacks', numeric: true },
              { key: 'dinner', label: 'Dinner', numeric: true },
            ],
            rows: data.map((d) => ({ ...d })),
          },
        };
      }
      case 'combo': {
        const data = visitorCombo(range, t);
        return {
          chart: <ComboTrendChart title={chartTitle} subtitle={subtitle} data={data} />,
          table: {
            caption: chartTitle,
            columns: [
              { key: 'label', label: range.id === 'today' ? 'Time' : 'Day' },
              { key: 'bars', label: data.barLabel, numeric: true },
              { key: 'line', label: data.lineLabel, numeric: true },
            ],
            rows: data.points.map((p) => ({ ...p })),
          },
        };
      }
      default: {
        const data = genericLine(range, t);
        return {
          chart: <LineTrendChart title={chartTitle} subtitle={subtitle} data={data} unit={tabLabel.toLowerCase()} />,
          table: {
            caption: chartTitle,
            columns: [{ key: 'label', label: range.id === 'today' ? 'Time' : 'Day' }, ...data.series.map((s) => ({ key: s.key, label: s.label, numeric: true }))],
            rows: data.labels.map((label, i) => ({ label, ...Object.fromEntries(data.series.map((s) => [s.key, s.values[i]])) })),
          },
        };
      }
    }
  }, [useCase, range, t, chartTitle, subtitle]);

  return (
    <Card
      title={useCase.main.title}
      subtitle={subtitle}
      className={className}
      overlay={anatomy}
      actions={
        <Tabs
          label={`${useCase.main.title} view`}
          options={[
            { id: 'a', label: useCase.main.tabs[0] },
            { id: 'b', label: useCase.main.tabs[1] },
          ]}
          value={tab}
          onChange={setTab}
        />
      }
    >
      <ChartState status={status} height={300} onRetry={onRetry} onChangeRange={onChangeRange}>
        <ChartFrame table={table}>{chart}</ChartFrame>
      </ChartState>
    </Card>
  );
};
