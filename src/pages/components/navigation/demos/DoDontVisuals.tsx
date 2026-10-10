import React from 'react';
import { Bell, FileText, HelpCircle, LayoutDashboard, Search, Settings, Video } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DoDontPair } from '../../../../components/common/DoDont';

/* Decorative mini visuals (aria-hidden); the pair's text carries the meaning. */

const Navy: React.FC<{ children: React.ReactNode; w?: string }> = ({ children, w = 'w-48' }) => (
  <div aria-hidden="true" className={`${w} bg-[#0B2D6B] rounded-[8px] p-2 space-y-1`}>
    {children}
  </div>
);

const Item: React.FC<{ label: string; icon?: LucideIcon; active?: boolean; child?: boolean; indent?: number; white?: boolean }> = ({ label, icon: Icon, active, child, indent = 0, white }) => (
  <div
    className={`relative h-7 flex items-center gap-2 rounded-[6px] text-[12px] ${child ? 'pl-7' : 'px-2'} ${active ? 'bg-white/10 text-white font-medium' : white ? 'text-white' : 'text-white/80'}`}
    style={indent ? { paddingLeft: 8 + indent * 16 } : undefined}
  >
    {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#00C6FF]" />}
    {Icon && <Icon className="w-3.5 h-3.5" />}
    {label}
  </div>
);

const Rail: React.FC<{ tooltip?: boolean }> = ({ tooltip }) => (
  <div aria-hidden="true" className="relative flex items-start gap-2">
    <div className="w-11 bg-[#0B2D6B] rounded-[8px] py-2 flex flex-col items-center gap-1.5">
      {[LayoutDashboard, Video, Bell, FileText].map((I, i) => (
        <span key={i} className={`relative w-8 h-7 rounded-[6px] flex items-center justify-center ${i === 2 ? 'bg-white/10 text-white' : 'text-white/80'}`}>
          <I className="w-3.5 h-3.5" />
        </span>
      ))}
    </div>
    {tooltip && <span className="mt-[52px] px-2 py-1 rounded-[6px] bg-[#121722] text-white text-[11px]">Alerts</span>}
  </div>
);

const Bar: React.FC<{ order: ('search' | 'bell' | 'help' | 'avatar')[] }> = ({ order }) => (
  <div aria-hidden="true" className="w-56 h-10 px-2 flex items-center gap-1.5 rounded-[8px] bg-white border border-[#DDE2EA]">
    <span className="mr-auto h-1.5 w-12 rounded bg-[#C3CAD5]" />
    {order.map((k) =>
      k === 'search' ? (
        <span key={k} className="w-16 h-6 rounded-[4px] border border-[#8C95A6] flex items-center px-1">
          <Search className="w-3 h-3 text-[#6B7485]" />
        </span>
      ) : k === 'avatar' ? (
        <span key={k} className="w-5 h-5 rounded-full bg-[#1E63FF]" />
      ) : k === 'bell' ? (
        <Bell key={k} className="w-3.5 h-3.5 text-[#4B5465]" />
      ) : (
        <HelpCircle key={k} className="w-3.5 h-3.5 text-[#4B5465]" />
      )
    )}
  </div>
);

const Crumbs: React.FC<{ wrap?: boolean }> = ({ wrap }) => (
  <div aria-hidden="true" className={`w-52 p-2 rounded-[8px] bg-white border border-[#DDE2EA] text-[11px] text-[#4B5465] ${wrap ? '' : 'whitespace-nowrap'}`}>
    {wrap ? (
      <>
        Gates <span className="text-[#C3CAD5]">/</span> North campus <span className="text-[#C3CAD5]">/</span> Cluster North-04 <span className="text-[#C3CAD5]">/</span> Gate 2 <span className="text-[#C3CAD5]">/</span> Cameras{' '}
        <span className="text-[#C3CAD5]">/</span> <span className="text-[#121722] font-medium">Optical calibration</span>
      </>
    ) : (
      <>
        Gates <span className="text-[#C3CAD5]">/</span> <span className="px-1 rounded bg-[#EEF1F6]">…</span> <span className="text-[#C3CAD5]">/</span> Cameras <span className="text-[#C3CAD5]">/</span>{' '}
        <span className="text-[#121722] font-medium">Optical calibration</span>
      </>
    )}
  </div>
);

/** The seven navigation Do & Don't pairs (added to the two existing cards). */
export const DoDontVisuals: React.FC = () => (
  <div>
    <DoDontPair
      doTitle="Do keep exactly one active item"
      doDescription="The current page is highlighted once. Its parent only shows White text."
      doExample={
        <Navy>
          <Item label="Reports" icon={FileText} white />
          <Item label="Vehicle log" child active />
        </Navy>
      }
      dontTitle="Don't highlight a parent and a child separately"
      dontDescription="Two highlighted items make it unclear which page you're on."
      dontExample={
        <Navy>
          <Item label="Reports" icon={FileText} active />
          <Item label="Vehicle log" child active />
        </Navy>
      }
    />
    <DoDontPair
      doTitle="Do show tooltips for every rail item"
      doDescription="In the collapsed rail, every icon shows its label on hover and focus."
      doExample={<Rail tooltip />}
      dontTitle="Don't leave icon-only items unlabelled"
      dontDescription="Without tooltips or accessible names, people have to guess what each icon does."
      dontExample={<Rail />}
    />
    <DoDontPair
      doTitle="Do limit nesting to 2 levels"
      doDescription="A parent and its children. Deeper structure belongs on the page."
      doExample={
        <Navy>
          <Item label="Reports" icon={FileText} white />
          <Item label="Daily summary" child />
          <Item label="Vehicle log" child active />
        </Navy>
      }
      dontTitle="Don't build 3-level menus in the sidebar"
      dontDescription="Third levels push labels off the edge and are hard to scan."
      dontExample={
        <Navy>
          <Item label="Reports" icon={FileText} />
          <Item label="Vehicles" indent={1} />
          <Item label="Entry logs" indent={2} />
          <Item label="Gate 2" indent={3} />
        </Navy>
      }
    />
    <DoDontPair
      doTitle="Do keep top-bar utilities in the same order"
      doDescription="Search → site → live → help → notifications → avatar, on every page."
      doExample={
        <div className="space-y-2">
          <Bar order={['search', 'help', 'bell', 'avatar']} />
          <Bar order={['search', 'help', 'bell', 'avatar']} />
        </div>
      }
      dontTitle="Don't move search or notifications per module"
      dontDescription="People learn where things are; moving them breaks that."
      dontExample={
        <div className="space-y-2">
          <Bar order={['search', 'help', 'bell', 'avatar']} />
          <Bar order={['bell', 'avatar', 'search', 'help']} />
        </div>
      }
    />
    <DoDontPair
      doTitle="Do collapse long breadcrumbs"
      doDescription='Show the first level, "…", the parent and the current page.'
      doExample={<Crumbs />}
      dontTitle="Don't let breadcrumbs wrap to two lines"
      dontDescription="Wrapped breadcrumbs push the page down and are hard to read."
      dontExample={<Crumbs wrap />}
    />
    <DoDontPair
      doTitle="Do use a back link on detail pages"
      doDescription='"← Back to vehicle log" returns to the list with its filters and scroll kept.'
      doExample={
        <div aria-hidden="true" className="w-52 p-3 rounded-[8px] bg-white border border-[#DDE2EA]">
          <span className="block text-[11px] font-medium text-[#1E63FF]">← Back to vehicle log</span>
          <span className="mt-1 block text-[14px] font-semibold text-[#121722]">KA 01 AB 1234</span>
        </div>
      }
      dontTitle="Don't rely on the browser back button alone"
      dontDescription="It may leave the app, lose filters, or not exist in a kiosk view."
      dontExample={
        <div aria-hidden="true" className="w-52 p-3 rounded-[8px] bg-white border border-[#DDE2EA]">
          <span className="block text-[14px] font-semibold text-[#121722]">KA 01 AB 1234</span>
          <span className="mt-1 block h-1.5 w-28 rounded bg-[#DDE2EA]" />
        </div>
      }
    />
    <DoDontPair
      doTitle="Do put Settings and Help at the bottom"
      doDescription="Utility links sit in a pinned area above the user block."
      doExample={
        <Navy>
          <Item label="Dashboard" icon={LayoutDashboard} active />
          <Item label="Live view" icon={Video} />
          <div className="my-1 h-px bg-white/10" />
          <Item label="Settings" icon={Settings} />
          <Item label="Help" icon={HelpCircle} />
        </Navy>
      }
      dontTitle="Don't mix utility links into primary navigation"
      dontDescription="Settings between Dashboard and Live view dilutes the main areas."
      dontExample={
        <Navy>
          <Item label="Dashboard" icon={LayoutDashboard} active />
          <Item label="Settings" icon={Settings} />
          <Item label="Live view" icon={Video} />
          <Item label="Help" icon={HelpCircle} />
        </Navy>
      }
    />
  </div>
);
