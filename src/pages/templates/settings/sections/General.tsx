import React, { useRef, useState } from 'react';
import { AlertCircle, CalendarDays, ImageIcon, Upload } from 'lucide-react';
import { Logo } from '../../../../components/brand/Logo';
import { BUTTON, LINK, Modal } from '../../profile/ui';
import { useSettings } from '../SettingsContext';
import { OPTIONS } from '../data/settingsIndex';
import { HOLIDAYS } from '../data/system';
import { SectionCard } from '../patterns/SectionCard';
import { BoundRow, RadioGroup, RowInput, RowSelect } from '../patterns/SettingRow';
import { ToggleChips } from '../patterns/ChipsInput';
import { TimeRangeSelect } from '../patterns/TimeRangeSelect';

const MAX_LOGO = 1024 * 1024;

/** Logo tile + Upload / Remove. The organization logo is a form value (saved with the bar). */
const LogoControl: React.FC<{ disabled: boolean; describedBy: string; labelId: string }> = ({ disabled, describedBy, labelId }) => {
  const { values, set, viewOnly } = useSettings();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const src = String(values['org.logo'] ?? '');

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-16 h-16 rounded-[8px] border border-[#DDE2EA] bg-[#F7F9FC] flex items-center justify-center overflow-hidden shrink-0">
          {src ? <img src={src} alt="Organization logo preview" className="max-w-full max-h-full object-contain" /> : <ImageIcon className="w-6 h-6 text-[#8C95A6]" aria-hidden="true" />}
        </span>
        {!viewOnly && (
          <>
            <button type="button" disabled={disabled} onClick={() => fileRef.current?.click()} aria-describedby={describedBy} className={`${BUTTON.secondary} disabled:opacity-50`}>
              <Upload className="w-4 h-4" aria-hidden="true" />
              Upload
              <span className="sr-only"> organization logo</span>
            </button>
            {src && (
              <button type="button" disabled={disabled} onClick={() => set('org.logo', '')} className={BUTTON.ghost}>
                Remove
                <span className="sr-only"> organization logo</span>
              </button>
            )}
          </>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/svg+xml,image/png"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        aria-labelledby={labelId}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (!file) return;
          if (!['image/svg+xml', 'image/png'].includes(file.type)) return setError("This file isn't an SVG or PNG. Choose an SVG or PNG logo.");
          if (file.size > MAX_LOGO) return setError('This file is larger than 1 MB. Choose a smaller logo.');
          setError('');
          set('org.logo', URL.createObjectURL(file));
        }}
      />
      <p className="mt-2 text-[12px] leading-[16px] text-[#4B5465]">SVG or PNG, max 1 MB. Shown in reports and emails.</p>
      <p className="mt-1 flex items-center gap-1.5 text-[12px] leading-[16px] text-[#6B7485]">
        <Logo size={16} /> The VisionEdge logo always appears in the product and can’t be replaced.
      </p>
      <div aria-live="polite">
        {error && (
          <p className="mt-1.5 flex items-start gap-1.5 text-[12px] leading-[16px] font-medium text-[#0B2D6B]">
            <AlertCircle className="w-3.5 h-3.5 mt-px shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export const General: React.FC = () => {
  const { values, set, touch, marker } = useSettings();
  const [holidays, setHolidays] = useState(false);
  const str = (id: string) => String(values[id] ?? '');

  return (
    <>
      <SectionCard title="Organization" description="How your organization appears across VisionEdge." overlay={marker(5)}>
        <BoundRow id="org.name" overlay={marker(6, true)}>
          {(c) => <RowInput control={c} value={str('org.name')} onChange={(v) => set('org.name', v)} onBlur={() => touch('org.name')} />}
        </BoundRow>
        <BoundRow id="org.short">
          {(c) => <RowInput control={c} value={str('org.short')} onChange={(v) => set('org.short', v)} onBlur={() => touch('org.short')} />}
        </BoundRow>
        <BoundRow id="org.logo" group>
          {(c) => <LogoControl disabled={c.disabled} describedBy={c.describedBy} labelId={c.labelId} />}
        </BoundRow>
        <BoundRow id="org.industry">
          {(c) => <RowSelect control={c} options={OPTIONS.industry} value={str('org.industry')} onChange={(v) => set('org.industry', v)} />}
        </BoundRow>
      </SectionCard>

      <SectionCard title="Regional" description="Formats for dates, times and languages.">
        <BoundRow id="regional.timezone">
          {(c) => <RowSelect control={c} options={OPTIONS.timezone} value={str('regional.timezone')} onChange={(v) => set('regional.timezone', v)} />}
        </BoundRow>
        <BoundRow id="regional.dateFormat">
          {(c) => <RowSelect control={c} options={OPTIONS.dateFormat} value={str('regional.dateFormat')} onChange={(v) => set('regional.dateFormat', v)} />}
        </BoundRow>
        <BoundRow id="regional.timeFormat" group>
          {(c) => <RadioGroup control={c} name="time-format" options={OPTIONS.timeFormat} value={str('regional.timeFormat')} onChange={(v) => set('regional.timeFormat', v)} />}
        </BoundRow>
        <BoundRow id="regional.language">
          {(c) => <RowSelect control={c} options={OPTIONS.language} value={str('regional.language')} onChange={(v) => set('regional.language', v)} />}
        </BoundRow>
        <BoundRow id="regional.weekStart" group>
          {(c) => <RadioGroup control={c} name="week-start" options={OPTIONS.weekStart} value={str('regional.weekStart')} onChange={(v) => set('regional.weekStart', v)} />}
        </BoundRow>
      </SectionCard>

      <SectionCard
        title="Working hours"
        description="Used by rules set to “Working hours” and by reports."
        actions={
          <button type="button" onClick={() => setHolidays(true)} className={LINK} data-setting-id="hours.holidays">
            <CalendarDays className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Holidays
          </button>
        }
      >
        <BoundRow id="hours.days" group>
          {(c) => (
            <ToggleChips
              options={OPTIONS.days}
              value={values['hours.days'] as string[]}
              onChange={(v) => {
                set('hours.days', v);
                touch('hours.days');
              }}
              labelledBy={c.labelId}
              describedBy={c.describedBy}
              disabled={c.disabled}
            />
          )}
        </BoundRow>
        <BoundRow id="hours.time" group>
          {(c) => (
            <div role="group" aria-labelledby={c.labelId}>
              <TimeRangeSelect
                idPrefix={c.id}
                name="Working hours"
                from={str('hours.from')}
                to={str('hours.to')}
                onFrom={(v) => {
                  set('hours.from', v);
                  touch('hours.time');
                }}
                onTo={(v) => {
                  set('hours.to', v);
                  touch('hours.time');
                }}
                disabled={c.disabled}
                invalid={c.invalid}
                describedBy={c.describedBy}
              />
            </div>
          )}
        </BoundRow>
      </SectionCard>

      <SectionCard title="Contact" description="Who users and VisionEdge support reach when something goes wrong.">
        <BoundRow id="contact.supportEmail">
          {(c) => (
            <RowInput control={c} type="email" value={str('contact.supportEmail')} onChange={(v) => set('contact.supportEmail', v)} onBlur={() => touch('contact.supportEmail')} />
          )}
        </BoundRow>
        <BoundRow id="contact.emergency">
          {(c) => (
            <RowInput
              control={c}
              type="tel"
              prefix="+91"
              mono
              value={str('contact.emergency')}
              onChange={(v) => set('contact.emergency', v.replace(/\D/g, '').slice(0, 10))}
              onBlur={() => touch('contact.emergency')}
            />
          )}
        </BoundRow>
      </SectionCard>

      {holidays && (
        <Modal
          title="Holidays"
          description="Non-working days for rules and reports. Synced from your academic calendar."
          onClose={() => setHolidays(false)}
          footer={
            <button type="button" onClick={() => setHolidays(false)} className={BUTTON.primary}>
              Done
            </button>
          }
        >
          <ul className="divide-y divide-[#EEF1F6] rounded-[8px] border border-[#DDE2EA]">
            {HOLIDAYS.map((h) => (
              <li key={h.date} className="flex items-center justify-between gap-4 px-4 h-11 text-[14px]">
                <span className="text-[#121722]">{h.name}</span>
                <span className="font-mono text-[13px] text-[#4B5465]">{h.date}</span>
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  );
};
