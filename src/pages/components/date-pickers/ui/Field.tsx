import React from 'react';
import { AlertCircle } from 'lucide-react';
import { LABEL } from './styles';

export type FieldVisual = 'hover' | 'focus';

interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  disabled?: boolean;
  readOnly?: boolean;
  /** Draw the focus/open ring while a popover belongs to this field. */
  active?: boolean;
  /** Force a visual state for the state matrix. */
  force?: FieldVisual;
  /** Render the label as a span (for button triggers labelled with aria-labelledby). */
  labelAsText?: boolean;
  boxRef?: React.Ref<HTMLDivElement>;
  className?: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}

export const fieldIds = (id: string) => ({ label: `${id}-label`, error: `${id}-error`, hint: `${id}-hint` });

/** Label above, 40px box, hint or error below. Error = 2px Deep Navy border + alert icon + message (per Form Inputs). */
export const FieldShell: React.FC<FieldShellProps> = ({
  id,
  label,
  hint,
  error,
  disabled = false,
  readOnly = false,
  active = false,
  force,
  labelAsText = false,
  boxRef,
  className = '',
  children,
  trailing,
}) => {
  const ids = fieldIds(id);
  const box = disabled
    ? 'bg-[#EEF1F6] border border-[#C3CAD5] cursor-not-allowed'
    : readOnly
      ? 'bg-[#F7F9FC] border border-[#DDE2EA]'
      : error
        ? 'bg-white border-2 border-[#0B2D6B]'
        : active || force === 'focus'
          ? 'bg-white border border-[#1E63FF] ring-2 ring-[#1E63FF]/20'
          : force === 'hover'
            ? 'bg-white border border-[#4B5465]'
            : 'bg-white border border-[#8C95A6] hover:border-[#4B5465] focus-within:border-[#1E63FF] focus-within:ring-2 focus-within:ring-[#1E63FF]/20';

  return (
    <div className={`flex flex-col gap-1.5 min-w-0 ${className}`}>
      {labelAsText ? (
        <span id={ids.label} className={LABEL}>
          {label}
        </span>
      ) : (
        <label id={ids.label} htmlFor={id} className={LABEL}>
          {label}
        </label>
      )}
      <div ref={boxRef} data-part="trigger" className={`relative flex items-center h-10 pr-1 rounded-[8px] transition-colors ${box}`}>
        {children}
        {error && <AlertCircle className="w-4 h-4 mr-1 shrink-0 text-[#0B2D6B]" aria-hidden="true" />}
        {trailing}
      </div>
      {error ? (
        <p id={ids.error} className="text-[12px] leading-[16px] font-medium text-[#0B2D6B]">
          {error}
        </p>
      ) : hint ? (
        <p id={ids.hint} className="text-[12px] leading-[16px] text-[#4B5465]">
          {hint}
        </p>
      ) : null}
    </div>
  );
};
