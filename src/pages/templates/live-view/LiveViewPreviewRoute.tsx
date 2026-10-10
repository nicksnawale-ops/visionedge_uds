import React, { useState } from 'react';
import { LiveViewScreen } from './LiveViewScreen';
import { LayoutId, LiveStateId, Surface, isLayout, isLiveState, isSurface } from './liveViewStates';
import { UseCaseId, getLiveUseCase } from './useCases';
import { useDocumentTitle } from '../shared/DemoHint';

interface RouteParams {
  state: LiveStateId;
  useCase: UseCaseId;
  layout: LayoutId;
  surface: Surface;
}

/** ?usecase=&state=&layout=&surface= — defaults: generic, default, 3x3, light. */
const readParams = (): RouteParams => {
  const p = new URLSearchParams(window.location.search);
  const state = p.get('state');
  const layout = p.get('layout');
  const surface = p.get('surface');
  return {
    state: isLiveState(state) ? state : 'default',
    useCase: getLiveUseCase(p.get('usecase')).id,
    layout: isLayout(layout) ? layout : '3x3',
    surface: isSurface(surface) ? surface : 'light',
  };
};

/** Full-screen route: only the product live view, no design-system sidebar or top bar. Sample data only. */
const LiveViewPreviewRoute: React.FC = () => {
  const [params] = useState(readParams);
  useDocumentTitle(`Live view · ${getLiveUseCase(params.useCase).shell.productName} · VisionEdge`);
  return <LiveViewScreen state={params.state} useCase={params.useCase} layout={params.layout} surface={params.surface} fillViewport />;
};

export default LiveViewPreviewRoute;
