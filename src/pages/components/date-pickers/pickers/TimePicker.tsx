import React, { useEffect, useId, useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import { PickerPopover } from '../calendar/PickerPopover';
import { OPTION, centerOption, stepEnabled, type TimeOption } from '../calendar/TimeList';
import { useIsCompact } from '../hooks/useIsCompact';
import { FieldShell, fieldIds, type FieldVisual } from '../ui/Field';
import { IconButton } from '../ui/IconButton';
import { INPUT } from '../ui/styles';
import { timeSteps } from '../utils/dateMath';
import { TZ_SHORT, formatTime } from '../utils/formatIST';
import { TIME_FORMAT_ERROR, maskTime, parseTime } from '../utils/parseInput';

export interface TimePickerProps {
  label: string;
  value: number | null;
  onChange: (minutes: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  error?: string | null;
  disabled?: boolean;
  force?: FieldVisual;
  className?: string;
}

export const limitMessage = (min?: number, max?: number): string =>
  min !== undefined && max !== undefined
    ? `Choose a time between ${formatTime(min)} and ${formatTime(max)}`
    : min !== undefined
      ? `Choose a time at or after ${formatTime(min)}`
      : `Choose a time at or before ${formatTime(max ?? 0)}`;

/**
 * Time of day: typed HH:MM (24h) or a list in 15-minute steps that scrolls to the current value.
 * Combobox pattern: focus stays in the input; arrows move through the list, Enter picks, Esc closes.
 */
export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 15,
  hint,
  error,
  disabled = false,
  force,
  className = 'w-full max-w-[200px]',
}) => {
  const id = useId();
  const ids = fieldIds(id);
  const listId = `${id}-list`;
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const compact = useIsCompact();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value !== null ? formatTime(value) : '');
  const [typedError, setTypedError] = useState<string | null>(null);
  const [active, setActive] = useState(-1);

  const options: TimeOption[] = timeSteps(step).map((m) => ({
    value: m,
    label: formatTime(m),
    disabled: (min !== undefined && m < min) || (max !== undefined && m > max),
  }));

  // Keep the text in sync when the value changes from outside.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setText(value !== null ? formatTime(value) : '');
  }

  const nearestIndex = (): number => {
    const target = parseTime(text) ?? value ?? 12 * 60;
    let best = -1;
    options.forEach((o, i) => {
      if (!o.disabled && (best < 0 || Math.abs(o.value - target) < Math.abs(options[best].value - target))) best = i;
    });
    return best;
  };

  const openList = () => {
    setActive(nearestIndex());
    setOpen(true);
  };
  const close = () => setOpen(false);

  useEffect(() => {
    if (open && active >= 0) centerOption(listRef.current, document.getElementById(`${listId}-${active}`));
  }, [open, active, listId]);

  const choose = (i: number) => {
    const o = options[i];
    if (!o || o.disabled) return;
    onChange(o.value);
    setText(o.label);
    setTypedError(null);
    close();
    inputRef.current?.focus({ preventScroll: true });
  };

  const commit = () => {
    if (!text.trim()) {
      setTypedError(null);
      return onChange(null);
    }
    const m = parseTime(text);
    if (m === null) return setTypedError(TIME_FORMAT_ERROR);
    if ((min !== undefined && m < min) || (max !== undefined && m > max)) return setTypedError(limitMessage(min, max));
    setTypedError(null);
    onChange(m);
  };

  const onListKeys = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) return openList();
      setActive((a) => stepEnabled(options, a < 0 && e.key === 'ArrowUp' ? options.length : a, e.key === 'ArrowDown' ? 1 : -1));
    } else if (e.key === 'Home' && open) {
      e.preventDefault();
      setActive(stepEnabled(options, -1, 1));
    } else if (e.key === 'End' && open) {
      e.preventDefault();
      setActive(stepEnabled(options, options.length, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (open && active >= 0) choose(active);
      else commit();
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      e.stopPropagation();
      close();
      inputRef.current?.focus({ preventScroll: true });
    }
  };

  const shownError = error ?? typedError;

  const list = (
    <ul
      ref={listRef}
      id={listId}
      role="listbox"
      aria-label={`${label} options`}
      tabIndex={compact ? 0 : -1}
      data-autofocus={compact || undefined}
      aria-activedescendant={compact && active >= 0 ? `${listId}-${active}` : undefined}
      onKeyDown={compact ? onListKeys : undefined}
      className={`relative overflow-y-auto outline-none ${compact ? 'max-h-[50vh]' : 'max-h-[240px]'}`}
    >
      {options.map((o, i) => {
        const selected = o.value === value;
        return (
          <li
            key={o.value}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={selected}
            aria-disabled={o.disabled || undefined}
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => !o.disabled && setActive(i)}
            onClick={() => choose(i)}
            className={`${OPTION} ${compact ? 'h-11' : ''} ${
              selected ? 'bg-[#1E63FF] text-white font-semibold' : i === active ? 'bg-[#EEF1F6] text-[#121722]' : 'text-[#353D4C]'
            } ${i === active ? 'ring-2 ring-inset ring-[#1E63FF]' : ''}`}
          >
            {o.label}
          </li>
        );
      })}
    </ul>
  );

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={shownError}
      disabled={disabled}
      active={open}
      force={force}
      boxRef={boxRef}
      className={className}
      trailing={
        <>
          <span className="px-1 text-[12px] font-medium text-[#4B5465]" aria-hidden="true">
            {TZ_SHORT}
          </span>
          <IconButton
            icon={Clock}
            label={`Show ${label.toLowerCase()} options`}
            tabIndex={-1}
            disabled={disabled}
            aria-controls={listId}
            aria-expanded={open}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (open) close();
              else openList();
              inputRef.current?.focus({ preventScroll: true });
            }}
          />
        </>
      }
    >
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        inputMode="numeric"
        autoComplete="off"
        placeholder="HH:MM"
        value={text}
        disabled={disabled}
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="none"
        aria-activedescendant={open && !compact && active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={!!shownError || undefined}
        aria-describedby={shownError ? ids.error : hint ? ids.hint : undefined}
        onChange={(e) => {
          const next = maskTime(e.target.value, text);
          setText(next);
          setTypedError(null);
          const m = parseTime(next);
          if (m !== null && open) {
            const i = options.findIndex((o) => o.value === m);
            if (i >= 0) setActive(i);
          }
        }}
        onBlur={() => {
          if (!compact) close();
          commit();
        }}
        onKeyDown={onListKeys}
        className={INPUT}
      />
      <PickerPopover
        open={open}
        onClose={close}
        anchorRef={boxRef}
        returnFocusRef={inputRef}
        label={`${label} options`}
        width={boxRef.current?.offsetWidth ?? 200}
        kind="listbox"
        padding="p-1"
      >
        {list}
      </PickerPopover>
    </FieldShell>
  );
};
