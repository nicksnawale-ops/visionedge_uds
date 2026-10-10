import React from 'react';
import { CheckCheck } from 'lucide-react';
import type { LiveAlert } from '../data/alerts';
import { ago } from '../data/seed';
import { useSurface } from '../surface/ControlRoomSurface';
import { SeverityBadge } from '../ui';

interface AlertsListProps {
  alerts: LiveAlert[];
  now: number;
  onAcknowledge: (id: string) => void;
  onAcknowledgeAll: () => void;
  onView: (alert: LiveAlert) => void;
}

/** Open alerts first (newest first); acknowledged ones move down with a Neutral style. */
export const AlertsList: React.FC<AlertsListProps> = ({ alerts, now, onAcknowledge, onAcknowledgeAll, onView }) => {
  const t = useSurface();
  const sorted = [...alerts].sort((a, b) => Number(a.acknowledged) - Number(b.acknowledged) || b.at - a.at);
  const open = alerts.filter((a) => !a.acknowledged).length;
  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className={`px-3 py-2 border-b ${t.border} flex items-center justify-between gap-2`}>
        <span className={`text-[13px] ${t.muted}`}>{open ? `${open} open` : 'All acknowledged'}</span>
        <button type="button" onClick={onAcknowledgeAll} disabled={!open} className={`${t.btn.ghost} disabled:opacity-50`}>
          <CheckCheck className="w-4 h-4" aria-hidden="true" />
          Acknowledge all
        </button>
      </div>
      <ul className={`flex-1 min-h-0 overflow-y-auto divide-y ${t.divide}`} aria-label="Alerts">
        {sorted.map((a) => (
          <li key={a.id} className={`px-3 py-3 ${a.acknowledged ? 'opacity-70' : ''}`}>
            <div className="flex items-start justify-between gap-2">
              <SeverityBadge severity={a.severity} acknowledged={a.acknowledged} />
              <span className={`text-[12px] tabular-nums ${t.subtle}`}>{ago(now - a.at)}</span>
            </div>
            <p className={`mt-1.5 text-[14px] font-medium ${t.text}`}>{a.title}</p>
            <p className={`text-[12px] ${t.muted}`}>
              <span className="font-mono">{a.cameraId}</span> · {a.cameraName}
            </p>
            <div className="mt-2 flex gap-2">
              {!a.acknowledged && (
                <button type="button" onClick={() => onAcknowledge(a.id)} className={t.btn.ghost}>
                  Acknowledge
                </button>
              )}
              <button type="button" onClick={() => onView(a)} className={t.btn.secondary}>
                View
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
