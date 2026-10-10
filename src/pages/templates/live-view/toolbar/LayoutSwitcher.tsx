import React from 'react';
import { Grid2x2, Grid3x3, LayoutDashboard, LayoutGrid, Square } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LAYOUTS, LayoutId } from '../liveViewStates';
import { useSurface } from '../surface/ControlRoomSurface';

const ICON: Record<LayoutId, LucideIcon> = { '1': Square, '2x2': Grid2x2, '3x3': Grid3x3, '4x4': LayoutGrid, '1+5': LayoutDashboard };
const NAME: Record<LayoutId, string> = { '1': 'Single camera', '2x2': '2 × 2 grid', '3x3': '3 × 3 grid', '4x4': '4 × 4 grid', '1+5': '1 + 5 focus' };

/** Layout segmented control with icons and tooltips. Narrow screens offer only 1, 2×2 and 1+5. */
export const LayoutSwitcher: React.FC<{ value: LayoutId; allowed: LayoutId[]; onChange: (l: LayoutId) => void }> = ({ value, allowed, onChange }) => {
  const t = useSurface();
  return (
    <div role="group" aria-label="Layout" className={`inline-flex p-0.5 rounded-[8px] ${t.segment.group}`}>
      {LAYOUTS.filter((l) => allowed.includes(l.id)).map((l) => {
        const Icon = ICON[l.id];
        const on = l.id === value;
        return (
          <button key={l.id} type="button" aria-pressed={on} aria-label={NAME[l.id]} onClick={() => onChange(l.id)} className={`group/lay relative h-8 w-9 inline-flex items-center justify-center rounded-[6px] ${on ? t.segment.on : t.segment.off} ${t.focus}`}>
            <Icon className="w-4 h-4" aria-hidden="true" />
            <span role="tooltip" className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 z-30 px-2 py-1 rounded-[4px] bg-[#121722] text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover/lay:opacity-100 group-focus-visible/lay:opacity-100">
              {NAME[l.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
};
