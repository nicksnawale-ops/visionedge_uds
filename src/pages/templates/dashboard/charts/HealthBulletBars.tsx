import React from 'react';
import { ChartTooltip } from '../../../../components/charts/ChartTooltip';
import { useChartInteraction, useElementWidth, useEntryProgress } from '../../../../components/charts/hooks';
import { CHART_COLORS, formatNumber, markOpacity } from '../../../../components/charts/chartUtils';

export interface HealthBar {
  label: string;
  value: number;
  max: number;
  /** Target as % of max. */
  target: number;
  /** How to show the value, e.g. "7.4 of 10 TB". */
  detail: string;
}

/**
 * Bullet bars for system health, with the label above each bar so long names fit a 4-column card.
 * Same visual spec as the Charts-page BulletBars (8px Gray 100 track, Royal Blue fill, 2px Deep Navy
 * target marker), which has a fixed 64px label column and "Occupancy" wording, so it can't be reused here.
 */
export const HealthBulletBars: React.FC<{ title: string; bars: HealthBar[] }> = ({ title, bars }) => {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>(320);
  const { containerRef, active, bind } = useChartInteraction<number>();
  const progress = useEntryProgress();
  const ROW = 44;
  const pct = (b: HealthBar) => (b.value / b.max) * 100;
  const worst = bars.reduce((a, b) => (pct(b) - b.target > pct(a) - a.target ? b : a), bars[0]);
  const insight = `${title}: ${bars.map((b) => `${b.label} ${Math.round(pct(b))}%`).join(', ')}. Closest to its limit: ${worst.label}.`;

  return (
    <div ref={wrapRef} className="w-full">
      <div ref={containerRef} className="relative" role="img" aria-label={insight}>
        {bars.map((b, i) => {
          const p = pct(b);
          return (
            <div
              key={b.label}
              style={{ height: ROW, opacity: markOpacity(i, active?.key) }}
              {...bind(i, { x: (width * p) / 100, y: i * ROW + 30 }, `${b.label}: ${Math.round(p)}%, ${b.detail}, target ${b.target}%`, 'flex flex-col justify-center gap-1.5 rounded-[4px] transition-opacity duration-150')}
            >
              <span className="flex items-baseline justify-between gap-2 text-[13px] leading-[16px]">
                <span className="text-[#353D4C] truncate">{b.label}</span>
                <span className="font-medium text-[#121722] tabular-nums">{Math.round(p)}%</span>
              </span>
              <span className="relative block h-2 rounded-full bg-[#EEF1F6]">
                <span className="absolute inset-y-0 left-0 rounded-full bg-[#1E63FF]" style={{ width: `${p * progress}%` }} />
                <span className="absolute -top-1 -bottom-1 w-[2px] bg-[#0B2D6B]" style={{ left: `calc(${b.target}% - 1px)` }} aria-hidden="true" />
              </span>
            </div>
          );
        })}
        {active && (
          <ChartTooltip
            x={active.x}
            y={active.y}
            width={width}
            height={bars.length * ROW}
            title={bars[active.key].label}
            rows={[
              { label: 'Current', value: `${Math.round(pct(bars[active.key]))}%`, color: CHART_COLORS.royalBlue },
              { label: 'Detail', value: bars[active.key].detail },
              { label: 'Target', value: `${formatNumber(bars[active.key].target)}%`, color: CHART_COLORS.deepNavy },
            ]}
          />
        )}
      </div>
    </div>
  );
};
