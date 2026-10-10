import React from 'react';
import { ChartCard } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { XLabels, YAxis } from './ChartAxes';
import { useChartInteraction, useElementWidth, useEntryProgress } from './hooks';
import { AXIS_TEXT, CHART_COLORS, formatNumber, markOpacity, niceScale, topRoundedBarPath } from './chartUtils';
import type { CategoryValue } from './sampleData';

interface BarChartProps {
  title: string;
  subtitle?: string;
  data: CategoryValue[];
  /** Unit used in the tooltip and aria text, e.g. "Entries". */
  valueLabel: string;
  color?: string;
  height?: number;
}

const M = { top: 24, right: 16, bottom: 28, left: 48 };

/** Vertical bars with value labels on top. Bar width 56% of the band → gap ≥ 30% of bar width. */
export const BarChart: React.FC<BarChartProps> = ({
  title,
  subtitle,
  data,
  valueLabel,
  color = CHART_COLORS.deepNavy,
  height = 260,
}) => {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const { containerRef, active, bind } = useChartInteraction<number>();
  const progress = useEntryProgress();

  const plotW = Math.max(0, width - M.left - M.right);
  const plotH = height - M.top - M.bottom;
  const { max, ticks } = niceScale(Math.max(...data.map((d) => d.value)));
  const band = plotW / data.length;
  const barW = Math.min(band * 0.56, 56);
  const y = (v: number) => M.top + plotH - (v / max) * plotH;
  const cx = (i: number) => M.left + band * i + band / 2;

  const top = data.reduce((a, b) => (b.value > a.value ? b : a));
  const insight = `${title}: ${top.label} had the most ${valueLabel.toLowerCase()}: ${formatNumber(top.value)}.`;

  return (
    <ChartCard title={title} subtitle={subtitle}>
      <div ref={wrapRef} className="w-full">
        <div ref={containerRef} className="relative" style={{ height }}>
          <svg width={width} height={height} role="img" aria-label={insight} className="block">
            <YAxis ticks={ticks} scale={y} left={M.left} right={width - M.right} />

            {data.map((d, i) => {
              const h = (d.value / max) * plotH * progress;
              const x0 = cx(i) - barW / 2;
              const y0 = M.top + plotH - h;
              return (
                <g key={d.label} opacity={markOpacity(i, active?.key)} className="transition-opacity duration-150">
                  <path
                    d={topRoundedBarPath(x0, y0, barW, h)}
                    fill={color}
                    {...bind(i, { x: cx(i), y: y0 }, `${d.label}: ${formatNumber(d.value)} ${valueLabel.toLowerCase()}`)}
                  />
                  <text
                    x={cx(i)}
                    y={y0 - 6}
                    textAnchor="middle"
                    {...AXIS_TEXT}
                    fill={CHART_COLORS.gray700}
                    fontWeight={500}
                    aria-hidden="true"
                  >
                    {formatNumber(Math.round(d.value * progress))}
                  </text>
                </g>
              );
            })}

            <XLabels labels={data.map((d, i) => ({ key: d.label, x: cx(i), text: d.label }))} y={height - 6} />
          </svg>

          {active && (
            <ChartTooltip
              x={active.x}
              y={active.y}
              width={width}
              height={height}
              title={data[active.key].label}
              rows={[{ label: valueLabel, value: formatNumber(data[active.key].value), color }]}
            />
          )}
        </div>
      </div>
    </ChartCard>
  );
};
