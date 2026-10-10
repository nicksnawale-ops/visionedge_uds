import React, { useEffect, useId, useLayoutEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { IconButton } from '../../profile/ui';

interface DrawerProps {
  title: string;
  description?: string;
  onClose: () => void;
  /** Sticky footer actions, right-aligned (Ghost Cancel … Primary). */
  footer: React.ReactNode;
  children: React.ReactNode;
  overlay?: React.ReactNode;
}

const FOCUSABLE = ['button:not([disabled])', 'a[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]']
  .map((s) => `${s}:not([tabindex="-1"])`)
  .join(', ');

/**
 * Right-side drawer (no shared one exists): 560px, elevation-3, 24px padding, sticky footer.
 * Below 768px it becomes a full-screen sheet. Focus moves in, stays inside, Esc closes, and focus
 * returns to the control that opened it.
 */
export const Drawer: React.FC<DrawerProps> = ({ title, description, onClose, footer, children, overlay }) => {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.animate([{ transform: 'translateX(24px)', opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }], { duration: 200, easing: 'cubic-bezier(0.2, 0, 0, 1)' });
  }, []);

  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>(`[data-drawer-body] :is(${FOCUSABLE})`)?.focus();
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as Partial<HTMLElement> | null;
      if (e.key === 'Escape') {
        if (typeof target?.getAttribute === 'function' && target.getAttribute('aria-expanded') === 'true') return;
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      if (e.shiftKey && document.activeElement === items[0]) {
        e.preventDefault();
        items[items.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === items[items.length - 1]) {
        e.preventDefault();
        items[0].focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (trigger?.isConnected) trigger.focus();
    };
  }, []); // Mount only.

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="relative w-full @min-[768px]:w-[560px] h-full flex flex-col bg-white @min-[768px]:border-l border-[#DDE2EA] shadow-[0_12px_32px_rgba(11,45,107,0.18)]"
      >
        {overlay}
        <div className="flex items-start justify-between gap-4 pl-6 pr-3 py-4 border-b border-[#DDE2EA]">
          <div className="min-w-0 pt-1">
            <h2 id={titleId} className="text-[20px] leading-[28px] font-semibold text-[#121722]">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-0.5 text-[14px] leading-[20px] text-[#4B5465]">
                {description}
              </p>
            )}
          </div>
          <IconButton icon={X} label={`Close ${title}`} onClick={onClose} />
        </div>
        <div data-drawer-body className="flex-1 min-h-0 overflow-y-auto p-6">
          {children}
        </div>
        <div className="sticky bottom-0 flex flex-col-reverse @min-[480px]:flex-row @min-[480px]:justify-end gap-2 px-6 py-4 border-t border-[#DDE2EA] bg-white [&>*]:w-full @min-[480px]:[&>*]:w-auto">
          {footer}
        </div>
      </div>
    </div>
  );
};
