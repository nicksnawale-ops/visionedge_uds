import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PAGES, PageMeta } from '../../data/pages';

interface PageNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const PageNav: React.FC<PageNavProps> = ({ currentPath, onNavigate }) => {
  const currentIndex = PAGES.findIndex((p) => p.path === currentPath);
  const prevPage: PageMeta | undefined = currentIndex > 0 ? PAGES[currentIndex - 1] : undefined;
  const nextPage: PageMeta | undefined =
    currentIndex >= 0 && currentIndex < PAGES.length - 1 ? PAGES[currentIndex + 1] : undefined;

  return (
    <div className="mt-16 pt-8 border-t border-[#DDE2EA] grid grid-cols-1 sm:grid-cols-2 gap-4">
      {prevPage ? (
        <button
          onClick={() => {
            onNavigate(prevPage.path);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-4 p-4 rounded-[12px] border border-[#DDE2EA] bg-white text-left hover:border-[#1E63FF] hover:shadow-[0_4px_12px_rgba(11,45,107,0.08)] transition-all group"
        >
          <div className="w-9 h-9 rounded-full bg-[#F7F9FC] border border-[#DDE2EA] flex items-center justify-center shrink-0 group-hover:bg-[#1E63FF]/10 group-hover:text-[#1E63FF] transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#4B5465] group-hover:text-[#1E63FF]" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] block">
              Previous
            </span>
            <span className="text-[14px] font-semibold text-[#121722] group-hover:text-[#1E63FF] truncate block">
              {prevPage.title}
            </span>
          </div>
        </button>
      ) : (
        <div className="hidden sm:block" />
      )}

      {nextPage && (
        <button
          onClick={() => {
            onNavigate(nextPage.path);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center justify-between p-4 rounded-[12px] border border-[#DDE2EA] bg-white text-right hover:border-[#1E63FF] hover:shadow-[0_4px_12px_rgba(11,45,107,0.08)] transition-all group sm:col-start-2"
        >
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] block">
              Next
            </span>
            <span className="text-[14px] font-semibold text-[#121722] group-hover:text-[#1E63FF] truncate block">
              {nextPage.title}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#F7F9FC] border border-[#DDE2EA] flex items-center justify-center shrink-0 ml-4 group-hover:bg-[#1E63FF]/10 group-hover:text-[#1E63FF] transition-colors">
            <ArrowRight className="w-4 h-4 text-[#4B5465] group-hover:text-[#1E63FF]" />
          </div>
        </button>
      )}
    </div>
  );
};
