import { useCallback, useEffect, useMemo, useState } from 'react';
import { GATES, STATUSES, STATUS_ORDER, VEHICLES, VehicleRow, VehicleStatus, timeValue } from '../sampleData';

export type SortKey = 'plate' | 'driver' | 'gate' | 'vehicleType' | 'status' | 'time' | 'confidence' | 'velocity';
export type SortDir = 'asc' | 'desc';
export interface Sort {
  key: SortKey;
  dir: SortDir;
}
/** Default sort: Time, newest first. */
export const DEFAULT_SORT: Sort = { key: 'time', dir: 'desc' };

export type DateRange = 'all' | 'today' | '7d' | '30d' | 'custom';
export const DATE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: 'all', label: 'Any time' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom range' },
];

export interface TableQuery {
  q: string;
  status: VehicleStatus[];
  gate: string[];
  date: DateRange;
  /** Custom range in days before today (from ≥ to). */
  from: number;
  to: number;
  /** null = default sort. */
  sort: Sort | null;
  page: number;
  pageSize: number;
}

export const DEFAULT_QUERY: TableQuery = { q: '', status: [], gate: [], date: 'all', from: 13, to: 0, sort: null, page: 1, pageSize: 10 };

const SORT_KEYS: SortKey[] = ['plate', 'driver', 'gate', 'vehicleType', 'status', 'time', 'confidence', 'velocity'];
const DATES = DATE_OPTIONS.map((d) => d.value);
const SIZES = [10, 25, 50, 100];

const compare = (a: VehicleRow, b: VehicleRow, key: SortKey): number => {
  switch (key) {
    case 'status':
      return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
    case 'time':
      return timeValue(a) - timeValue(b);
    case 'confidence':
    case 'velocity':
      return a[key] - b[key];
    default:
      return a[key].localeCompare(b[key], 'en-IN');
  }
};

const inDate = (r: VehicleRow, q: TableQuery): boolean => {
  switch (q.date) {
    case 'today':
      return r.daysAgo === 0;
    case '7d':
      return r.daysAgo <= 6;
    case '30d':
      return r.daysAgo <= 29;
    case 'custom':
      return r.daysAgo <= q.from && r.daysAgo >= q.to;
    default:
      return true;
  }
};

/** Filter (search + status + gate + date), then sort. Pure, so it can be memoized. */
export function applyQuery(rows: VehicleRow[], q: TableQuery): VehicleRow[] {
  const term = q.q.trim().toLowerCase().replace(/\s+/g, '');
  const filtered = rows.filter(
    (r) =>
      (!term || r.plate.toLowerCase().replace(/\s+/g, '').includes(term) || r.driver.toLowerCase().replace(/\s+/g, '').includes(term) || r.gate.toLowerCase().replace(/\s+/g, '').includes(term)) &&
      (!q.status.length || q.status.includes(r.status)) &&
      (!q.gate.length || q.gate.includes(r.gate)) &&
      inDate(r, q)
  );
  const sort = q.sort ?? DEFAULT_SORT;
  const sign = sort.dir === 'asc' ? 1 : -1;
  // Stable: ties keep the newest-first order.
  return [...filtered].sort((a, b) => sign * compare(a, b, sort.key) || timeValue(b) - timeValue(a));
}

/* ── URL sync ── */

const readQuery = (prefix: string, base: TableQuery): TableQuery => {
  const p = new URLSearchParams(window.location.search);
  const get = (k: string) => p.get(`${prefix}${k}`);
  const list = (k: string) => (get(k) ?? '').split(',').filter(Boolean);
  const num = (k: string, fallback: number) => {
    const v = Number(get(k));
    return Number.isFinite(v) && get(k) !== null ? v : fallback;
  };
  const [sk, sd] = (get('sort') ?? '').split('.');
  const date = get('date') as DateRange | null;
  return {
    q: get('q') ?? base.q,
    status: list('status').filter((s): s is VehicleStatus => (STATUSES as string[]).includes(s)),
    gate: list('gate').filter((g) => GATES.includes(g)),
    date: date && DATES.includes(date) ? date : base.date,
    from: num('from', base.from),
    to: num('to', base.to),
    sort: (SORT_KEYS as string[]).includes(sk) && (sd === 'asc' || sd === 'desc') ? { key: sk as SortKey, dir: sd } : base.sort,
    page: Math.max(1, Math.floor(num('page', base.page))),
    pageSize: SIZES.includes(num('size', base.pageSize)) ? num('size', base.pageSize) : base.pageSize,
  };
};

