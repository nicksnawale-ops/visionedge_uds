import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { Tooltip } from '../../../templates/profile/ui';
import { useTabs } from './useTabs';
import { TabPanels } from './TabPanel';
import { Activation, FOCUS, TabItem, srExtra } from './tabStyles';

interface VerticalTabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  activation?: Activation;
  render: (id: string) => React.ReactNode;
}

/**
 * Vertical tabs for settings and profile sections (6+): 40px items, 14px Medium Gray 700, 18px icons;
 * active Royal Blue 8% fill, Royal Blue text and icon, 3px left bar. 240px wide with the panel on the right.
 * Below 768px (container) they become a native select.
 */
export const VerticalTabs: React.FC<VerticalTabsProps> = ({ items, value, onChange, label, activation = 'automatic', render }) => {
  const api = useTabs({ items, value, onChange, activation, label, orientation: 'vertical' });
  const selectId = useId();
  return (
    <div className="@container">
      {/* Mobile: a select */}
      <div className="relative mb-4 @min-[640px]:hidden">
        <label htmlFor={selectId} className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#4B5465] pointer-events-none">
          Section:
        </label>
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 pl-[76px] pr-10 appearance-none rounded-[8px] border border-[#8C95A6] bg-white text-[16px] font-medium text-[#121722] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20"
        >
          {items.map((i) => (
            <option key={i.id} value={i.id} disabled={Boolean(i.disabled)}>
              {i.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5465] pointer-events-none" aria-hidden="true" />
      </div>

      <div className="flex gap-6">
        <div {...api.getListProps()} className="hidden @min-[640px]:flex flex-col gap-0.5 w-[240px] shrink-0 p-2 rounded-[12px] border border-[#DDE2EA] bg-white self-start">
          {items.map((item, i) => {
            const active = item.id === value;
            const Icon = item.icon;
            const extra = srExtra(item);
            const tab = (describedBy?: string) => (
              <button
                {...api.getTabProps(item, i)}
                aria-describedby={describedBy}
                className={`relative w-full h-10 px-3 flex items-center gap-3 rounded-[8px] text-[14px] font-medium text-left transition-colors ${FOCUS.light} ${
                  item.disabled ? 'text-[#8C95A6] cursor-not-allowed' : active ? 'bg-[#1E63FF]/[0.08] text-[#1E63FF]' : 'text-[#353D4C] hover:bg-[#F7F9FC] hover:text-[#121722]'
                }`}
              >
                {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-[#1E63FF]" aria-hidden="true" />}
                {Icon && <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-[#1E63FF]' : item.disabled ? '' : 'text-[#4B5465]'}`} aria-hidden="true" />}
                <span className="truncate">{item.label}</span>
                {extra && <span className="sr-only">, {extra}</span>}
              </button>
            );
            return item.disabled ? (
              <Tooltip key={item.id} content={item.disabled} placement="bottom" className="w-full">
                {(tip) => tab(tip)}
              </Tooltip>
            ) : (
              <React.Fragment key={item.id}>{tab()}</React.Fragment>
            );
          })}
        </div>
        <div className="flex-1 min-w-0 rounded-[12px] border border-[#DDE2EA] bg-white p-5">
          <TabPanels api={api} value={value} render={render} />
        </div>
      </div>
    </div>
  );
};
