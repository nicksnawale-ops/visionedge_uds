import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

/** Dismissible demo hint for the full-screen template routes (bottom-right from 1024px, below the screen on smaller). */
export const DemoHint: React.FC<{ text: string }> = ({ text }) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="flex justify-center px-4 pb-4 lg:p-0 lg:fixed lg:bottom-4 lg:right-4 lg:z-50">
      <div
        role="note"
        className="inline-flex items-center gap-2 max-w-full min-h-[44px] pl-3 pr-1 rounded-[22px] bg-white border border-[#DDE2EA] shadow-[0_4px_12px_rgba(11,45,107,0.12)] text-[12px] leading-[16px] text-[#353D4C]"
      >
        <Info className="w-4 h-4 shrink-0 text-[#1E63FF]" aria-hidden="true" />
        <span className="min-w-0 font-mono py-1">{text}</span>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss demo hint"
          className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

/** Sets the document title while a full-screen route is open. */
export function useDocumentTitle(title: string): void {
  React.useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
