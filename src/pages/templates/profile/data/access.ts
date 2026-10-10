/** Module access, scopes and assigned cameras per viewer. */
import type { ViewerMode } from '../profileStates';

export type AccessLevel = 'full' | 'read' | 'none';

export const ACCESS_LEVELS: { value: AccessLevel; label: string; description: string }[] = [
  { value: 'full', label: 'Full access', description: 'View, act on alerts and change settings' },
  { value: 'read', label: 'Read only', description: 'View dashboards, logs and reports' },
  { value: 'none', label: 'No access', description: 'Module hidden for this user' },
];

export const accessLabel = (level: AccessLevel): string => ACCESS_LEVELS.find((l) => l.value === level)?.label ?? level;

/** VisionEdge modules a user can be given access to. */
export type ModuleId = 'platform' | 'anpr' | 'hosteltrack' | 'mealpulse' | 'visitor';

export interface ModuleAccess {
  id: ModuleId;
  module: string;
  level: AccessLevel;
  scope: string;
}

const MODULES: { id: ModuleId; module: string; scope: string }[] = [
  { id: 'platform', module: 'Vision Platform', scope: 'All cameras' },
  { id: 'anpr', module: 'ANPR', scope: 'All gates' },
  { id: 'hosteltrack', module: 'HostelTrack', scope: 'Blocks A–C' },
  { id: 'mealpulse', module: 'Meal Pulse', scope: 'Main canteen' },
  { id: 'visitor', module: 'Visitor Management', scope: 'Main entrance' },
];

const LEVELS: Record<ViewerMode, Record<ModuleId, AccessLevel>> = {
  self: { platform: 'full', anpr: 'full', hosteltrack: 'read', mealpulse: 'none', visitor: 'none' },
  admin: { platform: 'none', anpr: 'full', hosteltrack: 'read', mealpulse: 'none', visitor: 'none' },
};

export function getModuleAccess(viewer: ViewerMode): ModuleAccess[] {
  const levels = LEVELS[viewer];
  return MODULES.map((m) => ({ ...m, level: levels[m.id], scope: levels[m.id] === 'none' ? '—' : m.scope }));
}

/** Camera IDs for the "View list" modal: "CAM01-02". */
export const getCameraIds = (count: number): string[] =>
  Array.from({ length: count }, (_, i) => `CAM${String(Math.floor(i / 3) + 1).padStart(2, '0')}-${String((i % 3) + 1).padStart(2, '0')}`);
