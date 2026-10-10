import React, { useState } from 'react';
import { RegisterScreen } from './RegisterScreen';
import { COPY, RegisterStateId, isRegisterState } from './registerStates';
import { BackgroundStyle, UseCaseId, defaultBackgroundStyle, getUseCase, isBackgroundStyle } from '../login/backgrounds';
import { DemoHint, useDocumentTitle } from '../shared/DemoHint';

interface RouteParams {
  state: RegisterStateId;
  useCase: UseCaseId;
  background: BackgroundStyle;
}

/**
 * ?state=<id>&usecase=<id>&bg=illustration|photo   (?state=invite opens the invitation flow)
 * Defaults: Step 1, generic use case, photo when configured (falls back to illustration).
 */
const readParams = (): RouteParams => {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('state');
  const useCase = getUseCase(params.get('usecase'));
  const bg = params.get('bg');
  return {
    state: isRegisterState(requested) ? requested : 'step-account',
    useCase: useCase.id,
    background: isBackgroundStyle(bg) ? bg : defaultBackgroundStyle(useCase),
  };
};

/** Full-screen route: only the register screen, no sidebar or top bar. Demo flow, no real backend. */
const RegisterPreviewRoute: React.FC = () => {
  const [params] = useState(readParams);
  useDocumentTitle('Create account · VisionEdge');

  return (
    <>
      <RegisterScreen state={params.state} useCase={params.useCase} background={params.background} fillViewport />
      <DemoHint text={COPY.demoHint} />
    </>
  );
};

export default RegisterPreviewRoute;
