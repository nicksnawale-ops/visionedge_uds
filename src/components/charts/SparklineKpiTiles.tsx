import React from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { ChartTooltip } from './ChartTooltip';
import { useChartInteraction, useElementWidth, useEntryProgress } from './hooks';
import { CHART_COLORS, FOCUS_RING_CLASS, formatNumber } from './chartUtils';
import type { KpiTileData } from './sampleData';

const SPARK_H = 32;
const PAD = 3;

const pointLabel = (i: number, n: number) => (i === n - 1 ? 'Now' : `${n - 1 - i}h ago`);

interface SparklineProps {
  label: string;
  values: number[];
}

/** 32px-high Royal Blue sparkline with no axes. Focus it and use ← → to read points. */
export const Sparkline: React.FC<SparklineProps> = ({ label, values }) => {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>(200);
  const { containerRef, active, setActive, pointFromEvent } = useChartInteraction<number>();
  const progress = useEntryProgress();

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = (width - PAD * 2) / (values.length - 1);
  const x = (i: number) => PAD + i * step;
  const y = (v: number) => SPARK_H - PAD - ((v - min) / range) * (SPARK_H - PAD * 2);

  // Entry animation draws the line from left to right.
  const visible = Math.max(2, Math.ceil(values.length * progress));
  const path = values
    .slice(0, visible)
    .map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`)
    .join('');

  const first = values[0];
  const last = values[values.length - 1];
  const direction = last > first ? 'rising' : last < first ? 'falling' : 'flat';
  const aria = `${label}, last ${values.length} hours: ${direction} from ${formatNumber(first)} to ${formatNumber(last)}.`;

  const activate = (i: number) => setActive({ key: i, x: x(i), y: y(values[i]) });

  return (
    <div ref={wrapRef} className="w-full">
      <div ref={containerRef} className="relative" style={{ height: SPARK_H }}>
        <svg
          width={width}
          height={SPARK_H}
          role="img"
          aria-label={aria}
          tabIndex={0}
          className={`block ${FOCUS_RING_CLASS}`}
          onMouseMove={(e) => {
            const p = pointFromEvent(e);
            const i = Math.min(values.length - 1, Math.max(0, Math.round((p.x - PAD) / step)));
            setActive({ key: i, ...p });
          }}
          onMouseLeave={() => setActive(null)}
          onFocus={() => activate(values.length - 1)}
          onBlur={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            e.preventDefault();
            const current = active?.key ?? values.length - 1;
            activate(Math.min(values.length - 1, Math.max(0, current + (e.key === 'ArrowRight' ? 1 : -1))));
          }}
        >
          <path d={path} fill="none" stroke={CHART_COLORS.royalBlue} strokeWidth={1.5} strokeLinejoin="round" />
          {active && (
            <circle
              cx={x(active.key)}
              cy={y(values[active.key])}
              r={3}
              fill={CHART_COLORS.royalBlue}
              stroke={CHART_COLORS.white}
              strokeWidth={1.5}
            />
          )}
        </svg>

        {active && (
          <ChartTooltip
            x={x(active.key)}
            y={y(values[active.key])}
            width={width}
            height={SPARK_H}
            title={pointLabel(active.key, values.length)}
            rows={[{ label, value: formatNumber(values[active.key]), color: CHART_COLORS.royalBlue }]}
          />
        )}
      </div>
    </div>
  );
};

const TREND_ICON = { up: ArrowUpRight, down: ArrowDownRight, flat: ArrowRight } as const;

/** KPI tiles: Overline label, KPI number, 32px sparkline and a trend line. */
export const SparklineKpiTiles: React.FC<{ tiles: KpiTileData[] }> = ({ tiles }) => (
  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
    {tiles.map((tile) => {
      const TrendIcon = TREND_ICON[tile.direction];
      return (
        <div
          key={tile.id}
          className="min-w-0 bg-white p-6 rounded-[12px] border border-[#DDE2EA] shadow-[0_1px_3px_rgba(11,45,107,0.08)] flex flex-col gap-3"
        >
          <span className="text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
            {tile.label}
          </span>
          <span className="text-[32px] leading-[40px] font-bold text-[#0B2D6B] tabular-nums">{tile.value}</span>
          <Sparkline label={tile.label} values={tile.spark} />
          <span className="flex items-center gap-1 text-[12px] leading-[16px] text-[#4B5465]">
            <TrendIcon className="w-3.5 h-3.5 text-[#1E63FF]" aria-hidden="true" />
            {tile.trend}
          </span>
        </div>
      );
    })}
  </div>
);
