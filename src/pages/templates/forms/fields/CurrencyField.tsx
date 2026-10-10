import React from 'react';
import { BARE_INPUT, BaseFieldProps, FieldShell, SEGMENT_ADDON, describedBy, segmented } from './FieldShell';

interface CurrencyFieldProps extends BaseFieldProps {
  /** Whole rupees as digits, e.g. "125000". */
  value: string;
  onChange: (digits: string) => void;
  placeholder?: string;
}

/** Currency: ₹ prefix and Indian grouping as you type (1,25,000). The value stays digits only. */
export const CurrencyField: React.FC<CurrencyFieldProps> = ({ id, label, optional, helper, error, disabled, readOnly, onBlur, value, onChange, placeholder = '0' }) => (
  <FieldShell id={id} label={label} optional={optional} helper={helper} error={error}>
    <div className={segmented({ error, disabled, readOnly })}>
      <span className={`${SEGMENT_ADDON} border-r border-[#DDE2EA]`} aria-hidden="true">
        ₹
      </span>
      <input
        id={id}
        inputMode="numeric"
        value={value ? Number(value).toLocaleString('en-IN') : ''}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, helper, error)}
        aria-label={`${label}, in rupees`}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 12))}
        onBlur={onBlur}
        className={`${BARE_INPUT} tabular-nums`}
      />
    </div>
  </FieldShell>
);
