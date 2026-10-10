import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Badge, BUTTON, Card, LINK, Skeleton, demoLink } from '../primitives';
import { DashAlert, relativeTime } from '../data/alerts';

interface LiveAlertsCardProps {
  alerts: DashAlert[];
  mode: 'ready' | 'loading' | 'empty';
  onAcknowledge: (id: string) => void;
  className?: string;
  anatomy?: React.ReactNode;
}

const SEVERITY_LABEL = { critical: 'Critical', info: 'Info', neutral: 'Neutral' } as const;

/** Unacknowledged first (newest first); acknowledged move to the bottom in Neutral style. */
export const sortAlerts = (alerts: DashAlert[]): DashAlert[] =>
  [...alerts].sort((a, b) => Number(a.acknowledged) - Number(b.acknowledged) || a.minutesAgo - b.minutesAgo);

/** "Live alerts" (4 columns on desktop): 6 alerts with badge, title, camera + location, time and Acknowledge. */
export const LiveAlertsCard: React.FC<LiveAlertsCardProps> = ({ alerts, mode, onAcknowledge, className = '', anatomy }) => {
  const list = sortAlerts(alerts).slice(0, 6);
  const open = alerts.filter((a) => !a.acknowledged).length;
  const empty = mode === 'empty' || list.length === 0;

  return (
    <Card
      title="Live alerts"
      subtitle={mode === 'ready' && !empty ? `${open} active` : undefined}
      className={className}
      overlay={anatomy}
      actions={
        <a href="#alerts" onClick={demoLink} className={LINK}>
          View all
        </a>
      }
    >
      {mode === 'loading' ? (
        <ul role="status" aria-label="Loading alerts" className="divide-y divide-[#EEF1F6]">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} className="py-3 flex gap-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <span className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-4/5" />
                <Skeleton className="h-3 w-1/2" />
              </span>
            </li>
          ))}
        </ul>
      ) : empty ? (
        <div className="min-h-[240px] flex flex-col items-center justify-center gap-2 text-center">
          <CheckCircle2 className="w-8 h-8 text-[#1E63FF]" aria-hidden="true" />
          <p className="text-[14px] font-semibold text-[#121722]">No active alerts. All clear.</p>
        </div>
      ) : (
        <ul className="divide-y divide-[#EEF1F6] -my-2">
          {list.map((a) => (
            <li key={a.id} className={`py-3 flex items-start gap-3 ${a.acknowledged ? 'opacity-80' : ''}`}>
              <span className="shrink-0 pt-0.5">
                <Badge tone={a.acknowledged ? 'neutral' : a.severity}>{a.acknowledged ? 'Acknowledged' : SEVERITY_LABEL[a.severity]}</Badge>
              </span>
              <span className="flex-1 min-w-0">
                <span className={`block text-[14px] leading-[20px] font-medium ${a.acknowledged ? 'text-[#4B5465]' : 'text-[#121722]'}`}>
                  {a.title}
                </span>
                <span className="block text-[12px] leading-[16px] text-[#4B5465]">
                  <span className="font-mono">{a.camera}</span> · {a.location}
                </span>
                <span className="block text-[12px] leading-[16px] text-[#6B7485]">{relativeTime(a.minutesAgo)}</span>
              </span>
              {!a.acknowledged && (
                <button
                  type="button"
                  onClick={() => onAcknowledge(a.id)}
                  aria-label={`Acknowledge: ${a.title}`}
                  className={`${BUTTON.ghostSm} shrink-0`}
                >
                  Acknowledge
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
