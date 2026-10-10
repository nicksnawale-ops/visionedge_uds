import React from 'react';
import { Camera, Cctv, MapPin, Maximize2, PanelLeft, PanelRight, Play } from 'lucide-react';
import type { LayoutId } from '../liveViewStates';
import { useSurface } from '../surface/ControlRoomSurface';
import { LiveSelect, type LiveSelectOption } from '../parts/LiveSelect';
import { LayoutSwitcher } from './LayoutSwitcher';
import { LiveClock } from './LiveClock';
import { MoreMenu } from './MoreMenu';

interface LiveToolbarProps {
  site: string;
  sites: LiveSelectOption<string>[];
  onSite: (s: string) => void;
  zone: string;
  zones: LiveSelectOption<string>[];
  onZone: (z: string) => void;
  layout: LayoutId;
  layouts: LayoutId[];
  onLayout: (l: LayoutId) => void;
  live: boolean;
  onToggleLive: () => void;
  now: number;
  listOpen: boolean;
  activityOpen: boolean;
  onToggleList: () => void;
  onToggleActivity: () => void;
  onSnapshotAll: () => void;
  onFullscreen: () => void;
  /** Paused state: show "Resume live". */
  paused: boolean;
  onResume: () => void;
  /** <768px: actions move into "More". */
  mobile: boolean;
  /** Hide panel toggles that don't apply (e.g. narrow screens). */
  showListToggle: boolean;
  showActivityToggle: boolean;
}

/**
 * Live toolbar (56px): title, site and zone selects · layout switcher · Live indicator, IST clock and
 * Ghost icon buttons (Snapshot all, Fullscreen wall, Camera list, Detail panel). On phones the actions
 * move into a "More" menu.
 */
export const LiveToolbar: React.FC<LiveToolbarProps> = (p) => {
  const t = useSurface();

  const icon = (label: string, Icon: React.FC<{ className?: string }>, onClick: () => void, pressed?: boolean) => (
    <span className="relative group/tb">
      <button type="button" aria-label={label} aria-pressed={pressed} onClick={onClick} className={t.btn.icon}>
        <Icon className="w-5 h-5" aria-hidden="true" />
      </button>
      <span role="tooltip" className="absolute top-full mt-1 right-0 z-30 px-2 py-1 rounded-[4px] bg-[#121722] text-white text-[11px] whitespace-nowrap opacity-0 pointer-events-none group-hover/tb:opacity-100 group-focus-within/tb:opacity-100">
        {label}
      </span>
    </span>
  );

  const liveBtn = (
    <button
      type="button"
      onClick={p.onToggleLive}
      aria-pressed={!p.live}
      aria-label={p.live ? 'Live. Pause the wall' : 'Paused. Resume live'}
      className={`h-9 @max-[639px]:h-11 px-2.5 inline-flex items-center gap-2 rounded-[8px] text-[12px] font-medium ${t.hover} ${t.focus} ${p.live ? t.text : t.muted}`}
    >
      <span className="relative flex w-2 h-2" aria-hidden="true">
        {p.live && <span className="absolute inset-0 rounded-full bg-[#00C6FF] opacity-60 motion-safe:animate-ping" />}
        <span className={`relative w-2 h-2 rounded-full ${p.live ? 'bg-[#00C6FF]' : 'bg-[#8C95A6]'}`} />
      </span>
      {p.live ? 'Live' : 'Paused'}
    </button>
  );

  return (
    <div className={`min-h-14 px-3 py-2 rounded-[12px] border ${t.panel} flex flex-wrap items-center gap-x-3 gap-y-2`}>
      <div className="flex items-center gap-2 min-w-0 flex-wrap">
        <h1 className={`text-[20px] leading-7 font-semibold whitespace-nowrap ${t.text}`}>Live view</h1>
        <LiveSelect label="Site" icon={MapPin} options={p.sites} value={p.site} onChange={p.onSite} className="min-w-[180px]" popoverMinWidth={240} />
        {!p.mobile && (
          <LiveSelect label="Camera group" icon={Cctv} options={p.zones} value={p.zone} onChange={p.onZone} className="min-w-[200px]" popoverMinWidth={240} />
        )}
      </div>

      {!p.mobile && (
        <div className="flex-1 flex justify-center min-w-0">
          <LayoutSwitcher value={p.layout} allowed={p.layouts} onChange={p.onLayout} />
        </div>
      )}

      <div className={`flex items-center gap-1 ${p.mobile ? 'ml-auto' : ''}`}>
        {p.paused && (
          <button type="button" onClick={p.onResume} className={t.btn.secondary}>
            <Play className="w-4 h-4" aria-hidden="true" />
            Resume live
          </button>
        )}
        {liveBtn}
        {!p.mobile && <LiveClock now={p.now} />}
        {p.mobile ? (
          <MoreMenu
            items={[
              { label: 'Snapshot all', onSelect: p.onSnapshotAll },
              { label: 'Fullscreen wall', onSelect: p.onFullscreen },
              { label: p.listOpen ? 'Hide camera list' : 'Show camera list', onSelect: p.onToggleList },
            ]}
          />
        ) : (
          <>
            {icon('Snapshot all', Camera, p.onSnapshotAll)}
            {icon('Fullscreen wall', Maximize2, p.onFullscreen)}
            {p.showListToggle && icon(p.listOpen ? 'Hide camera list' : 'Show camera list', PanelLeft, p.onToggleList, p.listOpen)}
            {p.showActivityToggle && icon(p.activityOpen ? 'Hide detail panel' : 'Show detail panel', PanelRight, p.onToggleActivity, p.activityOpen)}
          </>
        )}
      </div>
    </div>
  );
};
