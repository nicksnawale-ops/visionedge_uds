/** Conditional reveal, Locked field and Consent checkbox. */
import React, { useLayoutEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import { FieldErrorText, INLINE_LINK, demoLink } from '../../shared/authUi';
import { CHECKBOX } from '../../profile/ui';
import { FieldShell, control } from './FieldShell';

/** Fields that appear when a choice is made: a 150ms fade-and-slide reveal (none with reduced motion). */
export const ConditionalReveal: React.FC<{ show: boolean; children: React.ReactNode }> = ({ show, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!show || !el?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.animate([{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 150, easing: 'ease-out' });
  }, [show]);
  if (!show) return null;
  return (
    <div ref={ref} className="pl-4 border-l-2 border-[#1E63FF]/30 space-y-4">
      {children}
    </div>
  );
};

/** Locked field: read-only value with a Lock icon and the reason in a tooltip. */
export const LockedField: React.FC<{ id: string; label: string; value: string; reason: string; mono?: boolean; overlay?: React.ReactNode }> = ({ id, label, value, reason, mono, overlay }) => (
  <div className="relative">
    {overlay}
    <FieldShell id={id} label={label} locked={reason} helper={reason}>
      <div className="relative">
        <input id={id} value={value} readOnly aria-describedby={`${id}-helper`} className={`${control({ readOnly: true })} pr-10 ${mono ? 'font-mono' : ''}`} />
        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7485] pointer-events-none" aria-hidden="true" />
      </div>
    </FieldShell>
  </div>
);

/** Consent checkbox with inline links; required, so it carries its own error. */
export const ConsentCheckbox: React.FC<{ id: string; checked: boolean; onChange: (v: boolean) => void; error?: string; readOnly?: boolean; children?: React.ReactNode }> = ({ id, checked, onChange, error, readOnly, children }) => (
  <div>
    <label className={`flex items-start gap-3 min-h-[44px] py-1 text-[14px] leading-[20px] text-[#121722] ${readOnly ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={readOnly}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-error`}
        onChange={(e) => onChange(e.target.checked)}
        className={`${CHECKBOX} mt-0.5 ${error ? 'outline-2 outline-[#0B2D6B] outline-offset-1' : ''}`}
      />
      <span>
        {children ?? (
          <>
            I confirm these details are correct and agree to the{' '}
            <a href="#terms" onClick={demoLink} className={INLINE_LINK}>
              Terms of use
            </a>{' '}
            and{' '}
            <a href="#privacy" onClick={demoLink} className={INLINE_LINK}>
              Privacy policy
            </a>
            .
          </>
        )}
      </span>
    </label>
    <div id={`${id}-error`} aria-live="polite">
      {error && <FieldErrorText>{error}</FieldErrorText>}
    </div>
  </div>
);
