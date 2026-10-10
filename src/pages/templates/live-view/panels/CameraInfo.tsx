import React from 'react';
import { Settings } from 'lucide-react';
import type { LiveCamera } from '../data/cameras';
import { useSurface } from '../surface/ControlRoomSurface';
import { OVERLINE } from '../ui';

/** Facts for the focused camera, uptime as a bullet bar, AI modules as chips, "Camera settings". */
export const CameraInfo: React.FC<{ camera: LiveCamera | null; statusText: string; onSettings: () => void }> = ({ camera, statusText, onSettings }) => {
  const t = useSurface();
  if (!camera) return <p className={`p-4 text-[13px] ${t.muted}`}>Select a camera on the wall to see its details.</p>;
  const facts: [string, string, boolean?][] = [
    ['Camera ID', camera.id, true],
    ['Name', camera.name],
    ['Site / zone', `${camera.site} · ${camera.zone}`],
    ['Type', camera.type],
    ['Status', statusText],
    ['Resolution', camera.resolution, true],
    ['Frame rate', `${camera.fps} fps`, true],
    ['Bitrate', camera.bitrate, true],
    ['Latency', `${camera.latency} ms`, true],
    ['Last maintenance', camera.lastMaintenance],
  ];
  const dark = t.surface === 'control';
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        {facts.map(([k, v, mono]) => (
          <div key={k} className="min-w-0">
            <dt className={`${OVERLINE} ${t.subtle}`}>{k}</dt>
            <dd className={`mt-0.5 text-[14px] ${t.text} ${mono ? 'font-mono text-[13px]' : ''} break-words`}>{v}</dd>
          </div>
        ))}
      </dl>
      <div>
        <p className={`${OVERLINE} ${t.subtle}`}>Uptime (30 days)</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className={`relative flex-1 h-2 rounded-full ${dark ? 'bg-white/10' : 'bg-[#EEF1F6]'}`} aria-hidden="true">
            <span className="absolute inset-y-0 left-0 rounded-full bg-[#1E63FF]" style={{ width: `${camera.uptime}%` }} />
            <span className={`absolute -top-1 -bottom-1 w-0.5 ${dark ? 'bg-white' : 'bg-[#121722]'}`} style={{ left: '99%' }} title="Target 99%" />
          </span>
          <span className={`font-mono text-[13px] ${t.text}`}>{camera.uptime}%</span>
        </div>
        <p className={`mt-1 text-[12px] ${t.muted}`}>Target 99%</p>
      </div>
      <div>
        <p className={`${OVERLINE} ${t.subtle}`}>AI modules</p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {camera.modules.map((m) => (
            <li key={m} className={`h-6 px-2 inline-flex items-center rounded-full text-[12px] font-medium ${dark ? 'bg-white/10 text-white' : 'bg-[#EEF1F6] text-[#353D4C]'}`}>
              {m}
            </li>
          ))}
        </ul>
      </div>
      <button type="button" onClick={onSettings} className={t.btn.secondary}>
        <Settings className="w-4 h-4" aria-hidden="true" />
        Camera settings
      </button>
    </div>
  );
};
