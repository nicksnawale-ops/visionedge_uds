/**
 * Surface tokens. "Light" is the default; "Control room" is applied with explicit classes on this template's
 * own root container only (no `dark:` variant, no class on <html>/<body>, no global CSS).
 * Tiles always stay Black; the product shell sidebar stays Deep Navy.
 */
import React, { createContext, useContext } from 'react';
import type { Surface } from '../liveViewStates';

export interface SurfaceTokens {
  surface: Surface;
  /** Content background + base text. */
  root: string;
  /** Cards and panels (bg + border colour; add `border`). */
  panel: string;
  border: string;
  divide: string;
  text: string;
  muted: string;
  subtle: string;
  hover: string;
  /** Selected list item / segment. */
  selected: string;
  link: string;
  focus: string;
  focusInset: string;
  input: string;
  btn: { primary: string; secondary: string; ghost: string; icon: string; iconSm: string };
  segment: { group: string; on: string; off: string };
  /** Line tabs (Tabs standard / Tabs on dark). */
  tab: { on: string; off: string; indicator: string; baseline: string };
  skeleton: string;
  popover: string;
}

const BASE_BTN = 'inline-flex items-center justify-center gap-2 rounded-[8px] font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed';

const LIGHT_FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2';
const DARK_FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-[#00C6FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121722]';

const LIGHT: SurfaceTokens = {
  surface: 'light',
  root: 'bg-[#F7F9FC] text-[#353D4C]',
  panel: 'bg-white border-[#DDE2EA]',
  border: 'border-[#DDE2EA]',
  divide: 'divide-[#DDE2EA]',
  text: 'text-[#121722]',
  muted: 'text-[#4B5465]',
  subtle: 'text-[#6B7485]',
  hover: 'hover:bg-[#F7F9FC]',
  selected: 'bg-[#1E63FF]/[0.08]',
  link: 'text-[#1E63FF]',
  focus: LIGHT_FOCUS,
  focusInset: 'outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E63FF]',
  input: 'bg-white border border-[#8C95A6] text-[#121722] placeholder:text-[#6B7485] focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20 outline-none',
  btn: {
    primary: `${BASE_BTN} h-10 px-4 text-[14px] bg-[#1E63FF] text-white hover:bg-[#0B2D6B] ${LIGHT_FOCUS}`,
    secondary: `${BASE_BTN} h-8 px-3 text-[13px] bg-white border border-[#1E63FF] text-[#1E63FF] hover:bg-[#F7F9FC] hover:text-[#0B2D6B] ${LIGHT_FOCUS}`,
    ghost: `${BASE_BTN} h-8 px-3 text-[13px] text-[#1E63FF] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] ${LIGHT_FOCUS}`,
    icon: `${BASE_BTN} w-10 h-10 text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#121722] ${LIGHT_FOCUS}`,
    iconSm: `${BASE_BTN} w-8 h-8 text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#121722] ${LIGHT_FOCUS}`,
  },
  segment: { group: 'bg-[#EEF1F6]', on: 'bg-white text-[#121722] shadow-[0_1px_3px_rgba(11,45,107,0.08)]', off: 'text-[#4B5465] hover:text-[#121722]' },
  tab: { on: 'text-[#1E63FF]', off: 'text-[#4B5465] hover:text-[#121722]', indicator: 'bg-[#1E63FF]', baseline: 'border-[#DDE2EA]' },
  skeleton: 'bg-[#EEF1F6]',
  popover: 'bg-white border border-[#DDE2EA] shadow-[0_4px_12px_rgba(11,45,107,0.12)]',
};

const CONTROL: SurfaceTokens = {
  surface: 'control',
  root: 'bg-[#121722] text-[#C3CAD5]',
  panel: 'bg-[#1F2633] border-white/[0.08]',
  border: 'border-white/[0.08]',
  divide: 'divide-white/[0.08]',
  text: 'text-white',
  muted: 'text-[#C3CAD5]',
  subtle: 'text-[#C3CAD5]',
  hover: 'hover:bg-white/[0.06]',
  selected: 'bg-white/10',
  link: 'text-[#00C6FF]',
  focus: DARK_FOCUS,
  focusInset: 'outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00C6FF]',
  input: 'bg-[#121722] border border-white/20 text-white placeholder:text-[#C3CAD5] focus:border-[#00C6FF] focus:ring-[3px] focus:ring-[#00C6FF]/20 outline-none',
  btn: {
    primary: `${BASE_BTN} h-10 px-4 text-[14px] bg-[#1E63FF] text-white hover:bg-[#0B2D6B] ${DARK_FOCUS}`,
    secondary: `${BASE_BTN} h-8 px-3 text-[13px] bg-transparent border border-white text-white hover:bg-white/10 ${DARK_FOCUS}`,
    ghost: `${BASE_BTN} h-8 px-3 text-[13px] text-[#00C6FF] hover:bg-white/10 ${DARK_FOCUS}`,
    icon: `${BASE_BTN} w-10 h-10 text-[#C3CAD5] hover:bg-white/10 hover:text-white ${DARK_FOCUS}`,
    iconSm: `${BASE_BTN} w-8 h-8 text-[#C3CAD5] hover:bg-white/10 hover:text-white ${DARK_FOCUS}`,
  },
  segment: { group: 'bg-white/10', on: 'bg-white/15 text-white', off: 'text-[#C3CAD5] hover:text-white' },
  tab: { on: 'text-white', off: 'text-white/70 hover:text-white', indicator: 'bg-[#00C6FF]', baseline: 'border-white/15' },
  skeleton: 'bg-white/10',
  popover: 'bg-[#1F2633] border border-white/[0.08] shadow-[0_4px_12px_rgba(0,0,0,0.4)]',
};

export const surfaceTokens = (s: Surface): SurfaceTokens => (s === 'control' ? CONTROL : LIGHT);

const SurfaceContext = createContext<SurfaceTokens>(LIGHT);
export const useSurface = (): SurfaceTokens => useContext(SurfaceContext);

/** The template root: fills the shell's content area and carries the surface classes. */
export const ControlRoomSurface: React.FC<{ surface: Surface; className?: string; rootRef?: React.Ref<HTMLDivElement>; children: React.ReactNode }> = ({
  surface,
  className = '',
  rootRef,
  children,
}) => {
  const t = surfaceTokens(surface);
  return (
    <SurfaceContext.Provider value={t}>
      <div ref={rootRef} data-surface={surface} className={`@container relative h-full min-h-0 flex flex-col ${t.root} ${className}`}>
        {children}
      </div>
    </SurfaceContext.Provider>
  );
};
