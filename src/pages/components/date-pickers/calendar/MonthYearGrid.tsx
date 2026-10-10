import React, { useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TODAY } from '../utils/dateMath';
import { MONTHS_SHORT, monthName } from '../utils/formatIST';
import { IconButton } from '../ui/IconButton';
import { FOCUS } from '../ui/styles';

export interface YearMonth {
  year: number;
  month: number;
}

interface MonthYearGridProps {
  year: number;
  onYearChange: (year: number) => void;
  selected: YearMonth | null;
  onSelect: (year: number, month: number) => void;
  /** Why a month can't be picked (e.g. "Future months aren't available"), or null. */
  reasonFor?: (year: number, month: number) => string | null;
  minYear?: number;
  maxYear?: number;
  autoFocus?: boolean;
  touch?: boolean;
}

/** Year header (Prev/Next) + 3×4 month grid of 64×40 cells. Used by the month picker and the calendar header. */
export const MonthYearGrid: React.FC<MonthYearGridProps> = ({
  year,
  onYearChange,
  selected,
  onSelect,
  reasonFor,
  minYear,
  maxYear,
  autoFocus = false,
  touch = false,
}) => {
  const labelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const pending = useRef(autoFocus);
  const [focusMonth, setFocusMonth] = useState(() =>
    selected && selected.year === year ? selected.month : year === TODAY.getFullYear() ? TODAY.getMonth() : 0,
  );
  const [live, setLive] = useState('');

  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    rootRef.current?.querySelector<HTMLElement>(`[data-month="${focusMonth}"]`)?.focus({ preventScroll: true });
  });

  const changeYear = (y: number) => {
    onYearChange(y);
    setLive(String(y));
  };

  const onKeyDown = (e: React.KeyboardEvent, m: number) => {
    const delta: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 };
    let next: number;
    if (e.key in delta) next = m + delta[e.key];
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 11;
    else if (e.key === 'PageUp' || e.key === 'PageDown') {
      const y = year + (e.key === 'PageUp' ? -1 : 1);
      if ((minYear !== undefined && y < minYear) || (maxYear !== undefined && y > maxYear)) return;
      e.preventDefault();
      pending.current = true;
      changeYear(y);
      return;
    } else return;
    e.preventDefault();
    if (next < 0 || next > 11) {
      const y = year + (next < 0 ? -1 : 1);
      if ((minYear !== undefined && y < minYear) || (maxYear !== undefined && y > maxYear)) return;
      changeYear(y);
      next = (next + 12) % 12;
    }
    pending.current = true;
    setFocusMonth(next);
  };

  const rows = [0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => r * 3 + c));

  return (
    <div ref={rootRef}>
      <div className="flex items-center justify-between mb-2">
        <IconButton
          icon={ChevronLeft}
          label="Previous year"
          touch={touch}
          onClick={() => changeYear(year - 1)}
          disabled={minYear !== undefined && year <= minYear}
        />
        <span id={labelId} className="text-[14px] leading-5 font-semibold text-[#121722] tabular-nums">
          {year}
        </span>
        <IconButton
          icon={ChevronRight}
          label="Next year"
          touch={touch}
          onClick={() => changeYear(year + 1)}
          disabled={maxYear !== undefined && year >= maxYear}
        />
      </div>
      <div aria-live="polite" className="sr-only">
        {live}
      </div>
      <table role="grid" aria-labelledby={labelId} className="mx-auto border-separate border-spacing-x-3 border-spacing-y-1.5">
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((m) => {
                const reason = reasonFor?.(year, m) ?? null;
                const isSelected = !!selected && selected.year === year && selected.month === m;
                const isCurrent = year === TODAY.getFullYear() && m === TODAY.getMonth();
                const tone = reason
                  ? 'text-[#C3CAD5] cursor-not-allowed'
                  : isSelected
                    ? 'bg-[#1E63FF] text-white font-semibold hover:bg-[#0B2D6B]'
                    : isCurrent
                      ? 'border border-[#1E63FF] text-[#1E63FF] font-medium hover:bg-[#EEF1F6]'
                      : 'text-[#353D4C] hover:bg-[#EEF1F6]';
                return (
                  <td key={m} role="gridcell" aria-selected={isSelected} className="p-0">
                    <button
                      type="button"
                      data-month={m}
                      tabIndex={m === focusMonth ? 0 : -1}
                      data-autofocus={autoFocus && m === focusMonth ? true : undefined}
                      aria-label={`${monthName(m)} ${year}${isCurrent ? ', current month' : ''}${reason ? `, unavailable: ${reason}` : ''}`}
                      aria-disabled={reason ? true : undefined}
                      title={reason ?? undefined}
                      onClick={() => {
                        if (!reason) onSelect(year, m);
                      }}
                      onKeyDown={(e) => onKeyDown(e, m)}
                      onFocus={() => setFocusMonth(m)}
                      className={`w-16 ${touch ? 'h-11' : 'h-10'} rounded-[8px] text-[14px] transition-colors ${FOCUS} ${tone}`}
                    >
                      {MONTHS_SHORT[m]}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
