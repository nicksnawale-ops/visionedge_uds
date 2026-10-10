import React from 'react';
import { LineTabs } from './LineTabs';
import { SegmentedControl } from './SegmentedControl';
import type { Activation, TabItem, TabSize } from './tabStyles';

interface TabsOnDarkProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  variant?: 'line' | 'segmented';
  size?: TabSize;
  activation?: Activation;
  /** Deep Navy (default) or Black. */
  background?: 'navy' | 'black';
  children?: React.ReactNode;
}

/**
 * Tabs on dark surfaces (monitoring screens, camera overlays): inactive White 70%, hover White, active White
 * with a 2px Cyan underline; the segmented variant uses a White 10% track and a White 15% active segment.
 * Focus rings are Cyan.
 */
export const TabsOnDark: React.FC<TabsOnDarkProps> = ({ items, value, onChange, label, variant = 'line', size, activation, background = 'navy', children }) => (
  <div className={`rounded-[8px] p-5 ${background === 'navy' ? 'bg-[#0B2D6B]' : 'bg-black'}`}>
    {variant === 'line' ? (
      <LineTabs items={items} value={value} onChange={onChange} label={label} size={size} activation={activation} surface="dark" />
    ) : (
      <SegmentedControl items={items} value={value} onChange={onChange} label={label} size={size} activation={activation} surface="dark" />
    )}
    {children && <div className="pt-4 text-[14px] text-white/80">{children}</div>}
  </div>
);
