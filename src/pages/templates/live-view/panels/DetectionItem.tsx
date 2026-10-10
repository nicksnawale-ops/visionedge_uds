import React from 'react';
import { CameraScene } from '../../dashboard/scenes/CameraScenes';
import type { SceneKind } from '../../dashboard/data/useCases';
import type { Detection } from '../data/detections';
import { ago } from '../data/seed';
import { useSurface } from '../surface/ControlRoomSurface';
import { DetectionBadge } from '../ui';

interface DetectionItemProps {
  d: Detection;
  scene: SceneKind;
  now: number;
  onOpen: (d: Detection) => void;
  /** Only the list's current item is in the Tab order. */
  tabIndex: number;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

/** 72px feed item: 64×40 thumbnail, identifier, camera + zone, relative time, confidence, status badge. */
export const DetectionItem: React.FC<DetectionItemProps> = ({ d, scene, now, onOpen, tabIndex, onKeyDown }) => {
  const t = useSurface();
  return (
    <button
      type="button"
      tabIndex={tabIndex}
      onClick={() => onOpen(d)}
      onKeyDown={onKeyDown}
      data-seq={d.seq}
      aria-label={`${d.primary}, ${d.cameraId} ${d.cameraName}, ${ago(now - d.at)}, ${d.confidence}% confidence, ${d.status}`}
      className={`w-full h-[72px] px-3 flex items-center gap-3 text-left ${t.hover} ${t.focusInset}`}
    >
      <span aria-hidden="true" className="relative w-16 h-10 shrink-0 rounded-[4px] bg-black overflow-hidden">
        <CameraScene kind={scene} className="absolute inset-0 w-full h-full" />
        <span className="absolute left-[34%] top-[30%] w-[30%] h-[46%] border-2 border-[#00C6FF] rounded-[3px]" />
      </span>
      <span className="flex-1 min-w-0">
        <span className={`block font-mono text-[13px] font-medium truncate ${t.text}`}>{d.primary}</span>
        <span className={`block text-[12px] truncate ${t.muted}`}>
          {d.cameraId} · {d.zone}
        </span>
      </span>
      <span className="shrink-0 flex flex-col items-end gap-1">
        <span className={`text-[12px] tabular-nums ${t.subtle}`}>
          {ago(now - d.at)} · <span className="font-mono">{d.confidence}%</span>
        </span>
        <DetectionBadge status={d.status} />
      </span>
    </button>
  );
};
