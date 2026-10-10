import React, { useId } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { NAV_STYLES } from '../../profile/SectionNav';

export interface IndexItem {
  id: string;
  label: string;
  /** Required fields still missing (0 = complete). */
  remaining: number;
}

interface SectionIndexProps {
  items: IndexItem[];
  current: string;
  onJump: (id: string) => void;
}

const status = (i: IndexItem) => (i.remaining === 0 ? 'complete' : `${i.remaining} required ${i.remaining === 1 ? 'field' : 'fields'} left`);

const Mark: React.FC<{ item: IndexItem }> = ({ item }) =>
  item.remaining === 0 ? (
    <span className="w-[18px] h-[18px] rounded-full bg-[#00C6FF]/[0.16] text-[#0B2D6B] flex items-center justify-center shrink-0" aria-hidden="true">
      <Check className="w-3 h-3" strokeWidth={3} />
    </span>
  ) : (
    <span className="w-[18px] h-[18px] flex items-center justify-center shrink-0" aria-hidden="true">
      <span className="w-1.5 h-1.5 rounded-full bg-[#8C95A6]" />
    </span>
  );

/** ≥1024px: sticky anchor list with a completion mark and "2 required fields left". */
export const VerticalSectionIndex: React.FC<SectionIndexProps> = ({ items, current, onJump }) => (
  <nav aria-label="Form sections" className={NAV_STYLES.card}>
    <ul className="space-y-0.5">
      {items.map((i) => {
        const active = i.id === current;
        return (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              onClick={(e) => {
                e.preventDefault();
                onJump(i.id);
              }}
              aria-current={active ? 'location' : undefined}
              className={`${NAV_STYLES.item} h-auto! min-h-10 py-2 ${active ? NAV_STYLES.itemActive : NAV_STYLES.itemIdle}`}
            >
              {active && <span className={NAV_STYLES.activeBar} aria-hidden="true" />}
              <Mark item={i} />
              <span className="min-w-0">
                <span className="block truncate">{i.label}</span>
                {i.remaining > 0 && <span className="block text-[12px] leading-[16px] font-normal text-[#6B7485]">{status(i)}</span>}
                {i.remaining === 0 && <span className="sr-only">, complete</span>}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  </nav>
);

/** 768–1023px: horizontal scrollable chips. */
export const ChipSectionIndex: React.FC<SectionIndexProps> = ({ items, current, onJump }) => (
  <nav aria-label="Form sections" className="overflow-x-auto -mx-1 px-1 pb-1">
    <ul className="flex gap-2 w-max">
      {items.map((i) => {
        const active = i.id === current;
        return (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              onClick={(e) => {
                e.preventDefault();
                onJump(i.id);
              }}
              aria-current={active ? 'location' : undefined}
              className={`inline-flex items-center gap-1.5 h-11 px-3 rounded-full border text-[13px] font-medium whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] ${
                active ? 'bg-[#1E63FF]/[0.08] border-[#1E63FF] text-[#1E63FF]' : 'bg-white border-[#DDE2EA] text-[#353D4C] hover:border-[#1E63FF]'
              }`}
            >
              <Mark item={i} />
              {i.label}
              <span className="sr-only">, {status(i)}</span>
            </a>
          </li>
        );
      })}
    </ul>
  </nav>
);

/** <768px: a select. */
export const SelectSectionIndex: React.FC<SectionIndexProps> = ({ items, current, onJump }) => {
  const id = useId();
  return (
    <div className="relative">
      <label htmlFor={id} className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#4B5465] pointer-events-none">
        Section:
      </label>
      <select id={id} value={current} onChange={(e) => onJump(e.target.value)} className={NAV_STYLES.select}>
        {items.map((i) => (
          <option key={i.id} value={i.id}>
            {i.remaining === 0 ? '✓ ' : ''}
            {i.label}
            {i.remaining ? ` (${status(i)})` : ''}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5465] pointer-events-none" aria-hidden="true" />
    </div>
  );
};
