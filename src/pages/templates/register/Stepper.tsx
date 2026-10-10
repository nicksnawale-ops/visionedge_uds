import React from 'react';
import { Check } from 'lucide-react';
import { COPY, STEPS, StepNumber } from './registerStates';

interface StepperProps {
  current: StepNumber | number;
  /** Steps shown as completed (e.g. 1 and 2 when an invitation skips to Security). */
  completed: (StepNumber | number)[];
  /** Custom steps for other flows. Default: the 3 registration steps. */
  steps?: { n: number; label: string }[];
  /** Accessible name of the progress nav. Default "Registration progress". */
  ariaLabel?: string;
}

/**
 * Compact step progress: 24px circles + 12px Medium labels joined by 1px lines.
 * Below 768px the labels are visually hidden and "Step n of N" is shown instead.
 */
export const Stepper: React.FC<StepperProps> = ({ current, completed, steps = STEPS, ariaLabel = 'Registration progress' }) => (
  <nav aria-label={ariaLabel} className="mb-6">
    <ol className="flex items-center">
      {steps.map((step, i) => {
        const done = completed.includes(step.n);
        const isCurrent = step.n === current;
        const circle = done || isCurrent
          ? 'bg-[#1E63FF] text-white'
          : 'bg-white border border-[#8C95A6] text-[#6B7485]';
        const label = isCurrent ? 'text-[#121722]' : done ? 'text-[#353D4C]' : 'text-[#6B7485]';
        const status = done ? 'completed' : isCurrent ? 'current step' : 'not started';

        return (
          <li
            key={step.n}
            className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <span className="flex items-center gap-2 shrink-0">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-semibold tabular-nums ${circle}`}
                aria-hidden="true"
              >
                {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : step.n}
              </span>
              <span className={`sr-only @min-[768px]:not-sr-only text-[12px] leading-[16px] font-medium ${label}`}>
                {step.label}
              </span>
              <span className="sr-only">, {status}</span>
            </span>
            {i < steps.length - 1 && (
              <span className={`flex-1 h-px mx-3 ${done ? 'bg-[#1E63FF]' : 'bg-[#C3CAD5]'}`} aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
    <p className="mt-2 text-[12px] leading-[16px] font-medium text-[#4B5465] @min-[768px]:sr-only">
      {steps === STEPS ? COPY.stepOf(current) : `Step ${current} of ${steps.length}`}
    </p>
  </nav>
);
