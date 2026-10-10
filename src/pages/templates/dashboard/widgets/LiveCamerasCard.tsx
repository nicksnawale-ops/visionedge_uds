import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, LINK, Segmented, Skeleton, demoLink } from '../primitives';
import { CameraTile, CameraTileStatus } from './CameraTile';
import { CameraModal } from './CameraModal';
import type { DashCamera } from '../data/cameras';

export interface CameraOpenRequest {
  id: string;
  /** Element to return focus to when the modal closes. */
  trigger: HTMLElement | null;
  /** Changes on every request so the same camera can be opened twice. */
  n: number;
}

interface LiveCamerasCardProps {
  cameras: DashCamera[];
  offline: number[];
  mode: 'ready' | 'loading' | 'empty';
  openRequest: CameraOpenRequest | null;
  className?: string;
  anatomy?: React.ReactNode;
}

type GridSize = '2' | '3';

const START_SECONDS = 14 * 3600 + 5 * 60 + 32;
const two = (n: number) => String(n).padStart(2, '0');
const clockText = (s: number) => `${two(Math.floor(s / 3600) % 24)}:${two(Math.floor(s / 60) % 60)}:${two(s % 60)}`;

/** One clock for every tile, ticking every second; cleaned up on unmount. */
function useCameraClock(): string {
  const [seconds, setSeconds] = useState(START_SECONDS);
  useEffect(() => {
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, []);
  return clockText(seconds);
}

/** "Live cameras" (8 columns on desktop): 2×2 or 3×3 tiles, click for the large view. */
export const LiveCamerasCard: React.FC<LiveCamerasCardProps> = ({ cameras, offline, mode, openRequest, className = '', anatomy }) => {
  const clock = useCameraClock();
  const [grid, setGrid] = useState<GridSize>('2');
  const [statusOverride, setStatusOverride] = useState<Record<string, CameraTileStatus>>({});
  const [open, setOpen] = useState<DashCamera | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  // "View on camera" from the critical banner.
  useEffect(() => {
    if (!openRequest) return;
    const cam = cameras.find((c) => c.id === openRequest.id) ?? cameras[0];
    returnFocus.current = openRequest.trigger;
    setOpen(cam);
  }, [openRequest, cameras]);

  const visible = cameras.slice(0, grid === '2' ? 4 : 9);
  const statusOf = (cam: DashCamera, index: number): CameraTileStatus =>
    statusOverride[cam.id] ?? (offline.includes(index) ? 'offline' : 'live');
  const onlineCount = visible.filter((c, i) => statusOf(c, i) === 'live').length;

  const retry = (id: string) => {
    setStatusOverride((s) => ({ ...s, [id]: 'connecting' }));
    timers.current.push(window.setTimeout(() => setStatusOverride((s) => ({ ...s, [id]: 'live' })), 1500));
  };

  const close = useCallback(() => {
    setOpen(null);
    returnFocus.current?.focus();
  }, []);

  return (
    <Card
      title="Live cameras"
      subtitle={mode === 'loading' ? undefined : `${onlineCount} of ${visible.length} online`}
      className={className}
      overlay={anatomy}
      actions={
        <>
          <a href="#cameras" onClick={demoLink} className={LINK}>
            View all cameras
          </a>
          <Segmented
            label="Camera grid"
            options={[
              { id: '2', label: '2×2' },
              { id: '3', label: '3×3' },
            ]}
            value={grid}
            onChange={setGrid}
          />
        </>
      }
    >
      <ul
        className={`grid grid-cols-1 gap-3 ${grid === '2' ? '@min-[768px]:grid-cols-2' : '@min-[768px]:grid-cols-3'}`}
        aria-label="Camera feeds"
      >
        {visible.map((cam, i) => (
          <li key={cam.id}>
            {mode === 'loading' ? (
              <Skeleton className="aspect-video w-full rounded-[12px]" />
            ) : (
              <CameraTile
                camera={cam}
                status={statusOf(cam, i)}
                clock={clock}
                showDetection={mode === 'ready'}
                onOpen={(c, trigger) => {
                  returnFocus.current = trigger;
                  setOpen(c);
                }}
                onRetry={retry}
              />
            )}
          </li>
        ))}
      </ul>
      {open && <CameraModal camera={open} clock={clock} showDetection={mode === 'ready'} onClose={close} />}
    </Card>
  );
};
