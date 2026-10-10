import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { fixedPoint } from './fixedPosition';

interface SideTooltipProps {
  content: string;
  /** Receives the tooltip id for aria-describedby. */
  children: (describedBy: string) => React.ReactNode;
  /** Hide entirely (e.g. expanded sidebar, where the label is visible). */
  disabled?: boolean;
  className?: string;
}

/**
 * Tooltip to the RIGHT of a rail item (8px offset), on hover and keyboard focus. Positioned with `fixed`
 * so the rail's scroll area can't clip it; repositions on scroll/resize while shown. Esc hides it.
 */
export const SideTooltip: React.FC<SideTooltipProps> = ({ content, children, disabled = false, className = '' }) => {
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const place = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // Measure the item itself (not this wrapper, which includes the item's side margin).
    const target = (el.firstElementChild as HTMLElement | null) ?? el;
    const r = target.getBoundingClientRect();
    setPos(fixedPoint(el, r.right + 8, r.top + r.height / 2));
  }, []);
  const hide = useCallback(() => setPos(null), []);

  useEffect(() => {
    if (!pos) return;
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [pos, place]);

  if (disabled) return <>{children('')}</>;

  return (
    <span
      ref={ref}
      className={`relative flex ${className}`}
      onPointerEnter={place}
      onPointerLeave={hide}
      onFocus={(e) => {
        if ((e.target as HTMLElement).matches(':focus-visible')) place();
      }}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && pos) hide();
      }}
    >
      {children(id)}
      <span
        id={id}
        role="tooltip"
        className={`fixed z-[60] -translate-y-1/2 px-2 py-1 rounded-[6px] bg-[#121722] text-white text-[12px] font-medium whitespace-nowrap pointer-events-none ${pos ? '' : 'hidden'}`}
        style={pos ? { top: pos.top, left: pos.left } : undefined}
      >
        {content}
      </span>
    </span>
  );
};
