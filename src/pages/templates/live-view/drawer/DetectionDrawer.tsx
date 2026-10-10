import React, { useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Flag, X, ZoomIn, ZoomOut } from 'lucide-react';
import { CameraScene } from '../../dashboard/scenes/CameraScenes';
import type { Detection } from '../data/detections';
import { clock } from '../data/seed';
import { useFocusTrap } from '../hooks/useFocusTrap';
import type { LiveUseCase } from '../useCases';
import { useSurface } from '../surface/ControlRoomSurface';
import { DetectionBadge, OVERLINE } from '../ui';

interface DetectionDrawerProps {
  uc: LiveUseCase;
  detection: Detection;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onAction: (message: string, kind: 'success' | 'info') => void;
}

/**
 * Detection detail drawer (480px, right, elevation-3): snapshot with Zoom and Prev / Next, key facts,
 * recent sightings and actions. Traps focus; Esc closes and returns focus.
 */
export const DetectionDrawer: React.FC<DetectionDrawerProps> = ({ uc, detection: d, hasPrev, hasNext, onPrev, onNext, onClose, onAction }) => {
  const t = useSurface();
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [zoom, setZoom] = useState(false);
  useFocusTrap(ref, true, onClose);

  return (
    <div className="absolute inset-0 z-40">
      <div aria-hidden="true" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`absolute inset-y-0 right-0 w-full max-w-[480px] flex flex-col border-l ${t.panel} shadow-[0_12px_32px_rgba(11,45,107,0.18)]`}
      >
        <div className={`h-16 shrink-0 px-5 flex items-center gap-2 border-b ${t.border}`}>
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className={`text-[16px] font-semibold truncate ${t.text}`}>
              <span className="font-mono">{d.primary}</span>
            </h2>
            <p className={`text-[12px] ${t.muted}`}>
              {d.cameraId} · {d.cameraName} · {clock(d.at)} IST
            </p>
          </div>
          <button type="button" onClick={onPrev} disabled={!hasPrev} aria-label="Previous detection" className={`${t.btn.iconSm} disabled:opacity-40`}>
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={onNext} disabled={!hasNext} aria-label="Next detection" className={`${t.btn.iconSm} disabled:opacity-40`}>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button type="button" data-autofocus onClick={onClose} aria-label="Close detection details" className={t.btn.iconSm}>
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
          <figure className="relative aspect-video rounded-[12px] bg-black overflow-hidden">
            <div aria-hidden="true" className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-200" style={{ transform: zoom ? 'scale(1.8)' : undefined, transformOrigin: '50% 55%' }}>
              <CameraScene kind={uc.scene} className="absolute inset-0 w-full h-full" />
              <span className="absolute left-[38%] top-[36%] w-[24%] h-[36%] border-2 border-[#00C6FF] rounded-[4px]">
                <span className="absolute left-[-2px] bottom-full mb-0.5 px-1 rounded-[2px] bg-[#00C6FF] text-[#0B2D6B] font-mono text-[11px] font-semibold whitespace-nowrap">{d.chip}</span>
              </span>
            </div>
            <figcaption className="sr-only">Snapshot from {d.cameraName}</figcaption>
            <button
              type="button"
              onClick={() => setZoom((z) => !z)}
              aria-pressed={zoom}
              className="absolute right-2 bottom-2 h-8 px-2.5 inline-flex items-center gap-1.5 rounded-[8px] bg-black/60 text-white text-[12px] font-medium hover:bg-black/80 outline-none focus-visible:ring-2 focus-visible:ring-[#00C6FF]"
            >
              {zoom ? <ZoomOut className="w-4 h-4" aria-hidden="true" /> : <ZoomIn className="w-4 h-4" aria-hidden="true" />}
              {zoom ? 'Zoom out' : 'Zoom'}
            </button>
          </figure>

          <div className="flex items-center gap-2">
            <DetectionBadge status={d.status} />
            <span className={`text-[12px] ${t.muted}`}>{d.confidence}% confidence</span>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            {d.facts.map((f) => (
              <div key={f.label} className="min-w-0">
                <dt className={`${OVERLINE} ${t.subtle}`}>{f.label}</dt>
                <dd className={`mt-0.5 text-[14px] break-words ${t.text} ${f.mono ? 'font-mono text-[13px]' : ''}`}>{f.value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <h3 className={`${OVERLINE} ${t.subtle}`}>Recent sightings</h3>
            <ol className={`mt-2 border-l-2 ${t.surface === 'control' ? 'border-white/15' : 'border-[#DDE2EA]'} space-y-2`}>
              {d.sightings.map((s) => (
                <li key={s.time + s.camera} className="relative pl-4">
                  <span aria-hidden="true" className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#00C6FF]" />
                  <span className={`block text-[13px] ${t.text}`}>{s.camera}</span>
                  <span className={`block font-mono text-[12px] ${t.muted}`}>{s.time}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className={`shrink-0 px-5 py-4 border-t ${t.border} flex flex-wrap gap-2`}>
          <button type="button" onClick={() => onAction(`${uc.primaryAction}: ${d.primary}`, 'success')} className={t.btn.primary}>
            {uc.primaryAction}
          </button>
          <button type="button" onClick={() => onAction(`Snapshot downloaded (${d.id}.jpg)`, 'info')} className={`${t.btn.secondary} h-10 px-4 text-[14px]`}>
            <Download className="w-4 h-4" aria-hidden="true" />
            Download snapshot
          </button>
          <button type="button" onClick={() => onAction('Marked as false detection. Thanks, this improves the model.', 'info')} className={`${t.btn.ghost} h-10`}>
            <Flag className="w-4 h-4" aria-hidden="true" />
            Mark as false detection
          </button>
        </div>
      </div>
    </div>
  );
};
