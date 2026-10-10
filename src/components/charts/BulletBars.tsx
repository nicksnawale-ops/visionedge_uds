import React from 'react';
import { ChartCard, LegendItem } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { useChartInteraction, useElementWidth, useEntryProgress } from './hooks';
import { CHART_COLORS, formatNumber, markOpacity } from './chartUtils';
import type { HostelBlock } from './sampleData';

interface BulletBarsProps {
  title: string;
  subtitle?: string;
  data: HostelBlock[];
}

const LABEL_W = 64;
const VALUE_W = 48;
const COL_GAP = 12;
const ROW_H = 36;

/** Progress / bullet bars: 8px Gray 100 track, Royal Blue fill, 2px Deep Navy target marker. */
export const BulletBars: React.FC<BulletBarsProps> = ({ title, subtitle, data }) => {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const { containerRef, active, bind } = useChartInteraction<number>();
  const progress = useEntryProgress();

  const trackW = Math.max(0, width - LABEL_W - VALUE_W - COL_GAP * 2);
  const pctOf = (b: HostelBlock) => (b.occupied / b.capacity) * 100;

  const fullest = data.reduce((a, b) => (pctOf(b) > pctOf(a) ? b : a));
  const overTarget = data.filter((b) => pctOf(b) >= b.target).length;
  const insight = `${title}: ${fullest.block} is fullest at ${Math.round(pctOf(fullest))}%; ${overTarget} of ${data.length} blocks are at or above target.`;

  const legend: LegendItem[] = [
    { key: 'occupancy', label: 'Occupancy', color: CHART_COLORS.royalBlue },
    { key: 'target', label: 'Target', color: CHART_COLORS.deepNavy },
  ];
  const activeBlock = active ? data[active.key] : null;

  return (
    <ChartCard title={title} subtitle={subtitle} legend={legend}>
      <div ref={wrapRef} className="w-full">
        <div ref={containerRef} className="relative" role="img" aria-label={insight}>
          {data.map((b, i) => {
            const pct = pctOf(b);
            const fillW = (trackW * pct * progress) / 100;
            return (
              <div
                key={b.block}
                style={{
                  gridTemplateColumns: `${LABEL_W}px 1fr ${VALUE_W}px`,
                  columnGap: COL_GAP,
                  height: ROW_H,
                  opacity: markOpacity(i, active?.key),
                }}
                {...bind(
                  i,
                  { x: LABEL_W + COL_GAP + fillW, y: i * ROW_H + ROW_H / 2 },
                  `${b.block}: ${Math.round(pct)}% occupied (${formatNumber(b.occupied)} of ${formatNumber(b.capacity)}), target ${b.target}%`,
                  'grid items-center rounded-[4px] transition-opacity duration-150'
                )}
              >
                <span className="text-[14px] leading-[20px] text-[#353D4C]">{b.block}</span>
                <div className="relative h-2 rounded-full bg-[#EEF1F6]">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-[#1E63FF]" style={{ width: fillW }} />
                  <div
                    className="absolute -top-1 -bottom-1 w-[2px] bg-[#0B2D6B]"
                    style={{ left: `calc(${b.target}% - 1px)` }}
                    aria-hidden="true"
                  />
                </div>
                <span className="text-[14px] leading-[20px] font-medium text-[#121722] text-right tabular-nums">
                  {Math.round(pct)}%
                </span>
              </div>
            );
          })}

          {active && activeBlock && (
            <ChartTooltip
              x={active.x}
              y={active.y}
              width={width}
              height={data.length * ROW_H}
              title={activeBlock.block}
              rows={[
                { label: 'Occupied', value: `${formatNumber(activeBlock.occupied)} / ${formatNumber(activeBlock.capacity)}` },
                { label: 'Occupancy', value: `${pctOf(activeBlock).toFixed(1)}%`, color: CHART_COLORS.royalBlue },
                { label: 'Target', value: `${activeBlock.target}%`, color: CHART_COLORS.deepNavy },
              ]}
            />
          )}
        </div>
      </div>
    </ChartCard>
  );
};
