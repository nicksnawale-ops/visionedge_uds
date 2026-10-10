import React from 'react';

export interface BoxRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Detection box: 2px Cyan border, 4px radius, label chip (Cyan fill, Deep Navy text, JetBrains Mono 11px). */
export const DetectionBox: React.FC<{ rect: BoxRect; label: string; extra?: string; small?: boolean }> = ({ rect, label, extra, small = false }) => (
  <span
    aria-hidden="true"
    className="absolute border-2 border-[#00C6FF] rounded-[4px]"
    style={{ left: `${rect.left}%`, top: `${rect.top}%`, width: `${rect.width}%`, height: `${rect.height}%` }}
  >
    <span className={`absolute left-[-2px] bottom-full mb-0.5 flex items-center gap-1 ${small ? 'max-w-[110px]' : 'max-w-[260px]'}`}>
      <span className="min-w-0 px-1 py-px rounded-[2px] bg-[#00C6FF] text-[#0B2D6B] font-mono text-[11px] leading-[14px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
      {extra && !small && <span className="px-1 py-px rounded-[2px] bg-[#0B2D6B] text-white text-[11px] leading-[14px] font-medium whitespace-nowrap">{extra}</span>}
    </span>
  </span>
);
