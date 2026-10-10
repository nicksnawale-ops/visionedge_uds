/**
 * The generic record's sections, shared by the Single-page, Sectioned, Edit and Drawer patterns.
 * Every section takes the same form state, so values carry over between patterns.
 */
import React from 'react';
import { Building2, CircleCheck, CirclePause, User } from 'lucide-react';
import { CATEGORIES, RecordData, categoryLabel, formatBytes, formatDate, formatRupees } from '../data/sampleRecord';
import type { FormState } from '../foundations/useFormState';
import { FieldPair, FormSection } from '../foundations/FormSection';
import { TextField } from '../fields/TextField';
import { PhoneField } from '../fields/PhoneField';
import { SelectField } from '../fields/SelectField';
import { AddressBlock } from '../fields/AddressBlock';
import { TextareaField } from '../fields/TextareaField';
import { FileDropzone } from '../fields/FileDropzone';
import { RadioCards, RadioGroupField, ToggleField } from '../fields/ChoiceFields';
import { TagsInput } from '../fields/TagsInput';
import { DateRangeField } from '../fields/DateRangeField';
import { NumberField } from '../fields/NumberField';
import { CurrencyField } from '../fields/CurrencyField';
import { Repeater } from '../fields/Repeater';
import { ConditionalReveal, ConsentCheckbox, LockedField } from '../fields/SmallFields';
import { ReadOnlyValue } from '../fields/FieldShell';
import { formatPhone } from '../../register/registerStates';

export interface SectionProps {
  form: FormState<RecordData>;
  p: string;
  readOnly?: boolean;
  /** Edit pattern: highlight changed fields. */
  showChanges?: boolean;
  announce?: (m: string) => void;
  marker?: (n: number) => React.ReactNode;
}

/** Element id for an error key (error summary links). */
export const idFor = (p: string, key: string): string => {
  const c = /^contacts\.(\d+)\.(name|phone)$/.exec(key);
  if (c) return `${p}-contacts-${c[1]}-${c[2]}`;
  if (key === 'startDate') return `${p}-dates-start`;
  if (key === 'endDate') return `${p}-dates-end`;
  return `${p}-${key}`;
};

/** 3px Royal Blue left bar + "Modified" tag on a changed field (Edit record). */
export const Modified: React.FC<{ on: boolean; children: React.ReactNode }> = ({ on, children }) =>
  on ? (
    <div className="relative -ml-4 pl-[13px] border-l-[3px] border-[#1E63FF] @min-[768px]:-ml-6 @min-[768px]:pl-[21px]">
      <span className="absolute right-0 -top-0.5 text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#1E63FF]">
        Modified<span className="sr-only"> field</span>
      </span>
      {children}
    </div>
  ) : (
    <>{children}</>
  );

const STATUS_OPTIONS = [
  { value: 'active' as const, label: 'Active', description: 'Can be used straight away.', icon: CircleCheck },
  { value: 'inactive' as const, label: 'Inactive', description: 'Saved but hidden from lists.', icon: CirclePause },
];

export const BasicSection: React.FC<SectionProps & { title?: string }> = ({ form, p, readOnly, showChanges, marker, title = 'Basic information' }) => {
  const { values: v, set, errors, touch, changed } = form;
  const ch = (k: keyof RecordData) => Boolean(showChanges && changed.includes(k));
  return (
    <FormSection id={`${p}-sec-basic`} title={title} description="What this record is and whether it's in use." overlay={marker?.(5)}>
      <div className="relative">
        {marker?.(6)}
        <Modified on={ch('name')}>
          <TextField id={`${p}-name`} label="Name" placeholder="e.g. Sharma Logistics Pvt Ltd" helper="The full registered name." value={v.name} onChange={(x) => set('name', x)} onBlur={() => touch('name')} error={errors.name} readOnly={readOnly} />
        </Modified>
      </div>
      <Modified on={ch('category')}>
        <SelectField id={`${p}-category`} label="Category" options={CATEGORIES} value={v.category} onChange={(x) => (set('category', x), touch('category'))} onBlur={() => touch('category')} placeholder="Choose a category" error={errors.category} readOnly={readOnly} />
      </Modified>
      <LockedField id={`${p}-reference`} label="Reference ID" value={v.referenceId} reason="Generated automatically. It can't be changed." mono />
      <Modified on={ch('status')}>
        <RadioCards id={`${p}-status`} label="Status" options={STATUS_OPTIONS} value={v.status} onChange={(x) => set('status', x)} readOnly={readOnly} />
      </Modified>
    </FormSection>
  );
};

