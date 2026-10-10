/** Screen state shared by the header, nav, sections, drawers and modals (one source of truth in SettingsScreen). */
import React, { createContext, useContext } from 'react';
import type { SettingsRole, SettingsSectionId, SettingsStateId } from './settingsStates';
import type { SettingValue, SettingValues } from './data/settingsIndex';

export interface SettingsContextValue {
  state: SettingsStateId;
  role: SettingsRole;
  /** Viewer role: everything visible, nothing editable; Primary/Destructive hidden; secrets fully masked. */
  viewOnly: boolean;
  /** Controls are read-only (view-only or while saving). */
  readOnly: boolean;
  section: SettingsSectionId;

  /* Form values (saved via the unsaved-changes bar) */
  values: SettingValues;
  set: (id: string, value: SettingValue) => void;
  /** Row has an unsaved change. */
  isModified: (rowId: string) => boolean;
  /** Errors by row id (shown after a field is touched or on Save). */
  errors: Record<string, string>;
  touch: (rowId: string) => void;

  /** Integration problems (the SMS gateway error can be fixed). */
  smsError: boolean;
  setSmsError: (on: boolean) => void;

  goTo: (section: SettingsSectionId) => void;
  /** Setting the search last jumped to (sections open the right tab or card for it). */
  jumpId: string | null;
  /** Changes on every jump, even to the same setting (a collapsed card opens again). */
  jumpKey: number | null;
  toast: (message: string, type?: 'success' | 'info' | 'critical') => void;
  /** Toast with an Undo button for 5 seconds. */
  undoToast: (message: string, onUndo: () => void) => void;
  announce: (message: string) => void;
  /** Anatomy marker n (reference page). */
  marker: (n: number, inset?: boolean) => React.ReactNode;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);

export function useSettings(): SettingsContextValue {
  const value = useContext(SettingsContext);
  if (!value) throw new Error('useSettings must be used inside SettingsScreen');
  return value;
}
