import { useEffect, useRef } from 'react';

export type DismissReason = 'outside' | 'scroll';

/**
 * Closes a floating panel on a pointer press outside `refs`, and when any container
 * outside the panel scrolls (the panel is positioned against its trigger, so it would drift).
 */
export const useDismiss = (
  open: boolean,
  refs: ReadonlyArray<React.RefObject<HTMLElement | null>>,
  onDismiss: (reason: DismissReason) => void,
): void => {
  const cb = useRef(onDismiss);
  const refList = useRef(refs);
  useEffect(() => {
    cb.current = onDismiss;
    refList.current = refs;
  });

  useEffect(() => {
    if (!open) return;
    const inside = (target: EventTarget | null) =>
      target instanceof Node && refList.current.some((r) => r.current?.contains(target));
    const onPointer = (e: PointerEvent) => {
      if (!inside(e.target)) cb.current('outside');
    };
    const onScroll = (e: Event) => {
      if (!inside(e.target)) cb.current('scroll');
    };
    document.addEventListener('pointerdown', onPointer, true);
    document.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('pointerdown', onPointer, true);
      document.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);
};
