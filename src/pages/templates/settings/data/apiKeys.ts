/** API keys: stored keys are only ever shown masked. A new key is shown once, at creation. */

export interface ApiKey {
  id: string;
  name: string;
  /** Last 4 characters; the rest is never stored in the UI. */
  last4: string;
  scopes: string[];
  created: string;
  lastUsed: string;
}

export const API_SCOPES = [
  { value: 'events:read', label: 'Read events' },
  { value: 'alerts:write', label: 'Create and acknowledge alerts' },
  { value: 'cameras:read', label: 'Read cameras' },
  { value: 'reports:read', label: 'Download reports' },
];

export const INITIAL_KEYS: ApiKey[] = [
  { id: 'k1', name: 'Gate access controller', last4: '3f9a', scopes: ['events:read', 'alerts:write'], created: '12 Mar 2025', lastUsed: '2 min ago' },
  { id: 'k2', name: 'Campus BI export', last4: '81c2', scopes: ['reports:read'], created: '04 Jun 2025', lastUsed: 'Yesterday' },
  { id: 'k3', name: 'Student system sync', last4: 'd07e', scopes: ['events:read', 'cameras:read'], created: '18 Aug 2026', lastUsed: '6 hours ago' },
];

/** "ve_live_••••••••3f9a" (admins) — viewers see no characters at all. */
export const maskKey = (last4: string, fully = false): string => (fully ? 've_live_••••••••••••' : `ve_live_••••••••${last4}`);

/** Deterministic demo key shown once after creation. */
export const NEW_KEY = 've_live_7Qm2Xr9KpL4tVb8NcW3zHs6Df1Gj5a2e';
