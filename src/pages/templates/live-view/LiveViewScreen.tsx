import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Cctv, Info, ShieldAlert, X } from 'lucide-react';
import { ToastProvider, useToast } from '../../../components/common/Toast';
import { LOGIN_PREVIEW_PATH } from '../login/paths';
import { AppShell } from '../dashboard/shell/AppShell';
import { initialAlerts } from '../dashboard/data/alerts';
import { CameraScene } from '../dashboard/scenes/CameraScenes';
import { LiveUseCase, UseCaseId, getLiveUseCase } from './useCases';
import { LayoutId, LiveStateId, NARROW_LAYOUTS, Surface, getLayout } from './liveViewStates';
import { LiveCamera, SITES, getCameras } from './data/cameras';
import { Detection, FEED_MAX, initialDetections, makeDetection } from './data/detections';
import { LiveAlert, getAlerts } from './data/alerts';
import { NOW_START, clock } from './data/seed';
import { TickerContext, useTickerSource } from './hooks/useTicker';
import { screenSize, useElementWidth } from './hooks/useElementWidth';
import { ControlRoomSurface, surfaceTokens } from './surface/ControlRoomSurface';
import { LiveToolbar } from './toolbar/LiveToolbar';
import { StatsStrip } from './toolbar/StatsStrip';
import { VideoWall } from './wall/VideoWall';
import { LiveTile, TileMode } from './wall/LiveTile';
import { EmptySlot } from './wall/EmptySlot';
import { CameraList, CameraDot } from './panels/CameraList';
import { ActivityPanel, ActivityTab } from './panels/ActivityPanel';
import { DetectionFeed } from './panels/DetectionFeed';
import { AlertsList } from './panels/AlertsList';
import { CameraInfo } from './panels/CameraInfo';
import { BottomSheet } from './panels/BottomSheet';
import { DetectionDrawer } from './drawer/DetectionDrawer';
import { ConfirmActionModal } from './modals/ConfirmActionModal';
import { TimelineStrip, Zoom } from './timeline/TimelineStrip';
import { Speed } from './timeline/PlaybackControls';
import { AnatomyMarker } from './AnatomyOverlay';
import { groupOptions, inGroup, siteOptions } from './parts/selectOptions';

export interface LiveViewScreenProps {
  state?: LiveStateId;
  useCase?: UseCaseId;
  layout?: LayoutId;
  surface?: Surface;
  fillViewport?: boolean;
  showAnatomy?: boolean;
}

/**
 * Live view: product AppShell ("Live view" active) + toolbar, stats strip, camera list, video wall,
 * activity panel and timeline. Any change of state, use case, layout or surface starts from a clean slate.
 */
export const LiveViewScreen: React.FC<LiveViewScreenProps> = (props) => (
  <div className={`${props.fillViewport ? 'h-screen' : 'h-full'} [&>.fixed]:top-auto! [&>.fixed]:bottom-5!`}>
    <ToastProvider>
      <LiveViewContent key={`${props.state ?? 'default'}-${props.useCase ?? 'generic'}-${props.layout ?? '3x3'}-${props.surface ?? 'light'}`} {...props} />
    </ToastProvider>
  </div>
);

/** Slot → camera index for the default wall (cameras 1–12, then empty slots). */
const defaultSlots = (n: number): (number | null)[] => Array.from({ length: 16 }, (_, i) => (i < n && i < 12 ? i : null));

const SAVED_VIEW_SLOTS: Record<number, { layout: LayoutId; cams: number[] }> = {
  0: { layout: '2x2', cams: [0, 1, 2, 3] },
  1: { layout: '3x3', cams: [8, 9, 10, 0, 1, 2, 4, 5, 6] },
  2: { layout: '1+5', cams: [4, 5, 6, 7, 2, 3] },
};

