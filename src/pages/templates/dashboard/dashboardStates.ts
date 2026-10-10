/** Dashboard template states, as offered in the showcase and via ?state= on the full-screen route. */

export { DASHBOARD_PAGE_PATH, DASHBOARD_PREVIEW_PATH } from './paths';

export type DashboardStateId = 'default' | 'loading' | 'empty' | 'partial-error' | 'critical' | 'degraded' | 'collapsed';

export interface DashboardStateMeta {
  id: DashboardStateId;
  label: string;
  /** When this state appears. */
  trigger: string;
  /** One-line description under the showcase and in the States table. */
  behaviour: string;
}

export const DASHBOARD_STATES: DashboardStateMeta[] = [
  {
    id: 'default',
    label: 'Default',
    trigger: 'Normal operation',
    behaviour: 'Every widget has data; KPIs and alerts update every 30 seconds while Live is on.',
  },
  {
    id: 'loading',
    label: 'Loading',
    trigger: 'First load',
    behaviour: 'Every card shows its own skeleton; the layout stays fixed so nothing jumps when data arrives.',
  },
  {
    id: 'empty',
    label: 'Empty',
    trigger: 'New deployment, no events yet',
    behaviour: 'KPIs show "—" with "No data yet", charts show the Empty state, and a banner explains what happens next.',
  },
  {
    id: 'partial-error',
    label: 'Partial error',
    trigger: 'One data source fails',
    behaviour: 'Only the main chart shows the Error state with Retry; every other widget keeps working.',
  },
  {
    id: 'critical',
    label: 'Critical alert',
    trigger: 'An unacknowledged critical alert',
    behaviour: 'Deep Navy banner at the top with actions, a Critical toast and a higher bell count.',
  },
  {
    id: 'degraded',
    label: 'Degraded',
    trigger: '2 cameras offline',
    behaviour: 'Offline tiles in the camera grid, lower system health and an Info banner about incomplete data.',
  },
  {
    id: 'collapsed',
    label: 'Collapsed sidebar',
    trigger: 'User collapses the sidebar',
    behaviour: 'Shell sidebar at 72px with icon tooltips; the content gains the width.',
  },
];

export const isDashboardState = (value: string | null | undefined): value is DashboardStateId =>
  DASHBOARD_STATES.some((s) => s.id === value);

/** Live updates every 30 seconds. */
export const REFRESH_MS = 30_000;
/** Changed-number highlight. */
export const FLASH_MS = 600;
