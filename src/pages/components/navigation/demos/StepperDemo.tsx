import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { FOCUS_LIGHT } from '../shared/navStyles';

export interface Step {
  label: string;
  description?: string;
  optional?: boolean;
}

type StepState = 'completed' | 'current' | 'upcoming' | 'error';

/** 24px circle for each state. */
const Circle: React.FC<{ state: StepState; n: number }> = ({ state, n }) => (
  <span
    aria-hidden="true"
    className={`relative z-[1] w-6 h-6 shrink-0 rounded-full inline-flex items-center justify-center text-[12px] font-semibold ${
      state === 'completed' || state === 'current' ? 'bg-[#1E63FF] text-white' : state === 'error' ? 'bg-[#0B2D6B] text-white' : 'bg-white border border-[#8C95A6] text-[#6B7485]'
    }`}
  >
    {state === 'completed' ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : state === 'error' ? '!' : n}
  </span>
);

const labelClass = (s: StepState) => (s === 'current' || s === 'error' ? 'text-[#121722]' : s === 'completed' ? 'text-[#353D4C]' : 'text-[#6B7485]');
const stateText: Record<Exclude<StepState, 'error'>, string> = { completed: 'completed', current: 'current step', upcoming: 'not started' };

interface StepperProps {
  steps: Step[];
  current: number;
  /** Index of a step that needs attention. */
  errorAt?: number | null;
  onGoTo: (i: number) => void;
  orientation?: 'horizontal' | 'vertical';
  label: string;
}

/**
 * Stepper for sequential processes (max 5 steps). Completed steps are buttons that go back; the current
 * step has aria-current="step"; upcoming steps are plain text. "Step 2 of 4" is announced.
 */
