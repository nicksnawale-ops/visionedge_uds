import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { OnThisPage, TocItem } from './OnThisPage';
import { PageNav } from './PageNav';
import { CommandPalette } from '../common/CommandPalette';
import { TokenDownloadModal } from '../common/TokenDownloadModal';
import { Logo } from '../brand/Logo';

interface AppLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  tocItems?: TocItem[];
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentPath,
  onNavigate,
  tocItems = [],
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#353D4C] flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Container offset for sidebar */}
      <div className="flex-1 flex flex-col md:pl-[240px] transition-all duration-200">
        {/* Sticky Top Bar */}
        <TopBar
          currentPath={currentPath}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenDownloadModal={() => setIsDownloadOpen(true)}
        />

        {/* Content Body */}
        <main className="flex-1 flex justify-center px-4 sm:px-8 py-8 md:py-10">
          <div className="w-full max-w-[1040px] flex gap-10">
            {/* Primary Document Content */}
            <div className="flex-1 min-w-0">
              {children}
              <PageNav currentPath={currentPath} onNavigate={onNavigate} />
            </div>

            {/* Right-Hand Scroll-Spy "On this page" TOC (never on template pages: they use the full-width column) */}
            {tocItems.length > 0 && !currentPath.startsWith('/templates/') && <OnThisPage items={tocItems} />}
          </div>
        </main>

        {/* Page Footer */}
        <footer className="border-t border-[#DDE2EA] bg-white py-6 px-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#6B7485]">
          <div className="flex items-center gap-2.5">
            <Logo size={18} />
            <span>VisionEdge Design System &copy; 2026 VisionEdge Technology Platform. Enterprise Edition.</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('/guidelines/accessibility')}
              className="hover:text-[#1E63FF] transition-colors"
            >
              WCAG 2.2 AA Certified
            </button>
            <button
              onClick={() => onNavigate('/guidelines/design-tokens')}
              className="hover:text-[#1E63FF] transition-colors"
            >
              Tokens v1.0
            </button>
            <button
              onClick={() => onNavigate('/guidelines/review-checklist')}
              className="hover:text-[#1E63FF] transition-colors"
            >
              Review Checklist
            </button>
          </div>
        </footer>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Token Download Modal */}
      <TokenDownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
    </div>
  );
};
