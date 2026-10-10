import React, { useState } from 'react';
import { AlertTriangle, Download, Inbox, Trash2 } from 'lucide-react';
import { useToast } from '../../../../components/common/Toast';
import { VEHICLES } from './sampleData';
import { TableSkeleton } from './parts/TableSkeleton';
import { NoResults } from './FilteringTable';
import { COLUMN_LABEL, Cell, ColumnKey, NUMERIC } from './cells';
import { BTN, CHECKBOX, CHIP, CHIP_OFF, CHIP_ON, FOCUS, TABLE } from './tableStyles';

type StateId = 'loading' | 'empty' | 'no-results' | 'error' | 'partial';
const STATES: { id: StateId; label: string }[] = [
  { id: 'loading', label: 'Loading' },
  { id: 'empty', label: 'Empty' },
  { id: 'no-results', label: 'No results' },
  { id: 'error', label: 'Error' },
  { id: 'partial', label: 'Partial selection' },
];

const COLS: ColumnKey[] = ['plate', 'driver', 'gate', 'status', 'time', 'velocity'];
const ROWS = VEHICLES.slice(0, 6);
const TOTAL = VEHICLES.length;

/** Pattern 6: Loading · Empty · No results · Error · Partial selection. */
export const TableStates: React.FC = () => {
  const { showToast } = useToast();
  const [state, setState] = useState<StateId>('loading');
  const [selected, setSelected] = useState<string[]>(ROWS.slice(0, 3).map((r) => r.id));
  const [allSelected, setAllSelected] = useState(false);

  const count = allSelected ? TOTAL : selected.length;
  const head = (
    <thead>
      <tr className={TABLE.headRow}>
        <th scope="col" className="w-12 px-4">
          <input
            type="checkbox"
            checked={state === 'partial' && (allSelected || selected.length === ROWS.length)}
            ref={(el) => {
              if (el) el.indeterminate = state === 'partial' && !allSelected && selected.length > 0 && selected.length < ROWS.length;
            }}
            disabled={state !== 'partial'}
            onChange={() => {
              setAllSelected(false);
              setSelected(selected.length === ROWS.length ? [] : ROWS.map((r) => r.id));
            }}
            aria-label="Select all rows"
            className={CHECKBOX}
          />
        </th>
        {COLS.map((c) => (
          <th key={c} scope="col" className={`${TABLE.th} ${NUMERIC.includes(c) ? 'text-right' : ''}`}>
            {COLUMN_LABEL[c]}
          </th>
        ))}
      </tr>
    </thead>
  );

  const rows = (dim = false) =>
    ROWS.map((r) => {
      const on = state === 'partial' && (allSelected || selected.includes(r.id));
      return (
        <tr key={r.id} className={`${TABLE.row} h-12 ${dim ? 'opacity-60' : ''} ${on ? 'bg-[#1E63FF]/[0.08]' : ''}`}>
          <td className="w-12 px-4">
            <input
              type="checkbox"
              checked={on}
              disabled={state !== 'partial'}
              onChange={() => {
                setAllSelected(false);
                setSelected((s) => (s.includes(r.id) ? s.filter((x) => x !== r.id) : [...s, r.id]));
              }}
              aria-label={`Select ${r.plate}`}
              className={CHECKBOX}
            />
          </td>
          {COLS.map((c) => (
            <Cell key={c} row={r} col={c} />
          ))}
        </tr>
      );
    });

  const colSpan = COLS.length + 1;

  return (
    <div className="space-y-3">
      <div role="group" aria-label="Table state" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {STATES.map((s) => (
          <button key={s.id} type="button" aria-pressed={state === s.id} onClick={() => setState(s.id)} className={`${CHIP} shrink-0 ${state === s.id ? CHIP_ON : CHIP_OFF}`}>
            {s.label}
          </button>
        ))}
      </div>
      <div className={TABLE.card}>
        {state === 'error' && (
          <div className="p-4 border-b border-[#DDE2EA]">
            <div role="alert" className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-[8px] bg-[#0B2D6B] border-l-4 border-l-[#00C6FF] text-[14px] leading-[20px] text-white">
              <span className="flex items-start gap-3 flex-1">
                <AlertTriangle className="w-5 h-5 mt-px shrink-0 text-[#00C6FF]" aria-hidden="true" />
                We couldn’t load the vehicle log. Showing the last loaded rows.
              </span>
              <button
                type="button"
                onClick={() => showToast('Retrying…', 'info')}
                className={`h-10 px-4 inline-flex items-center justify-center rounded-[8px] bg-white border border-[#1E63FF] text-[14px] font-semibold text-[#1E63FF] hover:bg-[#F7F9FC] outline-none focus-visible:ring-2 focus-visible:ring-[#00C6FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2D6B]`}
              >
                Retry
              </button>
            </div>
          </div>
        )}
        {state === 'partial' && (
          <div className="px-4 py-2.5 border-b border-[#DDE2EA] bg-[#1E63FF]/[0.08] flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-[#121722]" aria-live="polite">
              <span className="font-semibold">
                {count} of {TOTAL} selected
              </span>
              {!allSelected && (
                <>
                  {' · '}
                  <button type="button" onClick={() => setAllSelected(true)} className={`font-medium text-[#1E63FF] underline underline-offset-2 rounded-[2px] ${FOCUS}`}>
                    Select all {TOTAL}
                  </button>
                </>
              )}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => showToast(`Exported ${count} vehicles`, 'success')} className={BTN.secondary}>
                <Download className="w-4 h-4" aria-hidden="true" />
                Export
              </button>
              <button type="button" onClick={() => showToast(`Removed ${count} vehicles`, 'critical')} className={BTN.destructive}>
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                Remove
              </button>
            </div>
          </div>
        )}
        <div className={TABLE.scroll}>
          <table className={`${TABLE.table} min-w-[720px]`} aria-busy={state === 'loading' || undefined}>
            <caption className="sr-only">Vehicle log, {STATES.find((s) => s.id === state)?.label.toLowerCase()} state</caption>
            {head}
            <tbody>
              {state === 'loading' && <TableSkeleton columns={colSpan} />}
              {state === 'empty' && (
                <tr>
                  <td colSpan={colSpan} className="px-4 py-14">
                    <div className="flex flex-col items-center text-center gap-2">
                      <Inbox className="w-8 h-8 text-[#8C95A6]" aria-hidden="true" />
                      <p className="text-[14px] font-medium text-[#121722]">No vehicles recorded yet</p>
                      <p className="text-[13px] text-[#4B5465] max-w-[320px]">Entries will appear here as cameras detect vehicles.</p>
                      <button type="button" onClick={() => showToast('Opening camera setup', 'info')} className={`${BTN.secondary} mt-1`}>
                        View camera setup
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {state === 'no-results' && <NoResults onClear={() => setState('partial')} colSpan={colSpan} />}
              {state === 'error' && rows(true)}
              {state === 'partial' && rows()}
            </tbody>
          </table>
        </div>
      </div>
      {state === 'loading' && <p className="sr-only" role="status">Loading vehicles</p>}
    </div>
  );
};

export const STATES_CODE = `// Loading: header stays; 8 skeleton rows (motion-safe shimmer)
<table aria-busy="true">
  <thead>{/* unchanged header */}</thead>
  <tbody>
    {Array.from({ length: 8 }, (_, r) => (
      <tr key={r} aria-hidden="true" className="h-12 border-b border-[#DDE2EA]">
        <td className="px-4"><span className="block h-3.5 w-24 rounded-[4px] bg-[#EEF1F6] motion-safe:animate-pulse" /></td>
      </tr>
    ))}
  </tbody>
</table>

// Empty (no data yet)
<Inbox className="w-8 h-8 text-[#8C95A6]" aria-hidden="true" />
<p className="text-[14px] font-medium text-[#121722]">No vehicles recorded yet</p>
<p className="text-[13px] text-[#4B5465]">Entries will appear here as cameras detect vehicles.</p>
<button className="h-10 px-4 rounded-[8px] border border-[#1E63FF] text-[#1E63FF] font-semibold">View camera setup</button>

// Error: inline Critical alert inside the card; earlier rows stay, dimmed
<div role="alert" className="flex items-center gap-3 p-4 rounded-[8px] bg-[#0B2D6B] border-l-4 border-l-[#00C6FF] text-white">
  <AlertTriangle className="w-5 h-5 text-[#00C6FF]" aria-hidden="true" /> We couldn’t load the vehicle log.
  <button className="h-10 px-4 rounded-[8px] bg-white border border-[#1E63FF] text-[#1E63FF] font-semibold">Retry</button>
</div>
<tr className="opacity-60">…</tr>

// Partial selection: indeterminate header checkbox + selection bar
<input type="checkbox" aria-label="Select all rows" ref={(el) => el && (el.indeterminate = some && !all)} />
<p aria-live="polite"><strong>3 of 64 selected</strong> · <button className="text-[#1E63FF] underline">Select all 64</button></p>`;
