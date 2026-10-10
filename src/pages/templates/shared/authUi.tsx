/**
 * Building blocks shared by the auth templates (Login, Register):
 * button and link styles, the 40px text field, inline alerts and the status icon.
 * They follow the Buttons, Links, Form Inputs and Alerts standards.
 */
import React from 'react';
import { AlertCircle, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ── Buttons and links ───────────────────────────────────────────── */

export const BTN =
  'inline-flex items-center justify-center gap-2 w-full h-12 px-6 rounded-[8px] text-[15px] font-semibold whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2';
export const BTN_PRIMARY = 'bg-[#1E63FF] text-white shadow-[0_1px_3px_rgba(30,99,255,0.3)] hover:bg-[#0B2D6B] active:scale-[0.98]';
export const BTN_LOADING = 'bg-[#1E63FF] text-white opacity-90 cursor-wait';
export const BTN_SECONDARY =
  'bg-white text-[#1E63FF] border border-[#1E63FF] shadow-sm hover:bg-[#F7F9FC] hover:text-[#0B2D6B] hover:border-[#0B2D6B]';
export const BTN_GHOST = 'bg-transparent text-[#1E63FF] hover:bg-[#EEF1F6] hover:text-[#0B2D6B]';
export const BTN_DISABLED = 'bg-[#EEF1F6] text-[#8C95A6] border border-[#DDE2EA] shadow-none cursor-not-allowed';

/** Standalone link (Links standard): Royal Blue, Medium, underline on hover. */
export const LINK =
  'inline-flex items-center min-h-[44px] text-[14px] font-medium text-[#1E63FF] rounded-[4px] hover:underline hover:text-[#0B2D6B] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2';

/** Inline link inside running text: underlined Royal Blue. */
export const INLINE_LINK =
  'font-medium text-[#1E63FF] underline underline-offset-2 rounded-[2px] hover:text-[#0B2D6B] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2';

export const ICON = 'w-[18px] h-[18px] shrink-0';

/** Prevents navigation on demo-only links. */
export const demoLink = (e: React.MouseEvent) => e.preventDefault();

/* ── Inputs ──────────────────────────────────────────────────────── */

/** Input border for the normal and error states (Form Inputs standard). */
export const inputBorder = (error: boolean) =>
  error ? 'border-2 border-[#0B2D6B] focus:border-[#0B2D6B]' : 'border border-[#8C95A6] focus:border-[#1E63FF]';

export const INPUT_BASE =
  'w-full h-10 rounded-[8px] text-[16px] @min-[640px]:text-[14px] text-[#121722] placeholder:text-[#6B7485] transition-all focus:outline-none focus:ring-[3px] focus:ring-[#1E63FF]/20 disabled:bg-[#EEF1F6] disabled:text-[#8C95A6] disabled:border-[#DDE2EA] disabled:cursor-not-allowed';

export const LABEL = 'block mb-1.5 text-[14px] leading-[20px] font-medium text-[#121722]';

/** "(optional)" after a label. */
export const OptionalMark: React.FC = () => <span className="font-normal text-[#6B7485]"> (optional)</span>;

/** Error message under a field: alert icon + 12px Medium Deep Navy. */
export const FieldErrorText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mt-1.5 flex items-start gap-1.5 text-[12px] leading-[16px] font-medium text-[#0B2D6B]">
    <AlertCircle className="w-3.5 h-3.5 mt-px shrink-0" aria-hidden="true" />
    {children}
  </p>
);

export interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'> {
  id: string;
  label: string;
  error?: string;
  trailing?: React.ReactNode;
  /** Extra live message below the field, e.g. the Caps Lock warning. */
  hint?: React.ReactNode;
  inputRef?: React.Ref<HTMLInputElement>;
  /** Adds "(optional)" after the label. */
  optional?: boolean;
  /** Persistent 12px helper text under the input. */
  helper?: string;
  /** Pre-filled and read-only, with a lock icon (e.g. values from an invitation). */
  locked?: boolean;
  /** Extra element ids that describe the input (e.g. a strength meter). */
  describedByExtra?: string;
}

