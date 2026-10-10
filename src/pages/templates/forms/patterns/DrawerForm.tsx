import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pencil, Plus } from 'lucide-react';
import { useToast } from '../../../../components/common/Toast';
import { Drawer } from '../../settings/patterns/Drawer';
import { BUTTON, Badge, Spinner } from '../../profile/ui';
import { FLASH_MS } from '../formStates';
import { CATEGORIES, LIST_ROWS, ListRow, RecordData, REFERENCE_ID, categoryLabel } from '../data/sampleRecord';
import { FormLayout } from '../foundations/FormLayout';
import { ErrorSummary } from '../foundations/ErrorSummary';
import { FieldPair } from '../foundations/FormSection';
import { TextField } from '../fields/TextField';
import { PhoneField } from '../fields/PhoneField';
import { SelectField } from '../fields/SelectField';
import { ReadOnlyValue } from '../fields/FieldShell';
import { DiscardGuard, FlowAlerts, LiveRegion, useRecordFlow } from './RecordFlow';
import { idFor } from './RecordSections';
import type { PatternProps } from './SinglePageForm';

const P = 'drawer';
const TH = 'h-10 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left whitespace-nowrap';
const TD = 'h-12 px-4 text-[14px] text-[#353D4C] whitespace-nowrap';

/**
 * Pattern 4 — Drawer form: a list page with "Quick add". The 560px drawer holds the essential fields;
 * "Open full form" carries the values into the single-page form. A new row flashes at the top of the list.
 */