const KEYS = ['q', 'status', 'gate', 'date', 'from', 'to', 'sort', 'page', 'size'];

const writeQuery = (prefix: string, q: TableQuery, base: TableQuery) => {
  const url = new URL(window.location.href);
  const set = (k: string, v: string | null) => (v ? url.searchParams.set(`${prefix}${k}`, v) : url.searchParams.delete(`${prefix}${k}`));
  set('q', q.q.trim() || null);
  set('status', q.status.join(',') || null);
  set('gate', q.gate.join(',') || null);
  set('date', q.date !== base.date ? q.date : null);
  set('from', q.date === 'custom' ? String(q.from) : null);
  set('to', q.date === 'custom' ? String(q.to) : null);
  set('sort', q.sort ? `${q.sort.key}.${q.sort.dir}` : null);
  set('page', q.page !== 1 ? String(q.page) : null);
  set('size', q.pageSize !== base.pageSize ? String(q.pageSize) : null);
  if (url.search !== window.location.search) window.history.replaceState(window.history.state, '', url);
};

const clearQuery = (prefix: string) => {
  const url = new URL(window.location.href);
  KEYS.forEach((k) => url.searchParams.delete(`${prefix}${k}`));
  if (url.search !== window.location.search) window.history.replaceState(window.history.state, '', url);
};

interface Options {
  /** URL parameter prefix, unique per table (e.g. "f" → ?fq=&fstatus=). */
  prefix: string;
  initial?: Partial<TableQuery>;
  rows?: VehicleRow[];
}

/**
 * Filter / sort / page state for one table, mirrored in the URL query (replaceState, prefixed keys) and
 * removed from the URL when the table unmounts. Filter, search and sort changes reset to page 1.
 */
export function useTableQuery({ prefix, initial, rows = VEHICLES }: Options) {
  const base = useMemo(() => ({ ...DEFAULT_QUERY, ...initial }), []); // Fixed for the table's lifetime.
  const [query, setQuery] = useState<TableQuery>(() => readQuery(prefix, base));

  useEffect(() => writeQuery(prefix, query, base), [prefix, query, base]);
  useEffect(() => () => clearQuery(prefix), [prefix]);

  // Back/forward restores the query from the URL.
  useEffect(() => {
    const onPop = () => setQuery(readQuery(prefix, base));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [prefix, base]);

  const results = useMemo(() => applyQuery(rows, query), [rows, query]);
  const pageCount = Math.max(1, Math.ceil(results.length / query.pageSize));
  const page = Math.min(query.page, pageCount);
  const pageRows = useMemo(() => results.slice((page - 1) * query.pageSize, page * query.pageSize), [results, page, query.pageSize]);

  /** Change filters, search or sort: always back to page 1. */
  const update = useCallback((patch: Partial<Omit<TableQuery, 'page' | 'pageSize'>>) => setQuery((q) => ({ ...q, ...patch, page: 1 })), []);
  const setPage = useCallback((p: number) => setQuery((q) => ({ ...q, page: p })), []);
  /** Keeps the first visible row in view: page = the page that now holds that row. */
  const setPageSize = useCallback(
    (size: number) => setQuery((q) => ({ ...q, pageSize: size, page: Math.floor(((q.page - 1) * q.pageSize) / size) + 1 })),
    []
  );
  const reset = useCallback(() => setQuery((q) => ({ ...base, pageSize: q.pageSize })), [base]);

  return { query, results, pageRows, page, pageCount, total: rows.length, update, setPage, setPageSize, reset };
}

export type TableQueryApi = ReturnType<typeof useTableQuery>;
