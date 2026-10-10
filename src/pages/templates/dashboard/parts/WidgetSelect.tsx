import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, type LucideIcon } from 'lucide-react';

export interface WidgetSelectOption<T extends string | number> {
  value: T;
  label: string;
  /** Leading marker (status dot or icon), rendered as given. */
  leading?: React.ReactNode;
  /** Right-aligned 12px mono value (e.g. a live count). */
  meta?: string;
  /** Screen-reader text appended to the option, e.g. "12 events". */
  srMeta?: string;
  /** Render the label in JetBrains Mono (numbers). */
  mono?: boolean;
}

interface WidgetSelectProps<T extends string | number> {
  /** Accessible name of the control, e.g. "Filter by status". */
  label: string;
  options: ReadonlyArray<WidgetSelectOption<T>>;
  value: T;
  onChange: (value: T) => void;
  /** 'md' = 40px, min-width 180px (toolbar filter); 'sm' = 36px × 80px (footer). */
  size?: 'md' | 'sm';
  /** Preferred side; flips automatically when there's no room. */
  placement?: 'below' | 'above';
  /** Leading icon in the trigger (e.g. ListFilter). */
  icon?: LucideIcon;
  /** Active filter style: Royal Blue 8% fill, Royal Blue border, text and icon. */
  active?: boolean;
  /** Minimum popover width (defaults to the trigger width). */
  minPopoverWidth?: number;
}

interface Position {
  top: number;
  left: number;
  above: boolean;
}

const GAP = 4;
const EDGE = 8;

/**
 * Dashboard-local select-only listbox, styled like the Buttons / Form Inputs dropdowns.
 * The popover renders in a portal (the card can't clip it), prefers `placement`, flips when needed,
 * and closes on outside click, Esc, Tab, selection or container scroll.
 */
