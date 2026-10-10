import React, { useId, useRef, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { Calendar } from '../calendar/Calendar';
import { PickerPopover } from '../calendar/PickerPopover';
import { TimeColumn, type TimeOption } from '../calendar/TimeList';
import { useIsCompact, useIsTouch } from '../hooks/useIsCompact';
import { FieldShell, fieldIds } from '../ui/Field';
import { IconButton } from '../ui/IconButton';
import { Segmented } from '../ui/Segmented';
import { BTN_GHOST_SM, BTN_PRIMARY_SM, INPUT } from '../ui/styles';
import { TODAY, compareDay, pad2 } from '../utils/dateMath';
import { TZ_LABEL, TZ_SHORT, formatDate, formatDateTime } from '../utils/formatIST';
import { DATETIME_FORMAT_ERROR, maskDateTime, parseDateTime, toInputDateTime } from '../utils/parseInput';

export interface DateTimeValue {
  date: Date;
  /** Minutes after midnight, IST. */
  minutes: number;
}

interface DateTimePickerProps {
  label: string;
  value: DateTimeValue | null;
  onChange: (value: DateTimeValue | null) => void;
  /** 24-hour by default; 12-hour shows AM/PM. */
  hour12?: boolean;
  /** Minute step in the list (15 by default). */
  step?: number;
  /** Earliest day (e.g. today for scheduling). */
  min?: Date;
  hint?: string;
  className?: string;
}

const MERIDIEM = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' },
] as const;

/** One field ("30 Sep 2026, 14:05") + calendar, hour/minute columns and the IST label. Applies on Apply. */
export const DateTimePicker: React.FC<DateTimePickerProps> = ({ label, value, onChange, hour12 = false, step = 15, min, hint, className = 'w-full max-w-[300px]' }) => {
  const id = useId();
  const ids = fieldIds(id);
  const boxRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const compact = useIsCompact();
  const touch = useIsTouch() || compact;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [draftDate, setDraftDate] = useState<Date>(value?.date ?? TODAY);
  const [draftMin, setDraftMin] = useState<number>(value?.minutes ?? 9 * 60);

  const minReason = (d: Date) => (min && compareDay(d, min) < 0 ? `Choose a date on or after ${formatDate(min)}` : null);

  const openPanel = () => {
    setDraftDate(value?.date ?? TODAY);
    setDraftMin(value?.minutes ?? 9 * 60);
    setOpen(true);
  };
  const close = () => setOpen(false);
  const finish = () => {
    close();
    btnRef.current?.focus({ preventScroll: true });
  };

  const commit = () => {
    if (!editing) return;
    if (!text.trim()) {
      onChange(null);
      setError(null);
      setEditing(false);
      return;
    }
    const parsed = parseDateTime(text);
    if (!parsed) return setError(DATETIME_FORMAT_ERROR);
    const reason = minReason(parsed.date);
    if (reason) return setError(reason);
    onChange(parsed);
    setError(null);
    setEditing(false);
  };

  // Hours: 00–23, or 12, 1–11 with AM/PM. Minutes: steps, plus an off-step current value (e.g. :05).
  const hour = Math.floor(draftMin / 60);
  const minute = draftMin % 60;
  const pm = hour >= 12;
  const hourOptions: TimeOption[] = hour12
    ? Array.from({ length: 12 }, (_, i) => ({ value: i, label: String(i === 0 ? 12 : i) }))
    : Array.from({ length: 24 }, (_, h) => ({ value: h, label: pad2(h) }));
  const minuteValues = Array.from({ length: 60 / step }, (_, i) => i * step);
  if (!minuteValues.includes(minute)) minuteValues.push(minute);
  const minuteOptions: TimeOption[] = minuteValues.sort((a, b) => a - b).map((m) => ({ value: m, label: pad2(m) }));

  const setHour = (h: number) => setDraftMin((hour12 ? (h % 12) + (pm ? 12 : 0) : h) * 60 + minute);

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint ?? `Shown in ${TZ_LABEL}`}
      error={error}
      active={open}
      boxRef={boxRef}
      className={className}
      trailing={
        <>
          <span className="px-1.5 text-[12px] font-medium text-[#4B5465]" aria-hidden="true">
            {TZ_SHORT}
          </span>
          <IconButton
            ref={btnRef}
            icon={CalendarClock}
            label={value ? `Choose date and time, selected ${formatDateTime(value.date, value.minutes, hour12)} ${TZ_SHORT}` : 'Choose date and time'}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => (open ? close() : openPanel())}
          />
        </>
      }
    >
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="DD/MM/YYYY HH:MM"
        value={editing ? text : value ? formatDateTime(value.date, value.minutes, hour12) : ''}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? ids.error : ids.hint}
        onFocus={() => {
          if (editing) return;
          setEditing(true);
          setText(value ? toInputDateTime(value.date, value.minutes) : '');
        }}
        onChange={(e) => {
          setText(maskDateTime(e.target.value, text));
          setError(null);
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
        }}
        className={INPUT}
      />
      <PickerPopover open={open} onClose={close} anchorRef={boxRef} returnFocusRef={btnRef} label="Choose date and time" width={480}>
        <div className={compact ? 'flex flex-col gap-4' : 'flex gap-4'}>
          <div className={compact ? '' : 'w-[280px] shrink-0'}>
            <Calendar value={draftDate} onSelect={setDraftDate} min={min} touch={touch} autoFocus />
          </div>
          <div className={`flex flex-col gap-3 ${compact ? '' : 'pl-4 border-l border-[#DDE2EA]'}`}>
            <div className="flex gap-2 justify-center">
              <TimeColumn label="Hour" options={hourOptions} value={hour12 ? hour % 12 : hour} onChange={setHour} />
              <TimeColumn label="Min" options={minuteOptions} value={minute} onChange={(m) => setDraftMin(hour * 60 + m)} />
            </div>
            {hour12 && (
              <Segmented
                label="AM or PM"
                options={MERIDIEM}
                value={pm ? 'PM' : 'AM'}
                onChange={(v) => setDraftMin(((hour % 12) + (v === 'PM' ? 12 : 0)) * 60 + minute)}
                className="self-center"
              />
            )}
            <p className="text-[12px] leading-4 text-[#4B5465] text-center">{TZ_LABEL}</p>
          </div>
        </div>
        <div data-part="footer" className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-[#DDE2EA]">
          <p className="text-[14px] text-[#353D4C] tabular-nums" aria-live="polite">
            {formatDateTime(draftDate, draftMin, hour12)} {TZ_SHORT}
          </p>
          <div className="flex gap-2">
            <button type="button" className={BTN_GHOST_SM} onClick={finish}>
              Cancel
            </button>
            <button
              type="button"
              className={BTN_PRIMARY_SM}
              onClick={() => {
                onChange({ date: draftDate, minutes: draftMin });
                setEditing(false);
                setError(null);
                finish();
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </PickerPopover>
    </FieldShell>
  );
};
