import React, { useId } from 'react';
import { TimePicker } from './TimePicker';
import { LABEL } from '../ui/styles';

export const END_TIME_ERROR = 'End time must be after start time';

interface TimeRangePickerProps {
  label: string;
  from: number | null;
  to: number | null;
  onChange: (from: number | null, to: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
}

/** "From 12:00 – To 14:30" pair. The end field shows the error when it isn't after the start. */
export const TimeRangePicker: React.FC<TimeRangePickerProps> = ({ label, from, to, onChange, min, max, step }) => {
  const uid = useId();
  const invalid = from !== null && to !== null && to <= from;
  return (
    <fieldset aria-labelledby={`${uid}-legend`} className="min-w-0">
      <legend id={`${uid}-legend`} className={`${LABEL} mb-2`}>
        {label}
      </legend>
      <div className="flex flex-wrap items-start gap-x-2 gap-y-3">
        <TimePicker label="From" value={from} onChange={(v) => onChange(v, to)} min={min} max={max} step={step} className="w-[168px]" />
        <span className="mt-[34px] text-[14px] text-[#6B7485]" aria-hidden="true">
          –
        </span>
        <TimePicker
          label="To"
          value={to}
          onChange={(v) => onChange(from, v)}
          min={min}
          max={max}
          step={step}
          error={invalid ? END_TIME_ERROR : null}
          className="w-[168px]"
        />
      </div>
    </fieldset>
  );
};
