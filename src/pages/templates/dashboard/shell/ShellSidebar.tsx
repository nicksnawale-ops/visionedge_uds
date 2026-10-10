import React from 'react';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { Logo } from '../../../../components/brand/Logo';
import { CURRENT_USER, DashboardUseCase } from '../data/useCases';

interface ShellSidebarProps {
  useCase: DashboardUseCase;
  /** "inline" sits beside the content from 768px; "drawer" overlays it below 768px. */
  variant: 'inline' | 'drawer';
  /** User chose the 72px sidebar (from 1280px; below that it is always 72px). */
  userCollapsed: boolean;
  onToggleCollapsed: () => void;
  onCloseDrawer: () => void;
  /** Unacknowledged alerts, shown as a pill on "Alerts". */
  alertCount: number;
  /** Nav item marked as the current page. Default "dashboard"; null for pages outside the module nav (e.g. My profile). */
  activeId?: string | null;
  anatomy?: React.ReactNode;
}

/**
 * Product sidebar: Deep Navy, same rules as the design-system sidebar (White 10% active fill,
 * 3px Cyan bar, 20px icons). Layout is pure container queries — no JS measuring:
 * ≥1280px 240px (unless collapsed) · 768–1279px 72px with tooltips · <768px hidden (drawer instead).
 */
export const ShellSidebar: React.FC<ShellSidebarProps> = ({
  useCase,
  variant,
  userCollapsed,
  onToggleCollapsed,
  onCloseDrawer,
  alertCount,
  activeId = 'dashboard',
  anatomy,
}) => {
  const drawer = variant === 'drawer';
  // Class helpers: what shows in the expanded vs the 72px layout.
  const forceCollapsed = !drawer && userCollapsed;
  // Full class strings (not template literals) so Tailwind can find them.
  const EXPANDED_ONLY = { block: 'hidden @min-[1280px]:block', 'inline-flex': 'hidden @min-[1280px]:inline-flex' } as const;
  const expandedOnly = (display: keyof typeof EXPANDED_ONLY) =>
    drawer ? display : forceCollapsed ? 'hidden' : EXPANDED_ONLY[display];
  const collapsedOnly = drawer ? 'hidden' : forceCollapsed ? '' : '@min-[1280px]:hidden';
  const itemLayout = drawer
    ? 'gap-3 px-3'
    : forceCollapsed
      ? 'justify-center'
      : 'justify-center @min-[1280px]:justify-start @min-[1280px]:gap-3 @min-[1280px]:px-3';
  const width = drawer ? 'w-[280px]' : forceCollapsed ? 'w-[72px]' : 'w-[72px] @min-[1280px]:w-[240px]';

  return (
    <aside
      aria-label={`${useCase.productName} navigation`}
      className={`${drawer ? 'absolute inset-y-0 left-0 z-50' : 'relative hidden @min-[768px]:flex shrink-0'} ${width} bg-[#0B2D6B] text-white flex flex-col transition-[width] duration-200`}
    >
      {anatomy}
      {/* Product */}
      <div className={`h-16 shrink-0 flex items-center gap-2 border-b border-white/10 ${drawer ? 'justify-between px-4' : forceCollapsed ? 'justify-center' : 'justify-center @min-[1280px]:justify-between @min-[1280px]:px-4'}`}>
        <div className="flex items-center gap-3 min-w-0">
          <Logo size={32} />
          <div className={`min-w-0 ${expandedOnly('block')}`}>
            <span className="block text-[16px] leading-tight font-semibold text-white">VisionEdge</span>
            <span className="block text-[11px] leading-tight text-[#C3CAD5] truncate">{useCase.productName}</span>
          </div>
        </div>
        {drawer && (
          <button
            type="button"
            onClick={onCloseDrawer}
            aria-label="Close navigation"
            className="w-11 h-11 rounded-[8px] flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Module navigation */}
      <nav aria-label="Product" className="flex-1 overflow-y-auto overflow-x-visible py-3 px-2">
        <ul className="space-y-0.5">
          {useCase.nav.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeId;
            const count = item.id === 'alerts' && alertCount > 0 ? alertCount : null;
            return (
              <li key={item.id} className="relative group">
                <a
                  href={`#${item.id}`}
                  onClick={(e) => e.preventDefault()}
                  aria-current={active ? 'page' : undefined}
                  aria-label={`${item.label}${count ? `, ${count} open` : ''}`}
                  className={`relative h-11 flex items-center rounded-[8px] text-[14px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white ${itemLayout} ${
                    active ? 'bg-white/10 text-white font-semibold' : 'text-white/80 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-[#00C6FF]" aria-hidden="true" />}
                  <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-[#00C6FF]' : 'text-white/70 group-hover:text-white'}`} aria-hidden="true" />
                  <span className={`flex-1 truncate ${expandedOnly('block')}`}>{item.label}</span>
                  {count !== null && (
                    <>
                      <span
                        className={`px-1.5 min-w-6 h-5 items-center justify-center rounded-full bg-[#00C6FF]/[0.16] text-[#00C6FF] text-[11px] font-semibold tabular-nums ${expandedOnly('inline-flex')}`}
                        aria-hidden="true"
                      >
                        {count}
                      </span>
                      <span className={`absolute top-1.5 right-2.5 w-2 h-2 rounded-full bg-[#00C6FF] ${collapsedOnly}`} aria-hidden="true" />
                    </>
                  )}
                </a>
                {!drawer && (
                  <span
                    role="tooltip"
                    className={`pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-[4px] bg-[#1F2633] px-2.5 py-1.5 text-[12px] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 ${collapsedOnly || 'block'}`}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User and collapse */}
      <div className="shrink-0 border-t border-white/10 p-3 space-y-2">
        <div className={`flex items-center gap-3 ${drawer ? 'px-1' : forceCollapsed ? 'justify-center' : 'justify-center @min-[1280px]:justify-start @min-[1280px]:px-1'}`}>
          <span
            className="w-8 h-8 shrink-0 rounded-full bg-[#1E63FF] text-white text-[12px] font-semibold flex items-center justify-center"
            role="img"
            aria-label={`${CURRENT_USER.name}, ${CURRENT_USER.role}`}
          >
            {CURRENT_USER.initials}
          </span>
          <span className={`min-w-0 ${expandedOnly('block')}`} aria-hidden="true">
            <span className="block text-[14px] leading-[20px] font-medium text-white truncate">{CURRENT_USER.name}</span>
            <span className="block text-[11px] leading-[16px] text-[#C3CAD5]">{CURRENT_USER.role}</span>
          </span>
        </div>
        {!drawer && (
          // Below 1280px the sidebar is always 72px, so the toggle only appears from 1280px.
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={userCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`w-full h-11 hidden @min-[1280px]:flex items-center gap-3 rounded-[8px] text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white ${
              userCollapsed ? 'justify-center' : 'px-3'
            }`}
          >
            {userCollapsed ? <PanelLeftOpen className="w-5 h-5" aria-hidden="true" /> : <PanelLeftClose className="w-5 h-5" aria-hidden="true" />}
            {!userCollapsed && <span>Collapse sidebar</span>}
          </button>
        )}
      </div>
    </aside>
  );
};