export const ContactSection: React.FC<SectionProps> = ({ form, p, readOnly, showChanges }) => {
  const { values: v, set, errors, touch, changed } = form;
  const ch = (k: keyof RecordData) => Boolean(showChanges && changed.includes(k));
  return (
    <FormSection id={`${p}-sec-contact`} title="Contact" description="How to reach this record's owner.">
      <Modified on={ch('email')}>
        <TextField id={`${p}-email`} label="Email" type="email" autoComplete="email" placeholder="name@example.in" value={v.email} onChange={(x) => set('email', x)} onBlur={() => touch('email')} error={errors.email} readOnly={readOnly} />
      </Modified>
      <Modified on={ch('phone')}>
        <PhoneField id={`${p}-phone`} value={v.phone} onChange={(x) => set('phone', x)} onBlur={() => touch('phone')} error={errors.phone} readOnly={readOnly} />
      </Modified>
      <Modified on={ch('altContact')}>
        <TextField id={`${p}-altContact`} label="Alternate contact" optional helper="An email or another phone number." value={v.altContact} onChange={(x) => set('altContact', x)} onBlur={() => touch('altContact')} error={errors.altContact} readOnly={readOnly} />
      </Modified>
    </FormSection>
  );
};

export const AddressSection: React.FC<SectionProps> = ({ form, p, readOnly, showChanges, announce, marker }) => {
  const { values: v, patch, errors, touch, changed } = form;
  const any = Boolean(showChanges && (['line1', 'line2', 'city', 'state', 'pin'] as (keyof RecordData)[]).some((k) => changed.includes(k)));
  return (
    <FormSection id={`${p}-sec-address`} title="Address" description="The registered address in India.">
      <Modified on={any}>
        <AddressBlock
          idPrefix={p}
          value={{ line1: v.line1, line2: v.line2, city: v.city, state: v.state, pin: v.pin }}
          onChange={patch}
          errors={{ line1: errors.line1, city: errors.city, state: errors.state, pin: errors.pin }}
          onBlur={(f) => touch(f)}
          readOnly={readOnly}
          announce={announce}
          overlay={marker?.(7)}
        />
      </Modified>
    </FormSection>
  );
};

export const NotesSection: React.FC<SectionProps> = ({ form, p, readOnly, showChanges }) => (
  <FormSection id={`${p}-sec-notes`} title="Notes" description="Anything the team should know.">
    <Modified on={Boolean(showChanges && form.changed.includes('notes'))}>
      <TextareaField id={`${p}-notes`} label="Notes" optional max={500} value={form.values.notes} onChange={(x) => form.set('notes', x)} onBlur={() => form.touch('notes')} error={form.errors.notes} readOnly={readOnly} />
    </Modified>
  </FormSection>
);

export const AttachmentsSection: React.FC<SectionProps> = ({ form, p, readOnly }) => (
  <FormSection id={`${p}-sec-attachments`} title="Attachments" description="Registration certificates, contracts or photos.">
    <FileDropzone id={`${p}-attachments`} label="Files" optional files={form.values.attachments} onChange={(f) => form.set('attachments', f)} accept={['.pdf', '.jpg', '.png']} maxBytes={10_000_000} readOnly={readOnly} />
  </FormSection>
);

/* ── Sectioned form only ── */

const ENTITY_OPTIONS = [
  { value: 'organization' as const, label: 'Organization', description: 'A company, trust or institution.', icon: Building2 },
  { value: 'individual' as const, label: 'Individual', description: 'A person working on their own.', icon: User },
];

export const ClassificationSection: React.FC<SectionProps> = ({ form, p, readOnly }) => {
  const { values: v, set, errors, touch } = form;
  return (
    <FormSection id={`${p}-sec-classification`} title="Classification" description="How this record is grouped and scheduled.">
      <RadioCards
        id={`${p}-entityType`}
        label="Entity type"
        options={ENTITY_OPTIONS}
        value={v.entityType}
        onChange={(x) => (set('entityType', x), touch('entityType'))}
        error={errors.entityType}
        readOnly={readOnly}
      />
      <ConditionalReveal show={v.entityType === 'organization'}>
        <TextField id={`${p}-gstin`} label="GSTIN" mono placeholder="27AAACS1234F1Z5" helper="15 characters, from the GST registration certificate." value={v.gstin} onChange={(x) => set('gstin', x.toUpperCase())} onBlur={() => touch('gstin')} error={errors.gstin} readOnly={readOnly} />
      </ConditionalReveal>
      <RadioGroupField
        id={`${p}-priority`}
        label="Priority"
        options={[
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ]}
        value={v.priority}
        onChange={(x) => set('priority', x as RecordData['priority'])}
        readOnly={readOnly}
      />
      <TagsInput id={`${p}-tags`} label="Tags" optional value={v.tags} onChange={(x) => set('tags', x)} readOnly={readOnly} />
      <DateRangeField
        idPrefix={`${p}-dates`}
        start={v.startDate}
        end={v.endDate}
        onStart={(x) => set('startDate', x)}
        onEnd={(x) => set('endDate', x)}
        onBlurStart={() => touch('startDate')}
        onBlurEnd={() => touch('endDate')}
        startError={errors.startDate}
        endError={errors.endDate}
        readOnly={readOnly}
      />
      <FieldPair>
        <NumberField id={`${p}-capacity`} label="Capacity" optional unit="people" value={v.capacity} onChange={(x) => set('capacity', x)} onBlur={() => touch('capacity')} error={errors.capacity} readOnly={readOnly} />
        <CurrencyField id={`${p}-budget`} label="Annual budget" optional helper="In rupees, without paise." value={v.budget} onChange={(x) => set('budget', x)} readOnly={readOnly} />
      </FieldPair>
    </FormSection>
  );
};

