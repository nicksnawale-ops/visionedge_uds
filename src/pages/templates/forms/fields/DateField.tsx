import React, { useEffect, useId, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTHS, formatDate } from '../data/sampleRecord';
import { BARE_INPUT, BaseFieldProps, FieldShell, describedBy, segmented } from './FieldShell';

interface DateFieldProps extends BaseFieldProps {
  /** ISO date "2026-09-30" or "". */
  value: string;
  onChange: (iso: string) => void;
  /** Earliest selectable ISO date. */
  min?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = (s: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
};
/** Demo "today" so the calendar is deterministic. */
const TODAY = new Date(2026, 8, 30);

/** Accepts "30 Sep 2026", "30/09/2026" or "30-09-2026". */
const parse = (text: string): string | null => {
  const t = text.trim();
  let m = /^(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})$/.exec(t);
  if (m) {
    const mi = MONTHS.findIndex((x) => x.toLowerCase() === m![2].toLowerCase());
    if (mi >= 0) return check(Number(m[3]), mi, Number(m[1]));
  }
  m = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(t);
  if (m) return check(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  return null;
};
const check = (y: number, mi: number, d: number): string | null => {
  const date = new Date(y, mi, d);
  return date.getMonth() === mi && date.getDate() === d ? iso(date) : null;
};

/**
 * Date: type "30 Sep 2026" (or 30/09/2026) or pick from the calendar. The calendar is a grid:
 * arrows move by day/week, Page Up/Down by month, Home/End to the week's ends, Enter picks, Esc closes.
 */
export const DateField: React.FC<DateFieldProps> = ({ id, label, optional, helper = 'For example, 30 Sep 2026.', error, disabled, readOnly, onBlur, value, onChange, min }) => {
  const gridId = useId();
  const [text, setText] = useState(formatDate(value));
  const [typedError, setTypedError] = useState('');
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState<Date>(fromIso(value) ?? TODAY);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => setText(formatDate(value)), [value]);

  useEffect(() => {
    if (!open) return;
    gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
  }, [open, focus]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const pick = (d: Date) => {
    if (min && iso(d) < min) return;
    onChange(iso(d));
    setTypedError('');
    setOpen(false);
    buttonRef.current?.focus();
    onBlur?.();
  };

  const move = (days: number, months = 0) => setFocus((f) => new Date(f.getFullYear(), f.getMonth() + months, f.getDate() + days));

  const onGridKey = (e: React.KeyboardEvent) => {
    const k = e.key;
    if (k === 'ArrowLeft') move(-1);
    else if (k === 'ArrowRight') move(1);
    else if (k === 'ArrowUp') move(-7);
    else if (k === 'ArrowDown') move(7);
    else if (k === 'PageUp') move(0, -1);
    else if (k === 'PageDown') move(0, 1);
    else if (k === 'Home') move(-((focus.getDay() + 6) % 7));
    else if (k === 'End') move(6 - ((focus.getDay() + 6) % 7));
    else if (k === 'Enter' || k === ' ') pick(focus);
    else if (k === 'Escape') {
      setOpen(false);
      buttonRef.current?.focus();
    } else return;
    e.preventDefault();
  };

  // Monday-first month grid.
  const first = new Date(focus.getFullYear(), focus.getMonth(), 1);
  const start = new Date(first);
  start.setDate(1 - ((first.getDay() + 6) % 7));
  const days = Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  const shownError = error ?? (typedError || undefined);

  return (
    <FieldShell id={id} label={label} optional={optional} helper={helper} error={shownError}>
      <div ref={rootRef} className="relative">
        <div className={segmented({ error: shownError, disabled, readOnly })}>
          <input
            id={id}
            value={text}
            placeholder="DD MMM YYYY"
            disabled={disabled}
            readOnly={readOnly}
            autoComplete="off"
            aria-invalid={shownError ? true : undefined}
            aria-describedby={describedBy(id, helper, shownError)}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => {
              if (!text.trim()) {
                onChange('');
                setTypedError('');
              } else {
                const parsed = parse(text);
                if (parsed) {
                  onChange(parsed);
                  setText(formatDate(parsed));
                  setTypedError('');
                } else setTypedError('Enter a date like 30 Sep 2026');
              }
              onBlur?.();
            }}
            className={BARE_INPUT}
          />
          <button
            ref={buttonRef}
            type="button"
            disabled={disabled || readOnly}
            aria-label={`Choose ${label.toLowerCase()} from a calendar`}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => {
              setFocus(fromIso(value) ?? TODAY);
              setOpen((o) => !o);
            }}
            className="w-11 shrink-0 flex items-center justify-center border-l border-[#DDE2EA] text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E63FF] disabled:cursor-not-allowed disabled:text-[#8C95A6]"
          >
            <CalendarDays className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {open && (
          <div
            role="dialog"
            aria-label={`${label} calendar`}
            onBlur={(e) => {
              if (!rootRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
            }}
            className="absolute z-40 mt-2 right-0 w-[296px] rounded-[8px] bg-white border border-[#DDE2EA] shadow-[0_4px_12px_rgba(11,45,107,0.12)] p-3">
            <div className="flex items-center justify-between mb-2">
              <button type="button" onClick={() => move(0, -1)} aria-label="Previous month" className="w-11 h-11 rounded-[8px] flex items-center justify-center text-[#4B5465] hover:bg-[#EEF1F6] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]">
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <p id={`${gridId}-title`} className="text-[14px] font-semibold text-[#121722]" aria-live="polite">
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][focus.getMonth()]} {focus.getFullYear()}
              </p>
              <button type="button" onClick={() => move(0, 1)} aria-label="Next month" className="w-11 h-11 rounded-[8px] flex items-center justify-center text-[#4B5465] hover:bg-[#EEF1F6] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]">
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <div ref={gridRef} role="grid" aria-labelledby={`${gridId}-title`} onKeyDown={onGridKey}>
              <div role="row" className="grid grid-cols-7">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                  <span key={d} role="columnheader" className="h-8 flex items-center justify-center text-[11px] font-medium text-[#6B7485]">
                    {d}
                  </span>
                ))}
              </div>
              {[0, 1, 2, 3, 4, 5].map((w) => (
                <div key={w} role="row" className="grid grid-cols-7">
                  {days.slice(w * 7, w * 7 + 7).map((d) => {
                    const key = iso(d);
                    const selected = key === value;
                    const focused = key === iso(focus);
                    const outside = d.getMonth() !== focus.getMonth();
                    const blocked = Boolean(min && key < min);
                    const isToday = key === iso(TODAY);
                    return (
                      <span key={key} role="gridcell" aria-selected={selected}>
                        <button
                          type="button"
                          tabIndex={focused ? 0 : -1}
                          disabled={blocked}
                          aria-label={`${formatDate(key)}${isToday ? ', today' : ''}`}
                          onClick={() => pick(d)}
                          className={`w-full h-10 rounded-[8px] text-[13px] tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] disabled:text-[#C3CAD5] disabled:cursor-not-allowed ${
                            selected ? 'bg-[#1E63FF] text-white font-semibold' : outside ? 'text-[#8C95A6] hover:bg-[#F7F9FC]' : 'text-[#121722] hover:bg-[#F7F9FC]'
                          } ${isToday && !selected ? 'ring-1 ring-inset ring-[#1E63FF]' : ''}`}
                        >
                          {d.getDate()}
                        </button>
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </FieldShell>
  );
};
