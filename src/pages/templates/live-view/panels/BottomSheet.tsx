import React, { useRef, useState } from 'react';
import { useSurface } from '../surface/ControlRoomSurface';

/**
 * Bottom sheet for the activity panel on narrow screens (768–1023px): 40% of the height by default,
 * resizable by dragging the handle (or ↑ / ↓ on the focused handle) between 25% and 80%.
 */
export const BottomSheet: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => {
  const t = useSurface();
  const [pct, setPct] = useState(40);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; pct: number } | null>(null);
  const clamp = (v: number) => Math.max(25, Math.min(80, v));

  return (
    <div ref={ref} className={`absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[16px] border-t ${t.panel} shadow-[0_-4px_12px_rgba(11,45,107,0.12)]`} style={{ height: `${pct}%` }}>
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Resize ${label}`}
        aria-valuemin={25}
        aria-valuemax={80}
        aria-valuenow={pct}
        aria-valuetext={`${pct}% of the screen`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') setPct((p) => clamp(p + 5));
          else if (e.key === 'ArrowDown') setPct((p) => clamp(p - 5));
          else return;
          e.preventDefault();
        }}
        onPointerDown={(e) => {
          drag.current = { y: e.clientY, pct };
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const parent = ref.current?.parentElement;
          if (!drag.current || !parent) return;
          setPct(clamp(drag.current.pct + ((drag.current.y - e.clientY) / parent.clientHeight) * 100));
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        className={`h-6 shrink-0 flex items-center justify-center cursor-ns-resize touch-none rounded-t-[16px] ${t.focusInset}`}
      >
        <span aria-hidden="true" className={`w-10 h-1 rounded-full ${t.surface === 'control' ? 'bg-white/30' : 'bg-[#C3CAD5]'}`} />
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
};
