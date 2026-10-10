import React, { useId, useRef, useState } from 'react';
import { AlertCircle, CalendarRange, ChevronDown } from 'lucide-react';
import { Calendar, FUTURE_REASON } from '../calendar/Calendar';
import { PickerPopover } from '../calendar/PickerPopover';
import { PRESETS, Presets, matchPreset, type DateRange, type PresetId } from '../calendar/Presets';
import { useIsCompact, useIsTouch } from '../hooks/useIsCompact';
import { FieldShell, fieldIds } from '../ui/Field';
import { BTN_GHOST_SM, BTN_PRIMARY_SM, FOCUS, INPUT, LABEL } from '../ui/styles';
import { TODAY, addMonths, compareDay, diffDays, endOfMonth, startOfMonth } from '../utils/dateMath';
import { formatDate, formatRange } from '../utils/formatIST';
import { DATE_FORMAT_ERROR, maskDate, parseDate, toInputDate } from '../utils/parseInput';

export const END_BEFORE_START = 'End date must be after start date';
export const rangeLimitMessage = (maxDays: number) => `Choose a range of ${maxDays} days or less`;

interface RangeDraft {
  start: Date | null;
  end: Date | null;
}

interface RangePanelProps {
  initial: RangeDraft;
  /** Longest allowed range in days (default 90). */
  maxDays?: number;
  min?: Date;
  /** Latest selectable day (TODAY for history/log filters). */
  max?: Date;
  compact: boolean;
  touch: boolean;
  initialView?: Date;
  onApply: (range: DateRange) => void;
  onCancel: () => void;
}

/** View that shows the end month on the right. */
const viewFor = (d: Date) => addMonths(startOfMonth(d), -1);

/** Presets + typed start/end + two months + summary footer. The range applies only on Apply. */
export const RangePanel: React.FC<RangePanelProps> = ({ initial, maxDays = 90, min, max = TODAY, compact, touch, initialView, onApply, onCancel }) => {
  const uid = useId();
  const [start, setStart] = useState<Date | null>(initial.start);
  const [end, setEnd] = useState<Date | null>(initial.end);
  const [preset, setPreset] = useState<PresetId>(() => matchPreset(initial.start, initial.end));
  const [view, setView] = useState<Date>(() => initialView ?? viewFor(initial.end ?? TODAY));
  const [startText, setStartText] = useState(initial.start ? toInputDate(initial.start) : '');
  const [endText, setEndText] = useState(initial.end ? toInputDate(initial.end) : '');
  const [startErr, setStartErr] = useState<string | null>(null);
  const [endErr, setEndErr] = useState<string | null>(null);

  const limit = rangeLimitMessage(maxDays);
  const setDraft = (s: Date | null, e: Date | null) => {
    setStart(s);
    setEnd(e);
    setStartText(s ? toInputDate(s) : '');
    setEndText(e ? toInputDate(e) : '');
    setStartErr(null);
    setEndErr(null);
  };

  const ensureVisible = (d: Date) => {
    if (compareDay(d, view) < 0 || compareDay(d, endOfMonth(addMonths(view, 1))) > 0) setView(viewFor(d));
  };

  const pickDay = (d: Date) => {
    setPreset('custom');
    if (!start || end || compareDay(d, start) < 0) setDraft(d, null);
    else setDraft(start, d);
  };

  const pickPreset = (id: PresetId) => {
    setPreset(id);
    const r = PRESETS.find((p) => p.id === id)?.range?.();
    if (!r) return;
    setDraft(r.start, r.end);
    setView(viewFor(r.end));
  };

  const validate = (d: Date | null, text: string): string | null => {
    if (!text.trim()) return null;
    if (!d) return DATE_FORMAT_ERROR;
    if (compareDay(d, max) > 0) return FUTURE_REASON;
    if (min && compareDay(d, min) < 0) return `Choose a date on or after ${formatDate(min)}`;
    return null;
  };

  const commitStart = () => {
    const d = parseDate(startText);
    const err = validate(d, startText);
    setStartErr(err);
    if (err) return;
    setPreset('custom');
    setStart(d);
    if (d) {
      setStartText(toInputDate(d));
      ensureVisible(d);
      if (end) setEndErr(compareDay(end, d) < 0 ? END_BEFORE_START : null);
    }
  };
  const commitEnd = () => {
    const d = parseDate(endText);
    let err = validate(d, endText);
    if (!err && d && start && compareDay(d, start) < 0) err = END_BEFORE_START;
    setEndErr(err);
    if (err) return;
    setPreset('custom');
    setEnd(d);
    if (d) {
      setEndText(toInputDate(d));
      ensureVisible(d);
    }
  };

  const days = start && end ? diffDays(start, end) + 1 : 0;
  const tooLong = days > maxDays;
  const canApply = !!start && !!end && days > 0 && !tooLong && !startErr && !endErr;
  const summary = start && end ? (days > 0 ? `${days} day${days === 1 ? '' : 's'} selected` : '') : start ? 'Select an end date' : 'Select a start date';

  // While choosing the end date, days beyond the limit are disabled with the reason.
  const limitReason = (d: Date) => (start && !end && diffDays(start, d) >= maxDays ? limit : null);

  const typed = (which: 'start' | 'end') => {
    const isStart = which === 'start';
    const id = `${uid}-${which}`;
    const err = isStart ? startErr : endErr;
    return (
      <FieldShell id={id} label={isStart ? 'Start date' : 'End date'} error={err}>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="DD/MM/YYYY"
          value={isStart ? startText : endText}
          aria-invalid={!!err || undefined}
          aria-describedby={err ? fieldIds(id).error : undefined}
          onChange={(e) => {
            if (isStart) {
              setStartText(maskDate(e.target.value, startText));
              setStartErr(null);
            } else {
              setEndText(maskDate(e.target.value, endText));
              setEndErr(null);
            }
          }}
          onBlur={isStart ? commitStart : commitEnd}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (isStart ? commitStart : commitEnd)();
          }}
          className={INPUT}
        />
      </FieldShell>
    );
  };

  const footer = (
    <div
      data-part="footer"
      className={`flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#DDE2EA] ${compact ? 'sticky bottom-0 bg-white pb-1' : ''}`}
    >
      <div aria-live="polite" className="min-w-0">
        {tooLong ? (
          <p className="flex items-center gap-1.5 text-[14px] font-medium text-[#0B2D6B]">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            {limit}
          </p>
        ) : (
          <p className="text-[14px] text-[#4B5465] tabular-nums">{summary}</p>
        )}
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <button type="button" className={BTN_GHOST_SM} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className={BTN_PRIMARY_SM} disabled={!canApply} onClick={() => start && end && onApply({ start, end })}>
          Apply
        </button>
      </div>
    </div>
  );

  const calendar = (
    <Calendar
      mode="range"
      rangeStart={start}
      rangeEnd={end}
      onSelect={pickDay}
      months={2}
      stacked={compact}
      max={max}
      min={min}
      disabledReason={limitReason}
      touch={touch}
      density="narrow"
      hideOutside
      view={view}
      onViewChange={setView}
    />
  );

  if (compact)
    return (
      <div className="flex flex-col gap-4">
        <Presets layout="chips" active={preset} onPick={pickPreset} />
        <div className="grid grid-cols-2 gap-3">
          {typed('start')}
          {typed('end')}
        </div>
        {calendar}
        {footer}
      </div>
    );

  return (
    <div className="flex">
      <Presets layout="list" active={preset} onPick={pickPreset} />
      <div className="flex-1 min-w-0 p-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-5">
          {typed('start')}
          {typed('end')}
        </div>
        {calendar}
        {footer}
      </div>
    </div>
  );
};

