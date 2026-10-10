import React from 'react';

export { AnatomyMarker } from '../dashboard/AnatomyOverlay';

/** Numbered regions for "Show anatomy" and the Layout Anatomy legend. */
export const FORM_ANATOMY: { n: number; name: string; detail: string }[] = [
  { n: 1, name: 'Breadcrumb', detail: '12px Gray 600: "Records / New record"' },
  { n: 2, name: 'Page header', detail: 'H1 + one-line description; Edit in read-only mode' },
  { n: 3, name: 'Required/optional note', detail: '"All fields are required unless marked (optional)." 12px Gray 500' },
  { n: 4, name: 'Error summary', detail: 'Critical alert after a failed submit; links focus each field' },
  { n: 5, name: 'Section card', detail: 'White, 1px Gray 200, 12px radius, 24px padding; H4 + description' },
  { n: 6, name: 'Field', detail: 'Label above, 40px input, helper or error below, 16px apart' },
  { n: 7, name: 'Two-column pair', detail: 'Only for short related fields: City / PIN code, Start / End date' },
  { n: 8, name: 'Repeater', detail: 'Rows of grouped fields with "+ Add another" (max 5)' },
  { n: 9, name: 'Section index / Stepper', detail: 'Completion per section, or 24px step circles' },
  { n: 10, name: 'Action bar', detail: 'Sticky, elevation-2, Cancel · Save as draft · the only Primary' },
  { n: 11, name: 'Status text', detail: '"Draft saved 2 min ago" with a cloud check, or "Unsaved changes"' },
];

export const FormAnatomyLegend: React.FC = () => (
  <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
    {FORM_ANATOMY.map((a) => (
      <li key={a.n} className="flex items-start gap-3">
        <span className="mt-0.5 w-6 h-6 rounded-full bg-[#1E63FF] text-white text-[12px] font-semibold flex items-center justify-center shrink-0 tabular-nums">{a.n}</span>
        <span className="min-w-0">
          <span className="block text-[14px] leading-[20px] font-semibold text-[#121722]">{a.name}</span>
          <span className="block text-[13px] leading-[20px] text-[#4B5465]">{a.detail}</span>
        </span>
      </li>
    ))}
  </ol>
);
