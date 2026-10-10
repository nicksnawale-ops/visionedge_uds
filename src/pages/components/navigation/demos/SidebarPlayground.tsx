import React, { useEffect, useId, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { CodeBlock } from '../../../../components/common/CodeBlock';
import { navLabel } from '../navigationSpec';
import { DemoScope } from '../shared/DemoScope';
import { ICON_BTN } from '../shared/navStyles';
import { DEFAULT_OPTIONS, SIDEBAR_CODE, SidebarDemo, SidebarOptions } from './SidebarDemo';
import { MobileDrawer } from './MobileNavDemo';

type Mode = 'expanded' | 'collapsed' | 'drawer';

/** The demo's own key: the real sidebar's saved state is never read or written. */
const STORAGE_KEY = 've_demo_nav_collapsed';

const readCollapsed = (): boolean => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};
const saveCollapsed = (v: boolean) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(v));
  } catch {
    // Storage unavailable (private mode): the demo still works for this visit.
  }
};

const TOGGLES: { key: keyof SidebarOptions; label: string }[] = [
  { key: 'nested', label: 'Nested items' },
  { key: 'badges', label: 'Badges' },
  { key: 'headings', label: 'Group headings' },
  { key: 'siteSwitcher', label: 'Site switcher' },
  { key: 'longList', label: 'Long-list scroll' },
];

const buildCode = (mode: Mode, o: SidebarOptions) =>
  `// Current playground settings
// mode: ${mode === 'drawer' ? 'mobile drawer (280px, over a scrim)' : mode === 'collapsed' ? 'collapsed rail (72px)' : 'expanded (240px)'}
// nested: ${o.nested} · badges: ${o.badges} · group headings: ${o.headings} · site switcher: ${o.siteSwitcher} · long list: ${o.longList}
// Collapse state is saved in localStorage; Ctrl + B toggles it.

${SIDEBAR_CODE}`;

/** Sidebar playground: mode and option controls, a live replica, and the matching code. */
export const SidebarPlayground: React.FC = () => {
  const [mode, setMode] = useState<Mode>(() => (readCollapsed() ? 'collapsed' : 'expanded'));
  const [options, setOptions] = useState<SidebarOptions>(DEFAULT_OPTIONS);
  const [active, setActive] = useState('vehicle-log');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const modeName = useId();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (mode !== 'drawer') saveCollapsed(mode === 'collapsed');
  }, [mode]);

  const toggleCollapse = () => setMode((m) => (m === 'collapsed' ? 'expanded' : 'collapsed'));

  return (
    <div className="rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
      <div className="p-5 border-b border-[#DDE2EA] grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-8 gap-y-4">
        <fieldset>
          <legend className="mb-1.5 text-[13px] font-medium text-[#121722]">Mode</legend>
          <div className="flex flex-wrap gap-x-4">
            {(
              [
                ['expanded', 'Expanded'],
                ['collapsed', 'Collapsed rail'],
                ['drawer', 'Mobile drawer'],
              ] as [Mode, string][]
            ).map(([m, l]) => (
              <label key={m} className="inline-flex items-center gap-2 min-h-[36px] text-[14px] text-[#353D4C] cursor-pointer">
                <input type="radio" name={modeName} checked={mode === m} onChange={() => setMode(m)} className="w-4 h-4 accent-[#1E63FF]" />
                {l}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-1.5 text-[13px] font-medium text-[#121722]">Options</legend>
          <div className="flex flex-wrap gap-x-5">
            {TOGGLES.map((t) => (
              <label key={t.key} className="inline-flex items-center gap-2 min-h-[36px] text-[14px] text-[#353D4C] cursor-pointer">
                <input type="checkbox" checked={options[t.key]} onChange={(e) => setOptions((o) => ({ ...o, [t.key]: e.target.checked }))} className="w-4 h-4 accent-[#1E63FF]" />
                {t.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <DemoScope
        label="Sidebar playground"
        className="preview-grid-canvas p-4 md:p-8 overflow-x-auto"
        onShortcut={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b' && mode !== 'drawer') {
            toggleCollapse();
            return true;
          }
          return false;
        }}
      >
        {mode === 'drawer' ? (
          <div className="mx-auto w-full max-w-[390px] h-[600px] relative rounded-[16px] border border-[#DDE2EA] bg-[#F7F9FC] overflow-hidden flex flex-col">
            <div className="h-16 shrink-0 px-2 flex items-center gap-1 bg-white border-b border-[#DDE2EA]">
              <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open menu" aria-expanded={drawerOpen} className={ICON_BTN}>
                <Menu className="w-5 h-5" aria-hidden="true" />
              </button>
              <p className="text-[16px] font-semibold text-[#121722]">{navLabel(active)}</p>
            </div>
            <p className="p-4 text-[14px] text-[#4B5465]">Tap the menu button. Close with the scrim, Esc, a swipe left, or by choosing a page.</p>
            <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} active={active} onNavigate={setActive} options={options} />
          </div>
        ) : (
          <div className="flex min-w-[560px] rounded-[12px] border border-[#DDE2EA] bg-white overflow-visible">
            <SidebarDemo
              collapsed={mode === 'collapsed'}
              options={options}
              active={active}
              onNavigate={setActive}
              onToggleCollapse={toggleCollapse}
              height={options.longList ? 480 : 640}
              navLabel="Main (demo)"
            />
            <div className="flex-1 min-w-0 p-6">
              <p className="text-[12px] text-[#4B5465]">Current page</p>
              <p className="mt-1 text-[20px] font-semibold text-[#121722]" aria-live="polite">
                {navLabel(active)}
              </p>
              <ul className="mt-4 space-y-1.5 text-[13px] text-[#4B5465] list-disc pl-5">
                <li>Tab into the sidebar; Enter or Space opens a parent.</li>
                <li>Ctrl + B collapses or expands (while focus is in this demo).</li>
                <li>In the rail, hover or focus an icon for its label; → opens a flyout.</li>
              </ul>
            </div>
          </div>
        )}
      </DemoScope>
      <div className="p-4 border-t border-[#DDE2EA] space-y-3">
        <p className="text-[13px] leading-[20px] text-[#4B5465]">
          <span className="font-semibold text-[#121722]">Use when: </span>
          the product has more than a handful of top-level areas. Expanded on desktop, rail when people need room, drawer below 768px.
        </p>
        <CodeBlock code={buildCode(mode, options)} language="tsx" />
      </div>
    </div>
  );
};
