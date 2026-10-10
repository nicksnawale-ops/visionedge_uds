import React, { useId } from 'react';
import { Bell, Info, LayoutDashboard, MonitorPlay, Upload, type LucideIcon } from 'lucide-react';
import { Field, INLINE_LINK, InfoAlert } from '../../shared/authUi';
import { PhoneInput } from '../../register/PhoneInput';
import { useProfile } from '../ProfileContext';
import { DATE_FORMATS, LANDING_PAGES, LANGUAGES, TIME_ZONE } from '../data/users';
import { ProfileSelectField } from '../parts/ProfileSelectField';
import { Avatar, BUTTON, ProfileCard } from '../ui';

/** English names shown under each language's native name ("मराठी · Marathi"). */
const LANGUAGE_ENGLISH: Record<string, string> = { en: 'English', hi: 'Hindi', mr: 'Marathi' };
const LANDING_ICONS: Record<string, LucideIcon> = { dashboard: LayoutDashboard, live: MonitorPlay, alerts: Bell };

/** Fieldset with an H4-style legend; groups sit 32px apart. */
const Group: React.FC<{ legend: string; children: React.ReactNode }> = ({ legend, children }) => (
  <fieldset className="min-w-0">
    <legend className="mb-4 text-[16px] leading-[24px] font-semibold text-[#121722]">{legend}</legend>
    <div className="grid grid-cols-1 @min-[768px]:grid-cols-2 gap-4">{children}</div>
  </fieldset>
);

