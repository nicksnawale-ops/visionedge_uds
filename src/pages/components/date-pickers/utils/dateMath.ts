/**
 * Calendar math on plain local-midnight Date objects (native Date only, no library).
 * Dates are calendar days; times of day are kept separately as minutes after midnight.
 */

/**
 * "Today" in every demo is fixed to 30 Sep 2026 so screenshots, presets and disabled
 * future dates look the same on every visit. In a product, use the current date in IST.
 */
export const TODAY = new Date(2026, 8, 30);

const DAY_MS = 86_400_000;

export const pad2 = (n: number): string => String(n).padStart(2, '0');

export const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, n: number): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export const daysInMonth = (year: number, month: number): number => new Date(year, month + 1, 0).getDate();

/** Adds months and clamps the day (31 Jan + 1 month = 28/29 Feb). */
export const addMonths = (d: Date, n: number): Date => {
  const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const day = Math.min(d.getDate(), daysInMonth(first.getFullYear(), first.getMonth()));
  return new Date(first.getFullYear(), first.getMonth(), day);
};

export const addYears = (d: Date, n: number): Date => addMonths(d, n * 12);

export const startOfMonth = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), 1);

export const endOfMonth = (d: Date): Date => new Date(d.getFullYear(), d.getMonth() + 1, 0);

/** Weeks start on Monday. */
export const startOfWeek = (d: Date): Date => addDays(d, -((d.getDay() + 6) % 7));

export const endOfWeek = (d: Date): Date => addDays(startOfWeek(d), 6);

export const isSameDay = (a: Date | null | undefined, b: Date | null | undefined): boolean =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const isSameMonth = (a: Date, b: Date): boolean => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** Negative when a is before b, 0 on the same day, positive after. */
export const compareDay = (a: Date, b: Date): number => startOfDay(a).getTime() - startOfDay(b).getTime();

/** Whole days from a to b (rounded, so DST shifts in the viewer's zone don't matter). */
export const diffDays = (a: Date, b: Date): number => Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS);

export const clampDate = (d: Date, min?: Date, max?: Date): Date => {
  if (min && compareDay(d, min) < 0) return startOfDay(min);
  if (max && compareDay(d, max) > 0) return startOfDay(max);
  return d;
};

/** Six Monday-first weeks covering the month, so the calendar height never jumps. */
export const monthMatrix = (month: Date): Date[][] => {
  const first = startOfWeek(startOfMonth(month));
  return Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, i) => addDays(first, w * 7 + i)));
};

export const dateKey = (d: Date): string => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;
export const WEEKDAYS_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

/** Minutes after midnight for every step in the day (15-minute steps by default). */
export const timeSteps = (step = 15): number[] => Array.from({ length: Math.floor(1440 / step) }, (_, i) => i * step);
