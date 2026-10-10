import React from 'react';
import { TODAY, addDays, addMonths, endOfMonth, isSameDay, startOfMonth } from '../utils/dateMath';
import { FOCUS } from '../ui/styles';

export type PresetId = 'today' | 'yesterday' | '7d' | '30d' | 'this-month' | 'last-month' | 'custom';

export interface DateRange {
  start: Date;
  end: Date;
}

/** Presets are relative to TODAY (fixed demo date). Relative labels live here only, never in the field value. */
export const PRESETS: ReadonlyArray<{ id: PresetId; label: string; range: (() => DateRange) | null }> = [
  { id: 'today', label: 'Today', range: () => ({ start: TODAY, end: TODAY }) },
  { id: 'yesterday', label: 'Yesterday', range: () => ({ start: addDays(TODAY, -1), end: addDays(TODAY, -1) }) },
  { id: '7d', label: 'Last 7 days', range: () => ({ start: addDays(TODAY, -6), end: TODAY }) },
  { id: '30d', label: 'Last 30 days', range: () => ({ start: addDays(TODAY, -29), end: TODAY }) },
  { id: 'this-month', label: 'This month', range: () => ({ start: startOfMonth(TODAY), end: TODAY }) },
  {
    id: 'last-month',
    label: 'Last month',
    range: () => ({ start: startOfMonth(addMonths(TODAY, -1)), end: endOfMonth(addMonths(TODAY, -1)) }),
  },
  { id: 'custom', label: 'Custom range', range: null },
];

export const matchPreset = (start: Date | null, end: Date | null): PresetId => {
  if (!start || !end) return 'custom';
  const hit = PRESETS.find((p) => {
    const r = p.range?.();
    return !!r && isSameDay(r.start, start) && isSameDay(r.end, end);
  });
  return hit?.id ?? 'custom';
};

interface PresetsProps {
  active: PresetId;
  onPick: (id: PresetId) => void;
  /** 'list' = 160px column (desktop); 'chips' = horizontal chip row (mobile). */
  layout: 'list' | 'chips';
}

export const Presets: React.FC<PresetsProps> = ({ active, onPick, layout }) =>
  layout === 'list' ? (
    <div data-part="presets" role="group" aria-label="Presets" className="w-[160px] shrink-0 flex flex-col gap-0.5 p-2 border-r border-[#DDE2EA]">
      {PRESETS.map((p) => {
        const on = p.id === active;
        return (
          <button
            key={p.id}
            type="button"
            aria-pressed={on}
            data-autofocus={on || undefined}
            onClick={() => onPick(p.id)}
            className={`h-9 px-3 rounded-[8px] text-left text-[14px] transition-colors ${FOCUS} ${
              on ? 'bg-[#1E63FF]/[0.08] text-[#1E63FF] font-semibold' : 'text-[#353D4C] hover:bg-[#EEF1F6]'
            }`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  ) : (
    <div data-part="presets" role="group" aria-label="Presets" className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
      {PRESETS.map((p) => {
        const on = p.id === active;
        return (
          <button
            key={p.id}
            type="button"
            aria-pressed={on}
            onClick={() => onPick(p.id)}
            className={`h-10 shrink-0 px-3 rounded-full border text-[14px] whitespace-nowrap transition-colors ${FOCUS} ${
              on ? 'border-[#1E63FF] bg-[#1E63FF]/[0.08] text-[#1E63FF] font-semibold' : 'border-[#DDE2EA] text-[#353D4C] hover:bg-[#EEF1F6]'
            }`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
