import React, { useState } from 'react';
import { ChartCard, LegendItem } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { XLabels, YAxis } from './ChartAxes';
import { useChartInteraction, useElementWidth, useEntryProgress } from './hooks';
import { CHART_COLORS, DIM_OPACITY, formatNumber, niceScale, topRoundedBarPath } from './chartUtils';
import type { WeekComparison } from './sampleData';

type SeriesKey = 'thisWeek' | 'lastWeek';

const SERIES: { key: SeriesKey; label: string; opacity: number }[] = [
  { key: 'thisWeek', label: 'This week', opacity: 1 },
  { key: 'lastWeek', label: 'Last week', opacity: 0.5 },
];

const M = { top: 12, right: 16, bottom: 28, left: 48 };

interface GroupedBarChartProps {
  title: string;
  subtitle?: string;
  data: WeekComparison[];
  color?: string;
  height?: number;
}

interface BarKey {
  index: number;
  series: SeriesKey;
}

const formatChange = (current: number, previous: number) => {
  const pct = ((current - previous) / previous) * 100;
  return `${pct >= 0 ? '+' : '−'}${Math.abs(pct).toFixed(1)}%`;
};

/** Grouped bars: this week at full colour, last week at 50% opacity. */
export const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
  title,
  subtitle,
  data,
  color = CHART_COLORS.royalBlue,
  height = 260,
}) => {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const { containerRef, active, bind } = useChartInteraction<BarKey>();
  const [legendSeries, setLegendSeries] = useState<SeriesKey | null>(null);
  const progress = useEntryProgress();

  const plotW = Math.max(0, width - M.left - M.right);
  const plotH = height - M.top - M.bottom;
  const { max, ticks } = niceScale(Math.max(...data.flatMap((d) => [d.thisWeek, d.lastWeek])));
  const band = plotW / data.length;
  const barW = Math.min(band * 0.3, 28);
  const innerGap = barW * 0.3;
  const y = (v: number) => M.top + plotH - (v / max) * plotH;
  const cx = (i: number) => M.left + band * i + band / 2;

  const opacityFor = (index: number, series: SeriesKey) => {
    if (active) return active.key.index === index && active.key.series === series ? 1 : DIM_OPACITY;
    if (legendSeries) return legendSeries === series ? 1 : DIM_OPACITY;
    return 1;
  };

  const thisTotal = data.reduce((a, d) => a + d.thisWeek, 0);
  const lastTotal = data.reduce((a, d) => a + d.lastWeek, 0);
  const busiest = data.reduce((a, b) => (b.thisWeek > a.thisWeek ? b : a));
  const insight = `${title}: ${formatNumber(thisTotal)} meals this week vs ${formatNumber(lastTotal)} last week (${formatChange(thisTotal, lastTotal)}). ${busiest.day} was busiest with ${formatNumber(busiest.thisWeek)}.`;

  const legend: LegendItem[] = SERIES.map((s) => ({ key: s.key, label: s.label, color, opacity: s.opacity }));
  const activeRow = active ? data[active.key.index] : null;

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      legend={legend}
      activeKey={active ? active.key.series : legendSeries}
      onLegendHover={(k) => setLegendSeries(k as SeriesKey | null)}
    >
      <div ref={wrapRef} className="w-full">
        <div ref={containerRef} className="relative" style={{ height }}>
          <svg width={width} height={height} role="img" aria-label={insight} className="block">
            <YAxis ticks={ticks} scale={y} left={M.left} right={width - M.right} />

            {data.map((d, i) =>
              SERIES.map((s, si) => {
                const value = d[s.key];
                const h = (value / max) * plotH * progress;
                const x0 = cx(i) - barW - innerGap / 2 + si * (barW + innerGap);
                const y0 = M.top + plotH - h;
                return (
                  <path
                    key={`${d.day}-${s.key}`}
                    d={topRoundedBarPath(x0, y0, barW, h)}
                    fill={color}
                    fillOpacity={s.opacity}
                    opacity={opacityFor(i, s.key)}
                    {...bind(
                      { index: i, series: s.key },
                      { x: x0 + barW / 2, y: y0 },
                      `${d.day}, ${s.label.toLowerCase()}: ${formatNumber(value)} meals`,
                      'transition-opacity duration-150'
                    )}
                  />
                );
              })
            )}

            <XLabels labels={data.map((d, i) => ({ key: d.day, x: cx(i), text: d.day }))} y={height - 6} />
          </svg>

          {active && activeRow && (
            <ChartTooltip
              x={active.x}
              y={active.y}
              width={width}
              height={height}
              title={activeRow.day}
              rows={[
                ...SERIES.map((s) => ({ label: s.label, value: formatNumber(activeRow[s.key]), color, opacity: s.opacity })),
                { label: 'Change', value: formatChange(activeRow.thisWeek, activeRow.lastWeek) },
              ]}
            />
          )}
        </div>
      </div>
    </ChartCard>
  );
};
