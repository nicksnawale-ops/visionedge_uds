import React, { useRef, useState } from 'react';
import { ChartCard } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { useChartInteraction, useElementWidth, useEntryProgress } from './hooks';
import { AXIS_TEXT, CHART_COLORS, FOCUS_RING_CLASS, formatNumber } from './chartUtils';
import type { HeatmapRow } from './sampleData';

interface HeatmapProps {
  title: string;
  subtitle?: string;
  rows: HeatmapRow[];
  columns: string[];
  valueLabel: string;
}

/** 5-step Royal Blue scale: Gray 50, then Royal Blue at 20 / 40 / 70 / 100%. */
const SCALE = [
  { color: CHART_COLORS.gray50, opacity: 1 },
  { color: CHART_COLORS.royalBlue, opacity: 0.2 },
  { color: CHART_COLORS.royalBlue, opacity: 0.4 },
  { color: CHART_COLORS.royalBlue, opacity: 0.7 },
  { color: CHART_COLORS.royalBlue, opacity: 1 },
];

const LABEL_W = 40;
const CELL_H = 22;
const GAP = 2;
const X_LABEL_H = 22;
const MIN_WIDTH = 640; // below this the heatmap scrolls inside its own container

interface CellKey {
  row: number;
  col: number;
}

/** Weekday × hour grid. One tab stop; arrow keys move between cells (roving tabindex). */
export const Heatmap: React.FC<HeatmapProps> = ({ title, subtitle, rows, columns, valueLabel }) => {
  const [wrapRef, available] = useElementWidth<HTMLDivElement>();
  const { containerRef, active, setActive, pointFromEvent } = useChartInteraction<CellKey>();
  const [focusCell, setFocusCell] = useState<CellKey>({ row: 0, col: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const progress = useEntryProgress();

  const width = Math.max(available, MIN_WIDTH);
  const cellW = (width - LABEL_W) / columns.length - GAP;
  const height = rows.length * (CELL_H + GAP) + X_LABEL_H;
  const cellX = (c: number) => LABEL_W + c * (cellW + GAP);
  const cellY = (r: number) => r * (CELL_H + GAP);

  const max = Math.max(...rows.flatMap((r) => r.values));
  const bucketSize = Math.ceil(max / SCALE.length);
  const bucket = (v: number) => Math.min(SCALE.length - 1, Math.floor(v / bucketSize));

  let peak = { row: 0, col: 0, value: -1 };
  rows.forEach((r, ri) => r.values.forEach((v, ci) => v > peak.value && (peak = { row: ri, col: ci, value: v })));
  const insight = `${title}: busiest slot is ${rows[peak.row].day} ${columns[peak.col]} with ${formatNumber(peak.value)} ${valueLabel.toLowerCase()}; weekdays peak around 08:00 and 17:00, weekends are much quieter.`;

  const cellLabel = (r: number, c: number) =>
    `${rows[r].day} ${columns[c]}: ${formatNumber(rows[r].values[c])} ${valueLabel.toLowerCase()}`;

  const anchorOf = (cell: CellKey) => ({ x: cellX(cell.col) + cellW / 2, y: cellY(cell.row) + CELL_H / 2 });

  const moveFocus = (e: React.KeyboardEvent, cell: CellKey) => {
    const deltas: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    let next: CellKey | null = null;
    if (deltas[e.key]) {
      const [dr, dc] = deltas[e.key];
      next = {
        row: Math.min(rows.length - 1, Math.max(0, cell.row + dr)),
        col: Math.min(columns.length - 1, Math.max(0, cell.col + dc)),
      };
    } else if (e.key === 'Home') next = { row: cell.row, col: 0 };
    else if (e.key === 'End') next = { row: cell.row, col: columns.length - 1 };
    if (!next) return;
    e.preventDefault();
    setFocusCell(next);
    svgRef.current?.querySelector<SVGRectElement>(`[data-cell="${next.row}-${next.col}"]`)?.focus();
  };

  return (
    <ChartCard title={title} subtitle={subtitle}>
      <div ref={wrapRef} className="w-full overflow-x-auto">
        <div ref={containerRef} className="relative" style={{ width, height }}>
          <svg
            ref={svgRef}
            width={width}
            height={height}
            role="img"
            aria-label={`${insight} Use arrow keys to move between cells.`}
            className="block"
          >
            {rows.map((r, ri) => (
              <text key={r.day} x={0} y={cellY(ri) + CELL_H / 2} dy="0.32em" {...AXIS_TEXT} aria-hidden="true">
                {r.day}
              </text>
            ))}

            {rows.map((r, ri) =>
              r.values.map((v, ci) => {
                const step = SCALE[bucket(v)];
                const isActive = active?.key.row === ri && active.key.col === ci;
                const isFocusStop = focusCell.row === ri && focusCell.col === ci;
                return (
                  <rect
                    key={`${ri}-${ci}`}
                    data-cell={`${ri}-${ci}`}
                    x={cellX(ci)}
                    y={cellY(ri)}
                    width={cellW}
                    height={CELL_H}
                    rx={2}
                    fill={step.color}
                    fillOpacity={step.opacity * progress}
                    stroke={isActive ? CHART_COLORS.deepNavy : 'none'}
                    strokeWidth={2}
                    tabIndex={isFocusStop ? 0 : -1}
                    aria-label={cellLabel(ri, ci)}
                    className={FOCUS_RING_CLASS}
                    onMouseEnter={(e) => setActive({ key: { row: ri, col: ci }, ...pointFromEvent(e) })}
                    onMouseMove={(e) => setActive({ key: { row: ri, col: ci }, ...pointFromEvent(e) })}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => {
                      setFocusCell({ row: ri, col: ci });
                      setActive({ key: { row: ri, col: ci }, ...anchorOf({ row: ri, col: ci }) });
                    }}
                    onBlur={() => setActive(null)}
                    onKeyDown={(e) => moveFocus(e, { row: ri, col: ci })}
                  />
                );
              })
            )}

            {columns.map((c, ci) =>
              ci % 3 === 0 ? (
                <text
                  key={c}
                  x={cellX(ci) + cellW / 2}
                  y={height - 6}
                  textAnchor="middle"
                  {...AXIS_TEXT}
                  aria-hidden="true"
                >
                  {c}
                </text>
              ) : null
            )}
          </svg>

          {active && (
            <ChartTooltip
              x={active.x}
              y={active.y}
              width={width}
              height={height}
              title={`${rows[active.key.row].day} · ${columns[active.key.col]}`}
              rows={[{ label: valueLabel, value: formatNumber(rows[active.key.row].values[active.key.col]) }]}
            />
          )}
        </div>
      </div>

      {/* Legend scale */}
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2 text-[12px] text-[#353D4C]" aria-hidden="true">
        <span>Fewer</span>
        {SCALE.map((s, i) => (
          <span key={i} className="flex flex-col items-center gap-1">
            <span
              className="block w-9 h-3 rounded-[2px] border border-[#DDE2EA] relative overflow-hidden bg-white"
            >
              <span className="absolute inset-0" style={{ backgroundColor: s.color, opacity: s.opacity }} />
            </span>
            <span className="text-[11px] text-[#4B5465] tabular-nums">
              {formatNumber(i * bucketSize)}–{formatNumber(i === SCALE.length - 1 ? max : (i + 1) * bucketSize - 1)}
            </span>
          </span>
        ))}
        <span>More</span>
      </div>
    </ChartCard>
  );
};