export const DrawerForm: React.FC<PatternProps & { onOpenFullForm: (values: RecordData) => void }> = ({ state, marker, onOpenFullForm }) => {
  const { showToast } = useToast();
  const [rows, setRows] = useState<ListRow[]>(() =>
    state === 'success' ? [{ id: REFERENCE_ID, name: 'Sharma Logistics Pvt Ltd', category: 'Vendor', city: 'Pune', status: 'active', created: '30 Sep 2026' }, ...LIST_ROWS] : LIST_ROWS
  );
  const [flashId, setFlashId] = useState<string | null>(state === 'success' ? REFERENCE_ID : null);
  const [open, setOpen] = useState(state !== 'success');
  const flow = useRecordFlow(state === 'success' ? 'empty' : state, ['quick'], {
    onCreated: (d) => {
      setRows((r) => [{ id: REFERENCE_ID, name: d.name, category: categoryLabel(d.category), city: d.city, status: d.status, created: '30 Sep 2026' }, ...r]);
      setFlashId(REFERENCE_ID);
      setOpen(false);
    },
  });
  const { form } = flow;
  const tableRef = useRef<HTMLTableSectionElement>(null);

  // Royal Blue 8% flash on the new row (600ms, none with reduced motion).
  useLayoutEffect(() => {
    if (!flashId) return;
    const el = tableRef.current?.querySelector<HTMLElement>(`[data-row="${flashId}"]`);
    if (el?.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.animate([{ backgroundColor: 'rgba(30, 99, 255, 0.08)' }, { backgroundColor: 'rgba(30, 99, 255, 0)' }], { duration: FLASH_MS * 2, easing: 'ease-out' });
    }
  }, [flashId, rows]);

  useEffect(() => {
    if (state === 'success') showToast('Record created', 'success');
  }, []); // Once, when the Success state opens.

  // After create, the shared flow shows "done"; for the drawer we just reset it.
  useEffect(() => {
    if (flow.done) flow.restart();
  }, [flow.done]);

  const close = () => (flow.readOnly || !form.dirty ? setOpen(false) : flow.setGuardOpen(true));
  const v = form.values;

  return (
    <>
      <FormLayout
        breadcrumb={['Records']}
        title="Records"
        description="Vendors, contractors, partners and facilities."
        requiredNote={false}
        marker={marker}
        headerAction={
          <button type="button" onClick={() => (flow.restart(), setOpen(true))} className={BUTTON.secondary}>
            <Plus className="w-4 h-4" aria-hidden="true" />
            Quick add
          </button>
        }
      >
        <div className="bg-white rounded-[12px] border border-[#DDE2EA] overflow-hidden">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <caption className="sr-only">Records</caption>
              <thead>
                <tr className="bg-[#F7F9FC] border-b border-[#DDE2EA]">
                  {['Reference', 'Name', 'Category', 'City', 'Status', 'Created'].map((h) => (
                    <th key={h} scope="col" className={TH}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody ref={tableRef} className="divide-y divide-[#EEF1F6]">
                {rows.map((r) => (
                  <tr key={r.id} data-row={r.id} className={`hover:bg-[#F7F9FC] ${r.id === flashId ? 'bg-[#1E63FF]/[0.04]' : ''}`}>
                    <td className={`${TD} font-mono text-[13px]`}>{r.id}</td>
                    <th scope="row" className={`${TD} text-left font-medium text-[#121722]`}>
                      {r.name}
                      {r.id === flashId && <span className="sr-only"> (new)</span>}
                    </th>
                    <td className={TD}>{r.category}</td>
                    <td className={TD}>{r.city}</td>
                    <td className={TD}>{r.status === 'active' ? <Badge tone="live">Active</Badge> : <Badge tone="neutral">Inactive</Badge>}</td>
                    <td className={TD}>{r.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FormLayout>

      {open && (
        <Drawer
          title={flow.readOnly ? v.name : 'Quick add record'}
          description={flow.readOnly ? `${v.referenceId} · ${categoryLabel(v.category)}` : 'The essentials now; add the rest later from the full record.'}
          onClose={close}
          footer={
            flow.readOnly ? (
              <button type="button" onClick={() => flow.setReadOnly(false)} className={BUTTON.secondary}>
                <Pencil className="w-4 h-4" aria-hidden="true" />
                Edit
              </button>
            ) : (
              <>
                <button type="button" onClick={close} className={BUTTON.ghost}>
                  Cancel
                </button>
                <button type="button" onClick={flow.submit} aria-disabled={flow.busy || undefined} className={`${BUTTON.primary} min-w-[120px]`}>
                  {flow.busy && <Spinner />}
                  {flow.busy ? 'Creating…' : 'Create'}
                </button>
              </>
            )
          }
        >
          {flow.readOnly ? (
            <dl className="grid grid-cols-1 gap-4">
              <ReadOnlyValue label="Category" value={categoryLabel(v.category)} />
              <ReadOnlyValue label="Email" value={v.email} />
              <ReadOnlyValue label="Phone" value={`+91 ${v.phone.slice(0, 5)} ${v.phone.slice(5)}`} />
              <ReadOnlyValue label="City" value={v.city} />
            </dl>
          ) : (
            <form noValidate onSubmit={(e) => (e.preventDefault(), flow.submit())} className="space-y-4" aria-busy={flow.busy || undefined}>
              <p className="text-[12px] leading-[16px] text-[#6B7485]">All fields are required unless marked (optional). {flow.autosave.status === 'saved' && `· ${flow.autosave.label}`}</p>
              <ErrorSummary keys={flow.errorKeys} errors={form.allErrors} idFor={(k) => idFor(P, k)} attempt={flow.attempt} overlay={marker(4)} />
              <FlowAlerts flow={flow} />
              <TextField id={`${P}-name`} label="Name" value={v.name} onChange={(x) => form.set('name', x)} onBlur={() => form.touch('name')} error={form.errors.name} readOnly={flow.busy} />
              <SelectField id={`${P}-category`} label="Category" options={CATEGORIES} value={v.category} onChange={(x) => (form.set('category', x), form.touch('category'))} onBlur={() => form.touch('category')} placeholder="Choose a category" error={form.errors.category} readOnly={flow.busy} />
              <TextField id={`${P}-email`} label="Email" type="email" value={v.email} onChange={(x) => form.set('email', x)} onBlur={() => form.touch('email')} error={form.errors.email} readOnly={flow.busy} />
              <PhoneField id={`${P}-phone`} value={v.phone} onChange={(x) => form.set('phone', x)} onBlur={() => form.touch('phone')} error={form.errors.phone} readOnly={flow.busy} />
              <FieldPair>
                <TextField id={`${P}-city`} label="City" value={v.city} onChange={(x) => form.set('city', x)} onBlur={() => form.touch('city')} error={form.errors.city} readOnly={flow.busy} />
                <SelectField
                  id={`${P}-status`}
                  label="Status"
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                  value={v.status}
                  onChange={(x) => form.set('status', x as RecordData['status'])}
                  placeholder="Choose a status"
                  readOnly={flow.busy}
                />
              </FieldPair>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenFullForm(v);
                }}
                className="inline-flex items-center gap-1.5 min-h-[44px] text-[14px] font-medium text-[#1E63FF] hover:underline rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
              >
                Open full form
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
            </form>
          )}
        </Drawer>
      )}
      <DiscardGuard
        open={flow.guardOpen}
        onKeep={() => flow.setGuardOpen(false)}
        onDiscard={() => {
          flow.setGuardOpen(false);
          flow.restart();
          setOpen(false);
        }}
      />
      <LiveRegion message={flow.live} />
    </>
  );
};
