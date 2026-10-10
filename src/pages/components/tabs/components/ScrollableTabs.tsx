import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { LineTabs } from './LineTabs';
import { Activation, SIZE, TabItem, TabSize, reducedMotion } from './tabStyles';

interface ScrollableTabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  size?: TabSize;
  activation?: Activation;
  /** "scroll": chevrons + fade edges. "more": hidden tabs go into a "More (n)" menu. */
  mode?: 'scroll' | 'more';
  children?: React.ComponentProps<typeof LineTabs>['children'];
}

const ICON_BTN =
  'relative w-8 h-8 shrink-0 rounded-[8px] flex items-center justify-center text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] disabled:opacity-0 disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] after:absolute after:content-[\'\'] after:-inset-1.5';

/**
 * Scrollable / overflow tabs. Scroll mode: Ghost chevrons with decorative white fade edges, and the active tab
 * is always scrolled into view. More mode: tabs that don't fit move into a "More (n)" menu.
 */
export const ScrollableTabs: React.FC<ScrollableTabsProps> = (props) => (props.mode === 'more' ? <MoreTabs {...props} /> : <ScrollTabs {...props} />);

const ScrollTabs: React.FC<ScrollableTabsProps> = ({ items, value, onChange, label, size = 'md', activation, children }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setEdges({ left: el.scrollLeft > 1, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1 });
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update, items]);

  // Re-check the edges once a programmatic smooth scroll has settled (not every browser fires scroll events for it).
  const settleTimer = useRef<number | undefined>(undefined);
  const settle = useCallback(() => {
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(update, 400);
  }, [update]);
  useEffect(() => () => window.clearTimeout(settleTimer.current), []);

  // Keep the active tab in view.
  const onIndicator = useCallback(
    (left: number, width: number) => {
      const el = listRef.current;
      if (!el) return;
      const pad = 32;
      const behavior: ScrollBehavior = reducedMotion() ? 'auto' : 'smooth';
      if (left < el.scrollLeft) el.scrollTo({ left: Math.max(0, left - pad), behavior });
      else if (left + width > el.scrollLeft + el.clientWidth) el.scrollTo({ left: left + width - el.clientWidth + pad, behavior });
      // Focus can also scroll the list natively, so always re-check.
      settle();
    },
    [settle]
  );

  const scrollBy = (dir: -1 | 1) => {
    listRef.current?.scrollBy({ left: dir * (listRef.current.clientWidth * 0.7), behavior: reducedMotion() ? 'auto' : 'smooth' });
    settle();
  };
  const fade = (side: 'left' | 'right') => (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 bottom-px w-10 ${side === 'left' ? 'left-10' : 'right-10'} transition-opacity ${edges[side] ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: `linear-gradient(to ${side === 'left' ? 'right' : 'left'}, #FFFFFF, rgba(255, 255, 255, 0))` }}
    />
  );

  return (
    <div className="relative">
      <div className="flex items-end gap-2">
        <button type="button" onClick={() => scrollBy(-1)} disabled={!edges.left} aria-label="Scroll tabs left" className={`${ICON_BTN} mb-1`} tabIndex={-1}>
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>
        <div className="flex-1 min-w-0">
          <LineTabs
            items={items}
            value={value}
            onChange={onChange}
            label={label}
            size={size}
            activation={activation}
            nowrap
            listRef={listRef}
            listClassName="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-1"
            onIndicator={onIndicator}
          >
            {children}
          </LineTabs>
        </div>
        <button type="button" onClick={() => scrollBy(1)} disabled={!edges.right} aria-label="Scroll tabs right" className={`${ICON_BTN} mb-1`} tabIndex={-1}>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      {fade('left')}
      {fade('right')}
    </div>
  );
};

