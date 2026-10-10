import React, { useState } from 'react';
import { ChartCard, LegendItem } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { XLabels, YAxis } from './ChartAxes';
import { useChartInteraction, useElementWidth, useEntryProgress } from './hooks';
import { CHART_COLORS, DIM_OPACITY, formatNumber, niceScale } from './chartUtils';
import type { VehicleTypeEntries } from './sampleData';

type SeriesKey = 'regular' | 'commercial' | 'vip';

const SERIES: { key: SeriesKey; label: string; color: string }[] = [
  { key: 'regular', label: 'Regular', color: CHART_COLORS.deepNavy },
  { key: 'commercial', label: 'Commercial', color: CHART_COLORS.royalBlue },
  { key: 'vip', label: 'VIP', color: CHART_COLORS.cyan },
];

const FILL_OPACITY = 0.7;
const M = { top: 12, right: 16, bottom: 28, left: 48 };

interface StackedAreaChartProps {
  title: string;
  subtitle?: string;
  data: VehicleTypeEntries[];
  height?: number;
}

/** Stacked area: Deep Navy / Royal Blue / Cyan fills at 70% opacity, bottom to top. */
export const StackedAreaChart: React.FC<StackedAreaChartProps> = ({ title, subtitle, data, height = 260 }) => {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const { containerRef, active, setActive, bind, pointFromEvent } = useChartInteraction<number>();
  const [activeSeries, setActiveSeries] = useState<SeriesKey | null>(null);
  const progress = useEntryProgress();

  const plotW = Math.max(0, width - M.left - M.right);
  const plotH = height - M.top - M.bottom;
  const totals = data.map((d) => d.regular + d.commercial + d.vip);
  const { max, ticks } = niceScale(Math.max(...totals));
  const step = data.length > 1 ? plotW / (data.length - 1) : plotW;
  const x = (i: number) => M.left + i * step;
  const y = (v: number) => M.top + plotH - (v / max) * plotH;

  // Cumulative values per series: stack[s][i] = sum of series 0..s at index i.
  const stack = SERIES.map((_, s) => data.map((d) => SERIES.slice(0, s + 1).reduce((sum, ser) => sum + d[ser.key], 0)));

  const layerPath = (s: number) => {
    const upper = data.map((_, i) => `${x(i)},${y(stack[s][i] * progress)}`);
    const lower = data.map((_, i) => `${x(i)},${y(s === 0 ? 0 : stack[s - 1][i] * progress)}`).reverse();
    return `M${upper.join('L')}L${lower.join('L')}Z`;
  };

  /** Find which layer the cursor is over, from its y position. */
  const seriesAt = (index: number, py: number): SeriesKey | null => {
    const value = ((M.top + plotH - py) / plotH) * max;
    const s = stack.findIndex((col) => value <= col[index]);
    return s === -1 ? null : SERIES[s].key;
  };

  const peakIndex = totals.indexOf(Math.max(...totals));
  const regularShare = Math.round((data.reduce((a, d) => a + d.regular, 0) / totals.reduce((a, b) => a + b, 0)) * 100);
  const insight = `${title}: regular vehicles make up ${regularShare}% of entries; total entries peak at ${data[peakIndex].time} with ${formatNumber(totals[peakIndex])}.`;

  const legend: LegendItem[] = SERIES.map((s) => ({ key: s.key, label: s.label, color: s.color, opacity: FILL_OPACITY }));

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      legend={legend}
      activeKey={activeSeries}
      onLegendHover={(k) => setActiveSeries(k as SeriesKey | null)}
    >
      <div ref={wrapRef} className="w-full">
        <div ref={containerRef} className="relative" style={{ height }}>
          <svg width={width} height={height} role="img" aria-label={insight} className="block">
            <YAxis ticks={ticks} scale={y} left={M.left} right={width - M.right} />

            {SERIES.map((s, si) => (
              <path
                key={s.key}
                d={layerPath(si)}
                fill={s.color}
                fillOpacity={FILL_OPACITY * (activeSeries && activeSeries !== s.key ? DIM_OPACITY : 1)}
                className="transition-[fill-opacity] duration-150"
              />
            ))}

            {active && (
              <line
                x1={x(active.key)}
                x2={x(active.key)}
                y1={M.top}
                y2={y(0)}
                stroke={CHART_COLORS.gray400}
                strokeWidth={1}
                aria-hidden="true"
              />
            )}

            {data.map((d, i) => (
              <rect
                key={`band-${d.time}`}
                x={x(i) - step / 2}
                y={M.top}
                width={step}
                height={plotH}
                fill="transparent"
                aria-hidden="true"
                onMouseMove={(e) => {
                  const p = pointFromEvent(e);
                  setActive({ key: i, ...p });
                  setActiveSeries(seriesAt(i, p.y));
                }}
                onMouseLeave={() => {
                  setActive(null);
                  setActiveSeries(null);
                }}
              />
            ))}

            {data.map((d, i) => {
              const anchor = { x: x(i), y: y(totals[i] * progress) };
              const isActive = active?.key === i;
              return (
                <circle
                  key={d.time}
                  cx={anchor.x}
                  cy={anchor.y}
                  r={isActive ? 5 : 4}
                  fill={isActive ? CHART_COLORS.deepNavy : 'transparent'}
                  stroke={isActive ? CHART_COLORS.white : 'none'}
                  strokeWidth={2}
                  {...bind(
                    i,
                    anchor,
                    `${d.time}: ${formatNumber(totals[i])} entries — Regular ${formatNumber(d.regular)}, Commercial ${formatNumber(d.commercial)}, VIP ${formatNumber(d.vip)}`
                  )}
                />
              );
            })}

            <XLabels
              labels={data.map((d, i) => ({ key: d.time, x: x(i), text: d.time }))}
              y={height - 6}
              every={width < 560 ? 4 : 2} // whole 2- or 4-hour marks read better than auto-thinning
            />
          </svg>

          {active && (
            <ChartTooltip
              x={active.x}
              y={active.y}
              width={width}
              height={height}
              title={data[active.key].time}
              rows={[
                ...[...SERIES].reverse().map((s) => ({
                  label: s.label,
                  value: formatNumber(data[active.key][s.key]),
                  color: s.color,
                  opacity: FILL_OPACITY,
                })),
                { label: 'Total', value: formatNumber(totals[active.key]) },
              ]}
            />
          )}
        </div>
      </div>
    </ChartCard>
  );
};
