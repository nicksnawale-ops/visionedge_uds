import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { CriticalAlert } from '../../../shared/authUi';
import { BUTTON } from '../../../profile/ui';
import { IMPORT_COUNTS } from '../../data/importSample';
import { FormSection } from '../../foundations/FormSection';

interface ImportStepProps {
  progress: number;
  failed: boolean;
  onCancel: () => void;
  onRetry: () => void;
  /** Throttled announcement (every 25%). */
  announced: string;
}

/** Step 4 — Import: progress bar "Importing 248 records… 62%" with Cancel import. */
export const ImportStep: React.FC<ImportStepProps> = ({ progress, failed, onCancel, onRetry, announced }) => (
  <FormSection title="Importing" description="You can leave this page; we'll email you when the import finishes.">
    {failed ? (
      <div role="alert">
        <CriticalAlert icon={ShieldAlert}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>The import stopped at {progress}%. {Math.round((IMPORT_COUNTS.ready * progress) / 100)} records were imported; nothing else changed. Try again to finish.</p>
            <button type="button" onClick={onRetry} className={BUTTON.onDark}>
              Try again
            </button>
          </div>
        </CriticalAlert>
      </div>
    ) : (
      <>
        <p className="text-[14px] leading-[20px] font-medium text-[#121722]">
          Importing {IMPORT_COUNTS.ready} records… <span className="tabular-nums">{progress}%</span>
        </p>
        <div className="h-2 rounded-full bg-[#DDE2EA] overflow-hidden" role="progressbar" aria-label="Import progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full bg-[#1E63FF] transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="sr-only" aria-live="polite">
          {announced}
        </div>
        <button type="button" onClick={onCancel} className={BUTTON.ghost}>
          Cancel import
        </button>
      </>
    )}
  </FormSection>
);
