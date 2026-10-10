import React, { useId, useRef, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { MonthYearGrid, type YearMonth } from '../calendar/MonthYearGrid';
import { PickerPopover } from '../calendar/PickerPopover';
import { useIsCompact, useIsTouch } from '../hooks/useIsCompact';
import { FieldShell } from '../ui/Field';
import { FOCUS } from '../ui/styles';
import { TODAY } from '../utils/dateMath';
import { formatMonth, monthName } from '../utils/formatIST';

interface MonthPickerProps {
  label: string;
  value: YearMonth | null;
  onChange: (value: YearMonth) => void;
  /** Disable months after the current one (reports on past data). */
  pastOnly?: boolean;
  minYear?: number;
  hint?: string;
  className?: string;
}

/** "Sep 2026" field; popover with a year header and a 3×4 month grid. */
export const MonthPicker: React.FC<MonthPickerProps> = ({ label, value, onChange, pastOnly = true, minYear = 2024, hint, className = 'w-full max-w-[240px]' }) => {
  const uid = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const compact = useIsCompact();
  const touch = useIsTouch() || compact;
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(value?.year ?? TODAY.getFullYear());

  const reasonFor = (y: number, m: number) =>
    pastOnly && (y > TODAY.getFullYear() || (y === TODAY.getFullYear() && m > TODAY.getMonth())) ? "Future months aren't available" : null;

  const close = () => setOpen(false);

  return (
    <FieldShell id={`${uid}-btn`} label={label} hint={hint} active={open} boxRef={boxRef} className={className} labelAsText>
      <button
        ref={btnRef}
        id={`${uid}-btn`}
        type="button"
        aria-labelledby={`${uid}-btn-label ${uid}-btn`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setYear(value?.year ?? TODAY.getFullYear());
          setOpen((o) => !o);
        }}
        className={`flex-1 h-full flex items-center justify-between gap-2 pl-3 pr-2 rounded-[8px] text-left text-[14px] text-[#121722] tabular-nums ${FOCUS} focus-visible:ring-offset-0`}
      >
        <span className={value ? '' : 'text-[#6B7485]'}>{value ? formatMonth(value.year, value.month) : 'Select month'}</span>
        <CalendarDays className="w-4 h-4 text-[#4B5465]" aria-hidden="true" />
        {value && <span className="sr-only">{`, ${monthName(value.month)} ${value.year}`}</span>}
      </button>
      <PickerPopover open={open} onClose={close} anchorRef={boxRef} returnFocusRef={btnRef} label="Choose month" width={312}>
        <MonthYearGrid
          year={year}
          onYearChange={setYear}
          selected={value}
          onSelect={(y, m) => {
            onChange({ year: y, month: m });
            close();
            btnRef.current?.focus({ preventScroll: true });
          }}
          reasonFor={reasonFor}
          minYear={minYear}
          maxYear={pastOnly ? TODAY.getFullYear() : undefined}
          touch={touch}
          autoFocus
        />
      </PickerPopover>
    </FieldShell>
  );
};
