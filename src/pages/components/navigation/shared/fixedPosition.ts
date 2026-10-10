/**
 * Converts a viewport point into coordinates for a `position: fixed` child of `el`.
 * A transformed ancestor (the sliding drawer, a scaled demo frame) becomes the containing block of fixed
 * elements, so the point is made relative to it and divided by its scale.
 */
export function fixedPoint(el: HTMLElement, x: number, y: number): { left: number; top: number } {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const s = getComputedStyle(p);
    // Tailwind v4 uses the individual translate/scale/rotate properties, which also create a containing block.
    const moved = [s.transform, s.translate, s.scale, s.rotate, s.filter, s.perspective].some((v) => v && v !== 'none');
    if (moved) {
      const r = p.getBoundingClientRect();
      const scale = p.offsetWidth ? r.width / p.offsetWidth : 1;
      return { left: (x - r.left) / scale, top: (y - r.top) / scale };
    }
  }
  return { left: x, top: y };
}
