import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ANIMATION_MS, FOCUS_RING_CLASS } from './chartUtils';

/** Tracks an element's content width with a ResizeObserver. */
export function useElementWidth<T extends HTMLElement>(fallback = 600): [React.RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth || fallback);
    const observer = new ResizeObserver((entries) => {
      const next = Math.floor(entries[0].contentRect.width);
      if (next > 0) setWidth(next);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [fallback]);

  return [ref, width];
}

export function usePrefersReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Eased 0 → 1 progress for the entry animation (300ms ease-out), run once on mount.
 * Returns 1 immediately when the user prefers reduced motion.
 */
export function useEntryProgress(duration = ANIMATION_MS): number {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(1 - (1 - t) ** 3); // ease-out cubic
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []); // Animate on first render only.

  return progress;
}

export interface Point {
  x: number;
  y: number;
}

export interface ActiveMark<K> extends Point {
  key: K;
}

export interface MarkBindings {
  tabIndex: number;
  'aria-label': string;
  className: string;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

/**
 * Shared hover/focus state for a chart: which mark is active and where its tooltip goes.
 * The tooltip follows the cursor on hover and anchors to the mark on keyboard focus.
 */
export function useChartInteraction<K>() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ActiveMark<K> | null>(null);

  const pointFromEvent = useCallback((e: React.MouseEvent): Point => {
    const rect = containerRef.current?.getBoundingClientRect();
    return rect ? { x: e.clientX - rect.left, y: e.clientY - rect.top } : { x: 0, y: 0 };
  }, []);

  const bind = useCallback(
    (key: K, anchor: Point, label: string, extraClass = ''): MarkBindings => ({
      tabIndex: 0,
      'aria-label': label,
      className: `${extraClass} ${FOCUS_RING_CLASS}`.trim(),
      onMouseEnter: (e) => setActive({ key, ...pointFromEvent(e) }),
      onMouseMove: (e) => setActive({ key, ...pointFromEvent(e) }),
      onMouseLeave: () => setActive(null),
      onFocus: () => setActive({ key, ...anchor }),
      onBlur: () => setActive(null),
    }),
    [pointFromEvent]
  );

  /** Mouse-only bindings for invisible hit areas (e.g. a column band behind a point). */
  const hover = useCallback(
    (key: K) => ({
      onMouseEnter: (e: React.MouseEvent) => setActive({ key, ...pointFromEvent(e) }),
      onMouseMove: (e: React.MouseEvent) => setActive({ key, ...pointFromEvent(e) }),
      onMouseLeave: () => setActive(null),
    }),
    [pointFromEvent]
  );

  return { containerRef, active, setActive, bind, hover, pointFromEvent };
}
