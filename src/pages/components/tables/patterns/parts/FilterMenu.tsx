import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { DATE_OPTIONS, DateRange } from '../hooks/useTableQuery';
import { dayLabel } from '../sampleData';
import { CHECKBOX, INPUT, POPOVER } from '../tableStyles';

interface FilterPanelProps {
  label: string;
  /** Left offset inside the toolbar (desktop); full width on mobile. */
  left: number;
  onClose: (refocus: boolean) => void;
  children: React.ReactNode;
}

/**
 * Non-modal filter popover: focus moves to its first control, Esc closes and returns focus to the button,
 * clicking outside or tabbing out closes it. Listeners are removed when it closes.
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({ label, left, onClose, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('input, button, select')?.focus();
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (!ref.current?.contains(t) && !t.closest('[data-filter-button]')) closeRef.current(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          onClose(true);
        }
      }}
      onBlur={(e) => {
        const next = e.relatedTarget as HTMLElement | null;
        if (next && !ref.current?.contains(next) && !next.closest('[data-filter-button]')) onClose(false);
      }}
      className={`${POPOVER} top-full w-[260px] max-[767px]:left-4! max-[767px]:right-4 max-[767px]:w-auto`}
      style={{ left }}
    >
      {children}
    </div>
  );
};

/* ── Menu contents ── */

interface CheckListProps<T extends string> {
  legend: string;
  options: { value: T; label: string; count?: number }[];
  selected: T[];
  onChange: (next: T[]) => void;
}

/** Multi-select checkbox list (with optional counts). */
export function CheckList<T extends string>({ legend, options, selected, onChange }: CheckListProps<T>) {
  return (
    <fieldset className="py-1 max-h-[240px] overflow-y-auto">
      <legend className="sr-only">{legend}</legend>
      {options.map((o) => {
        const on = selected.includes(o.value);
        return (
          <label key={o.value} className="flex items-center gap-3 h-10 max-[767px]:h-11 px-3 text-[14px] text-[#353D4C] hover:bg-[#F7F9FC] cursor-pointer focus-within:bg-[#F7F9FC]">
            <input
              type="checkbox"
              checked={on}
              onChange={() => onChange(on ? selected.filter((s) => s !== o.value) : [...selected, o.value])}
              className={CHECKBOX}
            />
            <span className="flex-1 truncate">{o.label}</span>
            {o.count !== undefined && <span className="font-mono text-[12px] tabular-nums text-[#6B7485]">{o.count}</span>}
          </label>
        );
      })}
      {!options.length && <p className="px-3 py-3 text-[13px] text-[#4B5465]">No matches</p>}
    </fieldset>
  );
}

/** Gate list with its own search. */
export const GateList: React.FC<{ gates: { value: string; label: string; count: number }[]; selected: string[]; onChange: (next: string[]) => void }> = ({ gates, selected, onChange }) => {
  const [q, setQ] = useState('');
  const id = useId();
  const shown = useMemo(() => gates.filter((g) => g.label.toLowerCase().includes(q.trim().toLowerCase())), [gates, q]);
  return (
    <div>
      <div className="relative p-2 border-b border-[#DDE2EA]">
        <label htmlFor={id} className="sr-only">
          Search gates
        </label>
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7485]" aria-hidden="true" />
        <input id={id} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search gates" className={`${INPUT} w-full pl-9`} />
      </div>
      <CheckList legend="Gates" options={shown} selected={selected} onChange={onChange} />
    </div>
  );
};

const DAY_OPTIONS = Array.from({ length: 30 }, (_, d) => ({ value: d, label: d === 0 ? `Today (${dayLabel(0)})` : dayLabel(d) }));

/** Date range: Any · Today · Last 7 days · Last 30 days · Custom (from / to). */
export const DateList: React.FC<{ value: DateRange; from: number; to: number; onChange: (patch: { date: DateRange; from?: number; to?: number }) => void }> = ({ value, from, to, onChange }) => {
  const name = useId();
  return (
    <fieldset className="py-1">
      <legend className="sr-only">Date</legend>
      {DATE_OPTIONS.map((o) => (
        <label key={o.value} className="flex items-center gap-3 h-10 max-[767px]:h-11 px-3 text-[14px] text-[#353D4C] hover:bg-[#F7F9FC] cursor-pointer focus-within:bg-[#F7F9FC]">
          <input type="radio" name={name} checked={value === o.value} onChange={() => onChange({ date: o.value })} className="w-4 h-4 accent-[#1E63FF]" />
          {o.label}
        </label>
      ))}
      {value === 'custom' && (
        <div className="grid grid-cols-2 gap-2 px-3 pb-3 pt-1">
          {(
            [
              ['From', from, (v: number) => onChange({ date: 'custom', from: v, to: Math.min(to, v) })],
              ['To', to, (v: number) => onChange({ date: 'custom', to: v, from: Math.max(from, v) })],
            ] as const
          ).map(([label, v, set]) => (
            <label key={label} className="text-[12px] font-medium text-[#4B5465]">
              {label}
              <select value={v} onChange={(e) => set(Number(e.target.value))} className={`${INPUT} mt-1 w-full px-2`}>
                {DAY_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
};
