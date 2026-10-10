import React, { useId, useRef } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useSurface } from '../surface/ControlRoomSurface';

interface ConfirmActionModalProps {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmation for physical / sensitive actions (e.g. opening a barrier). Focus starts on Cancel. */
export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({ title, body, confirmLabel, onConfirm, onCancel }) => {
  const t = useSurface();
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const bodyId = useId();
  useFocusTrap(ref, true, onCancel);
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
      <div aria-hidden="true" className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div ref={ref} role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={bodyId} className={`relative w-full max-w-[480px] rounded-[12px] border ${t.panel} shadow-[0_12px_32px_rgba(11,45,107,0.18)]`}>
        <div className="p-6">
          <h2 id={titleId} className={`text-[20px] leading-[28px] font-semibold ${t.text}`}>
            {title}
          </h2>
          <p id={bodyId} className={`mt-2 text-[14px] leading-[20px] ${t.muted}`}>
            {body}
          </p>
        </div>
        <div className={`flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 py-4 border-t ${t.border}`}>
          <button type="button" data-autofocus onClick={onCancel} className={`${t.btn.secondary} h-10 px-4 text-[14px]`}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className={t.btn.primary}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
