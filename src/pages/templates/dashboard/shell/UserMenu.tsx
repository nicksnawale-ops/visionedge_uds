import React, { useEffect, useRef } from 'react';
import { LogOut, Settings, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { POPOVER, usePopover } from '../primitives';
import { CURRENT_USER } from '../data/useCases';

interface UserMenuProps {
  /** Where "Sign out" goes (the Login template for this use case). */
  signOutHref: string;
  /** Open links in a new tab (inside the docs preview). */
  newTab: boolean;
  /** Marks "My profile" as the current page (profile screens). Default: plain "Profile" item. */
  current?: 'profile';
}

/** Avatar button opening a menu: Profile, Settings, Sign out. Arrow keys move, Esc closes. */
export const UserMenu: React.FC<UserMenuProps> = ({ signOutHref, newTab, current }) => {
  const { open, setOpen, rootRef, triggerRef } = usePopover();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) listRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') items[(i + 1) % items.length]?.focus();
    else if (e.key === 'ArrowUp') items[(i - 1 + items.length) % items.length]?.focus();
    else if (e.key === 'Tab') setOpen(false);
    else return;
    if (e.key !== 'Tab') e.preventDefault();
  };

  const item = (icon: LucideIcon, label: string, href: string, external = false, isCurrent = false) => {
    const Icon = icon;
    return (
      <li role="none">
        <a
          role="menuitem"
          href={href}
          onClick={(e) => {
            if (!external) e.preventDefault();
            setOpen(false);
          }}
          {...(external && newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          aria-current={isCurrent ? 'page' : undefined}
          className={`flex items-center gap-3 h-11 px-4 text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E63FF] ${
            isCurrent
              ? 'bg-[#1E63FF]/[0.08] text-[#1E63FF] font-medium'
              : 'text-[#353D4C] hover:bg-[#F7F9FC] hover:text-[#121722] focus-visible:bg-[#F7F9FC]'
          }`}
        >
          <Icon className={`w-4 h-4 ${isCurrent ? 'text-[#1E63FF]' : 'text-[#4B5465]'}`} aria-hidden="true" />
          {label}
        </a>
      </li>
    );
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${CURRENT_USER.name}`}
        onClick={() => setOpen((o) => !o)}
        className="w-11 h-11 rounded-full flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
      >
        <span className="w-8 h-8 rounded-full bg-[#1E63FF] text-white text-[12px] font-semibold flex items-center justify-center" aria-hidden="true">
          {CURRENT_USER.initials}
        </span>
      </button>
      {open && (
        <div className={`${POPOVER} right-0 w-[220px] py-1`} onKeyDown={onKeyDown}>
          <div className="px-4 py-2 border-b border-[#DDE2EA]">
            <span className="block text-[14px] font-semibold text-[#121722]">{CURRENT_USER.name}</span>
            <span className="block text-[12px] text-[#4B5465]">{CURRENT_USER.role}</span>
          </div>
          <ul ref={listRef} role="menu" aria-label="Account" className="py-1">
            {current === 'profile' ? item(UserRound, 'My profile', '#profile', false, true) : item(UserRound, 'Profile', '#profile')}
            {item(Settings, 'Settings', '#settings')}
            {item(LogOut, 'Sign out', signOutHref, true)}
          </ul>
        </div>
      )}
    </div>
  );
};
