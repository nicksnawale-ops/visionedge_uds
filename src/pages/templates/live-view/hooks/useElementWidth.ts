import { useEffect, useState } from 'react';

/**
 * Width of an element (the template root). The showcase renders the screen at the device's real width and
 * scales it down, so layout decisions follow the screen's own width, not the browser viewport.
 */
export function useElementWidth(ref: React.RefObject<HTMLElement | null>, fallback = 1200): number {
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => setWidth(el.clientWidth)) : null;
    ro?.observe(el);
    const onResize = () => setWidth(el.clientWidth);
    window.addEventListener('resize', onResize);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [ref]);
  return width;
}

export type ScreenSize = 'wide' | 'medium' | 'narrow' | 'mobile';

/**
 * Content-area width → layout. With the product shell's sidebar: 1440 → ~1200 (wide), 1024 → ~952 (medium),
 * 768 → ~696 (narrow), 390 → 390 (mobile).
 */
export const screenSize = (w: number): ScreenSize => (w >= 1150 ? 'wide' : w >= 900 ? 'medium' : w >= 640 ? 'narrow' : 'mobile');
