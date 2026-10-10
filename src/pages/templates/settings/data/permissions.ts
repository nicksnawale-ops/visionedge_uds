/** Permission matrix: permissions grouped by area × the six roles. Administrator is always full. */

export const ROLE_COLUMNS = ['Administrator', 'Security supervisor', 'Hostel warden', 'Canteen manager', 'Operator', 'Viewer'] as const;
export type RoleName = (typeof ROLE_COLUMNS)[number];

export interface PermissionGroup {
  label: string;
  permissions: { id: string; label: string }[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    label: 'Monitoring',
    permissions: [
      { id: 'live', label: 'View live cameras' },
      { id: 'recordings', label: 'View recordings' },
      { id: 'export', label: 'Export data' },
    ],
  },
  {
    label: 'Alerts',
    permissions: [
      { id: 'watchlist', label: 'Manage watchlist' },
      { id: 'ack', label: 'Acknowledge alerts' },
      { id: 'rules', label: 'Manage alert rules' },
    ],
  },
  {
    label: 'Administration',
    permissions: [
      { id: 'cameras', label: 'Manage cameras' },
      { id: 'users', label: 'Manage users' },
      { id: 'settings', label: 'Change settings' },
    ],
  },
];

export type PermissionMatrix = Record<string, Record<RoleName, boolean>>;

const GRANTS: Record<Exclude<RoleName, 'Administrator'>, string[]> = {
  'Security supervisor': ['live', 'recordings', 'export', 'watchlist', 'ack', 'rules'],
  'Hostel warden': ['live', 'recordings', 'ack'],
  'Canteen manager': ['live', 'export', 'ack'],
  Operator: ['live', 'recordings', 'ack'],
  Viewer: ['live'],
};

export const defaultMatrix = (): PermissionMatrix =>
  Object.fromEntries(
    PERMISSION_GROUPS.flatMap((g) => g.permissions).map((p) => [
      p.id,
      Object.fromEntries(ROLE_COLUMNS.map((r) => [r, r === 'Administrator' || GRANTS[r].includes(p.id)])) as Record<RoleName, boolean>,
    ])
  );
