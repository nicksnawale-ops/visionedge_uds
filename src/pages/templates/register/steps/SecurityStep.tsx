import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Field, FieldErrorText, ICON, INLINE_LINK, demoLink } from '../../shared/authUi';
import { PasswordStrength } from '../PasswordStrength';
import { Select } from '../Select';
import { COPY, ROLES, SITES, StepProps, evaluatePassword } from '../registerStates';

interface SecurityStepProps extends StepProps {
  /** Invitation: email, organization, site and role are pre-filled and locked. */
  invite: boolean;
}

const CHECKBOX =
  'mt-0.5 w-4 h-4 shrink-0 rounded-[4px] border border-[#8C95A6] accent-[#1E63FF] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2 disabled:cursor-not-allowed';

/** Step 3 — password with strength meter and checklist, confirmation, terms and updates. */
export const SecurityStep: React.FC<SecurityStepProps> = ({
  data,
  errors,
  onChange,
  onBlurField,
  readOnly,
  fieldRef,
  idPrefix,
  invite,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const strength = evaluatePassword(data.password, data.fullName, data.email);
  const strengthId = `${idPrefix}-strength`;
  const termsErrorId = `${idPrefix}-terms-error`;
  const trackCapsLock = (e: React.KeyboardEvent) => setCapsLock(e.getModifierState('CapsLock'));
  const passwordsMatch = data.confirm.length > 0 && data.confirm === data.password && !errors.confirm;

  return (
    <div className="flex flex-col gap-4">
      {invite && (
        <>
          <Field id={`${idPrefix}-invite-email`} label={COPY.fields.email.label} type="email" value={data.email} locked readOnly />
          <Field id={`${idPrefix}-invite-org`} label={COPY.fields.organization.label} value={data.organization} locked readOnly />
          <div className="grid grid-cols-1 @min-[640px]:grid-cols-2 gap-4">
            <Select
              id={`${idPrefix}-invite-site`}
              label={COPY.fields.site.label}
              options={SITES}
              value={data.site}
              placeholder=""
              locked
              onChange={() => undefined}
            />
            <Select
              id={`${idPrefix}-invite-role`}
              label={COPY.fields.role.label}
              options={ROLES}
              value={data.role}
              placeholder=""
              locked
              onChange={() => undefined}
            />
          </div>
        </>
      )}

      <div>
        <Field
          id={`${idPrefix}-password`}
          label={COPY.fields.password.label}
          inputRef={fieldRef('password')}
          type={showPassword ? 'text' : 'password'}
          name="new-password"
          autoComplete="new-password"
          value={data.password}
          error={errors.password}
          readOnly={readOnly}
          describedByExtra={strengthId}
          onChange={(e) => onChange({ password: e.target.value })}
          onKeyDown={trackCapsLock}
          onKeyUp={trackCapsLock}
          onBlur={() => setCapsLock(false)}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? COPY.hidePassword : COPY.showPassword}
              aria-controls={`${idPrefix}-password`}
              className="absolute right-0.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-[6px] flex items-center justify-center text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
            >
              {showPassword ? <EyeOff className={ICON} aria-hidden="true" /> : <Eye className={ICON} aria-hidden="true" />}
            </button>
          }
          hint={
            capsLock && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[12px] leading-[16px] text-[#4B5465]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {COPY.capsLock}
              </p>
            )
          }
        />
        <PasswordStrength id={strengthId} result={strength} />
      </div>

      <Field
        id={`${idPrefix}-confirm`}
        label={COPY.fields.confirm.label}
        inputRef={fieldRef('confirm')}
        type={showPassword ? 'text' : 'password'}
        name="confirm-password"
        autoComplete="new-password"
        value={data.confirm}
        error={errors.confirm}
        readOnly={readOnly}
        onChange={(e) => onChange({ confirm: e.target.value })}
        onBlur={() => onBlurField('confirm')}
        hint={
          passwordsMatch && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[12px] leading-[16px] font-medium text-[#353D4C]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#1E63FF]" aria-hidden="true" />
              {COPY.passwordsMatch}
            </p>
          )
        }
      />

      <div className="flex flex-col">
        <label className="flex items-start gap-2 min-h-[44px] py-2 text-[14px] leading-[20px] text-[#353D4C] cursor-pointer">
          <input
            ref={fieldRef('terms')}
            type="checkbox"
            name="terms"
            required
            checked={data.terms}
            disabled={readOnly}
            aria-invalid={errors.terms ? true : undefined}
            aria-describedby={termsErrorId}
            onChange={(e) => onChange({ terms: e.target.checked })}
            className={CHECKBOX}
          />
          <span>
            {COPY.terms.before}
            <a href="#terms" onClick={demoLink} className={INLINE_LINK}>
              {COPY.terms.terms}
            </a>
            {COPY.terms.and}
            <a href="#privacy" onClick={demoLink} className={INLINE_LINK}>
              {COPY.terms.privacy}
            </a>
          </span>
        </label>
        <div id={termsErrorId} aria-live="polite" className="-mt-1">
          {errors.terms && <FieldErrorText>{errors.terms}</FieldErrorText>}
        </div>

        <label className="flex items-start gap-2 min-h-[44px] py-2 text-[14px] leading-[20px] text-[#353D4C] cursor-pointer">
          <input
            type="checkbox"
            name="updates"
            checked={data.updates}
            disabled={readOnly}
            onChange={(e) => onChange({ updates: e.target.checked })}
            className={CHECKBOX}
          />
          <span>{COPY.updates}</span>
        </label>
      </div>
    </div>
  );
};
