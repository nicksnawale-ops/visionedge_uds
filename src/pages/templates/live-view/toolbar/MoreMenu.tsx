import React, { useEffect, useId, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useSurface } from '../surface/ControlRoomSurface';

export interface MoreItem {
  label: string;
  onSelect: () => void;
}

/** "More" menu for toolbar actions on small screens (role="menu", arrow keys, Esc returns focus). */
export const MoreMenu: React.FC<{ items: MoreItem[]; label?: string }> = ({ items, label = 'More actions' }) => {
  const t = useSurface();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLElement>('[role=menuitem]')?.focus();
    const onDown = (e: PointerEvent) => {
      if (!menu.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  return (
    <div className="relative">
      <button ref={btn} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined} aria-label={label} onClick={() => setOpen((o) => !o)} className={`${t.btn.icon} w-11 h-11`}>
        <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
      </button>
      {open && (
        <div
          ref={menu}
          id={id}
          role="menu"
          aria-label={label}
          onKeyDown={(e) => {
            const els = Array.from(menu.current?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? []);
            const i = els.indexOf(document.activeElement as HTMLElement);
            if (e.key === 'ArrowDown') els[(i + 1) % els.length]?.focus();
            else if (e.key === 'ArrowUp') els[(i - 1 + els.length) % els.length]?.focus();
            else if (e.key === 'Escape') {
              setOpen(false);
              btn.current?.focus();
            } else return;
            e.preventDefault();
          }}
          className={`absolute right-0 top-full mt-2 z-40 w-[220px] py-1 rounded-[8px] ${t.popover}`}
        >
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => {
                setOpen(false);
                btn.current?.focus();
                it.onSelect();
              }}
              className={`w-full h-11 px-4 text-left text-[14px] ${t.text} ${t.hover} ${t.focusInset}`}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
