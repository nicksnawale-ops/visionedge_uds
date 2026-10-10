import React, { useEffect, useId, useRef } from 'react';
import { OVERLINE } from '../ui/styles';

export interface TimeOption {
  value: number;
  label: string;
  disabled?: boolean;
}

/** Scrolls an option to the middle of its list without scrolling the page. */
export const centerOption = (list: HTMLElement | null, option: HTMLElement | null): void => {
  if (!list || !option) return;
  list.scrollTop = option.offsetTop - list.clientHeight / 2 + option.offsetHeight / 2;
};

/** Next enabled index from `from` in direction `dir`, or `from` if none. */
export const stepEnabled = (options: ReadonlyArray<TimeOption>, from: number, dir: 1 | -1): number => {
  for (let i = from + dir; i >= 0 && i < options.length; i += dir) if (!options[i].disabled) return i;
  return from;
};

export const OPTION =
  'h-9 flex items-center justify-center rounded-[6px] text-[14px] tabular-nums cursor-pointer select-none aria-disabled:text-[#C3CAD5] aria-disabled:cursor-not-allowed';

interface TimeColumnProps {
  label: string;
  options: ReadonlyArray<TimeOption>;
  value: number | null;
  onChange: (value: number) => void;
}

/** One scrollable listbox column (hours or minutes). Selection follows the arrow keys. */
export const TimeColumn: React.FC<TimeColumnProps> = ({ label, options, value, onChange }) => {
  const uid = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const index = options.findIndex((o) => o.value === value);

  useEffect(() => {
    centerOption(listRef.current, listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]') ?? null);
  }, [index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = index;
    if (e.key === 'ArrowDown') next = stepEnabled(options, index, 1);
    else if (e.key === 'ArrowUp') next = stepEnabled(options, index < 0 ? options.length : index, -1);
    else if (e.key === 'Home') next = stepEnabled(options, -1, 1);
    else if (e.key === 'End') next = stepEnabled(options, options.length, -1);
    else return;
    e.preventDefault();
    if (next >= 0 && next !== index) onChange(options[next].value);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={OVERLINE} id={`${uid}-l`}>
        {label}
      </span>
      <ul
        ref={listRef}
        role="listbox"
        aria-labelledby={`${uid}-l`}
        tabIndex={0}
        aria-activedescendant={index >= 0 ? `${uid}-o${index}` : undefined}
        onKeyDown={onKeyDown}
        className="relative h-[244px] w-16 overflow-y-auto p-1 rounded-[8px] border border-[#DDE2EA] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
      >
        {options.map((o, i) => {
          const on = i === index;
          return (
            <li
              key={o.value}
              id={`${uid}-o${i}`}
              role="option"
              aria-selected={on}
              aria-disabled={o.disabled || undefined}
              onClick={() => {
                if (!o.disabled) onChange(o.value);
              }}
              className={`${OPTION} ${on ? 'bg-[#1E63FF] text-white font-semibold' : 'text-[#353D4C] hover:bg-[#EEF1F6]'}`}
            >
              {o.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
