import React, { useState } from 'react';
import { FormsScreen } from './FormsScreen';
import { FormStateId, PatternId, getPattern, isFormState, isPattern } from './formStates';
import { useDocumentTitle } from '../shared/DemoHint';

/** ?pattern=single|sectioned|wizard|drawer|modal|edit|import&state=<id> — defaults: single, empty. */
const readParams = (): { pattern: PatternId; state: FormStateId } => {
  const params = new URLSearchParams(window.location.search);
  const pattern = params.get('pattern');
  const state = params.get('state');
  return { pattern: isPattern(pattern) ? pattern : 'single', state: isFormState(state) ? state : 'empty' };
};

/** Full-screen demo route: only the form pattern inside the product shell. Local state only. */
const FormsPreviewRoute: React.FC = () => {
  const [params, setParams] = useState(readParams);
  useDocumentTitle(`${getPattern(params.pattern).label} form · VisionEdge`);
  return (
    <FormsScreen
      pattern={params.pattern}
      state={params.state}
      fillViewport
      onPatternChange={(pattern) => {
        // Keep the address bar in step with "Open full form".
        const url = new URL(window.location.href);
        url.searchParams.set('pattern', pattern);
        window.history.replaceState(null, '', url);
        setParams((p) => ({ ...p, pattern }));
      }}
    />
  );
};

export default FormsPreviewRoute;