export const PersonalDetails: React.FC = () => {
  const uid = useId();
  const {
    viewer,
    name,
    initials,
    photo,
    setPhoto,
    email,
    pendingEmail,
    user,
    draft,
    updateDraft,
    errors,
    blurField,
    fieldRef,
    saving,
    openModal,
    toast,
    announce,
    marker,
  } = useProfile();
  const self = viewer === 'self';
  const id = (key: string) => `${uid}-${key}`;

  return (
    <>
      {pendingEmail && self && (
        <div role="status">
          <InfoAlert icon={Info}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p>
                Verify <strong className="font-semibold">{pendingEmail}</strong> to finish changing your email. The current email stays active until then.
              </p>
              <span className="flex flex-wrap gap-2">
                <button type="button" onClick={() => openModal({ kind: 'email', step: 'code' })} className={BUTTON.secondarySm}>
                  Enter code
                </button>
                <button type="button" onClick={() => toast(`Code sent again to ${pendingEmail}`, 'info')} className={BUTTON.ghostSm}>
                  Resend code
                </button>
              </span>
            </div>
          </InfoAlert>
        </div>
      )}

      <ProfileCard title="Profile photo" overlay={marker(6)}>
        <div className="flex flex-col @min-[640px]:flex-row @min-[640px]:items-center gap-4">
          <Avatar initials={initials} size={64} src={photo} />
          <div className="min-w-0">
            {self ? (
              <>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => openModal({ kind: 'photo' })} disabled={saving} className={BUTTON.secondary}>
                    <Upload className="w-4 h-4" aria-hidden="true" />
                    Upload photo
                  </button>
                  {photo && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhoto(null);
                        toast('Photo removed. Your initials are shown instead.', 'info');
                        announce('Photo removed');
                      }}
                      className={BUTTON.ghost}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="mt-2 text-[12px] leading-[16px] text-[#4B5465]">JPG or PNG, square, at least 256 × 256 px, max 2 MB.</p>
              </>
            ) : (
              <p className="text-[14px] leading-[20px] text-[#4B5465]">Only {name} can change their photo. Initials are shown until they add one.</p>
            )}
          </div>
        </div>
      </ProfileCard>

      <ProfileCard title="Details" description={self ? 'Changes are saved together with "Save changes".' : 'Changes are recorded in the audit log.'}>
        <form
          noValidate
          onSubmit={(e) => e.preventDefault()}
          className="space-y-8"
          aria-busy={saving || undefined}
        >
          <Group legend="Basic">
            <Field
              id={id('first')}
              label="First name"
              autoComplete="given-name"
              value={draft.firstName}
              readOnly={saving}
              error={errors.firstName}
              inputRef={fieldRef('firstName')}
              onChange={(e) => updateDraft({ firstName: e.target.value })}
              onBlur={() => blurField('firstName')}
            />
            <Field
              id={id('last')}
              label="Last name"
              autoComplete="family-name"
              value={draft.lastName}
              readOnly={saving}
              error={errors.lastName}
              inputRef={fieldRef('lastName')}
              onChange={(e) => updateDraft({ lastName: e.target.value })}
              onBlur={() => blurField('lastName')}
            />
            <Field
              id={id('display')}
              label="Display name"
              optional
              helper="Shown in alerts and the activity log instead of your full name."
              placeholder={self ? 'e.g. Priya S.' : 'e.g. Rahul M.'}
              value={draft.displayName}
              readOnly={saving}
              error={errors.displayName}
              inputRef={fieldRef('displayName')}
              onChange={(e) => updateDraft({ displayName: e.target.value })}
              onBlur={() => blurField('displayName')}
            />
            <Field id={id('emp')} label="Employee ID" value={user.employeeId} locked helper="Managed by your administrator" />
          </Group>

          <Group legend="Contact">
            <div>
              <Field id={id('email')} label="Work email" value={email} locked helper={pendingEmail && self ? `Pending: ${pendingEmail}` : undefined} />
              {self && (
                <button
                  type="button"
                  onClick={() => openModal({ kind: 'email' })}
                  disabled={saving}
                  className={`${INLINE_LINK} mt-2 inline-flex items-center min-h-[44px] no-underline hover:underline text-[14px] disabled:text-[#8C95A6] disabled:no-underline`}
                >
                  Change email
                </button>
              )}
            </div>
            <PhoneInput
              id={id('mobile')}
              value={draft.mobile}
              readOnly={saving}
              error={errors.mobile}
              inputRef={fieldRef('mobile')}
              onChange={(digits) => updateDraft({ mobile: digits })}
              onBlur={() => blurField('mobile')}
            />
            <Field
              id={id('alt')}
              label="Alternate contact"
              optional
              helper="Email or phone we can use if your main contact is unavailable."
              value={draft.altContact}
              readOnly={saving}
              error={errors.altContact}
              inputRef={fieldRef('altContact')}
              onChange={(e) => updateDraft({ altContact: e.target.value })}
              onBlur={() => blurField('altContact')}
            />
          </Group>

          <Group legend="Preferences">
            <ProfileSelectField
              id={id('language')}
              label="Language"
              options={LANGUAGES.map((l) => ({ ...l, description: l.label === LANGUAGE_ENGLISH[l.value] ? undefined : LANGUAGE_ENGLISH[l.value] }))}
              value={draft.language}
              onChange={(v) => updateDraft({ language: v })}
              placeholder="Choose a language"
              readOnly={saving}
            />
            <ProfileSelectField
              id={id('tz')}
              label="Time zone"
              options={[TIME_ZONE]}
              value={TIME_ZONE.value}
              onChange={() => undefined}
              placeholder=""
              locked="Managed by your administrator"
            />
            <ProfileSelectField
              id={id('date')}
              label="Date format"
              options={DATE_FORMATS}
              value={draft.dateFormat}
              onChange={(v) => updateDraft({ dateFormat: v })}
              placeholder="Choose a format"
              readOnly={saving}
            />
            <ProfileSelectField
              id={id('landing')}
              label="Default landing page"
              options={LANDING_PAGES.map((p) => ({ ...p, icon: LANDING_ICONS[p.value] }))}
              value={draft.landing}
              onChange={(v) => updateDraft({ landing: v })}
              placeholder="Choose a page"
              readOnly={saving}
            />
          </Group>
        </form>
      </ProfileCard>
    </>
  );
};
