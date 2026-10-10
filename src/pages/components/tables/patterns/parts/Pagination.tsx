import React, { useId, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BTN, FOCUS, INPUT } from '../tableStyles';

/** "1 2 3 … 7", "1 … 4 5 6 … 12", "1 … 5 6 7". */
export const pageList = (page: number, total: number): (number | 'gap')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (page <= 3) return [1, 2, 3, 4, 'gap', total];
  if (page >= total - 2) return [1, 'gap', total - 3, total - 2, total - 1, total];
  return [1, 'gap', page - 1, page, page + 1, 'gap', total];
};

interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
}

/**
 * Full pagination footer (16px 24px, 1px top border): Rows per page + "Showing 11–20 of 64" on the left;
 * Previous / page numbers (32px, current Royal Blue) / Next and "Go to page" (desktop) on the right.
 */
export const Pagination: React.FC<PaginationProps> = ({ page, pageCount, pageSize, total, onPage, onPageSize }) => {
  const sizeId = useId();
  const goId = useId();
  const [go, setGo] = useState('');
  const from = total ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(total, page * pageSize);

  return (
    <div className="px-6 py-4 max-[767px]:px-4 border-t border-[#DDE2EA] flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-[13px] text-[#4B5465]">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor={sizeId}>Rows per page</label>
        <select id={sizeId} value={pageSize} onChange={(e) => onPageSize(Number(e.target.value))} className={`${INPUT} w-[72px] px-2`}>
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span aria-live="polite">
          Showing {from}–{to} of {total}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <nav aria-label="Pagination">
          <ul className="flex items-center gap-1">
            <li>
              <button type="button" onClick={() => onPage(page - 1)} disabled={page <= 1} aria-label="Previous page" className={BTN.icon}>
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
            </li>
            {pageList(page, pageCount).map((p, i) =>
              p === 'gap' ? (
                <li key={`gap-${i}`} aria-hidden="true" className="w-8 text-center text-[#6B7485]">
                  …
                </li>
              ) : (
                <li key={p}>
                  <button
                    type="button"
                    onClick={() => onPage(p)}
                    aria-label={`Page ${p}`}
                    aria-current={p === page ? 'page' : undefined}
                    className={`w-8 h-8 max-[767px]:w-11 max-[767px]:h-11 rounded-[8px] text-[13px] font-medium font-mono tabular-nums ${
                      p === page ? 'bg-[#1E63FF] text-white' : 'text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#121722]'
                    } ${FOCUS}`}
                  >
                    {p}
                  </button>
                </li>
              )
            )}
            <li>
              <button type="button" onClick={() => onPage(page + 1)} disabled={page >= pageCount} aria-label="Next page" className={BTN.icon}>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </li>
          </ul>
        </nav>
        <form
          className="hidden lg:flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const n = Math.round(Number(go));
            if (n >= 1 && n <= pageCount) onPage(n);
            setGo('');
          }}
        >
          <label htmlFor={goId}>Go to page</label>
          <input id={goId} inputMode="numeric" value={go} onChange={(e) => setGo(e.target.value.replace(/\D/g, ''))} className={`${INPUT} w-14 px-2 text-center font-mono`} />
        </form>
      </div>
    </div>
  );
};
