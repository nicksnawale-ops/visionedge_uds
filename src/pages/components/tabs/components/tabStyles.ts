/** Tab tokens: sizes, colours and focus rings shared by every tab type. Palette colours only. */
import type { LucideIcon } from 'lucide-react';

export type TabSize = 'sm' | 'md' | 'lg';
export type Surface = 'light' | 'dark';
export type Activation = 'automatic' | 'manual';

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  /** Count pill (digits, en-IN grouping). */
  count?: number;
  /** 8px dot before the label: Cyan = live, Deep Navy = needs attention. */
  status?: 'live' | 'attention';
  /** Disabled with this reason (tooltip); still focusable. */
  disabled?: string;
}

/** Height · text · icon per size: Small 32/13/16, Medium 40/14/16, Large 48/16/20. */
export const SIZE: Record<TabSize, { h: string; text: string; icon: string; px: string }> = {
  sm: { h: 'h-8', text: 'text-[13px]', icon: 'w-4 h-4', px: 'px-2.5' },
  md: { h: 'h-10', text: 'text-[14px]', icon: 'w-4 h-4', px: 'px-3' },
  lg: { h: 'h-12', text: 'text-[16px]', icon: 'w-5 h-5', px: 'px-4' },
};

/** Focus ring on keyboard focus only: 2px Royal Blue + 2px offset (Cyan on dark). */
export const FOCUS: Record<Surface, string> = {
  light: 'outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2',
  dark: 'outline-none focus-visible:ring-2 focus-visible:ring-[#00C6FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2D6B]',
};

/** "1,248" */
export const formatCount = (n: number): string => n.toLocaleString('en-IN');

/** Screen-reader suffix for counts and status dots: "Alerts, 3 new". */
export const srExtra = (item: TabItem): string =>
  [item.count !== undefined ? `${formatCount(item.count)} ${item.status === 'attention' ? 'new' : 'items'}` : null, item.status === 'live' ? 'live' : item.status === 'attention' && item.count === undefined ? 'needs attention' : null]
    .filter(Boolean)
    .join(', ');

export const reducedMotion = (): boolean => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
