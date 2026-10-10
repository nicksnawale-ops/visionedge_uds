import React from 'react';
import { CameraOff, ShieldAlert } from 'lucide-react';
import { DoDontPair } from '../../../../components/common/DoDont';
import type { SpecRow } from '../../../../components/common/SpecTable';

export const SPEC_ROWS: SpecRow[] = [
  { property: 'Camera tile', value: '16:9, Black, 12px radius', token: 'aspect-video bg-black rounded-[12px]' },
  { property: 'Wall gaps', value: '8px between tiles', token: 'gap-2' },
  { property: 'Overlay strips', value: 'Black 60%, 12px text', token: 'bg-black/60 text-[12px]' },
  { property: 'Detection box', value: '2px Cyan, 4px radius; label chip Cyan fill, Deep Navy 11px JetBrains Mono', token: 'border-2 border-[#00C6FF] rounded-[4px]' },
  { property: 'Focused tile', value: '2px Royal Blue outline, 2px offset', token: 'ring-2 ring-[#1E63FF] ring-offset-2' },
  { property: 'Alert tile', value: '2px Cyan border, pulses 3× then steady; ALERT chip', token: 'iterations: 3' },
  { property: 'Camera list', value: '280px, camera rows 36px', token: 'w-[280px] h-9' },
  { property: 'Activity panel', value: '360px, Line tabs', token: 'w-[360px]' },
  { property: 'Detection drawer', value: '480px, right, elevation-3', token: 'max-w-[480px] shadow-[0_12px_32px_…]' },
  { property: 'Timeline', value: '96px, collapsible; zoom 1h / 6h / 24h', token: 'h-[96px]' },
  { property: 'Detection item', value: '72px; 64×40 thumbnail', token: 'h-[72px] w-16 h-10' },
  { property: 'Feed', value: 'Max 200 items; new items slide in over 200ms', token: 'FEED_MAX = 200 · duration: 200' },
  { property: 'Animated tiles', value: 'At most 9; larger grids use SD sub-streams and static frames', token: 'slot < 9' },
  { property: 'Control room surface', value: 'Root Gray 900, panels Gray 800 with White 8% borders, Cyan focus', token: 'bg-[#121722] · bg-[#1F2633] border-white/[0.08]' },
];

/* Mini visuals (decorative). */
const Tile: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div aria-hidden="true" className="relative w-52 aspect-video rounded-[8px] bg-[#121722] overflow-hidden">
    <span className="absolute inset-x-0 bottom-0 h-1/2 bg-white/[0.06]" />
    {children}
  </div>
);
const Strip: React.FC<{ top?: boolean }> = ({ top }) => (
  <span className={`absolute inset-x-0 ${top ? 'top-0' : 'bottom-0'} h-4 px-1.5 flex items-center bg-black/60 text-[8px] text-white font-mono`}>{top ? '● LIVE · 14:05:32' : 'CAM-03 · Gate 3 entry'}</span>
);

