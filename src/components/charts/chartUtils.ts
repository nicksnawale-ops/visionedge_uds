import type { CSSProperties } from 'react';
import { JSON_TOKENS } from '../../theme/tokens';

const { brand, neutral } = JSON_TOKENS.colors;

/** Chart colours, sourced from the design tokens (no new HEX values). */
export const CHART_COLORS = {
  deepNavy: brand.deepNavy,
  royalBlue: brand.royalBlue,
  cyan: brand.cyan,
  gray400: neutral.gray400,
  white: neutral.white,
  gray50: neutral.gray50,
  gray100: neutral.gray100,
  gray200: neutral.gray200,
  gray600: neutral.gray600,
  gray700: neutral.gray700,
  gray900: neutral.gray900,
} as const;

/** Strict series order: Deep Navy → Royal Blue → Cyan → Gray 400 (then the same at 50% opacity). */
export const SERIES_COLORS = [
  CHART_COLORS.deepNavy,
  CHART_COLORS.royalBlue,
  CHART_COLORS.cyan,
  CHART_COLORS.gray400,
] as const;

export const MAX_SERIES = 4;
export const DIM_OPACITY = 0.4;
export const ANIMATION_MS = 300;

export const AXIS_TEXT = {
  fontSize: 12,
  fill: CHART_COLORS.gray600,
  style: { fontVariantNumeric: 'tabular-nums' } as CSSProperties,
};

/** Monospace font stack for camera IDs and tooltip values. */
export const MONO_FONT = '"JetBrains Mono", Consolas, "Courier New", monospace';

/** Tailwind classes giving SVG data marks a visible keyboard focus ring. */
export const FOCUS_RING_CLASS =
  'cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E63FF]';

export const formatNumber = (n: number): string => n.toLocaleString('en-US');

export const formatPercent = (n: number, digits = 0): string => `${n.toFixed(digits)}%`;

export interface NiceScale {
  max: number;
  ticks: number[];
}

/** Rounds an axis maximum up to a "nice" value and returns evenly spaced ticks. */
export function niceScale(maxValue: number, tickCount = 5): NiceScale {
  if (maxValue <= 0) return { max: 1, ticks: [0, 1] };
  const raw = maxValue / tickCount;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / magnitude;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * magnitude;
  const max = Math.ceil(maxValue / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= max + step / 1000; v += step) ticks.push(Math.round(v * 1000) / 1000);
  return { max, ticks };
}

/** Vertical bar with a rounded top (radius clamped to the bar size). */
export function topRoundedBarPath(x: number, y: number, w: number, h: number, r = 4): string {
  if (h <= 0 || w <= 0) return '';
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h}V${y + rr}A${rr},${rr} 0 0 1 ${x + rr},${y}H${x + w - rr}A${rr},${rr} 0 0 1 ${x + w},${y + rr}V${y + h}Z`;
}

/** Horizontal bar with a rounded right end. */
export function endRoundedBarPath(x: number, y: number, w: number, h: number, r = 4): string {
  if (h <= 0 || w <= 0) return '';
  const rr = Math.min(r, h / 2, w);
  return `M${x},${y}H${x + w - rr}A${rr},${rr} 0 0 1 ${x + w},${y + rr}V${y + h - rr}A${rr},${rr} 0 0 1 ${x + w - rr},${y + h}H${x}Z`;
}

/** Opacity for a mark given the currently highlighted key (null = nothing highlighted). */
export function markOpacity<K>(key: K, activeKey: K | null | undefined): number {
  return activeKey == null || activeKey === key ? 1 : DIM_OPACITY;
}
