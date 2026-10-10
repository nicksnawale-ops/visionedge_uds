import React from 'react';
import { CodeBlock } from '../../../../components/common/CodeBlock';
import { TODAY } from '../utils/dateMath';
import { TZ_LABEL, TZ_SHORT, formatDate, formatDateTime, formatMonth, formatRange, toIsoIST } from '../utils/formatIST';
import { toInputDate, toInputTime } from '../utils/parseInput';

const TH = 'py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left';

// Every example below is produced by the same formatters the pickers use.
const ROWS: ReadonlyArray<[what: string, example: string, note: string]> = [
  ['Date', formatDate(TODAY), 'Two-digit day, three-letter month, four-digit year'],
  ['Date with time', `${formatDateTime(TODAY, 14 * 60 + 5)} ${TZ_SHORT}`, '24-hour by default; "IST" next to every time'],
  ['Range, same year', formatRange(new Date(2026, 8, 1), TODAY), 'Year written once'],
  ['Range across years', formatRange(new Date(2025, 11, 28), new Date(2026, 0, 3)), 'Year on both ends'],
  ['Month', formatMonth(2026, 8), 'Month picker and report titles'],
  ['Typed date', toInputDate(TODAY), 'DD/MM/YYYY, slashes inserted automatically'],
  ['Typed time', toInputTime(14 * 60 + 5), 'HH:MM, 24-hour'],
  ['Time zone', TZ_LABEL, 'All times are IST'],
  ['Stored / sent', toIsoIST(TODAY, 14 * 60 + 5), 'ISO 8601 with the +05:30 offset'],
];

const ISO_CODE = `// All VisionEdge times are shown in IST (UTC+05:30) and sent as ISO 8601 with the offset.
const payload = {
  scheduledStart: toIsoIST(new Date(2026, 8, 30), 14 * 60 + 5), // "2026-09-30T14:05:00+05:30"
  from: toIsoDate(range.start),                                  // "2026-09-01"
  to: toIsoDate(range.end),                                      // "2026-09-30"
};

// Relative labels ("Last 7 days") belong to presets only.
// The field always shows the resolved dates: "24 Sep – 30 Sep 2026".`;

export const FormatsTimeZone: React.FC = () => (
  <div className="flex flex-col gap-5">
    <div className="overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
      <table className="w-full min-w-[620px] border-collapse text-[14px]">
        <caption className="sr-only">Date and time formats</caption>
        <thead>
          <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
            <th scope="col" className={TH}>
              Format
            </th>
            <th scope="col" className={TH}>
              Example
            </th>
            <th scope="col" className={TH}>
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#DDE2EA]">
          {ROWS.map(([what, example, note]) => (
            <tr key={what}>
              <th scope="row" className="py-3 px-4 text-left font-medium text-[#121722] whitespace-nowrap">
                {what}
              </th>
              <td className="py-3 px-4 font-mono text-[13px] text-[#121722] whitespace-nowrap">{example}</td>
              <td className="py-3 px-4 text-[#4B5465]">{note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="text-[14px] text-[#353D4C] max-w-3xl">
      Relative labels such as &ldquo;Last 7 days&rdquo; are allowed in presets only, never inside the field value.
    </p>
    <CodeBlock code={ISO_CODE} filename="formatIST.ts" language="ts" />
  </div>
);
