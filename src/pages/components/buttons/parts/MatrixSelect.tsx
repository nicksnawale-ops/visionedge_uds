import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';

export interface MatrixOption<T extends string> {
  value: T;
  label: string;
  /** 12px second line under the label. */
  description?: string;
  /** Right-aligned mono value, e.g. "40px". */
  meta?: string;
  /** Leading visual (variant swatch); also shown in the trigger. */
  leading?: React.ReactNode;
}

interface MatrixSelectProps<T extends string> {
  /** id of the existing visible label. */
  labelId: string;
  options: ReadonlyArray<MatrixOption<T>>;
  value: T;
  onChange: (value: T) => void;
}

interface Position {
  top: number;
  left: number;
  above: boolean;
}

const MIN_WIDTH = 240;
const GAP = 4;

/**
 * Select-only listbox styled like the date picker popover and the table filter menus.
 * Trigger: button[aria-haspopup=listbox]. Popover: portal, below the trigger (flips above),
 * closes on outside click, Esc, selection or scroll; focus returns to the trigger.
 */
export const MatrixSelect = <T extends string>({ labelId, options, value, onChange }: MatrixSelectProps<T>) => {
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

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const current = options[selectedIndex];

  const openAt = (index: number, viaKeyboard: boolean) => {
    setWidth(Math.max(MIN_WIDTH, triggerRef.current?.offsetWidth ?? MIN_WIDTH));
    setActive(index);
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

  /** Letter typeahead: repeated letters cycle, quick typing matches a prefix. */
  const matchTyped = (ch: string, from: number): number => {
    const now = Date.now();
    const t = typeahead.current;
    t.query = now - t.at < 600 ? t.query + ch : ch;
    t.at = now;
    const q = t.query.toLowerCase();
    const start = t.query.length === 1 ? from + 1 : from;
    for (let k = 0; k < options.length; k += 1) {
      const i = (start + k) % options.length;
      if (options[i].label.toLowerCase().startsWith(q)) return i;
    }
    return -1;
  };

  // Place below the trigger (or above when there is no room), then fade in.
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
      const left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8));
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

  // Keep the active option visible inside the list (without scrolling the page).
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    if (!open || !list || !el) return;
    if (el.offsetTop < list.scrollTop) list.scrollTop = el.offsetTop - 6;
    else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight + 6;
  }, [active, open, placed]);

  // Outside press and container scroll close the popover.
  useEffect(() => {
    if (!open) return;
    const inside = (t: EventTarget | null) =>
      t instanceof Node && (!!listRef.current?.contains(t) || !!triggerRef.current?.contains(t));
    const onPointer = (e: PointerEvent) => {
      if (!inside(e.target)) close(false);
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
  }, [open]);

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
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
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      close(true);
      return;
    } else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      next = matchTyped(e.key, active);
    }
    if (next < 0) return;
    e.preventDefault();
    setKeyboard(true);
    setActive(next);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelId} ${uid}-value`}
        onClick={(e) => (open ? close(true) : openAt(selectedIndex, e.detail === 0))}
        onKeyDown={onTriggerKeyDown}
        className={`w-full h-10 flex items-center gap-2 px-3 bg-white border rounded-[8px] text-left text-[14px] text-[#121722] outline-none transition-colors ${
          open
            ? 'border-[#1E63FF] ring-[3px] ring-[#1E63FF]/20'
            : 'border-[#8C95A6] hover:border-[#4B5465] focus-visible:border-[#1E63FF] focus-visible:ring-[3px] focus-visible:ring-[#1E63FF]/20'
        }`}
      >
        {current.leading}
        <span id={`${uid}-value`} className="flex-1 min-w-0 truncate">
          {current.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-[#4B5465] transition-transform duration-150 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
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
            style={pos ? { top: pos.top, left: pos.left, width } : { top: 0, left: -9999, width, visibility: 'hidden' }}
            className={`fixed z-50 max-h-[320px] overflow-y-auto p-1.5 rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_4px_12px_rgba(11,45,107,0.12)] outline-none transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none ${
              shown ? 'opacity-100 translate-y-0' : `opacity-0 ${pos?.above ? 'translate-y-1' : '-translate-y-1'}`
            }`}
          >
            {options.map((o, i) => {
              const selected = i === selectedIndex;
              const isActive = i === active;
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
                  className={`relative min-h-10 flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] cursor-pointer select-none ${
                    selected ? 'bg-[#1E63FF]/[0.08]' : isActive ? 'bg-[#F7F9FC]' : ''
                  } ${isActive && keyboard ? 'ring-2 ring-inset ring-[#1E63FF]' : ''}`}
                >
                  {o.leading}
                  <span className="flex-1 min-w-0">
                    <span className={`block text-[14px] leading-5 ${selected ? 'text-[#1E63FF] font-medium' : 'text-[#353D4C]'}`}>{o.label}</span>
                    {o.description && <span className="block text-[12px] leading-4 text-[#6B7485]">{o.description}</span>}
                  </span>
                  {o.meta && <span className="shrink-0 font-mono text-[12px] text-[#6B7485]">{o.meta}</span>}
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
