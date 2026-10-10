import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, type LucideIcon } from 'lucide-react';
import { useSurface } from '../surface/ControlRoomSurface';

export interface LiveSelectOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  /** Right-aligned 12px mono value, e.g. "7/8 online" or "9 cameras". */
  meta?: string;
  /** 16px leading icon (Gray 600, Royal Blue when selected). */
  icon?: LucideIcon;
  /** 8px status dot colour class instead of an icon. */
  dot?: string;
  /** Screen-reader text for the dot / meta, e.g. "all cameras online". */
  srText?: string;
  /** Overline group heading this option belongs to. */
  group?: string;
  disabled?: boolean;
}

interface LiveSelectProps<T extends string> {
  /** Accessible name: "Site", "Camera group", "Detection type". */
  label: string;
  options: ReadonlyArray<LiveSelectOption<T>>;
  value: T;
  onChange: (value: T) => void;
  icon: LucideIcon;
  /** 'md' = 40px toolbar; 'sm' = 32px panel filter. */
  size?: 'md' | 'sm';
  /** Width classes for the trigger, e.g. "min-w-[180px]". */
  className?: string;
  /** Active filter style (a value other than the default is applied). */
  active?: boolean;
  /** Align the popover to the trigger's start or end edge. */
  align?: 'start' | 'end';
  popoverMinWidth?: number;
}

interface Position {
  top: number;
  left: number;
  above: boolean;
}

const GAP = 4;
const EDGE = 8;

/**
 * Live View select (listbox). The popover renders inside the Live View root (`[data-surface]`) with
 * coordinates converted to the root's own scale, so it is never clipped by the toolbar, wall or panel,
 * scales with the showcase frame, and sits above the tiles (z-[45]) but below modals (z-50).
 */
