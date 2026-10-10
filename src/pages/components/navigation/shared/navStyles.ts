/** Navigation demo tokens: palette colours, elevations and focus rings only. */

/** Focus on Deep Navy: 2px Cyan outline, 2px offset (keyboard only). */
export const FOCUS_NAVY = 'outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-[#00C6FF] focus-visible:outline-offset-2';
/** Focus on white: 2px Royal Blue ring, 2px offset (keyboard only). */
export const FOCUS_LIGHT = 'outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2';
/** Focus inside menus and lists: inset ring so it isn't clipped. */
export const FOCUS_INSET = 'outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E63FF]';

export const ELEV1 = 'shadow-[0_1px_3px_rgba(11,45,107,0.08)]';
export const ELEV2 = 'shadow-[0_4px_12px_rgba(11,45,107,0.12)]';
export const ELEV3 = 'shadow-[0_12px_32px_rgba(11,45,107,0.18)]';

/** Ghost icon button on white: 40×40, 20px icons, hover Gray 100. */
export const ICON_BTN = `relative w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-[8px] text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#121722] ${FOCUS_LIGHT}`;

/** Thin White 20% scrollbar for navy scroll areas. */
export const NAVY_SCROLL = '[scrollbar-width:thin] [scrollbar-color:rgb(255_255_255/0.2)_transparent]';

/** "1,248" */
export const formatNumber = (n: number): string => n.toLocaleString('en-IN');
/** Sidebar counts cap at 99+. */
export const capCount = (n: number, max = 99): string => (n > max ? `${max}+` : formatNumber(n));

export const reducedMotion = (): boolean => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True when the key event comes from a text field (single-key shortcuts must not fire there). */
export const isTyping = (target: EventTarget | null): boolean => {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable;
};
