import React, { useId, useRef, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Calendar, FUTURE_REASON } from '../calendar/Calendar';
import { PickerPopover } from '../calendar/PickerPopover';
import { useIsCompact, useIsTouch } from '../hooks/useIsCompact';
import { FieldShell, fieldIds, type FieldVisual } from '../ui/Field';
import { IconButton } from '../ui/IconButton';
import { BTN_GHOST_SM, INPUT } from '../ui/styles';
import { TODAY, compareDay } from '../utils/dateMath';
import { formatDate } from '../utils/formatIST';
import { DATE_FORMAT_ERROR, maskDate, parseDate, toInputDate } from '../utils/parseInput';

export interface DatePickerProps {
  label: string;
  value: Date | null;
  onChange: (value: Date | null) => void;
  min?: Date;
  max?: Date;
  maxReason?: string;
  hint?: string;
  disabled?: boolean;
  readOnly?: boolean;
  /** External error (e.g. "End date must be after start date"). */
  error?: string | null;
  force?: FieldVisual;
  /** Pre-typed text (state matrix). */
  defaultText?: string;
  className?: string;
}

/**
 * Single date: shows "30 Sep 2026", accepts typed DD/MM/YYYY (slashes auto-inserted),
 * or pick from a one-month popover with Today / Clear. Selecting a day closes it.
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  maxReason = FUTURE_REASON,
  hint,
  disabled = false,
  readOnly = false,
  error,
  force,
  defaultText,
  className = 'w-full max-w-[280px]',
}) => {
  const id = useId();
  const ids = fieldIds(id);
  const popId = `${id}-pop`;
  const boxRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const compact = useIsCompact();
  const touch = useIsTouch() || compact;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(defaultText !== undefined);
  const [text, setText] = useState(defaultText ?? '');
  const [typedError, setTypedError] = useState<string | null>(null);

  const reasonFor = (d: Date): string | null => {
    if (max && compareDay(d, max) > 0) return maxReason;
    if (min && compareDay(d, min) < 0) return `Choose a date on or after ${formatDate(min)}`;
    return null;
  };

  const shown = editing ? text : value ? formatDate(value) : '';
  const shownError = error ?? typedError;

  const commit = () => {
    if (!editing || defaultText !== undefined) return;
    if (!text.trim()) {
      onChange(null);
      setTypedError(null);
      setEditing(false);
      return;
    }
    const d = parseDate(text);
    if (!d) return setTypedError(DATE_FORMAT_ERROR);
    const reason = reasonFor(d);
    if (reason) return setTypedError(reason);
    onChange(d);
    setTypedError(null);
    setEditing(false);
  };

  const close = () => setOpen(false);
  const choose = (d: Date | null) => {
    onChange(d);
    setTypedError(null);
    setEditing(false);
    close();
    btnRef.current?.focus({ preventScroll: true });
  };

  const describedBy = shownError ? ids.error : hint ? ids.hint : undefined;

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={shownError}
      disabled={disabled}
      readOnly={readOnly}
      active={open}
      force={force}
      boxRef={boxRef}
      className={className}
      trailing={
        !readOnly && (
          <IconButton
            ref={btnRef}
            icon={CalendarDays}
            label={value ? `Choose date, selected ${formatDate(value)}` : 'Choose date'}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? popId : undefined}
            disabled={disabled}
            onClick={() => setOpen((o) => !o)}
          />
        )
      }
    >
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="DD/MM/YYYY"
        value={shown}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={!!shownError || undefined}
        aria-describedby={describedBy}
        onFocus={() => {
          if (readOnly || editing) return;
          setEditing(true);
          setText(value ? toInputDate(value) : '');
        }}
        onChange={(e) => {
          setText(maskDate(e.target.value, text));
          setTypedError(null);
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'ArrowDown' && e.altKey && !readOnly) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={INPUT}
      />
      <PickerPopover open={open} onClose={close} anchorRef={boxRef} returnFocusRef={btnRef} label="Choose date" width={312} id={popId}>
        <Calendar
          value={value}
          onSelect={choose}
          min={min}
          max={max}
          maxReason={maxReason}
          minReason={min ? `Choose a date on or after ${formatDate(min)}` : undefined}
          touch={touch}
          autoFocus
        />
        <div data-part="footer" className="flex items-center justify-between mt-3 pt-3 border-t border-[#DDE2EA]">
          <button type="button" className={BTN_GHOST_SM} disabled={!!reasonFor(TODAY)} onClick={() => choose(TODAY)}>
            Today
          </button>
          <button type="button" className={BTN_GHOST_SM} onClick={() => choose(null)}>
            Clear
          </button>
        </div>
      </PickerPopover>
    </FieldShell>
  );
};
