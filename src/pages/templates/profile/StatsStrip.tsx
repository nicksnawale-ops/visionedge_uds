import React from 'react';
import { OVERLINE, Skeleton } from './ui';

export interface Stat {
  label: string;
  value: string;
}

/**
 * 4 cells separated by 1px Gray 200 dividers: Overline label + Body Large value.
 * 4 across from 1024px, 2×2 below.
 */
export const StatsStrip: React.FC<{ stats: Stat[]; loading?: boolean; marker?: React.ReactNode }> = ({ stats, loading = false, marker }) => (
  <div className="relative border-t border-[#DDE2EA]">
    {marker}
    <dl className="grid grid-cols-2 @min-[1024px]:grid-cols-4">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`min-w-0 px-4 @min-[768px]:px-6 py-4 border-[#DDE2EA] ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t @min-[1024px]:border-t-0' : ''} ${
            i === 2 ? '@min-[1024px]:border-l' : ''
          }`}
        >
          <dt className={OVERLINE}>{s.label}</dt>
          <dd className="mt-1 text-[18px] leading-[28px] text-[#121722] tabular-nums">
            {loading ? <Skeleton className="h-6 w-10 mt-1" /> : s.value}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);
