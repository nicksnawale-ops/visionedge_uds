import { useCallback, useEffect, useRef, useState } from 'react';
import { AUTOSAVE_MS } from '../formStates';

export type DraftStatus = 'idle' | 'unsaved' | 'saving' | 'saved';

export interface Autosave {
  status: DraftStatus;
  /** "Draft saved just now", "Draft saved 2 min ago", "Unsaved changes". */
  label: string;
  saveNow: () => void;
}

/**
 * Demo autosave: 30 seconds after the last change the draft "saves" (no backend).
 * The relative time updates every minute. All timers are cleared on unmount.
 */
export function useAutosave(changeKey: string, enabled: boolean, onSaved?: () => void, initial?: { minutesAgo: number }): Autosave {
  const [status, setStatus] = useState<DraftStatus>(initial ? 'saved' : 'idle');
  const [savedAt, setSavedAt] = useState<number | null>(initial ? Date.now() - initial.minutesAgo * 60_000 : null);
  const [, setNow] = useState(0);
  const first = useRef(true);
  const onSavedRef = useRef(onSaved);
  onSavedRef.current = onSaved;
  const saveTimer = useRef<number | undefined>(undefined);

  const saveNow = useCallback(() => {
    setStatus('saving');
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      setStatus('saved');
      setSavedAt(Date.now());
      onSavedRef.current?.();
    }, 500);
  }, []);

  // Each change restarts the 30-second countdown.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!enabled) return;
    setStatus('unsaved');
    const t = window.setTimeout(saveNow, AUTOSAVE_MS);
    return () => window.clearTimeout(t);
  }, [changeKey, enabled, saveNow]);

  // Keep "2 min ago" fresh.
  useEffect(() => {
    const t = window.setInterval(() => setNow((n) => n + 1), 60_000);
    return () => window.clearInterval(t);
  }, []);
  useEffect(() => () => window.clearTimeout(saveTimer.current), []);

  const minutes = savedAt ? Math.floor((Date.now() - savedAt) / 60_000) : 0;
  const label =
    status === 'saving' ? 'Saving draft…' : status === 'saved' ? `Draft saved ${minutes < 1 ? 'just now' : `${minutes} min ago`}` : status === 'unsaved' ? 'Unsaved changes' : 'Not saved yet';
  return { status, label, saveNow };
}
