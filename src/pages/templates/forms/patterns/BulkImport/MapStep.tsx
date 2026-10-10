import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Badge, NATIVE_SELECT } from '../../../profile/ui';
import { SKIP, SOURCE_COLUMNS, TARGET_FIELDS } from '../../data/importSample';
import { FormSection } from '../../foundations/FormSection';

interface MapStepProps {
  mapping: Record<string, string>;
  onMap: (source: string, target: string) => void;
  /** Required fields not mapped yet (block Continue). */
  missing: string[];
  showMissing: boolean;
}

const TH = 'h-10 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left whitespace-nowrap';

/** Step 2 — Map columns: Source column → Field, auto-matched with a "Matched" badge; unmatched default to "Skip column". */
export const MapStep: React.FC<MapStepProps> = ({ mapping, onMap, missing, showMissing }) => {
  const used = Object.values(mapping);
  return (
    <FormSection title="Map columns" description="We matched what we could. Check each column, and map every required field.">
      {showMissing && missing.length > 0 && (
        <p id="map-missing" tabIndex={-1} role="alert" className="flex items-start gap-2 p-3 rounded-[8px] border-2 border-[#0B2D6B] text-[13px] leading-[18px] font-medium text-[#0B2D6B] outline-none">
          <AlertCircle className="w-4 h-4 mt-px shrink-0" aria-hidden="true" />
          Map {missing.join(' and ')} to continue. They're required for every record.
        </p>
      )}
      <div className="relative overflow-x-auto -mx-4 @min-[768px]:-mx-6 border-y border-[#DDE2EA]">
        <table className="w-full min-w-[640px] border-collapse text-[14px]">
          <caption className="sr-only">Column mapping</caption>
          <thead>
            <tr className="bg-[#F7F9FC] border-b border-[#DDE2EA]">
              <th scope="col" className={`${TH} @min-[768px]:pl-6`}>Source column</th>
              <th scope="col" className={TH}>Sample value</th>
              <th scope="col" className={TH}>
                <span className="sr-only">maps to</span>
              </th>
              <th scope="col" className={`${TH} @min-[768px]:pr-6`}>Field</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF1F6]">
            {SOURCE_COLUMNS.map((c) => {
              const value = mapping[c.name] ?? SKIP;
              const auto = c.match !== SKIP && value === c.match;
              return (
                <tr key={c.name}>
                  <th scope="row" className="h-14 px-4 @min-[768px]:pl-6 text-left font-medium text-[#121722] whitespace-nowrap">
                    {c.name}
                  </th>
                  <td className="px-4 font-mono text-[12px] text-[#4B5465] whitespace-nowrap">{c.sample}</td>
                  <td className="px-1 text-[#8C95A6]" aria-hidden="true">
                    <ArrowRight className="w-4 h-4" />
                  </td>
                  <td className="px-4 @min-[768px]:pr-6 py-2">
                    <span className="flex items-center gap-2">
                      <select aria-label={`Field for ${c.name}`} value={value} onChange={(e) => onMap(c.name, e.target.value)} className={`${NATIVE_SELECT} w-[180px]`}>
                        <option value={SKIP}>Skip column</option>
                        {TARGET_FIELDS.map((f) => (
                          <option key={f.value} value={f.value} disabled={used.includes(f.value) && value !== f.value}>
                            {f.label}
                            {f.required ? ' *' : ''}
                          </option>
                        ))}
                      </select>
                      {auto && <Badge tone="live">Matched</Badge>}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] leading-[16px] text-[#4B5465]">* Required field. Each field can be mapped once.</p>
    </FormSection>
  );
};
