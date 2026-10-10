import React from 'react';

export { AnatomyMarker } from '../dashboard/AnatomyOverlay';

/** Numbered regions for "Show anatomy" (showcase) and the Layout Anatomy legend. */
export const SETTINGS_ANATOMY: { n: number; name: string; detail: string }[] = [
  { n: 1, name: 'Page header', detail: 'H1 "Settings" + one-line subtitle naming the product; no Primary' },
  { n: 2, name: 'Settings search', detail: '280px, "/" shortcut; results from every section, grouped, with highlights' },
  { n: 3, name: 'Section nav', detail: 'Overline groups, 40px items, problem counts; tabs < 1024px, a select < 768px' },
  { n: 4, name: 'Section header', detail: 'H2 24/32 + 14px description' },
  { n: 5, name: 'Section card', detail: 'White, 12px radius; header 20 × 24px with H4 + 12px description' },
  { n: 6, name: 'Setting row', detail: 'Label + description (5/12), control (7/12); 20 × 24px padding' },
  { n: 7, name: 'Modified indicator', detail: '3px Royal Blue bar + "Modified" Overline until saved' },
  { n: 8, name: 'Locked row', detail: 'Lock icon with the reason in a tooltip; control disabled' },
  { n: 9, name: 'Unsaved-changes bar', detail: '"3 unsaved changes in …" + Discard + the only Primary' },
  { n: 10, name: 'Drawer', detail: '560px, elevation-3, sticky footer; full screen below 768px' },
  { n: 11, name: 'Danger zone', detail: '4px Gray 900 left bar; Destructive actions with confirmation' },
];

export const SettingsAnatomyLegend: React.FC = () => (
  <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
    {SETTINGS_ANATOMY.map((a) => (
      <li key={a.n} className="flex items-start gap-3">
        <span className="mt-0.5 w-6 h-6 rounded-full bg-[#1E63FF] text-white text-[12px] font-semibold flex items-center justify-center shrink-0 tabular-nums">
          {a.n}
        </span>
        <span className="min-w-0">
          <span className="block text-[14px] leading-[20px] font-semibold text-[#121722]">{a.name}</span>
          <span className="block text-[13px] leading-[20px] text-[#4B5465]">{a.detail}</span>
        </span>
      </li>
    ))}
  </ol>
);
