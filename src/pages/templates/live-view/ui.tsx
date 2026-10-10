/** Small shared pieces for the Live View template (badges per the Badges standard, overline). */
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import type { DetectionStatus } from './data/detections';
import { STATUS_LABEL } from './data/detections';
import type { LiveAlertSeverity } from './data/alerts';
import { useSurface } from './surface/ControlRoomSurface';

export const OVERLINE = 'text-[11px] font-medium uppercase tracking-[0.08em]';

const PILL = 'inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-medium whitespace-nowrap';

/** Verified / Unknown / Watchlist / Duplicate, tuned for each surface so contrast stays AA. */
export const DetectionBadge: React.FC<{ status: DetectionStatus }> = ({ status }) => {
  const dark = useSurface().surface === 'control';
  const cls: Record<DetectionStatus, string> = dark
    ? { verified: 'bg-[#00C6FF]/15 text-[#00C6FF]', unknown: 'bg-white/10 text-[#C3CAD5]', watchlist: 'bg-white text-[#0B2D6B]', duplicate: 'bg-[#1E63FF]/30 text-white' }
    : { verified: 'bg-[#00C6FF]/15 text-[#0B2D6B]', unknown: 'bg-[#EEF1F6] text-[#353D4C]', watchlist: 'bg-[#0B2D6B] text-white', duplicate: 'bg-[#1E63FF]/[0.08] text-[#1E63FF]' };
  return (
    <span className={`${PILL} ${cls[status]}`}>
      {status === 'watchlist' && <ShieldAlert className="w-3 h-3" aria-hidden="true" />}
      {STATUS_LABEL[status]}
    </span>
  );
};

/** Critical / Info / Acknowledged. */
export const SeverityBadge: React.FC<{ severity: LiveAlertSeverity; acknowledged?: boolean }> = ({ severity, acknowledged }) => {
  const dark = useSurface().surface === 'control';
  if (acknowledged) return <span className={`${PILL} ${dark ? 'bg-white/10 text-[#C3CAD5]' : 'bg-[#EEF1F6] text-[#353D4C]'}`}>Acknowledged</span>;
  if (severity === 'critical')
    return (
      <span className={`${PILL} ${dark ? 'bg-white text-[#0B2D6B]' : 'bg-[#0B2D6B] text-white'}`}>
        <ShieldAlert className="w-3 h-3" aria-hidden="true" />
        Critical
      </span>
    );
  return <span className={`${PILL} ${dark ? 'bg-[#1E63FF]/30 text-white' : 'bg-[#1E63FF]/[0.08] text-[#1E63FF]'}`}>Info</span>;
};

/** Skeleton rows for panels. */
export const SkeletonRows: React.FC<{ rows?: number; height?: string }> = ({ rows = 6, height = 'h-14' }) => {
  const t = useSurface();
  return (
    <div className="p-3 space-y-2" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <span key={i} className={`block ${height} rounded-[8px] ${t.skeleton} motion-safe:animate-pulse`} />
      ))}
    </div>
  );
};
