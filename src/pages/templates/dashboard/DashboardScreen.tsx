import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Info, WifiOff } from 'lucide-react';
import { ToastProvider, useToast } from '../../../components/common/Toast';
import type { ChartStatus } from '../../../components/charts/ChartState';
import { InfoAlert } from '../shared/authUi';
import { LOGIN_PREVIEW_PATH } from '../login/paths';
import { AppShell } from './shell/AppShell';
import { PageHeader } from './widgets/PageHeader';
import { CriticalBanner } from './widgets/CriticalBanner';
import { KpiRow } from './widgets/KpiRow';
import { MainTrendCard } from './widgets/MainTrendCard';
import { LiveAlertsCard } from './widgets/LiveAlertsCard';
import { CameraOpenRequest, LiveCamerasCard } from './widgets/LiveCamerasCard';
import { SystemHealthCard } from './widgets/SystemHealthCard';
import { InsightsRow } from './widgets/InsightsRow';
import { RecentEventsTable } from './widgets/RecentEventsTable';
import { AnatomyMarker } from './AnatomyOverlay';
import { BUTTON } from './primitives';
import { DashboardStateId, REFRESH_MS } from './dashboardStates';
import { RangeId, UseCaseId, getDashboardUseCase, getRange } from './data/useCases';
import { getKpiLabels, getKpis } from './data/kpis';
import { CRITICAL_ALERTS, DashAlert, alertForTick, initialAlerts, relativeTime } from './data/alerts';
import { getCameras, offlineIndexes } from './data/cameras';
import { getEvents } from './data/events';

export interface DashboardScreenProps {
  state?: DashboardStateId;
  onStateChange?: (state: DashboardStateId) => void;
  useCase?: UseCaseId;
  range?: RangeId;
  /** Full-screen route: fill the viewport and own the page landmarks. */
  fillViewport?: boolean;
  /** Overlay numbered anatomy markers (reference page). */
  showAnatomy?: boolean;
}

/**
 * VisionEdge product dashboard: app shell + 12-column grid of widget slots.
 * Each widget owns its loading, empty and error state, so one failure never blanks the page.
 */
export const DashboardScreen: React.FC<DashboardScreenProps> = (props) => (
  // The shared ToastProvider stacks toasts top-right; in the product dashboard they sit bottom-right,
  // so this wrapper re-anchors its (direct-child) container without changing the shared component.
  <div className={`${props.fillViewport ? '' : 'h-full'} [&>.fixed]:top-auto! [&>.fixed]:bottom-5!`}>
    <ToastProvider>
      {/* Picking another state or use case starts from a clean slate. */}
      <DashboardContent key={`${props.state ?? 'default'}-${props.useCase ?? 'generic'}`} {...props} />
    </ToastProvider>
  </div>
);

