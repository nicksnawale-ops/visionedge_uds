/**
 * Error catalog: one entry per error page. Generic for every VisionEdge product (no use case).
 * Copy is sentence case, plain words, no blame, with a specific next step.
 */

export type ErrorTypeId =
  | '400'
  | '401'
  | '403'
  | '404'
  | '408'
  | '429'
  | '500'
  | '502'
  | '503'
  | '504'
  | 'maintenance'
  | 'offline'
  | 'unreachable'
  | 'unsupported';

/** Full page (standalone, no shell) or In-app (inside the product AppShell). */
export type ErrorContext = 'page' | 'app';

export type ErrorGroup = 'client' | 'server' | 'availability';

export type IllustrationKind =
  | 'not-found'
  | 'forbidden'
  | 'session'
  | 'bad-request'
  | 'request-timeout'
  | 'rate-limit'
  | 'server-error'
  | 'bad-gateway'
  | 'gateway-timeout'
  | 'maintenance'
  | 'offline'
  | 'unreachable'
  | 'unsupported';

/** What an action does; ErrorPage turns these into links or handlers. */
export type ErrorActionKind =
  | 'dashboard'
  | 'back'
  | 'retry'
  | 'request-access'
  | 'sign-in'
  | 'home'
  | 'support'
  | 'status'
  | 'it-support';

export interface ErrorAction {
  label: string;
  kind: ErrorActionKind;
}

/** Template-specific content under the actions. */
export type ErrorExtra = 'search' | 'rate-limit' | 'auto-retry' | 'maintenance-info' | 'offline-status' | 'checklist' | 'browsers';

export interface ErrorType {
  id: ErrorTypeId;
  /** HTTP status, if there is one. */
  status: number | null;
  /** Overline label in the pill. */
  label: string;
  /** Short chip label in the showcase. */
  chip: string;
  group: ErrorGroup;
  title: string;
  message: string;
  primary?: ErrorAction;
  secondary?: ErrorAction;
  illustration: IllustrationKind;
  extra?: ErrorExtra;
  /** "Technical details" disclosure (not for 404 or Offline). */
  details: boolean;
  /** The page retries on its own. */
  autoRetry: boolean;
  contexts: ErrorContext[];
  /** When the page is shown (catalog, showcase description). */
  when: string;
  /** Path shown in the browser frame and the technical details. */
  path: string;
  /** Seconds for the countdown extras. */
  seconds?: number;
}

const DASHBOARD: ErrorAction = { label: 'Go to dashboard', kind: 'dashboard' };
const BACK: ErrorAction = { label: 'Go back', kind: 'back' };
const RETRY: ErrorAction = { label: 'Try again', kind: 'retry' };
const STATUS: ErrorAction = { label: 'Check system status', kind: 'status' };
const BOTH: ErrorContext[] = ['page', 'app'];
const PAGE: ErrorContext[] = ['page'];

