import React, { useId, useState } from 'react';
import { Download } from 'lucide-react';
import { BUTTON, POPOVER, Segmented, usePopover } from '../primitives';
import { RANGES, RangeId } from '../data/useCases';
import type { DashboardUseCase } from '../data/useCases';

interface PageHeaderProps {
  useCase: DashboardUseCase;
  site: string;
  updated: string;
  range: RangeId;
  /** Label shown for the custom range, e.g. "17–30 Sep". */
  customLabel: string;
  onRangeChange: (range: RangeId, customLabel?: string) => void;
  onExport: () => void;
  onPrimary: () => void;
  rangeRef?: React.Ref<HTMLDivElement>;
  anatomy?: React.ReactNode;
}

const formatDay = (iso: string) => {
  const [, m, d] = iso.split('-').map(Number);
  return `${d} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]}`;
};

/** H1 + context line; date range, Export (Secondary) and exactly one Primary action. Actions wrap below on mobile. */
export const PageHeader: React.FC<PageHeaderProps> = ({
  useCase,
  site,
  updated,
  range,
  customLabel,
  onRangeChange,
  onExport,
  onPrimary,
  rangeRef,
  anatomy,
}) => {
  const PrimaryIcon = useCase.primaryAction.icon;
  const popover = usePopover<HTMLDivElement>();
  const fromId = useId();
  const toId = useId();
  const [from, setFrom] = useState('2026-09-17');
  const [to, setTo] = useState('2026-09-30');
  const valid = from <= to;

  return (
    <div className="relative col-span-12 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      {anatomy}
      <div className="min-w-0">
        <h1 className="text-[28px] leading-[36px] font-semibold text-[#121722]">Dashboard</h1>
        <p className="mt-1 text-[14px] leading-[20px] text-[#4B5465]">
          {useCase.organization} · {site} · {updated}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div ref={popover.rootRef} className="relative">
          <div ref={rangeRef} tabIndex={-1} className="outline-none">
            <Segmented
              label="Date range"
              options={RANGES.map((r) => ({ id: r.id, label: r.id === 'custom' && range === 'custom' ? customLabel : r.label }))}
              value={range}
              onChange={(id) => {
                if (id === 'custom') popover.setOpen(true);
                else onRangeChange(id);
              }}
            />
          </div>
          {popover.open && (
            <div role="dialog" aria-label="Custom date range" className={`${POPOVER} right-0 w-[280px] p-4 space-y-3`}>
              {[
                { id: fromId, label: 'From', value: from, set: setFrom },
                { id: toId, label: 'To', value: to, set: setTo },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block mb-1.5 text-[14px] font-medium text-[#121722]">
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    type="date"
                    value={f.value}
                    min="2026-01-01"
                    max="2026-09-30"
                    onChange={(e) => f.set(e.target.value)}
                    className="w-full h-10 px-3 rounded-[8px] border border-[#8C95A6] text-[14px] text-[#121722] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20"
                  />
                </div>
              ))}
              {!valid && <p className="text-[12px] font-medium text-[#0B2D6B]">Choose an end date after the start date.</p>}
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => popover.setOpen(false)} className={BUTTON.ghostSm}>
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!valid}
                  onClick={() => {
                    onRangeChange('custom', `${formatDay(from)} – ${formatDay(to)}`);
                    popover.setOpen(false);
                  }}
                  className={`${BUTTON.secondarySm} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
        <button type="button" onClick={onExport} className={BUTTON.secondary}>
          <Download className="w-4 h-4" aria-hidden="true" />
          Export report
        </button>
        <button type="button" onClick={onPrimary} className={BUTTON.primary}>
          <PrimaryIcon className="w-4 h-4" aria-hidden="true" />
          {useCase.primaryAction.label}
        </button>
      </div>
    </div>
  );
};
