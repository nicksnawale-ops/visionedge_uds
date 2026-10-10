import { createContext, useContext, useEffect, useState } from 'react';

export interface Ticker {
  /** Seconds elapsed since the screen opened (frozen while paused or the tab is hidden). */
  elapsed: number;
  /** The browser tab is hidden: tiles stop animating. */
  hidden: boolean;
}

/**
 * The screen's single ticker: one 1-second interval drives the clock, feed, playback and relative times.
 * It stops while `running` is false or the document is hidden. Interval and listener are cleaned up.
 */
export function useTickerSource(running: boolean): Ticker {
  const [elapsed, setElapsed] = useState(0);
  const [hidden, setHidden] = useState(() => typeof document !== 'undefined' && document.hidden);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    if (!running || hidden) return;
    const t = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(t);
  }, [running, hidden]);

  return { elapsed, hidden };
}

export const TickerContext = createContext<Ticker>({ elapsed: 0, hidden: false });
export const useTicker = (): Ticker => useContext(TickerContext);
