import React from 'react';
import { ChartCard } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { useChartInteraction, useElementWidth, useEntryProgress } from './hooks';
import { AXIS_TEXT, CHART_COLORS, MONO_FONT, endRoundedBarPath, formatNumber, markOpacity } from './chartUtils';
import type { CategoryValue } from './sampleData';

interface HorizontalBarChartProps {
  title: string;
  subtitle?: string;
  data: CategoryValue[];
  valueLabel: string;
  /** Render category labels in JetBrains Mono (IDs, plates). */
  monoLabels?: boolean;
  color?: string;
}

const LABEL_W = 136;
const VALUE_W = 56;
const BAR_H = 20;
const ROW_GAP = 12; // 60% of bar height
const MIN_WIDTH = 520; // below this the chart scrolls inside its own container

/** Horizontal bars, sorted largest first, with values to the right of each bar. */
export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  title,
  subtitle,
  data,
  valueLabel,
  monoLabels = false,
  color = CHART_COLORS.royalBlue,
}) => {
  const [wrapRef, available] = useElementWidth<HTMLDivElement>();
  const { containerRef, active, bind } = useChartInteraction<number>();
  const progress = useEntryProgress();

  const rows = [...data].sort((a, b) => b.value - a.value);
  const width = Math.max(available, MIN_WIDTH);
  const height = rows.length * (BAR_H + ROW_GAP) - ROW_GAP + 8;
  const trackW = width - LABEL_W - VALUE_W;
  const max = rows[0]?.value ?? 1;
  const rowY = (i: number) => 4 + i * (BAR_H + ROW_GAP);

  const insight = `${title}: ${rows[0].label} had the most ${valueLabel.toLowerCase()}: ${formatNumber(rows[0].value)}.`;

  return (
    <ChartCard title={title} subtitle={subtitle}>
      <div ref={wrapRef} className="w-full overflow-x-auto">
        <div ref={containerRef} className="relative" style={{ width, height }}>
          <svg width={width} height={height} role="img" aria-label={insight} className="block">
            {rows.map((d, i) => {
              const w = (d.value / max) * trackW * progress;
              const y0 = rowY(i);
              return (
                <g key={d.label} opacity={markOpacity(i, active?.key)} className="transition-opacity duration-150">
                  <text
                    x={LABEL_W - 12}
                    y={y0 + BAR_H / 2}
                    dy="0.32em"
                    textAnchor="end"
                    {...AXIS_TEXT}
                    fontFamily={monoLabels ? MONO_FONT : undefined}
                    aria-hidden="true"
                  >
                    {d.label}
                  </text>
                  <path
                    d={endRoundedBarPath(LABEL_W, y0, w, BAR_H)}
                    fill={color}
                    {...bind(i, { x: LABEL_W + w, y: y0 + BAR_H / 2 }, `${d.label}: ${formatNumber(d.value)} ${valueLabel.toLowerCase()}`)}
                  />
                  <text
                    x={LABEL_W + w + 8}
                    y={y0 + BAR_H / 2}
                    dy="0.32em"
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
          </svg>

          {active && (
            <ChartTooltip
              x={active.x}
              y={active.y}
              width={width}
              height={height}
              title={rows[active.key].label}
              rows={[{ label: valueLabel, value: formatNumber(rows[active.key].value), color }]}
            />
          )}
        </div>
      </div>
    </ChartCard>
  );
};