export const LiveSelect = <T extends string>({
  label,
  options,
  value,
  onChange,
  icon: Icon,
  size = 'md',
  className = '',
  active = false,
  align = 'start',
  popoverMinWidth = 0,
}: LiveSelectProps<T>) => {
  const t = useSurface();
  const dark = t.surface === 'control';
  const uid = useId();
  const listId = `${uid}-list`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typeahead = useRef({ query: '', at: 0 });
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const [width, setWidth] = useState(popoverMinWidth);
  const [pos, setPos] = useState<Position | null>(null);
  const [shown, setShown] = useState(false);

  const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const current = options[selectedIndex];

  const openAt = (index: number, viaKeyboard: boolean) => {
    const root = triggerRef.current?.closest<HTMLElement>('[data-surface]') ?? document.body;
    setHost(root);
    setWidth(Math.max(popoverMinWidth, triggerRef.current?.offsetWidth ?? 0));
    setActiveIndex(enabled.includes(index) ? index : (enabled[0] ?? 0));
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
    if (options[index]?.disabled) return;
    onChange(options[index].value);
    close(true);
  };

  /** Type-ahead over enabled options: repeated letters cycle, quick typing matches a prefix. */
  const matchTyped = (ch: string, from: number): number => {
    const now = Date.now();
    const ta = typeahead.current;
    ta.query = now - ta.at < 600 ? ta.query + ch : ch;
    ta.at = now;
    const q = ta.query.toLowerCase();
    const start = ta.query.length === 1 ? from + 1 : from;
    for (let k = 0; k < options.length; k += 1) {
      const i = (start + k) % options.length;
      if (!options[i].disabled && options[i].label.toLowerCase().startsWith(q)) return i;
    }
    return -1;
  };

  // Position in the host's coordinate space (the showcase may scale the screen with a transform).
  useLayoutEffect(() => {
    if (!open || !host) return;
    const place = () => {
      const trigger = triggerRef.current;
      const list = listRef.current;
      if (!trigger || !list) return;
      const hr = host.getBoundingClientRect();
      const scale = host.offsetWidth ? hr.width / host.offsetWidth : 1;
      const r = trigger.getBoundingClientRect();
      const h = list.offsetHeight;
      const visibleBottom = Math.min(hr.bottom, window.innerHeight);
      const visibleTop = Math.max(hr.top, 0);
      const roomBelow = (visibleBottom - r.bottom) / scale - GAP - EDGE;
      const roomAbove = (r.top - visibleTop) / scale - GAP - EDGE;
      const above = h > roomBelow && roomAbove > roomBelow;
      const trigTop = (r.top - hr.top) / scale + host.scrollTop;
      const trigBottom = (r.bottom - hr.top) / scale + host.scrollTop;
      const top = above ? trigTop - GAP - h : trigBottom + GAP;
      const w = Math.min(width, host.offsetWidth - EDGE * 2);
      const anchor = align === 'end' ? (r.right - hr.left) / scale - w : (r.left - hr.left) / scale;
      const left = Math.max(EDGE, Math.min(anchor, host.offsetWidth - w - EDGE));
      setPos((p) => (p && p.top === top && p.left === left && p.above === above ? p : { top, left, above }));
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open, host, width, align]);

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
    const top = el.offsetTop;
    if (top < list.scrollTop) list.scrollTop = top - 6;
    else if (top + el.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = top + el.offsetHeight - list.clientHeight + 6;
  }, [activeIndex, open, placed]);

  useEffect(() => {
    if (!open) return;
    const inside = (target: EventTarget | null) =>
      target instanceof Node && (!!listRef.current?.contains(target) || !!triggerRef.current?.contains(target));
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

  const step = (from: number, dir: 1 | -1): number => {
    const at = enabled.indexOf(from);
    if (at < 0) return enabled[dir === 1 ? 0 : enabled.length - 1] ?? from;
    return enabled[Math.max(0, Math.min(enabled.length - 1, at + dir))];
  };

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
    let next = -1;
    if (e.key === 'ArrowDown') next = step(activeIndex, 1);
    else if (e.key === 'ArrowUp') next = step(activeIndex, -1);
    else if (e.key === 'Home') next = enabled[0] ?? -1;
    else if (e.key === 'End') next = enabled[enabled.length - 1] ?? -1;
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
      // Focus returns to the trigger; the browser's Tab then moves on from there.
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

  // Trigger: light style everywhere; on the Control room toolbar/panel it follows the dark inputs.
  const sizeClass = size === 'sm' ? 'h-8 text-[13px]' : 'h-10 text-[14px]';
  const look = dark
    ? active
      ? 'bg-[#00C6FF]/10 border-[#00C6FF] text-[#00C6FF]'
      : `bg-[#1F2633] border-white/15 text-white ${open ? '' : 'hover:border-white/40'}`
    : active
      ? 'bg-[#1E63FF]/[0.08] border-[#1E63FF] text-[#1E63FF]'
      : `bg-white border-[#8C95A6] text-[#121722] ${open ? '' : 'hover:border-[#4B5465]'}`;
  const ring = dark
    ? open
      ? 'border-[#00C6FF] ring-[3px] ring-[#00C6FF]/30'
      : 'focus-visible:border-[#00C6FF] focus-visible:ring-[3px] focus-visible:ring-[#00C6FF]/30'
    : open
      ? 'border-[#1E63FF] ring-[3px] ring-[#1E63FF]/20'
      : 'focus-visible:border-[#1E63FF] focus-visible:ring-[3px] focus-visible:ring-[#1E63FF]/20';
  const iconTone = active ? '' : dark ? 'text-[#C3CAD5]' : 'text-[#4B5465]';

  // Group consecutive options under their heading.
  const groups: { name?: string; items: number[] }[] = [];
  options.forEach((o, i) => {
    const last = groups[groups.length - 1];
    if (last && last.name === o.group) last.items.push(i);
    else groups.push({ name: o.group, items: [i] });
  });

  const renderOption = (i: number) => {
    const o = options[i];
    const selected = i === selectedIndex;
    const isActive = i === activeIndex;
    const OptIcon = o.icon;
    return (
      <div
        key={o.value}
        id={`${listId}-${i}`}
        data-index={i}
        role="option"
        aria-selected={selected}
        aria-disabled={o.disabled || undefined}
        onMouseDown={(e) => e.preventDefault()}
        onMouseMove={() => {
          if (!o.disabled && (!isActive || keyboard)) {
            setActiveIndex(i);
            setKeyboard(false);
          }
        }}
        onClick={() => choose(i)}
        className={`min-h-10 flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] select-none ${o.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${
          selected ? 'bg-[#1E63FF]/[0.08]' : isActive && !o.disabled ? 'bg-[#F7F9FC]' : ''
        } ${isActive && keyboard ? 'ring-2 ring-inset ring-[#1E63FF]' : ''}`}
      >
        {OptIcon ? (
          <OptIcon className={`w-4 h-4 shrink-0 ${selected ? 'text-[#1E63FF]' : 'text-[#4B5465]'}`} aria-hidden="true" />
        ) : o.dot ? (
          <span className="w-4 h-4 shrink-0 flex items-center justify-center" aria-hidden="true">
            <span className={`w-2 h-2 rounded-full ${o.dot}`} />
          </span>
        ) : null}
        <span className="flex-1 min-w-0">
          <span className={`block truncate text-[14px] leading-5 ${selected ? 'text-[#1E63FF] font-medium' : 'text-[#353D4C]'}`}>
            {o.label}
            {o.srText && <span className="sr-only">, {o.srText}</span>}
          </span>
          {o.description && <span className="block text-[12px] leading-4 text-[#6B7485]">{o.description}</span>}
        </span>
        {o.meta && <span className="shrink-0 font-mono text-[12px] text-[#6B7485] tabular-nums">{o.meta}</span>}
        <Check className={`w-4 h-4 shrink-0 ${selected ? 'text-[#1E63FF]' : 'invisible'}`} aria-hidden="true" />
      </div>
    );
  };

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
        className={`${sizeClass} ${className} inline-flex items-center gap-2 px-3 border rounded-[8px] text-left outline-none transition-colors ${look} ${ring}`}
      >
        <Icon className={`w-4 h-4 shrink-0 ${iconTone}`} aria-hidden="true" />
        <span id={`${uid}-value`} className={`flex-1 min-w-0 truncate ${active ? 'font-medium' : ''}`}>
          {current?.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 ${iconTone} transition-transform duration-150 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open &&
        host &&
        createPortal(
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={`${uid}-label`}
            aria-activedescendant={`${listId}-${activeIndex}`}
            onKeyDown={onListKeyDown}
            style={pos ? { top: pos.top, left: pos.left, width: Math.min(width, host.offsetWidth - EDGE * 2) } : { top: 0, left: -9999, width, visibility: 'hidden' }}
            className={`absolute z-[45] max-h-[360px] overflow-y-auto p-1.5 rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_4px_12px_rgba(11,45,107,0.12)] text-left outline-none transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none ${
              shown ? 'opacity-100 translate-y-0' : `opacity-0 ${pos?.above ? 'translate-y-1' : '-translate-y-1'}`
            }`}
          >
            {groups.map((g, gi) =>
              g.name ? (
                <div
                  key={g.name}
                  role="group"
                  aria-labelledby={`${uid}-g${gi}`}
                  className={gi > 0 ? 'mt-1.5 pt-1.5 border-t border-[#DDE2EA]' : ''}
                >
                  <div id={`${uid}-g${gi}`} role="presentation" className="px-2.5 pt-1 pb-1 text-[11px] leading-4 font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                    {g.name}
                  </div>
                  {g.items.map(renderOption)}
                </div>
              ) : (
                <React.Fragment key={`g${gi}`}>{g.items.map(renderOption)}</React.Fragment>
              ),
            )}
          </div>,
          host,
        )}
    </>
  );
};
