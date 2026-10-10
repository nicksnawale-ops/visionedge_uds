import React from 'react';

/** Numbered regions for "Show anatomy" (showcase) and the Layout Anatomy legend. */
export const ANATOMY_ITEMS: { n: number; name: string; detail: string }[] = [
  { n: 1, name: 'Shell sidebar', detail: 'Deep Navy, 240px (72px collapsed); product name, module nav, user block' },
  { n: 2, name: 'Top bar', detail: '64px White; search, site, Live toggle, notifications, user menu' },
  { n: 3, name: 'Page header', detail: 'H1 + context line, date range, Export, one Primary action' },
  { n: 4, name: 'Alert banner', detail: 'Critical (Deep Navy) or Info; only when there is something to act on' },
  { n: 5, name: 'KPI row', detail: '4 KPI tiles with trend and sparkline; Cyan top bar on the key one' },
  { n: 6, name: 'Main chart', detail: 'Primary trend for the module, with a tab switcher' },
  { n: 7, name: 'Live alerts', detail: '6 latest alerts with badges and Acknowledge' },
  { n: 8, name: 'Live cameras', detail: 'Camera tiles (2×2 or 3×3), click for the large view' },
  { n: 9, name: 'System health', detail: 'Uptime gauge, bullet bars, last sync' },
  { n: 10, name: 'Insights', detail: 'Two complementary charts, never repeating a chart type' },
  { n: 11, name: 'Recent events', detail: 'Table with search, filter, sort, selection and pagination' },
];

/** 24px Royal Blue marker with a dashed outline around its region. Place inside a `relative` element. */
export const AnatomyMarker: React.FC<{ n: number; show: boolean; inset?: boolean }> = ({ n, show, inset = false }) => {
  if (!show) return null;
  return (
    <>
      <span
        className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] outline-2 outline-dashed outline-[#1E63FF] -outline-offset-2"
        aria-hidden="true"
      />
      <span
        className={`pointer-events-none absolute z-40 w-6 h-6 rounded-full bg-[#1E63FF] text-white text-[12px] font-semibold flex items-center justify-center tabular-nums shadow-[0_4px_12px_rgba(11,45,107,0.12)] ${
          inset ? 'top-2 left-2' : '-top-3 -left-3'
        }`}
        aria-hidden="true"
      >
        {n}
      </span>
    </>
  );
};

/** Numbered legend that matches the markers. */
export const AnatomyLegend: React.FC = () => (
  <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
    {ANATOMY_ITEMS.map((a) => (
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
