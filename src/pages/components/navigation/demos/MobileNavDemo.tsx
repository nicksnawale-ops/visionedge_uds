import React, { useRef, useState } from 'react';
import { Activity, Bell, LayoutDashboard, Menu, Search, Video, X } from 'lucide-react';
import { navLabel } from '../navigationSpec';
import { FOCUS_LIGHT, FOCUS_NAVY, ICON_BTN, reducedMotion } from '../shared/navStyles';
import { useFocusTrap } from '../shared/useFocusTrap';
import { SidebarDemo, SidebarOptions } from './SidebarDemo';
import { UserMenuButton } from './UserMenuDemo';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  active: string;
  onNavigate: (id: string) => void;
  options?: SidebarOptions;
}

/**
 * Mobile drawer: the sidebar slides in from the left (280px, 250ms ease-out) over a Black 50% scrim.
 * Closes on scrim tap, Esc, swipe-left or navigation; traps focus and returns it to the menu button.
 * Positioned inside its (relative) demo frame, never over the real app.
 */
export const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose, active, onNavigate, options }) => {
  const panel = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  useFocusTrap(panel, open, { onEscape: onClose });
  const motion = reducedMotion() ? '' : 'duration-[250ms] ease-out';

  return (
    <div className={`absolute inset-0 z-40 overflow-hidden ${open ? '' : 'pointer-events-none'}`} inert={!open}>
      <div aria-hidden="true" onClick={onClose} className={`absolute inset-0 bg-black/50 transition-opacity ${motion} ${open ? 'opacity-100' : 'opacity-0'}`} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        onPointerDown={(e) => {
          startX.current = e.clientX;
        }}
        onPointerMove={(e) => {
          if (startX.current !== null && e.clientX - startX.current < -60) {
            startX.current = null;
            onClose();
          }
        }}
        onPointerUp={() => {
          startX.current = null;
        }}
        className={`absolute inset-y-0 left-0 w-[280px] max-w-[85%] transition-transform ${motion} ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarDemo
          collapsed={false}
          width={280}
          height="100%"
          options={options}
          active={active}
          onNavigate={(id) => {
            onNavigate(id);
            onClose();
          }}
          navLabel="Main (demo drawer)"
        />
        <button type="button" onClick={onClose} aria-label="Close menu" className={`absolute top-3 right-3 w-10 h-10 rounded-[8px] inline-flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white ${FOCUS_NAVY}`}>
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

const BOTTOM_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'live-view', label: 'Live', icon: Video },
  { id: 'alerts', label: 'Alerts', icon: Bell, count: 3 },
  { id: 'all-events', label: 'Events', icon: Activity },
];

/** Phone frame (max 390px) with a mobile top bar, the drawer and optional bottom navigation. */
export const MobileNavDemo: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('alerts');
  const [bottom, setBottom] = useState(true);
  const menuBtn = useRef<HTMLButtonElement>(null);

  return (
    <div className="space-y-4">
      <label className="inline-flex items-center gap-2 min-h-[44px] text-[14px] text-[#353D4C] cursor-pointer">
        <input type="checkbox" checked={bottom} onChange={(e) => setBottom(e.target.checked)} className="w-4 h-4 accent-[#1E63FF]" />
        Bottom navigation (operator and field views only)
      </label>
      <div className="mx-auto w-full max-w-[390px] rounded-[32px] border-[6px] border-[#121722] bg-[#121722] overflow-hidden">
        <div className="relative h-[680px] bg-[#F7F9FC] flex flex-col overflow-hidden rounded-[26px]">
          <header className="h-16 shrink-0 px-2 flex items-center gap-1 bg-white border-b border-[#DDE2EA]">
            <button ref={menuBtn} type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className={ICON_BTN}>
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
            <p className="flex-1 min-w-0 text-[16px] font-semibold text-[#121722] truncate">{navLabel(active)}</p>
            <button type="button" aria-label="Search" className={ICON_BTN}>
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>
            <button type="button" aria-label="Notifications, 3 unread" className={ICON_BTN}>
              <Bell className="w-5 h-5" aria-hidden="true" />
              <span aria-hidden="true" className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0B2D6B] text-white text-[11px] font-semibold inline-flex items-center justify-center">
                3
              </span>
            </button>
            <UserMenuButton />
          </header>
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
            <h3 className="text-[20px] font-semibold text-[#121722]">{navLabel(active)}</h3>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-16 rounded-[12px] bg-white border border-[#DDE2EA] p-3 space-y-2" aria-hidden="true">
                <span className="block h-3 w-1/2 rounded bg-[#EEF1F6]" />
                <span className="block h-2.5 w-3/4 rounded bg-[#EEF1F6]" />
              </div>
            ))}
          </div>
          {bottom && (
            <nav aria-label="Quick navigation" className="shrink-0 bg-white border-t border-[#DDE2EA]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
              <ul className="h-16 flex">
                {[...BOTTOM_ITEMS, { id: 'more', label: 'More', icon: Menu }].map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === active;
                  const count = 'count' in item ? item.count : undefined;
                  const cls = `relative w-full h-full flex flex-col items-center justify-center gap-1 text-[12px] font-medium ${isActive ? 'text-[#1E63FF]' : 'text-[#4B5465] hover:text-[#121722]'} ${FOCUS_LIGHT} focus-visible:ring-offset-0 focus-visible:ring-inset`;
                  const inner = (
                    <>
                      {isActive && <span aria-hidden="true" className="absolute top-0 inset-x-4 h-[2px] rounded-b bg-[#1E63FF]" />}
                      <span className="relative">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                        {count !== undefined && (
                          <span aria-hidden="true" className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0B2D6B] text-white text-[11px] font-semibold inline-flex items-center justify-center">
                            {count}
                          </span>
                        )}
                      </span>
                      {item.label}
                      {count !== undefined && <span className="sr-only">, {count} new</span>}
                    </>
                  );
                  return (
                    <li key={item.id} className="flex-1">
                      {item.id === 'more' ? (
                        <button type="button" onClick={() => setOpen(true)} aria-expanded={open} className={cls}>
                          {inner}
                        </button>
                      ) : (
                        <a
                          href={`#nav-${item.id}`}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            setActive(item.id);
                          }}
                          className={cls}
                        >
                          {inner}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
          <MobileDrawer open={open} onClose={() => setOpen(false)} active={active} onNavigate={setActive} />
        </div>
      </div>
    </div>
  );
};

