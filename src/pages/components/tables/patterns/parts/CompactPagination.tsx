import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BTN } from '../tableStyles';

/** Compact pagination for cards, side panels and mobile: "Page 2 of 7" + Previous / Next. */
export const CompactPagination: React.FC<{ page: number; pageCount: number; onPage: (page: number) => void }> = ({ page, pageCount, onPage }) => (
  <nav aria-label="Pagination" className="px-4 py-2 border-t border-[#DDE2EA] flex items-center justify-between gap-2 text-[13px] text-[#4B5465]">
    <button type="button" onClick={() => onPage(page - 1)} disabled={page <= 1} aria-label="Previous page" className={BTN.icon}>
      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
    </button>
    <span aria-live="polite">
      Page {page} of {pageCount}
    </span>
    <button type="button" onClick={() => onPage(page + 1)} disabled={page >= pageCount} aria-label="Next page" className={BTN.icon}>
      <ChevronRight className="w-4 h-4" aria-hidden="true" />
    </button>
  </nav>
);
