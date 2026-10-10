import React from 'react';
import { AuthLayout } from '../shared/AuthLayout';
import { BackgroundStyle, UseCaseId, getUseCase } from '../login/backgrounds';
import { RegisterCard } from './RegisterCard';
import { RegisterStateId } from './registerStates';

export interface RegisterScreenProps {
  /** State to show; the flow is fully interactive from there. */
  state?: RegisterStateId;
  /** Called when the user's actions move the flow to another state. */
  onStateChange?: (state: RegisterStateId) => void;
  /** Product context: chip, subtitle and background scene. */
  useCase?: UseCaseId;
  /** Requested background; "photo" falls back to the illustration when the file is missing. */
  background?: BackgroundStyle;
  /** Full-screen route: fill the browser viewport (min-height 100vh). */
  fillViewport?: boolean;
}

/**
 * VisionEdge sign-up screen: the same frame as Login (background, help link, footer, entrance)
 * with a 480px card holding a 3-step registration flow.
 */
export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  state = 'step-account',
  onStateChange,
  useCase: useCaseId = 'generic',
  background,
  fillViewport = false,
}) => {
  const useCase = getUseCase(useCaseId);

  return (
    <AuthLayout useCase={useCase} background={background} fillViewport={fillViewport} cardWidth={480}>
      <RegisterCard
        useCase={useCase}
        background={background}
        state={state}
        onStateChange={onStateChange}
        embedded={!fillViewport}
      />
    </AuthLayout>
  );
};
