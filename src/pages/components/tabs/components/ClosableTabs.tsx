import React, { useRef } from 'react';
import { Plus, Video, X } from 'lucide-react';
import { Tooltip } from '../../../templates/profile/ui';
import { LineTabs } from './LineTabs';
import { TabPanels } from './TabPanel';
import type { TabItem, TabSize } from './tabStyles';

export const MAX_OPEN = 8;

interface ClosableTabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  onClose: (id: string) => void;
  onAdd: () => void;
  label: string;
  size?: TabSize;
  render: (id: string) => React.ReactNode;
}

/**
 * Closable (workspace) tabs for several open items, e.g. camera feeds. Close with the X, a middle-click or
 * Delete on the focused tab; closing the active tab activates its neighbour. "+" adds a tab, up to 8.
 */
export const ClosableTabs: React.FC<ClosableTabsProps> = ({ items, value, onChange, onClose, onAdd, label, size = 'md', render }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const full = items.length >= MAX_OPEN;

  const close = (id: string) => {
    const i = items.findIndex((t) => t.id === id);
    const rest = items.filter((t) => t.id !== id);
    if (id === value && rest.length) {
      const next = rest[Math.min(i, rest.length - 1)];
      onChange(next.id);
    }
    onClose(id);
    // Keep keyboard focus on a tab after closing.
    window.setTimeout(() => wrapRef.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus(), 0);
  };

  return (
    <div ref={wrapRef}>
      <LineTabs
        items={items.map((i) => ({ ...i, icon: i.icon ?? Video }))}
        value={value}
        onChange={onChange}
        label={label}
        size={size}
        onTabKeyDown={(e, item) => {
          if (e.key === 'Delete') {
            e.preventDefault();
            close(item.id);
          }
        }}
        onTabAuxClick={(item) => close(item.id)}
        trailing={(item) => (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => close(item.id)}
            aria-label={`Close ${item.label}`}
            className="relative w-5 h-5 mb-px rounded-[4px] flex items-center justify-center text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] after:absolute after:content-[''] after:-inset-3"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
        after={
          <Tooltip content={full ? 'Close a tab to open another' : 'Open another camera'} placement="bottom" align="end" className="mb-1.5">
            {(tip) => (
              <button
                type="button"
                onClick={() => !full && onAdd()}
                aria-disabled={full || undefined}
                aria-label="Open another camera"
                aria-describedby={tip}
                className={`relative w-8 h-8 rounded-[8px] flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] after:absolute after:content-[''] after:-inset-1.5 ${
                  full ? 'text-[#8C95A6] cursor-not-allowed' : 'text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#0B2D6B]'
                }`}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </Tooltip>
        }
      >
        {(api) =>
          items.length ? (
            <div className="pt-5">
              <TabPanels api={api} value={value} render={render} />
            </div>
          ) : (
            <p className="pt-5 text-[14px] text-[#4B5465]">No cameras open. Use + to open one.</p>
          )
        }
      </LineTabs>
    </div>
  );
};
