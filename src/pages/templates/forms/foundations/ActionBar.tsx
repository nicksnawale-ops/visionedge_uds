import React from 'react';
import { CloudCheck, Loader2 } from 'lucide-react';
import { BUTTON } from '../../profile/ui';
import type { DraftStatus } from './useAutosave';

interface ActionBarProps {
  /** Status shown on the left. */
  status: DraftStatus | 'changes' | 'none';
  statusLabel: string;
  primaryLabel: string;
  /** Spinner label while submitting, e.g. "Creating…". */
  busyLabel: string;
  busy: boolean;
  onPrimary: () => void;
  onCancel: () => void;
  cancelLabel?: string;
  /** Secondary "Save as draft" (create forms only). */
  onSaveDraft?: () => void;
  markers?: { bar: React.ReactNode; status: React.ReactNode };
}

/**
 * Sticky bar along the bottom of the content area: status text on the left; Ghost Cancel, Secondary
 * Save as draft and the screen's only Primary on the right. Below 640px it stacks full width with the
 * Primary on top (column-reverse, so the tab order still matches the reading order).
 */
export const ActionBar: React.FC<ActionBarProps> = ({ status, statusLabel, primaryLabel, busyLabel, busy, onPrimary, onCancel, cancelLabel = 'Cancel', onSaveDraft, markers }) => (
  <div className="sticky bottom-0 z-20 bg-white border-t border-[#DDE2EA] shadow-[0_-4px_12px_rgba(11,45,107,0.12)]">
    {markers?.bar}
    <div className="mx-auto max-w-[1264px] px-4 @min-[640px]:px-6 py-4 flex flex-col @min-[640px]:flex-row @min-[640px]:items-center gap-3">
      <p className="relative flex-1 min-w-0 flex items-center gap-2 text-[13px] leading-[20px] text-[#4B5465]" aria-live="polite">
        {markers?.status}
        {status === 'saved' ? (
          <CloudCheck className="w-4 h-4 text-[#1E63FF] shrink-0" aria-hidden="true" />
        ) : status === 'saving' ? (
          <Loader2 className="w-4 h-4 motion-safe:animate-spin shrink-0" aria-hidden="true" />
        ) : status === 'unsaved' || status === 'changes' ? (
          <span className="w-2 h-2 rounded-full bg-[#1E63FF] shrink-0" aria-hidden="true" />
        ) : null}
        {statusLabel}
      </p>
      <div className="flex flex-col-reverse @min-[640px]:flex-row gap-2 [&>*]:w-full @min-[640px]:[&>*]:w-auto">
        <button type="button" onClick={onCancel} className={BUTTON.ghost}>
          {cancelLabel}
        </button>
        {onSaveDraft && (
          <button type="button" onClick={onSaveDraft} disabled={busy} className={`${BUTTON.secondary} disabled:opacity-50 disabled:cursor-not-allowed`}>
            Save as draft
          </button>
        )}
        <button type="button" onClick={onPrimary} aria-disabled={busy || undefined} className={`${BUTTON.primary} min-w-[148px] ${busy ? 'opacity-90 cursor-wait' : ''}`}>
          {busy && <Loader2 className="w-4 h-4 motion-safe:animate-spin" aria-hidden="true" />}
          {busy ? busyLabel : primaryLabel}
        </button>
      </div>
    </div>
  </div>
);
