import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowUp, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { FOCUS_LIGHT, formatNumber } from '../shared/navStyles';

/** Page list with gaps: 1 … 4 5 6 … 25 */
export const pageList = (page: number, total: number): (number | 'gap')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | 'gap')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) out.push('gap');
  for (let p = start; p <= end; p++) out.push(p);
  if (end < total - 1) out.push('gap');
  out.push(total);
  return out;
};

const GHOST = `h-8 px-2 inline-flex items-center gap-1 rounded-[8px] text-[14px] font-medium text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#121722] disabled:text-[#C3CAD5] disabled:hover:bg-transparent disabled:cursor-not-allowed ${FOCUS_LIGHT}`;

interface PaginationProps {
  page: number;
  total: number;
  onPage: (p: number) => void;
  label?: string;
}

/** Numbered pagination: Previous/Next Ghost buttons, 32px pages (current Royal Blue), gaps as "…". */
export const Pagination: React.FC<PaginationProps> = ({ page, total, onPage, label = 'Pagination' }) => (
  <nav aria-label={label}>
    <ul className="flex items-center gap-1 flex-wrap">
      <li>
        <button type="button" onClick={() => onPage(page - 1)} disabled={page <= 1} className={GHOST}>
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden sr-only">Previous page</span>
        </button>
      </li>
      {pageList(page, total).map((p, i) =>
        p === 'gap' ? (
          <li key={`gap-${i}`} aria-hidden="true" className="w-8 h-8 inline-flex items-center justify-center text-[14px] text-[#6B7485]">
            …
          </li>
        ) : (
          <li key={p}>
            <button
              type="button"
              onClick={() => onPage(p)}
              aria-current={p === page ? 'page' : undefined}
              aria-label={`Page ${p}`}
              className={`relative w-8 h-8 inline-flex items-center justify-center rounded-[8px] text-[14px] font-medium font-mono before:absolute before:content-[''] before:-inset-1.5 ${
                p === page ? 'bg-[#1E63FF] text-white' : 'text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#121722]'
              } ${FOCUS_LIGHT}`}
            >
              {p}
            </button>
          </li>
        )
      )}
      <li>
        <button type="button" onClick={() => onPage(page + 1)} disabled={page >= total} className={GHOST}>
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden sr-only">Next page</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </nav>
);

/* ── Numbered with rows-per-page, filter reset and URL ── */

export const NumberedDemo: React.FC = () => {
  const [rows, setRows] = useState(25);
  const [page, setPage] = useState(2);
  const [status, setStatus] = useState<'All' | 'Open'>('All');
  const rowsId = useId();
  const statusId = useId();
  const count = status === 'All' ? 1248 : 312;
  const total = Math.ceil(count / rows);
  const from = (page - 1) * rows + 1;
  const to = Math.min(count, page * rows);
  const url = `/reports/vehicle-log?status=${status.toLowerCase()}&page=${page}&rows=${rows}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor={statusId} className="text-[14px] text-[#353D4C]">
          Status filter
        </label>
        <select
          id={statusId}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as 'All' | 'Open');
            setPage(1); // Filters reset pagination.
          }}
          className="h-10 px-3 rounded-[8px] border border-[#8C95A6] bg-white text-[14px] text-[#121722] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20"
        >
          <option>All</option>
          <option>Open</option>
        </select>
      </div>
      <div className="flex items-center gap-2 h-9 px-3 rounded-[8px] border border-[#DDE2EA] bg-[#F7F9FC] font-mono text-[12px] text-[#353D4C] overflow-hidden">
        <Lock className="w-3.5 h-3.5 shrink-0 text-[#6B7485]" aria-hidden="true" />
        <span className="truncate">{url}</span>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Pagination page={page} total={total} onPage={setPage} label="Vehicle log pages" />
        <div className="flex items-center gap-3 text-[12px] text-[#4B5465]">
          <label htmlFor={rowsId}>Rows per page</label>
          <select
            id={rowsId}
            value={rows}
            onChange={(e) => {
              setRows(Number(e.target.value));
              setPage(1);
            }}
            className="h-8 px-2 rounded-[8px] border border-[#8C95A6] bg-white text-[13px] text-[#121722] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20"
          >
            {[10, 25, 50].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
          <span aria-live="polite" className="whitespace-nowrap">
            Showing {formatNumber(from)}–{formatNumber(to)} of {formatNumber(count)}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── Compact ── */

export const CompactDemo: React.FC = () => {
  const [page, setPage] = useState(3);
  const total = 25;
  return (
    <div className="max-w-[360px] rounded-[12px] border border-[#DDE2EA] bg-white">
      <div className="p-4 space-y-2" aria-hidden="true">
        {Array.from({ length: 3 }, (_, i) => (
          <span key={i} className="block h-8 rounded-[6px] bg-[#F7F9FC]" />
        ))}
      </div>
      <nav aria-label="Camera list pages" className="h-12 px-2 flex items-center justify-between border-t border-[#DDE2EA]">
        <button type="button" onClick={() => setPage(page - 1)} disabled={page <= 1} aria-label="Previous page" className={`w-10 h-10 justify-center ${GHOST}`}>
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>
        <span className="text-[13px] text-[#4B5465]" aria-live="polite">
          Page {page} of {total}
        </span>
        <button type="button" onClick={() => setPage(page + 1)} disabled={page >= total} aria-label="Next page" className={`w-10 h-10 justify-center ${GHOST}`}>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
};

/* ── Load more ── */

const visitorRow = (i: number) => `Visitor V-${2000 + i} · Gate ${(i % 4) + 1}`;

export const LoadMoreDemo: React.FC = () => {
  const [shown, setShown] = useState(10);
  const total = 1248;
  const listRef = useRef<HTMLUListElement>(null);
  const firstNew = useRef<number | null>(null);
  useEffect(() => {
    if (firstNew.current !== null) {
      listRef.current?.querySelector<HTMLElement>(`[data-i="${firstNew.current}"]`)?.focus();
      firstNew.current = null;
    }
  }, [shown]);
  return (
    <div className="max-w-[420px]">
      <ul ref={listRef} className="max-h-[240px] overflow-y-auto rounded-[8px] border border-[#DDE2EA] divide-y divide-[#DDE2EA]" aria-label="Visitors">
        {Array.from({ length: shown }, (_, i) => (
          <li key={i} data-i={i} tabIndex={-1} className="h-10 px-3 flex items-center text-[14px] text-[#353D4C] outline-none focus-visible:bg-[#F7F9FC]">
            {visitorRow(i)}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-[12px] text-[#4B5465]" aria-live="polite">
          Showing {formatNumber(shown)} of {formatNumber(total)}
        </span>
        <button
          type="button"
          onClick={() => {
            firstNew.current = shown;
            setShown((s) => Math.min(total, s + 10));
          }}
          className={`h-10 px-4 rounded-[8px] bg-white border border-[#1E63FF] text-[14px] font-semibold text-[#1E63FF] hover:bg-[#F7F9FC] hover:text-[#0B2D6B] ${FOCUS_LIGHT}`}
        >
          Load more
        </button>
      </div>
    </div>
  );
};

