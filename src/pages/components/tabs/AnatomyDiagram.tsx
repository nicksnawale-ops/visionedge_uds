import React from 'react';
import { ChevronRight, LayoutGrid } from 'lucide-react';

const PARTS: [string, string][] = [
  ['Tab list', 'role="tablist" container holding the tabs; one Tab stop.'],
  ['Tab', '14px Medium label, 40px high; 32px gap between tabs.'],
  ['Icon', 'Optional 16px icon, 8px before the label.'],
  ['Count / status', 'Optional count pill or 8px status dot, with screen-reader text.'],
  ['Active indicator', '2px Royal Blue line that slides to the selected tab.'],
  ['Baseline', '1px Gray 200 line under the whole list.'],
  ['Tab panel', 'role="tabpanel" content for the selected tab; focusable.'],
  ['Overflow control', 'Chevrons or a More menu when tabs don’t fit.'],
];

const Marker: React.FC<{ n: number; className: string }> = ({ n, className }) => (
  <span aria-hidden="true" className={`absolute z-10 w-5 h-5 rounded-full bg-[#0B2D6B] text-white text-[11px] font-semibold flex items-center justify-center ring-2 ring-white ${className}`}>
    {n}
  </span>
);

/** Static, labelled drawing of line tabs with numbered markers and a legend. */
export const AnatomyDiagram: React.FC = () => (
  <div className="rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden">
    <div className="preview-grid-canvas p-6 md:p-10 overflow-x-auto">
      <figure aria-label="Tab anatomy" className="min-w-[520px] max-w-[640px] mx-auto">
        <div aria-hidden="true" className="relative bg-white rounded-[8px] border border-[#DDE2EA] px-5 pt-8 pb-5">
          <div className="relative flex items-end gap-2 border-b border-[#DDE2EA]">
            <Marker n={6} className="-bottom-2.5 right-[52px]" />
            <div className="relative flex-1 flex items-end gap-8 outline-1 outline-dashed outline-offset-4 outline-[#8C95A6]">
              <Marker n={1} className="-top-7 -left-2" />
              <span className="relative -mb-px h-10 inline-flex items-center gap-2 text-[14px] font-medium text-[#1E63FF]">
                <Marker n={2} className="-top-6 left-1/2" />
                <span className="relative">
                  <LayoutGrid className="w-4 h-4" />
                  <Marker n={3} className="top-5 -left-4" />
                </span>
                Overview
                <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[#1E63FF]" />
                <Marker n={5} className="-bottom-6 left-1/2" />
              </span>
              <span className="relative -mb-px h-10 inline-flex items-center gap-2 text-[14px] font-medium text-[#4B5465]">
                <span className="w-2 h-2 rounded-full bg-[#0B2D6B]" />
                Alerts
                <span className="relative h-5 px-1.5 inline-flex items-center rounded-full bg-[#EEF1F6] text-[#353D4C] font-mono text-[12px] font-medium">
                  3
                  <Marker n={4} className="-top-6 left-0" />
                </span>
              </span>
              <span className="-mb-px h-10 inline-flex items-center text-[14px] font-medium text-[#4B5465]">Reports</span>
            </div>
            <span className="relative w-8 h-8 mb-1 rounded-[8px] flex items-center justify-center text-[#4B5465] bg-[#F7F9FC]">
              <ChevronRight className="w-4 h-4" />
              <Marker n={8} className="-top-6 left-1.5" />
            </span>
          </div>
          <div className="relative mt-8 rounded-[8px] border border-dashed border-[#8C95A6] p-4">
            <Marker n={7} className="-top-2.5 -left-2.5" />
            <span className="block h-3 w-2/5 rounded bg-[#EEF1F6]" />
            <span className="mt-2 block h-2.5 w-4/5 rounded bg-[#EEF1F6]" />
            <span className="mt-2 block h-2.5 w-3/5 rounded bg-[#EEF1F6]" />
          </div>
        </div>
      </figure>
    </div>
    <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 p-5 border-t border-[#DDE2EA]">
      {PARTS.map(([name, desc], i) => (
        <li key={name} className="flex gap-3">
          <span aria-hidden="true" className="w-5 h-5 mt-0.5 shrink-0 rounded-full bg-[#0B2D6B] text-white text-[11px] font-semibold flex items-center justify-center">
            {i + 1}
          </span>
          <span>
            <span className="block text-[14px] font-semibold text-[#121722]">{name}</span>
            <span className="block text-[13px] text-[#4B5465]">{desc}</span>
          </span>
        </li>
      ))}
    </ol>
  </div>
);
