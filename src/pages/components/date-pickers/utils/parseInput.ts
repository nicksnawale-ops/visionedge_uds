import { daysInMonth, pad2 } from './dateMath';

export const DATE_FORMAT_ERROR = 'Enter a date in DD/MM/YYYY format';
export const TIME_FORMAT_ERROR = 'Enter a time in HH:MM format';
export const DATETIME_FORMAT_ERROR = 'Enter a date and time as DD/MM/YYYY HH:MM';

/**
 * Keeps only digits and inserts separators as the user types ("3009" -> "30/09/").
 * Backspacing over an auto-inserted separator also removes the digit before it.
 */
const mask = (next: string, prev: string, maxDigits: number, seps: Record<number, string>): string => {
  let digits = next.replace(/\D/g, '').slice(0, maxDigits);
  const deleting = next.length < prev.length;
  if (deleting && prev.startsWith(next) && /\D$/.test(prev)) digits = digits.slice(0, -1);
  let out = '';
  for (let i = 0; i < digits.length; i += 1) {
    out += digits[i];
    const sep = seps[i + 1];
    if (sep && i + 1 < maxDigits && (i + 1 < digits.length || !deleting)) out += sep;
  }
  return out;
};

export const maskDate = (next: string, prev = ''): string => mask(next, prev, 8, { 2: '/', 4: '/' });
export const maskTime = (next: string, prev = ''): string => mask(next, prev, 4, { 2: ':' });
export const maskDateTime = (next: string, prev = ''): string => mask(next, prev, 12, { 2: '/', 4: '/', 8: ' ', 10: ':' });

/** "30/09/2026" -> Date, or null when it isn't a real calendar date. */
export const parseDate = (text: string): Date | null => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text.trim());
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]) - 1;
  const year = Number(m[3]);
  if (year < 1900 || year > 2100 || month < 0 || month > 11 || day < 1 || day > daysInMonth(year, month)) return null;
  return new Date(year, month, day);
};

/** "14:05" -> 845 minutes, or null. Typed entry is always 24-hour. */
export const parseTime = (text: string): number | null => {
  const m = /^(\d{2}):(\d{2})$/.exec(text.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
};

export const parseDateTime = (text: string): { date: Date; minutes: number } | null => {
  const m = /^(\S+) (\S+)$/.exec(text.trim());
  if (!m) return null;
  const date = parseDate(m[1]);
  const minutes = parseTime(m[2]);
  return date && minutes !== null ? { date, minutes } : null;
};

export const toInputDate = (d: Date): string => `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
export const toInputTime = (minutes: number): string => `${pad2(Math.floor(minutes / 60))}:${pad2(minutes % 60)}`;
export const toInputDateTime = (d: Date, minutes: number): string => `${toInputDate(d)} ${toInputTime(minutes)}`;
