import React, { useState } from 'react';
import { NAV_GROUPS, navLabel } from '../navigationSpec';
import { SidebarDemo } from './SidebarDemo';

/** Nested items: max 2 levels, accordion (200ms), optional "only one parent open". */
export const NestedNavDemo: React.FC = () => {
  const [active, setActive] = useState('face-matches');
  const [single, setSingle] = useState(false);
  return (
    <div className="space-y-4">
      <label className="inline-flex items-center gap-2 min-h-[44px] text-[14px] text-[#353D4C] cursor-pointer">
        <input type="checkbox" checked={single} onChange={(e) => setSingle(e.target.checked)} className="w-4 h-4 accent-[#1E63FF]" />
        Only one parent open at a time
      </label>
      <div className="flex flex-wrap items-start gap-6">
        <SidebarDemo
          key={String(single)}
          collapsed={false}
          active={active}
          onNavigate={setActive}
          singleOpen={single}
          groups={[NAV_GROUPS[0], NAV_GROUPS[1]]}
          height={520}
          showFooter={false}
          navLabel="Main (nested example)"
        />
        <div className="flex-1 min-w-[200px] text-[14px] text-[#4B5465] space-y-2">
          <p>
            Current page: <span className="font-semibold text-[#121722]">{navLabel(active)}</span>
          </p>
          <p>The active child gets the Cyan bar; its parent shows White text and stays open. Children are 36px, 13px, indented 44px, no icons.</p>
        </div>
      </div>
    </div>
  );
};

export const NESTED_CODE = `// Nested parent: a disclosure button (aria-expanded / aria-controls), children animate open in 200ms
<li>
  <button aria-expanded={open} aria-controls="events-children"
    className="mx-2 h-10 px-3 w-[calc(100%-16px)] flex items-center gap-3 rounded-[8px] text-[14px] font-medium text-white">
    <Activity className="w-5 h-5" aria-hidden="true" />
    <span className="flex-1 text-left">Events</span>
    <ChevronDown className={'w-4 h-4 text-white/60 transition-transform duration-200 ' + (open ? 'rotate-180' : '')} aria-hidden="true" />
  </button>
  <div className={'grid transition-[grid-template-rows] duration-200 ' + (open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
    <ul id="events-children" inert={!open} className="overflow-hidden min-h-0">
      <li>
        <a href="/events/face-matches" aria-current="page"
          className="relative mx-2 h-9 pl-[44px] pr-3 flex items-center rounded-[8px] text-[13px] font-medium bg-white/10 text-white">
          <span aria-hidden="true" className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-[#00C6FF]" />
          Face matches
        </a>
      </li>
    </ul>
  </div>
</li>`;
