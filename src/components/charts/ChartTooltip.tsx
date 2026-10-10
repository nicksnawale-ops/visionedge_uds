import React from 'react';

export interface TooltipRow {
  label: string;
  value: string;
  color?: string;
  opacity?: number;
}

interface ChartTooltipProps {
  /** Cursor / anchor position relative to the chart container. */
  x: number;
  y: number;
  /** Container size, used to flip the tooltip away from the edges. */
  width: number;
  height: number;
  title?: string;
  rows: TooltipRow[];
}

const OFFSET = 12;

/**
 * White tooltip with elevation-2. Sits beside the cursor and flips to the other side
 * past the container midpoint, so it never covers the hovered point or leaves the chart.
 */
export const ChartTooltip: React.FC<ChartTooltipProps> = ({ x, y, width, height, title, rows }) => {
  const flipX = x > width / 2;
  const flipY = y > height / 2;

  return (
    <div
      aria-hidden="true"
      className="absolute z-10 pointer-events-none bg-white border border-[#DDE2EA] rounded-[8px] shadow-[0_4px_12px_rgba(11,45,107,0.12)] px-3 py-2 text-[12px] whitespace-nowrap"
      style={{
        left: flipX ? x - OFFSET : x + OFFSET,
        top: flipY ? y - OFFSET : y + OFFSET,
        transform: `translate(${flipX ? '-100%' : '0'}, ${flipY ? '-100%' : '0'})`,
      }}
    >
      {title && <div className="font-semibold text-[#121722] mb-1">{title}</div>}
      <div className="space-y-0.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#353D4C]">
              {row.color && (
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: row.color, opacity: row.opacity ?? 1 }}
                />
              )}
              {row.label}
            </span>
            <span className="font-mono font-medium text-[#121722] text-right tabular-nums">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
