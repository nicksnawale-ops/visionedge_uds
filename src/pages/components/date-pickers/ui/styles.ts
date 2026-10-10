/** Shared class recipes for the date & time pickers (palette colors only). */

export const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2';

export const LABEL = 'text-[14px] leading-[20px] font-medium text-[#121722]';
export const OVERLINE = 'text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#6B7485]';

export const INPUT =
  'flex-1 min-w-0 h-full bg-transparent px-3 text-[14px] text-[#121722] placeholder-[#6B7485] tabular-nums outline-none disabled:cursor-not-allowed disabled:text-[#8C95A6]';

/** Popover surface: white, 1px Gray 200, 12px radius, elevation-2. */
export const SURFACE = 'rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_4px_12px_rgba(11,45,107,0.12)]';

export const BTN_GHOST_SM = `inline-flex items-center justify-center gap-1.5 h-8 max-md:h-10 px-3 rounded-[8px] text-[14px] font-semibold text-[#1E63FF] hover:bg-[#EEF1F6] disabled:text-[#8C95A6] disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors ${FOCUS}`;

export const BTN_PRIMARY_SM = `inline-flex items-center justify-center gap-1.5 h-8 max-md:h-10 px-3 rounded-[8px] text-[14px] font-semibold bg-[#1E63FF] text-white hover:bg-[#0B2D6B] disabled:bg-[#EEF1F6] disabled:text-[#8C95A6] disabled:cursor-not-allowed transition-colors ${FOCUS}`;

export const ICON_BTN = `inline-flex items-center justify-center shrink-0 rounded-[8px] text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#121722] disabled:text-[#C3CAD5] disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors ${FOCUS}`;
