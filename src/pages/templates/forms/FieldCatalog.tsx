/** Field Catalog: every field live, with a state switch, a usage note and a copyable snippet. */
import React, { useState } from 'react';
import { Building2, User } from 'lucide-react';
import { CodeBlock } from '../../../components/common/CodeBlock';
import { ToastProvider } from '../../../components/common/Toast';
import { Segmented } from '../dashboard/primitives';
import { CATEGORIES, ContactPerson, UploadedFile } from './data/sampleRecord';
import { TextField } from './fields/TextField';
import { PhoneField } from './fields/PhoneField';
import { NumberField } from './fields/NumberField';
import { CurrencyField } from './fields/CurrencyField';
import { PercentageField } from './fields/PercentageField';
import { DateField } from './fields/DateField';
import { DateRangeField } from './fields/DateRangeField';
import { TimeField } from './fields/TimeField';
import { SelectField } from './fields/SelectField';
import { ComboboxField } from './fields/ComboboxField';
import { CheckboxGroup, MultiSelectChips, RadioCards, RadioGroupField, ToggleField } from './fields/ChoiceFields';
import { SliderField } from './fields/SliderField';
import { TextareaField } from './fields/TextareaField';
import { TagsInput } from './fields/TagsInput';
import { FileDropzone } from './fields/FileDropzone';
import { ImageUpload } from './fields/ImageUpload';
import { AddressBlock, AddressValue } from './fields/AddressBlock';
import { Repeater } from './fields/Repeater';
import { ConditionalReveal, ConsentCheckbox, LockedField } from './fields/SmallFields';

type Mode = 'default' | 'filled' | 'error' | 'disabled' | 'read-only';
const MODES: { id: Mode; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'filled', label: 'Filled' },
  { id: 'error', label: 'Error' },
  { id: 'disabled', label: 'Disabled' },
  { id: 'read-only', label: 'Read-only' },
];

interface Entry {
  name: string;
  note: string;
  code: string;
  /** Modes that make sense for this field (default: all). */
  modes?: Mode[];
  Demo: React.FC<{ mode: Mode; id: string }>;
}

/** Shared state helper: a value that resets to the mode's sample when the mode changes. */
function useModeValue<T>(mode: Mode, empty: T, filled: T): [T, (v: T) => void] {
  const [state, setState] = useState<{ mode: Mode; value: T }>({ mode, value: mode === 'default' ? empty : filled });
  if (state.mode !== mode) {
    const value = mode === 'default' ? empty : filled;
    setState({ mode, value });
    return [value, (v) => setState({ mode, value: v })];
  }
  return [state.value, (v) => setState({ mode, value: v })];
}

const flags = (mode: Mode) => ({ disabled: mode === 'disabled', readOnly: mode === 'read-only' });

