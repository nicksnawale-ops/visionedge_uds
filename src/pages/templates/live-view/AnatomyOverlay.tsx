import React from 'react';

export const ANATOMY: { n: number; name: string; detail: string }[] = [
  { n: 1, name: 'Live toolbar', detail: '56px: title, site and zone, layout, Live indicator, IST clock, actions' },
  { n: 2, name: 'Layout switcher', detail: '1 · 2×2 · 3×3 · 4×4 · 1+5 with tooltips' },
  { n: 3, name: 'Stats strip', detail: '4 compact cells per use case, 1px dividers' },
  { n: 4, name: 'Camera list', detail: '280px, Site → Zone → Camera, saved views, drag to a tile' },
  { n: 5, name: 'Video wall', detail: 'Tiles per layout, 8px gaps, 16:9, arrow-key grid' },
  { n: 6, name: 'Camera tile overlays', detail: 'Black 60% strips: LIVE/REC, time, HD/SD, camera name, controls on hover' },
  { n: 7, name: 'Detection box', detail: '2px Cyan, 4px radius, 11px JetBrains Mono label chip' },
  { n: 8, name: 'Activity panel', detail: '360px, Detections · Alerts · Camera info' },
  { n: 9, name: 'Detection item', detail: '72px: thumbnail, identifier, camera, time, confidence, badge' },
  { n: 10, name: 'Timeline & playback', detail: '96px scrubber with event markers and playback controls' },
  { n: 11, name: 'Alert banner', detail: 'Critical inline banner above the wall (Critical alert state)' },
];

/** Numbered anatomy marker (reference page "Show anatomy"). Decorative. */
export const AnatomyMarker: React.FC<{ n: number; show: boolean; className?: string }> = ({ n, show, className = '-top-2.5 -left-2.5' }) =>
  show ? (
    <span aria-hidden="true" className={`absolute z-30 w-6 h-6 rounded-full bg-[#1E63FF] text-white text-[12px] font-semibold flex items-center justify-center ring-2 ring-white pointer-events-none ${className}`}>
      {n}
    </span>
  ) : null;

export const AnatomyLegend: React.FC = () => (
  <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
    {ANATOMY.map((a) => (
      <li key={a.n} className="flex gap-3">
        <span aria-hidden="true" className="w-6 h-6 mt-0.5 shrink-0 rounded-full bg-[#1E63FF] text-white text-[12px] font-semibold flex items-center justify-center">
          {a.n}
        </span>
        <span>
          <span className="block text-[14px] font-semibold text-[#121722]">{a.name}</span>
          <span className="block text-[13px] text-[#4B5465]">{a.detail}</span>
        </span>
      </li>
    ))}
  </ol>
);
