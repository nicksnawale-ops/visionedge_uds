import React, { useEffect, useRef, useState } from 'react';
import { ChartCard } from './ChartCard';
import { ChartState, ChartStatus } from './ChartState';

type StateSlot = 'loading' | 'empty' | 'error';

const EXAMPLES: { slot: StateSlot; label: string }[] = [
  { slot: 'loading', label: 'Loading' },
  { slot: 'empty', label: 'Empty' },
  { slot: 'error', label: 'Error' },
];

/** Loading / Empty / Error examples for the Charts page. Retry and Change date range replay a short load. */
const ChartStatesDemo: React.FC = () => {
  const [states, setStates] = useState<Record<StateSlot, ChartStatus>>({
    loading: 'loading',
    empty: 'empty',
    error: 'error',
  });
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const replay = (slot: StateSlot) => {
    setStates((s) => ({ ...s, [slot]: 'loading' }));
    timers.current.push(window.setTimeout(() => setStates((s) => ({ ...s, [slot]: slot })), 1200));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {EXAMPLES.map((ex) => (
        <ChartCard key={ex.slot} title="Vehicle entries by gate" subtitle={`${ex.label} state`}>
          <ChartState
            status={states[ex.slot]}
            height={180}
            onRetry={() => replay(ex.slot)}
            onChangeRange={() => replay(ex.slot)}
          />
        </ChartCard>
      ))}
    </div>
  );
};

export default ChartStatesDemo;
