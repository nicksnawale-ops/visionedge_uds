import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Tooltip } from '../../../templates/profile/ui';
import { useTabs } from './useTabs';
import { Activation, FOCUS, SIZE, Surface, TabItem, TabSize, formatCount, reducedMotion, srExtra } from './tabStyles';

export interface LineTabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  size?: TabSize;
  activation?: Activation;
  /** Full-width (fitted): equal widths across the container (2–4 tabs). */
  fitted?: boolean;
  surface?: Surface;
  /** Extra keys on a focused tab (closable tabs: Delete). */
  onTabKeyDown?: (e: React.KeyboardEvent, item: TabItem) => void;
  /** Middle-click on a tab (closable tabs). */
  onTabAuxClick?: (item: TabItem) => void;
  /** Rendered inside each tab after the label (e.g. a close button). */
  trailing?: (item: TabItem) => React.ReactNode;
  /** Rendered after the last tab (e.g. "+" or "More"). */
  after?: React.ReactNode;
  /** Render panels below; receives the hook API. */
  children?: (api: ReturnType<typeof useTabs>) => React.ReactNode;
  /** Keep the list on one line (scrollable tabs). */
  nowrap?: boolean;
  /** Class for the tab list (scrollable tabs make it the scroll container). */
  listClassName?: string;
  listRef?: React.RefObject<HTMLDivElement | null>;
  /** Called when the selected tab is measured (to scroll it into view). */
  onIndicator?: (left: number, width: number) => void;
}

/** Count pill: 20px high, 6px padding, 12px Medium, JetBrains Mono digits. */
const CountPill: React.FC<{ n: number; active: boolean; surface: Surface }> = ({ n, active, surface }) => (
  <span
    aria-hidden="true"
    className={`inline-flex items-center h-5 px-1.5 rounded-full font-mono text-[12px] font-medium tabular-nums ${
      surface === 'dark' ? (active ? 'bg-white/15 text-white' : 'bg-white/10 text-white/70') : active ? 'bg-[#1E63FF]/[0.08] text-[#1E63FF]' : 'bg-[#EEF1F6] text-[#353D4C]'
    }`}
  >
    {formatCount(n)}
  </span>
);

/** 8px status dot: Cyan = live, Deep Navy = needs attention (white on dark surfaces). */
const StatusDot: React.FC<{ status: 'live' | 'attention'; surface: Surface }> = ({ status, surface }) => (
  <span aria-hidden="true" className={`w-2 h-2 rounded-full shrink-0 ${status === 'live' ? 'bg-[#00C6FF]' : surface === 'dark' ? 'bg-white' : 'bg-[#0B2D6B]'}`} />
);

/**
 * Line tabs: text tabs on a 1px Gray 200 baseline. Inactive Gray 600, hover Gray 900 with a 2px Gray 300
 * underline, active Royal Blue with a 2px indicator that slides between tabs (200ms ease-out).
 * Optional icons, count pills, status dots, full-width layout and a dark-surface variant.
 */
