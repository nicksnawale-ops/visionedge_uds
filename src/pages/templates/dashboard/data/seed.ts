/**
 * Deterministic sample data helpers. Every dataset is generated from a fixed seed,
 * so the dashboard looks the same on every render and every load (no Math.random).
 */

/** Mulberry32: tiny seeded PRNG returning floats in [0, 1). */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable numeric seed from any string (FNV-1a). */
export function hashSeed(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export const pick = <T,>(rand: () => number, items: readonly T[]): T => items[Math.floor(rand() * items.length)];

export const between = (rand: () => number, min: number, max: number): number =>
  Math.round(min + rand() * (max - min));

export const pad2 = (n: number): string => String(n).padStart(2, '0');
