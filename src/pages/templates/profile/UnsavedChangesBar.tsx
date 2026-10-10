import React, { useLayoutEffect, useRef } from 'react';
import { BUTTON, Spinner } from './ui';

interface UnsavedChangesBarProps {
  onDiscard: () => void;
  onSave: () => void;
  saving: boolean;
  /** Summary text, e.g. "3 unsaved changes in Detection & AI". Default "You have unsaved changes". */
  message?: string;
  marker?: React.ReactNode;
}

/**
 * Sticky bar at the bottom of the content area while there are unsaved changes:
 * White, elevation-2, 1px top border, 16px padding. "Save changes" is the only Primary on the page.
 * Below 768px the buttons stack full width.
 */
export const UnsavedChangesBar: React.FC<UnsavedChangesBarProps> = ({ onDiscard, onSave, saving, message, marker }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Slide up on appear (not with reduced motion).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.animate([{ transform: 'translateY(100%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], {
      duration: 200,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
    });
  }, []);

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Unsaved changes"
      className="sticky bottom-0 z-20 bg-white border-t border-[#DDE2EA] shadow-[0_-4px_12px_rgba(11,45,107,0.12)]"
    >
      {marker}
      <div className="mx-auto max-w-[1264px] p-4 @min-[768px]:px-8 flex flex-col @min-[768px]:flex-row @min-[768px]:items-center gap-3">
        <p className="flex-1 text-[14px] leading-[20px] font-medium text-[#121722]">
          {saving ? 'Saving your changes…' : (message ?? 'You have unsaved changes')}
        </p>
        <div className="flex flex-col-reverse @min-[768px]:flex-row gap-2">
          <button type="button" onClick={onDiscard} disabled={saving} className={`${BUTTON.ghost} disabled:opacity-50 disabled:cursor-not-allowed`}>
            Discard
          </button>
          <button
            type="button"
            onClick={onSave}
            aria-disabled={saving || undefined}
            className={`${BUTTON.primary} min-w-[136px] ${saving ? 'opacity-90 cursor-wait' : ''}`}
          >
            {saving ? (
              <>
                <Spinner />
                Saving…
              </>
            ) : (
              'Save changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
