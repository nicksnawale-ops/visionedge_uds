import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { focusInitial, panelKeyDown } from './focus';

interface BottomSheetProps {
  label: string;
  id?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const DISMISS_DRAG = 80;

/** Mobile (<768px) home for every picker: full width, 16px top radius, drag handle, modal. */
export const BottomSheet: React.FC<BottomSheetProps> = ({ label, id, onClose, children }) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; pointerId: number } | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (sheetRef.current) focusInitial(sheetRef.current);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { startY: e.clientY, pointerId: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (drag.current) setOffset(Math.max(0, e.clientY - drag.current.startY));
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    e.currentTarget.releasePointerCapture(drag.current.pointerId);
    drag.current = null;
    if (offset > DISMISS_DRAG) onClose();
    else setOffset(0);
  };

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" onClick={onClose} />
      <div
        ref={sheetRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onKeyDown={(e) => panelKeyDown(e, sheetRef.current, true, onClose)}
        style={{ transform: offset ? `translateY(${offset}px)` : undefined }}
        className={`absolute inset-x-0 bottom-0 max-h-[88vh] flex flex-col rounded-t-[16px] bg-white shadow-[0_12px_32px_rgba(11,45,107,0.18)] ${drag.current ? '' : 'transition-transform'}`}
      >
        <div
          aria-hidden="true"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="flex justify-center pt-2 pb-1 cursor-grab touch-none"
        >
          <span className="w-10 h-1 rounded-full bg-[#C3CAD5]" />
        </div>
        <div className="flex items-center justify-between pl-4 pr-2 pb-1">
          <h2 className="text-[16px] leading-[24px] font-semibold text-[#121722]">{label}</h2>
          <IconButton icon={X} label="Close" touch onClick={onClose} />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
