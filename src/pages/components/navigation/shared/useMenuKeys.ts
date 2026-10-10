import { useCallback, useEffect } from 'react';

const ITEM = '[role="menuitem"]:not([aria-disabled="true"]), [role="menuitemradio"]:not([aria-disabled="true"])';

/**
 * Menu keyboard support (role="menu"): focuses the first item on open; ↑/↓ move and wrap, Home/End jump,
 * Esc closes and returns focus to the button, Tab closes. Returns the onKeyDown handler for the menu element.
 */
export function useMenuKeys(menuRef: React.RefObject<HTMLElement | null>, open: boolean, close: () => void, buttonRef?: React.RefObject<HTMLElement | null>, focusLast = false) {
  useEffect(() => {
    if (!open) return;
    const items = menuRef.current?.querySelectorAll<HTMLElement>(ITEM);
    if (!items?.length) return;
    (focusLast ? items[items.length - 1] : items[0]).focus();
  }, [open, menuRef, focusLast]);

  return useCallback(
    (e: React.KeyboardEvent) => {
      const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>(ITEM) ?? []);
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.key === 'ArrowDown') items[(i + 1) % items.length]?.focus();
      else if (e.key === 'ArrowUp') items[(i - 1 + items.length) % items.length]?.focus();
      else if (e.key === 'Home') items[0]?.focus();
      else if (e.key === 'End') items[items.length - 1]?.focus();
      else if (e.key === 'Escape') {
        close();
        buttonRef?.current?.focus();
      } else if (e.key === 'Tab') {
        close();
        return;
      } else return;
      e.preventDefault();
      e.stopPropagation();
    },
    [menuRef, close, buttonRef]
  );
}
