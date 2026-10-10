import type { LucideIcon } from 'lucide-react';

/** Helpers for ProfileSelect: positioning inside a scaled showcase frame, time detection, matching. */

export interface SelectOption {
  value: string;
  label: string;
  /** 12px second line. */
  description?: string;
  /** Right-aligned 12px mono text (counts). */
  meta?: string;
  /** 16px leading icon (Gray 600, Royal Blue when selected). */
  icon?: LucideIcon;
  /** 8px leading status dot colour class (badge tone). */
  dot?: string;
  /** Overline group heading. */
  group?: string;
  /** Screen-reader text appended to the option. */
  srText?: string;
  disabled?: boolean;
}

/**
 * The element `position: fixed` resolves against: the nearest ancestor with a transform, scale, translate,
 * filter or paint containment (the showcase frame scales the screen), or null for the viewport.
 */
export const fixedContainer = (el: HTMLElement): HTMLElement | null => {
  for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
    const s = getComputedStyle(a);
    if (
      s.transform !== 'none' ||
      s.translate !== 'none' ||
      s.scale !== 'none' ||
      s.filter !== 'none' ||
      s.perspective !== 'none' ||
      /paint|layout|strict|content/.test(s.contain) ||
      /transform|filter/.test(s.willChange)
    )
      return a;
  }
  return null;
};

/** "07:30" labels: the time variant (JetBrains Mono, scrolls to the selected value, type-ahead). */
export const isTimeList = (options: readonly SelectOption[]): boolean => options.length > 0 && options.every((o) => /^\d{2}:\d{2}$/.test(o.label));

/** Lists longer than this get a search field (time lists use type-ahead instead). */
export const SEARCH_THRESHOLD = 8;

export const matches = (o: SelectOption, q: string): boolean => {
  const s = q.trim().toLowerCase();
  return !s || o.label.toLowerCase().includes(s) || (o.description ?? '').toLowerCase().includes(s);
};

/** Splits a label around the first match for highlighting. */
export const splitMatch = (label: string, q: string): [string, string, string] | null => {
  const s = q.trim().toLowerCase();
  if (!s) return null;
  const i = label.toLowerCase().indexOf(s);
  return i < 0 ? null : [label.slice(0, i), label.slice(i, i + s.length), label.slice(i + s.length)];
};
