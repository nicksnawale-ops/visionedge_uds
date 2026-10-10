import React from 'react';
import { CameraOff, Loader2 } from 'lucide-react';
import { CameraScene } from '../scenes/CameraScenes';
import { BUTTON } from '../primitives';
import type { DashCamera } from '../data/cameras';

export type CameraTileStatus = 'live' | 'offline' | 'connecting';

interface CameraFeedProps {
  camera: DashCamera;
  clock: string;
  /** Hide the detection box (e.g. no events recorded yet). */
  showDetection: boolean;
  /** Larger text for the modal view. */
  large?: boolean;
}

/** The live picture with overlays: LIVE pill, ticking timestamp, ID strip and the Cyan detection box. */
export const CameraFeed: React.FC<CameraFeedProps> = ({ camera, clock, showDetection, large = false }) => {
  const d = showDetection ? camera.detection : null;
  return (
    <div className="absolute inset-0">
      <CameraScene kind={camera.scene} />
      {d && (
        <div
          className="absolute border-2 border-[#00C6FF] rounded-[2px]"
          style={{ left: `${d.box[0]}%`, top: `${d.box[1]}%`, width: `${d.box[2]}%`, height: `${d.box[3]}%` }}
          aria-hidden="true"
        >
          <span
            className={`absolute bottom-full left-[-2px] mb-1 whitespace-nowrap rounded-[2px] bg-[#00C6FF] px-1.5 py-0.5 font-mono font-semibold text-[#0B2D6B] ${
              large ? 'text-[12px]' : 'text-[10px]'
            }`}
          >
            {d.label}
          </span>
        </div>
      )}
      <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-white">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00C6FF] motion-safe:animate-pulse" aria-hidden="true" />
        LIVE
      </span>
      <span className={`absolute top-2 right-2 font-mono text-white/80 tabular-nums ${large ? 'text-[12px]' : 'text-[11px]'}`}>{clock}</span>
      <span className={`absolute bottom-0 inset-x-0 bg-black/60 px-3 py-1.5 text-white truncate ${large ? 'text-[13px]' : 'text-[12px]'}`}>
        <span className="font-mono">{camera.id}</span> · {camera.name}
      </span>
    </div>
  );
};

interface CameraTileProps {
  camera: DashCamera;
  status: CameraTileStatus;
  clock: string;
  showDetection: boolean;
  onOpen: (camera: DashCamera, trigger: HTMLButtonElement) => void;
  onRetry: (id: string) => void;
}

const FRAME = 'relative aspect-video w-full overflow-hidden rounded-[12px] border border-[#1F2633]';

/** Camera tile (Camera tile standard): Black, 12px radius. Live tiles open the large view; offline tiles offer Retry. */
export const CameraTile: React.FC<CameraTileProps> = ({ camera, status, clock, showDetection, onOpen, onRetry }) => {
  if (status !== 'live') {
    return (
      <div className={`${FRAME} bg-[#121722] flex flex-col items-center justify-center gap-2 p-3 text-center`}>
        <CameraOff className="w-6 h-6 text-white/60" aria-hidden="true" />
        <p className="text-[13px] font-medium text-white">Camera offline · Last seen {camera.lastSeen}</p>
        <p className="text-[11px] text-white/60">
          <span className="font-mono">{camera.id}</span> · {camera.name}
        </p>
        <button
          type="button"
          onClick={() => onRetry(camera.id)}
          disabled={status === 'connecting'}
          aria-label={`Retry ${camera.id}, ${camera.name}`}
          className={`${BUTTON.secondarySm} mt-1 disabled:opacity-80 disabled:cursor-wait`}
        >
          {status === 'connecting' && <Loader2 className="w-3.5 h-3.5 motion-safe:animate-spin" aria-hidden="true" />}
          {status === 'connecting' ? 'Connecting…' : 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => onOpen(camera, e.currentTarget)}
      aria-label={`Open ${camera.id}, ${camera.name}, live${showDetection && camera.detection ? `, detected ${camera.detection.label}` : ''}`}
      className={`${FRAME} bg-black block text-left outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2 hover:border-[#00C6FF]/60 transition-colors`}
    >
      <CameraFeed camera={camera} clock={clock} showDetection={showDetection} />
    </button>
  );
};
