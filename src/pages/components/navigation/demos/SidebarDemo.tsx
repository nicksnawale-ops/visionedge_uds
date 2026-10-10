import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Logo } from '../../../../components/brand/Logo';
import { DEMO_USER, LONG_GROUP, NAV_BOTTOM, NAV_GROUPS, NavGroup, NavNode } from '../navigationSpec';
import { ELEV2, FOCUS_INSET, FOCUS_NAVY, NAVY_SCROLL, capCount, reducedMotion } from '../shared/navStyles';
import { SideTooltip } from '../shared/SideTooltip';
import { fixedPoint } from '../shared/fixedPosition';
import { Avatar, UserMenu } from './UserMenuDemo';
import { SiteSwitcher } from './SiteSwitcher';

export interface SidebarOptions {
  nested: boolean;
  badges: boolean;
  headings: boolean;
  siteSwitcher: boolean;
  longList: boolean;
}

export const DEFAULT_OPTIONS: SidebarOptions = { nested: true, badges: true, headings: true, siteSwitcher: false, longList: false };

interface SidebarDemoProps {
  collapsed: boolean;
  options?: SidebarOptions;
  active: string;
  onNavigate: (id: string) => void;
  /** Footer collapse toggle; omit to hide it (mobile drawer). */
  onToggleCollapse?: () => void;
  /** Keep only one parent open at a time. */
  singleOpen?: boolean;
  /** Expanded width (240 by default; the mobile drawer uses 280). */
  width?: number;
  height?: number | string;
  /** Override the groups (focused demos). */
  groups?: NavGroup[];
  showFooter?: boolean;
  /** Accessible name of the nav landmark. */
  navLabel?: string;
  /** id for the sidebar container (the collapse toggle's aria-controls). */
  id?: string;
}

const ITEM_BASE = 'relative mx-2 h-10 flex items-center gap-3 rounded-[8px] text-[14px] font-medium transition-colors';
const ITEM_STATE = {
  idle: 'text-white/80 hover:bg-white/[0.06] hover:text-white',
  active: 'bg-white/10 text-white',
  parentOfActive: 'text-white hover:bg-white/[0.06]',
  disabled: 'text-white/40 cursor-not-allowed',
};

