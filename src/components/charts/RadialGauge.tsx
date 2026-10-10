import React from 'react';
import { ChartCard } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { useChartInteraction, useEntryProgress } from './hooks';
import { CHART_COLORS } from './chartUtils';

interface RadialGaugeProps {
  title: string;
  subtitle?: string;
  /** Percentage, 0–100. */
  value: number;
  target: number;
  valueLabel: string;
}

const SIZE = 240;
const CX = SIZE / 2;
const CY = 116;
const R = 92;
const STROKE = 14;
const START = 135; // degrees, clockwise from 3 o'clock
const SWEEP = 270;

const toXY = (deg: number, r = R) => {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
};

const arcPath = (fromDeg: number, toDeg: number) => {
  const a = toXY(fromDeg);
  const b = toXY(toDeg);
  const large = toDeg - fromDeg > 180 ? 1 : 0;
  return `M${a.x},${a.y}A${R},${R} 0 ${large} 1 ${b.x},${b.y}`;
};

/** 270° gauge: Gray 200 track, Royal Blue value, Deep Navy target tick, KPI value in the centre. */
export const RadialGauge: React.FC<RadialGaugeProps> = ({ title, subtitle, value, target, valueLabel }) => {
  const { containerRef, active, bind } = useChartInteraction<'value'>();
  const progress = useEntryProgress();

  const pct = Math.min(100, Math.max(0, value));
  const valueEnd = START + (SWEEP * pct * progress) / 100;
  const targetDeg = START + (SWEEP * target) / 100;
  const tickIn = toXY(targetDeg, R - STROKE / 2 - 5);
  const tickOut = toXY(targetDeg, R + STROKE / 2 + 5);
  const gap = value - target;
  const insight = `${title} is ${value.toFixed(1)}%, ${Math.abs(gap).toFixed(1)} points ${gap < 0 ? 'below' : 'above'} the ${target}% target.`;

  return (
    <ChartCard title={title} subtitle={subtitle} className="max-w-md">
      <div className="flex justify-center">
        <div ref={containerRef} className="relative" style={{ width: SIZE, height: 210 }}>
          <svg width={SIZE} height={210} role="img" aria-label={insight} className="block">
            <path d={arcPath(START, START + SWEEP)} fill="none" stroke={CHART_COLORS.gray200} strokeWidth={STROKE} />
            {progress > 0 && (
              <path
                d={arcPath(START, valueEnd)}
                fill="none"
                stroke={CHART_COLORS.royalBlue}
                strokeWidth={STROKE}
                {...bind('value', toXY((START + valueEnd) / 2), `${valueLabel} ${value.toFixed(1)}%, target ${target}%`)}
              />
            )}
            <line
              x1={tickIn.x}
              y1={tickIn.y}
              x2={tickOut.x}
              y2={tickOut.y}
              stroke={CHART_COLORS.deepNavy}
              strokeWidth={2}
              aria-hidden="true"
            />
          </svg>

          <div className="absolute inset-x-0 top-[78px] flex flex-col items-center pointer-events-none" aria-hidden="true">
            <span className="text-[32px] leading-[40px] font-bold text-[#0B2D6B] tabular-nums">{value.toFixed(1)}%</span>
            <span className="text-[12px] leading-[16px] text-[#4B5465]">Target {target}%</span>
          </div>

          {active && (
            <ChartTooltip
              x={active.x}
              y={active.y}
              width={SIZE}
              height={210}
              title={valueLabel}
              rows={[
                { label: 'Current', value: `${value.toFixed(1)}%`, color: CHART_COLORS.royalBlue },
                { label: 'Target', value: `${target.toFixed(1)}%`, color: CHART_COLORS.deepNavy },
                { label: 'Gap', value: `${gap < 0 ? '−' : '+'}${Math.abs(gap).toFixed(1)} pts` },
              ]}
            />
          )}
        </div>
      </div>
    </ChartCard>
  );
};