export const AdditionalSection: React.FC<SectionProps> = ({ form, p, readOnly, announce, marker }) => (
  <FormSection id={`${p}-sec-additional`} title="Additional information" description="People to contact and anything else worth knowing.">
    <Repeater
      idPrefix={`${p}-contacts`}
      rows={form.values.contacts}
      onChange={(r) => form.set('contacts', r)}
      errors={form.errors}
      onBlur={form.touch}
      readOnly={readOnly}
      announce={announce}
      overlay={marker?.(8)}
    />
    <TextareaField id={`${p}-notes`} label="Notes" optional max={500} value={form.values.notes} onChange={(x) => form.set('notes', x)} readOnly={readOnly} />
  </FormSection>
);

export const DocumentsSection: React.FC<SectionProps> = ({ form, p, readOnly }) => (
  <FormSection id={`${p}-sec-documents`} title="Documents & consent" description="Supporting documents and your confirmation.">
    <FileDropzone id={`${p}-documents`} label="Documents" optional files={form.values.documents} onChange={(f) => form.set('documents', f)} accept={['.pdf', '.jpg', '.png']} maxBytes={10_000_000} readOnly={readOnly} />
    <ToggleField label="Notify the owner by email" description="Sends a confirmation to the contact email when the record is created." checked={form.values.notifyOwner} onChange={(x) => form.set('notifyOwner', x)} disabled={readOnly} />
    <ConsentCheckbox id={`${p}-consent`} checked={form.values.consent} onChange={(x) => (form.set('consent', x), form.touch('consent'))} error={form.errors.consent} readOnly={readOnly} />
  </FormSection>
);

/* ── Read-only view ── */

export const RecordReadOnly: React.FC<{ v: RecordData; extended?: boolean }> = ({ v, extended = false }) => {
  const groups: { title: string; rows: [string, React.ReactNode, boolean?][] }[] = [
    {
      title: 'Basic information',
      rows: [
        ['Name', v.name],
        ['Category', categoryLabel(v.category)],
        ['Reference ID', v.referenceId, true],
        ['Status', v.status === 'active' ? 'Active' : 'Inactive'],
      ],
    },
    {
      title: 'Contact',
      rows: [
        ['Email', v.email],
        ['Phone', v.phone ? `+91 ${formatPhone(v.phone)}` : ''],
        ['Alternate contact', v.altContact],
      ],
    },
    {
      title: 'Address',
      rows: [
        ['Address', [v.line1, v.line2].filter(Boolean).join(', ')],
        ['City', v.city],
        ['State', v.state],
        ['PIN code', v.pin, true],
      ],
    },
    ...(extended
      ? [
          {
            title: 'Classification',
            rows: [
              ['Entity type', v.entityType === 'organization' ? 'Organization' : v.entityType === 'individual' ? 'Individual' : ''],
              ['GSTIN', v.gstin, true],
              ['Dates', [formatDate(v.startDate), formatDate(v.endDate)].filter(Boolean).join(' – ')],
              ['Annual budget', formatRupees(v.budget)],
            ] as [string, React.ReactNode, boolean?][],
          },
        ]
      : []),
    { title: 'Notes', rows: [['Notes', v.notes]] },
    { title: 'Attachments', rows: [['Files', v.attachments.map((a) => `${a.name} (${formatBytes(a.size)})`).join(', ')]] },
  ];
  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <FormSection key={g.title} title={g.title}>
          <dl className="grid grid-cols-1 @min-[640px]:grid-cols-2 gap-x-6 gap-y-4">
            {g.rows.map(([label, value, mono]) => (
              <ReadOnlyValue key={label} label={label} value={value} mono={mono} />
            ))}
          </dl>
        </FormSection>
      ))}
    </div>
  );
};
