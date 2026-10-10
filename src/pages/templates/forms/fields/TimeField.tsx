import React from 'react';
import { ChevronDown } from 'lucide-react';
import { BaseFieldProps, FieldShell, control, describedBy } from './FieldShell';

interface TimeFieldProps extends BaseFieldProps {
  /** "14:30" or "". */
  value: string;
  onChange: (v: string) => void;
  /** Minutes between options. Default 15. */
  step?: number;
}

/** Time in IST: 24-hour options every 15 minutes, JetBrains Mono. */
export const TimeField: React.FC<TimeFieldProps> = ({ id, label, optional, helper = 'All times are IST.', error, disabled, readOnly, onBlur, value, onChange, step = 15 }) => {
  const options = Array.from({ length: (24 * 60) / step }, (_, i) => {
    const m = i * step;
    return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  });
  return (
    <FieldShell id={id} label={label} optional={optional} helper={helper} error={error}>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled || readOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, helper, error)}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`${control({ error, disabled, readOnly })} appearance-none pr-9 font-mono`}
        >
          <option value="">Choose a time</option>
          {options.map((t) => (
            <option key={t} value={t}>
              {t} IST
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5465] pointer-events-none" aria-hidden="true" />
      </div>
    </FieldShell>
  );
};
