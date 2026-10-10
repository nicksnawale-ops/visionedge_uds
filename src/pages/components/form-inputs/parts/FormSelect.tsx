import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Check, ChevronDown, type LucideIcon } from 'lucide-react';

export interface FormSelectOption<T extends string> {
  value: T;
  label: string;
  /** Optional 12px second line. */
  description?: string;
  /** 16px leading icon (Gray 600, Royal Blue when selected). */
  icon?: LucideIcon;
}

interface FormSelectProps<T extends string> {
  /** id of the existing visible label. */
  labelId: string;
  options: ReadonlyArray<FormSelectOption<T>>;
  value: T | '';
  onChange: (value: T) => void;
  placeholder?: string;
  /** Error from the form's validation: 2px Deep Navy border + alert icon; the message is rendered by the form. */
  invalid?: boolean;
  /** id of the error (or helper) text below the field. */
  describedBy?: string;
  disabled?: boolean;
  readOnly?: boolean;
  /** Called when focus leaves the control (validation on blur). */
  onBlur?: () => void;
  /** Submits the value with the form, like a native select. */
  name?: string;
}

interface Position {
  top: number;
  left: number;
  above: boolean;
}

const MIN_WIDTH = 240;
const GAP = 4;

/**
 * Select-only listbox following the Form Inputs field standard (40px, 8px radius, Gray 400 border).
 * The popover renders in a portal so the form card never clips it; it flips above when there's
 * no room below and closes on outside click, Esc, Tab, selection or container scroll.
 */
