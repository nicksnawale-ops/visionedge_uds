import React from 'react';
import { Field } from '../../shared/authUi';
import { PhoneInput } from '../PhoneInput';
import { COPY, StepProps } from '../registerStates';

/** Step 1 — full name, work email, optional mobile number. */
export const AccountStep: React.FC<StepProps> = ({ data, errors, onChange, onBlurField, readOnly, fieldRef, idPrefix }) => (
  <div className="flex flex-col gap-4">
    <Field
      id={`${idPrefix}-name`}
      label={COPY.fields.fullName.label}
      inputRef={fieldRef('fullName')}
      name="name"
      autoComplete="name"
      placeholder={COPY.fields.fullName.placeholder}
      value={data.fullName}
      error={errors.fullName}
      readOnly={readOnly}
      onChange={(e) => onChange({ fullName: e.target.value })}
    />
    <Field
      id={`${idPrefix}-email`}
      label={COPY.fields.email.label}
      inputRef={fieldRef('email')}
      type="email"
      name="email"
      autoComplete="email"
      inputMode="email"
      spellCheck={false}
      placeholder={COPY.fields.email.placeholder}
      helper={COPY.fields.email.helper}
      value={data.email}
      error={errors.email}
      readOnly={readOnly}
      onChange={(e) => onChange({ email: e.target.value })}
      onBlur={() => onBlurField('email')}
    />
    <PhoneInput
      id={`${idPrefix}-phone`}
      inputRef={fieldRef('phone')}
      value={data.phone}
      error={errors.phone}
      readOnly={readOnly}
      onChange={(phone) => onChange({ phone })}
      onBlur={() => onBlurField('phone')}
    />
  </div>
);
