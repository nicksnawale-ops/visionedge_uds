/** Form Pages template: patterns and states (showcase chips and ?pattern=&state=). Generic, no use case. */

export { FORMS_PAGE_PATH, FORMS_PREVIEW_PATH } from './paths';

export type PatternId = 'single' | 'sectioned' | 'wizard' | 'drawer' | 'modal' | 'edit' | 'import';

export interface PatternMeta {
  id: PatternId;
  label: string;
  /** "Use this when…" line under the showcase. */
  useWhen: string;
  /** Choosing a Pattern table. */
  typicalFields: string;
  example: string;
  /** Path shown in the browser frame. */
  path: string;
}

export const PATTERNS: PatternMeta[] = [
  { id: 'single', label: 'Single-page', useWhen: 'Use this when a record has 8–20 fields in a few related groups.', typicalFields: '8–20', example: 'New camera site, new vendor, new staff member', path: '/records/new' },
  { id: 'sectioned', label: 'Sectioned', useWhen: 'Use this when there are 20+ fields in distinct groups that people fill in any order.', typicalFields: '20+', example: 'Detailed registration, compliance profile', path: '/records/new/detailed' },
  { id: 'wizard', label: 'Wizard', useWhen: 'Use this when later steps depend on earlier answers or the result needs a review before creating.', typicalFields: '10–30 in 3–5 steps', example: 'Onboarding a new entity, setting up a site', path: '/setup/entity' },
  { id: 'drawer', label: 'Drawer', useWhen: 'Use this when people quick-create from a list with 4–8 essential fields and stay on the list.', typicalFields: '4–8', example: 'Quick add from a table', path: '/records' },
  { id: 'modal', label: 'Modal', useWhen: 'Use this when the thing is tiny: 1–3 fields, created in passing.', typicalFields: '1–3', example: 'Add a category, add a tag', path: '/records/categories' },
  { id: 'edit', label: 'Edit record', useWhen: 'Use this when changing existing data: same form, pre-filled, with changes highlighted.', typicalFields: 'Same as create', example: 'Editing REC-2026-0142', path: '/records/REC-2026-0142/edit' },
  { id: 'import', label: 'Bulk import', useWhen: 'Use this when creating many records at once from a spreadsheet.', typicalFields: 'Columns mapped to fields', example: 'Importing 260 records from a CSV', path: '/records/import' },
];

export const getPattern = (id: string | null | undefined): PatternMeta => PATTERNS.find((p) => p.id === id) ?? PATTERNS[0];
export const isPattern = (v: string | null | undefined): v is PatternId => PATTERNS.some((p) => p.id === v);

export type FormStateId =
  | 'empty'
  | 'partial'
  | 'errors'
  | 'submitting'
  | 'success'
  | 'draft'
  | 'guard'
  | 'duplicate'
  | 'server-error'
  | 'read-only';

export interface FormStateMeta {
  id: FormStateId;
  label: string;
  trigger: string;
  behaviour: string;
}

export const FORM_STATES: FormStateMeta[] = [
  { id: 'empty', label: 'Empty', trigger: 'The form opens', behaviour: 'Blank fields with helper text that explains formats before errors happen.' },
  { id: 'partial', label: 'Partially filled', trigger: 'Someone has started', behaviour: 'Some fields filled; the status text says "Unsaved changes".' },
  { id: 'errors', label: 'Validation errors', trigger: 'Submit with problems', behaviour: 'An error summary at the top links to each field; values are kept.' },
  { id: 'submitting', label: 'Submitting', trigger: 'Primary pressed', behaviour: 'Primary shows a spinner; fields are read-only; only Cancel stays enabled.' },
  { id: 'success', label: 'Success', trigger: 'Record created', behaviour: 'A centred confirmation with View record, Create another and Back to list.' },
  { id: 'draft', label: 'Draft saved', trigger: 'Autosave or Save as draft', behaviour: '"Draft saved" status with a cloud check and a toast.' },
  { id: 'guard', label: 'Unsaved-changes guard', trigger: 'Leaving with changes', behaviour: '"Discard this new record?" with Keep editing and Discard.' },
  { id: 'duplicate', label: 'Duplicate warning', trigger: 'A similar record exists', behaviour: 'A soft Info alert with View existing and Continue anyway.' },
  { id: 'server-error', label: 'Server error', trigger: 'Create failed', behaviour: 'A Critical alert with Try again; every value is kept.' },
  { id: 'read-only', label: 'Read-only', trigger: 'Viewing a record', behaviour: 'Values as text under Overline labels, with Edit in the header.' },
];

export const getFormState = (id: FormStateId): FormStateMeta => FORM_STATES.find((s) => s.id === id) ?? FORM_STATES[0];
export const isFormState = (v: string | null | undefined): v is FormStateId => FORM_STATES.some((s) => s.id === v);

export const AUTOSAVE_MS = 30_000;
export const SUBMIT_DELAY_MS = 1200;
export const FLASH_MS = 600;