export const ERROR_TYPES: ErrorType[] = [
  {
    id: '400',
    status: 400,
    label: 'Error 400',
    chip: '400',
    group: 'client',
    title: "Something's wrong with this request",
    message: 'The link may be broken or incomplete. Check the address and try again.',
    primary: DASHBOARD,
    secondary: BACK,
    illustration: 'bad-request',
    details: true,
    autoRetry: false,
    contexts: BOTH,
    when: 'A link or form sends a malformed request, e.g. a truncated report link.',
    path: '/reports/export?range=',
  },
  {
    id: '401',
    status: 401,
    label: 'Error 401',
    chip: '401',
    group: 'client',
    title: 'Your session has expired',
    message: 'For your security, you were signed out after a period of inactivity. Sign in again to continue.',
    primary: { label: 'Sign in again', kind: 'sign-in' },
    secondary: { label: 'Go to homepage', kind: 'home' },
    illustration: 'session',
    details: true,
    autoRetry: false,
    contexts: PAGE,
    when: 'The session token expired (30 minutes of inactivity) or was revoked.',
    path: '/live-view',
  },
  {
    id: '403',
    status: 403,
    label: 'Error 403',
    chip: '403',
    group: 'client',
    title: "You don't have access to this page",
    message: "Your role doesn't include permission to view this content. Contact your administrator if you need access.",
    primary: { label: 'Request access', kind: 'request-access' },
    secondary: DASHBOARD,
    illustration: 'forbidden',
    details: true,
    autoRetry: false,
    contexts: BOTH,
    when: "A signed-in user opens a page their role can't see, e.g. Settings as an Operator.",
    path: '/settings/users',
  },
  {
    id: '404',
    status: 404,
    label: 'Error 404',
    chip: '404',
    group: 'client',
    title: 'Page not found',
    message: "The page you're looking for doesn't exist or has been moved.",
    primary: DASHBOARD,
    secondary: BACK,
    illustration: 'not-found',
    extra: 'search',
    details: false,
    autoRetry: false,
    contexts: BOTH,
    when: 'The address matches no page: an old bookmark, a typo or a deleted record.',
    path: '/vehicles/unknown-page',
  },
  {
    id: '408',
    status: 408,
    label: 'Error 408',
    chip: '408',
    group: 'client',
    title: 'The request took too long',
    message: "The server didn't respond in time. This is usually temporary.",
    primary: RETRY,
    secondary: BACK,
    illustration: 'request-timeout',
    details: true,
    autoRetry: false,
    contexts: BOTH,
    when: 'The browser gave up waiting, e.g. a large export on a slow connection.',
    path: '/reports/vehicle-log',
  },
  {
    id: '429',
    status: 429,
    label: 'Error 429',
    chip: '429',
    group: 'client',
    title: 'Too many requests',
    message: "You've made a lot of requests in a short time. Please wait a moment before trying again.",
    primary: RETRY,
    illustration: 'rate-limit',
    extra: 'rate-limit',
    details: true,
    autoRetry: false,
    contexts: BOTH,
    when: 'Rate limit reached, e.g. repeated searches or exports within a minute.',
    path: '/vehicles/search',
    seconds: 30,
  },
  {
    id: '500',
    status: 500,
    label: 'Error 500',
    chip: '500',
    group: 'server',
    title: 'Something went wrong on our side',
    message: "We've been notified and are working on it. Please try again in a few minutes.",
    primary: RETRY,
    secondary: { label: 'Contact support', kind: 'support' },
    illustration: 'server-error',
    details: true,
    autoRetry: false,
    contexts: BOTH,
    when: 'An unexpected server error while loading a page or saving.',
    path: '/vehicles/log',
  },
  {
    id: '502',
    status: 502,
    label: 'Error 502',
    chip: '502',
    group: 'server',
    title: "We can't reach the VisionEdge server",
    message: 'A connection problem between our servers stopped this page from loading.',
    primary: RETRY,
    secondary: STATUS,
    illustration: 'bad-gateway',
    details: true,
    autoRetry: false,
    contexts: PAGE,
    when: 'The proxy got no valid answer from the app server (deploy, crash).',
    path: '/dashboard',
  },
  {
    id: '503',
    status: 503,
    label: 'Error 503',
    chip: '503',
    group: 'server',
    title: 'VisionEdge is temporarily unavailable',
    message: "The service is overloaded or restarting. We'll be back shortly.",
    primary: { label: 'Try now', kind: 'retry' },
    secondary: STATUS,
    illustration: 'maintenance',
    extra: 'auto-retry',
    details: true,
    autoRetry: true,
    contexts: PAGE,
    when: 'The app is overloaded or restarting; retries every 20 seconds.',
    path: '/dashboard',
    seconds: 20,
  },
  {
    id: '504',
    status: 504,
    label: 'Error 504',
    chip: '504',
    group: 'server',
    title: 'The server took too long to respond',
    message: 'This is usually temporary. Try again in a moment.',
    primary: RETRY,
    secondary: STATUS,
    illustration: 'gateway-timeout',
    details: true,
    autoRetry: false,
    contexts: PAGE,
    when: 'The proxy timed out waiting for the app server.',
    path: '/reports/monthly',
  },
  {
    id: 'maintenance',
    status: 503,
    label: 'Maintenance',
    chip: 'Maintenance',
    group: 'availability',
    title: "We're improving VisionEdge",
    message: 'Scheduled maintenance is in progress. Live monitoring and recordings continue on your edge devices.',
    secondary: STATUS,
    illustration: 'maintenance',
    extra: 'maintenance-info',
    details: true,
    autoRetry: true,
    contexts: PAGE,
    when: 'During a scheduled maintenance window, announced in advance.',
    path: '/dashboard',
  },
  {
    id: 'offline',
    status: null,
    label: 'No connection',
    chip: 'Offline',
    group: 'availability',
    title: "You're offline",
    message: "Check your internet connection. We'll reconnect automatically when you're back online.",
    primary: RETRY,
    illustration: 'offline',
    extra: 'offline-status',
    details: false,
    autoRetry: true,
    contexts: PAGE,
    when: 'The browser reports no network; reconnects on the online event.',
    path: '/live-view',
  },
  {
    id: 'unreachable',
    status: null,
    label: "Can't connect",
    chip: 'Unreachable',
    group: 'availability',
    title: "We can't connect to VisionEdge",
    message: "The server isn't responding. It may be down or your network may be blocking it.",
    primary: RETRY,
    secondary: { label: 'Contact IT support', kind: 'it-support' },
    illustration: 'unreachable',
    extra: 'checklist',
    details: true,
    autoRetry: false,
    contexts: PAGE,
    when: 'The network is up but the server never answers (firewall, VPN, DNS).',
    path: '/dashboard',
  },
  {
    id: 'unsupported',
    status: null,
    label: 'Browser not supported',
    chip: 'Unsupported browser',
    group: 'availability',
    title: "Your browser isn't supported",
    message: 'For security and live video, use the latest version of Chrome, Edge, Firefox or Safari.',
    illustration: 'unsupported',
    extra: 'browsers',
    details: true,
    autoRetry: false,
    contexts: PAGE,
    when: 'An outdated browser without the features live video needs.',
    path: '/',
  },
];

export const ERROR_GROUPS: { id: ErrorGroup; label: string }[] = [
  { id: 'client', label: 'Client errors' },
  { id: 'server', label: 'Server errors' },
  { id: 'availability', label: 'Availability' },
];

export const getErrorType = (id: string | null | undefined): ErrorType => ERROR_TYPES.find((e) => e.id === id) ?? ERROR_TYPES[3];
export const isErrorType = (value: string | null | undefined): value is ErrorTypeId => ERROR_TYPES.some((e) => e.id === value);
export const isErrorContext = (value: string | null | undefined): value is ErrorContext => value === 'page' || value === 'app';

/** Fixed demo values for "Technical details". */
export const DEMO_DETAILS = { requestId: 'req_7f3a9c21', time: '30 Sep 2026, 14:05:32 IST' };

/** Demo maintenance window: started 02:00, back 04:00 IST; the demo "now" is 02:41:12. */
export const MAINTENANCE = { started: '02:00 IST', expected: '04:00 IST', remainingSeconds: 78 * 60 + 48 };

export const SUPPORT_EMAIL = 'support@visionedge.ai';

/** Routes this template links to. */
export const LINKS = {
  dashboard: '/templates/dashboard/preview',
  signIn: '/templates/login/preview?state=session-expired',
  home: '/',
};
