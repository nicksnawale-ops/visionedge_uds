import React, { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * Demo only, active only while the Offline error page is mounted: listens to the browser's
 * online/offline events and reports them. Listeners are removed on unmount.
 */
export function useConnectionEvents(onOnline: () => void, onOffline: () => void): void {
  const online = useRef(onOnline);
  const offline = useRef(onOffline);
  online.current = onOnline;
  offline.current = onOffline;

  useEffect(() => {
    const up = () => online.current();
    const down = () => offline.current();
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);
}

/** Status line: pulsing Gray 400 dot while waiting, a check once the connection is back. */
export const OfflineStatus: React.FC<{ back: boolean }> = ({ back }) =>
  back ? (
    <p className="inline-flex items-center gap-2 text-[14px] leading-[20px] font-medium text-[#121722]">
      <CheckCircle2 className="w-4 h-4 text-[#00C6FF]" aria-hidden="true" />
      Connected
    </p>
  ) : (
    <p className="inline-flex items-center gap-2 text-[14px] leading-[20px] text-[#4B5465]">
      <span className="relative flex w-2.5 h-2.5" aria-hidden="true">
        <span className="absolute inset-0 rounded-full bg-[#8C95A6] opacity-60 motion-safe:animate-ping" />
        <span className="relative w-2.5 h-2.5 rounded-full bg-[#8C95A6]" />
      </span>
      Waiting for connection…
    </p>
  );
