import React, { useLayoutEffect, useRef, useState } from 'react';
import { CalendarRange, ChevronDown } from 'lucide-react';
import { RangePanel } from './pickers/DateRangePicker';
import { LABEL, SURFACE } from './ui/styles';

const noop = () => undefined;

/** Numbered parts and the selector that locates each one inside the live panel. */
const PARTS: ReadonlyArray<[n: number, name: string, desc: string, selector: string]> = [
  [1, 'Trigger field', '40px, label above, value "14 Sep – 24 Sep 2026"', '[data-anatomy-trigger]'],
  [2, 'Header', 'Month-year label button, 14px SemiBold; opens the month/year grid', '[data-part="header-label"]'],
  [3, 'Navigation', 'Prev/Next Ghost icon buttons, 32px, "Previous month"/"Next month"', '[data-part="nav-prev"]'],
  [4, 'Weekday row', 'Mo–Su, Overline 11px Gray 500, week starts Monday', '[data-part="weekdays"]'],
  [5, 'Today', '1px Royal Blue border, Royal Blue text', '[data-today="true"]'],
  [6, 'Selected', 'Royal Blue fill, White SemiBold (range start/end)', '[data-selected="true"]'],
  [7, 'Range band', 'Royal Blue 8%, continuous, rounded only at the ends', '[data-in-range="true"]'],
  [8, 'Disabled', 'Gray 300 text, not-allowed, reason in a tooltip', 'button[aria-disabled="true"]'],
  [9, 'Presets', '160px column; active = Royal Blue 8% + Royal Blue text', '[data-part="presets"]'],
  [10, 'Footer actions', 'Summary + Ghost "Cancel" + Primary Small "Apply"', '[data-part="footer"]'],
];

interface Marker {
  n: number;
  x: number;
  y: number;
}

/** The real range panel (inert) with numbered markers measured onto its parts. */
export const AnatomyDiagram: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const base = stage.getBoundingClientRect();
      const next: Marker[] = [];
      for (const [n, , , selector] of PARTS) {
        const all = stage.querySelectorAll<HTMLElement>(selector);
        const el = n === 7 ? all[Math.floor(all.length / 2)] : all[0];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        next.push({ n, x: r.left - base.left - 10, y: r.top - base.top - 10 });
      }
      setMarkers(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="preview-grid-canvas rounded-[12px] border border-[#DDE2EA] overflow-x-auto p-6">
        <div ref={stageRef} className="relative inline-flex flex-col gap-1 pt-2 pl-2">
          <div inert className="flex flex-col gap-1.5">
            <span className={LABEL}>Vehicle log · Date range</span>
            <span
              data-anatomy-trigger
              className="self-start inline-flex items-center gap-2 h-10 pl-3 pr-2 rounded-[8px] border border-[#1E63FF] ring-2 ring-[#1E63FF]/20 bg-white text-[14px] font-medium text-[#121722] tabular-nums"
            >
              <CalendarRange className="w-4 h-4 text-[#4B5465]" aria-hidden="true" />
              14 Sep – 24 Sep 2026
              <ChevronDown className="w-4 h-4 text-[#4B5465] rotate-180" aria-hidden="true" />
            </span>
            <div className={`${SURFACE} w-[716px] mt-1`}>
              <RangePanel
                initial={{ start: new Date(2026, 8, 14), end: new Date(2026, 8, 24) }}
                initialView={new Date(2026, 8, 1)}
                compact={false}
                touch={false}
                onApply={noop}
                onCancel={noop}
              />
            </div>
          </div>
          {markers.map((m) => (
            <span
              key={m.n}
              aria-hidden="true"
              style={{ left: m.x, top: m.y }}
              className="absolute z-10 w-5 h-5 rounded-full bg-[#0B2D6B] text-white text-[11px] font-semibold flex items-center justify-center ring-2 ring-white"
            >
              {m.n}
            </span>
          ))}
        </div>
      </div>
      <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
        {PARTS.map(([n, name, desc]) => (
          <li key={n} className="flex gap-3">
            <span className="w-5 h-5 shrink-0 rounded-full bg-[#0B2D6B] text-white text-[11px] font-semibold flex items-center justify-center" aria-hidden="true">
              {n}
            </span>
            <span>
              <span className="block text-[14px] font-semibold text-[#121722]">
                <span className="sr-only">{n}. </span>
                {name}
              </span>
              <span className="block text-[13px] leading-[18px] text-[#4B5465]">{desc}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};
