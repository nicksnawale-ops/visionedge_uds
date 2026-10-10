import React from 'react';
import { Info } from 'lucide-react';
import { ChartCard, LegendItem } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { useChartInteraction, useElementWidth, useEntryProgress } from './hooks';
import { AXIS_TEXT, CHART_COLORS, MAX_SERIES, SERIES_COLORS, formatNumber, markOpacity } from './chartUtils';
import type { CategoryValue } from './sampleData';

interface PieChartProps {
  title: string;
  subtitle?: string;
  /** 2–4 parts of a whole. Extra parts are merged into the last slice ("Other"). */
  data: CategoryValue[];
  valueLabel: string;
  height?: number;
}

/** Keeps at most MAX_SERIES slices by merging the tail into "Other". */
function limitSlices(data: CategoryValue[]): CategoryValue[] {
  if (data.length <= MAX_SERIES) return data;
  const head = data.slice(0, MAX_SERIES - 1);
  const rest = data.slice(MAX_SERIES - 1).reduce((sum, d) => sum + d.value, 0);
  return [...head, { label: 'Other', value: rest }];
}

const polar = (cx: number, cy: number, r: number, angle: number) => ({
  x: cx + r * Math.cos(angle),
  y: cy + r * Math.sin(angle),
});

/** Pie with 2px white separators and outside percentage labels on leader lines. */
export const PieChart: React.FC<PieChartProps> = ({ title, subtitle, data, valueLabel, height = 260 }) => {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const { containerRef, active, bind } = useChartInteraction<number>();
  const progress = useEntryProgress();

  const slices = limitSlices(data);
  const total = slices.reduce((sum, d) => sum + d.value, 0);
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.max(40, Math.min(96, width / 2 - 64, height / 2 - 28));

  let cursor = -Math.PI / 2;
  const arcs = slices.map((d, i) => {
    const sweep = (d.value / total) * Math.PI * 2 * progress;
    const start = cursor;
    const end = cursor + sweep;
    cursor = end;
    const mid = (start + end) / 2;
    const p0 = polar(cx, cy, r, start);
    const p1 = polar(cx, cy, r, end);
    const large = sweep > Math.PI ? 1 : 0;
    const path = `M${cx},${cy}L${p0.x},${p0.y}A${r},${r} 0 ${large} 1 ${p1.x},${p1.y}Z`;
    const pct = Math.round((d.value / total) * 100);
    const right = Math.cos(mid) >= 0;
    const l1 = polar(cx, cy, r + 4, mid);
    const l2 = polar(cx, cy, r + 16, mid);
    const l3 = { x: l2.x + (right ? 12 : -12), y: l2.y };
    return { d, i, path, pct, mid, right, l1, l2, l3, color: SERIES_COLORS[i], anchor: polar(cx, cy, r * 0.62, mid) };
  });

  const largest = slices.reduce((a, b) => (b.value > a.value ? b : a));
  const insight = `${title}: ${largest.label} is the largest share at ${Math.round((largest.value / total) * 100)}% of ${formatNumber(total)} ${valueLabel.toLowerCase()}.`;
  const legend: LegendItem[] = slices.map((d, i) => ({ key: String(i), label: d.label, color: SERIES_COLORS[i] }));

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      legend={legend}
      activeKey={active ? String(active.key) : null}
    >
      <div ref={wrapRef} className="w-full">
        <div ref={containerRef} className="relative" style={{ height }}>
          <svg width={width} height={height} role="img" aria-label={insight} className="block">
            {arcs.map((a) => (
              <path
                key={a.d.label}
                d={a.path}
                fill={a.color}
                stroke={CHART_COLORS.white}
                strokeWidth={2}
                strokeLinejoin="round"
                opacity={markOpacity(a.i, active?.key)}
                {...bind(
                  a.i,
                  a.anchor,
                  `${a.d.label}: ${formatNumber(a.d.value)} ${valueLabel.toLowerCase()}, ${a.pct}%`,
                  'transition-opacity duration-150'
                )}
              />
            ))}

            {progress === 1 &&
              arcs.map((a) => (
                <g key={`label-${a.d.label}`} opacity={markOpacity(a.i, active?.key)} aria-hidden="true">
                  <polyline
                    points={`${a.l1.x},${a.l1.y} ${a.l2.x},${a.l2.y} ${a.l3.x},${a.l3.y}`}
                    fill="none"
                    stroke={CHART_COLORS.gray400}
                    strokeWidth={1}
                  />
                  <text
                    x={a.l3.x + (a.right ? 4 : -4)}
                    y={a.l3.y}
                    dy="0.32em"
                    textAnchor={a.right ? 'start' : 'end'}
                    {...AXIS_TEXT}
                    fill={CHART_COLORS.gray900}
                    fontWeight={600}
                  >
                    {a.pct}%
                  </text>
                </g>
              ))}
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

      <p className="mt-4 flex items-start gap-2 rounded-[8px] border border-[#DDE2EA] bg-[#F7F9FC] px-3 py-2 text-[12px] leading-[16px] text-[#4B5465]">
        <Info className="w-4 h-4 shrink-0 text-[#1E63FF]" aria-hidden="true" />
        Prefer the donut chart. Use pie only for 2–4 parts of a whole.
      </p>
    </ChartCard>
  );
};
