import React, { useState } from 'react';
import { ChartCard, LegendItem } from '../../../../components/charts/ChartCard';
import { ChartTooltip } from '../../../../components/charts/ChartTooltip';
import { XLabels, YAxis } from '../../../../components/charts/ChartAxes';
import { useChartInteraction, useElementWidth, useEntryProgress } from '../../../../components/charts/hooks';
import { AXIS_TEXT, CHART_COLORS, DIM_OPACITY, formatNumber, niceScale, topRoundedBarPath } from '../../../../components/charts/chartUtils';
import type { ComboData } from '../data/series';

type SeriesKey = 'bars' | 'line';

interface MarkKey {
  index: number;
  series: SeriesKey;
}

interface ComboTrendChartProps {
  title: string;
  subtitle?: string;
  data: ComboData;
  height?: number;
}

const M = { top: 12, right: 56, bottom: 28, left: 56 };

/**
 * Bars (left axis) + line with dots (right axis), with the series names taken from the data.
 * The Charts-page ComboChart hard-codes "Entries" / "Unauthorized attempts", so this variant
 * is built from the same primitives instead of editing it.
 */
export const ComboTrendChart: React.FC<ComboTrendChartProps> = ({ title, subtitle, data, height = 260 }) => {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const { containerRef, active, bind } = useChartInteraction<MarkKey>();
  const [legendKey, setLegendKey] = useState<SeriesKey | null>(null);
  const progress = useEntryProgress();
  const pts = data.points;

  const plotW = Math.max(0, width - M.left - M.right);
  const plotH = height - M.top - M.bottom;
  const left = niceScale(Math.max(1, ...pts.map((p) => p.bars)));
  const steps = left.ticks.length - 1;
  const rightMax = Math.max(steps, Math.ceil(Math.max(1, ...pts.map((p) => p.line)) / steps) * steps);
  const rightTicks = left.ticks.map((_, i) => (rightMax / steps) * i);
  const band = plotW / Math.max(1, pts.length);
  const barW = Math.min(band * 0.5, 32);
  const cx = (i: number) => M.left + band * i + band / 2;
  const yL = (v: number) => M.top + plotH - (v / left.max) * plotH;
  const yR = (v: number) => M.top + plotH - (v / rightMax) * plotH;

  const highlighted = active ? active.key.series : legendKey;
  const opacityFor = (index: number, series: SeriesKey) => {
    if (active) return active.key.series === series && active.key.index === index ? 1 : DIM_OPACITY;
    if (highlighted) return highlighted === series ? 1 : DIM_OPACITY;
    return 1;
  };

  const linePoints = pts.map((p, i) => ({ x: cx(i), y: yR(p.line * progress) }));
  const peak = pts.reduce((a, b) => (b.bars > a.bars ? b : a), pts[0]);
  const insight = `${title}: ${data.barLabel.toLowerCase()} peak at ${peak.label} with ${formatNumber(peak.bars)}.`;
  const legend: LegendItem[] = [
    { key: 'bars', label: data.barLabel, color: CHART_COLORS.deepNavy },
    { key: 'line', label: data.lineLabel, color: CHART_COLORS.cyan },
  ];
  const activeRow = active ? pts[active.key.index] : null;

  return (
    <ChartCard title={title} subtitle={subtitle} legend={legend} activeKey={highlighted} onLegendHover={(k) => setLegendKey(k as SeriesKey | null)}>
      <div ref={wrapRef} className="w-full">
        <div ref={containerRef} className="relative" style={{ height }}>
          <svg width={width} height={height} role="img" aria-label={insight} className="block">
            <YAxis ticks={left.ticks} scale={yL} left={M.left} right={width - M.right} />
            <YAxis ticks={rightTicks} scale={yR} left={M.left} right={width - M.right} side="right" showGrid={false} />
            <text transform={`translate(12 ${M.top + plotH / 2}) rotate(-90)`} textAnchor="middle" {...AXIS_TEXT} aria-hidden="true">
              {data.barLabel}
            </text>
            <text transform={`translate(${width - 10} ${M.top + plotH / 2}) rotate(90)`} textAnchor="middle" {...AXIS_TEXT} aria-hidden="true">
              {data.lineLabel}
            </text>
            {pts.map((p, i) => {
              const h = (p.bars / left.max) * plotH * progress;
              const y0 = M.top + plotH - h;
              return (
                <path
                  key={`bar-${p.label}`}
                  d={topRoundedBarPath(cx(i) - barW / 2, y0, barW, h)}
                  fill={CHART_COLORS.deepNavy}
                  opacity={opacityFor(i, 'bars')}
                  {...bind({ index: i, series: 'bars' }, { x: cx(i), y: y0 }, `${p.label}: ${formatNumber(p.bars)} ${data.barLabel.toLowerCase()}`, 'transition-opacity duration-150')}
                />
              );
            })}
            <polyline
              points={linePoints.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke={CHART_COLORS.cyan}
              strokeWidth={2}
              strokeLinejoin="round"
              opacity={highlighted === 'bars' ? DIM_OPACITY : 1}
            />
            {pts.map((p, i) => (
              <circle
                key={`dot-${p.label}`}
                cx={linePoints[i].x}
                cy={linePoints[i].y}
                r={4.5}
                fill={CHART_COLORS.cyan}
                stroke={CHART_COLORS.white}
                strokeWidth={2}
                opacity={opacityFor(i, 'line')}
                {...bind({ index: i, series: 'line' }, linePoints[i], `${p.label}: ${formatNumber(p.line)} ${data.lineLabel.toLowerCase()}`, 'transition-opacity duration-150')}
              />
            ))}
            <XLabels labels={pts.map((p, i) => ({ key: p.label, x: cx(i), text: p.label }))} y={height - 6} />
          </svg>
          {active && activeRow && (
            <ChartTooltip
              x={active.x}
              y={active.y}
              width={width}
              height={height}
              title={activeRow.label}
              rows={[
                { label: data.barLabel, value: formatNumber(activeRow.bars), color: CHART_COLORS.deepNavy },
                { label: data.lineLabel, value: formatNumber(activeRow.line), color: CHART_COLORS.cyan },
              ]}
            />
          )}
        </div>
      </div>
    </ChartCard>
  );
};
