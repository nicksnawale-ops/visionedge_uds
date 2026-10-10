import React, { useId, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { VEHICLES } from './sampleData';
import { ExpandedRow } from './parts/ExpandedRow';
import { COLUMN_LABEL, Cell, ColumnKey, NUMERIC } from './cells';
import { BTN, FOCUS, TABLE } from './tableStyles';

const COLS: ColumnKey[] = ['plate', 'driver', 'gate', 'status', 'time', 'confidence'];
const ROWS = VEHICLES.slice(0, 8);

/** Pattern 5: a 32px chevron opens a Gray 50 detail row; several can be open; Expand all / Collapse all. */
export const ExpandableRowsTable: React.FC = () => {
  const uid = useId();
  const [open, setOpen] = useState<string[]>([ROWS[0].id]);
  const allOpen = open.length === ROWS.length;
  const toggle = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  return (
    <div className={TABLE.card}>
      <div className="p-4 border-b border-[#DDE2EA] flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] text-[#4B5465]" aria-live="polite">
          {open.length} of {ROWS.length} rows expanded
        </span>
        <button type="button" onClick={() => setOpen(allOpen ? [] : ROWS.map((r) => r.id))} className={BTN.ghostSm}>
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
      <div className={TABLE.scroll}>
        <table className={`${TABLE.table} min-w-[760px]`}>
          <caption className="sr-only">Vehicle log with expandable rows</caption>
          <thead>
            <tr className={TABLE.headRow}>
              <th scope="col" className="w-12 px-2">
                <span className="sr-only">Details</span>
              </th>
              {COLS.map((c) => (
                <th key={c} scope="col" className={`${TABLE.th} ${NUMERIC.includes(c) ? 'text-right' : ''}`}>
                  {COLUMN_LABEL[c]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => {
              const isOpen = open.includes(r.id);
              const detailId = `${uid}-${r.id}`;
              return (
                <React.Fragment key={r.id}>
                  <tr className={`h-12 border-b border-[#DDE2EA] ${isOpen ? 'bg-[#F7F9FC]' : 'hover:bg-[#F7F9FC]'}`}>
                    <td className="px-2">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={detailId}
                        aria-label={`${isOpen ? 'Hide' : 'Show'} details for ${r.plate}`}
                        onClick={() => toggle(r.id)}
                        className={`w-8 h-8 max-[767px]:w-11 max-[767px]:h-11 inline-flex items-center justify-center rounded-[8px] text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#121722] ${FOCUS}`}
                      >
                        <ChevronRight className={`w-4 h-4 motion-safe:transition-transform motion-safe:duration-150 ${isOpen ? 'rotate-90' : ''}`} aria-hidden="true" />
                      </button>
                    </td>
                    {COLS.map((c) => (
                      <Cell key={c} row={r} col={c} />
                    ))}
                  </tr>
                  <tr id={detailId} hidden={!isOpen} className="border-b border-[#DDE2EA]">
                    <td colSpan={COLS.length + 1} className="p-0">
                      {isOpen && <ExpandedRow row={r} />}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const EXPAND_CODE = `// Expandable row: 32px Ghost chevron (aria-expanded / aria-controls), detail row spans every column
<tr className="h-12 border-b border-[#DDE2EA]">
  <td className="px-2">
    <button aria-expanded={open} aria-controls="row-8801-details" aria-label="Show details for MH12 AB 4521"
      className="w-8 h-8 rounded-[8px] text-[#4B5465] hover:bg-[#EEF1F6]">
      <ChevronRight className={'w-4 h-4 motion-safe:transition-transform motion-safe:duration-150 ' + (open ? 'rotate-90' : '')} aria-hidden="true" />
    </button>
  </td>
  {/* … cells … */}
</tr>
<tr id="row-8801-details" hidden={!open}>
  <td colSpan={7} className="p-0">
    <div className="px-6 py-4 bg-[#F7F9FC] flex flex-col md:flex-row gap-4 md:gap-6">
      <div aria-hidden="true" className="relative w-[160px] h-[90px] rounded-[8px] bg-black">{/* Cyan box around the plate chip */}</div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        <div><dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">Camera ID</dt><dd className="text-[14px]">CAM-07</dd></div>
        {/* Direction · Confidence · Vehicle color · Lane · Recorded by */}
      </dl>
      <div className="flex md:flex-col gap-2">
        <button className="h-8 px-3 rounded-[8px] border border-[#1E63FF] text-[13px] font-semibold text-[#1E63FF]">View full event</button>
        <button className="h-8 px-3 rounded-[8px] text-[13px] font-semibold text-[#1E63FF] hover:bg-[#EEF1F6]">Add to watchlist</button>
      </div>
    </div>
  </td>
</tr>`;
