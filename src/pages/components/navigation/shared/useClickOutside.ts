import { useEffect, useRef } from 'react';

/** Calls `onOutside` on a pointer press outside every given element while `active`. Listener removed on cleanup. */
export function useClickOutside(refs: React.RefObject<HTMLElement | null>[], active: boolean, onOutside: () => void) {
  const cb = useRef(onOutside);
  cb.current = onOutside;
  useEffect(() => {
    if (!active) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (refs.some((r) => r.current?.contains(t))) return;
      cb.current();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [active]); // Element refs are stable.
}
