import React from 'react';
import { Bell } from 'lucide-react';
import { Badge, IconButton, LINK, POPOVER, demoLink, usePopover } from '../primitives';
import { DashAlert, relativeTime } from '../data/alerts';

const SEVERITY_LABEL = { critical: 'Critical', info: 'Info', neutral: 'Neutral' } as const;

/** Bell (Ghost icon button) with a Deep Navy count badge and a dropdown of the last 5 alerts. */
export const NotificationsMenu: React.FC<{ alerts: DashAlert[]; unread: number }> = ({ alerts, unread }) => {
  const { open, setOpen, rootRef, triggerRef } = usePopover();
  const latest = alerts.slice(0, 5);

  return (
    <div ref={rootRef} className="relative">
      <IconButton
        ref={triggerRef}
        icon={Bell}
        label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      />
      {unread > 0 && (
        <span
          className="pointer-events-none absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0B2D6B] text-white text-[10px] font-semibold flex items-center justify-center tabular-nums ring-2 ring-white"
          aria-hidden="true"
        >
          {unread}
        </span>
      )}
      {open && (
        <div className={`${POPOVER} right-0 w-[320px] max-w-[calc(100vw-32px)]`}>
          <div className="px-4 py-3 border-b border-[#DDE2EA] flex items-center justify-between">
            <span className="text-[14px] font-semibold text-[#121722]">Notifications</span>
            <span className="text-[12px] text-[#4B5465]">{unread} unread</span>
          </div>
          <ul className="max-h-[320px] overflow-y-auto divide-y divide-[#EEF1F6]">
            {latest.map((a) => (
              <li key={a.id} className="px-4 py-3 flex items-start gap-3">
                <Badge tone={a.acknowledged ? 'neutral' : a.severity}>{a.acknowledged ? 'Acknowledged' : SEVERITY_LABEL[a.severity]}</Badge>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] leading-[18px] font-medium text-[#121722]">{a.title}</span>
                  <span className="block text-[12px] leading-[16px] text-[#4B5465]">
                    {a.location} · {relativeTime(a.minutesAgo)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="px-4 border-t border-[#DDE2EA]">
            <a href="#alerts" onClick={demoLink} className={LINK}>
              View all alerts
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
