import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Info, Pencil, Plus, ShieldAlert } from 'lucide-react';
import { useToast } from '../../../../components/common/Toast';
import { CriticalAlert, InfoAlert } from '../../shared/authUi';
import { BUTTON, Modal, Spinner } from '../../profile/ui';
import { FLASH_MS, SUBMIT_DELAY_MS } from '../formStates';
import { CATEGORIES } from '../data/sampleRecord';
import { useFormState } from '../foundations/useFormState';
import { first, maxLength, required } from '../foundations/validators';
import { FormLayout } from '../foundations/FormLayout';
import { TextField } from '../fields/TextField';
import { TextareaField } from '../fields/TextareaField';
import { ReadOnlyValue } from '../fields/FieldShell';
import { DiscardGuard, LiveRegion } from './RecordFlow';
import type { PatternProps } from './SinglePageForm';

interface Category {
  name: string;
  code: string;
  description: string;
}

const P = 'modal';
const EMPTY: Category = { name: '', code: '', description: '' };

const validate = (c: Category) => {
  const e: Partial<Record<string, string>> = {};
  e.name = first(c.name, required('Enter a category name'), maxLength(40));
  if (CATEGORIES.some((x) => x.label.toLowerCase() === c.name.trim().toLowerCase())) e.name = `A category named ‘${c.name.trim()}’ already exists`;
  if (c.code && !/^[A-Z0-9]{2,6}$/.test(c.code)) e.code = 'Use 2–6 capital letters or numbers, like VND';
  return Object.fromEntries(Object.entries(e).filter(([, v]) => v));
};

const initialFor = (state: PatternProps['state']): Category =>
  state === 'empty' || state === 'success' ? EMPTY : state === 'errors' ? { name: '', code: 'vnd-1', description: '' } : state === 'duplicate' ? { name: 'Security vendor', code: 'SEC', description: '' } : { name: 'Maintenance', code: 'MNT', description: state === 'partial' ? '' : 'Repairs and upkeep for gates, barriers and cameras.' };

/**
 * Pattern 5 — Modal form: "Add category" (480px) with 3 fields. Enter submits; Esc closes, asking first
 * if anything was typed.
 */