const DashboardContent: React.FC<DashboardScreenProps> = ({
  state = 'default',
  useCase: useCaseId = 'generic',
  range: initialRange = 'today',
  fillViewport = false,
  showAnatomy = false,
}) => {
  const { showToast } = useToast();
  const useCase = getDashboardUseCase(useCaseId);

  const loading = state === 'loading';
  const empty = state === 'empty';
  const degraded = state === 'degraded';
  const critical = state === 'critical';
  const widgetMode = loading ? 'loading' : empty ? 'empty' : 'ready';
  const widgetStatus: ChartStatus = widgetMode;

  /* ── Controls ── */
  const [rangeId, setRangeId] = useState<RangeId>(initialRange);
  const [customLabel, setCustomLabel] = useState('17 Sep – 30 Sep');
  const range = useMemo(() => {
    const meta = getRange(rangeId);
    return rangeId === 'custom' ? { ...meta, subtitle: customLabel } : meta;
  }, [rangeId, customLabel]);
  const [site, setSite] = useState(useCase.site);
  const [userCollapsed, setUserCollapsed] = useState(state === 'collapsed');
  const [live, setLive] = useState(true);
  const [tableQuery, setTableQuery] = useState('');
  const [cameraRequest, setCameraRequest] = useState<CameraOpenRequest | null>(null);
  const [mainStatus, setMainStatus] = useState<ChartStatus>(state === 'partial-error' ? 'error' : widgetStatus);

  const searchRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  /* ── Live updates (every 30 s, deterministic) ── */
  const [tick, setTick] = useState(0);
  const liveActive = live && !loading && !empty;
  useEffect(() => {
    if (!liveActive) return;
    const t = window.setInterval(() => setTick((n) => n + 1), REFRESH_MS);
    return () => window.clearInterval(t);
  }, [liveActive]);

  const [alerts, setAlerts] = useState<DashAlert[]>(() => (loading || empty ? [] : initialAlerts(useCase.id, critical)));
  useEffect(() => {
    if (tick === 0) return;
    setAlerts((prev) => [alertForTick(useCase.id, tick), ...prev.map((a) => ({ ...a, minutesAgo: a.minutesAgo + 0.5 }))].slice(0, 8));
  }, [tick, useCase.id]);

  const kpis = useMemo(() => getKpis(useCase.id, { range, tick, degraded }), [useCase.id, range, tick, degraded]);
  const kpiLabels = useMemo(() => getKpiLabels(useCase.id), [useCase.id]);
  const cameras = useMemo(() => getCameras(useCase.id, useCase.scene), [useCase]);
  const events = useMemo(() => getEvents(useCase.id), [useCase.id]);

  // One polite announcement per live tick (at most every 30 seconds).
  const [liveMessage, setLiveMessage] = useState('');
  useEffect(() => {
    if (tick === 0) return;
    const first = kpis[0];
    setLiveMessage(`Dashboard updated. ${first.label}: ${first.value}. New alert: ${alertForTick(useCase.id, tick).title}.`);
  }, [tick]); // Announce on ticks only, so it stays throttled to once per 30 seconds.

  /* ── Critical alert ── */
  const criticalInfo = CRITICAL_ALERTS[useCase.id];
  const criticalAlert = alerts.find((a) => a.severity === 'critical' && !a.acknowledged);
  const unread = alerts.filter((a) => !a.acknowledged).length;

  useEffect(() => {
    if (critical) showToast(`Critical: ${criticalInfo.banner}`, 'critical', 8000);
  }, []); // Once, when the Critical alert state opens.

  const acknowledge = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  }, []);

  /* ── Handlers ── */
  const onSearch = (q: string) => {
    setTableQuery(q);
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const retryMain = () => {
    setMainStatus('loading');
    timers.current.push(window.setTimeout(() => setMainStatus('ready'), 1200));
  };

  const focusRange = () => rangeRef.current?.querySelector('button')?.focus();

  // Ctrl/Cmd + K focuses the search on the full-screen route (inside the docs it opens the docs search).
  useEffect(() => {
    if (!fillViewport) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fillViewport]);

  const A = (n: number, inset = false) => <AnatomyMarker n={n} show={showAnatomy} inset={inset} />;
  const mainChartStatus: ChartStatus = state === 'partial-error' ? mainStatus : widgetStatus;

  return (
    <div className={`@container w-full ${fillViewport ? 'h-screen' : 'h-full'}`}>
      <AppShell
        useCase={useCase}
        userCollapsed={userCollapsed}
        onToggleCollapsed={() => setUserCollapsed((c) => !c)}
        searchRef={searchRef}
        onSearch={onSearch}
        site={site}
        onSiteChange={setSite}
        live={live}
        onToggleLive={() => setLive((l) => !l)}
        alerts={alerts}
        unread={unread}
        signOutHref={`${LOGIN_PREVIEW_PATH}?usecase=${useCase.id}`}
        newTab={!fillViewport}
        anatomy={{ sidebar: A(1, true), topBar: A(2, true) }}
        landmarkMain={fillViewport}
      >
        <div className="mx-auto max-w-[1440px] p-4 @min-[768px]:p-6 @min-[1280px]:p-8">
          <div className="grid grid-cols-12 gap-6">
            <PageHeader
              useCase={useCase}
              site={site}
              updated={tick > 0 ? 'Updated just now' : 'Updated 2 min ago'}
              range={rangeId}
              customLabel={customLabel}
              onRangeChange={(id, label) => {
                setRangeId(id);
                if (label) setCustomLabel(label);
              }}
              onExport={() => showToast(`Preparing ${range.subtitle.toLowerCase()} report…`, 'info')}
              onPrimary={() => showToast(`${useCase.primaryAction.label} opened`, 'info')}
              rangeRef={rangeRef}
              anatomy={A(3)}
            />

            {critical && criticalAlert && (
              <CriticalBanner
                message={criticalInfo.banner}
                time={relativeTime(criticalAlert.minutesAgo)}
                onView={() => setCameraRequest({ id: criticalInfo.camera, trigger: document.activeElement as HTMLElement, n: Date.now() })}
                onAcknowledge={() => acknowledge(criticalAlert.id)}
                anatomy={A(4)}
              />
            )}
            {empty && (
              <div className="relative col-span-12">
                {A(4)}
                <InfoAlert icon={Info}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p>Your cameras are connected. Data will appear here as soon as the first events are recorded.</p>
                    <a href="#setup" onClick={(e) => e.preventDefault()} className={BUTTON.secondarySm}>
                      View setup guide
                    </a>
                  </div>
                </InfoAlert>
              </div>
            )}
            {degraded && (
              <div className="relative col-span-12" role="status">
                {A(4)}
                <InfoAlert icon={WifiOff}>2 cameras are offline. Some data may be incomplete.</InfoAlert>
              </div>
            )}

            <KpiRow mode={widgetMode} kpis={kpis} labels={kpiLabels} anatomy={A(5)} />

            <MainTrendCard
              useCase={useCase}
              range={range}
              status={mainChartStatus}
              onRetry={retryMain}
              onChangeRange={focusRange}
              className="col-span-12 @min-[1280px]:col-span-8"
              anatomy={A(6)}
            />
            <LiveAlertsCard
              alerts={alerts}
              mode={widgetMode}
              onAcknowledge={acknowledge}
              className="col-span-12 @min-[1280px]:col-span-4"
              anatomy={A(7)}
            />

            <LiveCamerasCard
              cameras={cameras}
              offline={offlineIndexes(degraded)}
              mode={widgetMode}
              openRequest={cameraRequest}
              className="col-span-12 @min-[1280px]:col-span-8"
              anatomy={A(8)}
            />
            <SystemHealthCard
              degraded={degraded}
              status={loading ? 'loading' : 'ready'}
              className="col-span-12 @min-[1280px]:col-span-4"
              anatomy={A(9)}
            />

            <InsightsRow useCase={useCase} range={range} status={widgetStatus} onChangeRange={focusRange} anatomy={A(10)} />

            <div ref={tableRef} className="col-span-12 scroll-mt-6">
              <RecentEventsTable table={events} mode={widgetMode} externalQuery={tableQuery} anatomy={A(11)} />
            </div>

            <footer className="col-span-12 text-[12px] leading-[16px] text-[#6B7485]">
              VisionEdge v1.0.0 · Data refreshes every 30 seconds · All times IST
            </footer>
          </div>
        </div>
      </AppShell>
      <div className="sr-only" aria-live="polite">
        {liveMessage}
      </div>
    </div>
  );
};
