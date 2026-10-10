import { isSameDay, pad2 } from './dateMath';

/**
 * Display formats. All VisionEdge times are shown in IST and sent as ISO 8601 with the offset:
 *   toIsoIST(new Date(2026, 8, 30), 14 * 60 + 5)  // "2026-09-30T14:05:00+05:30"
 */
export const TZ_SHORT = 'IST';
export const TZ_LABEL = 'IST (UTC+05:30)';
export const TZ_OFFSET = '+05:30';

/** Fixed three-letter months ("Sep", never "Sept"), independent of the browser's locale data. */
export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const longMonth = new Intl.DateTimeFormat('en-GB', { month: 'long' });
const longDay = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export const monthName = (month: number): string => longMonth.format(new Date(2026, month, 1));

/** "September 2026" (calendar header, announcements). */
export const formatMonthLong = (d: Date): string => `${monthName(d.getMonth())} ${d.getFullYear()}`;

/** "Sep 2026" */
export const formatMonth = (year: number, month: number): string => `${MONTHS_SHORT[month]} ${year}`;

/** "30 Sep 2026" */
export const formatDate = (d: Date): string => `${pad2(d.getDate())} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;

/** "01 Sep – 30 Sep 2026" (year once), "28 Dec 2025 – 03 Jan 2026" across years. */
export const formatRange = (start: Date | null, end: Date | null): string => {
  if (!start) return '';
  if (!end || isSameDay(start, end)) return formatDate(start);
  if (start.getFullYear() === end.getFullYear()) return `${pad2(start.getDate())} ${MONTHS_SHORT[start.getMonth()]} – ${formatDate(end)}`;
  return `${formatDate(start)} – ${formatDate(end)}`;
};

/** "14:05" (24-hour default) or "2:05 PM". */
export const formatTime = (minutes: number, hour12 = false): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!hour12) return `${pad2(h)}:${pad2(m)}`;
  return `${h % 12 || 12}:${pad2(m)} ${h < 12 ? 'AM' : 'PM'}`;
};

/** "30 Sep 2026, 14:05" */
export const formatDateTime = (d: Date, minutes: number, hour12 = false): string => `${formatDate(d)}, ${formatTime(minutes, hour12)}`;

/** "Wednesday 30 September 2026" (screen-reader labels for day cells). */
export const formatDayLabel = (d: Date): string => longDay.format(d);

/** "2026-09-30" */
export const toIsoDate = (d: Date): string => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** "2026-09-30T14:05:00+05:30" (what the API stores and receives). */
export const toIsoIST = (d: Date, minutes = 0): string => `${toIsoDate(d)}T${formatTime(minutes)}:00${TZ_OFFSET}`;
