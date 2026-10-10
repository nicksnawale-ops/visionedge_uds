/**
 * Field foundations (Form Inputs standard): label above (14px Medium), 40px controls, 12px helper below,
 * "(optional)" suffix, error with icon replacing nothing (helper stays), all states via props.
 */
import React from 'react';
import { Lock } from 'lucide-react';
import { FieldErrorText, LABEL, OptionalMark } from '../../shared/authUi';
import { Tooltip } from '../../profile/ui';

/** Shared props every field accepts. */
export interface BaseFieldProps {
  id: string;
  label: string;
  optional?: boolean;
  helper?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onBlur?: () => void;
}

/** 40px control styling for each state: default, hover, focus, error, disabled, read-only. */
export const control = (o: { error?: string; disabled?: boolean; readOnly?: boolean }): string =>
  `w-full h-10 px-3 rounded-[8px] text-[16px] @min-[640px]:text-[14px] text-[#121722] placeholder:text-[#6B7485] outline-none transition-[border-color,box-shadow] focus:ring-[3px] focus:ring-[#1E63FF]/20 ${
    o.disabled
      ? 'bg-[#EEF1F6] border border-[#DDE2EA] text-[#8C95A6] cursor-not-allowed'
      : o.error
        ? 'bg-white border-2 border-[#0B2D6B]'
        : o.readOnly
          ? 'bg-[#F7F9FC] border border-[#DDE2EA]'
          : 'bg-white border border-[#8C95A6] hover:border-[#353D4C] focus:border-[#1E63FF]'
  }`;

/** Wrapper for inputs with a prefix/suffix segment (₹, kg, %). */
export const segmented = (o: { error?: string; disabled?: boolean; readOnly?: boolean }): string =>
  `flex w-full h-10 rounded-[8px] overflow-hidden transition-[border-color,box-shadow] focus-within:ring-[3px] focus-within:ring-[#1E63FF]/20 ${
    o.disabled
      ? 'bg-[#EEF1F6] border border-[#DDE2EA]'
      : o.error
        ? 'bg-white border-2 border-[#0B2D6B]'
        : o.readOnly
          ? 'bg-[#F7F9FC] border border-[#DDE2EA]'
          : 'bg-white border border-[#8C95A6] hover:border-[#353D4C] focus-within:border-[#1E63FF]'
  }`;

export const SEGMENT_ADDON = 'flex items-center px-3 bg-[#F7F9FC] text-[14px] text-[#353D4C] shrink-0';
export const BARE_INPUT = 'flex-1 min-w-0 px-3 bg-transparent text-[16px] @min-[640px]:text-[14px] text-[#121722] placeholder:text-[#6B7485] outline-none disabled:cursor-not-allowed disabled:text-[#8C95A6]';

export const describedBy = (id: string, helper?: React.ReactNode, error?: string, extra?: string): string | undefined =>
  [helper ? `${id}-helper` : null, error ? `${id}-error` : null, extra ?? null].filter(Boolean).join(' ') || undefined;

interface FieldShellProps extends Pick<BaseFieldProps, 'id' | 'label' | 'optional' | 'helper' | 'error'> {
  /** Use a fieldset + legend (radio groups, checkbox groups, ranges). */
  group?: boolean;
  /** Lock reason (admin-managed values). */
  locked?: string;
  /** Right side of the label row, e.g. a character counter. */
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const FieldShell: React.FC<FieldShellProps> = ({ id, label, optional, helper, error, group = false, locked, aside, className = '', children }) => {
  const labelRow = (
    <span className="flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-1.5">
        {label}
        {optional && <OptionalMark />}
        {locked && (
          <Tooltip content={locked} align="start">
            {(tip) => (
              <span tabIndex={0} role="img" aria-label="Locked" aria-describedby={tip} className="relative inline-flex w-5 h-5 items-center justify-center rounded-[4px] text-[#6B7485] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] after:absolute after:content-[''] after:-inset-3">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            )}
          </Tooltip>
        )}
      </span>
      {aside}
    </span>
  );
  const below = (
    <>
      {helper && (
        <p id={`${id}-helper`} className="mt-1.5 text-[12px] leading-[16px] text-[#4B5465]">
          {helper}
        </p>
      )}
      <div id={`${id}-error`} aria-live="polite">
        {error && <FieldErrorText>{error}</FieldErrorText>}
      </div>
    </>
  );
  if (group) {
    return (
      <fieldset className={`min-w-0 ${className}`} aria-describedby={describedBy(id, helper, error)}>
        <legend id={`${id}-legend`} className={`${LABEL} w-full`}>
          {labelRow}
        </legend>
        {children}
        {below}
      </fieldset>
    );
  }
  return (
    <div className={`min-w-0 ${className}`}>
      <label id={`${id}-label`} htmlFor={id} className={`${LABEL} w-full`}>
        {labelRow}
      </label>
      {children}
      {below}
    </div>
  );
};

/** Read-only view: Overline label + value as text. */
export const ReadOnlyValue: React.FC<{ label: string; value: React.ReactNode; mono?: boolean }> = ({ label, value, mono = false }) => (
  <div className="min-w-0">
    <dt className="text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">{label}</dt>
    <dd className={`mt-0.5 text-[14px] leading-[20px] text-[#121722] break-words ${mono ? 'font-mono' : ''}`}>{value || <span className="text-[#6B7485]">—</span>}</dd>
  </div>
);
