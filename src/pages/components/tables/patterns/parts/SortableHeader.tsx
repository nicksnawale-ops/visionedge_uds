import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { DEFAULT_SORT, Sort, SortKey } from '../hooks/useTableQuery';
import { FOCUS, TABLE } from '../tableStyles';

/** asc → desc → default (null). */
export const nextSort = (current: Sort | null, key: SortKey): Sort | null => {
  if (!current || current.key !== key) return { key, dir: 'asc' };
  return current.dir === 'asc' ? { key, dir: 'desc' } : null;
};

interface SortableHeaderProps {
  label: string;
  sortKey: SortKey;
  /** The query's sort (null = default: Time, newest first). */
  sort: Sort | null;
  onSort: (next: Sort | null) => void;
  align?: 'left' | 'right';
  className?: string;
}

/**
 * Sortable column header: a <button> inside <th aria-sort>. Unsorted shows ArrowUpDown (Gray 400) on hover or
 * focus; the sorted column shows ArrowUp / ArrowDown in Royal Blue and a Gray 900 label.
 */
export const SortableHeader: React.FC<SortableHeaderProps> = ({ label, sortKey, sort, onSort, align = 'left', className = '' }) => {
  const effective = sort ?? DEFAULT_SORT;
  const active = effective.key === sortKey;
  const Icon = !active ? ArrowUpDown : effective.dir === 'asc' ? ArrowUp : ArrowDown;
  return (
    <th scope="col" aria-sort={active ? (effective.dir === 'asc' ? 'ascending' : 'descending') : undefined} className={`${TABLE.th} ${align === 'right' ? 'text-right' : ''} ${className}`}>
      <button
        type="button"
        onClick={() => onSort(nextSort(sort, sortKey))}
        className={`group relative -mx-1.5 px-1.5 h-7 inline-flex items-center gap-1 rounded-[4px] uppercase tracking-[0.08em] text-[11px] font-medium ${align === 'right' ? 'flex-row-reverse' : ''} ${
          active ? 'text-[#121722]' : 'text-[#6B7485] hover:text-[#121722]'
        } after:absolute after:content-[''] after:-inset-y-2 after:inset-x-0 ${FOCUS}`}
      >
        {label}
        <Icon
          className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-[#1E63FF]' : 'text-[#8C95A6] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`}
          aria-hidden="true"
        />
      </button>
    </th>
  );
};

/** "Sorted by Velocity, descending" / "Default sort: Time, newest first". */
export const sortMessage = (sort: Sort | null, labels: Record<SortKey, string>): string =>
  sort ? `Sorted by ${labels[sort.key]}, ${sort.dir === 'asc' ? 'ascending' : 'descending'}` : `Default sort: ${labels[DEFAULT_SORT.key]}, newest first`;
