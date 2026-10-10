import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, Lock } from 'lucide-react';
import { FieldErrorText, LABEL, OptionalMark, inputBorder } from '../shared/authUi';
import type { SelectOption } from './registerStates';

interface SelectProps {
  id: string;
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  optional?: boolean;
  /** Read-only (e.g. while submitting). */
  readOnly?: boolean;
  /** Pre-filled and locked, with a lock icon (invitation). */
  locked?: boolean;
  buttonRef?: React.Ref<HTMLButtonElement>;
}

/**
 * 40px select (Form Inputs standard) built as a combobox + listbox,
 * so each option can carry a short description under its label.
 * Keyboard: ↑ ↓ Home End to move, Enter / Space to choose, Esc to close, letters to jump.
 */
export const Select: React.FC<SelectProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  optional,
  readOnly = false,
  locked = false,
  buttonRef,
}) => {
  const uid = useId();
  const labelId = `${id}-label`;
  const listId = `${id}-listbox`;
  const errorId = `${id}-error`;
  const optionId = (i: number) => `${uid}-option-${i}`;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;
  const interactive = !readOnly && !locked;

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Keep the active option in view.
  useEffect(() => {
    if (open) listRef.current?.querySelector(`#${CSS.escape(optionId(active))}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active]); // optionId only depends on the stable useId value

  const openList = () => {
    if (!interactive) return;
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const choose = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!interactive) return;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    const last = options.length - 1;
    if (e.key === 'ArrowDown') setActive((a) => Math.min(last, a + 1));
    else if (e.key === 'ArrowUp') setActive((a) => Math.max(0, a - 1));
    else if (e.key === 'Home') setActive(0);
    else if (e.key === 'End') setActive(last);
    else if (e.key === 'Enter' || e.key === ' ') choose(active);
    else if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'Tab') {
      setOpen(false);
      return;
    } else if (e.key.length === 1) {
      const match = options.findIndex((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase()));
      if (match >= 0) setActive(match);
      return;
    } else return;
    e.preventDefault();
  };

  const surface = locked || readOnly ? 'bg-[#F7F9FC]' : 'bg-white';

  return (
    <div ref={rootRef} className="relative">
      <span id={labelId} className={LABEL}>
        {label}
        {optional && <OptionalMark />}
      </span>
      <button
        id={id}
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${id}`}
        aria-describedby={errorId}
        aria-invalid={error ? true : undefined}
        aria-readonly={!interactive || undefined}
        aria-activedescendant={open ? optionId(active) : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`relative w-full h-10 rounded-[8px] pl-3 pr-10 text-left ${surface} ${inputBorder(Boolean(error))} text-[16px] @min-[640px]:text-[14px] transition-all focus:outline-none focus:ring-[3px] focus:ring-[#1E63FF]/20 ${
          interactive ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        <span className={`block truncate ${selected ? 'text-[#121722]' : 'text-[#6B7485]'}`}>
          {selected ? selected.label : placeholder}
        </span>
        {locked ? (
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7485]" aria-hidden="true" />
        ) : (
          <ChevronDown
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#4B5465] transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        )}
      </button>

      <ul
        id={listId}
        ref={listRef}
        role="listbox"
        aria-labelledby={labelId}
        hidden={!open}
        className="absolute z-30 left-0 right-0 mt-1 max-h-64 overflow-y-auto py-1 rounded-[8px] bg-white border border-[#DDE2EA] shadow-[0_4px_12px_rgba(11,45,107,0.12)]"
      >
        {options.map((o, i) => {
          const isSelected = o.value === value;
          return (
            <li
              key={o.value}
              id={optionId(i)}
              role="option"
              aria-selected={isSelected}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={`flex items-start gap-2 px-3 py-2 min-h-[44px] cursor-pointer ${i === active ? 'bg-[#F7F9FC]' : ''}`}
            >
              <span className="flex-1 min-w-0">
                <span className={`block text-[14px] leading-[20px] ${isSelected ? 'font-medium text-[#1E63FF]' : 'text-[#121722]'}`}>
                  {o.label}
                </span>
                {o.description && <span className="block text-[12px] leading-[16px] text-[#4B5465]">{o.description}</span>}
              </span>
              {isSelected && <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#1E63FF]" aria-hidden="true" />}
            </li>
          );
        })}
      </ul>

      <div id={errorId} aria-live="polite">
        {error && <FieldErrorText>{error}</FieldErrorText>}
      </div>
    </div>
  );
};