export const WidgetSelect = <T extends string | number>({
  label,
  options,
  value,
  onChange,
  size = 'md',
  placement = 'below',
  icon: Icon,
  active = false,
  minPopoverWidth = 0,
}: WidgetSelectProps<T>) => {
  const uid = useId();
  const listId = `${uid}-list`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ query: '', at: 0 });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const [width, setWidth] = useState(minPopoverWidth);
  const [pos, setPos] = useState<Position | null>(null);
  const [shown, setShown] = useState(false);

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const current = options[selectedIndex];

  const openAt = (index: number, viaKeyboard: boolean) => {
    setWidth(Math.max(minPopoverWidth, triggerRef.current?.offsetWidth ?? 0));
    setActiveIndex(index);
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

  /** Type-ahead: repeated letters cycle, quick typing matches a prefix. */
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

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const trigger = triggerRef.current;
      const list = listRef.current;
      if (!trigger || !list) return;
      const r = trigger.getBoundingClientRect();
      const h = list.offsetHeight;
      const roomBelow = window.innerHeight - r.bottom - GAP - EDGE;
      const roomAbove = r.top - GAP - EDGE;
      const above = placement === 'above' ? h <= roomAbove || roomAbove > roomBelow : h > roomBelow && roomAbove > roomBelow;
      const top = above ? r.top - GAP - h : r.bottom + GAP;
      const w = Math.min(width, window.innerWidth - EDGE * 2);
      // Align to the trigger's left edge; shift left if it would overflow the viewport.
      const left = Math.max(EDGE, Math.min(r.left, window.innerWidth - w - EDGE));
      setPos((p) => (p && p.top === top && p.left === left && p.above === above ? p : { top, left, above }));
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open, width, placement]);

  const placed = pos !== null;
  useEffect(() => {
    if (!open || !placed) return;
    listRef.current?.focus({ preventScroll: true });
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, [open, placed]);

  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    if (!open || !list || !el) return;
    if (el.offsetTop < list.scrollTop) list.scrollTop = el.offsetTop - 6;
    else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight + 6;
  }, [activeIndex, open, placed]);

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
    if (e.key === 'ArrowDown') next = Math.min(last, activeIndex + 1);
    else if (e.key === 'ArrowUp') next = Math.max(0, activeIndex - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(activeIndex);
      return;
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close(true);
      return;
    } else if (e.key === 'Tab') {
      // Focus goes back to the trigger; the browser's Tab then moves on from there.
      close(true);
      return;
    } else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      next = matchTyped(e.key, activeIndex);
    }
    if (next < 0) return;
    e.preventDefault();
    setKeyboard(true);
    setActiveIndex(next);
  };

  const sizeClass =
    size === 'sm'
      ? "relative h-9 w-20 before:absolute before:-inset-y-0.5 before:inset-x-0 before:content-['']"
      : 'h-10 min-w-[180px]';
  const tone = open
    ? 'border-[#1E63FF] ring-[3px] ring-[#1E63FF]/20'
    : `${active ? '' : 'hover:border-[#4B5465]'} focus-visible:border-[#1E63FF] focus-visible:ring-[3px] focus-visible:ring-[#1E63FF]/20`;
  const fill = active ? `bg-[#1E63FF]/[0.08] text-[#1E63FF] ${open ? '' : 'border-[#1E63FF]'}` : `bg-white text-[#121722] ${open ? '' : 'border-[#8C95A6]'}`;
  const iconTone = active ? 'text-[#1E63FF]' : 'text-[#4B5465]';

  return (
    <>
      <span id={`${uid}-label`} className="sr-only">
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${uid}-label ${uid}-value`}
        onClick={(e) => (open ? close(true) : openAt(selectedIndex, e.detail === 0))}
        onKeyDown={onTriggerKeyDown}
        className={`${sizeClass} inline-flex items-center gap-2 px-3 border rounded-[8px] text-left text-[14px] outline-none transition-colors ${fill} ${tone}`}
      >
        {Icon && <Icon className={`w-4 h-4 shrink-0 ${iconTone}`} aria-hidden="true" />}
        <span id={`${uid}-value`} className={`flex-1 min-w-0 truncate ${current.mono ? 'font-mono tabular-nums' : ''} ${active ? 'font-medium' : ''}`}>
          {current.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 ${iconTone} transition-transform duration-150 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
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
            aria-labelledby={`${uid}-label`}
            aria-activedescendant={`${listId}-${activeIndex}`}
            onKeyDown={onListKeyDown}
            style={
              pos
                ? { top: pos.top, left: pos.left, width: Math.min(width, window.innerWidth - EDGE * 2) }
                : { top: 0, left: -9999, width, visibility: 'hidden' }
            }
            className={`fixed z-50 max-h-[320px] overflow-y-auto p-1.5 rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_4px_12px_rgba(11,45,107,0.12)] outline-none transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none ${
              shown ? 'opacity-100 translate-y-0' : `opacity-0 ${pos?.above ? 'translate-y-1' : '-translate-y-1'}`
            }`}
          >
            {options.map((o, i) => {
              const selected = i === selectedIndex;
              const isActive = i === activeIndex;
              return (
                <li
                  key={String(o.value)}
                  id={`${listId}-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={selected}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseMove={() => {
                    if (!isActive || keyboard) {
                      setActiveIndex(i);
                      setKeyboard(false);
                    }
                  }}
                  onClick={() => choose(i)}
                  className={`min-h-10 flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] cursor-pointer select-none ${
                    selected ? 'bg-[#1E63FF]/[0.08]' : isActive ? 'bg-[#F7F9FC]' : ''
                  } ${isActive && keyboard ? 'ring-2 ring-inset ring-[#1E63FF]' : ''}`}
                >
                  {o.leading}
                  <span
                    className={`flex-1 min-w-0 truncate text-[14px] leading-5 ${o.mono ? 'font-mono tabular-nums' : ''} ${
                      selected ? 'text-[#1E63FF] font-medium' : 'text-[#353D4C]'
                    }`}
                  >
                    {o.label}
                    {o.srMeta && <span className="sr-only">, {o.srMeta}</span>}
                  </span>
                  {o.meta && (
                    <span className="shrink-0 font-mono text-[12px] text-[#6B7485] tabular-nums" aria-hidden={o.srMeta ? true : undefined}>
                      {o.meta}
                    </span>
                  )}
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
