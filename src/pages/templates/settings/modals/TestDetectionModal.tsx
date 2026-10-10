import React from 'react';
import { CameraScene } from '../../dashboard/scenes/CameraScenes';
import { BUTTON, MONO, Modal, OVERLINE } from '../../profile/ui';
import { SETTINGS_SHELL } from '../settingsShell';

interface TestDetectionModalProps {
  /** Threshold in % (motion sensitivity). */
  threshold: number;
  onClose: () => void;
}

const SAMPLE = { label: 'Person · Line crossed', confidence: 88, box: { left: '40%', top: '34%', width: '12%', height: '34%' } };

/** Runs the current (unsaved) settings on a sample frame: decorative scene + Cyan detection box + the result. */
export const TestDetectionModal: React.FC<TestDetectionModalProps> = ({ threshold, onClose }) => {
  const s = SAMPLE;
  const passes = s.confidence >= threshold;
  return (
    <Modal
      title="Test settings"
      description="A sample frame from your cameras, analysed with the settings on this page (saved or not)."
      size={640}
      onClose={onClose}
      footer={
        <button type="button" onClick={onClose} className={BUTTON.primary}>
          Done
        </button>
      }
    >
      <div className="space-y-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-[12px] bg-black" role="img" aria-label={`Sample frame with a detection: ${s.label}, ${s.confidence}% confidence`}>
          <CameraScene kind={SETTINGS_SHELL.scene} />
          <span className="absolute border-2 border-[#00C6FF] rounded-[2px]" style={s.box} aria-hidden="true">
            <span className="absolute -top-6 left-0 whitespace-nowrap px-1.5 py-0.5 rounded-[2px] bg-[#00C6FF] font-mono text-[11px] font-semibold text-[#0B2D6B]">
              {s.label} · {s.confidence}%
            </span>
          </span>
        </div>
        <dl className="grid grid-cols-1 @min-[480px]:grid-cols-3 gap-4">
          <div>
            <dt className={OVERLINE}>Detected</dt>
            <dd className={`mt-0.5 ${MONO}`}>{s.label}</dd>
          </div>
          <div>
            <dt className={OVERLINE}>Confidence</dt>
            <dd className="mt-0.5 text-[14px] text-[#121722] tabular-nums">
              {s.confidence}% (threshold {threshold}%)
            </dd>
          </div>
          <div>
            <dt className={OVERLINE}>Result</dt>
            <dd className="mt-0.5 text-[14px] font-medium text-[#121722]">{passes ? 'Matched automatically' : 'Sent for review'}</dd>
          </div>
        </dl>
      </div>
    </Modal>
  );
};
