import React, { useEffect, useRef, useState } from 'react';
import { useTableQuery } from './hooks/useTableQuery';
import { Pagination } from './parts/Pagination';
import { CompactPagination } from './parts/CompactPagination';
import { COLUMN_LABEL, Cell, ColumnKey, NUMERIC } from './cells';
import { CHIP, CHIP_OFF, CHIP_ON, TABLE } from './tableStyles';

const COLS: ColumnKey[] = ['plate', 'driver', 'gate', 'status', 'time', 'velocity'];

/** True below 768px (the compact variant is used there). Listener removed on unmount. */
function useNarrow(): boolean {
  const query = '(max-width: 767px)';
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return narrow;
}

/** Pattern 3: full or compact pagination; page and rows per page in the URL; first visible row kept on resize. */
export const PaginationTable: React.FC = () => {
  const api = useTableQuery({ prefix: 'p' });
  const [variant, setVariant] = useState<'full' | 'compact'>('full');
  const narrow = useNarrow();
  const compact = variant === 'compact' || narrow;
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstPage = useRef(true);
  /** Row that was first on screen when rows-per-page changed. */
  const anchor = useRef<string | null>(null);

  // A page change brings the table's first row back into view (inside the card, not the page);
  // a rows-per-page change scrolls to the row that was first before.
  useEffect(() => {
    if (firstPage.current) {
      firstPage.current = false;
      return;
    }
    const sc = scrollRef.current;
    if (!sc) return;
    const row = anchor.current ? sc.querySelector<HTMLElement>(`[data-row="${anchor.current}"]`) : null;
    const head = sc.querySelector('thead')?.getBoundingClientRect().height ?? 0;
    sc.scrollTo({ top: row ? row.offsetTop - head : 0 });
    anchor.current = null;
  }, [api.page, api.query.pageSize]);

  const changeSize = (size: number) => {
    anchor.current = api.pageRows[0]?.id ?? null;
    api.setPageSize(size);
  };

  return (
    <div className="space-y-3">
      <div role="group" aria-label="Pagination variant" className="flex flex-wrap items-center gap-2">
        {(
          [
            ['full', 'Full'],
            ['compact', 'Compact'],
          ] as const
        ).map(([v, label]) => (
          <button key={v} type="button" aria-pressed={variant === v} onClick={() => setVariant(v)} className={`${CHIP} ${variant === v ? CHIP_ON : CHIP_OFF}`}>
            {label}
          </button>
        ))}
        {narrow && variant === 'full' && <span className="text-[12px] text-[#6B7485]">Compact is used below 768px.</span>}
      </div>
      <div className={TABLE.card}>
        <div ref={scrollRef} className={`${TABLE.scroll} max-h-[560px] overflow-y-auto`}>
          <table className={`${TABLE.table} min-w-[720px]`}>
            <caption className="sr-only">
              Vehicle log, page {api.page} of {api.pageCount}
            </caption>
            <thead className="sticky top-0 z-10">
              <tr className={TABLE.headRow}>
                {COLS.map((c) => (
                  <th key={c} scope="col" className={`${TABLE.th} ${NUMERIC.includes(c) ? 'text-right' : ''}`}>
                    {COLUMN_LABEL[c]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {api.pageRows.map((r) => (
                <tr key={r.id} data-row={r.id} className={`${TABLE.row} h-12`}>
                  {COLS.map((c) => (
                    <Cell key={c} row={r} col={c} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {compact ? (
          <CompactPagination page={api.page} pageCount={api.pageCount} onPage={api.setPage} />
        ) : (
          <Pagination page={api.page} pageCount={api.pageCount} pageSize={api.query.pageSize} total={api.results.length} onPage={api.setPage} onPageSize={changeSize} />
        )}
      </div>
    </div>
  );
};

export const PAGINATION_CODE = `// Full pagination footer (16px 24px, 1px top border); the page lives in the URL (?page=2&size=10)
<div className="px-6 py-4 border-t border-[#DDE2EA] flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-[13px] text-[#4B5465]">
  <div className="flex items-center gap-3">
    <label htmlFor="rows">Rows per page</label>
    <select id="rows" value={size} onChange={(e) => setSize(Number(e.target.value))}>{/* 10 · 25 · 50 · 100 */}</select>
    <span aria-live="polite">Showing 11–20 of 64</span>
  </div>
  <nav aria-label="Pagination">
    <ul className="flex items-center gap-1">
      <li><button aria-label="Previous page" disabled={page === 1} className="w-8 h-8 rounded-[8px] text-[#4B5465] hover:bg-[#EEF1F6] disabled:text-[#C3CAD5]"><ChevronLeft className="w-4 h-4" /></button></li>
      <li><button aria-label="Page 2" aria-current="page" className="w-8 h-8 rounded-[8px] bg-[#1E63FF] text-white text-[13px] font-medium">2</button></li>
      <li aria-hidden="true" className="w-8 text-center">…</li>
      <li><button aria-label="Next page" className="w-8 h-8 rounded-[8px] text-[#4B5465] hover:bg-[#EEF1F6]"><ChevronRight className="w-4 h-4" /></button></li>
    </ul>
  </nav>
</div>

// Changing rows per page keeps the first visible row in view:
const setSize = (size) => setQuery((q) => ({ ...q, size, page: Math.floor(((q.page - 1) * q.size) / size) + 1 }));

// Compact (cards, side panels, mobile): "Page 2 of 7" + Previous / Next only. Disabled — not hidden — at the ends.`;
