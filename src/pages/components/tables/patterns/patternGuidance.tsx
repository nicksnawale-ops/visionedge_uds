import React from 'react';
import { ArrowDown, ArrowUpDown, X } from 'lucide-react';
import { DoDontPair } from '../../../../components/common/DoDont';
import type { SpecRow } from '../../../../components/common/SpecTable';

/** New rows appended after the existing "Data Table Specifications" rows. */
export const PATTERN_SPEC_ROWS: SpecRow[] = [
  { property: 'Filter Toolbar', value: '16px padding, 1px Gray 200 bottom border', token: 'p-4 border-b border-[#DDE2EA]' },
  { property: 'Table Search', value: '320px wide, 300ms debounce', token: 'w-[320px]' },
  { property: 'Filter Button', value: '32px Secondary Small with ChevronDown', token: 'h-8 px-3 border-[#1E63FF]' },
  { property: 'Active Filter', value: 'Royal Blue 8% fill, 1px Royal Blue border, value in the label', token: 'bg-[#1E63FF]/[0.08] border-[#1E63FF]' },
  { property: 'Filter Chip', value: 'Gray 100 fill, 12px Medium, labelled remove button', token: 'bg-[#EEF1F6] text-[12px]' },
  { property: 'Sort Icon', value: '14px; inactive Gray 400 (on hover/focus), active Royal Blue', token: 'w-3.5 h-3.5 text-[#8C95A6] / text-[#1E63FF]' },
  { property: 'Pagination Item', value: '32px square, 8px radius; current Royal Blue fill, White text', token: 'w-8 h-8 rounded-[8px] bg-[#1E63FF]' },
  { property: 'Pagination Footer', value: '16px × 24px padding, 1px Gray 200 top border', token: 'px-6 py-4 border-t' },
  { property: 'Columns Menu', value: '240px; checkboxes, drag handles, Reset to default', token: 'w-[240px]' },
  { property: 'Sticky Column Shadow', value: 'Shown only while scrolled under the sticky edge', token: 'shadow-[4px_0_6px_-2px_rgba(11,45,107,0.08)]' },
  { property: 'Expand Chevron', value: '32px Ghost; rotates 90° in 150ms', token: 'w-8 h-8 rotate-90 duration-150' },
  { property: 'Expanded Row', value: 'Gray 50, 16px × 24px padding, spans all columns', token: 'bg-[#F7F9FC] px-6 py-4' },
  { property: 'Skeleton Rows', value: '8 rows of Gray 100 bars; no shimmer with reduced motion', token: 'bg-[#EEF1F6] motion-safe:animate-pulse' },
];

/* Decorative mini visuals (the card text carries the meaning). */

const MiniChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1 h-6 pl-2 pr-1 rounded-full bg-[#EEF1F6] text-[11px] font-medium text-[#353D4C]">
    {children}
    <X className="w-3 h-3" />
  </span>
);

const MiniHeader: React.FC<{ allIcons?: boolean }> = ({ allIcons }) => (
  <div aria-hidden="true" className="w-56 flex justify-between px-2 h-8 items-center rounded-[6px] bg-[#F7F9FC] border border-[#DDE2EA] text-[10px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
    <span className="inline-flex items-center gap-0.5 text-[#121722]">
      Time <ArrowDown className="w-3 h-3 text-[#1E63FF]" />
    </span>
    <span className="inline-flex items-center gap-0.5">Gate {allIcons && <ArrowUpDown className="w-3 h-3" />}</span>
    <span className="inline-flex items-center gap-0.5">Actions {allIcons && <ArrowUpDown className="w-3 h-3" />}</span>
  </div>
);

const MiniPager: React.FC<{ page: number; total: number; empty?: boolean }> = ({ page, total, empty }) => (
  <div aria-hidden="true" className="w-56 rounded-[6px] border border-[#DDE2EA] bg-white">
    <div className="h-12 flex items-center justify-center text-[11px] text-[#6B7485]">{empty ? 'No rows on this page' : '18 matching vehicles'}</div>
    <div className="h-7 border-t border-[#DDE2EA] flex items-center justify-end gap-1 px-2 text-[10px]">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`w-4 h-4 rounded-[3px] flex items-center justify-center ${i + 1 === page ? 'bg-[#1E63FF] text-white' : 'text-[#4B5465]'}`}>
          {i + 1}
        </span>
      ))}
    </div>
  </div>
);

const MiniScroll: React.FC<{ sticky?: boolean }> = ({ sticky }) => (
  <div aria-hidden="true" className="w-56 overflow-hidden rounded-[6px] border border-[#DDE2EA] bg-white text-[10px]">
    {[0, 1, 2].map((i) => (
      <div key={i} className="h-6 flex border-b border-[#DDE2EA] last:border-b-0">
        {sticky && <span className="w-14 shrink-0 px-1.5 flex items-center font-mono font-semibold text-[#121722] bg-white shadow-[4px_0_6px_-2px_rgba(11,45,107,0.08)] relative z-[1]">MH12…</span>}
        <span className={`flex items-center gap-4 px-1.5 text-[#6B7485] ${sticky ? '' : '-ml-10'}`}>
          {!sticky && <span className="font-mono">MH12…</span>}
          <span>Gate 3</span>
          <span>Verified</span>
          <span>14:05</span>
        </span>
      </div>
    ))}
  </div>
);

/** The four new Do & Don't cards, added after the existing one. */
export const PatternRules: React.FC = () => (
  <>
    <DoDontPair
      doTitle="Do show active filters as removable chips"
      doDescription="Every applied filter is visible and removable, with “Clear all” next to them."
      doExample={
        <div aria-hidden="true" className="flex flex-wrap items-center gap-1.5 w-56">
          <MiniChip>Status: Verified</MiniChip>
          <MiniChip>Gate 3</MiniChip>
          <span className="text-[11px] font-semibold text-[#1E63FF]">Clear all</span>
        </div>
      }
      dontTitle="Don't hide which filters are applied"
      dontDescription="A shorter list with no explanation looks like missing data."
      dontExample={<div aria-hidden="true" className="w-56 h-12 rounded-[6px] border border-[#DDE2EA] bg-white flex items-center justify-center text-[11px] text-[#6B7485]">18 rows (filters hidden)</div>}
    />
    <DoDontPair
      doTitle="Do show sort icons only on sortable columns"
      doDescription="Mark the default sort (Time, newest first) and keep other headers plain."
      doExample={<MiniHeader />}
      dontTitle="Don't make every header look clickable"
      dontDescription="Icons on Actions or other fixed columns promise behavior that isn't there."
      dontExample={<MiniHeader allIcons />}
    />
    <DoDontPair
      doTitle="Do reset to page 1 when filters or sort change"
      doDescription="New results start at the top, where people expect them."
      doExample={<MiniPager page={1} total={2} />}
      dontTitle="Don't leave users on an empty page 5"
      dontDescription="Filtering to 18 rows while staying on page 5 shows nothing."
      dontExample={<MiniPager page={5} total={5} empty />}
    />
    <DoDontPair
      doTitle="Do keep key columns sticky when scrolling sideways"
      doDescription="Selection and the plate stay in view; the table scrolls inside its card."
      doExample={<MiniScroll sticky />}
      dontTitle="Don't let the page itself scroll horizontally"
      dontDescription="The whole page shifting sideways loses the header, navigation and context."
      dontExample={<MiniScroll />}
    />
  </>
);
