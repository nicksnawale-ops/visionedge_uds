import React from 'react';
import { Bell, Building2, ChevronDown, ChevronsUpDown, FileText, HelpCircle, LayoutDashboard, Menu, PanelLeftClose, Search, Video } from 'lucide-react';
import { Logo } from '../../../../components/brand/Logo';
import { Legend, Marker } from '../shared/Marker';

const SIDEBAR_PARTS: [string, string][] = [
  ['Header', '64px: 32px logo, product name (16px SemiBold) and caption (11px #C3CAD5).'],
  ['Site switcher', 'Optional 40px button, White 6% fill; opens a searchable list.'],
  ['Group heading', '11px Medium uppercase, #C3CAD5; a divider in the rail.'],
  ['Nav item', '40px, 8px radius, 14px Medium; active: White 10% + 3px Cyan bar.'],
  ['Icon', '20px lucide icon, 12px gap to the label.'],
  ['Badge / count', 'NEW / UPDATED pill, count (max 99+) or 8px dot.'],
  ['Nested items', '36px, 13px, indented 44px, no icons; max 2 levels.'],
  ['Scroll area', 'Only the middle scrolls; thin White 20% scrollbar.'],
  ['Footer', 'User block (opens the user menu) and Collapse sidebar.'],
];

/** Static, labelled drawing of the sidebar. */
export const SidebarAnatomy: React.FC = () => (
  <figure className="rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden">
    <div className="preview-grid-canvas p-6 md:p-10 flex justify-center">
      <div aria-hidden="true" className="relative w-[240px] bg-[#0B2D6B] text-white rounded-[8px] text-[14px]">
        <div className="relative h-16 px-4 flex items-center gap-3 border-b border-white/10">
          <Marker n={1} className="-top-2.5 -left-2.5" />
          <Logo size={32} />
          <div>
            <p className="text-[16px] font-semibold leading-5">VisionEdge</p>
            <p className="text-[11px] text-[#C3CAD5]">Campus security</p>
          </div>
        </div>
        <div className="relative px-2 pt-3">
          <Marker n={2} className="top-3 -right-2.5" />
          <div className="h-10 px-3 flex items-center gap-2 rounded-[8px] bg-white/[0.06]">
            <Building2 className="w-4 h-4 text-white/80" />
            <span className="flex-1 font-medium">North campus</span>
            <ChevronsUpDown className="w-4 h-4 text-white/60" />
          </div>
        </div>
        <div className="relative pb-2">
          <Marker n={8} className="top-1/2 -right-2.5" />
          <p className="relative pl-4 mt-6 mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#C3CAD5]">
            <Marker n={3} className="-top-0.5 -left-2.5" />
            Monitor
          </p>
          <div className="relative mx-2 h-10 px-3 flex items-center gap-3 rounded-[8px] text-white/80">
            <span className="relative">
              <LayoutDashboard className="w-5 h-5" />
              <Marker n={5} className="-bottom-4 -left-3" />
            </span>
            Dashboard
          </div>
          <div className="relative mx-2 h-10 px-3 flex items-center gap-3 rounded-[8px] text-white/80">
            <Marker n={4} className="top-2.5 -left-4" />
            <Video className="w-5 h-5" />
            <span className="flex-1">Live view</span>
            <span className="relative w-2 h-2 rounded-full bg-[#00C6FF]">
              <Marker n={6} className="-top-2 left-3" />
            </span>
          </div>
          <div className="relative mx-2 h-10 px-3 flex items-center gap-3 rounded-[8px] text-white">
            <FileText className="w-5 h-5" />
            <span className="flex-1">Reports</span>
            <ChevronDown className="w-4 h-4 text-white/60 rotate-180" />
          </div>
          <div className="relative mx-2 h-9 pl-[44px] flex items-center rounded-[8px] text-[13px] text-white/80">
            <Marker n={7} className="top-2 left-4" />
            Daily summary
          </div>
          <div className="relative mx-2 h-9 pl-[44px] flex items-center rounded-[8px] text-[13px] bg-white/10 text-white font-medium">
            <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-[#00C6FF]" />
            Vehicle log
          </div>
        </div>
        <div className="relative border-t border-white/10 py-2">
          <Marker n={9} className="-top-2.5 -left-2.5" />
          <div className="mx-2 h-12 px-2 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#1E63FF] text-[12px] font-semibold flex items-center justify-center">AK</span>
            <span>
              <span className="block font-medium">Anika Kapoor</span>
              <span className="block text-[12px] text-[#C3CAD5]">Security admin</span>
            </span>
          </div>
          <div className="mx-2 h-10 px-3 flex items-center gap-3 text-white/80">
            <PanelLeftClose className="w-5 h-5" />
            Collapse sidebar
          </div>
        </div>
      </div>
    </div>
    <figcaption className="sr-only">Sidebar anatomy. The legend below describes each numbered part.</figcaption>
    <Legend parts={SIDEBAR_PARTS} />
  </figure>
);

const TOPBAR_PARTS: [string, string][] = [
  ['Menu toggle', 'Tablet and mobile only; opens the drawer.'],
  ['Breadcrumbs or page title', 'Breadcrumbs on desktop, the page title on mobile.'],
  ['Global search', '320 × 40px with a "Ctrl K" chip; an icon below 1024px.'],
  ['Site selector', 'Current site; moves into the user menu below 1024px.'],
  ['Live / status', 'Pulsing Cyan dot + "Live"; Gray 400 + "Paused".'],
  ['Help', 'Ghost icon button with tooltip.'],
  ['Notifications', 'Bell with a Deep Navy count (max 9+).'],
  ['User menu', '32px avatar; opens profile, settings, sign out.'],
];

/** Static, labelled drawing of the top bar. */
export const TopBarAnatomy: React.FC = () => (
  <figure className="rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden">
    <div className="preview-grid-canvas p-6 md:p-10 overflow-x-auto">
      <div aria-hidden="true" className="relative min-w-[720px] h-16 px-4 flex items-center gap-2 bg-white border border-[#DDE2EA] rounded-[8px]">
        <span className="relative w-10 h-10 flex items-center justify-center text-[#4B5465]">
          <Menu className="w-5 h-5" />
          <Marker n={1} className="-top-4 left-2.5" />
        </span>
        <span className="relative flex-1 text-[14px] text-[#4B5465]">
          <Marker n={2} className="-top-6 left-0" />
          Reports <span className="mx-1 text-[#C3CAD5]">/</span> <span className="font-medium text-[#121722]">Vehicle log</span>
        </span>
        <span className="relative w-[200px] h-10 px-3 flex items-center gap-2 rounded-[8px] border border-[#8C95A6] text-[14px] text-[#6B7485]">
          <Marker n={3} className="-top-4 left-2" />
          <Search className="w-4 h-4" />
          <span className="flex-1">Search…</span>
          <span className="h-6 px-1.5 rounded-[4px] bg-[#F7F9FC] border border-[#DDE2EA] font-mono text-[11px] flex items-center">Ctrl K</span>
        </span>
        <span className="relative h-10 px-2 flex items-center gap-1.5 text-[14px] font-medium text-[#353D4C]">
          <Marker n={4} className="-top-4 left-2" />
          <Building2 className="w-4 h-4 text-[#4B5465]" /> North campus
        </span>
        <span className="relative h-10 px-2 flex items-center gap-2 text-[12px] font-medium text-[#121722]">
          <Marker n={5} className="-top-4 left-1" />
          <span className="w-2 h-2 rounded-full bg-[#00C6FF]" /> Live
        </span>
        <span className="relative w-10 h-10 flex items-center justify-center text-[#4B5465]">
          <Marker n={6} className="-top-4 left-2.5" />
          <HelpCircle className="w-5 h-5" />
        </span>
        <span className="relative w-10 h-10 flex items-center justify-center text-[#4B5465]">
          <Marker n={7} className="-top-4 left-2.5" />
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0B2D6B] text-white text-[11px] font-semibold flex items-center justify-center">3</span>
        </span>
        <span className="relative w-10 h-10 flex items-center justify-center">
          <Marker n={8} className="-top-4 left-2.5" />
          <span className="w-8 h-8 rounded-full bg-[#1E63FF] text-white text-[12px] font-semibold flex items-center justify-center">AK</span>
        </span>
      </div>
    </div>
    <figcaption className="sr-only">Top bar anatomy. The legend below describes each numbered part.</figcaption>
    <Legend parts={TOPBAR_PARTS} />
  </figure>
);