export const MOBILE_CODE = `// Drawer: 280px, slides in 250ms ease-out over a Black 50% scrim; traps and restores focus
<div className={'fixed inset-0 z-40 ' + (open ? '' : 'pointer-events-none')} inert={!open}>
  <div aria-hidden="true" onClick={close} className={'absolute inset-0 bg-black/50 transition-opacity duration-[250ms] ' + (open ? 'opacity-100' : 'opacity-0')} />
  <div role="dialog" aria-modal="true" aria-label="Main menu"
    className={'absolute inset-y-0 left-0 w-[280px] bg-[#0B2D6B] transition-transform duration-[250ms] ease-out motion-reduce:transition-none ' + (open ? 'translate-x-0' : '-translate-x-full')}>
    {/* sidebar content; close on Esc, scrim tap, swipe-left and route change */}
  </div>
</div>

// Bottom navigation (operator/field views only): 64px, max 5 items
<nav aria-label="Quick navigation" className="bg-white border-t border-[#DDE2EA]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
  <ul className="h-16 flex">
    <li className="flex-1">
      <a href="/alerts" aria-current="page" className="relative h-full flex flex-col items-center justify-center gap-1 text-[12px] font-medium text-[#1E63FF]">
        <span aria-hidden="true" className="absolute top-0 inset-x-4 h-[2px] bg-[#1E63FF]" />
        <Bell className="w-5 h-5" aria-hidden="true" /> Alerts
      </a>
    </li>
  </ul>
</nav>`;
