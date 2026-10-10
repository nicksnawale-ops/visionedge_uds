import React from 'react';
import { Tooltip } from '../../../templates/profile/ui';
import { useTabs } from './useTabs';
import { Activation, FOCUS, SIZE, Surface, TabItem, TabSize } from './tabStyles';

interface SegmentedControlProps {
  /** Max 4 segments; extra items are ignored. */
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  size?: TabSize;
  activation?: Activation;
  /** Equal-width segments. */
  equal?: boolean;
  surface?: Surface;
  children?: (api: ReturnType<typeof useTabs>) => React.ReactNode;
}

/** Segment heights are 8px shorter than the track: 32/40/48 overall with 4px padding. */
const SEG_H = { sm: 'h-6', md: 'h-8', lg: 'h-10' } as const;

/**
 * Segmented control (pill tabs) for switching how the same data is displayed: Gray 100 track, 4px padding,
 * 8px radius; the active segment is white with elevation-1 and Gray 900 text. Max 4 segments.
 */
export const SegmentedControl: React.FC<SegmentedControlProps> = ({ items, value, onChange, label, size = 'md', activation = 'automatic', equal = false, surface = 'light', children }) => {
  const segs = items.slice(0, 4);
  const api = useTabs({ items: segs, value, onChange, activation, label, controls: Boolean(children) });
  const s = SIZE[size];
  const dark = surface === 'dark';
  return (
    <div>
      <div {...api.getListProps()} className={`${equal ? 'flex w-full' : 'inline-flex'} items-center p-1 rounded-[8px] ${dark ? 'bg-white/10' : 'bg-[#EEF1F6]'}`}>
        {segs.map((item, i) => {
          const active = item.id === value;
          const Icon = item.icon;
          const tab = (describedBy?: string) => (
            <button
              {...api.getTabProps(item, i)}
              aria-describedby={describedBy}
              className={`relative ${SEG_H[size]} ${s.px} ${equal ? 'w-full' : ''} inline-flex items-center justify-center gap-1.5 ${s.text} font-medium whitespace-nowrap rounded-[6px] transition-colors ${FOCUS[surface]} before:absolute before:content-[''] before:-inset-y-2 before:inset-x-0 ${
                item.disabled
                  ? dark
                    ? 'text-white/40 cursor-not-allowed'
                    : 'text-[#8C95A6] cursor-not-allowed'
                  : active
                    ? dark
                      ? 'bg-white/15 text-white'
                      : 'bg-white text-[#121722] shadow-[0_1px_3px_rgba(11,45,107,0.08)]'
                    : dark
                      ? 'text-white/70 hover:text-white'
                      : 'text-[#4B5465] hover:text-[#121722]'
              }`}
            >
              {Icon && <Icon className={`${s.icon} shrink-0`} aria-hidden="true" />}
              {item.label}
            </button>
          );
          const cell = equal ? 'flex-1 min-w-0 flex' : '';
          return item.disabled ? (
            <Tooltip key={item.id} content={item.disabled} placement="bottom" className={cell}>
              {(tip) => tab(tip)}
            </Tooltip>
          ) : (
            <span key={item.id} className={cell || 'contents'}>
              {tab()}
            </span>
          );
        })}
      </div>
      {children?.(api)}
    </div>
  );
};
