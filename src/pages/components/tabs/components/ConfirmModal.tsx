import React, { useEffect, useId, useRef } from 'react';

interface ConfirmModalProps {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Small local confirmation (480px) for the unsaved-changes demo. Focus starts on the safe choice,
 * Tab stays inside, Esc cancels, and focus returns to whatever opened it. Listeners removed on unmount.
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, body, confirmLabel, cancelLabel, onConfirm, onCancel }) => {
  const titleId = useId();
  const bodyId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancelRef.current();
      } else if (e.key === 'Tab' && ref.current) {
        const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!items.length) return;
        if (e.shiftKey && document.activeElement === items[0]) {
          e.preventDefault();
          items[items.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === items[items.length - 1]) {
          e.preventDefault();
          items[0].focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (trigger?.isConnected) trigger.focus();
    };
  }, []); // Mount only.

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} aria-hidden="true" />
      <div ref={ref} role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={bodyId} className="relative w-full max-w-[480px] rounded-[16px] bg-white border border-[#DDE2EA] shadow-[0_12px_32px_rgba(11,45,107,0.18)]">
        <div className="p-6">
          <h2 id={titleId} className="text-[20px] leading-[28px] font-semibold text-[#121722]">
            {title}
          </h2>
          <p id={bodyId} className="mt-2 text-[14px] leading-[20px] text-[#4B5465]">
            {body}
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 py-4 border-t border-[#DDE2EA] bg-[#F7F9FC] rounded-b-[16px]">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="h-10 px-4 rounded-[8px] bg-white border border-[#1E63FF] text-[14px] font-semibold text-[#1E63FF] hover:bg-[#F7F9FC] hover:text-[#0B2D6B] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 px-4 rounded-[8px] bg-[#121722] text-[14px] font-semibold text-white hover:bg-black outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
