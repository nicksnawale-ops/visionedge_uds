import React from 'react';
import { PhoneInput } from '../../register/PhoneInput';

interface PhoneFieldProps {
  id: string;
  label?: string;
  optional?: boolean;
  /** Digits only, up to 10. */
  value: string;
  onChange: (digits: string) => void;
  onBlur?: () => void;
  error?: string;
  readOnly?: boolean;
  helper?: string;
}

/** Phone (+91): the Register PhoneInput with a form-specific label, plus helper text. */
export const PhoneField: React.FC<PhoneFieldProps> = ({ id, label = 'Phone', optional = false, value, onChange, onBlur, error, readOnly, helper = '10-digit mobile number, without the country code.' }) => (
  <div className="min-w-0">
    <PhoneInput id={id} label={label} optional={optional} value={value} onChange={onChange} onBlur={onBlur} error={error} readOnly={readOnly} />
    {!error && helper && <p className="mt-1.5 text-[12px] leading-[16px] text-[#4B5465]">{helper}</p>}
  </div>
);
