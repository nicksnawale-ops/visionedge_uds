import React from 'react';
import { AXIS_TEXT, CHART_COLORS, formatNumber } from './chartUtils';

interface YAxisProps {
  ticks: number[];
  scale: (value: number) => number;
  /** Plot area left / right edges. */
  left: number;
  right: number;
  side?: 'left' | 'right';
  showGrid?: boolean;
  format?: (value: number) => string;
}

/** Horizontal 1px Gray 200 gridlines (no vertical lines) plus tick labels. */
export const YAxis: React.FC<YAxisProps> = ({
  ticks,
  scale,
  left,
  right,
  side = 'left',
  showGrid = true,
  format = formatNumber,
}) => (
  <g aria-hidden="true">
    {ticks.map((t) => {
      const y = Math.round(scale(t)) + 0.5;
      return (
        <g key={t}>
          {showGrid && <line x1={left} x2={right} y1={y} y2={y} stroke={CHART_COLORS.gray200} strokeWidth={1} />}
          <text
            x={side === 'left' ? left - 8 : right + 8}
            y={y}
            dy="0.32em"
            textAnchor={side === 'left' ? 'end' : 'start'}
            {...AXIS_TEXT}
          >
            {format(t)}
          </text>
        </g>
      );
    })}
  </g>
);

interface XLabelsProps {
  labels: { key: string; x: number; text: string }[];
  y: number;
  /** Show every nth label. Defaults to thinning automatically so labels never overlap. */
  every?: number;
}

/** Approximate rendered width of a 12px label, plus breathing room. */
const LABEL_CHAR_W = 7;
const LABEL_GAP = 8;

export const XLabels: React.FC<XLabelsProps> = ({ labels, y, every }) => {
  const spacing = labels.length > 1 ? Math.abs(labels[1].x - labels[0].x) : Infinity;
  const widest = Math.max(...labels.map((l) => l.text.length)) * LABEL_CHAR_W + LABEL_GAP;
  const step = every ?? Math.max(1, Math.ceil(widest / spacing));

  return (
    <g aria-hidden="true">
      {labels.map((l, i) =>
        i % step === 0 ? (
          <text key={l.key} x={l.x} y={y} textAnchor="middle" {...AXIS_TEXT}>
            {l.text}
          </text>
        ) : null
      )}
    </g>
  );
};
