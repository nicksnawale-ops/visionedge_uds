import React, { useState } from 'react';
import { DashboardScreen } from './DashboardScreen';
import { DashboardStateId, isDashboardState } from './dashboardStates';
import { RangeId, UseCaseId, getDashboardUseCase, getRange } from './data/useCases';
import { useDocumentTitle } from '../shared/DemoHint';

interface RouteParams {
  state: DashboardStateId;
  useCase: UseCaseId;
  range: RangeId;
}

/** ?usecase=<id>&state=<id>&range=today|7d|30d|custom — defaults: generic, default, today. */
const readParams = (): RouteParams => {
  const params = new URLSearchParams(window.location.search);
  const state = params.get('state');
  return {
    state: isDashboardState(state) ? state : 'default',
    useCase: getDashboardUseCase(params.get('usecase')).id,
    range: getRange(params.get('range')).id,
  };
};

/** Full-screen route: only the product dashboard, no design-system sidebar or top bar. Sample data only. */
const DashboardPreviewRoute: React.FC = () => {
  const [params] = useState(readParams);
  useDocumentTitle(`Dashboard · ${getDashboardUseCase(params.useCase).productName} · VisionEdge`);

  return <DashboardScreen state={params.state} useCase={params.useCase} range={params.range} fillViewport />;
};

export default DashboardPreviewRoute;
