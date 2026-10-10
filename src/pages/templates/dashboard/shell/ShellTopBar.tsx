import React, { useId, useState } from 'react';
import { Check, ChevronDown, Menu, Search, X } from 'lucide-react';
import { IconButton, POPOVER, usePopover } from '../primitives';
import { SITES } from '../data/useCases';
import type { DashAlert } from '../data/alerts';
import { NotificationsMenu } from './NotificationsMenu';
import { UserMenu } from './UserMenu';

interface ShellTopBarProps {
  /** Opens the navigation drawer (button shown below 768px). */
  onOpenMenu: () => void;
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
  /** Passed to the user menu ("My profile" as the current page). */
  accountCurrent?: 'profile';
  anatomy?: React.ReactNode;
}

/** Site selector: Small (32px) select with a 44px hit area. */
const SiteSelect: React.FC<{ site: string; onChange: (site: string) => void }> = ({ site, onChange }) => {
  const { open, setOpen, rootRef, triggerRef } = usePopover();
  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Site: ${site}`}
        onClick={() => setOpen((o) => !o)}
        className="relative after:absolute after:content-[''] after:-inset-y-1.5 after:inset-x-0 h-8 pl-3 pr-2 inline-flex items-center gap-1.5 rounded-[8px] border border-[#8C95A6] bg-white text-[13px] text-[#121722] hover:border-[#1E63FF] outline-none focus-visible:ring-[3px] focus-visible:ring-[#1E63FF]/20 focus-visible:border-[#1E63FF]"
      >
        {site}
        <ChevronDown className={`w-4 h-4 text-[#4B5465] transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <ul role="listbox" aria-label="Site" className={`${POPOVER} right-0 w-48 py-1`}>
          {SITES.map((s) => (
            <li key={s} role="none">
              <button
                type="button"
                role="option"
                aria-selected={s === site}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                className="w-full h-11 px-3 flex items-center justify-between text-left text-[14px] text-[#121722] hover:bg-[#F7F9FC] outline-none focus-visible:bg-[#F7F9FC] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E63FF]"
              >
                {s}
                {s === site && <Check className="w-4 h-4 text-[#1E63FF]" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/** 64px White top bar with a 1px Gray 200 bottom border. */
export const ShellTopBar: React.FC<ShellTopBarProps> = ({
  onOpenMenu,
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
  accountCurrent,
  anatomy,
}) => {
  const [query, setQuery] = useState('');
  const [mobileSearch, setMobileSearch] = useState(false);
  const uid = useId();

  // Rendered in the bar (≥1024px) and in the mobile row, each with its own id.
  const searchBox = (where: 'bar' | 'row') => (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(query);
      }}
      className="relative w-full"
    >
      <label htmlFor={`${uid}-${where}`} className="sr-only">
        Search plates, people and cameras
      </label>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7485] pointer-events-none" aria-hidden="true" />
      <input
        id={`${uid}-${where}`}
        ref={searchRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search plates, people, cameras…"
        className="w-full h-10 pl-9 pr-14 rounded-[8px] border border-[#8C95A6] bg-white text-[14px] text-[#121722] placeholder:text-[#6B7485] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20"
      />
      <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-[#DDE2EA] bg-[#F7F9FC] font-mono text-[11px] text-[#4B5465]">
        Ctrl K
      </kbd>
    </form>
  );

  return (
    <header className="relative shrink-0 bg-white border-b border-[#DDE2EA]">
      {anatomy}
      <div className="h-16 flex items-center gap-2 px-3 @min-[768px]:px-6">
        {/* Layout by container width (no JS measuring): menu < 768px, search box ≥ 1024px, search button below. */}
        <IconButton icon={Menu} label="Open navigation" onClick={onOpenMenu} className="@min-[768px]:hidden" />
        <IconButton
          icon={mobileSearch ? X : Search}
          label={mobileSearch ? 'Close search' : 'Search'}
          aria-expanded={mobileSearch}
          onClick={() => setMobileSearch((s) => !s)}
          className="@min-[1024px]:hidden"
        />
        <div className="hidden @min-[1024px]:block w-[320px]">{searchBox('bar')}</div>

        <div className="ml-auto flex items-center gap-1 @min-[768px]:gap-3">
          <div className="hidden @min-[1024px]:block">
            <SiteSelect site={site} onChange={onSiteChange} />
          </div>
          <button
            type="button"
            aria-pressed={live}
            aria-label={live ? 'Live updates on. Pause' : 'Live updates paused. Resume'}
            onClick={onToggleLive}
            className="h-11 px-2 inline-flex items-center gap-2 rounded-[8px] text-[12px] font-medium text-[#353D4C] hover:bg-[#EEF1F6] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
          >
            <span className="relative flex w-2 h-2" aria-hidden="true">
              {live && <span className="absolute inset-0 rounded-full bg-[#00C6FF] opacity-75 motion-safe:animate-ping" />}
              <span className={`relative w-2 h-2 rounded-full ${live ? 'bg-[#00C6FF]' : 'bg-[#8C95A6]'}`} />
            </span>
            {live ? 'Live' : 'Paused'}
          </button>
          <NotificationsMenu alerts={alerts} unread={unread} />
          <UserMenu signOutHref={signOutHref} newTab={newTab} current={accountCurrent} />
        </div>
      </div>
      {mobileSearch && (
        <div className="px-3 pb-3 space-y-2 @min-[1024px]:hidden">
          {searchBox('row')}
          <SiteSelect site={site} onChange={onSiteChange} />
        </div>
      )}
    </header>
  );
};
