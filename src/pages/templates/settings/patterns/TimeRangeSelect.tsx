import React from 'react';
import { TIMES } from '../data/settingsIndex';
import { SettingsSelect } from '../parts/SettingsSelect';

interface TimeRangeSelectProps {
  idPrefix: string;
  from: string;
  to: string;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
  /** Name of the range for the From/To labels, e.g. "Working hours". */
  name: string;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
}

/** From / To time selects (30-minute steps, JetBrains Mono) with visible labels. */
export const TimeRangeSelect: React.FC<TimeRangeSelectProps> = ({ idPrefix, from, to, onFrom, onTo, name, disabled = false, invalid = false, describedBy }) => (
  <div className="flex flex-wrap items-end gap-3">
    {(
      [
        ['from', 'From', from, onFrom],
        ['to', 'To', to, onTo],
      ] as const
    ).map(([key, label, value, set]) => (
      <div key={key} className="w-[132px]">
        <label id={`${idPrefix}-${key}-label`} htmlFor={`${idPrefix}-${key}`} className="block mb-1 text-[12px] leading-[16px] font-medium text-[#4B5465]">
          {label}
          <span className="sr-only"> ({name})</span>
        </label>
        <SettingsSelect
          id={`${idPrefix}-${key}`}
          labelledBy={`${idPrefix}-${key}-label`}
          describedBy={describedBy}
          disabled={disabled}
          invalid={invalid && key === 'to'}
          options={TIMES}
          value={value}
          onChange={set}
        />
      </div>
    ))}
  </div>
);
