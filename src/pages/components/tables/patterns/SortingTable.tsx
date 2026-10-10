import React from 'react';
import { useToast } from '../../../../components/common/Toast';
import { SortKey, useTableQuery } from './hooks/useTableQuery';
import { SortableHeader, sortMessage } from './parts/SortableHeader';
import { CompactPagination } from './parts/CompactPagination';
import { LiveRegion } from './parts/LiveRegion';
import { COLUMN_LABEL, Cell, ColumnKey, NUMERIC, ViewButton } from './cells';
import { TABLE } from './tableStyles';

/** Sortable columns; Vehicle type and Actions are plain headers. */
const SORTABLE: ColumnKey[] = ['plate', 'driver', 'gate', 'status', 'time', 'confidence', 'velocity'];
const COLS: ColumnKey[] = ['plate', 'driver', 'gate', 'vehicleType', 'status', 'time', 'confidence', 'velocity'];
const LABELS = COLUMN_LABEL as Record<SortKey, string>;

/** Pattern 2: sortable headers (asc → desc → default), status by a defined order, announced changes. */
export const SortingTable: React.FC = () => {
  const api = useTableQuery({ prefix: 's' });
  const { showToast } = useToast();
  const { sort } = api.query;

  return (
    <div className={TABLE.card}>
      <div className="p-4 border-b border-[#DDE2EA] flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#4B5465]">
        <span>
          {sort ? (
            <>
              Sorted by <span className="font-medium text-[#121722]">{LABELS[sort.key]}</span>, {sort.dir === 'asc' ? 'ascending' : 'descending'}
            </>
          ) : (
            <>
              Default sort: <span className="font-medium text-[#121722]">Time</span>, newest first
            </>
          )}
        </span>
        <span className="text-[12px] text-[#6B7485]">Click a header: ascending → descending → default</span>
      </div>
      <LiveRegion message={sortMessage(sort, LABELS)} />
      <div className={TABLE.scroll}>
        <table className={`${TABLE.table} min-w-[920px]`}>
          <caption className="sr-only">Vehicle log, sortable. {sortMessage(sort, LABELS)}.</caption>
          <thead>
            <tr className={TABLE.headRow}>
              {COLS.map((c) =>
                SORTABLE.includes(c) ? (
                  <SortableHeader key={c} label={COLUMN_LABEL[c]} sortKey={c} sort={sort} onSort={(next) => api.update({ sort: next })} align={NUMERIC.includes(c) ? 'right' : 'left'} />
                ) : (
                  <th key={c} scope="col" className={TABLE.th}>
                    {COLUMN_LABEL[c]}
                  </th>
                )
              )}
              <th scope="col" className={`${TABLE.th} w-14`}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {api.pageRows.map((r) => (
              <tr key={r.id} className={`${TABLE.row} h-12`}>
                {COLS.map((c) => (
                  <Cell key={c} row={r} col={c} />
                ))}
                <td className="px-2 text-center">
                  <ViewButton row={r} onView={(row) => showToast(`Opening ${row.plate}`, 'info')} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CompactPagination page={api.page} pageCount={api.pageCount} onPage={api.setPage} />
    </div>
  );
};

export const SORTING_CODE = `// Sortable header: a <button> inside <th aria-sort>; click cycles ascending → descending → default
const next = (sort, key) => (!sort || sort.key !== key ? { key, dir: 'asc' } : sort.dir === 'asc' ? { key, dir: 'desc' } : null);
const STATUS_ORDER = ['blacklisted', 'processing', 'guest', 'verified'];   // Status sorts by this order

<th scope="col" aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : undefined}
  className="px-4 text-right text-[11px] font-medium uppercase tracking-[0.08em]">
  <button onClick={() => setSort(next(sort, 'velocity'))}
    className={'group inline-flex flex-row-reverse items-center gap-1 rounded-[4px] ' + (active ? 'text-[#121722]' : 'text-[#6B7485]')}>
    Velocity
    {active
      ? dir === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-[#1E63FF]" aria-hidden="true" /> : <ArrowDown className="w-3.5 h-3.5 text-[#1E63FF]" aria-hidden="true" />
      : <ArrowUpDown className="w-3.5 h-3.5 text-[#8C95A6] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true" />}
  </button>
</th>
{/* Non-sortable columns: plain text headers, no icon */}

<p role="status" aria-live="polite" className="sr-only">Sorted by Velocity, descending</p>`;