export const DoDontList: React.FC = () => (
  <>
    <DoDontPair
      doTitle="Do keep tile overlays small and at the edges"
      doDescription="Strips at the top and bottom; controls appear on hover or focus."
      doExample={
        <Tile>
          <Strip top />
          <Strip />
        </Tile>
      }
      dontTitle="Don't cover the video center with text or controls"
      dontDescription="Operators need the middle of the frame to see what is happening."
      dontExample={
        <Tile>
          <span className="absolute inset-x-4 top-1/3 h-8 rounded-[4px] bg-white/80 text-[9px] text-[#121722] flex items-center justify-center">Camera details and controls</span>
        </Tile>
      }
    />
    <DoDontPair
      doTitle="Do use Cyan boxes and a pulsing border for alerts"
      doDescription="Pulse 3 times, then stay steady."
      doExample={
        <Tile>
          <span className="absolute inset-0 rounded-[8px] border-2 border-[#00C6FF]" />
          <span className="absolute left-1.5 top-1.5 h-4 px-1 inline-flex items-center gap-0.5 rounded-[3px] bg-white text-[#0B2D6B] text-[8px] font-bold">
            <ShieldAlert className="w-2.5 h-2.5" /> ALERT
          </span>
        </Tile>
      }
      dontTitle="Don't use red or flashing colors"
      dontDescription="They cause alarm fatigue; never flash more than 3 times per second."
      dontExample={
        <Tile>
          <span className="absolute inset-0 rounded-[8px] border-4 border-dashed border-white" />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">!!! ALERT !!!</span>
        </Tile>
      }
    />
    <DoDontPair
      doTitle="Do show a “new detections” pill when users have scrolled"
      doDescription="The list keeps its place; the pill jumps to the top on request."
      doExample={
        <div aria-hidden="true" className="w-52 rounded-[8px] border border-[#DDE2EA] bg-white p-2 space-y-1.5">
          <span className="mx-auto block w-max h-5 px-2 rounded-full bg-[#1E63FF] text-white text-[9px] font-medium leading-5">12 new detections ↑</span>
          <span className="block h-4 rounded bg-[#EEF1F6]" />
          <span className="block h-4 rounded bg-[#EEF1F6]" />
        </div>
      }
      dontTitle="Don't auto-jump the feed while someone is reading"
      dontDescription="Moving content under the cursor makes people lose their place."
      dontExample={
        <div aria-hidden="true" className="w-52 rounded-[8px] border border-[#DDE2EA] bg-white p-2 space-y-1.5">
          <span className="block h-4 rounded bg-[#1E63FF]/20" />
          <span className="block h-4 rounded bg-[#1E63FF]/20" />
          <span className="block text-[9px] text-[#4B5465] text-center">(scrolled back to top)</span>
        </div>
      }
    />
    <DoDontPair
      doTitle="Do show offline and reconnecting states clearly"
      doDescription="Say what happened, when, and offer Retry."
      doExample={
        <Tile>
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white text-[9px]">
            <CameraOff className="w-4 h-4 text-[#8C95A6]" />
            Camera offline · Last seen 14:02
          </span>
        </Tile>
      }
      dontTitle="Don't show a frozen last frame as if it were live"
      dontDescription="A stale image with a LIVE badge misleads operators."
      dontExample={
        <Tile>
          <Strip top />
        </Tile>
      }
    />
    <DoDontPair
      doTitle="Do confirm and audit physical actions"
      doDescription="Opening a barrier asks first and is recorded in the audit log."
      doExample={
        <div aria-hidden="true" className="w-52 rounded-[8px] border border-[#DDE2EA] bg-white p-2.5">
          <p className="text-[10px] font-semibold text-[#121722]">Open barrier at Gate 3 entry?</p>
          <div className="mt-2 flex justify-end gap-1">
            <span className="h-5 px-2 rounded-[4px] border border-[#1E63FF] text-[9px] text-[#1E63FF] leading-5">Cancel</span>
            <span className="h-5 px-2 rounded-[4px] bg-[#1E63FF] text-[9px] text-white leading-5">Open barrier</span>
          </div>
        </div>
      }
      dontTitle="Don't trigger them with a single click"
      dontDescription="A stray click on the wall must never move a barrier."
      dontExample={<Tile><span className="absolute right-1.5 bottom-5 h-4 px-1 rounded-[3px] bg-[#00C6FF] text-[8px] font-semibold text-[#0B2D6B] leading-4">Open (1 click)</span></Tile>}
    />
    <DoDontPair
      doTitle="Do mask privacy zones and limit personal data"
      doDescription="Hatch private areas; show IDs, not full personal details, on the wall."
      doExample={
        <Tile>
          <span className="absolute right-3 top-3 w-1/3 h-1/2 bg-[#353D4C] bg-[repeating-linear-gradient(135deg,transparent_0,transparent_4px,rgba(255,255,255,0.12)_4px,rgba(255,255,255,0.12)_6px)]" />
          <span className="absolute left-2 top-6 px-1 rounded-[2px] bg-[#00C6FF] text-[8px] font-mono font-semibold text-[#0B2D6B]">STU-1042 · 97%</span>
        </Tile>
      }
      dontTitle="Don't display full personal details on the wall"
      dontDescription="Names, phone numbers and addresses belong in the drawer, for authorized roles."
      dontExample={
        <Tile>
          <span className="absolute left-2 top-4 right-2 px-1 rounded-[2px] bg-white text-[8px] text-[#121722]">Isha Kulkarni · +91 98xxx · Room 214 · Pune</span>
        </Tile>
      }
    />
  </>
);

export const ACCESSIBILITY: string[] = [
  'The wall is an ARIA grid: arrow keys move between tiles, Home/End jump; each tile is labelled (“CAM-03, Gate 3 entry, online, 2 detections”).',
  'Tile controls are buttons with labels and tooltips; they join the Tab order on the selected tile. Enter toggles focus mode; Esc returns to the grid.',
  'The detection list is announced politely and at most once every 10 seconds; critical alerts are announced assertively.',
  'Motion respects prefers-reduced-motion: tiles show a still frame, the alert border doesn’t pulse and nothing slides.',
  'The detection drawer and confirmation dialogs trap focus and return it on close.',
  'Contrast is AA on both surfaces; focus rings are Royal Blue in Light and Cyan in the Control room. Touch targets are 44px on phones.',
  'Dragging a camera onto a tile has a keyboard alternative: the camera row’s menu → “Add to wall”.',
];

export const PERFORMANCE: string[] = [
  'At most 9 tiles animate; larger grids show static frames.',
  'Animations pause while the tab is hidden (visibilitychange) and never run with reduced motion.',
  'Grids larger than 3×3 use SD sub-streams.',
  'One shared 1-second ticker drives the clock, feed, relative times and playback.',
  'The feed keeps at most 200 items; lists are memoized.',
  'Every timer, interval, animation and listener is cleaned up on unmount.',
];

export const LAYOUT_SNIPPET = `// LiveViewScreen layout (inside the product AppShell, "Live view" active)
<div className="@container h-full flex flex-col bg-[#F7F9FC]">            {/* Control room: bg-[#121722] on this root only */}
  <div className="flex-1 min-h-0 flex flex-col gap-3 p-6">
    <LiveToolbar />                                                       {/* 56px: title · site · zone | layout | Live · clock · actions */}
    <StatsStrip stats={useCase.stats} />                                  {/* 4 cells */}
    {banner}                                                              {/* Critical / Info */}
    <div className="flex-1 min-h-0 flex gap-3">
      <aside className="w-[280px] shrink-0"><CameraList /></aside>        {/* collapsible */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <VideoWall layout="3x3" renderSlot={(slot) => <LiveTile … />} /> {/* role="grid", 8px gaps */}
        </div>
        <TimelineStrip />                                                 {/* 96px, collapsible */}
      </div>
      <aside className="w-[360px] shrink-0"><ActivityPanel /></aside>     {/* Detections · Alerts · Camera info */}
    </div>
  </div>
</div>`;
