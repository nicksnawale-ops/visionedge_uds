import React from 'react';
import { Eye, ShieldAlert } from 'lucide-react';
import { useToast } from '../../../../../components/common/Toast';
import type { VehicleRow } from '../sampleData';
import { BTN } from '../tableStyles';

const OVERLINE = 'text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]';

/** Decorative 160×90 camera snapshot: black tile, a Cyan detection box around a plate chip. */
const Snapshot: React.FC<{ plate: string }> = ({ plate }) => (
  <div aria-hidden="true" className="relative w-[160px] h-[90px] shrink-0 rounded-[8px] bg-black overflow-hidden">
    <span className="absolute inset-x-0 bottom-0 h-1/2 bg-white/[0.06]" />
    <span className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 p-1 border-2 border-[#00C6FF] rounded-[2px]">
      <span className="block px-1.5 py-0.5 rounded-[2px] bg-white font-mono text-[9px] font-semibold text-[#121722] whitespace-nowrap">{plate}</span>
    </span>
    <span className="absolute left-1.5 top-1 font-mono text-[9px] text-white/70">LIVE · IST</span>
  </div>
);

/**
 * Expanded detail (Gray 50, 16px 24px): snapshot, a 2-column detail list and actions.
 * Stacks vertically below 768px.
 */
export const ExpandedRow: React.FC<{ row: VehicleRow }> = ({ row }) => {
  const { showToast } = useToast();
  const details: [string, string][] = [
    ['Camera ID', row.cameraId],
    ['Direction', row.direction],
    ['Confidence', `${row.confidence}%`],
    ['Vehicle color', row.color],
    ['Lane', `Lane ${row.lane}`],
    ['Recorded by', row.recordedBy],
  ];
  return (
    <div className="px-6 py-4 max-[767px]:px-4 bg-[#F7F9FC] flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
      <Snapshot plate={row.plate} />
      <dl className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 min-w-0">
        {details.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className={OVERLINE}>{k}</dt>
            <dd className="mt-0.5 text-[14px] text-[#121722] whitespace-normal">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
        <button type="button" onClick={() => showToast(`Opening event ${row.id}`, 'info')} className={BTN.secondarySm}>
          <Eye className="w-4 h-4" aria-hidden="true" />
          View full event
        </button>
        <button type="button" onClick={() => showToast(`${row.plate} added to the watchlist`, 'success')} className={BTN.ghostSm}>
          <ShieldAlert className="w-4 h-4" aria-hidden="true" />
          Add to watchlist
        </button>
      </div>
    </div>
  );
};
