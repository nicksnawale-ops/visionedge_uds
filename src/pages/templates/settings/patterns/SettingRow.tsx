import React, { useId } from 'react';
import { Lock } from 'lucide-react';
import { FieldErrorText } from '../../shared/authUi';
import { LINK, RADIO, Tooltip, demoLink } from '../../profile/ui';
import { useSettings } from '../SettingsContext';
import { getDef } from '../data/settingsIndex';
import { SettingsSelect } from '../parts/SettingsSelect';

/** What a row hands its control so label, description and errors are tied to it. */
export interface ControlProps {
  id: string;
  labelId: string;
  describedBy: string;
  disabled: boolean;
  invalid: boolean;
}

export interface SettingRowProps {
  label: string;
  description: string;
  /** Optional "Learn more" link text target. */
  learnMore?: boolean;
  /** Control is a group (radios, chips, two selects): the label names it via aria-labelledby. */
  group?: boolean;
  modified?: boolean;
  /** Managed by license or policy: the reason (tooltip) — the control is disabled. */
  locked?: string;
  disabled?: boolean;
  error?: string;
  /** Helper text under the control. */
  helper?: React.ReactNode;
  /** Search jump target. */
  settingId?: string;
  overlay?: React.ReactNode;
  children: (control: ControlProps) => React.ReactNode;
}

/**
 * Setting row: label + description on the left (5/12), the control on the right (7/12), left-aligned.
 * 24px × 20px padding, 1px Gray 200 divider between rows. Modified rows get a 3px Royal Blue bar and a
 * "Modified" tag; locked rows a Lock icon with the reason. Below 768px label and control stack.
 */
export const SettingRow: React.FC<SettingRowProps> = ({
  label,
  description,
  learnMore = false,
  group = false,
  modified = false,
  locked,
  disabled = false,
  error,
  helper,
  settingId,
  overlay,
  children,
}) => {
  const uid = useId();
  const controlId = `${uid}-control`;
  const labelId = `${uid}-label`;
  const descId = `${uid}-desc`;
  const helperId = `${uid}-helper`;
  const errorId = `${uid}-error`;
  const lockId = `${uid}-lock`;
  const describedBy = [descId, helper ? helperId : null, error ? errorId : null, locked ? lockId : null].filter(Boolean).join(' ');
  const LabelTag = group ? 'span' : 'label';

  return (
    <div
      data-setting-id={settingId}
      tabIndex={settingId ? -1 : undefined}
      className="relative grid grid-cols-1 @min-[768px]:grid-cols-12 gap-x-6 gap-y-3 px-4 @min-[768px]:px-6 py-5 border-b border-[#DDE2EA] last:border-b-0 outline-none scroll-mt-24 last:rounded-b-[12px]"
    >
      {overlay}
      {modified && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#1E63FF]" aria-hidden="true" />}
      <div className="@min-[768px]:col-span-5 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <LabelTag id={labelId} {...(group ? {} : { htmlFor: controlId })} className="text-[14px] leading-[20px] font-medium text-[#121722]">
            {label}
            {modified && <span className="sr-only">, modified</span>}
          </LabelTag>
          {modified && (
            <span className="text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#1E63FF]" aria-hidden="true">
              Modified
            </span>
          )}
          {locked && (
            <Tooltip content={locked} align="start">
              {(tip) => (
                <span
                  tabIndex={0}
                  role="img"
                  aria-label="Locked"
                  aria-describedby={tip}
                  className="relative inline-flex w-5 h-5 items-center justify-center rounded-[4px] text-[#6B7485] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] after:absolute after:content-[''] after:-inset-3"
                >
                  <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              )}
            </Tooltip>
          )}
        </div>
        <p id={descId} className="mt-0.5 text-[12px] leading-[16px] text-[#4B5465] line-clamp-2">
          {description}
        </p>
        {locked && (
          <span id={lockId} className="sr-only">
            Locked. {locked}
          </span>
        )}
        {learnMore && (
          <a href="#learn-more" onClick={demoLink} className={`${LINK} text-[12px] min-h-[32px]`}>
            Learn more
          </a>
        )}
      </div>
      <div className="@min-[768px]:col-span-7 min-w-0">
        {children({ id: controlId, labelId, describedBy, disabled: disabled || Boolean(locked), invalid: Boolean(error) })}
        {helper && (
          <p id={helperId} className="mt-1.5 text-[12px] leading-[16px] text-[#4B5465]" aria-live="polite">
            {helper}
          </p>
        )}
        <div id={errorId} aria-live="polite">
          {error && <FieldErrorText>{error}</FieldErrorText>}
        </div>
      </div>
    </div>
  );
};

/** SettingRow bound to the settings store by id: label, description, lock, Modified and errors come from the index. */
export const BoundRow: React.FC<
  Omit<SettingRowProps, 'label' | 'description' | 'modified' | 'locked' | 'disabled' | 'error'> & {
    id: string;
    label?: string;
    description?: string;
    /** Lock reason when it isn't in the index. */
    lockedOverride?: string;
  }
> = ({ id, label, description, lockedOverride, ...rest }) => {
  const { isModified, errors, readOnly, marker } = useSettings();
  const def = getDef(id);
  const modified = isModified(id);
  const locked = lockedOverride ?? def?.locked;
  return (
    <SettingRow
      {...rest}
      overlay={rest.overlay ?? (modified ? marker(7, true) : locked ? marker(8, true) : undefined)}
      settingId={id}
      label={label ?? def?.label ?? id}
      description={description ?? def?.description ?? ''}
      locked={locked}
      modified={modified}
      disabled={readOnly}
      error={errors[id]}
    />
  );
};

/* ── Controls ────────────────────────────────────────────────────── */

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  labelledBy?: string;
  label?: string;
  describedBy?: string;
  disabled?: boolean;
}

/** 36×20 switch (Selection controls standard) with a 44px hit area; used inside rows and table cells. */
export const Switch: React.FC<SwitchProps> = ({ checked, onChange, id, labelledBy, label, describedBy, disabled = false }) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    aria-labelledby={labelledBy}
    aria-label={label}
    aria-describedby={describedBy}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className="relative shrink-0 w-11 h-11 -my-2.5 -ml-1 flex items-center justify-center rounded-[8px] outline-none group/switch disabled:cursor-not-allowed"
  >
    <span
      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors group-focus-visible/switch:ring-2 group-focus-visible/switch:ring-[#1E63FF] group-focus-visible/switch:ring-offset-2 ${
        disabled ? (checked ? 'bg-[#8C95A6]' : 'bg-[#DDE2EA]') : checked ? 'bg-[#1E63FF]' : 'bg-[#C3CAD5]'
      }`}
      aria-hidden="true"
    >
      <span className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </span>
  </button>
);

/** Switch + its on/off word, so state is never shown by color alone. */
export const RowSwitch: React.FC<{ control: ControlProps; checked: boolean; onChange: (v: boolean) => void }> = ({ control, checked, onChange }) => (
  <span className="inline-flex items-center gap-2">
    <Switch id={control.id} checked={checked} onChange={onChange} labelledBy={control.labelId} describedBy={control.describedBy} disabled={control.disabled} />
    <span className="text-[13px] text-[#353D4C]" aria-hidden="true">
      {checked ? 'On' : 'Off'}
    </span>
  </span>
);

/** Radio group laid out inline (wraps on small screens), each option a 44px target. */
export function RadioGroup<T extends string>({
  control,
  name,
  options,
  value,
  onChange,
}: {
  control: ControlProps;
  name: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-labelledby={control.labelId} aria-describedby={control.describedBy} className="flex flex-wrap gap-x-5 gap-y-1">
      {options.map((o) => (
        <label key={o.value} className={`inline-flex items-center gap-2 min-h-[44px] text-[14px] text-[#121722] ${control.disabled ? 'cursor-not-allowed text-[#4B5465]' : 'cursor-pointer'}`}>
          <input type="radio" name={name} value={o.value} checked={value === o.value} disabled={control.disabled} onChange={() => onChange(o.value)} className={RADIO} />
          {o.label}
        </label>
      ))}
    </div>
  );
}

