import React, { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { BUTTON, IconButton } from '../primitives';
import { CameraFeed } from './CameraTile';
import type { DashCamera } from '../data/cameras';

interface CameraModalProps {
  camera: DashCamera;
  clock: string;
  showDetection: boolean;
  onClose: () => void;
}

/**
 * Large modal (880px): bigger feed, camera details and recent detections.
 * Focus moves into the dialog, Tab stays inside it, Esc closes; the caller returns focus to the tile.
 */
export const CameraModal: React.FC<CameraModalProps> = ({ camera, clock, showDetection, onClose }) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Latest onClose without re-running the focus effect (the clock re-renders every second).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button, a[href], input, select, [tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.hasAttribute('disabled'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const details: [string, string][] = [
    ['Camera ID', camera.id],
    ['Location', camera.location],
    ['Resolution', camera.resolution],
    ['Frame rate', `${camera.fps} FPS`],
    ['Uptime (30 days)', camera.uptime],
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-[880px] max-h-full overflow-y-auto rounded-[16px] bg-white border border-[#DDE2EA] shadow-[0_12px_32px_rgba(11,45,107,0.18)]"
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#DDE2EA]">
          <h2 id={titleId} className="text-[20px] leading-[28px] font-semibold text-[#121722]">
            <span className="font-mono">{camera.id}</span> · {camera.name}
          </h2>
          <IconButton ref={closeRef} icon={X} label="Close camera view" onClick={onClose} />
        </div>

        <div className="p-6 grid grid-cols-1 @min-[768px]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-[12px] bg-black border border-[#1F2633]">
            <CameraFeed camera={camera} clock={clock} showDetection={showDetection} large />
          </div>

          <div className="space-y-5 min-w-0">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              {details.map(([term, value]) => (
                <div key={term} className="min-w-0">
                  <dt className="text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">{term}</dt>
                  <dd className={`text-[14px] leading-[20px] text-[#121722] ${term === 'Camera ID' ? 'font-mono' : ''}`}>{value}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h3 className="mb-2 text-[14px] font-semibold text-[#121722]">Recent detections</h3>
              <ul className="divide-y divide-[#EEF1F6] rounded-[8px] border border-[#DDE2EA]">
                {camera.recent.map((r) => (
                  <li key={r.time} className="flex items-center gap-3 px-3 h-10 text-[13px]">
                    <span className="font-mono text-[#4B5465] tabular-nums">{r.time}</span>
                    <span className="flex-1 min-w-0 truncate font-mono text-[#121722]">{r.label}</span>
                    <span className="font-mono text-[#353D4C] tabular-nums">{r.confidence}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-[#DDE2EA] bg-[#F7F9FC] rounded-b-[16px]">
          <button type="button" onClick={onClose} className={BUTTON.secondary}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
