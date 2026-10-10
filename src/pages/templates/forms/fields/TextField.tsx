import React from 'react';
import { BaseFieldProps, FieldShell, control, describedBy } from './FieldShell';

interface TextFieldProps extends BaseFieldProps {
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'email' | 'url';
  placeholder?: string;
  autoComplete?: string;
  mono?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
}

/** Text and Email: 40px input with label above. */
export const TextField: React.FC<TextFieldProps> = ({ id, label, optional, helper, error, disabled, readOnly, onBlur, value, onChange, type = 'text', placeholder, autoComplete, mono, inputRef }) => (
  <FieldShell id={id} label={label} optional={optional} helper={helper} error={error}>
    <input
      id={id}
      ref={inputRef}
      type={type}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      readOnly={readOnly}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, helper, error)}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className={`${control({ error, disabled, readOnly })} ${mono ? 'font-mono' : ''}`}
    />
  </FieldShell>
);
