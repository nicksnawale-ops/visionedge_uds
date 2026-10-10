import React from 'react';
import { Select } from '../../register/Select';

interface SelectFieldProps {
  id: string;
  label: string;
  options: { value: string; label: string; description?: string }[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
  optional?: boolean;
  helper?: string;
  readOnly?: boolean;
  locked?: boolean;
  onBlur?: () => void;
}

/** Select: the shared 40px combobox select (Register), plus helper text and blur validation. */
export const SelectField: React.FC<SelectFieldProps> = ({ helper, onBlur, ...props }) => (
  <div className="min-w-0" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && onBlur?.()}>
    <Select {...props} />
    {helper && !props.error && <p className="mt-1.5 text-[12px] leading-[16px] text-[#4B5465]">{helper}</p>}
  </div>
);
