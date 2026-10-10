import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { NOTIFICATIONS, NOTIFICATION_ICON, NotificationItem } from '../navigationSpec';
import { ELEV2, FOCUS_INSET, FOCUS_LIGHT, ICON_BTN } from '../shared/navStyles';
import { useClickOutside } from '../shared/useClickOutside';

/** Deep Navy count pill on the bell: White text, min 18px, max "9+". */
const BellBadge: React.FC<{ n: number }> = ({ n }) =>
  n > 0 ? (
    <span aria-hidden="true" className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0B2D6B] text-white text-[11px] font-semibold inline-flex items-center justify-center ring-2 ring-white">
      {n > 9 ? '9+' : n}
    </span>
  ) : null;

interface NotificationsButtonProps {
  /** Panel alignment under the bell. */
  align?: 'end' | 'start';
  /** Start empty (to show the empty state). */
  empty?: boolean;
}

/**
 * Bell + notifications panel (non-modal dialog, 380px, max 480px high): Mark all as read, All / Unread chips,
 * 64px items (unread: Royal Blue 8% fill + 8px dot), footer link, empty state. Esc or outside click closes.
 */
export const NotificationsButton: React.FC<NotificationsButtonProps> = ({ align = 'end', empty = false }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(empty ? [] : NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const panelId = useId();
  const unread = items.filter((i) => i.unread).length;
  const shown = filter === 'unread' ? items.filter((i) => i.unread) : items;

  const [dx, setDx] = useState(0);

  useClickOutside([panel, btn], open, () => setOpen(false));
  useEffect(() => {
    if (open) panel.current?.querySelector<HTMLElement>('button, a')?.focus({ preventScroll: true });
  }, [open]);

  // Keep the panel 16px inside the viewport on narrow screens.
  useLayoutEffect(() => {
    if (!open || !panel.current) return setDx(0);
    const r = panel.current.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    setDx(r.left < 16 ? 16 - r.left : r.right > vw - 16 ? vw - 16 - r.right : 0);
  }, [open]);

  const close = () => {
    setOpen(false);
    btn.current?.focus();
  };

  return (
    <div className="relative">
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-haspopup="dialog"
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        onClick={() => setOpen((o) => !o)}
        className={ICON_BTN}
      >
        <Bell className="w-5 h-5" aria-hidden="true" />
        <BellBadge n={unread} />
      </button>
      {open && (
        <div
          ref={panel}
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.stopPropagation();
              close();
            }
          }}
          style={dx ? { translate: `${dx}px 0` } : undefined}
          className={`absolute z-50 top-full mt-2 w-[380px] max-w-[calc(100vw-32px)] max-h-[480px] flex flex-col rounded-[12px] bg-white border border-[#DDE2EA] text-left ${ELEV2} ${align === 'end' ? 'right-0' : 'left-0'}`}
        >
          <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-2">
            <h3 id={titleId} className="text-[16px] font-semibold text-[#121722]">
              Notifications
            </h3>
            <button
              type="button"
              disabled={!unread}
              onClick={() => setItems((all) => all.map((i) => ({ ...i, unread: false })))}
              className={`h-8 px-2 rounded-[8px] text-[13px] font-medium text-[#1E63FF] hover:bg-[#EEF1F6] disabled:text-[#8C95A6] disabled:hover:bg-transparent ${FOCUS_LIGHT}`}
            >
              Mark all as read
            </button>
          </div>
          <div role="group" aria-label="Filter" className="px-4 pb-3 flex gap-2 border-b border-[#DDE2EA]">
            {(['all', 'unread'] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`h-8 px-3 rounded-full text-[13px] font-medium border ${filter === f ? 'bg-[#1E63FF]/[0.08] border-[#1E63FF] text-[#1E63FF]' : 'bg-white border-[#DDE2EA] text-[#4B5465] hover:bg-[#F7F9FC]'} ${FOCUS_LIGHT}`}
              >
                {f === 'all' ? 'All' : `Unread${unread ? ` (${unread})` : ''}`}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto" aria-live="polite">
            {shown.length ? (
              <ul className="divide-y divide-[#DDE2EA]">
                {shown.map((n) => {
                  const Icon = NOTIFICATION_ICON[n.kind];
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => setItems((all) => all.map((i) => (i.id === n.id ? { ...i, unread: false } : i)))}
                        className={`w-full min-h-16 px-4 py-3 flex items-start gap-3 text-left ${n.unread ? 'bg-[#1E63FF]/[0.08] hover:bg-[#1E63FF]/[0.12]' : 'hover:bg-[#F7F9FC]'} ${FOCUS_INSET}`}
                      >
                        <span className="w-8 h-8 shrink-0 rounded-full bg-[#EEF1F6] text-[#0B2D6B] inline-flex items-center justify-center" aria-hidden="true">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[14px] font-medium text-[#121722] truncate">{n.title}</span>
                          <span className="block text-[12px] text-[#4B5465] truncate">
                            {n.meta} · {n.time}
                          </span>
                        </span>
                        {n.unread && (
                          <>
                            <span aria-hidden="true" className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-[#1E63FF]" />
                            <span className="sr-only">, unread</span>
                          </>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-10 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto text-[#8C95A6]" aria-hidden="true" />
                <p className="mt-2 text-[14px] font-medium text-[#121722]">You’re all caught up.</p>
              </div>
            )}
          </div>
          <div className="border-t border-[#DDE2EA] p-2">
            <a href="#notifications" onClick={(e) => e.preventDefault()} className={`h-10 flex items-center justify-center rounded-[8px] text-[14px] font-medium text-[#1E63FF] hover:bg-[#F7F9FC] hover:underline ${FOCUS_LIGHT}`}>
              View all notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

/** Section demo: bell with items, and bell with the empty state. */
export const NotificationsDemo: React.FC = () => (
  <div className="min-h-[560px] flex flex-wrap items-start justify-between gap-4">
    <div className="h-16 flex-1 min-w-[260px] px-4 flex items-center justify-end gap-2 rounded-[8px] border border-[#DDE2EA] bg-white">
      <span className="mr-auto text-[14px] font-medium text-[#121722]">With notifications</span>
      <NotificationsButton />
    </div>
    <div className="h-16 flex-1 min-w-[260px] px-4 flex items-center justify-end gap-2 rounded-[8px] border border-[#DDE2EA] bg-white">
      <span className="mr-auto text-[14px] font-medium text-[#121722]">Empty</span>
      <NotificationsButton empty />
    </div>
  </div>
);

export const NOTIFICATIONS_CODE = `// Bell with a Deep Navy count pill (max "9+"), opening a 380px panel
<button aria-haspopup="dialog" aria-expanded={open} aria-label="Notifications, 3 unread" className="relative w-10 h-10 rounded-[8px] text-[#4B5465] hover:bg-[#EEF1F6]">
  <Bell className="w-5 h-5" aria-hidden="true" />
  <span aria-hidden="true" className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0B2D6B] text-white text-[11px] font-semibold ring-2 ring-white">3</span>
</button>

<div role="dialog" aria-labelledby="notif-title"
  className="absolute right-0 top-full mt-2 w-[380px] max-h-[480px] flex flex-col rounded-[12px] bg-white border border-[#DDE2EA] shadow-[0_4px_12px_rgba(11,45,107,0.12)]">
  <div className="px-4 pt-3 pb-2 flex justify-between">
    <h3 id="notif-title" className="text-[16px] font-semibold text-[#121722]">Notifications</h3>
    <button className="h-8 px-2 rounded-[8px] text-[13px] font-medium text-[#1E63FF] hover:bg-[#EEF1F6]">Mark all as read</button>
  </div>
  {/* All · Unread chips (aria-pressed) */}
  <ul className="overflow-y-auto divide-y divide-[#DDE2EA]">
    <li>
      <button className="w-full min-h-16 px-4 py-3 flex gap-3 text-left bg-[#1E63FF]/[0.08]">
        {/* status icon · title 14px Medium · meta 12px #4B5465 · time */}
        <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[#1E63FF]" />
        <span className="sr-only">, unread</span>
      </button>
    </li>
  </ul>
  <a href="/notifications" className="h-10 … text-[#1E63FF]">View all notifications</a>
</div>`;
