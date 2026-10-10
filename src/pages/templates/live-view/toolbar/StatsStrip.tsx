import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { LiveStat } from '../useCases';
import { useSurface } from '../surface/ControlRoomSurface';
import { OVERLINE } from '../ui';

/** 4 compact cells: Overline label, value, tiny trend; 1px dividers. */
export const StatsStrip: React.FC<{ stats: LiveStat[]; loading: boolean; compact: boolean }> = ({ stats, loading, compact }) => {
  const t = useSurface();
  return (
    <dl className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-4'} rounded-[12px] border ${t.panel} overflow-hidden`}>
      {stats.map((s, i) => (
        <div key={s.label} className={`px-4 py-2.5 min-w-0 ${i > 0 ? `${compact && i === 2 ? '' : 'border-l'} ${t.border}` : ''} ${compact && i >= 2 ? `border-t ${t.border}` : ''}`}>
          <dt className={`${OVERLINE} ${t.subtle} truncate`}>{s.label}</dt>
          <dd className="mt-0.5 flex items-baseline gap-2 min-w-0">
            {loading ? (
              <span aria-hidden="true" className={`block h-5 w-16 rounded-[4px] ${t.skeleton} motion-safe:animate-pulse`} />
            ) : (
              <>
                <span className={`font-mono text-[18px] leading-6 font-semibold tabular-nums truncate ${t.text}`}>{s.value}</span>
                {s.trend && (
                  <span className={`inline-flex items-center gap-0.5 text-[11px] ${t.muted} whitespace-nowrap`}>
                    {s.tone === 'up' && <TrendingUp className="w-3 h-3" aria-hidden="true" />}
                    {s.tone === 'down' && <TrendingDown className="w-3 h-3" aria-hidden="true" />}
                    {s.trend}
                  </span>
                )}
              </>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
};
