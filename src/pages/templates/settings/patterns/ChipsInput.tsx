import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Chip } from '../../profile/ui';
import { FieldErrorText } from '../../shared/authUi';

interface ChipsInputProps {
  id: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  /** Returns an error message for an invalid entry. */
  validate?: (value: string) => string | undefined;
  disabled?: boolean;
  describedBy?: string;
  labelledBy?: string;
  /** Noun for the remove buttons, e.g. "zone". */
  noun: string;
}

/** Free-text chips (emails, zones): Enter or comma adds, Backspace on an empty input removes the last chip. */
export const ChipsInput: React.FC<ChipsInputProps> = ({ id, values, onChange, placeholder, validate, disabled = false, describedBy, labelledBy, noun }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const add = () => {
    const parts = text.split(/[,\s]+/).map((p) => p.trim()).filter(Boolean);
    if (!parts.length) return;
    const bad = parts.map((p) => validate?.(p)).find(Boolean);
    if (bad) return setError(bad);
    onChange([...values, ...parts.filter((p) => !values.includes(p))]);
    setText('');
    setError('');
  };

  return (
    <div>
      <div
        className={`flex flex-wrap items-center gap-1.5 min-h-10 px-2 py-1.5 rounded-[8px] focus-within:ring-[3px] focus-within:ring-[#1E63FF]/20 ${
          error ? 'border-2 border-[#0B2D6B]' : 'border border-[#8C95A6] focus-within:border-[#1E63FF]'
        } ${disabled ? 'bg-[#F7F9FC] border-[#DDE2EA]' : 'bg-white'}`}
      >
        <ul className="contents" aria-label={`Added ${noun}s`}>
          {values.map((v) => (
            <li key={v}>
              <Chip onRemove={disabled ? undefined : () => onChange(values.filter((x) => x !== v))} removeLabel={`Remove ${noun} ${v}`}>
                {v}
              </Chip>
            </li>
          ))}
        </ul>
        {!disabled && (
          <input
            id={id}
            value={text}
            placeholder={values.length ? '' : placeholder}
            aria-labelledby={labelledBy}
            aria-describedby={[describedBy, `${id}-hint`, `${id}-error`].filter(Boolean).join(' ')}
            aria-invalid={error ? true : undefined}
            onChange={(e) => {
              setText(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                add();
              } else if (e.key === 'Backspace' && !text && values.length) onChange(values.slice(0, -1));
            }}
            onBlur={add}
            className="flex-1 min-w-[140px] h-8 px-1 bg-transparent text-[16px] @min-[640px]:text-[14px] text-[#121722] placeholder:text-[#6B7485] outline-none"
          />
        )}
      </div>
      <span id={`${id}-hint`} className="sr-only">
        Press Enter or comma to add.
      </span>
      <div id={`${id}-error`} aria-live="polite">
        {error && <FieldErrorText>{error}</FieldErrorText>}
      </div>
    </div>
  );
};

interface ToggleChipsProps {
  options: readonly { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  labelledBy: string;
  describedBy?: string;
  disabled?: boolean;
}

/** Multi-select chips (days, plate formats): toggle buttons with aria-pressed and a check icon, 44px targets. */
export const ToggleChips: React.FC<ToggleChipsProps> = ({ options, value, onChange, labelledBy, describedBy, disabled = false }) => (
  <div role="group" aria-labelledby={labelledBy} aria-describedby={describedBy} className="flex flex-wrap gap-1.5">
    {options.map((o) => {
      const on = value.includes(o.value);
      return (
        <button
          key={o.value}
          type="button"
          aria-pressed={on}
          disabled={disabled}
          onClick={() => onChange(on ? value.filter((v) => v !== o.value) : [...value, o.value])}
          className={`relative inline-flex items-center gap-1 h-8 px-3 rounded-full border text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2 after:absolute after:content-[''] after:-inset-y-1.5 after:inset-x-0 disabled:cursor-not-allowed ${
            on
              ? disabled
                ? 'bg-[#EEF1F6] border-[#DDE2EA] text-[#353D4C]'
                : 'bg-[#1E63FF]/[0.08] border-[#1E63FF] text-[#1E63FF]'
              : disabled
                ? 'bg-[#F7F9FC] border-[#DDE2EA] text-[#8C95A6]'
                : 'bg-white border-[#8C95A6] text-[#353D4C] hover:border-[#1E63FF]'
          }`}
        >
          {on && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
          {o.label}
        </button>
      );
    })}
  </div>
);
