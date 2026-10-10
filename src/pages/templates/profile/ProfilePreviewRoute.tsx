import React, { useState } from 'react';
import { ProfileScreen } from './ProfileScreen';
import { ProfileStateId, SectionId, ViewerMode, getProfileState, isProfileState, isSectionId, isViewerMode, viewerForState } from './profileStates';
import { PROFILE_SHELL } from './profileShell';
import { useDocumentTitle } from '../shared/DemoHint';

interface RouteParams {
  state: ProfileStateId;
  section: SectionId;
  viewer: ViewerMode;
}

/** ?state=<id>&section=<id>&viewer=self|admin — defaults: default, the state's section, self. Always the Generic shell. */
const readParams = (): RouteParams => {
  const params = new URLSearchParams(window.location.search);
  const state = params.get('state');
  const section = params.get('section');
  const viewer = params.get('viewer');
  const resolvedState: ProfileStateId = isProfileState(state) ? state : 'default';
  return {
    state: resolvedState,
    section: isSectionId(section) ? section : getProfileState(resolvedState).section,
    viewer: viewerForState(resolvedState, isViewerMode(viewer) ? viewer : 'self'),
  };
};

/** Full-screen route: only the product profile screen, no design-system sidebar or top bar. Sample data only. */
const ProfilePreviewRoute: React.FC = () => {
  const [params] = useState(readParams);
  useDocumentTitle(`${params.viewer === 'self' ? 'My profile' : 'Rahul Mehta'} · ${PROFILE_SHELL.productName} · VisionEdge`);

  return <ProfileScreen state={params.state} section={params.section} viewer={params.viewer} fillViewport />;
};

export default ProfilePreviewRoute;