/** "More (n)" mode: as many tabs as fit, the rest in a menu. Choosing one from the menu activates it. */
const MoreTabs: React.FC<ScrollableTabsProps> = ({ items, value, onChange, label, size = 'md', activation, children }) => {
  const measureRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(items.length);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const s = SIZE[size];

  const compute = useCallback(() => {
    const wrap = wrapRef.current;
    const m = measureRef.current;
    if (!wrap || !m) return;
    const widths = Array.from(m.children).map((c) => (c as HTMLElement).offsetWidth);
    const gap = 32;
    const moreW = 110;
    let used = 0;
    let n = 0;
    for (const w of widths) {
      const next = used + (n ? gap : 0) + w;
      if (next + (n + 1 < widths.length ? gap + moreW : 0) > wrap.clientWidth) break;
      used = next;
      n += 1;
    }
    setFit(Math.max(1, n));
  }, []);

  useLayoutEffect(() => compute(), [compute, items, size]);
  useEffect(() => {
    window.addEventListener('resize', compute);
    const ro = typeof ResizeObserver !== 'undefined' && wrapRef.current ? new ResizeObserver(compute) : null;
    if (ro && wrapRef.current) ro.observe(wrapRef.current);
    return () => {
      window.removeEventListener('resize', compute);
      ro?.disconnect();
    };
  }, [compute]);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && e.target !== buttonRef.current) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // The active tab is always visible: if it would be hidden, it takes the last visible slot.
  const activeIndex = items.findIndex((i) => i.id === value);
  let visible = items.slice(0, fit);
  if (fit < items.length && activeIndex >= fit) visible = [...items.slice(0, fit - 1), items[activeIndex]];
  const hidden = items.filter((i) => !visible.includes(i));

  const onMenuKey = (e: React.KeyboardEvent) => {
    const els = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const i = els.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') els[(i + 1) % els.length]?.focus();
    else if (e.key === 'ArrowUp') els[(i - 1 + els.length) % els.length]?.focus();
    else if (e.key === 'Escape') {
      setOpen(false);
      buttonRef.current?.focus();
    } else return;
    e.preventDefault();
  };

  return (
    <div ref={wrapRef} className="relative">
      {/* Invisible row used to measure natural tab widths */}
      <div ref={measureRef} aria-hidden="true" className="absolute invisible pointer-events-none flex gap-8 whitespace-nowrap" style={{ left: -9999 }}>
        {items.map((i) => (
          <span key={i.id} className={`inline-flex items-center gap-2 ${s.text} font-medium ${s.h}`}>
            {i.label}
          </span>
        ))}
      </div>
      <LineTabs
        items={visible}
        value={value}
        onChange={onChange}
        label={label}
        size={size}
        activation={activation}
        nowrap
        after={
          hidden.length > 0 && (
            <div className="relative mb-1">
              <button
                ref={buttonRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className={`relative ${size === 'lg' ? 'h-10' : 'h-8'} px-3 inline-flex items-center gap-1 rounded-[8px] ${s.text} font-medium text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#121722] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] after:absolute after:content-[''] after:-inset-y-1.5 after:inset-x-0`}
              >
                More ({hidden.length})
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </button>
              {open && (
                <div ref={menuRef} role="menu" aria-label="More tabs" onKeyDown={onMenuKey} className="absolute right-0 top-full mt-2 z-40 min-w-[180px] py-1 rounded-[8px] bg-white border border-[#DDE2EA] shadow-[0_4px_12px_rgba(11,45,107,0.12)]">
                  {hidden.map((i) => (
                    <button
                      key={i.id}
                      type="button"
                      role="menuitem"
                      disabled={Boolean(i.disabled)}
                      onClick={() => {
                        onChange(i.id);
                        setOpen(false);
                        buttonRef.current?.focus();
                      }}
                      className="w-full h-11 px-4 text-left text-[14px] text-[#353D4C] hover:bg-[#F7F9FC] disabled:text-[#8C95A6] outline-none focus-visible:bg-[#F7F9FC] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E63FF]"
                    >
                      {i.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        }
      >
        {children}
      </LineTabs>
    </div>
  );
};
