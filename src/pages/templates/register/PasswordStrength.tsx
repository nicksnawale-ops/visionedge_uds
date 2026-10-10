import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { COPY, PasswordStrengthResult } from './registerStates';

interface PasswordStrengthProps {
  id: string;
  result: PasswordStrengthResult;
}

/**
 * 4-segment meter (4px high, 4px gap, full radius) with a text label, so strength is never
 * shown by color alone, plus a live requirement checklist.
 */
export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ id, result }) => (
  <div id={id} className="mt-2">
    <div className="flex items-center gap-3">
      <div className="flex-1 grid grid-cols-4 gap-1" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-1 rounded-full transition-colors ${i < result.segments ? 'bg-[#1E63FF]' : 'bg-[#DDE2EA]'}`} />
        ))}
      </div>
      <span className="w-12 text-right text-[12px] leading-[16px] font-medium text-[#353D4C]" aria-live="polite">
        {result.label && (
          <>
            <span className="sr-only">{COPY.strengthLabel}: </span>
            {result.label}
          </>
        )}
      </span>
    </div>

    <ul className="mt-2 space-y-1" aria-label="Password requirements">
      {result.rules.map((rule) => (
        <li
          key={rule.id}
          className={`flex items-center gap-1.5 text-[12px] leading-[16px] ${rule.met ? 'text-[#353D4C]' : 'text-[#4B5465]'}`}
        >
          {rule.met ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#1E63FF]" aria-hidden="true" />
          ) : (
            <Circle className="w-3.5 h-3.5 shrink-0 text-[#8C95A6]" aria-hidden="true" />
          )}
          <span>{rule.label}</span>
          <span className="sr-only">{rule.met ? ', met' : ', not met'}</span>
        </li>
      ))}
    </ul>
  </div>
);
