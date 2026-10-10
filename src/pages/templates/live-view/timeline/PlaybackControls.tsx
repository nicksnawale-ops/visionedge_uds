import React from 'react';
import { Camera, Download, Pause, Play, Radio, RotateCcw, RotateCw } from 'lucide-react';
import { useSurface } from '../surface/ControlRoomSurface';

export const SPEEDS = [0.5, 1, 2, 4] as const;
export type Speed = (typeof SPEEDS)[number];

interface PlaybackControlsProps {
  live: boolean;
  playing: boolean;
  speed: Speed;
  compact: boolean;
  onLive: () => void;
  onSkip: (seconds: number) => void;
  onTogglePlay: () => void;
  onSpeed: (s: Speed) => void;
  onSnapshot: () => void;
  onExport: () => void;
}

/** Live · −30s · Play/Pause · +30s · speed 0.5×/1×/2×/4× · Snapshot · Export clip. */
export const PlaybackControls: React.FC<PlaybackControlsProps> = ({ live, playing, speed, compact, onLive, onSkip, onTogglePlay, onSpeed, onSnapshot, onExport }) => {
  const t = useSurface();
  const icon = (label: string, Icon: React.FC<{ className?: string }>, onClick: () => void, pressed?: boolean) => (
    <button type="button" aria-label={label} title={label} aria-pressed={pressed} onClick={onClick} className={t.btn.iconSm}>
      <Icon className="w-4 h-4" aria-hidden="true" />
    </button>
  );
  return (
    <div className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        aria-pressed={live}
        onClick={onLive}
        className={`h-8 px-2.5 inline-flex items-center gap-1.5 rounded-[8px] text-[12px] font-semibold ${live ? 'bg-[#00C6FF]/15 text-[#00C6FF]' : `${t.muted} ${t.hover}`} ${t.focus}`}
      >
        <Radio className="w-4 h-4" aria-hidden="true" />
        Live
      </button>
      {icon('Back 30 seconds', RotateCcw, () => onSkip(-30))}
      {icon(playing ? 'Pause' : 'Play', playing ? Pause : Play, onTogglePlay)}
      {icon('Forward 30 seconds', RotateCw, () => onSkip(30))}
      <div role="group" aria-label="Playback speed" className={`inline-flex p-0.5 rounded-[8px] ${t.segment.group}`}>
        {SPEEDS.map((s) => (
          <button key={s} type="button" aria-pressed={speed === s} onClick={() => onSpeed(s)} className={`h-7 px-2 rounded-[6px] font-mono text-[11px] ${speed === s ? t.segment.on : t.segment.off} ${t.focus}`}>
            {s}×
          </button>
        ))}
      </div>
      {!compact && icon('Snapshot', Camera, onSnapshot)}
      {!compact && (
        <button type="button" onClick={onExport} className={t.btn.ghost}>
          <Download className="w-4 h-4" aria-hidden="true" />
          Export clip
        </button>
      )}
    </div>
  );
};
