import React from 'react';
import { X } from 'lucide-react';
import { DATE_OPTIONS, TableQueryApi } from '../hooks/useTableQuery';
import { STATUS_LABEL, dayLabel } from '../sampleData';
import { BTN, FOCUS } from '../tableStyles';

/** Active filters as removable chips (Gray 100, 12px) + Ghost "Clear all". Hidden when nothing is applied. */
export const FilterChips: React.FC<{ api: TableQueryApi }> = ({ api }) => {
  const { query, update, reset } = api;
  const chips: { key: string; label: string; remove: () => void }[] = [
    ...(query.q.trim() ? [{ key: 'q', label: `Search: ${query.q.trim()}`, remove: () => update({ q: '' }) }] : []),
    ...query.status.map((s) => ({ key: `s-${s}`, label: `Status: ${STATUS_LABEL[s]}`, remove: () => update({ status: query.status.filter((x) => x !== s) }) })),
    ...query.gate.map((g) => ({ key: `g-${g}`, label: `Gate: ${g}`, remove: () => update({ gate: query.gate.filter((x) => x !== g) }) })),
    ...(query.date !== 'all'
      ? [
          {
            key: 'date',
            label: `Date: ${query.date === 'custom' ? `${dayLabel(query.from)} – ${dayLabel(query.to)}` : DATE_OPTIONS.find((d) => d.value === query.date)!.label}`,
            remove: () => update({ date: 'all' }),
          },
        ]
      : []),
  ];
  if (!chips.length) return null;
  return (
    <div className="px-4 py-2.5 border-b border-[#DDE2EA] flex flex-wrap items-center gap-2">
      <span className="sr-only">Active filters:</span>
      {chips.map((c) => (
        <span key={c.key} className="inline-flex items-center gap-1 h-7 pl-2.5 pr-1 rounded-full bg-[#EEF1F6] text-[12px] font-medium text-[#353D4C]">
          {c.label}
          <button
            type="button"
            onClick={c.remove}
            aria-label={`Remove ${c.label}`}
            className={`relative w-5 h-5 rounded-full inline-flex items-center justify-center text-[#4B5465] hover:bg-[#DDE2EA] hover:text-[#121722] after:absolute after:content-[''] after:-inset-3 ${FOCUS}`}
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </span>
      ))}
      <button type="button" onClick={reset} className={BTN.ghostSm}>
        Clear all
      </button>
    </div>
  );
};
