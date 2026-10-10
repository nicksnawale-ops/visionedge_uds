import React, { useState } from 'react';
import { SettingsScreen } from './SettingsScreen';
import {
  SettingsRole,
  SettingsSectionId,
  SettingsStateId,
  getSettingsState,
  isSettingsRole,
  isSettingsSection,
  isSettingsState,
  roleForState,
} from './settingsStates';
import { SETTINGS_SHELL } from './settingsShell';
import { useDocumentTitle } from '../shared/DemoHint';

interface RouteParams {
  state: SettingsStateId;
  section: SettingsSectionId;
  role: SettingsRole;
}

/** ?state=<id>&section=<id>&role=admin|viewer — defaults: default, the state's section, admin. Always the Generic shell. */
const readParams = (): RouteParams => {
  const params = new URLSearchParams(window.location.search);
  const state = params.get('state');
  const section = params.get('section');
  const role = params.get('role');
  const resolved: SettingsStateId = isSettingsState(state) ? state : 'default';
  return {
    state: resolved,
    section: isSettingsSection(section) ? section : getSettingsState(resolved).section,
    role: roleForState(resolved, isSettingsRole(role) ? role : 'admin'),
  };
};

/** Full-screen route: only the product settings screen. Sample data only. */
const SettingsPreviewRoute: React.FC = () => {
  const [params] = useState(readParams);
  useDocumentTitle(`Settings · ${SETTINGS_SHELL.productName} · VisionEdge`);
  return <SettingsScreen state={params.state} section={params.section} role={params.role} fillViewport />;
};

export default SettingsPreviewRoute;