const Bar: React.FC = () => <span aria-hidden="true" className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-[#00C6FF]" />;

/** Badge / count / dot after the label, with screen-reader text. */
const Extras: React.FC<{ item: NavNode }> = ({ item }) => (
  <>
    {item.badge && (
      <>
        <span className="sr-only">, </span>
        <span className="h-5 px-1.5 inline-flex items-center rounded-full bg-[#00C6FF]/[0.16] text-[#00C6FF] text-[10px] font-medium uppercase tracking-[0.04em]">{item.badge}</span>
      </>
    )}
    {item.count !== undefined && (
      <>
        <span className="h-5 min-w-5 px-1.5 inline-flex items-center justify-center rounded-full bg-[#00C6FF]/[0.16] text-[#00C6FF] font-mono text-[11px] font-medium" aria-hidden="true">
          {capCount(item.count)}
        </span>
        <span className="sr-only">, {item.count} new</span>
      </>
    )}
    {item.dot && (
      <>
        <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[#00C6FF]" />
        <span className="sr-only">, {item.dot}</span>
      </>
    )}
  </>
);

const hasExtras = (i: NavNode) => Boolean(i.badge || i.count !== undefined || i.dot);
const srExtras = (i: NavNode) => [i.badge ? i.badge.toLowerCase() : null, i.count !== undefined ? `${i.count} new` : null, i.dot ?? null].filter(Boolean).join(', ');

/* ── Rail flyout for parents with children ── */

interface FlyoutProps {
  id: string;
  item: NavNode;
  anchor: HTMLElement;
  active: string;
  onPick: (id: string) => void;
  onClose: (refocus: boolean) => void;
}

/** 200px white card to the right of a rail item listing its children. ↑/↓ move, Esc closes. */
const Flyout: React.FC<FlyoutProps> = ({ id, item, anchor, active, onPick, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  // Measure the parent button (8px from its right edge), not its wrapper.
  const measure = useCallback(() => {
    const target = anchor.querySelector<HTMLElement>('button') ?? anchor;
    const r = target.getBoundingClientRect();
    return fixedPoint(anchor, r.right + 8, r.top);
  }, [anchor]);
  const [pos, setPos] = useState(measure);

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('a')?.focus();
    const place = () => setPos(measure());
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node) && !anchor.contains(e.target as Node)) onClose(false);
    };
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [anchor, onClose, measure]);

  const onKey = (e: React.KeyboardEvent) => {
    const links = Array.from(ref.current?.querySelectorAll<HTMLElement>('a') ?? []);
    const i = links.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') links[(i + 1) % links.length]?.focus();
    else if (e.key === 'ArrowUp') links[(i - 1 + links.length) % links.length]?.focus();
    else if (e.key === 'Escape') onClose(true);
    else if (e.key === 'Tab') return onClose(false);
    else return;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div ref={ref} id={id} onKeyDown={onKey} className={`fixed z-[60] w-[200px] py-1 rounded-[8px] bg-white border border-[#DDE2EA] ${ELEV2}`} style={{ top: pos.top, left: pos.left }}>
      <p className="px-3 pt-2 pb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">{item.label}</p>
      <ul>
        {item.children?.map((c) => (
          <li key={c.id}>
            <a
              href={`#nav-${c.id}`}
              aria-current={c.id === active ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                onPick(c.id);
                onClose(true);
              }}
              className={`h-9 px-3 flex items-center text-[13px] ${c.id === active ? 'bg-[#1E63FF]/[0.08] text-[#1E63FF] font-medium' : 'text-[#353D4C] hover:bg-[#F7F9FC]'} ${FOCUS_INSET}`}
            >
              {c.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ── Sidebar ── */

/**
 * Self-contained replica of the VisionEdge sidebar (never the app's real one): Deep Navy, 240px expanded /
 * 72px rail, pinned header and footer, scrolling middle, nested items (accordion inline, flyout in the rail).
 */
export const SidebarDemo: React.FC<SidebarDemoProps> = ({
  collapsed,
  options = DEFAULT_OPTIONS,
  active,
  onNavigate,
  onToggleCollapse,
  singleOpen = false,
  width = 240,
  height = 560,
  groups: groupsProp,
  showFooter = true,
  navLabel = 'Main',
  id,
}) => {
  const baseId = useId();
  const sidebarId = id ?? `${baseId}-sidebar`;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [site, setSite] = useState('North campus');
  const [userOpen, setUserOpen] = useState(false);
  const userBtn = useRef<HTMLButtonElement>(null);
  const [flyout, setFlyout] = useState<{ item: NavNode; anchor: HTMLElement } | null>(null);

  const base = groupsProp ?? NAV_GROUPS;
  const groups = options.longList && !groupsProp ? [base[0], base[1], LONG_GROUP, ...base.slice(2)] : base;

  // With nesting off, a child page highlights its parent.
  const parentOf = useCallback((childId: string) => groups.flatMap((g) => g.items).find((i) => i.children?.some((c) => c.id === childId)), [groups]);
  const activeParent = parentOf(active);
  const effectiveActive = !options.nested && activeParent ? activeParent.id : active;

  const [openParents, setOpenParents] = useState<string[]>(() => (activeParent ? [activeParent.id] : []));
  // Opening a child page opens its parent.
  const activeParentId = activeParent?.id;
  useEffect(() => {
    if (activeParentId) setOpenParents((o) => (o.includes(activeParentId) ? o : singleOpen ? [activeParentId] : [...o, activeParentId]));
  }, [activeParentId, singleOpen]);

  const toggleParent = (pid: string) =>
    setOpenParents((o) => (o.includes(pid) ? o.filter((x) => x !== pid) : singleOpen ? [pid] : [...o, pid]));

  // Scroll the active item into view inside the nav (never the page).
  useLayoutEffect(() => {
    const sc = scrollRef.current;
    const el = sc?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!sc || !el) return;
    const top = el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop;
    if (top < sc.scrollTop || top + el.offsetHeight > sc.scrollTop + sc.clientHeight) sc.scrollTop = Math.max(0, top - sc.clientHeight / 2);
  }, [options.longList, collapsed]);

  const flyoutRef = useRef(flyout);
  flyoutRef.current = flyout;
  const closeFlyout = useCallback((refocus: boolean) => {
    const f = flyoutRef.current;
    setFlyout(null);
    if (f && refocus) f.anchor.querySelector<HTMLElement>('button')?.focus();
  }, []);
  useEffect(() => setFlyout(null), [collapsed]);

  const go = (nid: string) => {
    onNavigate(nid);
    setFlyout(null);
  };

  const renderItem = (item: NavNode) => {
    const Icon = item.icon;
    const isActive = effectiveActive === item.id;
    const nestedHere = options.nested && Boolean(item.children?.length);
    const isParentOfActive = nestedHere && item.children!.some((c) => c.id === active);
    const showExtras = options.badges && hasExtras(item);
    const state = item.disabled ? ITEM_STATE.disabled : isActive ? ITEM_STATE.active : isParentOfActive ? ITEM_STATE.parentOfActive : ITEM_STATE.idle;
    const layout = collapsed ? 'justify-center' : 'px-3';

    const icon = (
      <span className="relative shrink-0">
        <Icon className="w-5 h-5" aria-hidden="true" />
        {collapsed && showExtras && <span aria-hidden="true" className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00C6FF] ring-2 ring-[#0B2D6B]" />}
      </span>
    );
    const label = collapsed ? (
      <span className="sr-only">
        {item.label}
        {showExtras ? `, ${srExtras(item)}` : ''}
      </span>
    ) : (
      <>
        <span className="flex-1 min-w-0 truncate text-left">{item.label}</span>
        {showExtras && <Extras item={item} />}
      </>
    );

    // Disabled: still focusable, explains why.
    if (item.disabled) {
      return (
        <li key={item.id}>
          <SideTooltip content={collapsed ? `${item.label}: ${item.disabled}` : item.disabled}>
            {(tip) => (
              <a role="link" aria-disabled="true" tabIndex={0} aria-describedby={tip} className={`${ITEM_BASE} ${layout} ${state} flex-1 ${FOCUS_NAVY}`} onClick={(e) => e.preventDefault()}>
                {icon}
                {label}
              </a>
            )}
          </SideTooltip>
        </li>
      );
    }

    // Parent with children.
    if (nestedHere) {
      const listId = `${baseId}-${item.id}-children`;
      if (collapsed) {
        const flyId = `${baseId}-${item.id}-flyout`;
        const open = flyout?.item.id === item.id;
        return (
          <li key={item.id}>
            <SideTooltip content={item.label}>
              {() => (
                <span className="flex flex-1" data-flyout-anchor>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={open ? flyId : undefined}
                    onClick={(e) => {
                      const anchor = e.currentTarget.parentElement as HTMLElement;
                      setFlyout((f) => (f?.item.id === item.id ? null : { item, anchor }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        setFlyout({ item, anchor: e.currentTarget.parentElement as HTMLElement });
                      }
                    }}
                    className={`${ITEM_BASE} ${layout} ${isParentOfActive ? ITEM_STATE.active : state} flex-1 ${FOCUS_NAVY}`}
                  >
                    {isParentOfActive && <Bar />}
                    {icon}
                    {label}
                  </button>
                </span>
              )}
            </SideTooltip>
            {open && flyout && <Flyout id={flyId} item={item} anchor={flyout.anchor} active={active} onPick={onNavigate} onClose={closeFlyout} />}
          </li>
        );
      }
      const open = openParents.includes(item.id);
      return (
        <li key={item.id}>
          <button type="button" aria-expanded={open} aria-controls={listId} onClick={() => toggleParent(item.id)} className={`${ITEM_BASE} ${layout} ${state} w-[calc(100%-16px)] ${FOCUS_NAVY}`}>
            {icon}
            {label}
            <ChevronDown className={`w-4 h-4 shrink-0 text-white/60 ${reducedMotion() ? '' : 'transition-transform duration-200'} ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          <div className={`grid ${reducedMotion() ? '' : 'transition-[grid-template-rows] duration-200 ease-out'} ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <ul id={listId} inert={!open} className="overflow-hidden min-h-0">
              {item.children!.map((c) => {
                const ca = c.id === active;
                return (
                  <li key={c.id} className="first:mt-0.5">
                    <a
                      href={`#nav-${c.id}`}
                      aria-current={ca ? 'page' : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        go(c.id);
                      }}
                      className={`relative mx-2 h-9 pl-[44px] pr-3 flex items-center rounded-[8px] text-[13px] font-medium transition-colors ${ca ? ITEM_STATE.active : ITEM_STATE.idle} ${FOCUS_NAVY}`}
                    >
                      {ca && <Bar />}
                      <span className="truncate">{c.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </li>
      );
    }

    // Plain item.
    return (
      <li key={item.id}>
        <SideTooltip content={item.label} disabled={!collapsed}>
          {() => (
            <a
              href={`#nav-${item.id}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                go(item.id);
              }}
              className={`${ITEM_BASE} ${layout} ${state} flex-1 ${FOCUS_NAVY}`}
            >
              {isActive && <Bar />}
              {icon}
              {label}
            </a>
          )}
        </SideTooltip>
      </li>
    );
  };

  const w = collapsed ? 72 : width;

  return (
    <div
      id={sidebarId}
      className={`relative flex flex-col bg-[#0B2D6B] text-white shrink-0 ${reducedMotion() ? '' : 'transition-[width] duration-200 ease-out'}`}
      style={{ width: w, height }}
    >
      {/* 1 Header */}
      <div className={`h-16 shrink-0 flex items-center gap-3 border-b border-white/10 ${collapsed ? 'justify-center' : 'px-4'}`}>
        <Logo size={32} />
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[16px] font-semibold leading-5 truncate">VisionEdge</p>
            <p className="text-[11px] leading-4 text-[#C3CAD5] truncate">Campus security</p>
          </div>
        )}
      </div>

      {/* 2 Site switcher */}
      {options.siteSwitcher && (
        <div className="pt-3 shrink-0">
          <SiteSwitcher site={site} onChange={setSite} collapsed={collapsed} />
        </div>
      )}

      <nav aria-label={navLabel} className="flex-1 min-h-0 flex flex-col">
        {/* 8 Scroll area */}
        <div ref={scrollRef} className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-3 ${NAVY_SCROLL}`}>
          {groups.map((g, gi) => {
            const headId = `${baseId}-${g.id}-h`;
            const showHeading = options.headings && !collapsed;
            return (
              <div key={g.id}>
                {showHeading ? (
                  <p id={headId} className="pl-4 mt-6 mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#C3CAD5]">
                    {g.heading}
                  </p>
                ) : gi > 0 && (collapsed || options.headings) ? (
                  <div role="separator" className="mx-4 my-3 h-px bg-white/10" />
                ) : (
                  <div className={gi === 0 ? 'h-3' : 'h-2'} />
                )}
                <ul aria-labelledby={showHeading ? headId : undefined} aria-label={showHeading ? undefined : g.heading} className="space-y-0.5">
                  {g.items.map(renderItem)}
                </ul>
              </div>
            );
          })}
        </div>
        {/* Settings and Help: pinned at the bottom */}
        <ul className="shrink-0 py-2 border-t border-white/10 space-y-0.5" aria-label="Support">
          {NAV_BOTTOM.map(renderItem)}
        </ul>
      </nav>

      {/* 9 Footer */}
      {showFooter && (
        <div className="shrink-0 border-t border-white/10 py-2 space-y-0.5">
          <div className="relative">
            <SideTooltip content={`${DEMO_USER.name}, ${DEMO_USER.role}`} disabled={!collapsed}>
              {() => (
                <button
                  ref={userBtn}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={userOpen}
                  aria-controls={userOpen ? `${baseId}-user-menu` : undefined}
                  aria-label={`User menu, ${DEMO_USER.name}, ${DEMO_USER.role}`}
                  onClick={() => setUserOpen((o) => !o)}
                  className={`relative mx-2 flex-1 h-12 flex items-center gap-3 rounded-[8px] hover:bg-white/[0.06] ${collapsed ? 'justify-center' : 'px-2'} ${FOCUS_NAVY}`}
                >
                  <Avatar />
                  {!collapsed && (
                    <>
                      <span className="flex-1 min-w-0 text-left">
                        <span className="block text-[14px] font-medium text-white truncate">{DEMO_USER.name}</span>
                        <span className="block text-[12px] text-[#C3CAD5] truncate">{DEMO_USER.role}</span>
                      </span>
                      <ChevronUp className="w-4 h-4 text-white/60" aria-hidden="true" />
                    </>
                  )}
                </button>
              )}
            </SideTooltip>
            <UserMenu id={`${baseId}-user-menu`} open={userOpen} onClose={() => setUserOpen(false)} buttonRef={userBtn} placement={collapsed ? 'right-end' : 'up-start'} />
          </div>
          {onToggleCollapse && (
            <SideTooltip content="Expand sidebar (Ctrl B)" disabled={!collapsed}>
              {() => (
                <button
                  type="button"
                  aria-expanded={!collapsed}
                  aria-controls={sidebarId}
                  aria-keyshortcuts="Control+B"
                  onClick={onToggleCollapse}
                  className={`${ITEM_BASE} flex-1 ${collapsed ? 'justify-center' : 'px-3'} ${ITEM_STATE.idle} ${FOCUS_NAVY}`}
                >
                  {collapsed ? <PanelLeftOpen className="w-5 h-5" aria-hidden="true" /> : <PanelLeftClose className="w-5 h-5" aria-hidden="true" />}
                  {collapsed ? <span className="sr-only">Expand sidebar</span> : <span className="flex-1 text-left">Collapse sidebar</span>}
                </button>
              )}
            </SideTooltip>
          )}
        </div>
      )}
    </div>
  );
};

export const SIDEBAR_CODE = `// Sidebar: Deep Navy, 240px (72px rail), pinned header/footer, scrolling middle
<aside className="fixed inset-y-0 left-0 w-[240px] flex flex-col bg-[#0B2D6B] text-white">
  <div className="h-16 px-4 flex items-center gap-3 border-b border-white/10">
    <Logo size={32} />
    <div>
      <p className="text-[16px] font-semibold">VisionEdge</p>
      <p className="text-[11px] text-[#C3CAD5]">Campus security</p>
    </div>
  </div>

  <nav aria-label="Main" className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:thin]">
    <p id="g-monitor" className="pl-4 mt-6 mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#C3CAD5]">Monitor</p>
    <ul aria-labelledby="g-monitor">
      <li>
        <a href="/alerts" aria-current="page"
          className="relative mx-2 h-10 px-3 flex items-center gap-3 rounded-[8px] text-[14px] font-medium
                     bg-white/10 text-white outline-none focus-visible:outline-2 focus-visible:outline-[#00C6FF] focus-visible:outline-offset-2">
          <span aria-hidden="true" className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-[#00C6FF]" />
          <Bell className="w-5 h-5" aria-hidden="true" />
          <span className="flex-1">Alerts</span>
          <span aria-hidden="true" className="h-5 px-1.5 rounded-full bg-[#00C6FF]/[0.16] text-[#00C6FF] font-mono text-[11px]">12</span>
          <span className="sr-only">, 12 new</span>
        </a>
      </li>
      {/* inactive: text-white/80 hover:bg-white/[0.06] hover:text-white */}
    </ul>
  </nav>

  <div className="border-t border-white/10 py-2">
    {/* user block (opens the user menu upward) */}
    <button aria-expanded={!collapsed} aria-controls="sidebar" aria-keyshortcuts="Control+B" className="mx-2 h-10 px-3 flex items-center gap-3 …">
      <PanelLeftClose className="w-5 h-5" aria-hidden="true" /> Collapse sidebar
    </button>
  </div>
</aside>`;
