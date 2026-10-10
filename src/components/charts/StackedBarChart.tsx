import React, { useState } from 'react';
import { ChartCard, LegendItem } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { XLabels, YAxis } from './ChartAxes';
import { useChartInteraction, useElementWidth, useEntryProgress } from './hooks';
import { CHART_COLORS, DIM_OPACITY, formatNumber, niceScale, topRoundedBarPath } from './chartUtils';
import type { MealsByType } from './sampleData';

type SeriesKey = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

/** Bottom → top stacking order, in strict series colour order. */
const SERIES: { key: SeriesKey; label: string; color: string }[] = [
  { key: 'breakfast', label: 'Breakfast', color: CHART_COLORS.deepNavy },
  { key: 'lunch', label: 'Lunch', color: CHART_COLORS.royalBlue },
  { key: 'snacks', label: 'Snacks', color: CHART_COLORS.cyan },
  { key: 'dinner', label: 'Dinner', color: CHART_COLORS.gray400 },
];

const M = { top: 12, right: 16, bottom: 28, left: 48 };

interface StackedBarChartProps {
  title: string;
  subtitle?: string;
  data: MealsByType[];
  height?: number;
}

interface SegmentKey {
  index: number;
  series: SeriesKey;
}

/** Stacked bars: only the top segment of each bar gets the 4px top radius. */
export const StackedBarChart: React.FC<StackedBarChartProps> = ({ title, subtitle, data, height = 260 }) => {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const { containerRef, active, bind } = useChartInteraction<SegmentKey>();
  const [legendSeries, setLegendSeries] = useState<SeriesKey | null>(null);
  const progress = useEntryProgress();

  const plotW = Math.max(0, width - M.left - M.right);
  const plotH = height - M.top - M.bottom;
  const totals = data.map((d) => SERIES.reduce((sum, s) => sum + d[s.key], 0));
  const { max, ticks } = niceScale(Math.max(...totals));
  const band = plotW / data.length;
  const barW = Math.min(band * 0.56, 48);
  const y = (v: number) => M.top + plotH - (v / max) * plotH;
  const cx = (i: number) => M.left + band * i + band / 2;

  const highlighted = active ? active.key.series : legendSeries;
  const busiest = totals.indexOf(Math.max(...totals));
  const insight = `${title}: lunch is the largest meal every day. ${data[busiest].day} had the highest total with ${formatNumber(totals[busiest])} meals.`;

  const legend: LegendItem[] = SERIES.map((s) => ({ key: s.key, label: s.label, color: s.color }));
  const activeRow = active ? data[active.key.index] : null;

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      legend={legend}
      activeKey={highlighted}
      onLegendHover={(k) => setLegendSeries(k as SeriesKey | null)}
    >
      <div ref={wrapRef} className="w-full">
        <div ref={containerRef} className="relative" style={{ height }}>
          <svg width={width} height={height} role="img" aria-label={insight} className="block">
            <YAxis ticks={ticks} scale={y} left={M.left} right={width - M.right} />

            {data.map((d, i) => {
              let base = 0;
              return SERIES.map((s, si) => {
                const value = d[s.key];
                const y0 = y((base + value) * progress);
                const y1 = y(base * progress);
                base += value;
                const x0 = cx(i) - barW / 2;
                const isTop = si === SERIES.length - 1;
                return (
                  <path
                    key={`${d.day}-${s.key}`}
                    d={isTop ? topRoundedBarPath(x0, y0, barW, y1 - y0) : `M${x0},${y0}h${barW}V${y1}h${-barW}Z`}
                    fill={s.color}
                    opacity={highlighted && highlighted !== s.key ? DIM_OPACITY : 1}
                    {...bind(
                      { index: i, series: s.key },
                      { x: cx(i), y: (y0 + y1) / 2 },
                      `${d.day}, ${s.label.toLowerCase()}: ${formatNumber(value)} meals`,
                      'transition-opacity duration-150'
                    )}
                  />
                );
              });
            })}

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
                ...[...SERIES].reverse().map((s) => ({ label: s.label, value: formatNumber(activeRow[s.key]), color: s.color })),
                { label: 'Total', value: formatNumber(totals[active.key.index]) },
              ]}
            />
          )}
        </div>
      </div>
    </ChartCard>
  );
};
