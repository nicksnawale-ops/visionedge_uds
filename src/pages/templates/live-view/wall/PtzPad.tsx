import React, { useEffect, useRef } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Home, X, ZoomIn, ZoomOut } from 'lucide-react';

const BTN =
  'w-8 h-8 inline-flex items-center justify-center rounded-[6px] text-white bg-black/60 hover:bg-white/20 outline-none focus-visible:ring-2 focus-visible:ring-[#00C6FF]';

/** On-tile PTZ pad: pan/tilt arrows, home, zoom in/out. Arrow keys move too; Esc closes. */
export const PtzPad: React.FC<{ camera: string; onMove: (action: string) => void; onClose: () => void }> = ({ camera, onMove, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('button')?.focus();
  }, []);
  const key = (e: React.KeyboardEvent) => {
    const map: Record<string, string> = { ArrowUp: 'Tilt up', ArrowDown: 'Tilt down', ArrowLeft: 'Pan left', ArrowRight: 'Pan right', '+': 'Zoom in', '-': 'Zoom out' };
    if (map[e.key]) {
      e.preventDefault();
      e.stopPropagation();
      onMove(map[e.key]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };
  const b = (label: string, Icon: React.FC<{ className?: string }>, cls = '') => (
    <button type="button" aria-label={label} onClick={() => (Icon === X ? onClose() : onMove(label))} className={`${BTN} ${cls}`}>
      <Icon className="w-4 h-4" aria-hidden="true" />
    </button>
  );
  return (
    <div
      ref={ref}
      role="group"
      aria-label={`PTZ controls for ${camera}. Arrow keys pan and tilt, plus and minus zoom.`}
      onKeyDown={key}
      onDoubleClick={(e) => e.stopPropagation()}
      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-[8px] bg-black/60 grid grid-cols-3 gap-1"
    >
      <span />
      {b('Tilt up', ArrowUp)}
      {b('Close PTZ controls', X)}
      {b('Pan left', ArrowLeft)}
      {b('Home position', Home)}
      {b('Pan right', ArrowRight)}
      {b('Zoom out', ZoomOut)}
      {b('Tilt down', ArrowDown)}
      {b('Zoom in', ZoomIn)}
    </div>
  );
};
