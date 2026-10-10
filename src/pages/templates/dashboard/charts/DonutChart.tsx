import React from 'react';
import { ChartCard, LegendItem } from '../../../../components/charts/ChartCard';
import { ChartTooltip } from '../../../../components/charts/ChartTooltip';
import { useChartInteraction, useElementWidth, useEntryProgress } from '../../../../components/charts/hooks';
import { CHART_COLORS, MAX_SERIES, SERIES_COLORS, formatNumber, markOpacity } from '../../../../components/charts/chartUtils';
import type { CategoryValue } from '../../../../components/charts/sampleData';

interface DonutChartProps {
  title: string;
  subtitle?: string;
  data: CategoryValue[];
  /** Unit for the centre label and tooltips, e.g. "Vehicles". */
  valueLabel: string;
  height?: number;
}

const STROKE = 22;

/**
 * Donut (2–4 parts of a whole) built from the Charts-page primitives,
 * because the Charts page's donut is inline JSX, not a reusable component.
 * 2px white gaps between slices, total in the centre, focusable slices with tooltips.
 */
export const DonutChart: React.FC<DonutChartProps> = ({ title, subtitle, data, valueLabel, height = 240 }) => {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const { containerRef, active, bind } = useChartInteraction<number>();
  const progress = useEntryProgress();

  const slices = data.slice(0, MAX_SERIES);
  const total = slices.reduce((sum, d) => sum + d.value, 0) || 1;
  const r = Math.min(88, height / 2 - 16);
  const cx = width / 2;
  const cy = height / 2;
  const circumference = 2 * Math.PI * r;
  const gap = 2;

  let offset = 0;
  const arcs = slices.map((d, i) => {
    const length = (d.value / total) * circumference * progress;
    const arc = { d, i, dash: Math.max(0, length - gap), offset, mid: (offset + length / 2) / circumference };
    offset += length;
    return arc;
  });

  const largest = slices.reduce((a, b) => (b.value > a.value ? b : a), slices[0]);
  const insight = `${title}: ${largest.label} is the largest share at ${Math.round((largest.value / total) * 100)}% of ${formatNumber(total)} ${valueLabel.toLowerCase()}.`;
  const legend: LegendItem[] = slices.map((d, i) => ({ key: String(i), label: d.label, color: SERIES_COLORS[i] }));

  return (
    <ChartCard title={title} subtitle={subtitle} legend={legend} activeKey={active ? String(active.key) : null}>
      <div ref={wrapRef} className="w-full">
        <div ref={containerRef} className="relative" style={{ height }}>
          <svg width={width} height={height} role="img" aria-label={insight} className="block">
            <g transform={`rotate(-90 ${cx} ${cy})`}>
              {arcs.map((a) => {
                const angle = a.mid * Math.PI * 2 - Math.PI / 2;
                return (
                  <circle
                    key={a.d.label}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={SERIES_COLORS[a.i]}
                    strokeWidth={STROKE}
                    strokeDasharray={`${a.dash} ${circumference}`}
                    strokeDashoffset={-a.offset}
                    opacity={markOpacity(a.i, active?.key)}
                    {...bind(
                      a.i,
                      { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r },
                      `${a.d.label}: ${formatNumber(a.d.value)}, ${Math.round((a.d.value / total) * 100)}%`,
                      'transition-opacity duration-150'
                    )}
                  />
                );
              })}
            </g>
            <text x={cx} y={cy - 2} textAnchor="middle" fontSize={24} fontWeight={700} fill={CHART_COLORS.deepNavy} style={{ fontVariantNumeric: 'tabular-nums' }} aria-hidden="true">
              {formatNumber(total)}
            </text>
            <text x={cx} y={cy + 18} textAnchor="middle" fontSize={11} fontWeight={500} letterSpacing="0.08em" fill={CHART_COLORS.gray600} aria-hidden="true">
              {valueLabel.toUpperCase()}
            </text>
          </svg>
          {active && (
            <ChartTooltip
              x={active.x}
              y={active.y}
              width={width}
              height={height}
              title={slices[active.key].label}
              rows={[
                { label: valueLabel, value: formatNumber(slices[active.key].value), color: SERIES_COLORS[active.key] },
                { label: 'Share', value: `${((slices[active.key].value / total) * 100).toFixed(1)}%` },
              ]}
            />
          )}
        </div>
      </div>
    </ChartCard>
  );
};
