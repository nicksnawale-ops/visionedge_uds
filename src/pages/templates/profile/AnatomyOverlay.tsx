import React from 'react';

export { AnatomyMarker } from '../dashboard/AnatomyOverlay';

/** Numbered regions for "Show anatomy" (showcase) and the Layout Anatomy legend. */
export const PROFILE_ANATOMY: { n: number; name: string; detail: string }[] = [
  { n: 1, name: 'Breadcrumb', detail: '12px Gray 600: "Settings / My profile" or "Users / Rahul Mehta"' },
  { n: 2, name: 'Profile header', detail: '88px avatar with Change photo and status, name + role badge, contact line, actions' },
  { n: 3, name: 'Stats strip', detail: '4 cells with Overline labels and 1px Gray 200 dividers; 2×2 below 1024px' },
  { n: 4, name: 'Section nav', detail: 'Sticky vertical nav (40px items, 3px Royal Blue bar); tabs < 1024px, a select < 768px' },
  { n: 5, name: 'Section content', detail: 'H3 title + 14px description, then cards 24px apart' },
  { n: 6, name: 'Cards', detail: 'White, 1px Gray 200, 12px radius, 24px padding, H4 title' },
  { n: 7, name: 'Unsaved-changes bar', detail: 'Sticky, elevation-2, Discard + the only Primary "Save changes"' },
  { n: 8, name: 'Danger zone', detail: 'Admin view only: 4px Gray 900 left bar, Destructive actions with type-to-confirm' },
];

export const ProfileAnatomyLegend: React.FC = () => (
  <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
    {PROFILE_ANATOMY.map((a) => (
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