export const FormSelect = <T extends string>({
  labelId,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  invalid = false,
  describedBy,
  disabled = false,
  readOnly = false,
  onBlur,
  name,
}: FormSelectProps<T>) => {
  const uid = useId();
  const listId = `${uid}-list`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ query: '', at: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const [width, setWidth] = useState(MIN_WIDTH);
  const [pos, setPos] = useState<Position | null>(null);
  const [shown, setShown] = useState(false);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const current = selectedIndex >= 0 ? options[selectedIndex] : null;
  const inert = disabled || readOnly;

  const openAt = (index: number, viaKeyboard: boolean) => {
    if (inert) return;
    setWidth(Math.max(MIN_WIDTH, triggerRef.current?.offsetWidth ?? MIN_WIDTH));
    setActive(Math.max(0, index));
    setKeyboard(viaKeyboard);
    setPos(null);
    setShown(false);
    setOpen(true);
  };

  const close = (refocus: boolean) => {
    setOpen(false);
    setPos(null);
    setShown(false);
    if (refocus) triggerRef.current?.focus({ preventScroll: true });
  };

  const choose = (index: number) => {
    onChange(options[index].value);
    close(true);
  };

  /** First-letter typeahead: repeated letters cycle, quick typing matches a prefix. */
  const matchTyped = (ch: string, from: number): number => {
    const now = Date.now();
    const t = typeahead.current;
    t.query = now - t.at < 600 ? t.query + ch : ch;
    t.at = now;
    const q = t.query.toLowerCase();
    const start = t.query.length === 1 ? from + 1 : from;
    for (let k = 0; k < options.length; k += 1) {
      const i = (start + k + options.length) % options.length;
      if (options[i].label.toLowerCase().startsWith(q)) return i;
    }
    return -1;
  };

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const trigger = triggerRef.current;
      const list = listRef.current;
      if (!trigger || !list) return;
      const r = trigger.getBoundingClientRect();
      const h = list.offsetHeight;
      const roomBelow = window.innerHeight - r.bottom - GAP - 8;
      const above = h > roomBelow && r.top - GAP - 8 > roomBelow;
      const top = above ? r.top - GAP - h : r.bottom + GAP;
      const w = Math.min(width, window.innerWidth - 16);
      const left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
      setPos((p) => (p && p.top === top && p.left === left && p.above === above ? p : { top, left, above }));
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open, width]);

  const placed = pos !== null;
  useEffect(() => {
    if (!open || !placed) return;
    listRef.current?.focus({ preventScroll: true });
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, [open, placed]);

  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    if (!open || !list || !el) return;
    if (el.offsetTop < list.scrollTop) list.scrollTop = el.offsetTop - 6;
    else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight + 6;
  }, [active, open, placed]);

  useEffect(() => {
    if (!open) return;
    const inside = (t: EventTarget | null) =>
      t instanceof Node && (!!listRef.current?.contains(t) || !!triggerRef.current?.contains(t));
    const onPointer = (e: PointerEvent) => {
      if (!inside(e.target)) {
        close(false);
        onBlur?.();
      }
    };
    const onScroll = (e: Event) => {
      if (e.target instanceof Node && listRef.current?.contains(e.target)) return;
      close(document.activeElement === listRef.current);
    };
    document.addEventListener('pointerdown', onPointer, true);
    document.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('pointerdown', onPointer, true);
      document.removeEventListener('scroll', onScroll, true);
    };
  }, [open, onBlur]);

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (inert) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      openAt(selectedIndex, true);
    } else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const i = matchTyped(e.key, selectedIndex);
      if (i >= 0) openAt(i, true);
    }
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    let next = -1;
    if (e.key === 'ArrowDown') next = Math.min(last, active + 1);
    else if (e.key === 'ArrowUp') next = Math.max(0, active - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(active);
      return;
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close(true);
      return;
    } else if (e.key === 'Tab') {
      // Hand focus back to the trigger; the browser's Tab then moves on from there.
      close(true);
      onBlur?.();
      return;
    } else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      next = matchTyped(e.key, active);
    }
    if (next < 0) return;
    e.preventDefault();
    setKeyboard(true);
    setActive(next);
  };

  const box = disabled
    ? 'bg-[#F7F9FC] border border-[#DDE2EA] text-[#8C95A6] cursor-not-allowed'
    : readOnly
      ? 'bg-[#F7F9FC] border border-transparent text-[#121722] cursor-default'
      : invalid
        ? 'bg-white border-2 border-[#0B2D6B] text-[#121722] focus-visible:ring-[3px] focus-visible:ring-[#1E63FF]/20'
        : open
          ? 'bg-white border border-[#1E63FF] ring-[3px] ring-[#1E63FF]/20 text-[#121722]'
          : 'bg-white border border-[#8C95A6] text-[#121722] hover:border-[#4B5465] focus-visible:border-[#1E63FF] focus-visible:ring-[3px] focus-visible:ring-[#1E63FF]/20';
  const TriggerIcon = current?.icon;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-readonly={readOnly || undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelId} ${uid}-value`}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={(e) => (open ? close(true) : openAt(selectedIndex, e.detail === 0))}
        onKeyDown={onTriggerKeyDown}
        onBlur={(e) => {
          if (!open && !listRef.current?.contains(e.relatedTarget as Node | null)) onBlur?.();
        }}
        className={`w-full h-10 flex items-center gap-2 px-3 rounded-[8px] text-left text-[14px] outline-none transition-colors ${box}`}
      >
        {TriggerIcon && <TriggerIcon className={`w-4 h-4 shrink-0 ${disabled ? 'text-[#8C95A6]' : 'text-[#4B5465]'}`} aria-hidden="true" />}
        <span id={`${uid}-value`} className={`flex-1 min-w-0 truncate ${current ? '' : 'text-[#6B7485]'}`}>
          {current ? current.label : placeholder}
        </span>
        {invalid && <AlertCircle className="w-4 h-4 shrink-0 text-[#0B2D6B]" aria-hidden="true" />}
        {!readOnly && (
          <ChevronDown
            className={`w-4 h-4 shrink-0 ${disabled ? 'text-[#8C95A6]' : 'text-[#4B5465]'} transition-transform duration-150 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        )}
      </button>
      {name && <input type="hidden" name={name} value={value} />}
      {open &&
        createPortal(
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={labelId}
            aria-activedescendant={`${listId}-${active}`}
            onKeyDown={onListKeyDown}
            style={pos ? { top: pos.top, left: pos.left, width: Math.min(width, window.innerWidth - 16) } : { top: 0, left: -9999, width, visibility: 'hidden' }}
            className={`fixed z-50 max-h-[320px] overflow-y-auto p-1.5 rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_4px_12px_rgba(11,45,107,0.12)] outline-none transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none ${
              shown ? 'opacity-100 translate-y-0' : `opacity-0 ${pos?.above ? 'translate-y-1' : '-translate-y-1'}`
            }`}
          >
            {options.map((o, i) => {
              const selected = i === selectedIndex;
              const isActive = i === active;
              const Icon = o.icon;
              return (
                <li
                  key={o.value}
                  id={`${listId}-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={selected}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseMove={() => {
                    if (!isActive || keyboard) {
                      setActive(i);
                      setKeyboard(false);
                    }
                  }}
                  onClick={() => choose(i)}
                  className={`min-h-10 flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] cursor-pointer select-none ${
                    selected ? 'bg-[#1E63FF]/[0.08]' : isActive ? 'bg-[#F7F9FC]' : ''
                  } ${isActive && keyboard ? 'ring-2 ring-inset ring-[#1E63FF]' : ''}`}
                >
                  {Icon && <Icon className={`w-4 h-4 shrink-0 ${selected ? 'text-[#1E63FF]' : 'text-[#4B5465]'}`} aria-hidden="true" />}
                  <span className="flex-1 min-w-0">
                    <span className={`block text-[14px] leading-5 ${selected ? 'text-[#1E63FF] font-medium' : 'text-[#353D4C]'}`}>{o.label}</span>
                    {o.description && <span className="block text-[12px] leading-4 text-[#6B7485]">{o.description}</span>}
                  </span>
                  <Check className={`w-4 h-4 shrink-0 ${selected ? 'text-[#1E63FF]' : 'invisible'}`} aria-hidden="true" />
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </>
  );
};
