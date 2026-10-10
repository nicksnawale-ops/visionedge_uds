import React, { useEffect, useId, useRef, useState } from 'react';
import { Camera as CameraIcon, CameraOff, ExternalLink, Expand, Loader2, Maximize2, MoreVertical, Move, Settings, Trash2, Volume2, VolumeX, Wrench } from 'lucide-react';
import { CameraScene } from '../../dashboard/scenes/CameraScenes';
import type { LiveCamera } from '../data/cameras';
import type { LiveUseCase } from '../useCases';
import { MovingObjects } from './MovingObjects';
import { AlertChip, BottomStrip, TopStrip, UseCaseOverlay } from './TileOverlays';
import { PtzPad } from './PtzPad';

export type TileMode = 'online' | 'offline' | 'reconnecting' | 'maintenance' | 'loading';

export interface LiveTileProps {
  uc: LiveUseCase;
  camera: LiveCamera;
  slot: number;
  mode: TileMode;
  alertTitle?: string;
  sd: boolean;
  paused: boolean;
  playback: string | null;
  animate: boolean;
  hidden: boolean;
  selected: boolean;
  /** Royal Blue outline flash (a detection was clicked). */
  flash: number;
  compact: boolean;
  /** Label on the moving object's detection box. */
  detectionLabel: string;
  detectionExtra?: string;
  recentDetections: number;
  time: string;
  tick: number;
  barrierOpen: boolean;
  tabIndex: number;
  onSelect: () => void;
  onToggleFocus: () => void;
  onAction: (action: 'snapshot' | 'fullscreen' | 'window' | 'settings' | 'remove' | 'retry' | 'ptz' | 'mute', detail?: string) => void;
  onBarrier: () => void;
  onDropCamera: (cameraId: string) => void;
  onGridKey: (e: React.KeyboardEvent) => void;
}

const CTRL =
  'relative w-8 h-8 inline-flex items-center justify-center rounded-[6px] text-white hover:bg-white/20 outline-none focus-visible:ring-2 focus-visible:ring-[#00C6FF] group/ctl';

/** Small Ghost-on-dark control with a tooltip. */
const Ctrl: React.FC<{ label: string; icon: React.FC<{ className?: string }>; onClick: () => void; tabIndex: number; pressed?: boolean; haspopup?: boolean; expanded?: boolean }> = ({
  label,
  icon: Icon,
  onClick,
  tabIndex,
  pressed,
  haspopup,
  expanded,
}) => (
  <button
    type="button"
    tabIndex={tabIndex}
    aria-label={label}
    aria-pressed={pressed}
    aria-haspopup={haspopup ? 'menu' : undefined}
    aria-expanded={haspopup ? expanded : undefined}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    onDoubleClick={(e) => e.stopPropagation()}
    className={CTRL}
  >
    <Icon className="w-4 h-4" aria-hidden="true" />
    <span role="tooltip" className="absolute top-full mt-1 right-0 z-30 px-1.5 py-0.5 rounded-[4px] bg-[#121722] text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover/ctl:opacity-100 group-focus-visible/ctl:opacity-100">
      {label}
    </span>
  </button>
);

/**
 * Camera tile: Black, 16:9, 12px radius, decorative scene + moving object, overlay strips, detection box,
 * hover/focus controls and every tile state. Double-click or Enter toggles single-camera focus mode.
 */
