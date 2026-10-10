import React, { useMemo, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { clock, hashSeed, seeded } from '../data/seed';
import { useSurface } from '../surface/ControlRoomSurface';
import { PlaybackControls, Speed } from './PlaybackControls';

export type Zoom = 3600 | 21600 | 86400;
const ZOOMS: { value: Zoom; label: string }[] = [
  { value: 3600, label: '1h' },
  { value: 21600, label: '6h' },
  { value: 86400, label: '24h' },
];

interface TimelineStripProps {
  cameraId: string;
  cameraName: string;
  now: number;
  /** null = live. */
  playTime: number | null;
  playing: boolean;
  speed: Speed;
  zoom: Zoom;
  open: boolean;
  compact: boolean;
  onToggleOpen: () => void;
  onSeek: (t: number) => void;
  onLive: () => void;
  onTogglePlay: () => void;
  onSpeed: (s: Speed) => void;
  onZoom: (z: Zoom) => void;
  onSnapshot: () => void;
  onExport: () => void;
}

/** Deterministic events for one camera over the last 24 h: Cyan detections, Deep Navy alerts. */
function useMarkers(cameraId: string, now: number) {
  const day = Math.floor(now / 600); // refresh every 10 minutes of demo time
  return useMemo(() => {
    const rand = seeded(hashSeed(`timeline-${cameraId}`));
    return Array.from({ length: 60 }, (_, i) => ({ id: i, t: now - Math.floor(rand() * 86400), alert: rand() < 0.12 }));
  }, [cameraId, day]); // `now` only matters at 10-minute resolution (`day`).
}

/**
 * Timeline strip (96px, collapsible) for the focused camera: a scrubber over 1h / 6h / 24h with event markers
 * and a playhead (a slider: ←/→ 10 s, PageUp/PageDown 5 min), plus playback controls.
 */
export const TimelineStrip: React.FC<TimelineStripProps> = (p) => {
  const t = useSurface();
  const barRef = useRef<HTMLDivElement>(null);
  const markers = useMarkers(p.cameraId, p.now);
  const start = p.now - p.zoom;
  const head = p.playTime ?? p.now;
  const pos = (x: number) => `${Math.max(0, Math.min(100, ((x - start) / p.zoom) * 100))}%`;
  const dark = t.surface === 'control';

  const seekFromPointer = (clientX: number) => {
    const r = barRef.current?.getBoundingClientRect();
    if (!r) return;
    const f = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    p.onSeek(Math.round(start + f * p.zoom));
  };

  return (
    <section aria-label={`Timeline for ${p.cameraId}`} className={`shrink-0 rounded-[12px] border ${t.panel}`}>
      <div className="flex items-center gap-2 px-3 pt-2">
        <button type="button" onClick={p.onToggleOpen} aria-expanded={p.open} className={`${t.btn.ghost} px-2`}>
          {p.open ? <ChevronDown className="w-4 h-4" aria-hidden="true" /> : <ChevronUp className="w-4 h-4" aria-hidden="true" />}
          <span className={t.text}>Timeline</span>
          <span className={`font-mono text-[12px] ${t.muted}`}>{p.cameraId}</span>
        </button>
        {p.open && (
          <div role="group" aria-label="Timeline zoom" className={`ml-auto inline-flex p-0.5 rounded-[8px] ${t.segment.group}`}>
            {ZOOMS.map((z) => (
              <button key={z.value} type="button" aria-pressed={p.zoom === z.value} onClick={() => p.onZoom(z.value)} className={`h-7 px-2 rounded-[6px] text-[12px] font-medium ${p.zoom === z.value ? t.segment.on : t.segment.off} ${t.focus}`}>
                {z.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {p.open && (
        <div className="h-[96px] px-3 pb-2 pt-1 flex flex-col gap-1.5">
          <div
            ref={barRef}
            role="slider"
            tabIndex={0}
            aria-label={`Playback position, ${p.cameraName}`}
            aria-valuemin={start}
            aria-valuemax={p.now}
            aria-valuenow={head}
            aria-valuetext={p.playTime === null ? `Live, ${clock(p.now)}` : `Playback ${clock(head)}`}
            onPointerDown={(e) => seekFromPointer(e.clientX)}
            onKeyDown={(e) => {
              const step = e.key === 'ArrowLeft' ? -10 : e.key === 'ArrowRight' ? 10 : e.key === 'PageDown' ? -300 : e.key === 'PageUp' ? 300 : e.key === 'Home' ? -p.zoom : e.key === 'End' ? p.zoom : 0;
              if (!step) return;
              e.preventDefault();
              p.onSeek(Math.max(start, Math.min(p.now, head + step)));
            }}
            className={`relative h-8 rounded-[6px] cursor-pointer ${dark ? 'bg-white/[0.06]' : 'bg-[#F7F9FC] border border-[#DDE2EA]'} ${t.focus}`}
          >
            {markers
              .filter((m) => m.t >= start)
              .map((m) => (
                <span key={m.id} aria-hidden="true" className={`absolute top-1.5 bottom-1.5 w-[3px] -translate-x-1/2 rounded-full ${m.alert ? (dark ? 'bg-white' : 'bg-[#0B2D6B]') : 'bg-[#00C6FF]'}`} style={{ left: pos(m.t) }} />
              ))}
            <span aria-hidden="true" className="absolute -top-1 -bottom-1 w-0.5 bg-[#1E63FF] -translate-x-1/2" style={{ left: pos(head) }}>
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#1E63FF]" />
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className={`font-mono text-[11px] ${t.muted}`}>{clock(start).slice(0, 5)}</span>
            <PlaybackControls
              live={p.playTime === null}
              playing={p.playing}
              speed={p.speed}
              compact={p.compact}
              onLive={p.onLive}
              onSkip={(s) => p.onSeek(Math.max(start, Math.min(p.now, head + s)))}
              onTogglePlay={p.onTogglePlay}
              onSpeed={p.onSpeed}
              onSnapshot={p.onSnapshot}
              onExport={p.onExport}
            />
            <span className={`font-mono text-[11px] ${t.muted}`}>{clock(p.now).slice(0, 5)}</span>
          </div>
        </div>
      )}
    </section>
  );
};
