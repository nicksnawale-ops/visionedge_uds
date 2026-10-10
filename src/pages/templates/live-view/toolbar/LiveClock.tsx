import React from 'react';
import { clock } from '../data/seed';
import { useSurface } from '../surface/ControlRoomSurface';

/** IST clock in JetBrains Mono, driven by the screen's shared ticker. Not announced (it would be noisy). */
export const LiveClock: React.FC<{ now: number }> = ({ now }) => {
  const t = useSurface();
  return (
    <span className={`font-mono text-[13px] tabular-nums ${t.text}`}>
      <span aria-hidden="true">{clock(now)}</span>
      <span className="sr-only">Time {clock(now).slice(0, 5)}</span>
      <span className={`ml-1 text-[11px] ${t.subtle}`}>IST</span>
    </span>
  );
};
