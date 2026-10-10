import React from 'react';
import { AuthLayout } from '../shared/AuthLayout';
import { LoginCard } from './LoginCard';
import { LoginForm } from './LoginForm';
import { BackgroundStyle, UseCaseId, getUseCase } from './backgrounds';
import { LoginStateId } from './loginStates';

export interface LoginScreenProps {
  /** State to show; the form is fully interactive from there. */
  state?: LoginStateId;
  /** Called when the user's actions move the form to another state. */
  onStateChange?: (state: LoginStateId) => void;
  /** Product context: chip, subtitle and background scene. */
  useCase?: UseCaseId;
  /** Requested background; "photo" falls back to the illustration when the file is missing. */
  background?: BackgroundStyle;
  /** Full-screen route: fill the browser viewport (min-height 100vh). */
  fillViewport?: boolean;
}

/**
 * VisionEdge sign-in screen: a centered 440px card on a use-case background.
 * AuthLayout provides the background, the "Need help?" link, the footer and the entrance animation.
 */
export const LoginScreen: React.FC<LoginScreenProps> = ({
  state = 'default',
  onStateChange,
  useCase: useCaseId = 'generic',
  background,
  fillViewport = false,
}) => {
  const useCase = getUseCase(useCaseId);

  return (
    <AuthLayout useCase={useCase} background={background} fillViewport={fillViewport} cardWidth={440}>
      <LoginCard useCase={useCase}>
        <LoginForm state={state} onStateChange={onStateChange} productName={useCase.productName} />
      </LoginCard>
    </AuthLayout>
  );
};
