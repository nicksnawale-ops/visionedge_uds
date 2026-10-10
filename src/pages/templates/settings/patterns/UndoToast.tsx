import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export interface UndoToastItem {
  id: number;
  message: string;
  onUndo: () => void;
}

/**
 * Toast with an Undo action (the shared Toast has no action slot, so this sits beside it).
 * Same look as the shared toast: white, Cyan left bar, elevation-2. Shown for 5 seconds, bottom centre.
 */
export const UndoToast: React.FC<{ item: UndoToastItem | null; onUndo: () => void; onDismiss: () => void; raised: boolean }> = ({ item, onUndo, onDismiss, raised }) => (
  <div className={`fixed left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-32px)] max-w-[420px] ${raised ? 'bottom-28' : 'bottom-5'}`} role="status" aria-live="polite">
    {item && (
      <div className="flex items-center gap-3 pl-4 pr-1 py-1 rounded-[8px] bg-white border border-[#DDE2EA] border-l-4 border-l-[#00C6FF] shadow-[0_4px_12px_rgba(11,45,107,0.12)]">
        <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00C6FF]" aria-hidden="true" />
        <p className="flex-1 min-w-0 py-2 text-[13px] leading-[18px] font-medium text-[#121722]">{item.message}</p>
        <button
          type="button"
          onClick={onUndo}
          className="h-11 px-3 rounded-[8px] text-[13px] font-semibold text-[#1E63FF] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="w-11 h-11 rounded-[8px] flex items-center justify-center text-[#4B5465] hover:bg-[#EEF1F6] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    )}
  </div>
);
