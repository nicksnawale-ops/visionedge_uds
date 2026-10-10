import React, { useId, useRef, useState } from 'react';
import { Keyboard, LifeBuoy, LogOut, Settings, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DEMO_USER } from '../navigationSpec';
import { ELEV2, FOCUS_INSET, FOCUS_LIGHT } from '../shared/navStyles';
import { useMenuKeys } from '../shared/useMenuKeys';
import { useClickOutside } from '../shared/useClickOutside';

export interface MenuEntry {
  id: string;
  label: string;
  icon: LucideIcon;
}

const BASE_ITEMS: MenuEntry[] = [
  { id: 'profile', label: 'My profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'shortcuts', label: 'Keyboard shortcuts', icon: Keyboard },
  { id: 'help', label: 'Help & support', icon: LifeBuoy },
];

const PLACEMENT = {
  'down-end': 'top-full right-0 mt-2',
  'up-start': 'bottom-full left-0 mb-2',
  'right-end': 'left-full bottom-0 ml-2',
} as const;

export const Avatar: React.FC<{ size?: 32 | 40 }> = ({ size = 32 }) => (
  <span aria-hidden="true" className={`${size === 40 ? 'w-10 h-10 text-[14px]' : 'w-8 h-8 text-[12px]'} shrink-0 rounded-full bg-[#1E63FF] text-white font-semibold inline-flex items-center justify-center`}>
    {DEMO_USER.initials}
  </span>
);

interface UserMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  placement?: keyof typeof PLACEMENT;
  /** Items that move here from the top bar on smaller screens (help, site selector). */
  extraItems?: MenuEntry[];
  onSelect?: (label: string) => void;
}

/** User menu (role="menu", 260px): profile header, 40px items with 16px icons, divider, Sign out. */
export const UserMenu: React.FC<UserMenuProps> = ({ id, open, onClose, buttonRef, placement = 'down-end', extraItems = [], onSelect }) => {
  const ref = useRef<HTMLDivElement>(null);
  const onKeyDown = useMenuKeys(ref, open, onClose, buttonRef, placement === 'up-start');
  useClickOutside([ref, buttonRef], open, onClose);
  if (!open) return null;

  const choose = (label: string) => {
    onSelect?.(label);
    onClose();
    buttonRef.current?.focus();
  };
  const item = (e: MenuEntry, danger = false) => {
    const Icon = e.icon;
    return (
      <button
        key={e.id}
        type="button"
        role="menuitem"
        tabIndex={-1}
        onClick={() => choose(e.label)}
        className={`w-full h-10 px-4 flex items-center gap-3 text-left text-[14px] hover:bg-[#F7F9FC] focus-visible:bg-[#F7F9FC] ${danger ? 'text-[#121722] font-medium' : 'text-[#353D4C]'} ${FOCUS_INSET}`}
      >
        <Icon className="w-4 h-4 shrink-0 text-[#4B5465]" aria-hidden="true" />
        {e.label}
      </button>
    );
  };

  return (
    <div
      ref={ref}
      id={id}
      role="menu"
      aria-label="User menu"
      onKeyDown={onKeyDown}
      className={`absolute z-50 w-[260px] py-1 rounded-[12px] bg-white border border-[#DDE2EA] text-left ${ELEV2} ${PLACEMENT[placement]}`}
    >
      <div role="none" className="flex items-center gap-3 px-4 py-3 border-b border-[#DDE2EA] mb-1">
        <Avatar size={40} />
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[#121722] truncate">{DEMO_USER.name}</p>
          <p className="text-[12px] text-[#4B5465] truncate">{DEMO_USER.email}</p>
          <span className="mt-1 inline-flex h-5 px-2 items-center rounded-full bg-[#EEF1F6] text-[11px] font-medium text-[#353D4C]">{DEMO_USER.role}</span>
        </div>
      </div>
      {[...extraItems, ...BASE_ITEMS].map((e) => item(e))}
      <div role="separator" className="my-1 h-px bg-[#DDE2EA]" />
      {item({ id: 'sign-out', label: 'Sign out', icon: LogOut }, true)}
    </div>
  );
};

/** Avatar button that opens the user menu (aria-haspopup="menu"). */
export const UserMenuButton: React.FC<{ extraItems?: MenuEntry[]; onSelect?: (label: string) => void; placement?: keyof typeof PLACEMENT }> = ({ extraItems, onSelect, placement = 'down-end' }) => {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  return (
    <div className="relative">
      <button
        ref={btn}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`User menu, ${DEMO_USER.name}`}
        onClick={() => setOpen((o) => !o)}
        className={`w-10 h-10 rounded-full inline-flex items-center justify-center hover:bg-[#EEF1F6] ${FOCUS_LIGHT}`}
      >
        <Avatar />
      </button>
      <UserMenu id={menuId} open={open} onClose={() => setOpen(false)} buttonRef={btn} placement={placement} extraItems={extraItems} onSelect={onSelect} />
    </div>
  );
};

export const USER_MENU_CODE = `// User menu: avatar button + role="menu" (260px), arrow keys, Esc returns focus
<div className="relative">
  <button aria-haspopup="menu" aria-expanded={open} aria-controls="user-menu" aria-label="User menu, Anika Kapoor"
    className="w-10 h-10 rounded-full hover:bg-[#EEF1F6]">
    <span className="w-8 h-8 rounded-full bg-[#1E63FF] text-white text-[12px] font-semibold …">AK</span>
  </button>
  {open && (
    <div id="user-menu" role="menu" aria-label="User menu"
      className="absolute right-0 top-full mt-2 w-[260px] py-1 rounded-[12px] bg-white border border-[#DDE2EA] shadow-[0_4px_12px_rgba(11,45,107,0.12)]">
      <div role="none" className="flex items-center gap-3 px-4 py-3 border-b border-[#DDE2EA]">
        {/* 40px avatar · name 14px SemiBold · email 12px #4B5465 · role badge */}
      </div>
      <button role="menuitem" tabIndex={-1} className="w-full h-10 px-4 flex items-center gap-3 text-[14px] text-[#353D4C] hover:bg-[#F7F9FC]">
        <User className="w-4 h-4 text-[#4B5465]" aria-hidden="true" /> My profile
      </button>
      {/* Settings · Keyboard shortcuts · Help & support */}
      <div role="separator" className="my-1 h-px bg-[#DDE2EA]" />
      <button role="menuitem" tabIndex={-1} className="… text-[#121722] font-medium">
        <LogOut className="w-4 h-4" aria-hidden="true" /> Sign out
      </button>
    </div>
  )}
</div>`;

/** Standalone demo for the Notifications & User Menu section. */
export const UserMenuDemo: React.FC = () => {
  const [last, setLast] = useState<string | null>(null);
  return (
    <div className="min-h-[440px] flex flex-col">
      <div className="h-16 px-4 flex items-center justify-end gap-2 rounded-[8px] border border-[#DDE2EA] bg-white">
        <span className="mr-auto text-[14px] font-medium text-[#121722]">Top bar</span>
        <UserMenuButton onSelect={setLast} />
      </div>
      <p className="mt-auto pt-4 text-[13px] text-[#4B5465]" aria-live="polite">
        {last ? `You chose “${last}”.` : 'Open the avatar menu with a click, or Enter and the arrow keys.'}
      </p>
    </div>
  );
};
