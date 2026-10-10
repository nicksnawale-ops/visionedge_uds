import React from 'react';
import { Menu, Search, Download } from 'lucide-react';
import { PAGES } from '../../data/pages';

interface TopBarProps {
  currentPath: string;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenDownloadModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPath,
  onOpenMobileMenu,
  onOpenSearch,
  onOpenDownloadModal,
}) => {
  const currentPage = PAGES.find((p) => p.path === currentPath) || PAGES[0];

  return (
    <header className="sticky top-0 z-30 h-[64px] bg-white border-b border-[#DDE2EA] flex items-center justify-between px-4 sm:px-6 shadow-[0_1px_3px_rgba(11,45,107,0.04)]">
      {/* Left Zone: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 text-[#4B5465] hover:text-[#121722] hover:bg-[#F7F9FC] rounded-[8px] md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-2 text-[12px] font-normal text-[#4B5465]">
          <span className="text-[#6B7485]">VisionEdge</span>
          <span className="text-[#C3CAD5]">/</span>
          <span className="text-[#6B7485] capitalize">{currentPage.category.toLowerCase()}</span>
          <span className="text-[#C3CAD5]">/</span>
          <span className="font-medium text-[#121722]">{currentPage.title}</span>
        </nav>
      </div>

      {/* Right Zone: Global Search Box & Download Tokens Secondary Button */}
      <div className="flex items-center gap-3">
        {/* Search trigger button styled as input */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-3 px-3 py-1.5 h-[36px] bg-white border border-[#8C95A6] rounded-[8px] text-[13px] text-[#6B7485] hover:border-[#1E63FF] hover:shadow-[0_0_0_2px_rgba(30,99,255,0.15)] transition-all group"
          title="Search documentation (Ctrl+K or Cmd+K)"
        >
          <Search className="w-4 h-4 text-[#8C95A6] group-hover:text-[#1E63FF] transition-colors" />
          <span className="hidden sm:inline">Search tokens, colors, specs...</span>
          <span className="sm:hidden">Search...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono text-[#4B5465] bg-[#F7F9FC] border border-[#DDE2EA] rounded">
            Ctrl K
          </kbd>
        </button>

        {/* Download Tokens Secondary Button */}
        <button
          onClick={onOpenDownloadModal}
          className="flex items-center gap-1.5 px-3 py-1.5 h-[36px] bg-white border border-[#1E63FF] rounded-[8px] text-[13px] font-semibold text-[#1E63FF] hover:bg-[#F7F9FC] hover:shadow-[0_1px_3px_rgba(30,99,255,0.15)] active:bg-[#EEF1F6] transition-all whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span className="hidden xs:inline">Download tokens</span>
          <span className="xs:hidden">Tokens</span>
        </button>
      </div>
    </header>
  );
};