const ENTRIES: Entry[] = [
  {
    name: 'Text',
    note: 'Names and short free text. Label above, helper for format hints.',
    code: `<TextField id="name" label="Name" value={v} onChange={setV} onBlur={() => touch('name')} error={errors.name} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue(mode, '', 'Sharma Logistics Pvt Ltd');
      return <TextField id={id} label="Name" helper="The full registered name." value={mode === 'error' ? '' : v} onChange={set} error={mode === 'error' ? 'Enter a name' : undefined} {...flags(mode)} />;
    },
  },
  {
    name: 'Email',
    note: 'type="email" for the right keyboard; validate on blur with a specific message.',
    code: `<TextField id="email" type="email" label="Email" value={v} onChange={setV} error={errors.email} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue(mode, '', 'accounts@sharmalogistics.in');
      return <TextField id={id} type="email" label="Email" placeholder="name@example.in" value={mode === 'error' ? 'accounts@sharma' : v} onChange={set} error={mode === 'error' ? 'Enter an email like name@example.in' : undefined} {...flags(mode)} />;
    },
  },
  {
    name: 'Phone (+91)',
    note: 'The Register PhoneInput: fixed +91, 10 digits grouped 5 + 5.',
    modes: ['default', 'filled', 'error', 'read-only'],
    code: `<PhoneField id="phone" value={digits} onChange={setDigits} error={errors.phone} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue(mode, '', '9822014578');
      return <PhoneField id={id} value={mode === 'error' ? '98220' : v} onChange={set} error={mode === 'error' ? 'Enter a 10-digit mobile number' : undefined} readOnly={mode === 'read-only'} />;
    },
  },
  {
    name: 'Number with unit',
    note: 'Unit as a suffix ("kg", "min", "people"); only digits are accepted.',
    code: `<NumberField id="capacity" label="Capacity" unit="people" value={v} onChange={setV} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue(mode, '', '40');
      return <NumberField id={id} label="Capacity" unit="people" value={mode === 'error' ? '0' : v} onChange={set} error={mode === 'error' ? 'Capacity must be more than 0' : undefined} {...flags(mode)} />;
    },
  },
  {
    name: 'Currency (₹)',
    note: '₹ prefix with Indian grouping as you type: 1,25,000. The value stays digits.',
    code: `<CurrencyField id="budget" label="Annual budget" value={digits} onChange={setDigits} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue(mode, '', '125000');
      return <CurrencyField id={id} label="Annual budget" value={v} onChange={set} error={mode === 'error' ? 'Enter an amount up to ₹10,00,00,000' : undefined} {...flags(mode)} />;
    },
  },
  {
    name: 'Percentage',
    note: '0–100 with one decimal place; the "%" suffix states the unit.',
    code: `<PercentageField id="discount" label="Discount" value={v} onChange={setV} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue(mode, '', '12.5');
      return <PercentageField id={id} label="Discount" value={v} onChange={set} error={mode === 'error' ? 'Enter a percentage between 0 and 100' : undefined} {...flags(mode)} />;
    },
  },
  {
    name: 'Date',
    note: 'Type "30 Sep 2026" or pick from the calendar (arrow keys, Page Up/Down).',
    code: `<DateField id="start" label="Start date" value={iso} onChange={setIso} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue(mode, '', '2026-09-30');
      return <DateField id={id} label="Start date" value={v} onChange={set} error={mode === 'error' ? 'Choose a start date' : undefined} {...flags(mode)} />;
    },
  },
  {
    name: 'Date range',
    note: 'A two-column pair; the end calendar can’t go before the start.',
    modes: ['default', 'filled', 'error', 'read-only'],
    code: `<DateRangeField idPrefix="dates" start={s} end={e} onStart={setS} onEnd={setE} endError={errors.endDate} />`,
    Demo: ({ mode, id }) => {
      const [s, setS] = useModeValue(mode, '', '2026-10-01');
      const [e, setE] = useModeValue(mode, '', mode === 'error' ? '2026-09-15' : '2027-09-30');
      return <DateRangeField idPrefix={id} start={s} end={e} onStart={setS} onEnd={setE} endError={mode === 'error' ? 'End date must be after start date' : undefined} readOnly={mode === 'read-only'} />;
    },
  },
  {
    name: 'Time',
    note: '24-hour times in IST, every 15 minutes, in JetBrains Mono.',
    code: `<TimeField id="time" label="Visit time" value={v} onChange={setV} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue(mode, '', '14:30');
      return <TimeField id={id} label="Visit time" value={v} onChange={set} error={mode === 'error' ? 'Choose a time' : undefined} {...flags(mode)} />;
    },
  },
  {
    name: 'Select',
    note: 'Up to ~10 known options. Use the combobox when people need to search.',
    modes: ['default', 'filled', 'error', 'read-only'],
    code: `<SelectField id="category" label="Category" options={CATEGORIES} value={v} onChange={setV} placeholder="Choose a category" />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue(mode, '', 'vendor');
      return <SelectField id={id} label="Category" options={CATEGORIES} value={mode === 'error' ? '' : v} onChange={set} placeholder="Choose a category" error={mode === 'error' ? 'Choose a category' : undefined} readOnly={mode === 'read-only'} />;
    },
  },
  {
    name: 'Searchable combobox',
    note: 'Type to filter; ↑ ↓ and Enter; "No results" with an option to create.',
    code: `<ComboboxField id="city" label="City" options={cities} value={v} onChange={setV} onCreate={addCity} />`,
    Demo: ({ mode, id }) => {
      const [opts, setOpts] = useState(['Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Mumbai', 'New Delhi', 'Pune']);
      const [v, set] = useModeValue(mode, '', 'Pune');
      return <ComboboxField id={id} label="City" options={opts} value={v} onChange={set} onCreate={(c) => setOpts((o) => [...o, c].sort())} error={mode === 'error' ? 'Choose a city' : undefined} {...flags(mode)} />;
    },
  },
  {
    name: 'Multi-select chips',
    note: 'A few options where several can apply. Each chip is a toggle button.',
    modes: ['default', 'filled', 'error', 'disabled'],
    code: `<MultiSelectChips id="days" label="Working days" options={DAYS} value={days} onChange={setDays} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue<string[]>(mode, [], ['mon', 'tue', 'wed']);
      const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((d) => ({ value: d, label: d[0].toUpperCase() + d.slice(1) }));
      return <MultiSelectChips id={id} label="Working days" options={days} value={mode === 'error' ? [] : v} onChange={set} error={mode === 'error' ? 'Choose at least one day' : undefined} disabled={mode === 'disabled'} />;
    },
  },
  {
    name: 'Radio group',
    note: '2–5 short options that all deserve to be seen.',
    code: `<RadioGroupField id="priority" label="Priority" options={PRIORITIES} value={v} onChange={setV} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue<'' | 'low' | 'medium' | 'high'>(mode, '', 'medium');
      return (
        <RadioGroupField
          id={id}
          label="Priority"
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
          value={mode === 'error' ? '' : v}
          onChange={set}
          error={mode === 'error' ? 'Choose a priority' : undefined}
          {...flags(mode)}
        />
      );
    },
  },
  {
    name: 'Radio cards',
    note: 'Choices that need a description. Selected: 1.5px Royal Blue border, 8% fill, check.',
    code: `<RadioCards id="type" label="Entity type" options={[{ value: 'organization', label: 'Organization', icon: Building2 }, …]} value={v} onChange={setV} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue<'' | 'organization' | 'individual'>(mode, '', 'organization');
      return (
        <RadioCards
          id={id}
          label="Entity type"
          options={[
            { value: 'organization', label: 'Organization', description: 'A company, trust or institution.', icon: Building2 },
            { value: 'individual', label: 'Individual', description: 'A person working on their own.', icon: User },
          ]}
          value={mode === 'error' ? '' : v}
          onChange={set}
          error={mode === 'error' ? 'Choose an entity type' : undefined}
          {...flags(mode)}
        />
      );
    },
  },
  {
    name: 'Checkbox group',
    note: 'Independent yes/no choices in one group (fieldset + legend).',
    code: `<CheckboxGroup id="channels" label="Send updates by" options={CHANNELS} value={v} onChange={setV} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue<string[]>(mode, [], ['email']);
      return (
        <CheckboxGroup
          id={id}
          label="Send updates by"
          options={[
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'SMS', description: 'Standard rates may apply.' },
            { value: 'app', label: 'In-app' },
          ]}
          value={v}
          onChange={set}
          error={mode === 'error' ? 'Choose at least one channel' : undefined}
          {...flags(mode)}
        />
      );
    },
  },
  {
    name: 'Toggle with description',
    note: 'Takes effect as a setting; the description says what happens.',
    modes: ['default', 'filled', 'disabled'],
    code: `<ToggleField label="Notify the owner by email" description="Sends a confirmation…" checked={on} onChange={setOn} />`,
    Demo: ({ mode }) => {
      const [v, set] = useModeValue(mode, false, true);
      return <ToggleField label="Notify the owner by email" description="Sends a confirmation to the contact email when the record is created." checked={v} onChange={set} disabled={mode === 'disabled'} />;
    },
  },
  {
    name: 'Slider with value box',
    note: 'A number in a known range; the value box can be typed into.',
    modes: ['default', 'filled', 'disabled'],
    code: `<SliderField id="threshold" label="Match threshold" min={50} max={99} unit="%" value={v} onChange={setV} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue(mode, 75, 90);
      return <SliderField id={id} label="Match threshold" helper={`Matches below ${v}% need a review.`} min={50} max={99} unit="%" value={v} onChange={set} disabled={mode === 'disabled'} />;
    },
  },
  {
    name: 'Textarea with counter',
    note: 'Longer text; the counter turns bold near the limit.',
    code: `<TextareaField id="notes" label="Notes" optional max={500} value={v} onChange={setV} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue(mode, '', 'Preferred vendor for gate barrier maintenance across both campuses. Call before visiting.');
      return <TextareaField id={id} label="Notes" optional max={500} value={v} onChange={set} error={mode === 'error' ? 'Use 500 characters or fewer' : undefined} {...flags(mode)} />;
    },
  },
  {
    name: 'Tags input',
    note: 'Enter or comma adds; Backspace removes the last tag.',
    modes: ['default', 'filled', 'disabled'],
    code: `<TagsInput id="tags" label="Tags" optional value={tags} onChange={setTags} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue<string[]>(mode, [], ['Transport', 'Maintenance']);
      return <TagsInput id={id} label="Tags" optional value={v} onChange={set} disabled={mode === 'disabled'} />;
    },
  },
  {
    name: 'File upload',
    note: 'Drag and drop or choose; per-file progress, Remove and specific errors.',
    modes: ['default', 'filled', 'error', 'read-only'],
    code: `<FileDropzone id="files" label="Files" files={files} onChange={setFiles} accept={['.pdf', '.jpg', '.png']} maxBytes={10_000_000} />`,
    Demo: ({ mode, id }) => {
      const sample: UploadedFile[] =
        mode === 'error' ? [{ id: 'e1', name: 'site-survey-scan.pdf', size: 14_200_000, progress: 0, error: 'This file is larger than 10.0 MB. Choose a smaller file.' }] : [{ id: 'f1', name: 'registration-certificate.pdf', size: 482_000, progress: 100 }];
      const [v, set] = useModeValue<UploadedFile[]>(mode, [], sample);
      return <FileDropzone id={id} label="Files" optional files={v} onChange={set} accept={['.pdf', '.jpg', '.png']} maxBytes={10_000_000} readOnly={mode === 'read-only'} />;
    },
  },
  {
    name: 'Image upload',
    note: 'Preview, Replace, Remove and a Crop link (the Profile crop tool).',
    modes: ['default', 'error', 'read-only'],
    code: `<ImageUpload id="logo" label="Logo" optional value={src} onChange={setSrc} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useState('');
      return <ImageUpload id={id} label="Logo" optional value={v} onChange={set} error={mode === 'error' ? 'This file is larger than 2 MB. Choose a smaller image.' : undefined} readOnly={mode === 'read-only'} />;
    },
  },
  {
    name: 'Address block',
    note: 'Indian address with State select and PIN code; try 411001 to fill city and state.',
    modes: ['default', 'filled', 'error', 'read-only'],
    code: `<AddressBlock idPrefix="addr" value={address} onChange={(p) => setAddress({ ...address, ...p })} errors={errors} onBlur={touch} />`,
    Demo: ({ mode, id }) => {
      const empty: AddressValue = { line1: '', line2: '', city: '', state: '', pin: '' };
      const [v, set] = useModeValue<AddressValue>(mode, empty, { line1: 'Plot 14, MIDC Bhosari', line2: '', city: 'Pune', state: 'Maharashtra', pin: '411026' });
      return <AddressBlock idPrefix={id} value={mode === 'error' ? { ...v, pin: '41102' } : v} onChange={(p) => set({ ...v, ...p })} errors={mode === 'error' ? { pin: 'Enter a 6-digit PIN code' } : {}} onBlur={() => undefined} readOnly={mode === 'read-only'} />;
    },
  },
  {
    name: 'Repeater',
    note: 'Rows of grouped fields; "+ Add another" up to 5, Remove per row.',
    modes: ['default', 'filled', 'error', 'read-only'],
    code: `<Repeater idPrefix="contacts" rows={rows} onChange={setRows} errors={errors} onBlur={touch} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue<ContactPerson[]>(mode, [], [{ id: 1, name: mode === 'error' ? '' : 'Anil Sharma', role: 'Director', phone: '9822014578' }]);
      return <Repeater idPrefix={id} rows={v} onChange={set} errors={mode === 'error' ? { 'contacts.1.name': 'Enter the contact’s name' } : {}} onBlur={() => undefined} readOnly={mode === 'read-only'} />;
    },
  },
  {
    name: 'Conditional fields',
    note: 'Appear when a choice needs them, with a 150ms reveal.',
    modes: ['default', 'filled'],
    code: `<RadioGroupField … />\n<ConditionalReveal show={type === 'organization'}>\n  <TextField id="gstin" label="GSTIN" … />\n</ConditionalReveal>`,
    Demo: ({ mode, id }) => {
      const [t, setT] = useModeValue<'' | 'organization' | 'individual'>(mode, '', 'organization');
      const [g, setG] = useState('');
      return (
        <div className="space-y-4">
          <RadioGroupField
            id={id}
            label="Registering as"
            options={[
              { value: 'organization', label: 'Organization' },
              { value: 'individual', label: 'Individual' },
            ]}
            value={t}
            onChange={setT}
          />
          <ConditionalReveal show={t === 'organization'}>
            <TextField id={`${id}-gstin`} label="GSTIN" mono placeholder="27AAACS1234F1Z5" value={g} onChange={(x) => setG(x.toUpperCase())} />
          </ConditionalReveal>
        </div>
      );
    },
  },
  {
    name: 'Locked field',
    note: 'Managed elsewhere: read-only with a Lock icon and the reason.',
    modes: ['default'],
    code: `<LockedField id="ref" label="Reference ID" value="REC-2026-0142" reason="Generated automatically." mono />`,
    Demo: ({ id }) => <LockedField id={id} label="Reference ID" value="REC-2026-0142" reason="Generated automatically. It can't be changed." mono />,
  },
  {
    name: 'Consent checkbox',
    note: 'Required agreement with inline links; never pre-ticked.',
    modes: ['default', 'filled', 'error', 'read-only'],
    code: `<ConsentCheckbox id="consent" checked={ok} onChange={setOk} error={errors.consent} />`,
    Demo: ({ mode, id }) => {
      const [v, set] = useModeValue(mode, false, true);
      return <ConsentCheckbox id={id} checked={mode === 'error' ? false : v} onChange={set} error={mode === 'error' ? 'Agree to the terms to continue' : undefined} readOnly={mode === 'read-only'} />;
    },
  },
];

