import React, { useState } from 'react';
import { navLabel } from '../navigationSpec';
import { SidebarDemo } from './SidebarDemo';

/** Collapsed rail (72px): centred icons, right-side tooltips, flyouts for parents, badges as dots. */
export const CollapsedRailDemo: React.FC = () => {
  const [active, setActive] = useState('vehicle-log');
  return (
    <div className="flex flex-wrap items-start gap-6">
      <SidebarDemo collapsed active={active} onNavigate={setActive} height={600} navLabel="Main (rail example)" />
      <div className="flex-1 min-w-[200px] text-[14px] text-[#4B5465] space-y-2">
        <p>
          Current page: <span className="font-semibold text-[#121722]">{navLabel(active)}</span>
        </p>
        <p>Hover or Tab through the icons: each shows its label to the right. Events, Gates and Reports open a flyout (click, Enter or →; Esc closes).</p>
      </div>
    </div>
  );
};

export const RAIL_CODE = `// Rail item: icon only, label kept for screen readers, tooltip on hover and focus (right, 8px)
<a href="/alerts" className="relative mx-2 h-10 flex items-center justify-center rounded-[8px] text-white/80 hover:bg-white/[0.06] group">
  <span className="relative">
    <Bell className="w-5 h-5" aria-hidden="true" />
    {/* badges become an 8px dot */}
    <span aria-hidden="true" className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00C6FF] ring-2 ring-[#0B2D6B]" />
  </span>
  <span className="sr-only">Alerts, 12 new</span>
  <span role="tooltip" className="absolute left-full ml-2 px-2 py-1 rounded-[6px] bg-[#121722] text-white text-[12px]
    opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-events-none">Alerts</span>
</a>

// Parent in the rail: opens a 200px flyout (white, elevation-2, 8px radius) instead of expanding inline
<div className="fixed w-[200px] py-1 rounded-[8px] bg-white border border-[#DDE2EA] shadow-[0_4px_12px_rgba(11,45,107,0.12)]">…</div>`;
