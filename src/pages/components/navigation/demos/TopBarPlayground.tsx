import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Building2, ChevronDown, HelpCircle, Menu, Search } from 'lucide-react';
import { CodeBlock } from '../../../../components/common/CodeBlock';
import { Tooltip } from '../../../templates/profile/ui';
import { SITES } from '../navigationSpec';
import { DemoScope } from '../shared/DemoScope';
import { ELEV1, ELEV2, FOCUS_INSET, FOCUS_LIGHT, ICON_BTN } from '../shared/navStyles';
import { useMenuKeys } from '../shared/useMenuKeys';
import { useClickOutside } from '../shared/useClickOutside';
import { Breadcrumbs } from './BreadcrumbsDemo';
import { CommandPalette } from './CommandPaletteDemo';
import { NotificationsButton } from './NotificationsDemo';
import { MenuEntry, UserMenuButton } from './UserMenuDemo';
import { MobileDrawer } from './MobileNavDemo';

type Width = 'desktop' | 'tablet' | 'mobile';
type Context = 'product' | 'design';

const FRAME_W: Record<Width, number> = { desktop: 1180, tablet: 820, mobile: 390 };
const FRAME_H = 560;

/** Site selector in the top bar: a menu of sites (menuitemradio). */
const SiteMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [site, setSite] = useState(SITES[0]);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const id = useId();
  const onKeyDown = useMenuKeys(menu, open, () => setOpen(false), btn);
  useClickOutside([menu, btn], open, () => setOpen(false));
  return (
    <div className="relative">
      <button
        ref={btn}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
        className={`h-10 px-3 inline-flex items-center gap-2 rounded-[8px] text-[14px] font-medium text-[#353D4C] hover:bg-[#EEF1F6] ${FOCUS_LIGHT}`}
      >
        <Building2 className="w-4 h-4 text-[#4B5465]" aria-hidden="true" />
        <span className="sr-only">Site: </span>
        {site}
        <ChevronDown className="w-4 h-4 text-[#4B5465]" aria-hidden="true" />
      </button>
      {open && (
        <div ref={menu} id={id} role="menu" aria-label="Sites" onKeyDown={onKeyDown} className={`absolute right-0 top-full mt-2 z-50 w-[220px] py-1 rounded-[8px] bg-white border border-[#DDE2EA] ${ELEV2}`}>
          {SITES.map((s) => (
            <button
              key={s}
              type="button"
              role="menuitemradio"
              aria-checked={s === site}
              tabIndex={-1}
              onClick={() => {
                setSite(s);
                setOpen(false);
                btn.current?.focus();
              }}
              className={`w-full h-10 px-4 text-left text-[14px] hover:bg-[#F7F9FC] ${s === site ? 'text-[#1E63FF] font-medium' : 'text-[#353D4C]'} ${FOCUS_INSET}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/** Live / Paused status (toggle). */
const LiveIndicator: React.FC = () => {
  const [live, setLive] = useState(true);
  return (
    <button
      type="button"
      aria-pressed={!live}
      aria-label={live ? 'Live feed on. Pause' : 'Live feed paused. Resume'}
      onClick={() => setLive((l) => !l)}
      className={`h-10 px-2.5 inline-flex items-center gap-2 rounded-[8px] text-[12px] font-medium hover:bg-[#EEF1F6] ${live ? 'text-[#121722]' : 'text-[#4B5465]'} ${FOCUS_LIGHT}`}
    >
      <span className="relative flex w-2 h-2" aria-hidden="true">
        {live && <span className="absolute inset-0 rounded-full bg-[#00C6FF] opacity-60 motion-safe:animate-ping" />}
        <span className={`relative w-2 h-2 rounded-full ${live ? 'bg-[#00C6FF]' : 'bg-[#8C95A6]'}`} />
      </span>
      {live ? 'Live' : 'Paused'}
    </button>
  );
};

const IconWithTip: React.FC<{ label: string; icon: React.ReactNode; onClick?: () => void }> = ({ label, icon, onClick }) => (
  <Tooltip content={label} placement="bottom">
    {(tip) => (
      <button type="button" aria-label={label} aria-describedby={tip} onClick={onClick} className={ICON_BTN}>
        {icon}
      </button>
    )}
  </Tooltip>
);

interface TopBarProps {
  width: Width;
  context: Context;
  scrolled: boolean;
  onSearch: () => void;
  onMenu: () => void;
  menuOpen: boolean;
}

/** Replica top bar: 64px, White, 1px bottom border, sticky; fixed right-group order with 8px gaps. */
const TopBar: React.FC<TopBarProps> = ({ width, context, scrolled, onSearch, onMenu, menuOpen }) => {
  const desktop = width === 'desktop';
  const mobile = width === 'mobile';
  const product = context === 'product';
  const crumbs = product ? [{ label: 'Reports' }, { label: 'Vehicle log' }, { label: 'Export' }] : [{ label: 'Components' }, { label: 'Navigation' }];
  // Below 1024px help and the site selector move into the user menu (help is its "Help & support" item).
  const moved: MenuEntry[] = !desktop && product ? [{ id: 'site', label: 'Site: North campus', icon: Building2 }] : [];

  return (
    <header className={`sticky top-0 z-30 h-16 shrink-0 flex items-center gap-2 bg-white border-b border-[#DDE2EA] transition-shadow ${mobile ? 'px-4' : 'px-6'} ${scrolled ? ELEV1 : ''}`}>
      {!desktop && (
        <button type="button" onClick={onMenu} aria-label="Open menu" aria-expanded={menuOpen} className={`${ICON_BTN} -ml-2`}>
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
      <div className="flex-1 min-w-0">{mobile ? <p className="text-[16px] font-semibold text-[#121722] truncate">{crumbs[crumbs.length - 1].label}</p> : <Breadcrumbs items={crumbs} size={14} />}</div>
      <div className="flex items-center gap-2 shrink-0">
        {desktop ? (
          <button
            type="button"
            onClick={onSearch}
            aria-keyshortcuts="Control+K"
            className={`w-[320px] h-10 px-3 flex items-center gap-2 rounded-[8px] border border-[#8C95A6] bg-white text-[14px] text-[#6B7485] hover:border-[#4B5465] ${FOCUS_LIGHT}`}
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span className="flex-1 text-left">Search…</span>
            <span aria-hidden="true" className="h-6 px-1.5 inline-flex items-center rounded-[4px] bg-[#F7F9FC] border border-[#DDE2EA] font-mono text-[11px] text-[#4B5465]">
              Ctrl K
            </span>
          </button>
        ) : (
          <IconWithTip label="Search (Ctrl K)" icon={<Search className="w-5 h-5" aria-hidden="true" />} onClick={onSearch} />
        )}
        {product && desktop && <SiteMenu />}
        {product && !mobile && <LiveIndicator />}
        {desktop && <IconWithTip label="Help" icon={<HelpCircle className="w-5 h-5" aria-hidden="true" />} />}
        {product && <NotificationsButton />}
        <UserMenuButton extraItems={moved} />
      </div>
    </header>
  );
};

const code = (w: Width, c: Context, s: boolean) => `// Top bar (${w}, ${c === 'product' ? 'product app' : 'design system'}${s ? ', scrolled' : ''})
<header className="sticky top-0 z-30 h-16 flex items-center gap-2 ${w === 'mobile' ? 'px-4' : 'px-6'} bg-white border-b border-[#DDE2EA]${s ? ' shadow-[0_1px_3px_rgba(11,45,107,0.08)]' : ''}">
${w !== 'desktop' ? '  <button aria-label="Open menu" aria-expanded={open} className="w-10 h-10 rounded-[8px] text-[#4B5465] hover:bg-[#EEF1F6]"><Menu className="w-5 h-5" /></button>\n' : ''}  <div className="flex-1 min-w-0">${w === 'mobile' ? '<p className="text-[16px] font-semibold text-[#121722] truncate">Export</p>' : '<Breadcrumbs … />'}</div>
  <div className="flex items-center gap-2">
${
  w === 'desktop'
    ? `    <button onClick={openPalette} aria-keyshortcuts="Control+K" className="w-[320px] h-10 px-3 flex items-center gap-2 rounded-[8px] border border-[#8C95A6] text-[14px] text-[#6B7485]">
      <Search className="w-4 h-4" aria-hidden="true" /> <span className="flex-1 text-left">Search…</span>
      <span aria-hidden="true" className="h-6 px-1.5 rounded-[4px] bg-[#F7F9FC] border border-[#DDE2EA] font-mono text-[11px]">Ctrl K</span>
    </button>`
    : `    <button aria-label="Search (Ctrl K)" className="w-10 h-10 rounded-[8px] text-[#4B5465] hover:bg-[#EEF1F6]"><Search className="w-5 h-5" /></button>`
}
${c === 'product' && w === 'desktop' ? '    {/* site selector */}\n' : ''}${c === 'product' && w !== 'mobile' ? '    {/* live indicator: pulsing Cyan dot + "Live" */}\n' : ''}${w === 'desktop' ? '    {/* help (Ghost 40×40 + tooltip) */}\n' : ''}${c === 'product' ? '    {/* notifications bell */}\n' : ''}    {/* avatar → user menu${w !== 'desktop' ? ' (now also holds Help' + (c === 'product' ? ' and the site selector' : '') + ')' : ''} */}
  </div>
</header>`;

/** Top bar playground: width, scrolled and context controls; the frame is scaled to fit the page. */
export const TopBarPlayground: React.FC = () => {
  const [width, setWidth] = useState<Width>('desktop');
  const [scrolled, setScrolled] = useState(false);
  const [context, setContext] = useState<Context>('product');
  const [palette, setPalette] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [active, setActive] = useState('vehicle-log');
  const [avail, setAvail] = useState(FRAME_W.desktop);
  const outer = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const wName = useId();
  const cName = useId();

  useLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;
    const measure = () => setAvail(el.clientWidth);
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    // Window resizes too, in case the observer is throttled.
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // The control scrolls the content; scrolling the content updates the control.
  useEffect(() => {
    const c = content.current;
    if (!c) return;
    if (scrolled && c.scrollTop === 0) c.scrollTop = 120;
    if (!scrolled && c.scrollTop > 0) c.scrollTop = 0;
  }, [scrolled, width]);

  useEffect(() => {
    setDrawer(false);
  }, [width]);

  const fw = FRAME_W[width];
  const scale = Math.min(1, avail / fw);

  return (
    <div className="rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
      <div className="p-5 border-b border-[#DDE2EA] flex flex-wrap gap-x-8 gap-y-3">
        <fieldset>
          <legend className="mb-1.5 text-[13px] font-medium text-[#121722]">Width</legend>
          <div className="flex flex-wrap gap-x-4">
            {(
              [
                ['desktop', 'Desktop'],
                ['tablet', 'Tablet'],
                ['mobile', 'Mobile'],
              ] as [Width, string][]
            ).map(([v, l]) => (
              <label key={v} className="inline-flex items-center gap-2 min-h-[36px] text-[14px] text-[#353D4C] cursor-pointer">
                <input type="radio" name={wName} checked={width === v} onChange={() => setWidth(v)} className="w-4 h-4 accent-[#1E63FF]" />
                {l}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-1.5 text-[13px] font-medium text-[#121722]">Context</legend>
          <div className="flex flex-wrap gap-x-4">
            {(
              [
                ['product', 'Product app'],
                ['design', 'Design system'],
              ] as [Context, string][]
            ).map(([v, l]) => (
              <label key={v} className="inline-flex items-center gap-2 min-h-[36px] text-[14px] text-[#353D4C] cursor-pointer">
                <input type="radio" name={cName} checked={context === v} onChange={() => setContext(v)} className="w-4 h-4 accent-[#1E63FF]" />
                {l}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-1.5 text-[13px] font-medium text-[#121722]">State</legend>
          <label className="inline-flex items-center gap-2 min-h-[36px] text-[14px] text-[#353D4C] cursor-pointer">
            <input type="checkbox" checked={scrolled} onChange={(e) => setScrolled(e.target.checked)} className="w-4 h-4 accent-[#1E63FF]" />
            Scrolled
          </label>
        </fieldset>
      </div>

      <DemoScope
        label="Top bar playground"
        className="preview-grid-canvas p-4 md:p-6"
        onShortcut={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            setPalette((p) => !p);
            return true;
          }
          return false;
        }}
      >
        <div ref={outer} className="w-full">
          <p className="mb-2 text-[12px] text-[#6B7485]">
            Frame: {fw}px{scale < 1 ? ` · shown at ${Math.round(scale * 100)}%` : ''}
          </p>
          <div style={{ height: FRAME_H * scale }} className="relative">
            <div
              className="absolute top-0 left-0 origin-top-left rounded-[12px] border border-[#DDE2EA] bg-[#F7F9FC] overflow-hidden"
              style={{ width: fw, height: FRAME_H, transform: scale < 1 ? `scale(${scale})` : undefined }}
            >
              <div ref={content} onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)} className="absolute inset-0 overflow-y-auto">
                <TopBar width={width} context={context} scrolled={scrolled} onSearch={() => setPalette(true)} onMenu={() => setDrawer(true)} menuOpen={drawer} />
                <div className={`${width === 'mobile' ? 'p-4' : 'p-6'} space-y-3`}>
                  <p className="text-[24px] font-semibold text-[#121722]">{context === 'product' ? 'Export' : 'Navigation'}</p>
                  {Array.from({ length: 10 }, (_, i) => (
                    <span key={i} aria-hidden="true" className="block h-14 rounded-[8px] bg-white border border-[#DDE2EA]" />
                  ))}
                </div>
              </div>
              <CommandPalette open={palette} onClose={() => setPalette(false)} onSelect={() => setPalette(false)} />
              {width !== 'desktop' && <MobileDrawer open={drawer} onClose={() => setDrawer(false)} active={active} onNavigate={setActive} />}
            </div>
          </div>
        </div>
      </DemoScope>
      <div className="p-4 border-t border-[#DDE2EA] space-y-3">
        <p className="text-[13px] leading-[20px] text-[#4B5465]">
          <span className="font-semibold text-[#121722]">Use when: </span>
          every page. Same utilities in the same order everywhere; fewer of them as the screen gets narrower.
        </p>
        <CodeBlock code={code(width, context, scrolled)} language="tsx" />
      </div>
    </div>
  );
};
