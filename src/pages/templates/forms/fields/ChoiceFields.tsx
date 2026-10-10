/**
 * Choice fields: Multi-select chips, Radio group, Radio cards, Checkbox group, Toggle with description.
 * Groups are fieldsets with a legend; each option is a 44px target.
 */
import React from 'react';
import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CHECKBOX, RADIO, Toggle } from '../../profile/ui';
import { ToggleChips } from '../../settings/patterns/ChipsInput';
import { BaseFieldProps, FieldShell } from './FieldShell';

export interface ChoiceOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

/* ── Multi-select chips ── */

export const MultiSelectChips: React.FC<BaseFieldProps & { options: ChoiceOption[]; value: string[]; onChange: (v: string[]) => void }> = ({ id, label, optional, helper, error, disabled, readOnly, options, value, onChange }) => (
  <FieldShell id={id} label={label} optional={optional} helper={helper} error={error} group>
    <div id={id} tabIndex={-1} className="outline-none">
      <ToggleChips options={options} value={value} onChange={onChange} labelledBy={`${id}-legend`} disabled={disabled || readOnly} />
    </div>
  </FieldShell>
);

/* ── Radio group ── */

export function RadioGroupField<T extends string>({
  id,
  label,
  optional,
  helper,
  error,
  disabled,
  readOnly,
  options,
  value,
  onChange,
  inline = true,
}: BaseFieldProps & { options: ChoiceOption<T>[]; value: T | ''; onChange: (v: T) => void; inline?: boolean }) {
  return (
    <FieldShell id={id} label={label} optional={optional} helper={helper} error={error} group>
      <div className={inline ? 'flex flex-wrap gap-x-6' : 'space-y-1'}>
        {options.map((o, i) => (
          <label key={o.value} className={`flex items-start gap-2 min-h-[44px] py-2.5 text-[14px] text-[#121722] ${disabled || readOnly ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <input
              id={i === 0 ? id : undefined}
              type="radio"
              name={id}
              value={o.value}
              checked={value === o.value}
              disabled={disabled || readOnly}
              aria-invalid={error ? true : undefined}
              onChange={() => onChange(o.value)}
              className={`${RADIO} mt-0.5`}
            />
            <span>
              {o.label}
              {o.description && <span className="block text-[12px] leading-[16px] text-[#4B5465]">{o.description}</span>}
            </span>
          </label>
        ))}
      </div>
    </FieldShell>
  );
}

/* ── Radio cards ── */

/** Selectable cards: icon, title, description. Selected = 1.5px Royal Blue border, Royal Blue 8% fill and a check. */
export function RadioCards<T extends string>({
  id,
  label,
  optional,
  helper,
  error,
  disabled,
  readOnly,
  options,
  value,
  onChange,
}: BaseFieldProps & { options: ChoiceOption<T>[]; value: T | ''; onChange: (v: T) => void }) {
  return (
    <FieldShell id={id} label={label} optional={optional} helper={helper} error={error} group>
      <div className="grid grid-cols-1 @min-[640px]:grid-cols-2 gap-3">
        {options.map((o, i) => {
          const on = value === o.value;
          const Icon = o.icon;
          return (
            <label
              key={o.value}
              className={`relative flex items-start gap-3 p-4 rounded-[8px] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#1E63FF] has-[:focus-visible]:ring-offset-2 ${
                disabled || readOnly ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
              } ${on ? 'border-[1.5px] border-[#1E63FF] bg-[#1E63FF]/[0.08]' : error ? 'border-2 border-[#0B2D6B] bg-white' : 'border border-[#DDE2EA] bg-white hover:border-[#8C95A6]'}`}
            >
              <input
                id={i === 0 ? id : undefined}
                type="radio"
                name={id}
                value={o.value}
                checked={on}
                disabled={disabled || readOnly}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {Icon && (
                <span className={`w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0 ${on ? 'bg-white text-[#1E63FF]' : 'bg-[#F7F9FC] text-[#4B5465]'}`} aria-hidden="true">
                  <Icon className="w-5 h-5" />
                </span>
              )}
              <span className="flex-1 min-w-0">
                <span className="block text-[14px] leading-[20px] font-semibold text-[#121722]">{o.label}</span>
                {o.description && <span className="block mt-0.5 text-[12px] leading-[16px] text-[#4B5465]">{o.description}</span>}
              </span>
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${on ? 'bg-[#1E63FF] text-white' : 'border border-[#8C95A6] bg-white'}`}
                aria-hidden="true"
              >
                {on && <Check className="w-3 h-3" strokeWidth={3} />}
              </span>
            </label>
          );
        })}
      </div>
    </FieldShell>
  );
}

/* ── Checkbox group ── */

export const CheckboxGroup: React.FC<BaseFieldProps & { options: ChoiceOption[]; value: string[]; onChange: (v: string[]) => void }> = ({ id, label, optional, helper, error, disabled, readOnly, options, value, onChange }) => (
  <FieldShell id={id} label={label} optional={optional} helper={helper} error={error} group>
    <div className="space-y-0.5">
      {options.map((o, i) => (
        <label key={o.value} className={`flex items-start gap-3 min-h-[44px] py-2.5 text-[14px] text-[#121722] ${disabled || readOnly ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <input
            id={i === 0 ? id : undefined}
            type="checkbox"
            checked={value.includes(o.value)}
            disabled={disabled || readOnly}
            onChange={() => onChange(value.includes(o.value) ? value.filter((x) => x !== o.value) : [...value, o.value])}
            className={`${CHECKBOX} mt-0.5`}
          />
          <span>
            {o.label}
            {o.description && <span className="block text-[12px] leading-[16px] text-[#4B5465]">{o.description}</span>}
          </span>
        </label>
      ))}
    </div>
  </FieldShell>
);

/* ── Toggle with description ── */

export const ToggleField: React.FC<{ label: string; description: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }> = (props) => (
  <div className="rounded-[8px] border border-[#DDE2EA] px-4 py-1">
    <Toggle {...props} />
  </div>
);