const CatalogCard: React.FC<{ entry: Entry; index: number }> = ({ entry, index }) => {
  const [mode, setMode] = useState<Mode>('default');
  const [code, setCode] = useState(false);
  const modes = MODES.filter((m) => !entry.modes || entry.modes.includes(m.id));
  const Demo = entry.Demo;
  return (
    <li className="rounded-[12px] border border-[#DDE2EA] bg-white p-5 flex flex-col gap-4 min-w-0">
      <div>
        <h3 className="text-[15px] font-semibold text-[#121722]">{entry.name}</h3>
        <p className="mt-0.5 text-[13px] leading-[20px] text-[#4B5465]">{entry.note}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {modes.length > 1 ? <Segmented label={`${entry.name} state`} options={modes} value={mode} onChange={setMode} /> : <span />}
        <button type="button" aria-pressed={code} onClick={() => setCode((c) => !c)} className="h-9 px-3 rounded-[8px] text-[13px] font-semibold text-[#1E63FF] hover:bg-[#EEF1F6] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]">
          {code ? 'Hide code' : 'Code'}
        </button>
      </div>
      <div className="@container rounded-[8px] bg-[#F7F9FC] p-4">
        <Demo mode={mode} id={`catalog-${index}`} />
      </div>
      {code && <CodeBlock code={entry.code} filename="example.tsx" />}
      <p className="text-[12px] text-[#6B7485]">Hover and focus states appear as you use the field.</p>
    </li>
  );
};

export const FieldCatalog: React.FC = () => (
  <ToastProvider>
    <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {ENTRIES.map((e, i) => (
        <CatalogCard key={e.name} entry={e} index={i} />
      ))}
    </ul>
  </ToastProvider>
);

export const FIELD_COUNT = ENTRIES.length;
