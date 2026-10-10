import React, { useEffect, useId, useRef, useState } from 'react';
import {
  TODAY,
  addDays,
  addMonths,
  addYears,
  compareDay,
  daysInMonth,
  dateKey,
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfMonth,
  startOfWeek,
} from '../utils/dateMath';
import { formatDate, formatMonthLong } from '../utils/formatIST';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid, type CellDensity } from './CalendarGrid';
import { MonthYearGrid } from './MonthYearGrid';
import type { DayMarkers, DayState } from './DayCell';

export const FUTURE_REASON = "Future dates aren't available";

export interface CalendarProps {
  mode?: 'single' | 'range';
  value?: Date | null;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  onSelect: (d: Date) => void;
  /** Two months side by side (range), or stacked on mobile. */
  months?: 1 | 2;
  stacked?: boolean;
  min?: Date;
  max?: Date;
  minReason?: string;
  maxReason?: string;
  /** Extra rule, e.g. the 90-day range limit. Return the reason or null. */
  disabledReason?: (d: Date) => string | null;
  markers?: (d: Date) => DayMarkers | null;
  loadingMarkers?: boolean;
  touch?: boolean;
  density?: CellDensity;
  hideOutside?: boolean;
  /** Controlled first visible month. */
  view?: Date;
  onViewChange?: (month: Date) => void;
  initialView?: Date;
  /** Mark the active day as the popover's initial focus. */
  autoFocus?: boolean;
}

/**
 * Header + one or two month grids + the month/year jump grid.
 * Keyboard: arrows (day/week), PageUp/PageDown (month, Shift = year), Home/End (week), Enter/Space (select).
 * Month changes are announced politely ("October 2026").
 */