/** Select sized for rows (40px, full width up to 360px): the custom SettingsSelect listbox. */
export function RowSelect({
  control,
  options,
  value,
  onChange,
  className = '',
}: {
  control: ControlProps;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <SettingsSelect
      id={control.id}
      labelledBy={control.labelId}
      describedBy={control.describedBy}
      invalid={control.invalid}
      disabled={control.disabled}
      options={options}
      value={value}
      onChange={onChange}
      className={`w-full max-w-[360px] ${className}`}
    />
  );
}

/** 40px input/select style for rows (Form Inputs standard); disabled reads as read-only text on Gray 50. */
export const rowField = (invalid = false): string =>
  `w-full max-w-[360px] h-10 px-3 rounded-[8px] bg-white text-[16px] @min-[640px]:text-[14px] text-[#121722] placeholder:text-[#6B7485] outline-none focus:ring-[3px] focus:ring-[#1E63FF]/20 disabled:bg-[#F7F9FC] disabled:text-[#353D4C] disabled:border-[#DDE2EA] disabled:cursor-not-allowed ${
    invalid ? 'border-2 border-[#0B2D6B]' : 'border border-[#8C95A6] focus:border-[#1E63FF]'
  }`;

/** 40px text input for rows, with an optional fixed prefix segment (e.g. "+91"). */
export const RowInput: React.FC<{
  control: ControlProps;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: 'text' | 'email' | 'tel' | 'url';
  prefix?: string;
  mono?: boolean;
  placeholder?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}> = ({ control, value, onChange, onBlur, type = 'text', prefix, mono = false, placeholder, inputRef }) => {
  const input = (
    <input
      id={control.id}
      ref={inputRef}
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={control.disabled}
      aria-invalid={control.invalid || undefined}
      aria-describedby={control.describedBy}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className={prefix ? `flex-1 min-w-0 h-full px-3 bg-transparent outline-none text-[16px] @min-[640px]:text-[14px] text-[#121722] disabled:cursor-not-allowed ${mono ? 'font-mono' : ''}` : `${rowField(control.invalid)} ${mono ? 'font-mono' : ''}`}
    />
  );
  if (!prefix) return input;
  return (
    <div
      className={`flex w-full max-w-[360px] h-10 rounded-[8px] overflow-hidden focus-within:ring-[3px] focus-within:ring-[#1E63FF]/20 ${
        control.invalid ? 'border-2 border-[#0B2D6B]' : 'border border-[#8C95A6] focus-within:border-[#1E63FF]'
      } ${control.disabled ? 'bg-[#F7F9FC] border-[#DDE2EA]' : 'bg-white'}`}
    >
      <span className="flex items-center px-3 bg-[#F7F9FC] border-r border-[#DDE2EA] font-mono text-[14px] text-[#353D4C]" aria-hidden="true">
        {prefix}
      </span>
      {input}
    </div>
  );
};
