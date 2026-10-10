import React from 'react';
import { BARE_INPUT, BaseFieldProps, FieldShell, SEGMENT_ADDON, describedBy, segmented } from './FieldShell';

interface NumberFieldProps extends BaseFieldProps {
  /** Digits as a string (empty allowed). */
  value: string;
  onChange: (v: string) => void;
  /** Unit suffix, e.g. "kg", "min". */
  unit: string;
  placeholder?: string;
  /** Allow one decimal point. */
  decimal?: boolean;
}

/** Number with a unit suffix. Numeric keyboard on phones; non-digits are ignored as you type. */
export const NumberField: React.FC<NumberFieldProps> = ({ id, label, optional, helper, error, disabled, readOnly, onBlur, value, onChange, unit, placeholder, decimal = false }) => (
  <FieldShell id={id} label={label} optional={optional} helper={helper} error={error}>
    <div className={segmented({ error, disabled, readOnly })}>
      <input
        id={id}
        inputMode={decimal ? 'decimal' : 'numeric'}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, helper, error, `${id}-unit`)}
        onChange={(e) => onChange(e.target.value.replace(decimal ? /[^\d.]/g : /\D/g, '').replace(/(\..*)\./g, '$1'))}
        onBlur={onBlur}
        className={`${BARE_INPUT} tabular-nums`}
      />
      <span id={`${id}-unit`} className={`${SEGMENT_ADDON} border-l border-[#DDE2EA]`}>
        {unit}
      </span>
    </div>
  </FieldShell>
);
