import React from 'react';
import { BaseFieldProps, FieldShell, describedBy } from './FieldShell';

interface TextareaFieldProps extends BaseFieldProps {
  value: string;
  onChange: (v: string) => void;
  max: number;
  rows?: number;
  placeholder?: string;
}

/** Textarea with a live character counter ("120 / 500"); typing stops at the limit. */
export const TextareaField: React.FC<TextareaFieldProps> = ({ id, label, optional, helper, error, disabled, readOnly, onBlur, value, onChange, max, rows = 4, placeholder }) => {
  const near = value.length >= max * 0.9;
  return (
    <FieldShell
      id={id}
      label={label}
      optional={optional}
      helper={helper}
      error={error}
      aside={
        <span id={`${id}-count`} className={`text-[12px] font-normal tabular-nums ${near ? 'text-[#0B2D6B] font-medium' : 'text-[#6B7485]'}`}>
          {value.length} / {max}
        </span>
      }
    >
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        maxLength={max}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, helper, error, `${id}-count`)}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full px-3 py-2.5 rounded-[8px] text-[16px] @min-[640px]:text-[14px] leading-[20px] text-[#121722] placeholder:text-[#6B7485] resize-y outline-none focus:ring-[3px] focus:ring-[#1E63FF]/20 ${
          disabled
            ? 'bg-[#EEF1F6] border border-[#DDE2EA] text-[#8C95A6] cursor-not-allowed'
            : error
              ? 'bg-white border-2 border-[#0B2D6B]'
              : readOnly
                ? 'bg-[#F7F9FC] border border-[#DDE2EA]'
                : 'bg-white border border-[#8C95A6] hover:border-[#353D4C] focus:border-[#1E63FF]'
        }`}
      />
    </FieldShell>
  );
};
