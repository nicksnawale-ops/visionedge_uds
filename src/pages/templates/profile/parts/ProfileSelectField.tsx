import React from 'react';
import { FieldErrorText, LABEL } from '../../shared/authUi';
import { ProfileSelect } from './ProfileSelect';
import type { SelectOption } from './selectHelpers';

interface ProfileSelectFieldProps {
  id: string;
  label: string;
  options: readonly SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  /** Read-only while saving. */
  readOnly?: boolean;
  /** Locked with a reason (Lock icon + tooltip). */
  locked?: string;
}

/** Labelled ProfileSelect: replaces the Register template's Select inside the profile (that file is not edited). */
export const ProfileSelectField: React.FC<ProfileSelectFieldProps> = ({ id, label, options, value, onChange, placeholder, error, readOnly, locked }) => (
  <div>
    <span id={`${id}-label`} className={LABEL}>
      {label}
    </span>
    <ProfileSelect
      id={id}
      labelledBy={`${id}-label`}
      describedBy={error ? `${id}-error` : undefined}
      invalid={!!error}
      readOnly={readOnly}
      locked={locked}
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
