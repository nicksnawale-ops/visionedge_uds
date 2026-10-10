import React, { useEffect, useId, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Download, ListFilter, Search } from 'lucide-react';
import { useToast } from '../../../../components/common/Toast';
import { BUTTON, Badge, Card, IconButton, LINK, Skeleton, demoLink } from '../primitives';
import { EventRow, EventTable, StatusTone, cellText } from '../data/events';
import { WidgetSelect, type WidgetSelectOption } from '../parts/WidgetSelect';

interface RecentEventsTableProps {
  table: EventTable;
  mode: 'ready' | 'loading' | 'empty';
  /** Query pushed from the global search in the top bar. */
  externalQuery: string;
  anatomy?: React.ReactNode;
}

type SortDir = 'asc' | 'desc';
const PAGE_SIZES = [10, 25, 50] as const;

/** Status-filter dots use the same tones as the status badges. */
const DOT: Record<StatusTone, { cls: string; name: string }> = {
  neutral: { cls: 'bg-[#8C95A6]', name: 'Neutral' },
  info: { cls: 'bg-[#1E63FF]', name: 'Info' },
  critical: { cls: 'bg-[#0B2D6B]', name: 'Critical' },
  live: { cls: 'bg-[#00C6FF]', name: 'Live' },
};

const SIZE_OPTIONS: ReadonlyArray<WidgetSelectOption<(typeof PAGE_SIZES)[number]>> = PAGE_SIZES.map((s) => ({ value: s, label: String(s), mono: true }));

