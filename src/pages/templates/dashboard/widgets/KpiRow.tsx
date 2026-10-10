import React, { useRef } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Sparkline } from '../../../../components/charts/SparklineKpiTiles';
import { Skeleton, useFlash } from '../primitives';
import type { Kpi } from '../data/kpis';

export type KpiRowMode = 'ready' | 'loading' | 'empty';

interface KpiRowProps {
  mode: KpiRowMode;
  kpis: Kpi[];
  /** Labels used while loading or empty. */
  labels: { id: string; label: string; primary: boolean }[];
  anatomy?: React.ReactNode;
}

const TILE =
  'relative min-w-0 bg-white rounded-[12px] border border-[#DDE2EA] shadow-[0_1px_3px_rgba(11,45,107,0.08)] overflow-hidden';
const LABEL = 'text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#6B7485]';
const VALUE = 'text-[32px] leading-[40px] font-bold text-[#0B2D6B] font-mono tabular-nums rounded-[4px] -mx-1 px-1';

/** One KPI tile (Cards & KPI standard): Overline label, KPI number, trend line and sparkline. */
const KpiTile: React.FC<{ kpi: Kpi }> = ({ kpi }) => {
  const valueRef = useRef<HTMLSpanElement>(null);
  useFlash(valueRef, kpi.value);
  const TrendIcon = kpi.direction === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className={TILE}>
      {kpi.primary && <div className="h-1 bg-[#00C6FF]" aria-hidden="true" />}
      <div className="p-5 flex flex-col gap-2">
        <span className={LABEL}>{kpi.label}</span>
        <span ref={valueRef} className={`${VALUE} self-start`}>
          {kpi.value}
        </span>
        <span className="flex items-center gap-1.5 text-[12px] leading-[16px] text-[#4B5465]">
          <TrendIcon className="w-4 h-4 shrink-0 text-[#1E63FF]" aria-hidden="true" />
          <span>
            <span className="sr-only">{kpi.direction === 'up' ? 'Up ' : 'Down '}</span>
            {kpi.trend}
          </span>
        </span>
        <Sparkline label={kpi.label} values={kpi.spark} />
      </div>
    </div>
  );
};

/** 4 KPI tiles: 4 across ≥1024px, 2×2 at 768–1023px, stacked below 768px. Only the key KPI gets the Cyan top bar. */
export const KpiRow: React.FC<KpiRowProps> = ({ mode, kpis, labels, anatomy }) => (
  <div className="relative col-span-12">
    {anatomy}
    <div className="grid grid-cols-1 @min-[768px]:grid-cols-2 @min-[1024px]:grid-cols-4 gap-6">
      {mode === 'ready' &&
        kpis.map((kpi) => <KpiTile key={kpi.id} kpi={kpi} />)}

      {mode === 'empty' &&
        labels.map((l) => (
          <div key={l.id} className={TILE}>
            {l.primary && <div className="h-1 bg-[#00C6FF]" aria-hidden="true" />}
            <div className="p-5 flex flex-col gap-2">
              <span className={LABEL}>{l.label}</span>
              <span className={VALUE} aria-label="No value">
                —
              </span>
              <span className="text-[12px] leading-[16px] text-[#4B5465]">No data yet</span>
              <span className="block h-8" aria-hidden="true" />
            </div>
          </div>
        ))}

      {mode === 'loading' &&
        labels.map((l) => (
          <div key={l.id} className={TILE} role="status" aria-label={`Loading ${l.label}`}>
            {l.primary && <div className="h-1 bg-[#EEF1F6]" aria-hidden="true" />}
            <div className="p-5 flex flex-col gap-3">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
    </div>
  </div>
);
