const TABBABLE = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]';

export const tabbables = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(TABBABLE)).filter((el) => el.tabIndex >= 0 && el.getClientRects().length > 0);

/** Focuses `[data-autofocus]` inside root, else the first tabbable element. */
export const focusInitial = (root: HTMLElement): void => {
  const target = root.querySelector<HTMLElement>('[data-autofocus="true"]') ?? tabbables(root)[0];
  target?.focus({ preventScroll: true });
};

/** Esc closes; Tab and Shift+Tab cycle inside the panel. */
export const panelKeyDown = (e: React.KeyboardEvent, root: HTMLElement | null, trap: boolean, onEscape: () => void): void => {
  if (e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    onEscape();
    return;
  }
  if (e.key !== 'Tab' || !trap || !root) return;
  const list = tabbables(root);
  if (!list.length) return;
  const first = list[0];
  const last = list[list.length - 1];
  const active = document.activeElement;
  if (e.shiftKey && (active === first || !root.contains(active))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (active === last || !root.contains(active))) {
    e.preventDefault();
    first.focus();
  }
};
