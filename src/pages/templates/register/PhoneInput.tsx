import React from 'react';
import { FieldErrorText, LABEL, OptionalMark } from '../shared/authUi';
import { COPY, formatPhone } from './registerStates';

interface PhoneInputProps {
  id: string;
  /** Digits only, up to 10. */
  value: string;
  onChange: (digits: string) => void;
  onBlur?: () => void;
  error?: string;
  readOnly?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  /** Field label. Default "Mobile number". */
  label?: string;
  /** Show "(optional)" after the label. Default true. */
  optional?: boolean;
}

/** Indian mobile number: fixed "+91" segment joined to a 10-digit input, shown as "98765 43210". */
export const PhoneInput: React.FC<PhoneInputProps> = ({
  id,
  value,
  onChange,
  onBlur,
  error,
  readOnly = false,
  inputRef,
  label = COPY.fields.phone.label,
  optional = true,
}) => {
  const prefixId = `${id}-prefix`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
        {optional && <OptionalMark />}
      </label>
      <div
        className={`flex h-10 rounded-[8px] overflow-hidden transition-all focus-within:ring-[3px] focus-within:ring-[#1E63FF]/20 ${
          error ? 'border-2 border-[#0B2D6B]' : 'border border-[#8C95A6] focus-within:border-[#1E63FF]'
        } ${readOnly ? 'bg-[#F7F9FC]' : 'bg-white'}`}
      >
        <span
          id={prefixId}
          className="flex items-center px-3 bg-[#F7F9FC] border-r border-[#DDE2EA] font-mono text-[14px] text-[#353D4C]"
        >
          <span className="sr-only">Country code </span>
          {COPY.fields.phone.prefix}
        </span>
        <input
          id={id}
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={11}
          placeholder={COPY.fields.phone.placeholder}
          value={formatPhone(value)}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${prefixId} ${errorId}`}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
          onBlur={onBlur}
          className="flex-1 min-w-0 px-3 bg-transparent text-[16px] @min-[640px]:text-[14px] text-[#121722] tabular-nums placeholder:text-[#6B7485] outline-none"
        />
      </div>
      <div id={errorId} aria-live="polite">
        {error && <FieldErrorText>{error}</FieldErrorText>}
      </div>
    </div>
  );
};
