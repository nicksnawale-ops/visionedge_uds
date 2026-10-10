import React from 'react';
import { FieldPair } from '../foundations/FormSection';
import { DateField } from './DateField';

interface DateRangeFieldProps {
  idPrefix: string;
  start: string;
  end: string;
  onStart: (iso: string) => void;
  onEnd: (iso: string) => void;
  startError?: string;
  endError?: string;
  /** End date optional (open-ended). */
  endOptional?: boolean;
  onBlurStart?: () => void;
  onBlurEnd?: () => void;
  readOnly?: boolean;
  disabled?: boolean;
  overlay?: React.ReactNode;
}

/** Start / End date as a two-column pair; the end calendar can't go before the start. */
export const DateRangeField: React.FC<DateRangeFieldProps> = ({ idPrefix, start, end, onStart, onEnd, startError, endError, endOptional = true, onBlurStart, onBlurEnd, readOnly, disabled, overlay }) => (
  <FieldPair overlay={overlay}>
    <DateField id={`${idPrefix}-start`} label="Start date" value={start} onChange={onStart} error={startError} onBlur={onBlurStart} readOnly={readOnly} disabled={disabled} />
    <DateField
      id={`${idPrefix}-end`}
      label="End date"
      optional={endOptional}
      helper="Leave empty if there is no end date."
      value={end}
      onChange={onEnd}
      error={endError}
      onBlur={onBlurEnd}
      min={start || undefined}
      readOnly={readOnly}
      disabled={disabled}
    />
  </FieldPair>
);
