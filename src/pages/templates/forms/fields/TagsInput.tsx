import React from 'react';
import { ChipsInput } from '../../settings/patterns/ChipsInput';
import { BaseFieldProps, FieldShell, describedBy } from './FieldShell';

interface TagsInputProps extends BaseFieldProps {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  /** Maximum number of tags. */
  max?: number;
}

/** Tags: type and press Enter or comma; Backspace removes the last tag. Reuses the Settings chips input. */
export const TagsInput: React.FC<TagsInputProps> = ({ id, label, optional, helper = 'Press Enter or comma after each tag.', error, disabled, readOnly, value, onChange, placeholder = 'Add a tag', max = 10 }) => (
  <FieldShell id={id} label={label} optional={optional} helper={helper} error={error} group>
    <ChipsInput
      id={id}
      labelledBy={`${id}-legend`}
      describedBy={describedBy(id, helper, error)}
      values={value}
      onChange={onChange}
      noun="tag"
      placeholder={placeholder}
      disabled={disabled || readOnly}
      validate={(v) => (value.length >= max ? `Use ${max} tags or fewer` : v.length > 24 ? 'Use 24 characters or fewer for a tag' : undefined)}
    />
  </FieldShell>
);
