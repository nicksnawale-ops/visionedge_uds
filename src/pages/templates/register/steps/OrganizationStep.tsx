import React from 'react';
import { Field } from '../../shared/authUi';
import { Select } from '../Select';
import { COPY, ROLES, SITES, StepProps } from '../registerStates';

/** Step 2 — organization, site, role (with descriptions), optional department. */
export const OrganizationStep: React.FC<StepProps> = ({ data, errors, onChange, readOnly, fieldRef, idPrefix }) => (
  <div className="flex flex-col gap-4">
    <Field
      id={`${idPrefix}-organization`}
      label={COPY.fields.organization.label}
      inputRef={fieldRef('organization')}
      name="organization"
      autoComplete="organization"
      placeholder={COPY.fields.organization.placeholder}
      value={data.organization}
      error={errors.organization}
      readOnly={readOnly}
      onChange={(e) => onChange({ organization: e.target.value })}
    />
    <Select
      id={`${idPrefix}-site`}
      label={COPY.fields.site.label}
      buttonRef={fieldRef('site')}
      options={SITES}
      value={data.site}
      placeholder={COPY.fields.site.placeholder}
      error={errors.site}
      readOnly={readOnly}
      onChange={(site) => onChange({ site })}
    />
    <Select
      id={`${idPrefix}-role`}
      label={COPY.fields.role.label}
      buttonRef={fieldRef('role')}
      options={ROLES}
      value={data.role}
      placeholder={COPY.fields.role.placeholder}
      error={errors.role}
      readOnly={readOnly}
      onChange={(role) => onChange({ role })}
    />
    <Field
      id={`${idPrefix}-department`}
      label={COPY.fields.department.label}
      optional
      name="department"
      autoComplete="off"
      placeholder={COPY.fields.department.placeholder}
      value={data.department}
      readOnly={readOnly}
      onChange={(e) => onChange({ department: e.target.value })}
    />
  </div>
);
