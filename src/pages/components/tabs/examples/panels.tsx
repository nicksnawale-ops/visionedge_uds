import React from 'react';
import type { TabItem } from '../components/tabStyles';

/** Deterministic sample panel content for every example. */
export const samplePanel = (items: TabItem[]) => (id: string) => {
  const item = items.find((i) => i.id === id);
  return (
    <div className="space-y-1">
      <p className="text-[14px] font-semibold text-[#121722]">{item?.label ?? id}</p>
      <p className="text-[14px] leading-[20px] text-[#4B5465]">
        Content for {item?.label.toLowerCase() ?? id}. The tab bar stays in place while this panel changes.
      </p>
    </div>
  );
};

/** Small heading used inside multi-part previews. */
export const DemoLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">{children}</p>
);
