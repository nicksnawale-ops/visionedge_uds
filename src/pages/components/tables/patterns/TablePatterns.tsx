import React, { useState } from 'react';
import { PatternFrame } from './PatternFrame';
import { FILTERING_CODE, FilteringTable } from './FilteringTable';
import { SORTING_CODE, SortingTable } from './SortingTable';
import { PAGINATION_CODE, PaginationTable } from './PaginationTable';
import { COLUMNS_CODE, ColumnControlsTable } from './ColumnControlsTable';
import { EXPAND_CODE, ExpandableRowsTable } from './ExpandableRowsTable';
import { STATES_CODE, TableStates } from './TableStates';
import { CHIP, CHIP_OFF, CHIP_ON } from './tableStyles';

type PatternId = 'filtering' | 'sorting' | 'pagination' | 'columns' | 'expandable' | 'states';

const PATTERNS: { id: PatternId; label: string; useWhen: string; code: string; Component: React.FC }[] = [
  { id: 'filtering', label: 'Filtering', useWhen: 'users need to narrow down large lists.', code: FILTERING_CODE, Component: FilteringTable },
  { id: 'sorting', label: 'Sorting', useWhen: 'users compare or find extremes (latest, highest, A–Z).', code: SORTING_CODE, Component: SortingTable },
  { id: 'pagination', label: 'Pagination', useWhen: 'datasets exceed one screen; use the compact variant inside cards and side panels.', code: PAGINATION_CODE, Component: PaginationTable },
  { id: 'columns', label: 'Column controls', useWhen: 'tables have many columns or different users need different views.', code: COLUMNS_CODE, Component: ColumnControlsTable },
  { id: 'expandable', label: 'Expandable rows', useWhen: 'users need quick detail without leaving the list.', code: EXPAND_CODE, Component: ExpandableRowsTable },
  { id: 'states', label: 'States', useWhen: 'always: every table must handle loading, empty, no results, errors and selection.', code: STATES_CODE, Component: TableStates },
];

const A11Y = [
  'Sortable headers are buttons inside <th> with aria-sort on the sorted column.',
  'Filter and column menus work with the keyboard; Esc closes them and returns focus to their button.',
  'Each chip’s remove button is labelled, e.g. “Remove Status: Verified”.',
  'Pagination is a <nav aria-label="Pagination"> with aria-current="page" on the current page.',
  'Expand buttons use aria-expanded and aria-controls.',
  'Result counts and sort changes are announced politely (aria-live).',
  'Visible focus rings everywhere; touch targets are at least 44px below 768px.',
];

/** "Table Patterns": one showcase with a pattern switcher (pill chips). */
export const TablePatterns: React.FC = () => {
  const [active, setActive] = useState<PatternId>('filtering');
  const p = PATTERNS.find((x) => x.id === active)!;
  const Component = p.Component;

  return (
    <div>
      <div role="group" aria-label="Table pattern" className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {PATTERNS.map((x) => (
          <button key={x.id} type="button" aria-pressed={active === x.id} onClick={() => setActive(x.id)} className={`${CHIP} shrink-0 ${active === x.id ? CHIP_ON : CHIP_OFF}`}>
            {x.label}
          </button>
        ))}
      </div>
      <PatternFrame key={p.id} title={p.label} code={p.code} useWhen={p.useWhen}>
        <Component />
      </PatternFrame>

      <h3 className="mt-8 mb-3 text-[16px] font-semibold text-[#121722]">Accessibility</h3>
      <ul className="space-y-1.5 list-disc pl-5 marker:text-[#1E63FF]">
        {A11Y.map((a) => (
          <li key={a} className="text-[14px] leading-[20px] text-[#353D4C]">
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
};