interface DateRangePickerProps {
  label: string;
  value: DateRange;
  onChange: (value: DateRange) => void;
  maxDays?: number;
  max?: Date;
  min?: Date;
  disabled?: boolean;
  className?: string;
}

/** Trigger button "01 Sep – 30 Sep 2026" + the range popover (~716px, bottom sheet on mobile). */
export const DateRangePicker: React.FC<DateRangePickerProps> = ({ label, value, onChange, maxDays = 90, max = TODAY, min, disabled = false, className = '' }) => {
  const uid = useId();
  const btnRef = useRef<HTMLButtonElement>(null);
  const compact = useIsCompact();
  const touch = useIsTouch() || compact;
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const finish = () => {
    close();
    btnRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span id={`${uid}-label`} className={LABEL}>
        {label}
      </span>
      <button
        ref={btnRef}
        id={`${uid}-btn`}
        type="button"
        data-part="trigger"
        disabled={disabled}
        aria-labelledby={`${uid}-label ${uid}-btn`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? `${uid}-pop` : undefined}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-2 h-10 pl-3 pr-2 rounded-[8px] border bg-white text-[14px] font-medium text-[#121722] tabular-nums transition-colors disabled:bg-[#EEF1F6] disabled:border-[#C3CAD5] disabled:text-[#8C95A6] disabled:cursor-not-allowed ${FOCUS} ${
          open ? 'border-[#1E63FF] ring-2 ring-[#1E63FF]/20' : 'border-[#8C95A6] hover:border-[#4B5465]'
        }`}
      >
        <CalendarRange className="w-4 h-4 text-[#4B5465]" aria-hidden="true" />
        <span className="whitespace-nowrap">{formatRange(value.start, value.end)}</span>
        <ChevronDown className={`w-4 h-4 text-[#4B5465] transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <PickerPopover
        open={open}
        onClose={close}
        anchorRef={btnRef}
        returnFocusRef={btnRef}
        label="Choose date range"
        width={716}
        id={`${uid}-pop`}
        padding="p-0"
      >
        <RangePanel
          initial={value}
          maxDays={maxDays}
          max={max}
          min={min}
          compact={compact}
          touch={touch}
          onApply={(r) => {
            onChange(r);
            finish();
          }}
          onCancel={finish}
        />
      </PickerPopover>
    </div>
  );
};
