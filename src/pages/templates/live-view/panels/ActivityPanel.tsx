import React, { useId, useRef } from 'react';
import { X } from 'lucide-react';
import { useSurface } from '../surface/ControlRoomSurface';

export type ActivityTab = 'detections' | 'alerts' | 'info';

interface ActivityPanelProps {
  tab: ActivityTab;
  onTab: (tab: ActivityTab) => void;
  openAlerts: number;
  detections: React.ReactNode;
  alerts: React.ReactNode;
  info: React.ReactNode;
  onClose?: () => void;
  /** Rendered by a bottom sheet (no card chrome). */
  bare?: boolean;
}

/**
 * Activity panel (360px): line tabs "Detections · Alerts (3) · Camera info" per the Tabs standard
 * (Tabs on dark in the Control room): roving tabindex, arrow keys, Home/End, automatic activation.
 */
export const ActivityPanel: React.FC<ActivityPanelProps> = ({ tab, onTab, openAlerts, detections, alerts, info, onClose, bare }) => {
  const t = useSurface();
  const uid = useId();
  const tabsRef = useRef<HTMLDivElement>(null);
  const TABS: { id: ActivityTab; label: string; count?: number }[] = [
    { id: 'detections', label: 'Detections' },
    { id: 'alerts', label: 'Alerts', count: openAlerts },
    { id: 'info', label: 'Camera info' },
  ];
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : null;
    if (n === null) return;
    e.preventDefault();
    const next = TABS[(n + TABS.length) % TABS.length];
    onTab(next.id);
    tabsRef.current?.querySelector<HTMLElement>(`#${CSS.escape(`${uid}-tab-${next.id}`)}`)?.focus();
  };

  return (
    <section aria-label="Activity" className={`h-full min-h-0 flex flex-col ${bare ? '' : `rounded-[12px] border ${t.panel}`}`}>
      <div className={`flex items-end gap-1 px-3 border-b ${t.tab.baseline}`}>
        <div ref={tabsRef} role="tablist" aria-label="Activity" className="flex-1 flex items-end gap-5">
          {TABS.map((x, i) => {
            const on = x.id === tab;
            return (
              <button
                key={x.id}
                id={`${uid}-tab-${x.id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`${uid}-panel-${x.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => onTab(x.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={`relative h-11 inline-flex items-center gap-1.5 text-[14px] font-medium ${on ? t.tab.on : t.tab.off} rounded-t-[4px] ${t.focus}`}
              >
                {x.label}
                {x.count !== undefined && (
                  <span className={`h-5 min-w-5 px-1.5 inline-flex items-center justify-center rounded-full font-mono text-[12px] ${t.surface === 'control' ? 'bg-white/15 text-white' : on ? 'bg-[#1E63FF]/[0.08] text-[#1E63FF]' : 'bg-[#EEF1F6] text-[#353D4C]'}`}>
                    {x.count}
                  </span>
                )}
                {x.count !== undefined && <span className="sr-only"> open</span>}
                {on && <span aria-hidden="true" className={`absolute inset-x-0 -bottom-px h-[2px] rounded-full ${t.tab.indicator}`} />}
              </button>
            );
          })}
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close activity panel" className={`${t.btn.iconSm} mb-1.5`}>
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {TABS.map((x) => (
        <div key={x.id} id={`${uid}-panel-${x.id}`} role="tabpanel" aria-labelledby={`${uid}-tab-${x.id}`} hidden={x.id !== tab} className="flex-1 min-h-0">
          {x.id === 'detections' ? detections : x.id === 'alerts' ? alerts : info}
        </div>
      ))}
    </section>
  );
};