const LiveViewContent: React.FC<LiveViewScreenProps> = ({ state = 'default', useCase: ucId = 'generic', layout: layoutProp = '3x3', surface = 'light', fillViewport = false, showAnatomy = false }) => {
  const { showToast } = useToast();
  const uc: LiveUseCase = useMemo(() => getLiveUseCase(ucId), [ucId]);
  const cameras = useMemo(() => getCameras(uc), [uc]);
  const t = surfaceTokens(surface);
  const A = (n: number, cls?: string) => <AnatomyMarker n={n} show={showAnatomy} className={cls} />;

  const rootRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const width = useElementWidth(rootRef);
  const size = screenSize(width);

  /* ── Wall ── */
  const initialLayout: LayoutId = state === 'focus' ? '1' : layoutProp;
  const [layout, setLayout] = useState<LayoutId>(initialLayout);
  const [prevLayout, setPrevLayout] = useState<LayoutId | null>(state === 'focus' ? layoutProp : null);
  const [slots, setSlots] = useState<(number | null)[]>(() => {
    if (state === 'empty') return Array(16).fill(null);
    if (state === 'focus' || state === 'critical') {
      const s = defaultSlots(getLayout(layoutProp).slots);
      if (state === 'critical') {
        // Put the alert camera in the first slot so it is visible in every layout.
        const ci = uc.criticalAlert.cameraIndex;
        const at = s.indexOf(ci);
        if (at > 0) [s[0], s[at]] = [s[at], s[0]];
        else if (at < 0) s[0] = ci;
      }
      return s;
    }
    return defaultSlots(getLayout(layoutProp).slots);
  });
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [live, setLive] = useState(state !== 'paused');
  const [modeOverride, setModeOverride] = useState<Record<string, TileMode>>(() => {
    if (state === 'offline') return { [cameras[1].id]: 'offline', [cameras[4].id]: 'offline' };
    if (state === 'reconnecting') return { [cameras[2].id]: 'reconnecting' };
    return {};
  });
  const [barriers, setBarriers] = useState<Record<string, boolean>>(() => Object.fromEntries(cameras.filter((c) => c.barrier).map((c, i) => [c.id, i % 3 !== 2])));
  const [confirm, setConfirm] = useState<LiveCamera | null>(null);
  const [flash, setFlash] = useState<{ cameraId: string; n: number } | null>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((x) => window.clearTimeout(x)), []);

  /* ── Panels ── */
  const [listOpen, setListOpen] = useState(true);
  const [activityOpen, setActivityOpen] = useState(true);
  const [tab, setTab] = useState<ActivityTab>('detections');
  const [items, setItems] = useState<Detection[]>(() => initialDetections(uc, cameras));
  useEffect(() => {
    if (state === 'detail') setDrawer(items[0].seq);
  }, []); // Mount only.
  const [feedPaused, setFeedPaused] = useState(false);
  const [alerts, setAlerts] = useState<LiveAlert[]>(() => getAlerts(uc, cameras, state === 'critical'));
  const [bannerOpen, setBannerOpen] = useState(true);
  /** Open detection, by sequence number (stable while new items arrive). */
  const [drawer, setDrawer] = useState<number | null>(null);
  const [confirmAckAll, setConfirmAckAll] = useState(false);

  /* ── Timeline ── */
  const [timelineOpen, setTimelineOpen] = useState(state === 'focus');
  const [playTime, setPlayTime] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<Speed>(1);
  const [zoom, setZoom] = useState<Zoom>(86400);

  /* ── Ticker, announcements ── */
  const loading = state === 'loading';
  const ticker = useTickerSource(live && !loading);
  const now = NOW_START + ticker.elapsed;
  const [polite, setPolite] = useState('');
  const [assertive, setAssertive] = useState('');
  const announce = useCallback((m: string) => setPolite(m), []);

  // The narrow and mobile layouts limit the wall.
  const effectiveLayout: LayoutId = size === 'mobile' ? '1' : size === 'narrow' && !NARROW_LAYOUTS.includes(layout) ? '2x2' : layout;
  const meta = getLayout(effectiveLayout);
  const slotCount = meta.slots;
  const sdGrid = slotCount > 9;
  // Compact overlays when a tile is narrower than 280px (1+5: the 5 small tiles).
  const wallWidth = useElementWidth(wallRef, 800);
  const tileWidth = (slot: number) => {
    const span = effectiveLayout === '1+5' && slot === 0 ? 2 : 1;
    return ((wallWidth - (meta.cols - 1) * 8) / meta.cols) * span + (span - 1) * 8;
  };

  // Collapse the camera list on medium and smaller screens.
  const lastSize = useRef(size);
  useEffect(() => {
    if (size !== 'wide' && lastSize.current === 'wide') setListOpen(false);
    if (size === 'wide' && lastSize.current !== 'wide') setListOpen(true);
    lastSize.current = size;
  }, [size]);

  // Critical alert: assertive announcement + toast once.
  useEffect(() => {
    if (state !== 'critical') return;
    setAssertive(`Critical alert: ${uc.criticalAlert.title}`);
    showToast(uc.criticalAlert.title, 'critical');
  }, []); // Mount only.

  // New detections every 4 s while live; feed capped at 200.
  useEffect(() => {
    if (!ticker.elapsed || ticker.elapsed % 4 !== 0 || feedPaused || !live || loading || state === 'empty') return;
    setItems((list) => [makeDetection(uc, cameras, (list[0]?.seq ?? 0) + 1, now), ...list].slice(0, FEED_MAX));
  }, [ticker.elapsed]); // One step per tick.

  // Playback advances with the ticker; reaching "now" goes live again.
  useEffect(() => {
    if (playTime === null || !playing || !ticker.elapsed) return;
    setPlayTime((p) => (p === null ? null : p + speed >= now ? null : p + speed));
  }, [ticker.elapsed]); // One step per tick.

  /* ── Derived ── */
  const camAt = (slot: number): LiveCamera | null => {
    const ci = slots[slot];
    return ci === null || ci === undefined ? null : cameras[ci];
  };
  const focusedCamera = camAt(selectedSlot) ?? camAt(0);
  const criticalCam = state === 'critical' ? cameras[uc.criticalAlert.cameraIndex] : null;
  const openAlerts = alerts.filter((a) => !a.acknowledged).length;
  const criticalOpen = alerts.some((a) => a.severity === 'critical' && !a.acknowledged);

  const modeOf = (c: LiveCamera): TileMode => (loading ? 'loading' : modeOverride[c.id] ?? (c.status === 'maintenance' ? 'maintenance' : 'online'));
  const dotOf = (c: LiveCamera): CameraDot => {
    const m = modeOf(c);
    return m === 'offline' || m === 'maintenance' ? 'offline' : c.status === 'recording' ? 'recording' : 'online';
  };
  const statusText = (c: LiveCamera) => {
    const m = modeOf(c);
    return m === 'online' ? (c.status === 'recording' ? 'Recording only' : 'Online') : m === 'maintenance' ? 'Under maintenance' : m[0].toUpperCase() + m.slice(1);
  };
  const latestFor = useCallback((cameraId: string) => items.find((d) => d.cameraId === cameraId), [items]);
  const countFor = (cameraId: string) => items.filter((d) => d.cameraId === cameraId && now - d.at < 600).length;
  const stats = state === 'offline' ? uc.offlineStats : uc.stats;
  const offlineCount = Object.values(modeOverride).filter((m) => m === 'offline').length;

  /* ── Site & camera group (toolbar) ── */
  // Until the user picks a site or group, the list and wall show every camera (the default view).
  const [viewSite, setViewSite] = useState(SITES[0]);
  const [viewGroup, setViewGroup] = useState(uc.zoneGroup);
  const [scoped, setScoped] = useState(false);
  const zones = useMemo(() => [...new Set(uc.cameras.map(([z]) => z))], [uc]);
  const scopeCameras = (s: string, g: string) => cameras.filter((c) => c.site === s && inGroup(c, g));
  const listCameras = scoped ? scopeCameras(viewSite, viewGroup) : cameras;
  const applyScope = (s: string, g: string) => {
    const list = scopeCameras(s, g);
    setScoped(true);
    setViewSite(s);
    setViewGroup(g);
    setSlots(Array.from({ length: 16 }, (_, i) => (i < slotCount && list[i] ? list[i].index : null)));
    setSelectedSlot(0);
    announce(`${g} at ${s}: ${list.length} camera${list.length === 1 ? '' : 's'}`);
  };
  const onSiteChange = (s: string) => {
    // Keep the group if it has cameras at the new site, otherwise fall back to the first group that does.
    const fallback = groupOptions(uc.zoneGroup, zones, cameras, s).find((o) => !o.disabled)?.value ?? viewGroup;
    applyScope(s, scopeCameras(s, viewGroup).length ? viewGroup : fallback);
  };

  /* ── Actions ── */
  const place = (slot: number, cameraIndex: number) =>
    setSlots((s) => {
      const next = [...s];
      const existing = next.indexOf(cameraIndex);
      if (existing >= 0 && existing !== slot) next[existing] = next[slot];
      next[slot] = cameraIndex;
      return next;
    });
  const cameraIndexOf = (id: string) => cameras.findIndex((c) => c.id === id);

  const pickCamera = (id: string) => {
    const ci = cameraIndexOf(id);
    if (ci < 0) return;
    place(selectedSlot < slotCount ? selectedSlot : 0, ci);
    announce(`${id} shown in tile ${selectedSlot + 1}`);
    if (size !== 'wide') setListOpen(false);
  };
  const addToWall = (id: string) => {
    const ci = cameraIndexOf(id);
    const free = slots.slice(0, slotCount).findIndex((x) => x === null);
    if (slots.slice(0, slotCount).includes(ci)) return showToast(`${id} is already on the wall`, 'info');
    if (free < 0) return showToast('The wall is full. Remove a camera or choose a larger layout.', 'info');
    place(free, ci);
    setSelectedSlot(free);
    showToast(`${id} added to the wall`, 'success');
  };
  const savedView = (name: string) => {
    const v = SAVED_VIEW_SLOTS[uc.savedViews.indexOf(name)] ?? SAVED_VIEW_SLOTS[0];
    setLayout(v.layout);
    setPrevLayout(null);
    setSlots(Array.from({ length: 16 }, (_, i) => v.cams[i] ?? null));
    setSelectedSlot(0);
    announce(`Saved view ${name} opened`);
    if (size !== 'wide') setListOpen(false);
  };

  const toggleFocus = (slot: number) => {
    if (effectiveLayout === '1' && prevLayout) {
      setLayout(prevLayout);
      setPrevLayout(null);
      announce('Back to the grid');
      return;
    }
    const ci = slots[slot];
    if (ci === null || ci === undefined) return;
    setPrevLayout(layout);
    setSlots((s) => {
      const next = [...s];
      [next[0], next[slot]] = [next[slot], next[0]];
      return next;
    });
    setSelectedSlot(0);
    setLayout('1');
    setTimelineOpen(true);
    announce(`${cameras[ci].id} in focus. Press Escape to return to the grid.`);
    window.setTimeout(() => wallRef.current?.querySelector<HTMLElement>('[data-slot="0"]')?.focus(), 0);
  };

  const fullscreen = (el: Element | null | undefined) => {
    if (el && 'requestFullscreen' in el) (el as HTMLElement).requestFullscreen().catch(() => showToast('Fullscreen is not available here', 'info'));
  };

  const tileAction = (slot: number, c: LiveCamera) => (action: string, detail?: string) => {
    switch (action) {
      case 'snapshot':
        return showToast(`Snapshot saved · ${c.id} ${clock(now)}`, 'success');
      case 'fullscreen':
        return fullscreen(wallRef.current?.querySelector(`[data-slot="${slot}"]`));
      case 'window':
        return showToast(`${c.id} opens in a new window in the product`, 'info');
      case 'settings':
        return showToast(`Opening settings for ${c.id}`, 'info');
      case 'remove':
        setSlots((s) => s.map((x, i) => (i === slot ? null : x)));
        return showToast(`${c.id} removed from the wall`, 'info');
      case 'ptz':
        return announce(`${c.id}: ${detail}`);
      case 'retry': {
        setModeOverride((m) => ({ ...m, [c.id]: 'reconnecting' }));
        announce(`Reconnecting to ${c.id}`);
        timers.current.push(
          window.setTimeout(() => {
            setModeOverride((m) => {
              const next = { ...m };
              delete next[c.id];
              return next;
            });
            announce(`${c.id} is back online`);
          }, 3000)
        );
        return;
      }
    }
  };

  const openDetection = (d: Detection) => {
    setDrawer(d.seq);
    setFlash({ cameraId: d.cameraId, n: Date.now() });
  };

  const ackAlert = (id: string) => setAlerts((list) => list.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  const viewAlert = (a: LiveAlert) => {
    const ci = cameraIndexOf(a.cameraId);
    const at = slots.slice(0, slotCount).indexOf(ci);
    if (at >= 0) setSelectedSlot(at);
    else place(selectedSlot, ci);
    setFlash({ cameraId: a.cameraId, n: Date.now() });
    setTab('info');
  };
  const focusCriticalCamera = () => {
    if (!criticalCam) return;
    const at = slots.indexOf(cameras.indexOf(criticalCam));
    toggleFocus(at >= 0 ? at : 0);
  };

  // Esc leaves focus mode (when no dialog is open).
  const onRootKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && prevLayout && drawer === null && !confirm && !confirmAckAll) {
      e.preventDefault();
      setLayout(prevLayout);
      setPrevLayout(null);
      announce('Back to the grid');
    }
  };

  /* ── Pieces ── */
  const renderSlot = (slot: number, grid: { tabIndex: number; onGridKey: (e: React.KeyboardEvent) => void }) => {
    const c = camAt(slot);
    if (!c)
      return (
        <EmptySlot
          slot={slot}
          dropActive={false}
          tabIndex={grid.tabIndex}
          onKeyDown={grid.onGridKey}
          onFocus={() => setSelectedSlot(slot)}
          onAdd={() => {
            setSelectedSlot(slot);
            setListOpen(true);
            window.setTimeout(() => rootRef.current?.querySelector<HTMLInputElement>('input[type=search]')?.focus(), 0);
          }}
          onDrop={(id) => place(slot, cameraIndexOf(id))}
          onDragOver={() => undefined}
        />
      );
    const latest = latestFor(c.id);
    const label = latest?.chip ?? makeDetection(uc, cameras, 5000 + c.index, now).chip;
    const extra = uc.id === 'anpr' ? latest?.facts.find((f) => f.label === 'Vehicle type')?.value ?? 'Car' : undefined;
    const isAlert = criticalCam?.id === c.id && criticalOpen;
    const sd = sdGrid || (state === 'low-bandwidth' && slot % 2 === 1);
    return (
      <div className="relative">
        {slot === 0 && A(6, 'top-1 left-1/2')}
        {slot === 0 && A(7, 'top-1/2 left-1/3')}
        <LiveTile
          uc={uc}
          camera={c}
          slot={slot}
          mode={modeOf(c)}
          alertTitle={isAlert ? uc.criticalAlert.title : undefined}
          sd={sd}
          paused={!live}
          playback={playTime !== null && slot === selectedSlot ? clock(playTime) : null}
          animate={live && !loading && slot < 9 && !sdGrid}
          hidden={ticker.hidden}
          selected={slot === selectedSlot}
          flash={flash?.cameraId === c.id ? flash.n : 0}
          compact={tileWidth(slot) < 280}
          detectionLabel={label}
          detectionExtra={extra}
          recentDetections={countFor(c.id)}
          time={clock(playTime !== null && slot === selectedSlot ? playTime : now)}
          tick={ticker.elapsed}
          barrierOpen={Boolean(barriers[c.id])}
          tabIndex={grid.tabIndex}
          onSelect={() => setSelectedSlot(slot)}
          onToggleFocus={() => toggleFocus(slot)}
          onAction={tileAction(slot, c)}
          onBarrier={() => setConfirm(c)}
          onDropCamera={(id) => place(slot, cameraIndexOf(id))}
          onGridKey={grid.onGridKey}
        />
      </div>
    );
  };

  const feed = (
    <DetectionFeed
      items={items}
      scene={uc.scene}
      now={now}
      types={uc.detectionTypes}
      feedPaused={feedPaused || !live}
      onTogglePause={() => setFeedPaused((p) => !p)}
      onOpen={openDetection}
      loading={loading}
      announce={announce}
    />
  );
  const activity = (bare = false, onClose?: () => void) => (
    <ActivityPanel
      tab={tab}
      onTab={setTab}
      openAlerts={openAlerts}
      bare={bare}
      onClose={onClose}
      detections={feed}
      alerts={<AlertsList alerts={alerts} now={now} onAcknowledge={ackAlert} onAcknowledgeAll={() => setConfirmAckAll(true)} onView={viewAlert} />}
      info={<CameraInfo camera={focusedCamera} statusText={focusedCamera ? statusText(focusedCamera) : ''} onSettings={() => showToast(`Opening settings for ${focusedCamera?.id}`, 'info')} />}
    />
  );
  const cameraList = (onClose?: () => void) => (
    <CameraList
      cameras={listCameras}
      dotOf={dotOf}
      focusedCameraId={focusedCamera?.id ?? null}
      savedViews={uc.savedViews}
      onPick={pickCamera}
      onAddToWall={addToWall}
      onSavedView={savedView}
      onClose={onClose}
      loading={loading}
    />
  );

  const banner =
    state === 'critical' && criticalOpen && bannerOpen ? (
      <div role="alert" className="relative flex flex-wrap items-center gap-3 px-4 py-3 rounded-[12px] bg-[#0B2D6B] border-l-4 border-l-[#00C6FF] text-white">
        {A(11)}
        <ShieldAlert className="w-5 h-5 shrink-0 text-[#00C6FF]" aria-hidden="true" />
        <p className="flex-1 min-w-[200px] text-[14px] font-medium">{uc.criticalAlert.title}</p>
        <button type="button" onClick={focusCriticalCamera} className="h-9 px-3 rounded-[8px] bg-white text-[#0B2D6B] text-[13px] font-semibold hover:bg-[#EEF1F6] outline-none focus-visible:ring-2 focus-visible:ring-[#00C6FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2D6B]">
          Focus camera
        </button>
        <button
          type="button"
          onClick={() => {
            const crit = alerts.find((a) => a.severity === 'critical');
            if (crit) ackAlert(crit.id);
            setBannerOpen(false);
            announce('Critical alert acknowledged');
          }}
          className="h-9 px-3 rounded-[8px] text-white text-[13px] font-semibold hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-[#00C6FF]"
        >
          Acknowledge
        </button>
      </div>
    ) : (state === 'offline' && offlineCount > 0 && bannerOpen) || (state === 'low-bandwidth' && bannerOpen) ? (
      <div role="status" className={`flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-[12px] border-l-4 border-l-[#1E63FF] ${surface === 'control' ? 'bg-[#1E63FF]/20 text-white' : 'bg-[#1E63FF]/[0.08] text-[#121722]'}`}>
        <Info className="w-5 h-5 shrink-0 text-[#1E63FF]" aria-hidden="true" />
        <p className="flex-1 text-[14px]">{state === 'offline' ? `${offlineCount} camera${offlineCount === 1 ? ' is' : 's are'} offline.` : 'Low bandwidth detected. Streams switched to low quality.'}</p>
        {state === 'offline' && (
          <button
            type="button"
            onClick={() => {
              const at = slots.findIndex((ci) => ci !== null && modeOverride[cameras[ci].id] === 'offline');
              if (at >= 0) setSelectedSlot(at);
              setTab('info');
              setActivityOpen(true);
            }}
            className={t.btn.ghost}
          >
            View details
          </button>
        )}
        <button type="button" onClick={() => setBannerOpen(false)} aria-label="Dismiss" className={t.btn.iconSm}>
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    ) : null;

  const wallBody =
    state === 'empty' && slots.every((s) => s === null) ? (
      <div className={`h-full min-h-[260px] rounded-[12px] border border-dashed ${t.border} flex flex-col items-center justify-center gap-2 p-6 text-center`}>
        <Cctv className={`w-8 h-8 ${t.subtle}`} aria-hidden="true" />
        <p className={`text-[16px] font-semibold ${t.text}`}>No cameras in this view</p>
        <p className={`text-[14px] max-w-[360px] ${t.muted}`}>Choose cameras from the list or select a saved view.</p>
        <button
          type="button"
          onClick={() => {
            setListOpen(true);
            window.setTimeout(() => rootRef.current?.querySelector<HTMLInputElement>('input[type=search]')?.focus(), 0);
          }}
          className={`${t.btn.secondary} mt-1`}
        >
          Open camera list
        </button>
      </div>
    ) : (
      <VideoWall
        layout={effectiveLayout}
        slotCount={slotCount}
        selectedSlot={selectedSlot}
        onSelectSlot={setSelectedSlot}
        renderSlot={renderSlot}
        label={`Video wall, ${meta.label}, ${slots.slice(0, slotCount).filter((s) => s !== null).length} cameras`}
      />
    );

  const timeline = focusedCamera && state !== 'empty' && (
    <div className="relative">
      {A(10)}
      <TimelineStrip
        cameraId={focusedCamera.id}
        cameraName={focusedCamera.name}
        now={now}
        playTime={playTime}
        playing={playing}
        speed={speed}
        zoom={zoom}
        open={timelineOpen}
        compact={size === 'mobile' || size === 'narrow'}
        onToggleOpen={() => setTimelineOpen((o) => !o)}
        onSeek={(x) => {
          setPlayTime(x >= now ? null : x);
          announce(x >= now ? 'Live' : `Playback ${clock(x)}`);
        }}
        onLive={() => {
          setPlayTime(null);
          announce('Live');
        }}
        onTogglePlay={() => {
          // Pausing live freezes the current moment (playback, paused); Play resumes from there.
          if (playTime === null) {
            setPlayTime(now);
            setPlaying(false);
            announce(`Paused at ${clock(now)}`);
          } else setPlaying((p) => !p);
        }}
        onSpeed={setSpeed}
        onZoom={setZoom}
        onSnapshot={() => showToast(`Snapshot saved · ${focusedCamera.id} ${clock(playTime ?? now)}`, 'success')}
        onExport={() => showToast(`Exporting a 60-second clip from ${focusedCamera.id}`, 'info')}
      />
    </div>
  );

  const loadingNote = loading && (
    <p role="status" className={`text-[13px] ${t.muted}`}>
      Connecting to {slotCount} cameras…
    </p>
  );

  const playbackBar = playTime !== null && (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-[12px] border ${t.panel}`}>
      <span className="h-6 px-2 inline-flex items-center rounded-[4px] bg-[#1E63FF] text-white text-[12px] font-semibold font-mono">PLAYBACK {clock(playTime)}</span>
      <span className={`text-[13px] ${t.muted}`}>{focusedCamera?.id}</span>
      <button type="button" onClick={() => setPlayTime(null)} className={`${t.btn.secondary} ml-auto`}>
        Go live
      </button>
    </div>
  );

  const toolbar = (
    <div className="relative">
      {A(1)}
      <LiveToolbar
        site={viewSite}
        sites={siteOptions(SITES, cameras)}
        onSite={onSiteChange}
        zone={viewGroup}
        zones={groupOptions(uc.zoneGroup, zones, cameras, viewSite)}
        onZone={(g) => applyScope(viewSite, g)}
        layout={effectiveLayout}
        layouts={size === 'narrow' ? NARROW_LAYOUTS : ['1', '2x2', '3x3', '4x4', '1+5']}
        onLayout={(l) => {
          setLayout(l);
          setPrevLayout(null);
          setSelectedSlot(0);
        }}
        live={live}
        onToggleLive={() => {
          setLive((l) => !l);
          announce(live ? 'Wall paused' : 'Live');
        }}
        now={now}
        listOpen={listOpen}
        activityOpen={activityOpen}
        onToggleList={() => setListOpen((o) => !o)}
        onToggleActivity={() => setActivityOpen((o) => !o)}
        onSnapshotAll={() => showToast(`Snapshots saved for ${slots.slice(0, slotCount).filter((s) => s !== null).length} cameras`, 'success')}
        onFullscreen={() => fullscreen(wallRef.current)}
        paused={!live}
        onResume={() => setLive(true)}
        mobile={size === 'mobile'}
        showListToggle
        showActivityToggle={size === 'wide' || size === 'medium'}
      />
      {size !== 'mobile' && A(2, '-top-2.5 left-1/2')}
    </div>
  );

  const drawerIndex = drawer === null ? -1 : items.findIndex((x) => x.seq === drawer);
  const drawerDetection = drawerIndex >= 0 ? items[drawerIndex] : null;

  const content = (
    <ControlRoomSurface surface={surface} rootRef={rootRef} className={size === 'mobile' ? 'overflow-y-auto' : 'overflow-hidden'}>
      <div onKeyDown={onRootKey} className={`flex-1 min-h-0 flex flex-col gap-3 ${size === 'mobile' ? 'p-3' : 'p-6'}`}>
        {toolbar}
        <div className="relative">
          {A(3)}
          <StatsStrip stats={stats} loading={loading} compact={size === 'mobile' || size === 'narrow'} />
        </div>
        {banner}
        {loadingNote}

        {size === 'mobile' ? (
          /* <768px: focused tile, a swipeable camera strip, then the feed */
          <div className="flex flex-col gap-3">
            <div ref={wallRef} className="relative">
              {A(5)}
              {wallBody}
            </div>
            {playbackBar}
            <ul aria-label="Cameras" className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-1 [scrollbar-width:none]">
              {listCameras.map((c) => {
                const on = focusedCamera?.id === c.id;
                return (
                  <li key={c.id} className="snap-start shrink-0">
                    <button
                      type="button"
                      onClick={() => place(0, c.index)}
                      aria-pressed={on}
                      aria-label={`${c.id}, ${c.name}, ${statusText(c)}`}
                      className={`w-[132px] rounded-[8px] overflow-hidden border-2 text-left ${on ? 'border-[#1E63FF]' : 'border-transparent'} ${t.focus}`}
                    >
                      <span aria-hidden="true" className="relative block aspect-video bg-black">
                        {modeOf(c) === 'online' && <CameraScene kind={uc.scene} className="absolute inset-0 w-full h-full" />}
                        <span className="absolute inset-x-0 bottom-0 px-1.5 py-0.5 bg-black/60 text-white font-mono text-[11px]">{c.id}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className={`h-[480px] rounded-[12px] border ${t.panel} overflow-hidden relative`}>
              {A(8)}
              {activity(true)}
            </div>
            {timeline}
          </div>
        ) : (
          <div className="relative flex-1 min-h-0 flex gap-3">
            {size === 'wide' && listOpen && (
              <div className="relative w-[280px] shrink-0 min-h-0">
                {A(4)}
                {cameraList()}
              </div>
            )}
            <div className="relative flex-1 min-w-0 min-h-0 flex flex-col gap-3">
              <div ref={wallRef} className={`relative flex-1 min-h-0 overflow-y-auto ${size === 'narrow' ? 'pb-[42%]' : ''}`}>
                {A(5, 'top-1 -left-1')}
                {playbackBar && <div className="mb-3">{playbackBar}</div>}
                {wallBody}
              </div>
              {timeline}
            </div>
            {(size === 'wide' || size === 'medium') && activityOpen && (
              <div className="relative w-[360px] shrink-0 min-h-0">
                {A(8)}
                {A(9, 'top-[150px] -left-2.5')}
                {activity()}
              </div>
            )}
            {size === 'narrow' && <BottomSheet label="activity panel">{activity(true)}</BottomSheet>}
            {size !== 'wide' && listOpen && (
              <div className="absolute inset-0 z-30 flex">
                <div aria-hidden="true" className="absolute inset-0 bg-black/40" onClick={() => setListOpen(false)} />
                <div className="relative w-[280px] max-w-[85%] h-full shadow-[0_12px_32px_rgba(11,45,107,0.18)]">{cameraList(() => setListOpen(false))}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {drawerDetection && (
        <DetectionDrawer
          uc={uc}
          detection={drawerDetection}
          hasPrev={drawerIndex > 0}
          hasNext={drawerIndex < items.length - 1}
          onPrev={() => setDrawer(items[Math.max(0, drawerIndex - 1)].seq)}
          onNext={() => setDrawer(items[Math.min(items.length - 1, drawerIndex + 1)].seq)}
          onClose={() => setDrawer(null)}
          onAction={(m, kind) => showToast(m, kind)}
        />
      )}
      {confirm && (
        <ConfirmActionModal
          title={`${barriers[confirm.id] ? 'Close' : 'Open'} barrier at ${confirm.name}?`}
          body={`This ${barriers[confirm.id] ? 'lowers' : 'raises'} the physical barrier. The action is recorded in the audit log with your name and the time.`}
          confirmLabel={barriers[confirm.id] ? 'Close barrier' : 'Open barrier'}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            const opening = !barriers[confirm.id];
            setBarriers((b) => ({ ...b, [confirm.id]: opening }));
            showToast(`Audit: action recorded · Barrier ${opening ? 'opened' : 'closed'} at ${confirm.name} (${clock(now)})`, 'success');
            setConfirm(null);
          }}
        />
      )}
      {confirmAckAll && (
        <ConfirmActionModal
          title={`Acknowledge all ${openAlerts} alerts?`}
          body="They move to the bottom of the list. You can still view them."
          confirmLabel="Acknowledge all"
          onCancel={() => setConfirmAckAll(false)}
          onConfirm={() => {
            setAlerts((list) => list.map((a) => ({ ...a, acknowledged: true })));
            setConfirmAckAll(false);
            setBannerOpen(false);
            announce('All alerts acknowledged');
          }}
        />
      )}
      <p className="sr-only" role="status" aria-live="polite">
        {polite}
      </p>
      <p className="sr-only" role="alert" aria-live="assertive">
        {assertive}
      </p>
    </ControlRoomSurface>
  );

  const [userCollapsed, setUserCollapsed] = useState(false);
  const [site, setSite] = useState(uc.shell.site);
  const shellAlerts = useMemo(() => initialAlerts(uc.id, false), [uc.id]);
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <TickerContext.Provider value={ticker}>
      <div className={`@container w-full ${fillViewport ? 'h-screen' : 'h-full'}`}>
        <AppShell
          useCase={uc.shell}
          userCollapsed={userCollapsed}
          onToggleCollapsed={() => setUserCollapsed((c) => !c)}
          searchRef={searchRef}
          onSearch={(q) => q && showToast(`Search for "${q}" opens in the full product`, 'info')}
          site={site}
          onSiteChange={setSite}
          live={live}
          onToggleLive={() => setLive((l) => !l)}
          alerts={shellAlerts}
          unread={openAlerts}
          signOutHref={`${LOGIN_PREVIEW_PATH}?usecase=${uc.id}`}
          newTab={!fillViewport}
          anatomy={{ sidebar: null, topBar: null }}
          landmarkMain={fillViewport}
          activeNavId="live"
          contentLabel="Live view content"
        >
          {content}
        </AppShell>
      </div>
    </TickerContext.Provider>
  );
};