export const LiveTile: React.FC<LiveTileProps> = (p) => {
  const { uc, camera, mode, compact } = p;
  const [menu, setMenu] = useState(false);
  const [ptz, setPtz] = useState(false);
  const [muted, setMuted] = useState(true);
  const [dropActive, setDropActive] = useState(false);
  const menuId = useId();
  const cellRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLSpanElement>(null);
  const flashRef = useRef<HTMLSpanElement>(null);
  const live = mode === 'online';
  const ctrlTab = p.selected ? 0 : -1;

  // Alert border: 3 pulses, then steady.
  useEffect(() => {
    const el = alertRef.current;
    if (!p.alertTitle || !el?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const a = el.animate([{ opacity: 1 }, { opacity: 0.25 }, { opacity: 1 }], { duration: 900, iterations: 3 });
    return () => a.cancel();
  }, [p.alertTitle]);

  // Royal Blue outline flash when a detection from this camera is opened.
  useEffect(() => {
    const el = flashRef.current;
    if (!p.flash || !el?.animate) return;
    const a = el.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 1 }, { opacity: 0 }], { duration: 1200 });
    return () => a.cancel();
  }, [p.flash]);

  // Open: focus the first item. Close on an outside press.
  useEffect(() => {
    if (!menu) return;
    document.getElementById(menuId)?.querySelector<HTMLElement>('[role=menuitem]')?.focus();
    const onDown = (e: PointerEvent) => {
      if (!cellRef.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [menu, menuId]);

  const statusText =
    mode === 'loading' ? 'connecting' : mode === 'offline' ? 'offline' : mode === 'reconnecting' ? 'reconnecting' : mode === 'maintenance' ? 'under maintenance' : p.paused ? 'paused' : camera.status === 'recording' ? 'recording only' : 'online';
  const label = `${camera.id}, ${camera.name}, ${statusText}${p.alertTitle ? `, alert: ${p.alertTitle}` : ''}${live ? `, ${p.recentDetections} detections` : ''}`;

  const menuItems: [string, React.FC<{ className?: string }>, () => void][] = [
    ['Open in new window', ExternalLink, () => p.onAction('window')],
    ['Camera settings', Settings, () => p.onAction('settings')],
    ['Remove from wall', Trash2, () => p.onAction('remove')],
  ];

  return (
    <div
      ref={cellRef}
      role="gridcell"
      tabIndex={p.tabIndex}
      aria-label={label}
      aria-selected={p.selected}
      data-slot={p.slot}
      data-camera={camera.id}
      onFocus={(e) => e.target === e.currentTarget && p.onSelect()}
      onClick={p.onSelect}
      onDoubleClick={p.onToggleFocus}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          p.onToggleFocus();
        } else p.onGridKey(e);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDropActive(true);
      }}
      onDragLeave={() => setDropActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDropActive(false);
        const id = e.dataTransfer.getData('text/camera-id');
        if (id) p.onDropCamera(id);
      }}
      className={`group/tile relative aspect-video rounded-[12px] bg-black overflow-hidden select-none outline-none ${
        p.selected ? 'ring-2 ring-[#1E63FF] ring-offset-2 ring-offset-transparent' : ''
      } focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2`}
    >
      {/* Scene */}
      {mode === 'loading' ? (
        <div aria-hidden="true" className="absolute inset-0 bg-[#1F2633] motion-safe:animate-pulse" />
      ) : mode === 'offline' ? (
        <div className="absolute inset-0 bg-[#121722] flex flex-col items-center justify-center gap-2 p-3 text-center">
          <CameraOff className="w-6 h-6 text-[#8C95A6]" aria-hidden="true" />
          <p className="text-[12px] text-white">Camera offline · Last seen 14:02</p>
          <button
            type="button"
            tabIndex={ctrlTab}
            onClick={(e) => {
              e.stopPropagation();
              p.onAction('retry');
            }}
            className="h-8 px-3 rounded-[8px] border border-white text-[13px] font-semibold text-white hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-[#00C6FF]"
          >
            Retry
          </button>
        </div>
      ) : mode === 'maintenance' ? (
        <div className="absolute inset-0 bg-[#1F2633] flex flex-col items-center justify-center gap-2 p-3 text-center">
          <Wrench className="w-6 h-6 text-[#8C95A6]" aria-hidden="true" />
          <p className="text-[12px] text-white">Under maintenance until 16:00</p>
        </div>
      ) : (
        <div aria-hidden="true" className={`absolute inset-0 ${mode === 'reconnecting' ? 'opacity-60' : ''}`}>
          <CameraScene kind={uc.scene} className="absolute inset-0 w-full h-full" />
          {camera.status !== 'recording' && mode === 'online' && (
            <MovingObjects kind={uc.object} label={p.detectionLabel} extra={p.detectionExtra} index={camera.index} animate={p.animate} hidden={p.hidden} small={compact} />
          )}
          {camera.privacy && (
            <span className="absolute right-[8%] top-[18%] w-[30%] h-[42%] bg-[#353D4C] bg-[repeating-linear-gradient(135deg,transparent_0,transparent_6px,rgba(255,255,255,0.12)_6px,rgba(255,255,255,0.12)_8px)]">
              <span className="absolute left-1 top-1 px-1 rounded-[2px] bg-black/60 text-white text-[10px] font-medium">Privacy zone</span>
            </span>
          )}
        </div>
      )}

      {mode === 'reconnecting' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
          <Loader2 className="w-6 h-6 motion-safe:animate-spin" aria-hidden="true" />
          <p className="text-[12px]">Reconnecting… (attempt 2)</p>
        </div>
      )}
      {mode === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[12px] text-[#C3CAD5]">Connecting…</span>
        </div>
      )}

      {/* Use-case overlays */}
      {mode === 'online' && <UseCaseOverlay uc={uc} camera={camera} compact={compact} barrierOpen={p.barrierOpen} onBarrier={p.onBarrier} interactive={p.selected} alert={Boolean(p.alertTitle)} tick={p.tick} />}

      {/* Strips */}
      {mode !== 'loading' && <TopStrip recording={camera.status === 'recording'} time={p.time} sd={p.sd} paused={p.paused} playback={p.playback} compact={compact} />}
      {mode !== 'loading' && <BottomStrip camera={camera} compact={compact} />}
      {p.alertTitle && <AlertChip title={p.alertTitle} />}

      {/* Controls: fade in on hover / focus */}
      {mode !== 'loading' && (
        <div className="absolute right-1.5 top-7 z-10 flex items-center gap-0.5 rounded-[8px] bg-black/60 p-0.5 opacity-0 group-hover/tile:opacity-100 group-focus-within/tile:opacity-100 transition-opacity">
          <Ctrl label="Focus camera" icon={Expand} onClick={p.onToggleFocus} tabIndex={ctrlTab} />
          {!compact && <Ctrl label="Snapshot" icon={CameraIcon} onClick={() => p.onAction('snapshot')} tabIndex={ctrlTab} />}
          <Ctrl label="Fullscreen" icon={Maximize2} onClick={() => p.onAction('fullscreen')} tabIndex={ctrlTab} />
          {camera.type === 'PTZ' && mode === 'online' && <Ctrl label="PTZ controls" icon={Move} onClick={() => setPtz((v) => !v)} tabIndex={ctrlTab} pressed={ptz} />}
          {camera.audio && !compact && <Ctrl label={muted ? 'Unmute' : 'Mute'} icon={muted ? VolumeX : Volume2} onClick={() => setMuted((m) => !m)} tabIndex={ctrlTab} pressed={!muted} />}
          <Ctrl label="More" icon={MoreVertical} onClick={() => setMenu((m) => !m)} tabIndex={ctrlTab} haspopup expanded={menu} />
        </div>
      )}
      {menu && (
        <div
          id={menuId}
          role="menu"
          aria-label={`${camera.id} actions`}
          onKeyDown={(e) => {
            const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role=menuitem]'));
            const i = items.indexOf(document.activeElement as HTMLElement);
            if (e.key === 'ArrowDown') items[(i + 1) % items.length]?.focus();
            else if (e.key === 'ArrowUp') items[(i - 1 + items.length) % items.length]?.focus();
            else if (e.key === 'Escape') {
              setMenu(false);
              cellRef.current?.focus();
            } else return;
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute right-1.5 top-[68px] z-30 w-[190px] py-1 rounded-[8px] bg-[#1F2633] border border-white/[0.08] shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
        >
          {menuItems.map(([text, Icon, run]) => (
            <button
              key={text}
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                setMenu(false);
                run();
              }}
              className="w-full h-9 px-3 flex items-center gap-2 text-left text-[13px] text-white hover:bg-white/10 outline-none focus-visible:bg-white/10"
            >
              <Icon className="w-4 h-4 text-[#C3CAD5]" aria-hidden="true" />
              {text}
            </button>
          ))}
        </div>
      )}
      {ptz && (
        <PtzPad
          camera={camera.id}
          onMove={(a) => p.onAction('ptz', a)}
          onClose={() => {
            setPtz(false);
            cellRef.current?.focus();
          }}
        />
      )}

      {/* Alert border (2px Cyan, pulses 3×, then steady) and flash outline */}
      {p.alertTitle && <span ref={alertRef} aria-hidden="true" className="absolute inset-0 rounded-[12px] border-2 border-[#00C6FF] pointer-events-none" />}
      <span ref={flashRef} aria-hidden="true" className="absolute inset-0 rounded-[12px] border-2 border-[#1E63FF] opacity-0 pointer-events-none" />
      {dropActive && <span aria-hidden="true" className="absolute inset-0 rounded-[12px] border-2 border-dashed border-[#00C6FF] bg-[#00C6FF]/10 pointer-events-none" />}
    </div>
  );
};
