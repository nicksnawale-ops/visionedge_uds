import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { CriticalAlert } from '../../shared/authUi';
import { BUTTON } from '../primitives';

interface CriticalBannerProps {
  message: string;
  time: string;
  onView: () => void;
  onAcknowledge: () => void;
  anatomy?: React.ReactNode;
}

/** Full-width Critical alert (Deep Navy, White text, ShieldAlert) with "View on camera" and "Acknowledge". */
export const CriticalBanner: React.FC<CriticalBannerProps> = ({ message, time, onView, onAcknowledge, anatomy }) => (
  <div role="alert" className="relative col-span-12">
    {anatomy}
    <CriticalAlert icon={ShieldAlert}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="min-w-0">
          <span className="font-semibold">{message}</span>
          <span className="text-white/80"> · {time}</span>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onView} className={BUTTON.onDark}>
            View on camera
          </button>
          <button type="button" onClick={onAcknowledge} className={BUTTON.ghostOnDark}>
            Acknowledge
          </button>
        </div>
      </div>
    </CriticalAlert>
  </div>
);
