/**
 * Shared drawing style for the error illustrations, matching the Login backgrounds:
 * 1.5px Royal Blue strokes at 35%, flat fills Royal Blue 8% and Cyan 12%, rounded joins, no gradients.
 * Every illustration is decorative (aria-hidden) on a 200 × 160 canvas.
 */
import React from 'react';

export const LINE = {
  fill: 'none',
  stroke: '#1E63FF',
  strokeOpacity: 0.35,
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** Royal Blue 8% fill with the standard stroke. */
export const BLUE = { ...LINE, fill: '#1E63FF', fillOpacity: 0.08 } as const;
/** Cyan 12% fill with the standard stroke. */
export const CYAN = { ...LINE, fill: '#00C6FF', fillOpacity: 0.12 } as const;
/** Solid stroke-coloured dot (indicator lights). */
export const DOT = { fill: '#1E63FF', fillOpacity: 0.35 } as const;

export interface IllustrationProps {
  /** Width in px; height is 80% of it. */
  size?: number;
}

export const Canvas: React.FC<IllustrationProps & { children: React.ReactNode }> = ({ size = 200, children }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 200 160" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    {children}
  </svg>
);

/** Soft ground line every illustration stands on. */
export const Ground: React.FC = () => <path d="M24 146h152" {...LINE} strokeDasharray="2 6" />;

/** Browser window: frame, title bar and three dots. */
export const BrowserWindow: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={8} {...BLUE} />
    <path d={`M${x} ${y + 16}h${w}`} {...LINE} />
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={x + 10 + i * 8} cy={y + 8} r={2} {...DOT} />
    ))}
  </g>
);

/** Server rack with n units and indicator lights. */
export const Rack: React.FC<{ x: number; y: number; w: number; units: number }> = ({ x, y, w, units }) => (
  <g>
    {Array.from({ length: units }, (_, i) => (
      <g key={i}>
        <rect x={x} y={y + i * 22} width={w} height={18} rx={4} {...BLUE} />
        <circle cx={x + 10} cy={y + i * 22 + 9} r={2} {...DOT} />
        <path d={`M${x + 20} ${y + i * 22 + 9}h${w - 34}`} {...LINE} />
      </g>
    ))}
  </g>
);

/** Round badge (Cyan 12%) holding a small symbol. */
export const Badge: React.FC<{ cx: number; cy: number; r?: number; children: React.ReactNode }> = ({ cx, cy, r = 16, children }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} {...CYAN} />
    {children}
  </g>
);

/** Hourglass symbol centred on (cx, cy). */
export const Hourglass: React.FC<{ cx: number; cy: number; s?: number }> = ({ cx, cy, s = 1 }) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`}>
    <path d="M-6 -9h12M-6 9h12M-5 -9c0 6 10 6 10 9s-10 3-10 9M5 -9c0 6-10 6-10 9s10 3 10 9" {...LINE} />
  </g>
);

/** Exclamation drawn with strokes (no text). */
export const Exclamation: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g>
    <path d={`M${cx} ${cy - 7}v8`} {...LINE} />
    <circle cx={cx} cy={cy + 6} r={1.3} {...DOT} />
  </g>
);
