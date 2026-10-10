import React, { useId } from 'react';
import { ArrowRight, Info, QrCode, ShieldAlert, Users } from 'lucide-react';
import type { LiveCamera } from '../data/cameras';
import type { LiveUseCase } from '../useCases';

const STRIP = 'absolute inset-x-0 flex items-center gap-1.5 px-2 py-1 bg-black/60 text-[12px] leading-4 pointer-events-none';
const CHIP = 'inline-flex items-center gap-1 h-5 px-1.5 rounded-[4px] text-[11px] font-semibold whitespace-nowrap';

interface TopStripProps {
  recording: boolean;
  time: string;
  sd: boolean;
  paused: boolean;
  playback: string | null;
  compact: boolean;
}

/** Top strip: LIVE / REC (or Paused / Playback) on the left; timestamp + HD/SD on the right. */
export const TopStrip: React.FC<TopStripProps> = ({ recording, time, sd, paused, playback, compact }) => {
  const tipId = useId();
  return (
    <div className={`${STRIP} top-0 justify-between`}>
      <span className="flex items-center gap-1.5 min-w-0">
        {playback ? (
          <span className={`${CHIP} bg-[#1E63FF] text-white`}>PLAYBACK {playback}</span>
        ) : paused ? (
          <span className={`${CHIP} bg-white text-[#0B2D6B]`}>Paused</span>
        ) : recording ? (
          <span className={`${CHIP} text-white`}>
            <span className="w-2 h-2 rounded-full bg-white" aria-hidden="true" />
            REC
          </span>
        ) : (
          <span className={`${CHIP} bg-white/10 text-white`}>
            <span className="w-2 h-2 rounded-full bg-[#00C6FF]" aria-hidden="true" />
            LIVE
          </span>
        )}
      </span>
      <span className="flex items-center gap-1.5 shrink-0">
        {!compact && <span className="font-mono text-white/80 tabular-nums">{time}</span>}
        <span className="relative group/sd pointer-events-auto">
          <span tabIndex={sd ? 0 : -1} aria-describedby={sd ? tipId : undefined} className={`${CHIP} border border-white/40 text-white outline-none focus-visible:ring-2 focus-visible:ring-[#00C6FF]`}>
            {sd ? 'SD' : 'HD'}
            {sd && <Info className="w-3 h-3" aria-hidden="true" />}
          </span>
          {sd && (
            <span
              id={tipId}
              role="tooltip"
              className="absolute right-0 top-full mt-1 z-30 w-[200px] px-2 py-1.5 rounded-[4px] bg-[#121722] text-white text-[11px] leading-[14px] font-normal opacity-0 pointer-events-none group-hover/sd:opacity-100 group-focus-within/sd:opacity-100"
            >
              Showing low-quality stream to save bandwidth
            </span>
          )}
        </span>
      </span>
    </div>
  );
};

/** Bottom strip: "CAM-03 · Gate 3 entry" on the left; FPS / latency on hover (right). */
export const BottomStrip: React.FC<{ camera: LiveCamera; compact: boolean }> = ({ camera, compact }) => (
  <div className={`${STRIP} bottom-0 justify-between`}>
    <span className="min-w-0 truncate text-white">
      <span className="font-mono">{camera.id}</span>
      {!compact && <span> · {camera.name}</span>}
    </span>
    <span className="shrink-0 font-mono text-white/80 opacity-0 group-hover/tile:opacity-100 group-focus-within/tile:opacity-100 transition-opacity">
      {camera.fps} fps · {camera.latency} ms
    </span>
  </div>
);

/** Alert chip on top of the tile: White fill, Deep Navy text, ShieldAlert + the alert title. */
export const AlertChip: React.FC<{ title: string }> = ({ title }) => (
  <div className="absolute left-2 right-2 top-8 flex pointer-events-none">
    <span className={`${CHIP} h-6 bg-white text-[#0B2D6B] max-w-full`}>
      <ShieldAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span className="font-bold">ALERT</span>
      <span className="font-medium truncate">{title}</span>
    </span>
  </div>
);

interface UseCaseOverlayProps {
  uc: LiveUseCase;
  camera: LiveCamera;
  compact: boolean;
  barrierOpen: boolean;
  onBarrier: () => void;
  interactive: boolean;
  /** An ALERT chip is showing: move the barrier chip below it. */
  alert: boolean;
  /** Seed for counters (in/out, queue). */
  tick: number;
}

/** Use-case extras: barrier chip (ANPR), IN/OUT line (HostelTrack), queue (Meal Pulse), pass scan (Visitor). */
export const UseCaseOverlay: React.FC<UseCaseOverlayProps> = ({ uc, camera, compact, barrierOpen, onBarrier, interactive, alert, tick }) => {
  if (uc.id === 'anpr' && camera.barrier)
    return (
      <div className={`absolute left-2 ${alert ? 'top-[60px]' : 'top-7'}`}>
        <button
          type="button"
          tabIndex={interactive ? 0 : -1}
          onClick={(e) => {
            e.stopPropagation();
            onBarrier();
          }}
          onDoubleClick={(e) => e.stopPropagation()}
          aria-label={`Barrier ${barrierOpen ? 'open' : 'closed'} at ${camera.name}. ${barrierOpen ? 'Close' : 'Open'} barrier`}
          className={`${CHIP} h-6 ${barrierOpen ? 'bg-[#00C6FF] text-[#0B2D6B]' : 'bg-black/70 text-white border border-white/40'} hover:ring-2 hover:ring-white/60 outline-none focus-visible:ring-2 focus-visible:ring-[#00C6FF]`}
        >
          {compact ? '' : 'Barrier: '}
          {barrierOpen ? 'Open' : 'Closed'}
        </button>
      </div>
    );
  if (uc.id === 'hosteltrack') {
    const inCount = 12 + ((camera.index * 7 + Math.floor(tick / 9)) % 9);
    const outCount = 8 + ((camera.index * 5 + Math.floor(tick / 13)) % 7);
    return (
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <span className="absolute top-[22%] bottom-[22%] left-[62%] border-l-2 border-dashed border-white/40" />
        <ArrowRight className="absolute left-[62%] top-[48%] -translate-x-1/2 w-4 h-4 text-white/60" />
        {!compact && (
          <span className={`${CHIP} absolute right-2 bottom-8 bg-black/70 text-white font-mono`}>
            IN {inCount} · OUT {outCount}
          </span>
        )}
      </div>
    );
  }
  if (uc.id === 'mealpulse')
    return (
      <span aria-hidden="true" className={`${CHIP} absolute right-2 bottom-8 bg-black/70 text-white`}>
        <Users className="w-3 h-3" />
        Queue {18 + ((camera.index * 3 + Math.floor(tick / 15)) % 9)}
      </span>
    );
  if (uc.id === 'visitor')
    return (
      <span aria-hidden="true" className={`${CHIP} absolute right-2 bottom-8 bg-black/70 text-white`}>
        <QrCode className="w-3 h-3" />
        Pass verified
      </span>
    );
  return null;
};