export const ModalForm: React.FC<PatternProps> = ({ state, marker }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<{ name: string; code: string; isNew?: boolean }[]>(() => [
    ...(state === 'success' ? [{ name: 'Maintenance', code: 'MNT', isNew: true }] : []),
    ...CATEGORIES.map((c) => ({ name: c.label, code: c.value.slice(0, 3).toUpperCase() })),
  ]);
  const form = useFormState<Category>(initialFor(state), useCallback(validate, []), { baseline: EMPTY, submitted: state === 'errors' });
  const [open, setOpen] = useState(state !== 'success');
  const [busy, setBusy] = useState(state === 'submitting');
  const [serverError, setServerError] = useState(state === 'server-error');
  const [similar, setSimilar] = useState(state === 'duplicate');
  const [guard, setGuard] = useState(state === 'guard');
  const [view, setView] = useState(state === 'read-only');
  const [live, setLive] = useState('');
  const timer = useRef<number | undefined>(undefined);
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (state === 'success') showToast('Category added', 'success');
    if (state === 'draft') showToast('Draft saved', 'success');
  }, []); // Once, when the state opens.

  // Flash the new item.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[data-new="true"]');
    if (el?.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) el.animate([{ backgroundColor: 'rgba(30, 99, 255, 0.08)' }, { backgroundColor: 'rgba(30, 99, 255, 0)' }], { duration: FLASH_MS * 2 });
  }, [items]);

  const submit = () => {
    if (busy) return;
    const keys = form.submitAttempt();
    if (keys.length) {
      document.getElementById(`${P}-${keys[0]}`)?.focus();
      setLive(`Fix ${keys.length} ${keys.length === 1 ? 'field' : 'fields'}`);
      return;
    }
    setServerError(false);
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      setItems((list) => [{ name: form.values.name.trim(), code: form.values.code, isNew: true }, ...list.map((i) => ({ ...i, isNew: false }))]);
      setOpen(false);
      form.reset(EMPTY);
      showToast('Category added', 'success');
      setLive(`Category ${form.values.name} added`);
    }, SUBMIT_DELAY_MS);
  };

  const close = () => {
    if (guard) return;
    if (!view && form.dirty) setGuard(true);
    else setOpen(false);
  };
  const v = form.values;

  return (
    <>
      <FormLayout
        breadcrumb={['Records', 'Categories']}
        title="Categories"
        description="Group records so they're easy to filter and report on."
        requiredNote={false}
        marker={marker}
        headerAction={
          <button type="button" onClick={() => (form.reset(EMPTY), setView(false), setSimilar(false), setServerError(false), setOpen(true))} className={BUTTON.secondary}>
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add category
          </button>
        }
      >
        <ul ref={listRef} className="bg-white rounded-[12px] border border-[#DDE2EA] divide-y divide-[#EEF1F6]" aria-label="Categories">
          {items.map((i) => (
            <li key={i.name} data-new={i.isNew || undefined} className="flex items-center justify-between gap-3 px-4 @min-[768px]:px-6 h-12">
              <span className="text-[14px] font-medium text-[#121722]">
                {i.name}
                {i.isNew && <span className="sr-only"> (new)</span>}
              </span>
              <span className="font-mono text-[12px] text-[#4B5465]">{i.code}</span>
            </li>
          ))}
        </ul>
      </FormLayout>

      {open && (
        <Modal
          title={view ? v.name : 'Add category'}
          description={view ? 'Category details' : 'Categories group records in lists and reports.'}
          onClose={close}
          footer={
            view ? (
              <button type="button" onClick={() => setView(false)} className={BUTTON.secondary}>
                <Pencil className="w-4 h-4" aria-hidden="true" />
                Edit
              </button>
            ) : (
              <>
                <button type="button" onClick={close} className={BUTTON.secondary}>
                  Cancel
                </button>
                <button type="button" onClick={submit} aria-disabled={busy || undefined} className={`${BUTTON.primary} min-w-[136px]`}>
                  {busy && <Spinner />}
                  {busy ? 'Adding…' : 'Add category'}
                </button>
              </>
            )
          }
        >
          {view ? (
            <dl className="grid gap-4">
              <ReadOnlyValue label="Code" value={v.code} mono />
              <ReadOnlyValue label="Description" value={v.description} />
            </dl>
          ) : (
            <form noValidate onSubmit={(e) => (e.preventDefault(), submit())} className="space-y-4" aria-busy={busy || undefined}>
              {similar && (
                <InfoAlert icon={Info}>
                  A similar category exists: ‘Security’.{' '}
                  <button type="button" onClick={() => setSimilar(false)} className="font-medium text-[#1E63FF] underline underline-offset-2">
                    Continue anyway
                  </button>
                </InfoAlert>
              )}
              {serverError && (
                <div role="alert">
                  <CriticalAlert icon={ShieldAlert}>We couldn't add the category. Your data is safe — try again.</CriticalAlert>
                </div>
              )}
              <TextField id={`${P}-name`} label="Category name" value={v.name} onChange={(x) => form.set('name', x)} onBlur={() => form.touch('name')} error={form.errors.name} readOnly={busy} />
              <TextField
                id={`${P}-code`}
                label="Short code"
                optional
                mono
                helper="2–6 capital letters or numbers, shown in reports."
                value={v.code}
                onChange={(x) => form.set('code', x.toUpperCase())}
                onBlur={() => form.touch('code')}
                error={form.errors.code}
                readOnly={busy}
              />
              <TextareaField id={`${P}-description`} label="Description" optional rows={2} max={120} value={v.description} onChange={(x) => form.set('description', x)} readOnly={busy} />
              <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
            </form>
          )}
        </Modal>
      )}
      <DiscardGuard
        open={guard}
        title="Discard this category?"
        onKeep={() => setGuard(false)}
        onDiscard={() => {
          setGuard(false);
          setOpen(false);
          form.reset(EMPTY);
        }}
      />
      <LiveRegion message={live} />
    </>
  );
};
