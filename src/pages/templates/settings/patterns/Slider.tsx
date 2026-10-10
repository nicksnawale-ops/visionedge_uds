import React from 'react';
import type { ControlProps } from './SettingRow';

interface SliderProps {
  control: ControlProps;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Unit shown in the value box, e.g. "%". */
  unit: string;
  onChange: (value: number) => void;
}

/**
 * Slider with a value box (no shared slider exists). Native range input, so arrow keys step by 1,
 * Page Up/Down by 10 and Home/End jump; the number box can be typed into and always shows the value.
 */
export const Slider: React.FC<SliderProps> = ({ control, value, min, max, step = 1, unit, onChange }) => {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step));
  return (
    <div className="flex items-center gap-4 max-w-[420px]">
      <input
        id={control.id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={control.disabled}
        aria-describedby={control.describedBy}
        aria-valuetext={`${value}${unit}`}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 min-w-0 h-11 cursor-pointer accent-[#1E63FF] disabled:cursor-not-allowed disabled:opacity-60"
      />
      <span className="relative shrink-0">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={control.disabled}
          aria-labelledby={control.labelId}
          aria-describedby={control.describedBy}
          onChange={(e) => e.target.value !== '' && onChange(clamp(Number(e.target.value)))}
          className="w-[84px] h-10 pl-3 pr-7 rounded-[8px] border border-[#8C95A6] bg-white text-[14px] font-medium tabular-nums text-[#121722] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20 disabled:bg-[#F7F9FC] disabled:border-[#DDE2EA] disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#4B5465] pointer-events-none" aria-hidden="true">
          {unit}
        </span>
      </span>
    </div>
  );
};
