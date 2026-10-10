import React, { useState } from 'react';
import { ChartCard, LegendItem } from '../../../../components/charts/ChartCard';
import { ChartTooltip } from '../../../../components/charts/ChartTooltip';
import { XLabels, YAxis } from '../../../../components/charts/ChartAxes';
import { useChartInteraction, useElementWidth, useEntryProgress } from '../../../../components/charts/hooks';
import { CHART_COLORS, DIM_OPACITY, SERIES_COLORS, formatNumber, niceScale } from '../../../../components/charts/chartUtils';
import type { LineData } from '../data/series';

interface LineTrendChartProps {
  title: string;
  subtitle?: string;
  data: LineData;
  /** Unit in tooltips and the aria summary, e.g. "events". */
  unit: string;
  height?: number;
}

const M = { top: 12, right: 16, bottom: 28, left: 48 };

/**
 * Multi-series line chart, built from the Charts-page primitives (axes, tooltip, hooks, palette)
 * because the Charts page's line chart is inline JSX, not a reusable component.
 */
export const LineTrendChart: React.FC<LineTrendChartProps> = ({ title, subtitle, data, unit, height = 260 }) => {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const { containerRef, active, bind, hover } = useChartInteraction<number>();
  const [legendKey, setLegendKey] = useState<string | null>(null);
  const progress = useEntryProgress();

  const n = data.labels.length;
  const plotW = Math.max(0, width - M.left - M.right);
  const plotH = height - M.top - M.bottom;
  const { max, ticks } = niceScale(Math.max(1, ...data.series.flatMap((s) => s.values)));
  const step = n > 1 ? plotW / (n - 1) : plotW;
  const x = (i: number) => M.left + i * step;
  const y = (v: number) => M.top + plotH - (v / max) * plotH;

  const first = data.series[0];
  const peakIndex = first.values.indexOf(Math.max(...first.values));
  const insight = `${title}: ${first.label.toLowerCase()} peak at ${data.labels[peakIndex]} with ${formatNumber(first.values[peakIndex])} ${unit}.`;
  const legend: LegendItem[] = data.series.map((s, i) => ({ key: s.key, label: s.label, color: SERIES_COLORS[i] }));

  return (
    <ChartCard title={title} subtitle={subtitle} legend={legend} activeKey={legendKey} onLegendHover={setLegendKey}>
      <div ref={wrapRef} className="w-full">
        <div ref={containerRef} className="relative" style={{ height }}>
          <svg width={width} height={height} role="img" aria-label={insight} className="block">
            <YAxis ticks={ticks} scale={y} left={M.left} right={width - M.right} />
            {data.series.map((s, si) => (
              <polyline
                key={s.key}
                fill="none"
                stroke={SERIES_COLORS[si]}
                strokeWidth={2}
                strokeLinejoin="round"
                opacity={legendKey && legendKey !== s.key ? DIM_OPACITY : 1}
                points={s.values.map((v, i) => `${x(i)},${y(v * progress)}`).join(' ')}
                className="transition-opacity duration-150"
              />
            ))}
            {active && (
              <line x1={x(active.key)} x2={x(active.key)} y1={M.top} y2={y(0)} stroke={CHART_COLORS.gray400} strokeWidth={1} aria-hidden="true" />
            )}
            {data.labels.map((label, i) => (
              <rect key={`band-${label}`} x={x(i) - step / 2} y={M.top} width={step} height={plotH} fill="transparent" aria-hidden="true" {...hover(i)} />
            ))}
            {data.labels.map((label, i) => {
              const anchor = { x: x(i), y: y(first.values[i] * progress) };
              const isActive = active?.key === i;
              return (
                <circle
                  key={label}
                  cx={anchor.x}
                  cy={anchor.y}
                  r={isActive ? 5 : 4}
                  fill={isActive ? SERIES_COLORS[0] : 'transparent'}
                  stroke={isActive ? CHART_COLORS.white : 'none'}
                  strokeWidth={2}
                  {...bind(i, anchor, `${label}: ${data.series.map((s) => `${s.label} ${formatNumber(s.values[i])}`).join(', ')}`)}
                />
              );
            })}
            <XLabels labels={data.labels.map((l, i) => ({ key: l, x: x(i), text: l }))} y={height - 6} />
          </svg>
          {active && (
            <ChartTooltip
              x={active.x}
              y={active.y}
              width={width}
              height={height}
              title={data.labels[active.key]}
              rows={data.series.map((s, si) => ({ label: s.label, value: formatNumber(s.values[active.key]), color: SERIES_COLORS[si] }))}
            />
          )}
        </div>
      </div>
    </ChartCard>
  );
};
