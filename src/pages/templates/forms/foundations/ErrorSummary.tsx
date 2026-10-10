import React, { useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { labelFor } from './validators';

interface ErrorSummaryProps {
  /** Field keys with errors, in form order. */
  keys: string[];
  errors: Partial<Record<string, string>>;
  /** Maps a field key to the id of its first control. */
  idFor: (key: string) => string;
  /** Changes each submit, so focus moves to the summary every time. */
  attempt: number;
  overlay?: React.ReactNode;
}

/**
 * Critical-style summary after a failed submit: "Fix 3 fields to continue" with a link per field that
 * scrolls to and focuses it. Focus moves to the summary on each failed submit.
 */
export const ErrorSummary: React.FC<ErrorSummaryProps> = ({ keys, errors, idFor, attempt, overlay }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (attempt > 0) ref.current?.focus();
  }, [attempt]);
  if (!keys.length) return null;
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      aria-labelledby="error-summary-title"
      className="relative rounded-[8px] bg-[#0B2D6B] border-l-4 border-l-[#00C6FF] p-4 text-white outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
    >
      {overlay}
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 mt-px shrink-0 text-[#00C6FF]" aria-hidden="true" />
        <div className="min-w-0">
          <h2 id="error-summary-title" className="text-[14px] leading-[20px] font-semibold">
            Fix {keys.length} {keys.length === 1 ? 'field' : 'fields'} to continue
          </h2>
          <ul className="mt-2 space-y-1">
            {keys.map((k) => (
              <li key={k}>
                <a
                  href={`#${idFor(k)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(idFor(k));
                    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
                    el?.focus({ preventScroll: true });
                  }}
                  className="text-[14px] leading-[20px] underline underline-offset-2 hover:text-[#00C6FF] rounded-[2px] outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {labelFor(k)}: {errors[k]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
