import { useEffect, useRef } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface Options {
  /** Element to focus first (defaults to the first focusable element). */
  initial?: React.RefObject<HTMLElement | null>;
  onEscape?: () => void;
  /** Return focus to the element that was focused before activation. Default true. */
  restore?: boolean;
}

/**
 * Traps Tab inside `ref` while `active`, closes on Esc, and returns focus to whatever opened it.
 * The keydown listener is attached to the container (not the window), so it never sees the real app's keys.
 */
export function useFocusTrap(ref: React.RefObject<HTMLElement | null>, active: boolean, { initial, onEscape, restore = true }: Options = {}) {
  const escRef = useRef(onEscape);
  escRef.current = onEscape;

  useEffect(() => {
    const el = ref.current;
    if (!active || !el) return;
    const trigger = document.activeElement as HTMLElement | null;
    const first = initial?.current ?? el.querySelector<HTMLElement>(FOCUSABLE) ?? el;
    first.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && escRef.current) {
        e.preventDefault();
        e.stopPropagation();
        escRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    el.addEventListener('keydown', onKey);
    return () => {
      el.removeEventListener('keydown', onKey);
      if (restore && trigger?.isConnected) trigger.focus();
    };
  }, [active]); // Runs on open/close only; options are read through refs.
}
