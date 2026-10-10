/** Class tokens shared by the table patterns. Palette colours only. */

export const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2';
export const FOCUS_INSET = 'outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E63FF]';

/** 32px on desktop, 44px touch targets below 768px. */
const SMALL = 'h-8 max-[767px]:h-11 px-3 inline-flex items-center justify-center gap-1.5 rounded-[8px] text-[13px] font-semibold whitespace-nowrap transition-colors';

export const BTN = {
  secondarySm: `${SMALL} bg-white border border-[#1E63FF] text-[#1E63FF] hover:bg-[#F7F9FC] hover:text-[#0B2D6B] ${FOCUS}`,
  /** Secondary Small with an active selection (filter applied). */
  activeSm: `${SMALL} bg-[#1E63FF]/[0.08] border border-[#1E63FF] text-[#1E63FF] ${FOCUS}`,
  ghostSm: `${SMALL} text-[#1E63FF] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] ${FOCUS}`,
  secondary: `h-10 px-4 inline-flex items-center justify-center gap-2 rounded-[8px] bg-white border border-[#1E63FF] text-[14px] font-semibold text-[#1E63FF] hover:bg-[#F7F9FC] hover:text-[#0B2D6B] ${FOCUS}`,
  destructive: `h-10 px-4 inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#121722] text-[14px] font-semibold text-white hover:bg-black ${FOCUS}`,
  icon: `w-8 h-8 max-[767px]:w-11 max-[767px]:h-11 inline-flex items-center justify-center rounded-[8px] text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#121722] disabled:text-[#C3CAD5] disabled:hover:bg-transparent disabled:cursor-not-allowed ${FOCUS}`,
};

export const TABLE = {
  /** White table card: 1px Gray 200, 12px radius. Never clips menus. */
  card: 'w-full min-w-0 rounded-[12px] border border-[#DDE2EA] bg-white text-left shadow-[0_1px_3px_rgba(11,45,107,0.08)]',
  /**
   * The table scrolls inside its card, never the page. `relative` makes this the containing block for
   * visually hidden (sr-only, absolute) text in cells, so it is clipped here instead of widening the page.
   */
  scroll: 'relative overflow-x-auto',
  table: 'w-full border-collapse text-[14px]',
  headRow: 'h-10 bg-[#F7F9FC] border-b border-[#DDE2EA]',
  th: 'px-4 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] whitespace-nowrap',
  row: 'border-b border-[#DDE2EA] last:border-b-0 hover:bg-[#F7F9FC]',
  td: 'px-4 whitespace-nowrap text-[#353D4C]',
  num: 'px-4 whitespace-nowrap text-right font-mono text-[13px] tabular-nums text-[#353D4C]',
  plate: 'font-mono text-[13px] font-semibold text-[#121722] bg-[#F7F9FC] px-2 py-0.5 rounded border border-[#DDE2EA] whitespace-nowrap',
};

export const INPUT = `h-8 max-[767px]:h-11 px-3 rounded-[8px] border border-[#8C95A6] bg-white text-[13px] text-[#121722] placeholder:text-[#6B7485] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20`;

export const CHECKBOX = 'w-4 h-4 rounded border-[#8C95A6] accent-[#1E63FF] cursor-pointer';

export const POPOVER = 'absolute z-30 mt-2 rounded-[8px] bg-white border border-[#DDE2EA] shadow-[0_4px_12px_rgba(11,45,107,0.12)]';

/** Pill chips (pattern / state switchers). */
export const CHIP = `h-8 max-[767px]:h-11 px-3 rounded-full text-[13px] font-medium border transition-colors whitespace-nowrap ${FOCUS}`;
export const CHIP_ON = 'bg-[#1E63FF] border-[#1E63FF] text-white';
export const CHIP_OFF = 'bg-white border-[#DDE2EA] text-[#4B5465] hover:bg-[#F7F9FC] hover:text-[#121722]';
