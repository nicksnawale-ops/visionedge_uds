import React, { useId, useRef, useState } from 'react';
import { ShellSidebar } from './ShellSidebar';
import { ShellTopBar } from './ShellTopBar';
import type { DashboardUseCase } from '../data/useCases';
import type { DashAlert } from '../data/alerts';

interface AppShellProps {
  useCase: DashboardUseCase;
  /** User preference; below 1280px the sidebar is collapsed anyway. */
  userCollapsed: boolean;
  onToggleCollapsed: () => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
  onSearch: (query: string) => void;
  site: string;
  onSiteChange: (site: string) => void;
  live: boolean;
  onToggleLive: () => void;
  alerts: DashAlert[];
  unread: number;
  signOutHref: string;
  newTab: boolean;
  anatomy: { sidebar: React.ReactNode; topBar: React.ReactNode };
  /** Full-screen route: the content is the page's <main>. Inside the docs it is a labelled region. */
  landmarkMain: boolean;
  /** Sidebar item marked as current. Default "dashboard"; null when the page is outside the module nav. */
  activeNavId?: string | null;
  /** Marks an account page as current in the user menu (e.g. "profile"). */
  accountCurrent?: 'profile';
  /** Accessible name of the content region inside the docs. Default "Dashboard content". */
  contentLabel?: string;
  children: React.ReactNode;
}

/**
 * Product app shell: sidebar + 64px top bar + scrolling content on Gray 50.
 * Only the content area scrolls, so the shell stays put (and fixed toasts and modals stay in place).
 * ≥1280px expanded sidebar · 768–1279px 72px sidebar · <768px drawer (container queries, no JS measuring).
 */
export const AppShell: React.FC<AppShellProps> = ({
  useCase,
  userCollapsed,
  onToggleCollapsed,
  searchRef,
  onSearch,
  site,
  onSiteChange,
  live,
  onToggleLive,
  alerts,
  unread,
  signOutHref,
  newTab,
  anatomy,
  landmarkMain,
  activeNavId = 'dashboard',
  accountCurrent,
  contentLabel = 'Dashboard content',
  children,
}) => {
  const mainId = useId();
  const mainRef = useRef<HTMLDivElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const Main = landmarkMain ? 'main' : 'div';

  return (
    <div className="relative h-full flex overflow-hidden bg-[#F7F9FC] text-[#353D4C]">
      <a
        href={`#${mainId}`}
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-[8px] focus:bg-white focus:text-[#1E63FF] focus:font-semibold focus:shadow-[0_4px_12px_rgba(11,45,107,0.12)] focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
      >
        Skip to content
      </a>

      <ShellSidebar
        useCase={useCase}
        variant="inline"
        userCollapsed={userCollapsed}
        onToggleCollapsed={onToggleCollapsed}
        onCloseDrawer={() => setDrawerOpen(false)}
        alertCount={unread}
        activeId={activeNavId}
        anatomy={anatomy.sidebar}
      />
      {drawerOpen && (
        <div className="@min-[768px]:hidden">
          <div className="absolute inset-0 z-40 bg-black/50" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <ShellSidebar
            useCase={useCase}
            variant="drawer"
            userCollapsed={false}
            onToggleCollapsed={onToggleCollapsed}
            onCloseDrawer={() => setDrawerOpen(false)}
            alertCount={unread}
            activeId={activeNavId}
          />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <ShellTopBar
          onOpenMenu={() => setDrawerOpen(true)}
          searchRef={searchRef}
          onSearch={onSearch}
          site={site}
          onSiteChange={onSiteChange}
          live={live}
          onToggleLive={onToggleLive}
          alerts={alerts}
          unread={unread}
          signOutHref={signOutHref}
          newTab={newTab}
          accountCurrent={accountCurrent}
          anatomy={anatomy.topBar}
        />
        <Main
          id={mainId}
          ref={mainRef}
          tabIndex={-1}
          role={landmarkMain ? undefined : 'region'}
          aria-label={landmarkMain ? undefined : contentLabel}
          className="flex-1 min-h-0 overflow-y-auto outline-none"
        >
          {children}
        </Main>
      </div>
    </div>
  );
};
