import React from 'react';
import { FieldErrorText, LABEL } from '../../shared/authUi';
import { SettingsSelect, type SelectOption } from './SettingsSelect';

interface SelectFieldProps {
  id: string;
  label: string;
  options: readonly SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}

/** Labelled SettingsSelect for drawers and modals (replaces the Register template's Select inside Settings). */
export const SelectField: React.FC<SelectFieldProps> = ({ id, label, options, value, onChange, placeholder, error }) => (
  <div>
    <label id={`${id}-label`} htmlFor={id} className={LABEL}>
      {label}
    </label>
    <SettingsSelect
      id={id}
      labelledBy={`${id}-label`}
      describedBy={error ? `${id}-error` : undefined}
      invalid={!!error}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {error && (
      <div id={`${id}-error`}>
        <FieldErrorText>{error}</FieldErrorText>
      </div>
    )}
  </div>
);
