/** Generic sample record used by every pattern. Fictional, deterministic, Indian formats. */

export interface UploadedFile {
  id: string;
  name: string;
  /** Bytes. */
  size: number;
  /** 0–100 while uploading. */
  progress: number;
  error?: string;
}

export interface ContactPerson {
  id: number;
  name: string;
  role: string;
  phone: string;
}

export interface RecordData {
  /* Basic */
  name: string;
  category: string;
  referenceId: string;
  status: 'active' | 'inactive';
  /* Contact */
  email: string;
  phone: string;
  altContact: string;
  /* Address */
  line1: string;
  line2: string;
  city: string;
  state: string;
  pin: string;
  /* Notes and files */
  notes: string;
  attachments: UploadedFile[];
  /* Classification (sectioned form) */
  entityType: 'organization' | 'individual' | '';
  gstin: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  startDate: string;
  endDate: string;
  capacity: string;
  budget: string;
  /* Additional information */
  contacts: ContactPerson[];
  /* Documents & consent */
  documents: UploadedFile[];
  notifyOwner: boolean;
  consent: boolean;
}

export const REFERENCE_ID = 'REC-2026-0142';

export const CATEGORIES = [
  { value: 'vendor', label: 'Vendor' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'partner', label: 'Partner' },
  { value: 'facility', label: 'Facility' },
  { value: 'other', label: 'Other' },
];

export const emptyRecord = (): RecordData => ({
  name: '',
  category: '',
  referenceId: REFERENCE_ID,
  status: 'active',
  email: '',
  phone: '',
  altContact: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pin: '',
  notes: '',
  attachments: [],
  entityType: '',
  gstin: '',
  priority: 'medium',
  tags: [],
  startDate: '',
  endDate: '',
  capacity: '',
  budget: '',
  contacts: [],
  documents: [],
  notifyOwner: true,
  consent: false,
});

/** "Partially filled": the first sections done, address half-way. */
export const partialRecord = (): RecordData => ({
  ...emptyRecord(),
  name: 'Sharma Logistics Pvt Ltd',
  category: 'vendor',
  email: 'accounts@sharmalogistics.in',
  phone: '9822014578',
  line1: 'Plot 14, MIDC Bhosari',
  entityType: 'organization',
  tags: ['Transport'],
});

/** A complete, valid record (submitting, read-only, edit). */
export const fullRecord = (): RecordData => ({
  ...partialRecord(),
  line2: 'Near Telco Road',
  city: 'Pune',
  state: 'Maharashtra',
  pin: '411026',
  notes: 'Preferred vendor for gate barrier maintenance across both campuses.',
  attachments: [{ id: 'a1', name: 'registration-certificate.pdf', size: 482_000, progress: 100 }],
  gstin: '27AAACS1234F1Z5',
  priority: 'high',
  tags: ['Transport', 'Maintenance'],
  startDate: '2026-10-01',
  endDate: '2027-09-30',
  capacity: '40',
  budget: '125000',
  contacts: [{ id: 1, name: 'Anil Sharma', role: 'Director', phone: '9822014578' }],
  documents: [{ id: 'd1', name: 'pan-card.pdf', size: 210_000, progress: 100 }],
  consent: true,
});

/** "Validation errors": mistakes a real person makes. */
export const invalidRecord = (): RecordData => ({
  ...partialRecord(),
  email: 'accounts@sharmalogistics',
  pin: '41102',
  startDate: '2026-10-01',
  endDate: '2026-09-15',
});

/** Sample list for the drawer pattern. */
export interface ListRow {
  id: string;
  name: string;
  category: string;
  city: string;
  status: 'active' | 'inactive';
  created: string;
}

export const LIST_ROWS: ListRow[] = [
  { id: 'REC-2026-0141', name: 'Kulkarni Security Services', category: 'Contractor', city: 'Pune', status: 'active', created: '29 Sep 2026' },
  { id: 'REC-2026-0140', name: 'Deccan Facility Management', category: 'Facility', city: 'Pune', status: 'active', created: '27 Sep 2026' },
  { id: 'REC-2026-0139', name: 'Western Canteen Supplies', category: 'Vendor', city: 'Mumbai', status: 'inactive', created: '24 Sep 2026' },
  { id: 'REC-2026-0098', name: 'Sharma Logistics', category: 'Vendor', city: 'Pune', status: 'active', created: '02 Jul 2026' },
  { id: 'REC-2026-0091', name: 'Nair Electricals', category: 'Contractor', city: 'Bengaluru', status: 'active', created: '18 Jun 2026' },
];

export const categoryLabel = (v: string): string => CATEGORIES.find((c) => c.value === v)?.label ?? v;

/** "30 Sep 2026" from "2026-09-30". */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const formatDate = (iso: string): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : '';
};
export { MONTHS };

/** ₹1,25,000 */
export const formatRupees = (digits: string): string => (digits ? `₹${Number(digits).toLocaleString('en-IN')}` : '');

/** "482 KB", "1.4 MB" */
export const formatBytes = (n: number): string => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)} MB` : `${Math.round(n / 1000)} KB`);
