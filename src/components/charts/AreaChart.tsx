import React from 'react';
import { ChartCard } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { XLabels, YAxis } from './ChartAxes';
import { useChartInteraction, useElementWidth, useEntryProgress } from './hooks';
import { CHART_COLORS, formatNumber, niceScale } from './chartUtils';
import type { TimeValue } from './sampleData';

interface AreaChartProps {
  title: string;
  subtitle?: string;
  /** Series name used in the tooltip, e.g. "Residents". */
  seriesLabel: string;
  data: TimeValue[];
  height?: number;
}

const M = { top: 12, right: 16, bottom: 28, left: 48 };

/** Single-series area: Royal Blue line over a Royal Blue 12% fill. */
export const AreaChart: React.FC<AreaChartProps> = ({ title, subtitle, seriesLabel, data, height = 260 }) => {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const { containerRef, active, bind, hover } = useChartInteraction<number>();
  const progress = useEntryProgress();

  const plotW = Math.max(0, width - M.left - M.right);
  const plotH = height - M.top - M.bottom;
  const { max, ticks } = niceScale(Math.max(...data.map((d) => d.value)));
  const step = data.length > 1 ? plotW / (data.length - 1) : plotW;
  const x = (i: number) => M.left + i * step;
  const y = (v: number) => M.top + plotH - (v / max) * plotH;

  const points = data.map((d, i) => ({ x: x(i), y: y(d.value * progress) }));
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join('');
  const area = `${line}L${points[points.length - 1].x},${y(0)}L${points[0].x},${y(0)}Z`;

  const peak = data.reduce((a, b) => (b.value > a.value ? b : a));
  const low = data.reduce((a, b) => (b.value < a.value ? b : a));
  const insight = `${title}: peaks at ${formatNumber(peak.value)} at ${peak.time} and drops to ${formatNumber(low.value)} at ${low.time}.`;

  return (
    <ChartCard title={title} subtitle={subtitle}>
      <div ref={wrapRef} className="w-full">
        <div ref={containerRef} className="relative" style={{ height }}>
          <svg width={width} height={height} role="img" aria-label={insight} className="block">
            <YAxis ticks={ticks} scale={y} left={M.left} right={width - M.right} />
            <path d={area} fill={CHART_COLORS.royalBlue} fillOpacity={0.12} />
            <path d={line} fill="none" stroke={CHART_COLORS.royalBlue} strokeWidth={2} strokeLinejoin="round" />

            {active && (
              <line
                x1={points[active.key].x}
                x2={points[active.key].x}
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
                {...hover(i)}
              />
            ))}

            {data.map((d, i) => (
              <circle
                key={d.time}
                cx={points[i].x}
                cy={points[i].y}
                r={active?.key === i ? 5 : 4}
                fill={active?.key === i ? CHART_COLORS.royalBlue : 'transparent'}
                stroke={active?.key === i ? CHART_COLORS.white : 'none'}
                strokeWidth={2}
                {...bind(i, points[i], `${d.time}: ${formatNumber(d.value)} ${seriesLabel.toLowerCase()}`)}
              />
            ))}

            <XLabels
              labels={data.map((d, i) => ({ key: d.time, x: x(i), text: d.time }))}
              y={height - 6}
              every={width < 560 ? 6 : 3} // whole 3- or 6-hour marks read better than auto-thinning
            />
          </svg>

          {active && (
            <ChartTooltip
              x={active.x}
              y={active.y}
              width={width}
              height={height}
              title={data[active.key].time}
              rows={[{ label: seriesLabel, value: formatNumber(data[active.key].value), color: CHART_COLORS.royalBlue }]}
            />
          )}
        </div>
      </div>
    </ChartCard>
  );
};
