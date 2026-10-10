import React, { useMemo } from 'react';
import { Download } from 'lucide-react';
import { Tabs } from '../../../dashboard/primitives';
import { BUTTON, CHECKBOX, Tooltip } from '../../../profile/ui';
import { IMPORT_COUNTS, PREVIEW_ROWS, PreviewRow } from '../../data/importSample';
import { FormSection } from '../../foundations/FormSection';

export type ValidateFilter = 'all' | 'errors' | 'duplicates';

interface ValidateStepProps {
  filter: ValidateFilter;
  onFilter: (f: ValidateFilter) => void;
  validOnly: boolean;
  onValidOnly: (v: boolean) => void;
  blocked: boolean;
  onDownloadReport: () => void;
}

const TH = 'h-10 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left whitespace-nowrap';

/** A preview cell; problem cells get a 2px Deep Navy border and a tooltip with the reason. */
const Cell: React.FC<{ row: PreviewRow; field: 'name' | 'email' | 'pin'; mono?: boolean }> = ({ row, field, mono }) => {
  const problem = row.problem?.field === field ? row.problem.message : undefined;
  const value = row[field];
  if (!problem) return <span className={mono ? 'font-mono text-[12px]' : ''}>{value}</span>;
  return (
    <Tooltip content={problem} align="start">
      {(tip) => (
        <span tabIndex={0} aria-describedby={tip} className={`inline-flex px-1.5 py-0.5 rounded-[4px] border-2 border-[#0B2D6B] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] ${mono ? 'font-mono text-[12px]' : ''}`}>
          {value}
          <span className="sr-only">: {problem}</span>
        </span>
      )}
    </Tooltip>
  );
};

/** Step 3 — Validate: counts, a filterable preview with marked cells, error report and "Import valid rows only". */
export const ValidateStep: React.FC<ValidateStepProps> = ({ filter, onFilter, validOnly, onValidOnly, blocked, onDownloadReport }) => {
  const rows = useMemo(() => PREVIEW_ROWS.filter((r) => (filter === 'all' ? true : filter === 'errors' ? r.issue === 'error' : r.issue === 'duplicate')), [filter]);
  const counts = [
    { label: 'ready', value: IMPORT_COUNTS.ready },
    { label: 'with errors', value: IMPORT_COUNTS.errors },
    { label: 'duplicates', value: IMPORT_COUNTS.duplicates },
  ];
  return (
    <FormSection
      title="Check the rows"
      description="Nothing is imported yet. Fix the file and upload again, or import only the valid rows."
      action={
        <button type="button" onClick={onDownloadReport} className={BUTTON.secondarySm}>
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          Download error report
        </button>
      }
    >
      <p className="text-[16px] leading-[24px] text-[#121722]" aria-live="polite">
        {counts.map((c, i) => (
          <React.Fragment key={c.label}>
            {i > 0 && <span className="text-[#8C95A6]"> · </span>}
            <span className="font-semibold tabular-nums">{c.value}</span> {c.label}
          </React.Fragment>
        ))}
      </p>
      <Tabs<ValidateFilter>
        label="Show rows"
        options={[
          { id: 'all', label: `All (${PREVIEW_ROWS.length} shown)` },
          { id: 'errors', label: `Errors (${IMPORT_COUNTS.errors})` },
          { id: 'duplicates', label: `Duplicates (${IMPORT_COUNTS.duplicates})` },
        ]}
        value={filter}
        onChange={onFilter}
      />
      <div className="relative overflow-x-auto -mx-4 @min-[768px]:-mx-6 border-b border-[#DDE2EA] max-h-[360px] overflow-y-auto" role="tabpanel" aria-label="Preview rows">
        <table className="w-full min-w-[640px] border-collapse text-[14px]">
          <caption className="sr-only">Preview of rows to import</caption>
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#F7F9FC] border-b border-[#DDE2EA]">
              {['Row', 'Name', 'Category', 'Email', 'PIN code', 'Result'].map((h) => (
                <th key={h} scope="col" className={TH}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF1F6]">
            {rows.map((r) => (
              <tr key={r.row}>
                <td className="h-11 px-4 font-mono text-[12px] text-[#4B5465]">{r.row}</td>
                <th scope="row" className="px-4 text-left font-medium text-[#121722] whitespace-nowrap">
                  <Cell row={r} field="name" />
                </th>
                <td className="px-4 text-[#353D4C]">{r.category}</td>
                <td className="px-4 text-[#353D4C]">
                  <Cell row={r} field="email" />
                </td>
                <td className="px-4 text-[#353D4C]">
                  <Cell row={r} field="pin" mono />
                </td>
                <td className="px-4 text-[13px] whitespace-nowrap">{r.issue === 'error' ? 'Error' : r.issue === 'duplicate' ? 'Duplicate' : 'Ready'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <label className="flex items-start gap-3 min-h-[44px] py-1 text-[14px] text-[#121722] cursor-pointer">
        <input type="checkbox" checked={validOnly} onChange={(e) => onValidOnly(e.target.checked)} className={`${CHECKBOX} mt-0.5`} />
        <span>
          Import valid rows only
          <span className="block text-[12px] leading-[16px] text-[#4B5465]">
            {IMPORT_COUNTS.ready} records are imported; {IMPORT_COUNTS.errors + IMPORT_COUNTS.duplicates} rows are skipped and listed in the error report.
          </span>
        </span>
      </label>
      {blocked && (
        <p id="validate-blocked" tabIndex={-1} role="alert" className="text-[13px] font-medium text-[#0B2D6B] outline-none">
          Fix the {IMPORT_COUNTS.errors} rows with errors and upload again, or choose “Import valid rows only”.
        </p>
      )}
    </FormSection>
  );
};
