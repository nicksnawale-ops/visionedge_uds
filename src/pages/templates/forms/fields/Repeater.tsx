import React, { useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { BUTTON } from '../../profile/ui';
import type { ContactPerson } from '../data/sampleRecord';
import { FieldPair } from '../foundations/FormSection';
import { PhoneField } from './PhoneField';
import { TextField } from './TextField';

interface RepeaterProps {
  idPrefix: string;
  rows: ContactPerson[];
  onChange: (rows: ContactPerson[]) => void;
  errors: Partial<Record<string, string>>;
  onBlur: (key: string) => void;
  readOnly?: boolean;
  max?: number;
  announce?: (m: string) => void;
  overlay?: React.ReactNode;
}

/**
 * Repeater ("Contact persons"): rows of grouped fields with "+ Add another" (max 5) and Remove.
 * Adding focuses the new row; removing moves focus to the add button.
 */
export const Repeater: React.FC<RepeaterProps> = ({ idPrefix, rows, onChange, errors, onBlur, readOnly, max = 5, announce, overlay }) => {
  const addRef = useRef<HTMLButtonElement>(null);
  const focusRow = useRef<number | null>(null);
  const nextId = useRef(Math.max(0, ...rows.map((r) => r.id)) + 1);

  useEffect(() => {
    if (focusRow.current === null) return;
    document.getElementById(`${idPrefix}-${focusRow.current}-name`)?.focus();
    focusRow.current = null;
  }, [rows, idPrefix]);

  const update = (id: number, patch: Partial<ContactPerson>) => onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="relative space-y-3">
      {overlay}
      {rows.length === 0 && <p className="text-[13px] text-[#4B5465]">No contact persons yet.</p>}
      {rows.map((r, i) => (
        <fieldset key={r.id} className="rounded-[8px] border border-[#DDE2EA] bg-[#F7F9FC] p-4">
          <legend className="sr-only">Contact person {i + 1}</legend>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold text-[#121722]" aria-hidden="true">
              Contact person {i + 1}
            </span>
            {!readOnly && (
              <button
                type="button"
                onClick={() => {
                  onChange(rows.filter((x) => x.id !== r.id));
                  announce?.(`Contact person ${i + 1} removed`);
                  window.setTimeout(() => addRef.current?.focus(), 0);
                }}
                aria-label={`Remove contact person ${i + 1}`}
                className={BUTTON.ghostSm}
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                Remove
              </button>
            )}
          </div>
          <div className="space-y-4">
            <FieldPair>
              <TextField
                id={`${idPrefix}-${r.id}-name`}
                label="Name"
                value={r.name}
                onChange={(v) => update(r.id, { name: v })}
                onBlur={() => onBlur(`contacts.${r.id}.name`)}
                error={errors[`contacts.${r.id}.name`]}
                readOnly={readOnly}
              />
              <TextField id={`${idPrefix}-${r.id}-role`} label="Role" optional placeholder="e.g. Director" value={r.role} onChange={(v) => update(r.id, { role: v })} readOnly={readOnly} />
            </FieldPair>
            <PhoneField
              id={`${idPrefix}-${r.id}-phone`}
              optional
              value={r.phone}
              onChange={(v) => update(r.id, { phone: v })}
              onBlur={() => onBlur(`contacts.${r.id}.phone`)}
              error={errors[`contacts.${r.id}.phone`]}
              readOnly={readOnly}
            />
          </div>
        </fieldset>
      ))}
      {!readOnly && (
        <div className="flex items-center gap-3">
          <button
            ref={addRef}
            type="button"
            disabled={rows.length >= max}
            onClick={() => {
              const id = nextId.current++;
              focusRow.current = id;
              onChange([...rows, { id, name: '', role: '', phone: '' }]);
              announce?.(`Contact person ${rows.length + 1} added`);
            }}
            className={`${BUTTON.ghost} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add another
          </button>
          <span className="text-[12px] text-[#6B7485]">
            {rows.length} of {max}
            {rows.length >= max ? ' · limit reached' : ''}
          </span>
        </div>
      )}
    </div>
  );
};
