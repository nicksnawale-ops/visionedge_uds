import React from 'react';
import { SearchX } from 'lucide-react';
import { useToast } from '../../../../components/common/Toast';
import { useTableQuery } from './hooks/useTableQuery';
import { FilterToolbar } from './parts/FilterToolbar';
import { FilterChips } from './parts/FilterChips';
import { CompactPagination } from './parts/CompactPagination';
import { LiveRegion } from './parts/LiveRegion';
import { COLUMN_LABEL, Cell, ColumnKey, NUMERIC, ViewButton } from './cells';
import { BTN, TABLE } from './tableStyles';

const COLS: ColumnKey[] = ['plate', 'driver', 'gate', 'status', 'time', 'velocity'];

/** Shared "no results" block (pattern 1 and the States pattern). */
export const NoResults: React.FC<{ onClear: () => void; colSpan: number }> = ({ onClear, colSpan }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-14">
      <div className="flex flex-col items-center text-center gap-2">
        <SearchX className="w-8 h-8 text-[#8C95A6]" aria-hidden="true" />
        <p className="text-[14px] font-medium text-[#121722]">No vehicles match these filters.</p>
        <button type="button" onClick={onClear} className={BTN.ghostSm}>
          Clear filters
        </button>
      </div>
    </td>
  </tr>
);

/** Pattern 1: search + Status / Gate / Date filters, active chips, result count, URL sync. */
export const FilteringTable: React.FC = () => {
  const api = useTableQuery({ prefix: 'f' });
  const { showToast } = useToast();
  const count = `Showing ${api.results.length} of ${api.total} vehicles`;

  return (
    <div className={TABLE.card}>
      <FilterToolbar api={api} extra={<span className="text-[13px] text-[#4B5465] whitespace-nowrap">{count}</span>} />
      <LiveRegion message={count} />
      <FilterChips api={api} />
      <div className={TABLE.scroll}>
        <table className={`${TABLE.table} min-w-[760px]`}>
          <caption className="sr-only">Vehicle log, filtered</caption>
          <thead>
            <tr className={TABLE.headRow}>
              {COLS.map((c) => (
                <th key={c} scope="col" className={`${TABLE.th} ${NUMERIC.includes(c) ? 'text-right' : ''}`}>
                  {COLUMN_LABEL[c]}
                </th>
              ))}
              <th scope="col" className={`${TABLE.th} w-14`}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {api.pageRows.length === 0 ? (
              <NoResults onClear={api.reset} colSpan={COLS.length + 1} />
            ) : (
              api.pageRows.map((r) => (
                <tr key={r.id} className={`${TABLE.row} h-12`}>
                  {COLS.map((c) => (
                    <Cell key={c} row={r} col={c} />
                  ))}
                  <td className="px-2 text-center">
                    <ViewButton row={r} onView={(row) => showToast(`Opening ${row.plate}`, 'info')} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {api.results.length > api.query.pageSize && <CompactPagination page={api.page} pageCount={api.pageCount} onPage={api.setPage} />}
    </div>
  );
};

export const FILTERING_CODE = `// Filtering: search (debounced 300ms) + filter buttons + active chips; filters live in the URL and reset to page 1
const [query, setQuery] = useState(readQueryFromUrl());          // { q, status: [], gate: [], date: 'all', page }
const update = (patch) => setQuery((q) => ({ ...q, ...patch, page: 1 }));
const results = useMemo(() => applyFilters(VEHICLES, query), [query]);

<div className="p-4 border-b border-[#DDE2EA] flex flex-col md:flex-row md:items-center gap-3">
  <div className="relative w-full md:w-[320px]">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7485]" aria-hidden="true" />
    <input type="search" aria-label="Search vehicles" placeholder="Search plate, driver or gate…"
      className="w-full h-8 pl-9 pr-3 rounded-[8px] border border-[#8C95A6] text-[13px]" />
  </div>
  {/* Active filter: Royal Blue 8% fill, 1px Royal Blue border, value in the label */}
  <button aria-haspopup="dialog" aria-expanded={open}
    className="h-8 px-3 inline-flex items-center gap-1.5 rounded-[8px] border border-[#1E63FF] bg-[#1E63FF]/[0.08] text-[13px] font-semibold text-[#1E63FF]">
    Status: Verified, Processing <ChevronDown className="w-4 h-4" aria-hidden="true" />
  </button>
  <span aria-live="polite" className="md:ml-auto text-[13px] text-[#4B5465]">Showing 18 of 64 vehicles</span>
</div>

{/* Active filters */}
<div className="px-4 py-2.5 border-b border-[#DDE2EA] flex flex-wrap gap-2">
  <span className="inline-flex items-center gap-1 h-7 pl-2.5 pr-1 rounded-full bg-[#EEF1F6] text-[12px] font-medium text-[#353D4C]">
    Status: Verified
    <button aria-label="Remove Status: Verified" className="w-5 h-5 rounded-full hover:bg-[#DDE2EA]"><X className="w-3.5 h-3.5" /></button>
  </span>
  <button className="h-8 px-3 rounded-[8px] text-[13px] font-semibold text-[#1E63FF] hover:bg-[#EEF1F6]">Clear all</button>
</div>`;
