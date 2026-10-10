import React from 'react';
import { AlertCircle, CalendarDays, Loader2, MousePointerClick } from 'lucide-react';
import { DoDontPair } from '../../../../components/common/DoDont';
import { DO_DONT } from '../pickersSpec';

const BOX = 'w-full max-w-[240px] rounded-[8px] border border-[#DDE2EA] bg-white p-3';
const FIELD = 'h-9 flex items-center justify-between px-3 rounded-[8px] border border-[#8C95A6] bg-white text-[13px] text-[#121722] tabular-nums';

const MiniDays: React.FC<{ from: number; to: number; muted?: number }> = ({ from, to, muted }) => (
  <div className="grid grid-cols-7 gap-0.5" aria-hidden="true">
    {Array.from({ length: 14 }, (_, i) => {
      const d = 17 + i;
      const on = d >= from && d <= to;
      const off = muted !== undefined && d > muted;
      return (
        <span
          key={d}
          className={`h-5 flex items-center justify-center rounded-[4px] text-[10px] tabular-nums ${
            off ? 'text-[#C3CAD5]' : on ? 'bg-[#1E63FF] text-white' : 'text-[#353D4C]'
          }`}
        >
          {d > 30 ? d - 30 : d}
        </span>
      );
    })}
  </div>
);

const VISUALS: Record<string, { ok: React.ReactNode; bad: React.ReactNode }> = {
  presets: {
    ok: (
      <div className={`${BOX} flex flex-col gap-1`} aria-hidden="true">
        {['Last 7 days', 'Last 30 days', 'Last month'].map((p) => (
          <span key={p} className={`h-7 px-2 flex items-center rounded-[6px] text-[12px] ${p === 'Last month' ? 'bg-[#1E63FF]/[0.08] text-[#1E63FF] font-semibold' : 'text-[#353D4C]'}`}>
            {p}
          </span>
        ))}
      </div>
    ),
    bad: (
      <div className={`${BOX} flex flex-col gap-2`} aria-hidden="true">
        <MiniDays from={17} to={30} />
        <span className="flex items-center gap-1 text-[11px] text-[#4B5465]">
          <MousePointerClick className="w-3.5 h-3.5" /> 30 clicks for one month
        </span>
      </div>
    ),
  },
  typing: {
    ok: (
      <div className={BOX} aria-hidden="true">
        <span className={FIELD}>
          14/03/1998
          <CalendarDays className="w-3.5 h-3.5 text-[#4B5465]" />
        </span>
      </div>
    ),
    bad: (
      <div className={BOX} aria-hidden="true">
        <span className={`${FIELD} text-[#6B7485]`}>
          Select date (calendar only)
          <CalendarDays className="w-3.5 h-3.5 text-[#4B5465]" />
        </span>
        <p className="mt-2 text-[11px] text-[#4B5465]">← 28 years of clicking back to 1998</p>
      </div>
    ),
  },
  disable: {
    ok: (
      <div className={`${BOX} relative`} aria-hidden="true">
        <MiniDays from={30} to={30} muted={30} />
        <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-[4px] bg-[#1F2633] text-white text-[10px]">Future dates aren&rsquo;t available</span>
      </div>
    ),
    bad: (
      <div className={`${BOX} flex flex-col gap-2`} aria-hidden="true">
        <MiniDays from={2} to={2} />
        <span className="flex items-center gap-1 text-[11px] font-medium text-[#0B2D6B]">
          <AlertCircle className="w-3.5 h-3.5" /> No logs exist for 02 Oct 2026
        </span>
      </div>
    ),
  },
  zone: {
    ok: (
      <div className={BOX} aria-hidden="true">
        <span className={FIELD}>
          30 Sep 2026, 14:05 <span className="text-[11px] font-medium text-[#4B5465]">IST</span>
        </span>
      </div>
    ),
    bad: (
      <div className={BOX} aria-hidden="true">
        <span className={FIELD}>30 Sep 2026, 14:05</span>
        <p className="mt-2 text-[11px] text-[#4B5465]">Which site&rsquo;s clock?</p>
      </div>
    ),
  },
  apply: {
    ok: (
      <div className={`${BOX} flex items-center justify-between`} aria-hidden="true">
        <span className="text-[11px] text-[#4B5465]">30 days selected</span>
        <span className="flex gap-1">
          <span className="h-6 px-2 flex items-center text-[11px] font-semibold text-[#1E63FF]">Cancel</span>
          <span className="h-6 px-2 flex items-center rounded-[6px] bg-[#1E63FF] text-[11px] font-semibold text-white">Apply</span>
        </span>
      </div>
    ),
    bad: (
      <div className={`${BOX} flex items-center gap-2 text-[11px] text-[#4B5465]`} aria-hidden="true">
        <Loader2 className="w-3.5 h-3.5" /> Reloading 48,210 rows… (3rd time)
      </div>
    ),
  },
  format: {
    ok: (
      <div className={BOX} aria-hidden="true">
        <span className={FIELD}>30 Sep 2026</span>
      </div>
    ),
    bad: (
      <div className={BOX} aria-hidden="true">
        <span className={FIELD}>09/10/26</span>
        <p className="mt-2 text-[11px] text-[#4B5465]">9 Oct or 10 Sep? 2026 or 1926?</p>
      </div>
    ),
  },
};

export const DoDontVisuals: React.FC = () => (
  <div>
    {DO_DONT.map((d) => (
      <DoDontPair key={d.id} doDescription={d.doText} dontDescription={d.dontText} doExample={VISUALS[d.id].ok} dontExample={VISUALS[d.id].bad} className="my-0 mb-4" />
    ))}
  </div>
);
