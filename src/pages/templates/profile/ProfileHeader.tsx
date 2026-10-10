import React, { useEffect, useRef } from 'react';
import { Building2, Camera, KeyRound, Mail, MapPin, MoreVertical, Pencil, RotateCcw, Send, UserCog, UserX } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useProfile } from './ProfileContext';
import { StatsStrip } from './StatsStrip';
import { Avatar, BUTTON, Badge, IconButton, POPOVER, Skeleton, Tooltip, usePopover } from './ui';

/** Admin kebab menu: Change role, Resend invite, Suspend (or Reactivate). Arrow keys move, Esc closes. */
const AdminMenu: React.FC = () => {
  const { goTo, toast, openModal, email, suspended, setSuspended, name, announce } = useProfile();
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

  const item = (icon: LucideIcon, label: string, action: () => void) => {
    const Icon = icon;
    return (
      <li role="none">
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            triggerRef.current?.focus();
            action();
          }}
          className="w-full flex items-center gap-3 h-11 px-4 text-left text-[14px] text-[#353D4C] hover:bg-[#F7F9FC] hover:text-[#121722] outline-none focus-visible:bg-[#F7F9FC] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E63FF]"
        >
          <Icon className="w-4 h-4 text-[#4B5465]" aria-hidden="true" />
          {label}
        </button>
      </li>
    );
  };

  return (
    <div ref={rootRef} className="relative">
      <IconButton
        ref={triggerRef}
        icon={MoreVertical}
        label={`More actions for ${name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="border border-transparent"
      />
      {open && (
        <div className={`${POPOVER} right-0 w-[220px] py-1`} onKeyDown={onKeyDown}>
          <ul ref={listRef} role="menu" aria-label={`Actions for ${name}`}>
            {item(UserCog, 'Change role', () => goTo('access'))}
            {item(Send, 'Resend invite', () => toast(`Invite sent again to ${email}`, 'success'))}
            {suspended
              ? item(RotateCcw, 'Reactivate user', () => {
                  setSuspended(false);
                  toast(`${name} can sign in again`, 'success');
                  announce(`${name} reactivated`);
                })
              : item(UserX, 'Suspend user', () => openModal({ kind: 'suspend' }))}
          </ul>
        </div>
      )}
    </div>
  );
};

/** Header card: avatar, identity, contact line, actions, then the stats strip. */
export const ProfileHeader: React.FC<{ loading: boolean }> = ({ loading }) => {
  const { viewer, organization, user, name, initials, photo, email, suspended, details, goTo, openModal, marker, moduleCount } = useProfile();
  const self = viewer === 'self';

  const stats = [
    { label: 'Modules', value: String(moduleCount) },
    { label: 'Sites', value: String(user.stats.sites) },
    { label: 'Cameras assigned', value: String(user.stats.cameras) },
    { label: 'Sign-ins this month', value: String(user.stats.signIns) },
  ];

  return (
    <div className="relative bg-white rounded-[12px] border border-[#DDE2EA] shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
      <div className="relative p-4 @min-[768px]:p-6 flex flex-col @min-[768px]:flex-row @min-[768px]:items-start gap-4 @min-[768px]:gap-6">
        {marker(2)}
        {loading ? (
          <>
            <Skeleton className="w-[88px] h-[88px] rounded-full!" />
            <div className="flex-1 space-y-3 pt-1">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-4 w-full max-w-[420px]" />
              <Skeleton className="h-3 w-72" />
            </div>
            <Skeleton className="h-10 w-32 rounded-[8px]!" />
          </>
        ) : (
          <>
            {/* Avatar with Change photo and status */}
            <div className="relative w-[88px] h-[88px] shrink-0">
              <Avatar initials={initials} size={88} src={photo} />
              <span className="absolute top-1 right-1 flex">
                <Tooltip content={suspended ? 'Suspended' : 'Active'} placement="bottom" align="start">
                  {(tip) => (
                    <span
                      role="img"
                      aria-label={`Status: ${suspended ? 'Suspended' : 'Active'}`}
                      aria-describedby={tip}
                      className={`block w-3.5 h-3.5 rounded-full ring-2 ring-white ${suspended ? 'bg-[#8C95A6]' : 'bg-[#00C6FF]'}`}
                    />
                  )}
                </Tooltip>
              </span>
              {self && (
                <button
                  type="button"
                  aria-label="Change photo"
                  onClick={() => {
                    goTo('personal');
                    openModal({ kind: 'photo' });
                  }}
                  className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-white border border-[#DDE2EA] shadow-sm flex items-center justify-center text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2 after:absolute after:content-[''] after:-inset-2"
                >
                  <Camera className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="text-[24px] leading-[32px] font-semibold text-[#121722] break-words">
                  {name}
                  {details.displayName && <span className="sr-only"> ({details.displayName})</span>}
                </h2>
                <Badge tone="info">{user.role}</Badge>
                {suspended && <Badge tone="critical">Suspended</Badge>}
              </div>
              <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] leading-[20px] text-[#4B5465]">
                <li className="inline-flex items-center gap-1.5 min-w-0">
                  <Building2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{organization}</span>
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {user.sites[0]}
                </li>
                <li className="inline-flex items-center gap-1.5 min-w-0">
                  <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{email}</span>
                </li>
              </ul>
              <p className="mt-1.5 text-[12px] leading-[16px] text-[#6B7485]">
                Member since {user.memberSince} · Last sign-in {user.lastSignIn}
              </p>
            </div>

            {/* Actions: no Primary in the header */}
            <div className="flex items-center gap-2 @max-[767px]:w-full @max-[767px]:[&>button:first-child]:flex-1">
              {self ? (
                <button type="button" onClick={() => goTo('personal')} className={BUTTON.secondary}>
                  <Pencil className="w-4 h-4" aria-hidden="true" />
                  Edit profile
                </button>
              ) : (
                <>
                  <button type="button" onClick={() => openModal({ kind: 'reset-password' })} className={BUTTON.secondary}>
                    <KeyRound className="w-4 h-4" aria-hidden="true" />
                    Reset password
                  </button>
                  <AdminMenu />
                </>
              )}
            </div>
          </>
        )}
      </div>
      <StatsStrip stats={stats} loading={loading} marker={marker(3, true)} />
    </div>
  );
};
