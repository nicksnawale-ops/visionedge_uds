import React from 'react';
import { Slider } from '../../settings/patterns/Slider';
import { BaseFieldProps, FieldShell, describedBy } from './FieldShell';

interface SliderFieldProps extends BaseFieldProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
}

/** Slider with a value box: the Settings slider, wrapped with a label above and helper below. */
export const SliderField: React.FC<SliderFieldProps> = ({ id, label, optional, helper, error, disabled, readOnly, value, onChange, min, max, step, unit }) => (
  <FieldShell id={id} label={label} optional={optional} helper={helper} error={error}>
    <Slider
      control={{ id, labelId: `${id}-label`, describedBy: describedBy(id, helper, error) ?? '', disabled: Boolean(disabled || readOnly), invalid: Boolean(error) }}
      value={value}
      min={min}
      max={max}
      step={step}
      unit={unit}
      onChange={onChange}
    />
  </FieldShell>
);
