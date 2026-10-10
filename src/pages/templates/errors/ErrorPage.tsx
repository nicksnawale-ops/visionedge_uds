import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Clock, Globe, Loader2, Network, Search, Wifi } from 'lucide-react';
import { Logo } from '../../../components/brand/Logo';
import { ToastProvider, useToast } from '../../../components/common/Toast';
import { BTN, BTN_DISABLED, BTN_PRIMARY, BTN_SECONDARY } from '../shared/authUi';
import { AppShell } from '../dashboard/shell/AppShell';
import { initialAlerts } from '../dashboard/data/alerts';
import { getDashboardUseCase } from '../dashboard/data/useCases';
import { AnatomyMarker } from '../dashboard/AnatomyOverlay';
import { ErrorAction, ErrorContext, ErrorType, ErrorTypeId, LINKS, MAINTENANCE, SUPPORT_EMAIL, getErrorType } from './errorTypes';
import { ErrorIllustration } from './illustrations';
import { TechnicalDetails } from './TechnicalDetails';
import { RetryCountdown, formatSeconds, useCountdown } from './RetryCountdown';
import { OfflineStatus, useConnectionEvents } from './OfflineWatcher';

export interface ErrorPageProps {
  type: ErrorTypeId;
  /** Full page (standalone) or In-app (inside the product shell). Types that are Full page only ignore "app". */
  context?: ErrorContext;
  /** Rendered inside the docs showcase: links open a new tab and "Go back" / "Reload" are simulated. */
  embedded?: boolean;
  /** Move focus to the H1 on load (full-screen route). */
  autoFocus?: boolean;
  /** Numbered anatomy markers (reference page). */
  showAnatomy?: boolean;
}

/** Large buttons (48px); full width on mobile, auto from 640px. */
const ACTION = `${BTN} @min-[640px]:w-auto`;

/**
 * Generic error page for every VisionEdge product: illustration, code label, title, message,
 * one Primary action, optional extras and technical details. Calm, on-brand, never blaming.
 */
export const ErrorPage: React.FC<ErrorPageProps> = (props) => (
  <ToastProvider>
    {/* A new type starts fresh (timers, request state). */}
    <ErrorScreen key={`${props.type}-${props.context ?? 'page'}`} {...props} />
  </ToastProvider>
);

