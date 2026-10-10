import React from 'react';
import { getLiveUseCase } from '../useCases';
import { getCameras } from '../data/cameras';
import { makeDetection } from '../data/detections';
import { NOW_START, clock } from '../data/seed';
import { LiveTile, LiveTileProps, TileMode } from '../wall/LiveTile';
import { EmptySlot } from '../wall/EmptySlot';

const uc = getLiveUseCase('anpr');
const cams = getCameras(uc);

/** A tile with sample props, overridden per state. */
const Sample: React.FC<Partial<LiveTileProps> & { mode?: TileMode; camIndex?: number }> = ({ camIndex = 2, ...over }) => {
  const c = cams[camIndex];
  const d = makeDetection(uc, cams, 900 + camIndex, NOW_START);
  return (
    <LiveTile
      uc={uc}
      camera={c}
      slot={camIndex}
      mode="online"
      sd={false}
      paused={false}
      playback={null}
      animate={false}
      hidden={false}
      selected={false}
      flash={0}
      compact={false}
      detectionLabel={d.chip}
      detectionExtra="Car"
      recentDetections={3}
      time={clock(NOW_START)}
      tick={0}
      barrierOpen={false}
      tabIndex={0}
      onSelect={() => undefined}
      onToggleFocus={() => undefined}
      onAction={() => undefined}
      onBarrier={() => undefined}
      onDropCamera={() => undefined}
      onGridKey={() => undefined}
      {...over}
    />
  );
};

const STATES: { label: string; note: string; node: React.ReactNode }[] = [
  { label: 'Online', note: 'LIVE pill, timestamp, HD, camera name; detection box', node: <Sample /> },
  { label: 'Selected / focused', note: '2px Royal Blue outline + 2px offset; controls in the Tab order', node: <Sample selected /> },
  { label: 'Alert', note: '2px Cyan border pulses 3×, then steady; ALERT chip with the title', node: <Sample alertTitle="Watchlist vehicle MH12 XY 4521" /> },
  { label: 'Reconnecting', note: 'Scene dimmed 40%, spinner, “Reconnecting… (attempt 2)”', node: <Sample mode="reconnecting" /> },
  { label: 'Offline', note: 'Gray 900, CameraOff, last seen time, Secondary “Retry”', node: <Sample mode="offline" /> },
  { label: 'Maintenance', note: 'Gray 800, Wrench, “Under maintenance until 16:00”', node: <Sample mode="maintenance" camIndex={11} /> },
  { label: 'Privacy mask', note: 'Hatched Gray 700 zone + “Privacy zone” chip', node: <Sample camIndex={3} /> },
  { label: 'Low bandwidth', note: '“SD” chip with an Info tooltip', node: <Sample sd /> },
  { label: 'Paused', note: '“Paused” chip replaces LIVE; the frame is frozen', node: <Sample paused /> },
  { label: 'Playback', note: 'Royal Blue “PLAYBACK 14:05:32” chip; “Go live” sits above the wall', node: <Sample playback="14:05:32" /> },
  {
    label: 'Empty slot',
    note: 'Dashed 1px Gray 600, Plus, “Add camera”; accepts dropped cameras',
    node: <EmptySlot slot={0} dropActive={false} tabIndex={0} onAdd={() => undefined} onDrop={() => undefined} onDragOver={() => undefined} onKeyDown={() => undefined} onFocus={() => undefined} />,
  },
];

/** Every tile state side by side, with labels. Each tile sits in its own one-cell grid for valid ARIA. */
export const TileStatesGallery: React.FC = () => (
  <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
    {STATES.map((s) => (
      <li key={s.label}>
        <div role="grid" aria-label={`${s.label} tile example`}>
          <div role="row">{s.node}</div>
        </div>
        <p className="mt-2 text-[14px] font-semibold text-[#121722]">{s.label}</p>
        <p className="text-[13px] text-[#4B5465]">{s.note}</p>
      </li>
    ))}
  </ul>
);