/** 40px input, label above, no leading icons (Form Inputs standard). */
export const Field: React.FC<FieldProps> = ({
  id,
  label,
  error,
  trailing,
  hint,
  inputRef,
  readOnly,
  optional,
  helper,
  locked,
  describedByExtra,
  ...input
}) => {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const helperId = `${id}-helper`;
  const isReadOnly = readOnly || locked;
  const surface = input.disabled ? '' : isReadOnly ? 'bg-[#F7F9FC]' : 'bg-white';
  const describedBy = [helper ? helperId : null, errorId, hintId, describedByExtra ?? null].filter(Boolean).join(' ');
  const padRight = trailing ? 'pr-11' : locked ? 'pr-10' : 'pr-3';

  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
        {optional && <OptionalMark />}
      </label>
      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          readOnly={isReadOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`w-full h-10 rounded-[8px] pl-3 ${padRight} ${surface} ${inputBorder(Boolean(error))} text-[16px] @min-[640px]:text-[14px] text-[#121722] placeholder:text-[#6B7485] transition-all focus:outline-none focus:ring-[3px] focus:ring-[#1E63FF]/20 disabled:bg-[#EEF1F6] disabled:text-[#8C95A6] disabled:border-[#DDE2EA] disabled:cursor-not-allowed`}
          {...input}
        />
        {locked && (
          <Lock
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7485] pointer-events-none"
            aria-hidden="true"
          />
        )}
        {trailing}
      </div>
      {helper && (
        <p id={helperId} className="mt-1.5 text-[12px] leading-[16px] text-[#4B5465]">
          {helper}
        </p>
      )}
      <div id={errorId} aria-live="polite">
        {error && <FieldErrorText>{error}</FieldErrorText>}
      </div>
      <div id={hintId} aria-live="polite">
        {hint}
      </div>
    </div>
  );
};

/* ── Alerts and status ───────────────────────────────────────────── */

export const CriticalAlert: React.FC<{ icon: LucideIcon; children: React.ReactNode }> = ({ icon: Icon, children }) => (
  <div className="flex items-start gap-3 p-4 rounded-[8px] bg-[#0B2D6B] border-l-4 border-l-[#00C6FF] text-[14px] leading-[20px] text-white">
    <Icon className="w-5 h-5 mt-px shrink-0 text-[#00C6FF]" aria-hidden="true" />
    <div className="min-w-0">{children}</div>
  </div>
);

export const InfoAlert: React.FC<{ icon: LucideIcon; children: React.ReactNode }> = ({ icon: Icon, children }) => (
  <div className="flex items-start gap-3 p-4 rounded-[8px] bg-[#1E63FF]/[0.08] border-l-4 border-l-[#1E63FF] text-[14px] leading-[20px] text-[#121722]">
    <Icon className="w-5 h-5 mt-px shrink-0 text-[#1E63FF]" aria-hidden="true" />
    <div className="min-w-0">{children}</div>
  </div>
);

const STATUS_TONES = {
  /** Cyan 16% fill, Deep Navy icon (success, email sent). */
  cyan: 'bg-[#00C6FF]/[0.16] text-[#0B2D6B]',
  /** Royal Blue 8% fill, Deep Navy icon (submitted, pending). */
  blue: 'bg-[#1E63FF]/[0.08] text-[#0B2D6B]',
  /** Gray 100 fill, Gray 700 icon (expired, inactive). */
  gray: 'bg-[#EEF1F6] text-[#353D4C]',
} as const;

/** 56px circle with an icon, shown above a status heading. */
export const StatusIcon: React.FC<{ icon: LucideIcon; tone?: keyof typeof STATUS_TONES }> = ({ icon: Icon, tone = 'cyan' }) => (
  <div className={`mb-4 w-14 h-14 rounded-full flex items-center justify-center ${STATUS_TONES[tone]}`} aria-hidden="true">
    <Icon className="w-7 h-7" />
  </div>
);