const ErrorScreen: React.FC<ErrorPageProps> = ({ type: typeId, context = 'page', embedded = false, autoFocus = false, showAnatomy = false }) => {
  const type = getErrorType(typeId);
  const inApp = context === 'app' && type.contexts.includes('app');
  const marker = (n: number) => <AnatomyMarker n={n} show={showAnatomy} />;

  const content = <ErrorContent type={type} inApp={inApp} embedded={embedded} autoFocus={autoFocus} marker={marker} />;

  if (inApp) return <InAppFrame embedded={embedded}>{content}</InAppFrame>;

  return (
    <div className="@container min-h-full h-full flex flex-col bg-[#F7F9FC] text-[#353D4C] overflow-y-auto">
      <header className="relative self-start m-6 @min-[768px]:m-8">
        {marker(1)}
        <a
          href={LINKS.home}
          {...(embedded ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="inline-flex items-center gap-2 rounded-[8px] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
        >
          <Logo size={32} />
          <span className="text-[16px] font-semibold text-[#121722]">VisionEdge</span>
        </a>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-8">{content}</main>
      <footer className="relative mx-auto mb-6 px-4 text-center text-[12px] leading-[16px] text-[#6B7485]">
        {marker(9)}
        Need help?{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-2 hover:text-[#1E63FF] rounded-[2px] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]">
          {SUPPORT_EMAIL}
        </a>{' '}
        ·{' '}
        <a href="#status" onClick={(e) => e.preventDefault()} className="underline underline-offset-2 hover:text-[#1E63FF] rounded-[2px] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]">
          System status
        </a>{' '}
        · © 2026 VisionEdge
      </footer>
    </div>
  );
};

/** In-app context: the GENERIC product shell (Dashboard template) with no nav item active. */
const InAppFrame: React.FC<{ embedded: boolean; children: React.ReactNode }> = ({ embedded, children }) => {
  const useCase = getDashboardUseCase('generic');
  const alerts = useMemo(() => initialAlerts('generic', false), []);
  const searchRef = useRef<HTMLInputElement>(null);
  const [site, setSite] = useState(useCase.site);
  const [live, setLive] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="@container w-full h-full">
      <AppShell
        useCase={useCase}
        userCollapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        searchRef={searchRef}
        onSearch={() => undefined}
        site={site}
        onSiteChange={setSite}
        live={live}
        onToggleLive={() => setLive((l) => !l)}
        alerts={alerts}
        unread={alerts.length}
        signOutHref={LINKS.signIn}
        newTab={embedded}
        anatomy={{ sidebar: null, topBar: null }}
        landmarkMain={!embedded}
        activeNavId={null}
        contentLabel="Error"
      >
        <div className="min-h-full flex items-center justify-center p-4 @min-[768px]:p-8">{children}</div>
      </AppShell>
    </div>
  );
};

/* ── The centred block ───────────────────────────────────────────── */

interface ContentProps {
  type: ErrorType;
  inApp: boolean;
  embedded: boolean;
  autoFocus: boolean;
  marker: (n: number) => React.ReactNode;
}

const ErrorContent: React.FC<ContentProps> = ({ type, inApp, embedded, autoFocus, marker }) => {
  const { showToast } = useToast();
  const blockRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [live, setLive] = useState('');
  const [busy, setBusy] = useState(false);
  const [requested, setRequested] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [backOnline, setBackOnline] = useState(false);
  const busyTimer = useRef<number | undefined>(undefined);
  const announce = useCallback((m: string) => setLive(m), []);

  // Entrance: fade in and rise 8px over 250ms (none with reduced motion). Focus the H1 on the full-screen route.
  useLayoutEffect(() => {
    if (autoFocus) headingRef.current?.focus({ preventScroll: true });
    const el = blockRef.current;
    if (!el?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 250, easing: 'ease-out' });
  }, [autoFocus]);

  useLayoutEffect(() => () => window.clearTimeout(busyTimer.current), []);

  /* Countdowns: 429 (wait), 503 (auto-retry), maintenance (time left). */
  const countdownSeconds = type.extra === 'maintenance-info' ? MAINTENANCE.remainingSeconds : type.seconds ?? 0;
  const counting = type.extra === 'rate-limit' || type.extra === 'auto-retry' || type.extra === 'maintenance-info';
  const remaining = useCountdown(countdownSeconds, counting && !busy, cycle, () => {
    if (type.extra === 'rate-limit') announce('You can try again now.');
    if (type.extra === 'auto-retry') retry(true);
  });

  /* Offline: listen for the browser's online/offline events (demo only, while mounted). */
  useConnectionEvents(
    () => {
      if (type.extra !== 'offline-status') return;
      setBackOnline(true);
      showToast("You're back online", 'success');
      announce("You're back online. Reload the page to continue.");
    },
    () => {
      if (type.extra !== 'offline-status') return;
      setBackOnline(false);
      announce("You're offline. Waiting for connection.");
    }
  );

  function retry(automatic = false) {
    if (type.extra === 'offline-status') {
      if (navigator.onLine) {
        setBackOnline(true);
        showToast("You're back online", 'success');
        announce("You're back online. Reload the page to continue.");
      } else announce('Still offline. Waiting for connection.');
      return;
    }
    setBusy(true);
    announce(automatic ? 'Retrying…' : 'Trying again…');
    busyTimer.current = window.setTimeout(() => {
      setBusy(false);
      if (type.extra === 'rate-limit') {
        setCycle((c) => c + 1);
        announce('Still too many requests. Please wait a little longer.');
      } else if (type.extra === 'auto-retry') {
        setCycle((c) => c + 1);
        announce(`Still unavailable. Retrying again in ${formatSeconds(type.seconds ?? 20)}.`);
      } else {
        showToast('Still not responding. Please try again in a few minutes.', 'info');
        announce('Still not responding.');
      }
    }, 1200);
  }

  const reload = () => {
    if (embedded) {
      showToast('The page reloads here', 'info');
      return;
    }
    window.location.reload();
  };

  const newTab = embedded ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  const renderAction = (action: ErrorAction, primary: boolean) => {
    const cls = `${ACTION} ${primary ? BTN_PRIMARY : BTN_SECONDARY}`;
    switch (action.kind) {
      case 'dashboard':
        return (
          <a href={LINKS.dashboard} {...newTab} className={cls}>
            {action.label}
          </a>
        );
      case 'sign-in':
        return (
          <a href={LINKS.signIn} {...newTab} className={cls}>
            {action.label}
          </a>
        );
      case 'home':
        return (
          <a href={LINKS.home} {...newTab} className={cls}>
            {action.label}
          </a>
        );
      case 'support':
        return (
          <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`VisionEdge error ${type.status ?? type.label}`)}`} className={cls}>
            {action.label}
          </a>
        );
      case 'back':
        return (
          <button
            type="button"
            className={cls}
            onClick={() => (embedded || window.history.length < 2 ? showToast('Goes back to the previous page', 'info') : window.history.back())}
          >
            {action.label}
          </button>
        );
      case 'request-access':
        return (
          <button
            type="button"
            disabled={requested}
            className={`${ACTION} ${requested ? BTN_DISABLED : cls}`}
            onClick={() => {
              setRequested(true);
              showToast('Access request sent to your administrator', 'success');
              announce('Access request sent.');
            }}
          >
            {requested ? 'Request sent' : action.label}
          </button>
        );
      case 'status':
        return (
          <a href="#status" onClick={(e) => (e.preventDefault(), showToast('Opens the VisionEdge system status page', 'info'))} className={cls}>
            {action.label}
          </a>
        );
      case 'it-support':
        return (
          <a href="#it-support" onClick={(e) => (e.preventDefault(), showToast("Opens your organization's IT helpdesk", 'info'))} className={cls}>
            {action.label}
          </a>
        );
      case 'retry': {
        const waiting = type.extra === 'rate-limit' && remaining > 0;
        if (type.extra === 'offline-status' && backOnline) {
          return (
            <button type="button" onClick={reload} className={`${ACTION} ${BTN_PRIMARY}`}>
              Reload page
            </button>
          );
        }
        return (
          <button
            type="button"
            onClick={() => retry()}
            disabled={waiting}
            aria-disabled={busy || undefined}
            className={`${ACTION} ${waiting ? BTN_DISABLED : busy ? `${BTN_PRIMARY} opacity-90 cursor-wait` : cls} min-w-[148px]`}
          >
            {busy && <Loader2 className="w-4 h-4 motion-safe:animate-spin" aria-hidden="true" />}
            {busy ? 'Trying…' : action.label}
          </button>
        );
      }
    }
  };

  const illustration = inApp ? 160 : 200;

  return (
    <div ref={blockRef} className="w-full max-w-[560px] mx-auto flex flex-col items-center text-center">
      <div className="relative">
        {marker(2)}
        <ErrorIllustration kind={type.illustration} size={illustration} />
      </div>

      <span className="relative mt-6 inline-flex items-center h-6 px-3 rounded-full bg-[#1E63FF]/[0.08] text-[#1E63FF] text-[11px] leading-[16px] font-semibold uppercase tracking-[0.08em]">
        {marker(3)}
        {type.label}
      </span>

      <h1
        ref={headingRef}
        tabIndex={-1}
        className={`relative mt-3 font-semibold text-[#121722] outline-none ${inApp ? 'text-[24px] leading-[32px]' : 'text-[28px] leading-[36px]'}`}
      >
        {marker(4)}
        {type.title}
      </h1>

      <p className="relative mt-3 text-[16px] leading-[24px] text-[#4B5465] max-w-[480px]">
        {marker(5)}
        {type.message}
      </p>

      {(type.primary || type.secondary) && (
        <div className="relative mt-8 w-full flex flex-col @min-[640px]:flex-row @min-[640px]:justify-center gap-3">
          {marker(6)}
          {type.primary && renderAction(type.primary, true)}
          {type.secondary && renderAction(type.secondary, false)}
        </div>
      )}

      {type.extra && (
        <div className="relative mt-8 w-full flex justify-center">
          {marker(7)}
          <Extra type={type} remaining={remaining} busy={busy} backOnline={backOnline} onSearch={(q) => showToast(q ? `Search for "${q}" opens in the full product` : 'Type something to search', 'info')} />
        </div>
      )}

      {type.details && (
        <div className="relative mt-8 w-full">
          {marker(8)}
          <TechnicalDetails code={type.status ? String(type.status) : type.label.toUpperCase()} path={type.path} />
        </div>
      )}

      <div className="sr-only" aria-live="polite">
        {live}
      </div>
    </div>
  );
};

/* ── Extras ──────────────────────────────────────────────────────── */

const Extra: React.FC<{ type: ErrorType; remaining: number; busy: boolean; backOnline: boolean; onSearch: (q: string) => void }> = ({ type, remaining, busy, backOnline, onSearch }) => {
  const [query, setQuery] = useState('');
  switch (type.extra) {
    case 'search':
      return (
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            onSearch(query.trim());
          }}
          className="relative w-full max-w-[400px]"
        >
          <label htmlFor="error-search" className="sr-only">
            Search VisionEdge
          </label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7485] pointer-events-none" aria-hidden="true" />
          <input
            id="error-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search VisionEdge…"
            className="w-full h-11 pl-9 pr-3 rounded-[8px] border border-[#8C95A6] bg-white text-[16px] @min-[640px]:text-[14px] text-[#121722] placeholder:text-[#6B7485] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20"
          />
        </form>
      );
    case 'rate-limit':
      return remaining > 0 ? (
        <RetryCountdown remaining={remaining} total={type.seconds ?? 30} prefix="You can try again in" />
      ) : (
        <p className="text-[14px] text-[#353D4C]">You can try again now.</p>
      );
    case 'auto-retry':
      return busy ? (
        <p className="text-[14px] text-[#353D4C]">Retrying…</p>
      ) : (
        <RetryCountdown remaining={remaining} total={type.seconds ?? 20} prefix="Retrying in" suffix="…" progress />
      );
    case 'maintenance-info':
      return (
        <dl className="w-full max-w-[400px] rounded-[12px] bg-[#F7F9FC] border border-[#DDE2EA] p-4 grid grid-cols-3 gap-3 text-left">
          {(
            [
              ['Started', MAINTENANCE.started],
              ['Expected back', MAINTENANCE.expected],
              ['Time left', formatSeconds(remaining)],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">{k}</dt>
              <dd className={`mt-0.5 text-[14px] text-[#121722] ${k === 'Time left' ? 'font-mono tabular-nums' : ''}`}>{v}</dd>
            </div>
          ))}
        </dl>
      );
    case 'offline-status':
      return <OfflineStatus back={backOnline} />;
    case 'checklist':
      return (
        <ul className="w-full max-w-[400px] space-y-2 text-left">
          {(
            [
              [Wifi, 'Check your internet connection'],
              [Network, "Check if you're on the campus network or VPN"],
              [Clock, 'Try again in a few minutes'],
            ] as const
          ).map(([Icon, text]) => (
            <li key={text} className="flex items-center gap-3 rounded-[8px] bg-white border border-[#DDE2EA] px-4 h-11 text-[14px] text-[#353D4C]">
              <Icon className="w-4 h-4 shrink-0 text-[#1E63FF]" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      );
    case 'browsers':
      return (
        <ul className="grid grid-cols-2 @min-[480px]:grid-cols-4 gap-3 w-full max-w-[440px]" aria-label="Supported browsers">
          {['Chrome', 'Edge', 'Firefox', 'Safari'].map((b) => (
            <li key={b} className="flex flex-col items-center gap-2 rounded-[8px] bg-white border border-[#DDE2EA] py-3 text-[13px] font-medium text-[#121722]">
              <Globe className="w-6 h-6 text-[#1E63FF]" aria-hidden="true" />
              {b}
              <span className="sr-only"> (latest version)</span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
};