export const Stepper: React.FC<StepperProps> = ({ steps, current, errorAt = null, onGoTo, orientation = 'horizontal', label }) => {
  const list = steps.slice(0, 5);
  const vertical = orientation === 'vertical';
  const stateOf = (i: number): StepState => (i === errorAt ? 'error' : i < current ? 'completed' : i === current ? 'current' : 'upcoming');

  return (
    <nav aria-label={label}>
      <p className="sr-only" aria-live="polite">
        Step {current + 1} of {list.length}: {list[current]?.label}
      </p>
      <ol className={vertical ? 'space-y-0' : 'flex items-start'}>
        {list.map((step, i) => {
          const s = stateOf(i);
          const last = i === list.length - 1;
          const lineDone = i < current;
          const text = (
            <span className={vertical ? 'min-w-0 pb-6' : 'mt-2 block text-center px-1'}>
              <span className={`block text-[12px] font-medium ${labelClass(s)}`}>
                {step.label}
                {step.optional && <span className="font-normal text-[#6B7485]"> (optional)</span>}
              </span>
              {s === 'error' && <span className="block text-[12px] text-[#0B2D6B] font-medium">Needs attention</span>}
              {vertical && step.description && <span className="block mt-0.5 text-[12px] text-[#4B5465]">{step.description}</span>}
              {/* "Needs attention" is already visible text for the error state. */}
              {s !== 'error' && <span className="sr-only">, {stateText[s]}</span>}
            </span>
          );
          const body = (
            <>
              <Circle state={s} n={i + 1} />
              {text}
            </>
          );
          const clickable = s === 'completed' || (s === 'error' && i < current);
          const inner = clickable ? (
            <button
              type="button"
              onClick={() => onGoTo(i)}
              className={`group ${vertical ? 'flex items-start gap-3 text-left' : 'flex flex-col items-center w-full'} rounded-[8px] ${FOCUS_LIGHT}`}
            >
              {body}
            </button>
          ) : (
            <span aria-current={s === 'current' ? 'step' : undefined} className={vertical ? 'flex items-start gap-3' : 'flex flex-col items-center w-full'}>
              {body}
            </span>
          );
          return (
            <li key={step.label} className={`relative ${vertical ? '' : 'flex-1 min-w-0'}`}>
              {!last &&
                (vertical ? (
                  <span aria-hidden="true" className={`absolute left-3 top-6 bottom-0 w-px ${lineDone ? 'bg-[#1E63FF]' : 'bg-[#C3CAD5]'}`} />
                ) : (
                  <span aria-hidden="true" className={`absolute top-3 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-px ${lineDone ? 'bg-[#1E63FF]' : 'bg-[#C3CAD5]'}`} />
                ))}
              {inner}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

const NAV_BTN = `h-10 px-4 rounded-[8px] text-[14px] font-semibold disabled:bg-[#DDE2EA] disabled:text-[#8C95A6] disabled:border-transparent ${FOCUS_LIGHT}`;

const Controls: React.FC<{ current: number; total: number; setCurrent: (n: number) => void }> = ({ current, total, setCurrent }) => (
  <div className="mt-6 flex items-center gap-2">
    <button type="button" disabled={current === 0} onClick={() => setCurrent(current - 1)} className={`${NAV_BTN} bg-white border border-[#1E63FF] text-[#1E63FF] hover:bg-[#F7F9FC]`}>
      Back
    </button>
    <button type="button" disabled={current === total - 1} onClick={() => setCurrent(current + 1)} className={`${NAV_BTN} bg-[#1E63FF] text-white hover:bg-[#0B2D6B]`}>
      Next
    </button>
    <span className="ml-2 text-[12px] text-[#6B7485]" aria-hidden="true">
      Step {current + 1} of {total}
    </span>
  </div>
);

const H_STEPS: Step[] = [{ label: 'Vehicle details' }, { label: 'Access permissions' }, { label: 'Driver RFID pair', optional: true }, { label: 'Confirm and dispatch' }];

export const HorizontalStepperDemo: React.FC = () => {
  const [current, setCurrent] = useState(1);
  const [error, setError] = useState(false);
  return (
    <div>
      <label className="mb-4 inline-flex items-center gap-2 min-h-[44px] text-[14px] text-[#353D4C] cursor-pointer">
        <input type="checkbox" checked={error} onChange={(e) => setError(e.target.checked)} className="w-4 h-4 accent-[#1E63FF]" />
        Step 1 needs attention
      </label>
      <Stepper steps={H_STEPS} current={current} errorAt={error ? 0 : null} onGoTo={setCurrent} label="Vehicle registration progress" />
      <Controls current={current} total={H_STEPS.length} setCurrent={setCurrent} />
    </div>
  );
};

const V_STEPS: Step[] = [
  { label: 'Site details', description: 'Name, address and time zone' },
  { label: 'Add cameras', description: '12 cameras found on the network' },
  { label: 'Gate rules', description: 'Who can enter, and when' },
  { label: 'Notifications', description: 'Email and SMS alerts', optional: true },
  { label: 'Review and go live', description: 'Check everything, then start monitoring' },
];

export const VerticalStepperDemo: React.FC = () => {
  const [current, setCurrent] = useState(2);
  return (
    <div className="max-w-[420px]">
      <Stepper steps={V_STEPS} current={current} onGoTo={setCurrent} orientation="vertical" label="Site setup progress" />
      <Controls current={current} total={V_STEPS.length} setCurrent={setCurrent} />
    </div>
  );
};

/** Static legend of every state. */
export const StepStates: React.FC = () => (
  <ul className="grid grid-cols-2 sm:grid-cols-5 gap-4">
    {(
      [
        ['completed', 'Completed', 'Royal Blue, check'],
        ['current', 'Current', 'Royal Blue, number'],
        ['upcoming', 'Upcoming', 'White, Gray 400 border'],
        ['error', 'Error', 'Deep Navy, "!"'],
        ['upcoming', 'Optional', 'Label + "(optional)"'],
      ] as [StepState, string, string][]
    ).map(([s, name, note], i) => (
      <li key={name} className="flex flex-col items-center text-center gap-1.5">
        <Circle state={s} n={i + 1} />
        <span className="text-[12px] font-medium text-[#121722]">{name}</span>
        <span className="text-[11px] text-[#6B7485]">{note}</span>
      </li>
    ))}
  </ul>
);

export const STEPPER_CODE = `// Stepper: 24px circles, 1px lines, 12px Medium labels; completed steps go back, upcoming are not clickable
<nav aria-label="Vehicle registration progress">
  <p className="sr-only" aria-live="polite">Step 2 of 4: Access permissions</p>
  <ol className="flex items-start">
    <li className="relative flex-1">
      <span aria-hidden="true" className="absolute top-3 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-px bg-[#1E63FF]" />
      <button onClick={() => goTo(0)} className="flex flex-col items-center w-full rounded-[8px]">
        <span aria-hidden="true" className="w-6 h-6 rounded-full bg-[#1E63FF] text-white inline-flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>
        <span className="mt-2 text-[12px] font-medium text-[#353D4C]">Vehicle details<span className="sr-only">, completed</span></span>
      </button>
    </li>
    <li className="relative flex-1">
      <span aria-current="step" className="flex flex-col items-center">
        <span aria-hidden="true" className="w-6 h-6 rounded-full bg-[#1E63FF] text-white text-[12px] font-semibold …">2</span>
        <span className="mt-2 text-[12px] font-medium text-[#121722]">Access permissions</span>
      </span>
    </li>
    {/* upcoming: bg-white border border-[#8C95A6] text-[#6B7485] · error: bg-[#0B2D6B] "!" + "Needs attention" */}
  </ol>
</nav>`;
