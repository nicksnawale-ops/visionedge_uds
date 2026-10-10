import React from 'react';
import { BaseFieldProps } from './FieldShell';
import { NumberField } from './NumberField';

interface PercentageFieldProps extends BaseFieldProps {
  value: string;
  onChange: (v: string) => void;
}

/** Keeps 0–100 with at most one decimal place: "12.5", "100". */
const clamp = (v: string): string => {
  if (v === '' || v === '.') return v === '.' ? '0.' : '';
  const [whole, frac] = v.split('.');
  if (Number(v) >= 100) return '100';
  return frac === undefined ? String(Number(whole)) : `${Number(whole || 0)}.${frac.slice(0, 1)}`;
};

/** Percentage: 0–100 with up to one decimal place, "%" suffix. */
export const PercentageField: React.FC<PercentageFieldProps> = ({ value, onChange, ...rest }) => (
  <NumberField {...rest} unit="%" decimal value={value} placeholder="0" onChange={(v) => onChange(clamp(v))} />
);