/* ── Infinite scroll for a live feed ── */

const EVENT_KINDS = ['Entry', 'Exit', 'Face match', 'Visitor check-in'];
const feedRow = (n: number) => `#${n} · ${EVENT_KINDS[n % 4]} · Gate ${(n % 4) + 1}`;

export const InfiniteFeedDemo: React.FC = () => {
  const [top, setTop] = useState(500); // newest event number
  const [loaded, setLoaded] = useState(30);
  const [pending, setPending] = useState(0);
  const [atTop, setAtTop] = useState(true);
  const scroller = useRef<HTMLDivElement>(null);
  const atTopRef = useRef(true);
  atTopRef.current = atTop;
  const MAX = 120;

  // New events every 4s: shown immediately at the top, or counted in the pill while you read older ones.
  useEffect(() => {
    const t = window.setInterval(() => {
      if (atTopRef.current) setTop((n) => n + 1);
      else setPending((p) => Math.min(99, p + 1));
    }, 4000);
    return () => window.clearInterval(t);
  }, []);

  // Track the top, and load older events when the end of the list comes near.
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setAtTop(el.scrollTop < 8);
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) setLoaded((l) => Math.min(MAX, l + 20));
  };

  const jumpToTop = () => {
    setTop((n) => n + pending);
    setPending(0);
    scroller.current?.scrollTo({ top: 0 });
    scroller.current?.focus();
  };

  return (
    <div className="max-w-[460px]">
      <div className="relative">
        {pending > 0 && (
          <button
            type="button"
            onClick={jumpToTop}
            className={`absolute z-10 top-2 left-1/2 -translate-x-1/2 h-8 px-3 inline-flex items-center gap-1.5 rounded-full bg-[#1E63FF] text-white text-[13px] font-medium shadow-[0_4px_12px_rgba(11,45,107,0.12)] ${FOCUS_LIGHT}`}
          >
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
            New events ({pending})
          </button>
        )}
        <div
          ref={scroller}
          tabIndex={0}
          role="region"
          aria-label="Live event feed"
          onScroll={onScroll}
          className="h-[280px] overflow-y-auto rounded-[8px] border border-[#DDE2EA] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
        >
          <ul className="divide-y divide-[#DDE2EA]" aria-busy={loaded < MAX}>
            {Array.from({ length: loaded }, (_, i) => (
              <li key={top - i} className="h-10 px-3 flex items-center font-mono text-[12px] text-[#353D4C]">
                {feedRow(top - i)}
              </li>
            ))}
            <li className="h-10 px-3 flex items-center justify-center text-[12px] text-[#6B7485]">
              {loaded < MAX ? 'Loading older events…' : 'That’s everything from today.'}
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-2 text-[12px] text-[#4B5465]">
        Footer stays reachable: the feed scrolls inside its own region, and{' '}
        <a href="#pagination" className={`text-[#1E63FF] hover:underline rounded-[4px] ${FOCUS_LIGHT}`}>
          the page continues below it
        </a>
        .
      </p>
    </div>
  );
};

export const PAGINATION_CODE = `// Numbered pagination: 32px items, current = Royal Blue; gaps "1 … 4 5 6 … 25"
<nav aria-label="Vehicle log pages">
  <ul className="flex items-center gap-1">
    <li><button disabled={page === 1} className="h-8 px-2 rounded-[8px] text-[14px] font-medium text-[#4B5465] hover:bg-[#EEF1F6]"><ChevronLeft className="w-4 h-4" /> Previous</button></li>
    <li><button aria-label="Page 1" className="w-8 h-8 rounded-[8px] text-[14px] text-[#4B5465] hover:bg-[#EEF1F6]">1</button></li>
    <li aria-hidden="true" className="w-8 text-center">…</li>
    <li><button aria-label="Page 5" aria-current="page" className="w-8 h-8 rounded-[8px] bg-[#1E63FF] text-white text-[14px] font-medium">5</button></li>
    {/* … */}
    <li><button className="h-8 px-2 rounded-[8px] …">Next <ChevronRight className="w-4 h-4" /></button></li>
  </ul>
</nav>
<span className="text-[12px] text-[#4B5465]">Showing 201–250 of 1,248</span>

// Rules: reset to page 1 when filters change; keep ?page= (and rows) in the URL.`;
