import React from 'react';
import type { MatrixOption } from './MatrixSelect';

export type MatrixVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'destructive' | 'on-dark';
export type MatrixState = 'default' | 'hover' | 'focus' | 'disabled' | 'loading';
export type MatrixSize = 'sm' | 'md' | 'lg';

const SWATCH: Record<MatrixVariant, string> = {
  primary: 'bg-[#1E63FF]',
  secondary: 'bg-white border border-[#1E63FF]',
  ghost: 'bg-white border border-dashed border-[#C3CAD5]',
  accent: 'bg-[#00C6FF]',
  destructive: 'bg-[#121722]',
  'on-dark': 'bg-[#0B2D6B]',
};

/** 16px rounded preview of the variant's look. */
const Swatch: React.FC<{ variant: MatrixVariant }> = ({ variant }) => (
  <span aria-hidden="true" className={`w-4 h-4 shrink-0 rounded-[4px] flex items-center justify-center ${SWATCH[variant]}`}>
    {variant === 'on-dark' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
  </span>
);

export const VARIANT_OPTIONS: ReadonlyArray<MatrixOption<MatrixVariant>> = [
  { value: 'primary', label: 'Primary', description: 'Royal Blue fill', leading: <Swatch variant="primary" /> },
  { value: 'secondary', label: 'Secondary', description: 'White with blue border', leading: <Swatch variant="secondary" /> },
  { value: 'ghost', label: 'Ghost', description: 'No fill', leading: <Swatch variant="ghost" /> },
  { value: 'accent', label: 'Accent (Cyan)', description: 'Cyan fill, one per screen', leading: <Swatch variant="accent" /> },
  { value: 'destructive', label: 'Destructive', description: 'Gray 900 fill', leading: <Swatch variant="destructive" /> },
  { value: 'on-dark', label: 'On Dark', description: 'White fill on navy', leading: <Swatch variant="on-dark" /> },
];

export const STATE_OPTIONS: ReadonlyArray<MatrixOption<MatrixState>> = [
  { value: 'default', label: 'Default', description: 'Resting state' },
  { value: 'hover', label: 'Hover', description: 'Pointer over the button' },
  { value: 'focus', label: 'Focus Visible', description: 'Keyboard focus ring' },
  { value: 'disabled', label: 'Disabled', description: 'Not available' },
  { value: 'loading', label: 'Loading / Pending', description: 'Action in progress' },
];

export const SIZE_OPTIONS: ReadonlyArray<MatrixOption<MatrixSize>> = [
  { value: 'sm', label: 'Small', meta: '32px' },
  { value: 'md', label: 'Medium (default)', meta: '40px' },
  { value: 'lg', label: 'Large', meta: '48px' },
];