export const LineTabs: React.FC<LineTabsProps> = ({
  items,
  value,
  onChange,
  label,
  size = 'md',
  activation = 'automatic',
  fitted = false,
  surface = 'light',
  onTabKeyDown,
  onTabAuxClick,
  trailing,
  after,
  children,
  nowrap = false,
  listClassName = '',
  listRef,
  onIndicator,
}) => {
  const api = useTabs({ items, value, onChange, activation, label, onTabKeyDown, controls: Boolean(children) });
  const ownListRef = useRef<HTMLDivElement>(null);
  const list = listRef ?? ownListRef;
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const [animate, setAnimate] = useState(false);
  const s = SIZE[size];
  const dark = surface === 'dark';

  const measure = useCallback(() => {
    const el = api.refs.current.get(value);
    if (!el || !list.current) return setIndicator(null);
    // Position relative to the list (the indicator lives inside it, so it scrolls with overflowing tabs).
    const left = el.getBoundingClientRect().left - list.current.getBoundingClientRect().left + list.current.scrollLeft;
    const width = el.offsetWidth;
    setIndicator({ left, width });
    onIndicator?.(left, width);
  }, [api.refs, value, onIndicator, list]);

  useLayoutEffect(() => {
    measure();
  }, [measure, items, size, fitted]);

  // Slide only after the first placement.
  useEffect(() => {
    const t = window.setTimeout(() => setAnimate(true), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = list.current;
    window.addEventListener('resize', measure);
    const ro = el && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => measure()) : null;
    if (el && ro) ro.observe(el);
    return () => {
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [measure, list]);

  return (
    <div>
      <div className={`flex items-end gap-2 ${dark ? 'border-b border-white/15' : 'border-b border-[#DDE2EA]'}`}>
        <div ref={list} {...api.getListProps()} className={`relative flex-1 min-w-0 flex items-end ${fitted ? '' : 'gap-8'} ${nowrap ? 'flex-nowrap' : 'flex-wrap'} ${listClassName}`}>
          {items.map((item, i) => {
            const active = item.id === value;
            const Icon = item.icon;
            const color = item.disabled
              ? dark
                ? 'text-white/40 cursor-not-allowed'
                : 'text-[#8C95A6] cursor-not-allowed'
              : active
                ? dark
                  ? 'text-white'
                  : 'text-[#1E63FF]'
                : dark
                  ? 'text-white/70 hover:text-white hover:after:bg-white/40'
                  : 'text-[#4B5465] hover:text-[#121722] hover:after:bg-[#C3CAD5]';
            const extra = srExtra(item);
            const tab = (describedBy?: string) => (
              <button
                {...api.getTabProps(item, i)}
                aria-describedby={describedBy}
                onAuxClick={(e) => {
                  if (e.button === 1 && onTabAuxClick) {
                    e.preventDefault();
                    onTabAuxClick(item);
                  }
                }}
                className={`relative -mb-px ${s.h} ${fitted ? `w-full justify-center ${s.px}` : 'px-0'} ${trailing ? 'pr-0' : ''} inline-flex items-center gap-2 ${s.text} font-medium whitespace-nowrap transition-colors rounded-t-[4px] ${FOCUS[surface]} ${color} after:absolute after:content-[''] after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:rounded-full before:absolute before:content-[''] before:-inset-y-1.5 before:inset-x-0`}
              >
                {item.status && <StatusDot status={item.status} surface={surface} />}
                {Icon && <Icon className={`${s.icon} shrink-0`} aria-hidden="true" />}
                <span>{item.label}</span>
                {item.count !== undefined && <CountPill n={item.count} active={active} surface={surface} />}
                {extra && <span className="sr-only">, {extra}</span>}
              </button>
            );
            const cell = fitted ? 'flex-1 min-w-0' : '';
            // A close button sits next to its tab (never inside it: no nested buttons).
            const withTrailing = (node: React.ReactNode) =>
              trailing ? (
                <span key={item.id} role="presentation" className="relative inline-flex items-center gap-1">
                  {node}
                  {trailing(item)}
                </span>
              ) : (
                node
              );
            return item.disabled ? (
              <Tooltip key={item.id} content={item.disabled} placement="bottom" className={cell}>
                {(tip) => tab(tip)}
              </Tooltip>
            ) : trailing ? (
              withTrailing(tab())
            ) : fitted ? (
              <span key={item.id} className={`flex ${cell}`}>
                {tab()}
              </span>
            ) : (
              <React.Fragment key={item.id}>{tab()}</React.Fragment>
            );
          })}
          {indicator && (
            <span
              aria-hidden="true"
              className={`absolute -bottom-px h-[2px] rounded-full pointer-events-none ${dark ? 'bg-[#00C6FF]' : 'bg-[#1E63FF]'} ${animate && !reducedMotion() ? 'transition-[left,width] duration-200 ease-out' : ''}`}
              style={{ left: indicator.left, width: indicator.width }}
            />
          )}
        </div>
        {after}
      </div>
      {children?.(api)}
    </div>
  );
};
