import React, { useState } from 'react';
import { ChartCard, LegendItem } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { XLabels, YAxis } from './ChartAxes';
import { useChartInteraction, useElementWidth, useEntryProgress } from './hooks';
import { AXIS_TEXT, CHART_COLORS, DIM_OPACITY, formatNumber, niceScale, topRoundedBarPath } from './chartUtils';
import type { EntriesVsAttempts } from './sampleData';

type SeriesKey = 'entries' | 'attempts';

interface MarkKey {
  index: number;
  series: SeriesKey;
}

const M = { top: 12, right: 64, bottom: 28, left: 64 };

interface ComboChartProps {
  title: string;
  subtitle?: string;
  data: EntriesVsAttempts[];
  height?: number;
}

/** Bars (left axis) + line with dots (right axis). Both axes are labelled. */
export const ComboChart: React.FC<ComboChartProps> = ({ title, subtitle, data, height = 280 }) => {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const { containerRef, active, bind } = useChartInteraction<MarkKey>();
  const [legendSeries, setLegendSeries] = useState<SeriesKey | null>(null);
  const progress = useEntryProgress();

  const plotW = Math.max(0, width - M.left - M.right);
  const plotH = height - M.top - M.bottom;
  const left = niceScale(Math.max(...data.map((d) => d.entries)));
  // Right axis reuses the left axis tick positions so its labels sit on the same gridlines.
  const steps = left.ticks.length - 1;
  const rightMax = Math.ceil(Math.max(...data.map((d) => d.attempts)) / steps) * steps;
  const right = { max: rightMax, ticks: left.ticks.map((_, i) => (rightMax / steps) * i) };
  const band = plotW / data.length;
  const barW = Math.min(band * 0.5, 40);
  const yL = (v: number) => M.top + plotH - (v / left.max) * plotH;
  const yR = (v: number) => M.top + plotH - (v / right.max) * plotH;
  const cx = (i: number) => M.left + band * i + band / 2;

  const highlighted = active ? active.key.series : legendSeries;
  const opacityFor = (index: number, series: SeriesKey) => {
    if (active) return active.key.series === series && active.key.index === index ? 1 : DIM_OPACITY;
    if (highlighted) return highlighted === series ? 1 : DIM_OPACITY;
    return 1;
  };

  const linePoints = data.map((d, i) => ({ x: cx(i), y: yR(d.attempts * progress) }));
  const linePath = linePoints.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join('');
  const peak = data.reduce((a, b) => (b.attempts > a.attempts ? b : a));
  const insight = `${title}: unauthorized attempts peaked on ${peak.day} at ${formatNumber(peak.attempts)}, a day with only ${formatNumber(peak.entries)} entries.`;

  const legend: LegendItem[] = [
    { key: 'entries', label: 'Entries', color: CHART_COLORS.deepNavy },
    { key: 'attempts', label: 'Unauthorized attempts', color: CHART_COLORS.cyan },
  ];
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
            <YAxis ticks={left.ticks} scale={yL} left={M.left} right={width - M.right} />
            <YAxis ticks={right.ticks} scale={yR} left={M.left} right={width - M.right} side="right" showGrid={false} />

            {/* Axis titles */}
            <text
              transform={`translate(14 ${M.top + plotH / 2}) rotate(-90)`}
              textAnchor="middle"
              {...AXIS_TEXT}
              aria-hidden="true"
            >
              Entries
            </text>
            <text
              transform={`translate(${width - 14} ${M.top + plotH / 2}) rotate(90)`}
              textAnchor="middle"
              {...AXIS_TEXT}
              aria-hidden="true"
            >
              Unauthorized attempts
            </text>

            {data.map((d, i) => {
              const h = (d.entries / left.max) * plotH * progress;
              const y0 = M.top + plotH - h;
              return (
                <path
                  key={`bar-${d.day}`}
                  d={topRoundedBarPath(cx(i) - barW / 2, y0, barW, h)}
                  fill={CHART_COLORS.deepNavy}
                  opacity={opacityFor(i, 'entries')}
                  {...bind(
                    { index: i, series: 'entries' },
                    { x: cx(i), y: y0 },
                    `${d.day}: ${formatNumber(d.entries)} entries`,
                    'transition-opacity duration-150'
                  )}
                />
              );
            })}

            <path
              d={linePath}
              fill="none"
              stroke={CHART_COLORS.cyan}
              strokeWidth={2}
              strokeLinejoin="round"
              opacity={highlighted === 'entries' ? DIM_OPACITY : 1}
              className="transition-opacity duration-150"
            />
            {data.map((d, i) => (
              <circle
                key={`dot-${d.day}`}
                cx={linePoints[i].x}
                cy={linePoints[i].y}
                r={active?.key.index === i && active.key.series === 'attempts' ? 6 : 4.5}
                fill={CHART_COLORS.cyan}
                stroke={CHART_COLORS.white}
                strokeWidth={2}
                opacity={opacityFor(i, 'attempts')}
                {...bind(
                  { index: i, series: 'attempts' },
                  linePoints[i],
                  `${d.day}: ${formatNumber(d.attempts)} unauthorized attempts`,
                  'transition-opacity duration-150'
                )}
              />
            ))}

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
                { label: 'Entries', value: formatNumber(activeRow.entries), color: CHART_COLORS.deepNavy },
                { label: 'Unauthorized attempts', value: formatNumber(activeRow.attempts), color: CHART_COLORS.cyan },
              ]}
            />
          )}
        </div>
      </div>
    </ChartCard>
  );
};
