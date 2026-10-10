import React from 'react';
import { Tooltip } from '../../../templates/profile/ui';
import { useTabs } from './useTabs';
import { TabPanels } from './TabPanel';
import { Activation, FOCUS, SIZE, TabItem, TabSize, srExtra } from './tabStyles';

interface ContainedTabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  size?: TabSize;
  activation?: Activation;
  render: (id: string) => React.ReactNode;
}

/**
 * Contained (enclosed) tabs: a Gray 50 bar with a 1px Gray 200 bottom border. The active tab is white with a
 * 1px Gray 200 border on top/left/right and an 8px top radius, merging into the white panel below.
 */
export const ContainedTabs: React.FC<ContainedTabsProps> = ({ items, value, onChange, label, size = 'md', activation = 'automatic', render }) => {
  const api = useTabs({ items, value, onChange, activation, label });
  const s = SIZE[size];
  return (
    <div className="rounded-[8px] border border-[#DDE2EA] bg-white overflow-hidden">
      <div {...api.getListProps()} className="flex flex-wrap items-end gap-1 px-2 pt-2 bg-[#F7F9FC] border-b border-[#DDE2EA]">
        {items.map((item, i) => {
          const active = item.id === value;
          const Icon = item.icon;
          const extra = srExtra(item);
          const tab = (describedBy?: string) => (
            <button
              {...api.getTabProps(item, i)}
              aria-describedby={describedBy}
              className={`relative -mb-px ${s.h} ${s.px} inline-flex items-center gap-2 ${s.text} font-medium whitespace-nowrap rounded-t-[8px] transition-colors ${FOCUS.light} ${
                item.disabled
                  ? 'text-[#8C95A6] cursor-not-allowed'
                  : active
                    ? 'bg-white text-[#121722] border border-[#DDE2EA] border-b-white'
                    : 'text-[#4B5465] border border-transparent hover:bg-[#EEF1F6] hover:text-[#121722]'
              }`}
            >
              {Icon && <Icon className={`${s.icon} shrink-0 ${active ? 'text-[#1E63FF]' : ''}`} aria-hidden="true" />}
              {item.label}
              {extra && <span className="sr-only">, {extra}</span>}
            </button>
          );
          return item.disabled ? (
            <Tooltip key={item.id} content={item.disabled} placement="bottom">
              {(tip) => tab(tip)}
            </Tooltip>
          ) : (
            <React.Fragment key={item.id}>{tab()}</React.Fragment>
          );
        })}
      </div>
      <div className="p-5">
        <TabPanels api={api} value={value} render={render} />
      </div>
    </div>
  );
};
