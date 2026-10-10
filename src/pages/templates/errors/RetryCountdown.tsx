import React, { useEffect, useRef, useState } from 'react';

/** "0:30" or, from an hour, "1:18:48". */
export const formatSeconds = (total: number): string => {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
};

/**
 * Counts down from `seconds` once a second while `active`; restarting `cycle` starts it again.
 * Calls onDone once at 0. The interval is cleared on unmount, pause and restart.
 */
export function useCountdown(seconds: number, active: boolean, cycle: number, onDone?: () => void): number {
  const [remaining, setRemaining] = useState(seconds);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => setRemaining(seconds), [seconds, cycle]);

  const done = remaining === 0;
  useEffect(() => {
    if (!active || done) return;
    const t = window.setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => window.clearInterval(t);
  }, [active, cycle, done]);

  useEffect(() => {
    if (active && done) onDoneRef.current?.();
  }, [active, done]);

  return remaining;
}

interface RetryCountdownProps {
  remaining: number;
  total: number;
  /** Text before the time, e.g. "Retrying in". */
  prefix: string;
  /** Text after the time, e.g. "…". */
  suffix?: string;
  /** Thin Royal Blue progress bar under the text (auto-retry). */
  progress?: boolean;
}

/**
 * Visible countdown in JetBrains Mono. It is not a live region (that would announce every second);
 * the page announces once when the countdown finishes.
 */
export const RetryCountdown: React.FC<RetryCountdownProps> = ({ remaining, total, prefix, suffix = '', progress = false }) => (
  <div className="w-full max-w-[320px] mx-auto">
    <p className="text-[14px] leading-[20px] text-[#353D4C]">
      {prefix} <span className="font-mono font-medium text-[#121722] tabular-nums">{formatSeconds(remaining)}</span>
      {suffix}
    </p>
    {progress && (
      <div className="mt-3 h-1 rounded-full bg-[#DDE2EA] overflow-hidden" aria-hidden="true">
        <div className="h-full bg-[#1E63FF] transition-[width] duration-1000 ease-linear" style={{ width: `${((total - remaining) / total) * 100}%` }} />
      </div>
    )}
  </div>
);
