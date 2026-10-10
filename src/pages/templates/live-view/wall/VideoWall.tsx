import React, { useRef } from 'react';
import { LayoutId, getLayout } from '../liveViewStates';

export interface SlotGridProps {
  tabIndex: number;
  onGridKey: (e: React.KeyboardEvent) => void;
}

interface VideoWallProps {
  layout: LayoutId;
  slotCount: number;
  selectedSlot: number;
  onSelectSlot: (slot: number) => void;
  renderSlot: (slot: number, grid: SlotGridProps) => React.ReactNode;
  /** Accessible name, e.g. "Video wall, 3×3, 9 cameras". */
  label: string;
}

/**
 * Video wall: tiles per layout with 8px gaps. 1+5 puts the first tile at 2×2 with 5 tiles around it.
 * ARIA grid with a roving tabindex: arrow keys move between tiles, Home/End jump to the ends.
 */
export const VideoWall: React.FC<VideoWallProps> = ({ layout, slotCount, selectedSlot, onSelectSlot, renderSlot, label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const meta = getLayout(layout);
  const cols = meta.cols;

  const move = (to: number) => {
    const next = Math.max(0, Math.min(slotCount - 1, to));
    onSelectSlot(next);
    ref.current?.querySelector<HTMLElement>(`[data-slot="${next}"]`)?.focus();
  };
  const onGridKey = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: selectedSlot + 1, ArrowLeft: selectedSlot - 1, ArrowDown: selectedSlot + cols, ArrowUp: selectedSlot - cols, Home: 0, End: slotCount - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    move(keys[e.key]);
  };

  const rows: number[][] = [];
  for (let i = 0; i < slotCount; i += cols) rows.push(Array.from({ length: Math.min(cols, slotCount - i) }, (_, k) => i + k));

  const gridCls =
    layout === '1'
      ? 'grid-cols-1'
      : layout === '2x2'
        ? 'grid-cols-2'
        : layout === '3x3' || layout === '1+5'
          ? 'grid-cols-3'
          : 'grid-cols-4';

  return (
    <div ref={ref} role="grid" aria-label={label} className={`grid ${gridCls} gap-2 content-start`}>
      {rows.map((row, r) => (
        <div key={r} role="row" className="contents">
          {row.map((slot) => (
            <div key={slot} className={layout === '1+5' && slot === 0 ? 'col-span-2 row-span-2' : ''} style={layout === '1+5' && slot === 0 ? { gridRow: '1 / span 2' } : undefined}>
              {renderSlot(slot, { tabIndex: slot === selectedSlot ? 0 : -1, onGridKey })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
