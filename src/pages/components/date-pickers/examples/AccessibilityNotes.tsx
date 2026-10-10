import React from 'react';
import { Check } from 'lucide-react';
import { A11Y_RULES, KEYBOARD } from '../pickersSpec';

const TH = 'py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left';

export const AccessibilityNotes: React.FC = () => (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
    <ul className="rounded-[12px] border border-[#DDE2EA] bg-white p-5 flex flex-col gap-4 shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
      {A11Y_RULES.map(([title, text]) => (
        <li key={title} className="flex gap-3">
          <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-[#00C6FF]/15 text-[#0B2D6B] flex items-center justify-center">
            <Check className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[14px] font-semibold text-[#121722]">{title}</span>
            <span className="block text-[13px] leading-[19px] text-[#4B5465]">{text}</span>
          </span>
        </li>
      ))}
    </ul>
    <div className="overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)] self-start">
      <table className="w-full border-collapse text-[14px]">
        <caption className="sr-only">Calendar keyboard support</caption>
        <thead>
          <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
            <th scope="col" className={TH}>
              Key
            </th>
            <th scope="col" className={TH}>
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#DDE2EA]">
          {KEYBOARD.map(([keys, action]) => (
            <tr key={keys}>
              <th scope="row" className="py-2.5 px-4 text-left whitespace-nowrap">
                <kbd className="px-1.5 py-0.5 rounded-[4px] border border-[#DDE2EA] bg-[#F7F9FC] font-mono text-[12px] text-[#121722]">{keys}</kbd>
              </th>
              <td className="py-2.5 px-4 text-[#353D4C]">{action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
