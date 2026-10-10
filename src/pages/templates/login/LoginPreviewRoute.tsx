import React, { useState } from 'react';
import { LoginScreen } from './LoginScreen';
import { COPY, LOGIN_STATES, LoginStateId } from './loginStates';
import { BackgroundStyle, UseCaseId, defaultBackgroundStyle, getUseCase, isBackgroundStyle } from './backgrounds';
import { DemoHint, useDocumentTitle } from '../shared/DemoHint';

interface RouteParams {
  state: LoginStateId;
  useCase: UseCaseId;
  background: BackgroundStyle;
}

/**
 * ?state=<id>&usecase=<id>&bg=illustration|photo
 * Defaults: default state, generic use case, photo when configured (falls back to illustration).
 */
const readParams = (): RouteParams => {
  const params = new URLSearchParams(window.location.search);
  const state = LOGIN_STATES.find((s) => s.id === params.get('state'))?.id ?? 'default';
  const useCase = getUseCase(params.get('usecase'));
  const bg = params.get('bg');
  return { state, useCase: useCase.id, background: isBackgroundStyle(bg) ? bg : defaultBackgroundStyle(useCase) };
};

/** Full-screen route: only the login screen, no sidebar or top bar. Demo flow, no real authentication. */
const LoginPreviewRoute: React.FC = () => {
  const [params] = useState(readParams);
  useDocumentTitle('Sign in · VisionEdge');

  return (
    <>
      <LoginScreen state={params.state} useCase={params.useCase} background={params.background} fillViewport />
      <DemoHint text={COPY.demoHint} />
    </>
  );
};

export default LoginPreviewRoute;
