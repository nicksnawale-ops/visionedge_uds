import React, { useRef } from 'react';
import { FOCUS } from './styles';

interface SegmentedProps<T extends string> {
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/** Segmented control (radiogroup): arrow keys move and select. */
export const Segmented = <T extends string>({ label, options, value, onChange, className = '' }: SegmentedProps<T>) => {
  const ref = useRef<HTMLDivElement>(null);
  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = options.findIndex((o) => o.value === value);
    let n = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % options.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + options.length) % options.length;
    else return;
    e.preventDefault();
    onChange(options[n].value);
    ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[n]?.focus();
  };
  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`inline-flex p-0.5 bg-[#EEF1F6] rounded-[8px] border border-[#DDE2EA] ${className}`}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={`h-7 max-md:h-10 px-3 rounded-[6px] text-[13px] whitespace-nowrap transition-colors ${FOCUS} ${
              on ? 'bg-white text-[#121722] font-semibold shadow-[0_1px_3px_rgba(11,45,107,0.08)]' : 'text-[#4B5465] font-medium hover:text-[#121722]'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
};