/** "Recent events" (12 columns): Tables standard with search, status filter, sorting, selection, bulk actions and pagination. */
export const RecentEventsTable: React.FC<RecentEventsTableProps> = ({ table, mode, externalQuery, anatomy }) => {
  const { showToast } = useToast();
  const uid = useId();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState<{ key: string; dir: SortDir }>({ key: 'time', dir: 'desc' });
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [reviewed, setReviewed] = useState<string[]>([]);

  // Global search from the top bar fills the table search.
  useEffect(() => {
    if (externalQuery) setQuery(externalQuery);
  }, [externalQuery]);

  useEffect(() => setPage(0), [query, status, pageSize]);

  const rows = mode === 'ready' ? table.rows : [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = rows.filter(
      (r) =>
        (status === 'all' || r.status.label === status) &&
        (!q || table.columns.some((c) => cellText(r, c.key).toLowerCase().includes(q)) || r.status.label.toLowerCase().includes(q))
    );
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sort.key === 'time' || sort.key === 'checkIn') return (a.sortTime - b.sortTime) * dir;
      if (sort.key === 'confidence') return (parseFloat(cellText(a, sort.key)) - parseFloat(cellText(b, sort.key))) * dir;
      return cellText(a, sort.key).localeCompare(cellText(b, sort.key)) * dir;
    });
  }, [rows, table.columns, query, status, sort]);

  // Status filter options: badge-tone dot + live count from the current data.
  const statusOptions = useMemo<WidgetSelectOption<string>[]>(() => {
    const count = (label: string) => rows.filter((r) => r.status.label === label).length;
    const plural = (n: number) => `${n} ${table.noun}${n === 1 ? '' : 's'}`;
    return [
      {
        value: 'all',
        label: 'All statuses',
        leading: <ListFilter className="w-4 h-4 shrink-0 text-[#4B5465]" aria-hidden="true" />,
        meta: String(rows.length),
        srMeta: plural(rows.length),
      },
      ...table.statuses.map((s) => {
        const tone = table.rows.find((r) => r.status.label === s)?.status.tone ?? 'neutral';
        const n = count(s);
        return {
          value: s,
          label: s,
          leading: (
            <span className="w-4 h-4 shrink-0 flex items-center justify-center">
              <span className={`w-2 h-2 rounded-full ${DOT[tone].cls}`} aria-hidden="true" />
            </span>
          ),
          meta: String(n),
          srMeta: `${DOT[tone].name} status, ${plural(n)}`,
        };
      }),
    ];
  }, [rows, table.rows, table.statuses, table.noun]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const allOnPageSelected = pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id));

  const toggleSort = (key: string) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  const toggleRow = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = () =>
    setSelected((s) => (allOnPageSelected ? s.filter((id) => !pageRows.some((r) => r.id === id)) : [...new Set([...s, ...pageRows.map((r) => r.id)])]));

  const noun = (n: number) => `${n} ${table.noun}${n === 1 ? '' : 's'}`;
  const ariaSort = (key: string): React.AriaAttributes['aria-sort'] =>
    sort.key === key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none';

  const renderCell = (row: EventRow, key: string, mono?: boolean, numeric?: boolean) => {
    const text = cellText(row, key);
    if (mono && (key === 'plate' || key === 'student' || key === 'pass' || key === 'event')) {
      return (
        <span className="font-mono text-[13px] font-semibold text-[#121722] bg-[#F7F9FC] px-2 py-0.5 rounded border border-[#DDE2EA] whitespace-nowrap">
          {text}
        </span>
      );
    }
    return <span className={`${mono ? 'font-mono text-[13px]' : ''} ${numeric ? 'tabular-nums' : ''}`}>{text}</span>;
  };

  return (
    <Card
      title="Recent events"
      subtitle={mode === 'ready' ? `${filtered.length} of ${table.rows.length} shown · All times IST` : undefined}
      className="col-span-12"
      overlay={anatomy}
      actions={
        <>
          <div className="relative">
            <label htmlFor={`${uid}-q`} className="sr-only">
              Search events
            </label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7485] pointer-events-none" aria-hidden="true" />
            <input
              id={`${uid}-q`}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-[200px] h-10 pl-9 pr-3 rounded-[8px] border border-[#8C95A6] bg-white text-[14px] text-[#121722] placeholder:text-[#6B7485] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20"
            />
          </div>
          <WidgetSelect
            label="Filter by status"
            options={statusOptions}
            value={status}
            onChange={setStatus}
            icon={ListFilter}
            active={status !== 'all'}
            minPopoverWidth={220}
          />
          <a href="#log" onClick={demoLink} className={LINK}>
            View full log
          </a>
        </>
      }
    >
      <div className="-mx-4 @min-[768px]:-mx-6 border-t border-[#DDE2EA]">
        {selected.length > 0 && (
          <div className="px-4 @min-[768px]:px-6 py-2.5 bg-[#1E63FF]/[0.08] border-b border-[#DDE2EA] flex flex-wrap items-center justify-between gap-2 text-[13px]">
            <span className="font-semibold text-[#0B2D6B]" aria-live="polite">
              {noun(selected.length)} selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => showToast(`Exported ${noun(selected.length)} to CSV`, 'info')}
                className={BUTTON.secondarySm}
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                Export selected
              </button>
              <button
                type="button"
                onClick={() => {
                  setReviewed((r) => [...new Set([...r, ...selected])]);
                  showToast(`Marked ${noun(selected.length)} as reviewed`, 'success');
                  setSelected([]);
                }}
                className={BUTTON.ghostSm}
              >
                Mark reviewed
              </button>
              <button type="button" onClick={() => setSelected([])} className={BUTTON.ghostSm}>
                Clear selection
              </button>
            </div>
          </div>
        )}

        <div className="overflow-auto max-h-[560px]">
          <table className="w-full min-w-[760px] text-left border-collapse text-[14px]">
            <caption className="sr-only">Recent events, {mode === 'ready' ? `${filtered.length} rows` : 'loading'}</caption>
            <thead>
              <tr className="h-10 sticky top-0 z-10 bg-[#F7F9FC] border-b border-[#DDE2EA]">
                <th scope="col" className="w-12 px-4 @min-[768px]:px-6">
                  <input
                    type="checkbox"
                    aria-label="Select all rows on this page"
                    checked={allOnPageSelected}
                    disabled={pageRows.length === 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded-[4px] border border-[#8C95A6] accent-[#1E63FF] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
                  />
                </th>
                {table.columns.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={c.sortable ? ariaSort(c.key) : undefined}
                    className={`px-3 @min-[1280px]:px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] whitespace-nowrap ${c.numeric ? 'text-right' : ''}`}
                  >
                    {c.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(c.key)}
                        className={`inline-flex items-center gap-1 h-10 uppercase tracking-[0.08em] hover:text-[#121722] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] rounded-[4px] ${c.numeric ? 'flex-row-reverse' : ''}`}
                      >
                        {c.label}
                        {sort.key === c.key ? (
                          sort.dir === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-[#1E63FF]" aria-hidden="true" /> : <ArrowDown className="w-3.5 h-3.5 text-[#1E63FF]" aria-hidden="true" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                ))}
                <th scope="col" className="px-3 @min-[1280px]:px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  Status
                </th>
                <th scope="col" className="px-4 @min-[768px]:px-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {mode === 'loading' &&
                Array.from({ length: 10 }, (_, i) => (
                  <tr key={i} className="h-12">
                    <td className="px-4 @min-[768px]:px-6">
                      <Skeleton className="h-4 w-4" />
                    </td>
                    {table.columns.map((c) => (
                      <td key={c.key} className="px-3 @min-[1280px]:px-4">
                        <Skeleton className={`h-4 ${c.numeric ? 'w-12 ml-auto' : 'w-24'}`} />
                      </td>
                    ))}
                    <td className="px-3 @min-[1280px]:px-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td />
                  </tr>
                ))}

              {mode !== 'loading' && pageRows.length === 0 && (
                <tr>
                  <td colSpan={table.columns.length + 3} className="px-6 py-12 text-center text-[14px] text-[#4B5465]">
                    {mode === 'empty' ? 'No events recorded yet.' : 'No events match your search or filter.'}
                  </td>
                </tr>
              )}

              {pageRows.map((row) => {
                const isSelected = selected.includes(row.id);
                const isReviewed = reviewed.includes(row.id);
                return (
                  <tr key={row.id} className={`group h-12 transition-colors ${isSelected ? 'bg-[#1E63FF]/[0.04]' : 'hover:bg-[#F7F9FC]'}`}>
                    <td className="px-4 @min-[768px]:px-6">
                      <input
                        type="checkbox"
                        aria-label={`Select ${cellText(row, table.columns[0].key)}`}
                        checked={isSelected}
                        onChange={() => toggleRow(row.id)}
                        className="w-4 h-4 rounded-[4px] border border-[#8C95A6] accent-[#1E63FF] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
                      />
                    </td>
                    {table.columns.map((c) => (
                      <td key={c.key} className={`px-3 @min-[1280px]:px-4 text-[#353D4C] whitespace-nowrap ${c.numeric ? 'text-right' : ''}`}>
                        {renderCell(row, c.key, c.mono, c.numeric)}
                      </td>
                    ))}
                    <td className="px-3 @min-[1280px]:px-4 whitespace-nowrap">
                      <Badge tone={isReviewed ? 'neutral' : row.status.tone}>{isReviewed ? 'Reviewed' : row.status.label}</Badge>
                    </td>
                    <td className="px-4 @min-[768px]:px-6 text-right">
                      <button
                        type="button"
                        onClick={() => showToast(`Opening ${cellText(row, table.columns[0].key)}`, 'info')}
                        aria-label={`View ${cellText(row, table.columns[0].key)}`}
                        className={`${BUTTON.ghostSm} opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 @min-[768px]:px-6 pt-3 border-t border-[#DDE2EA] flex flex-wrap items-center justify-between gap-3 text-[13px] text-[#4B5465]">
          <div className="flex items-center gap-2">
            <span aria-hidden="true">Rows per page</span>
            <WidgetSelect label="Rows per page" options={SIZE_OPTIONS} value={pageSize} onChange={setPageSize} size="sm" placement="above" />
          </div>
          <div className="flex items-center gap-1">
            <span className="tabular-nums mr-2" aria-live="polite">
              {filtered.length === 0 ? '0' : `${page * pageSize + 1}–${Math.min(filtered.length, (page + 1) * pageSize)}`} of {filtered.length}
            </span>
            <IconButton icon={ChevronLeft} label="Previous page" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="disabled:opacity-40 disabled:cursor-not-allowed" />
            <IconButton icon={ChevronRight} label="Next page" disabled={page >= pageCount - 1} onClick={() => setPage((p) => p + 1)} className="disabled:opacity-40 disabled:cursor-not-allowed" />
          </div>
        </div>
      </div>
    </Card>
  );
};