export const Calendar: React.FC<CalendarProps> = ({
  mode = 'single',
  value = null,
  rangeStart = null,
  rangeEnd = null,
  onSelect,
  months = 1,
  stacked = false,
  min,
  max,
  minReason,
  maxReason = FUTURE_REASON,
  disabledReason,
  markers,
  loadingMarkers = false,
  touch = false,
  density = 'default',
  hideOutside = false,
  view: viewProp,
  onViewChange,
  initialView,
  autoFocus = false,
}) => {
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(false);
  const anchor = value ?? rangeStart ?? (max && compareDay(TODAY, max) > 0 ? max : TODAY);
  const [innerView, setInnerView] = useState(() => startOfMonth(initialView ?? anchor));
  const [focusDate, setFocusDate] = useState<Date>(anchor);
  const [hover, setHover] = useState<Date | null>(null);
  const [picker, setPicker] = useState<{ index: number; year: number } | null>(null);
  const [live, setLive] = useState('');

  const view = viewProp ? startOfMonth(viewProp) : innerView;
  const visible = Array.from({ length: months }, (_, i) => addMonths(view, i));
  const lastEnd = endOfMonth(visible[months - 1]);
  const isVisible = (d: Date) => compareDay(d, view) >= 0 && compareDay(d, lastEnd) <= 0;
  const viewLabel = (v: Date) => (months === 2 ? `${formatMonthLong(v)} to ${formatMonthLong(addMonths(v, 1))}` : formatMonthLong(v));

  const setView = (v: Date) => {
    const s = startOfMonth(v);
    if (!viewProp) setInnerView(s);
    onViewChange?.(s);
    setLive(viewLabel(s));
  };

  // The roving focus day always sits in a visible month.
  const pickVisible = (): Date => {
    for (const d of [focusDate, value, rangeStart, TODAY]) if (d && isVisible(d)) return d;
    return view;
  };
  const activeFocus = pickVisible();

  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    rootRef.current?.querySelector<HTMLElement>(`[data-date="${dateKey(activeFocus)}"]`)?.focus({ preventScroll: !stacked });
  });

  const reasonFor = (d: Date): string | null => {
    if (max && compareDay(d, max) > 0) return maxReason;
    if (min && compareDay(d, min) < 0) return minReason ?? `Dates before ${formatDate(min)} aren't available`;
    return disabledReason?.(d) ?? null;
  };

  const moveFocus = (d: Date) => {
    pendingFocus.current = true;
    setFocusDate(d);
    if (compareDay(d, view) < 0) setView(d);
    else if (compareDay(d, lastEnd) > 0) setView(addMonths(startOfMonth(d), -(months - 1)));
  };

  const onKey = (e: React.KeyboardEvent, d: Date) => {
    let next: Date;
    switch (e.key) {
      case 'ArrowLeft':
        next = addDays(d, -1);
        break;
      case 'ArrowRight':
        next = addDays(d, 1);
        break;
      case 'ArrowUp':
        next = addDays(d, -7);
        break;
      case 'ArrowDown':
        next = addDays(d, 7);
        break;
      case 'PageUp':
        next = e.shiftKey ? addYears(d, -1) : addMonths(d, -1);
        break;
      case 'PageDown':
        next = e.shiftKey ? addYears(d, 1) : addMonths(d, 1);
        break;
      case 'Home':
        next = startOfWeek(d);
        break;
      case 'End':
        next = endOfWeek(d);
        break;
      default:
        return;
    }
    e.preventDefault();
    moveFocus(next);
  };

  const select = (d: Date) => {
    setFocusDate(d);
    if (!isVisible(d)) setView(d);
    onSelect(d);
  };

  const nav = (delta: number) => {
    const next = addMonths(view, delta);
    setView(next);
    const day = Math.min(activeFocus.getDate(), daysInMonth(next.getFullYear(), next.getMonth()));
    setFocusDate(new Date(next.getFullYear(), next.getMonth(), day));
  };

  const prevDisabled = !!min && compareDay(addDays(view, -1), min) < 0;
  const nextDisabled = !!max && compareDay(startOfMonth(addMonths(view, months)), max) > 0;

  // Hover/focus preview of the range while choosing the end date.
  const choosingEnd = mode === 'range' && !!rangeStart && !rangeEnd;
  const previewEnd = choosingEnd && hover && rangeStart && compareDay(hover, rangeStart) > 0 ? hover : null;
  const end = rangeEnd ?? previewEnd;
  const hasBand = mode === 'range' && !!rangeStart && !!end && !isSameDay(rangeStart, end);

  const getState = (d: Date, inMonth: boolean): DayState => {
    const isStart = mode === 'range' && isSameDay(d, rangeStart);
    const isEnd = mode === 'range' && isSameDay(d, rangeEnd);
    return {
      date: d,
      outside: !inMonth,
      today: isSameDay(d, TODAY),
      selected: mode === 'single' ? isSameDay(d, value) : isStart || isEnd,
      inRange: hasBand && !!rangeStart && !!end && compareDay(d, rangeStart) > 0 && compareDay(d, end) < 0,
      bandStart: hasBand && isStart,
      bandEnd: hasBand && isSameDay(d, end),
      previewEnd: !!previewEnd && isSameDay(d, previewEnd),
      disabledReason: reasonFor(d),
      markers: markers?.(d) ?? null,
      loadingMarkers,
      focusable: inMonth && isSameDay(d, activeFocus),
      autoFocus: autoFocus && inMonth && isSameDay(d, activeFocus),
    };
  };

  const pickMonth = (year: number, month: number) => {
    if (!picker) return;
    const first = new Date(year, month, 1);
    setView(addMonths(first, -picker.index));
    pendingFocus.current = true;
    setFocusDate(new Date(year, month, Math.min(activeFocus.getDate(), daysInMonth(year, month))));
    setPicker(null);
  };

  const monthReason = (year: number, month: number): string | null => {
    if (max && compareDay(new Date(year, month, 1), max) > 0) return "Future months aren't available";
    if (min && compareDay(new Date(year, month + 1, 0), min) < 0) return 'Earlier months aren’t available';
    return null;
  };

  return (
    <div
      ref={rootRef}
      data-part="calendar"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && picker) {
          e.stopPropagation();
          pendingFocus.current = true;
          setPicker(null);
        }
      }}
    >
      <div aria-live="polite" className="sr-only">
        {live}
      </div>
      {picker ? (
        <MonthYearGrid
          year={picker.year}
          onYearChange={(year) => setPicker({ ...picker, year })}
          selected={{ year: visible[picker.index].getFullYear(), month: visible[picker.index].getMonth() }}
          onSelect={pickMonth}
          reasonFor={monthReason}
          minYear={min?.getFullYear()}
          maxYear={max?.getFullYear()}
          touch={touch}
          autoFocus
        />
      ) : (
        <div className={stacked || months === 1 ? 'flex flex-col gap-4' : 'flex gap-5'}>
          {visible.map((m, i) => {
            const labelId = `${uid}-m${i}`;
            const first = i === 0;
            const last = i === months - 1;
            return (
              <div key={dateKey(m)} className={stacked || months === 1 ? '' : 'shrink-0'}>
                <CalendarHeader
                  label={formatMonthLong(m)}
                  labelId={labelId}
                  onPrev={first ? () => nav(-1) : undefined}
                  onNext={(stacked ? first : last) ? () => nav(1) : undefined}
                  prevDisabled={prevDisabled}
                  nextDisabled={nextDisabled}
                  onLabel={() => setPicker({ index: i, year: m.getFullYear() })}
                  touch={touch}
                />
                <CalendarGrid
                  month={m}
                  labelId={labelId}
                  hideOutside={hideOutside}
                  touch={touch}
                  density={density}
                  getState={getState}
                  onSelect={select}
                  onKey={onKey}
                  onHover={setHover}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
