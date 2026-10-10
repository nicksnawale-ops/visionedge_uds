import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CHOOSING } from '../pickersSpec';
import { Segmented } from '../ui/Segmented';

const TH = 'py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left';

const PERIODS = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
] as const;

export const ChoosingTable: React.FC = () => {
  const [period, setPeriod] = useState<'today' | '7d' | '30d'>('7d');
  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
        <table className="w-full min-w-[620px] border-collapse text-[14px]">
          <caption className="sr-only">Which picker to use</caption>
          <thead>
            <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
              <th scope="col" className={TH}>
                Need
              </th>
              <th scope="col" className={TH}>
                Use
              </th>
              <th scope="col" className={TH}>
                Example
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE2EA]">
            {CHOOSING.map(([need, use, example]) => (
              <tr key={need}>
                <th scope="row" className="py-3 px-4 text-left font-normal text-[#353D4C]">
                  {need}
                </th>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#121722]">
                    <ArrowRight className="w-4 h-4 text-[#1E63FF] shrink-0" aria-hidden="true" />
                    {use}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#4B5465]">{example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-[12px] border border-[#DDE2EA] bg-[#F7F9FC] px-4 py-3">
        <span className="text-[14px] text-[#353D4C]">Dashboard period: a segmented control, not a picker.</span>
        <Segmented label="Dashboard period" options={PERIODS} value={period} onChange={setPeriod} />
      </div>
    </div>
  );
};
