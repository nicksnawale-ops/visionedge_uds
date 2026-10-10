/**
 * Typed validators. Message patterns: "Enter …" for typed values, "Choose …" for choices,
 * "… must be …" for relationships. Each returns an error message or undefined.
 */
import type { RecordData } from '../data/sampleRecord';

export type Validator = (value: string) => string | undefined;

export const required =
  (message: string): Validator =>
  (v) =>
    v.trim() ? undefined : message;

export const email: Validator = (v) => (!v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? undefined : 'Enter an email like name@example.in');
export const phone10: Validator = (v) => (!v || /^\d{10}$/.test(v) ? undefined : 'Enter a 10-digit mobile number');
export const pin6: Validator = (v) => (!v || /^\d{6}$/.test(v) ? undefined : 'Enter a 6-digit PIN code');
export const gstin: Validator = (v) => (!v || /^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]$/.test(v) ? undefined : 'Enter a 15-character GSTIN, like 27AAACS1234F1Z5');
export const maxLength =
  (n: number): Validator =>
  (v) =>
    v.length <= n ? undefined : `Use ${n} characters or fewer`;

/** Runs validators in order and returns the first message. */
export const first = (value: string, ...rules: Validator[]): string | undefined => {
  for (const rule of rules) {
    const m = rule(value);
    if (m) return m;
  }
  return undefined;
};

export type RecordErrors = Partial<Record<string, string>>;

/** Which parts of the record a form asks for. */
export type RecordScope = 'basic' | 'contact' | 'address' | 'notes' | 'classification' | 'additional' | 'documents' | 'quick';

/** Validates the record for the sections a form shows. Keys are field names (contacts as "contacts.<id>.name"). */
export function validateRecord(d: RecordData, scopes: RecordScope[]): RecordErrors {
  const e: RecordErrors = {};
  const has = (s: RecordScope) => scopes.includes(s);
  if (has('basic') || has('quick')) {
    e.name = first(d.name, required('Enter a name'), maxLength(80));
    e.category = d.category ? undefined : 'Choose a category';
  }
  if (has('contact') || has('quick')) {
    e.email = first(d.email, required('Enter an email address'), email);
    e.phone = first(d.phone, required('Enter a 10-digit mobile number'), phone10);
  }
  if (has('contact')) {
    e.altContact = d.altContact && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.altContact) && !/^\d{10}$/.test(d.altContact.replace(/\D/g, '')) ? 'Enter an email or a 10-digit phone number' : undefined;
  }
  if (has('address')) {
    e.line1 = required('Enter the first line of the address')(d.line1);
    e.city = required('Enter a city')(d.city);
    e.state = d.state ? undefined : 'Choose a state or union territory';
    e.pin = first(d.pin, required('Enter a 6-digit PIN code'), pin6);
  }
  if (has('quick')) e.city = required('Enter a city')(d.city);
  if (has('notes')) e.notes = maxLength(500)(d.notes);
  if (has('classification')) {
    e.entityType = d.entityType ? undefined : 'Choose an entity type';
    if (d.entityType === 'organization') e.gstin = first(d.gstin, required('Enter the GSTIN'), gstin);
    e.startDate = d.startDate ? undefined : 'Choose a start date';
    if (d.startDate && d.endDate && d.endDate <= d.startDate) e.endDate = 'End date must be after start date';
    if (d.capacity && Number(d.capacity) <= 0) e.capacity = 'Capacity must be more than 0';
  }
  if (has('additional')) {
    d.contacts.forEach((c) => {
      e[`contacts.${c.id}.name`] = required('Enter the contact’s name')(c.name);
      e[`contacts.${c.id}.phone`] = phone10(c.phone);
    });
  }
  if (has('documents')) e.consent = d.consent ? undefined : 'Agree to the terms to continue';
  return Object.fromEntries(Object.entries(e).filter(([, v]) => v)) as RecordErrors;
}

/** Human labels for the error summary. */
export const FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  category: 'Category',
  email: 'Email',
  phone: 'Phone',
  altContact: 'Alternate contact',
  line1: 'Address line 1',
  city: 'City',
  state: 'State',
  pin: 'PIN code',
  notes: 'Notes',
  entityType: 'Entity type',
  gstin: 'GSTIN',
  startDate: 'Start date',
  endDate: 'End date',
  capacity: 'Capacity',
  consent: 'Consent',
};

export const labelFor = (key: string): string => {
  const m = /^contacts\.(\d+)\.(name|phone)$/.exec(key);
  if (m) return `Contact person ${m[2] === 'name' ? 'name' : 'phone'}`;
  return FIELD_LABELS[key] ?? key;
};
