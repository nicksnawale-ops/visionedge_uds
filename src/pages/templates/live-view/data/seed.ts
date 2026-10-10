/** Deterministic data helpers: the Dashboard template's seeded PRNG, reused read-only. */
export { seeded, hashSeed, pick, between, pad2 } from '../../dashboard/data/seed';

/** "Now" in the demo: 14:05:00 IST (seconds after midnight). The live clock ticks on from here. */
export const NOW_START = 14 * 3600 + 5 * 60;

/** "14:05:32" */
export const clock = (secondOfDay: number): string => {
  const s = ((secondOfDay % 86400) + 86400) % 86400;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
};

/** "12s ago", "3 min ago", "1 h ago" */
export const ago = (seconds: number): string => {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  return `${Math.floor(s / 3600)} h ago`;
};
