/** Copyable React + Tailwind snippets for each tab type (palette colours only). */

export const LINE_CODE = `// Line tabs: 14px Medium, Gray 600 → Gray 900 on hover, active Royal Blue + 2px indicator
const tabs = ['Overview', 'Activity', 'Settings'];
const [active, setActive] = useState('Overview');

<div role="tablist" aria-label="Gate sections" className="flex gap-8 border-b border-[#DDE2EA]">
  {tabs.map((t) => (
    <button
      key={t}
      role="tab"
      id={'tab-' + t}
      aria-selected={active === t}
      aria-controls={'panel-' + t}
      tabIndex={active === t ? 0 : -1}
      onClick={() => setActive(t)}
      className={
        'relative -mb-px h-10 text-[14px] font-medium outline-none ' +
        'focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2 ' +
        (active === t
          ? 'text-[#1E63FF] after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-[#1E63FF]'
          : 'text-[#4B5465] hover:text-[#121722] hover:after:absolute hover:after:inset-x-0 hover:after:bottom-0 hover:after:h-[2px] hover:after:bg-[#C3CAD5]')
      }
    >
      {t}
    </button>
  ))}
</div>
<div role="tabpanel" id={'panel-' + active} aria-labelledby={'tab-' + active} tabIndex={0} className="pt-5">…</div>`;

export const ICONS_CODE = `// Line tabs with icons: 16px icon, 8px gap
<button role="tab" aria-selected className="relative -mb-px h-10 inline-flex items-center gap-2 text-[14px] font-medium text-[#1E63FF]">
  <LayoutGrid className="w-4 h-4" aria-hidden="true" />
  Overview
</button>`;

export const COUNTS_CODE = `// Count pill: 20px high, 6px padding, 12px Medium mono digits, en-IN grouping
<button role="tab" aria-selected className="relative -mb-px h-10 inline-flex items-center gap-2 text-[14px] font-medium text-[#1E63FF]">
  Open
  <span aria-hidden="true" className="h-5 px-1.5 inline-flex items-center rounded-full bg-[#1E63FF]/[0.08] text-[#1E63FF] font-mono text-[12px] font-medium">
    {(1248).toLocaleString('en-IN')}
  </span>
  <span className="sr-only">, 1,248 items</span>
</button>
{/* Inactive pill: bg-[#EEF1F6] text-[#353D4C] */}`;

export const STATUS_CODE = `// Status dot: 8px, Cyan = live, Deep Navy = needs attention. Never colour alone: add sr-only text.
<button role="tab" aria-selected={false} className="relative -mb-px h-10 inline-flex items-center gap-2 text-[14px] font-medium text-[#4B5465]">
  <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[#0B2D6B]" />
  Alerts
  <span className="sr-only">, 3 new</span>
</button>`;

export const CONTAINED_CODE = `// Contained tabs: Gray 50 bar, active tab white with a top/left/right border and 8px top radius
<div className="rounded-[8px] border border-[#DDE2EA] bg-white overflow-hidden">
  <div role="tablist" aria-label="Camera details" className="flex items-end gap-1 px-2 pt-2 bg-[#F7F9FC] border-b border-[#DDE2EA]">
    <button role="tab" aria-selected className="-mb-px h-10 px-3 rounded-t-[8px] bg-white border border-[#DDE2EA] border-b-white text-[14px] font-medium text-[#121722]">
      Overview
    </button>
    <button role="tab" aria-selected={false} tabIndex={-1} className="-mb-px h-10 px-3 rounded-t-[8px] border border-transparent text-[14px] font-medium text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#121722]">
      Activity
    </button>
  </div>
  <div role="tabpanel" tabIndex={0} className="p-5">…</div>
</div>`;

export const SEGMENTED_CODE = `// Segmented control: Gray 100 track, 4px padding, 8px radius; active white, elevation-1, 6px radius. Max 4.
<div role="tablist" aria-label="Period" className="inline-flex p-1 rounded-[8px] bg-[#EEF1F6]">
  {['Day', 'Week', 'Month'].map((p) => (
    <button
      key={p}
      role="tab"
      aria-selected={period === p}
      tabIndex={period === p ? 0 : -1}
      onClick={() => setPeriod(p)}
      className={
        'h-8 px-3 rounded-[6px] text-[14px] font-medium ' +
        (period === p ? 'bg-white text-[#121722] shadow-[0_1px_3px_rgba(11,45,107,0.08)]' : 'text-[#4B5465] hover:text-[#121722]')
      }
    >
      {p}
    </button>
  ))}
</div>
{/* Equal width: flex w-full on the track, w-full on each segment */}`;

export const VERTICAL_CODE = `// Vertical tabs: 240px list, 40px items, 18px icons, active Royal Blue 8% + 3px left bar
<div className="flex gap-6">
  <div role="tablist" aria-orientation="vertical" aria-label="Settings sections" className="w-[240px] p-2 flex flex-col gap-0.5 rounded-[12px] border border-[#DDE2EA]">
    <button role="tab" aria-selected className="relative h-10 px-3 flex items-center gap-3 rounded-[8px] bg-[#1E63FF]/[0.08] text-[14px] font-medium text-[#1E63FF]">
      <span aria-hidden="true" className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-[#1E63FF]" />
      <ShieldCheck className="w-[18px] h-[18px]" aria-hidden="true" />
      Security
    </button>
    {/* inactive: text-[#353D4C] hover:bg-[#F7F9FC] */}
  </div>
  <div role="tabpanel" tabIndex={0} className="flex-1 rounded-[12px] border border-[#DDE2EA] p-5">…</div>
</div>
{/* Below 640px: render a <select> instead of the list */}`;

export const SCROLL_CODE = `// Scrollable tabs: one line, Ghost chevrons, fade edges, active tab scrolled into view
<div className="relative flex items-end gap-2">
  <button aria-label="Scroll tabs left" tabIndex={-1} className="w-8 h-8 rounded-[8px] text-[#4B5465] hover:bg-[#EEF1F6]">
    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
  </button>
  <div role="tablist" aria-label="Modules" className="flex-1 min-w-0 flex gap-8 overflow-x-auto [scrollbar-width:none] border-b border-[#DDE2EA]">
    {/* tabs… on activate: tab.scrollIntoView({ inline: 'nearest', block: 'nearest' }) */}
  </div>
  <button aria-label="Scroll tabs right" tabIndex={-1} className="w-8 h-8 rounded-[8px] text-[#4B5465] hover:bg-[#EEF1F6]">
    <ChevronRight className="w-4 h-4" aria-hidden="true" />
  </button>
</div>
{/* Alternative: show what fits and put the rest in a "More (3)" menu button (aria-haspopup="menu") */}`;

export const CLOSABLE_CODE = `// Closable tabs: X is a sibling of the tab (never nested), labelled, out of the Tab order
<div role="tablist" aria-label="Open cameras" className="flex gap-8 border-b border-[#DDE2EA]">
  {open.map((cam) => (
    <span key={cam} role="presentation" className="inline-flex items-center gap-1">
      <button
        role="tab"
        aria-selected={active === cam}
        onAuxClick={(e) => e.button === 1 && close(cam)}
        onKeyDown={(e) => e.key === 'Delete' && close(cam)}
        className="relative -mb-px h-10 inline-flex items-center gap-2 text-[14px] font-medium"
      >
        <Video className="w-4 h-4" aria-hidden="true" /> {cam}
      </button>
      <button tabIndex={-1} aria-label={'Close ' + cam} onClick={() => close(cam)} className="w-5 h-5 rounded-[4px] text-[#4B5465] hover:bg-[#EEF1F6]">
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </span>
  ))}
</div>
{/* close(): if it was active, activate the neighbour. Max 8, then "+" shows "Close a tab to open another". */}`;

export const FULL_CODE = `// Full-width tabs (2–4): equal widths across the container
<div role="tablist" aria-label="Visitor views" className="flex border-b border-[#DDE2EA]">
  {['Today', 'Upcoming', 'Past'].map((t) => (
    <button key={t} role="tab" aria-selected={view === t} className="flex-1 -mb-px h-10 justify-center text-[14px] font-medium …">
      {t}
    </button>
  ))}
</div>`;

export const DARK_CODE = `// Tabs on dark: inactive White 70%, hover White, active White + 2px Cyan; Cyan focus ring
<div className="bg-[#0B2D6B] p-5 rounded-[8px]">
  <div role="tablist" aria-label="Camera views" className="flex gap-8 border-b border-white/15">
    <button role="tab" aria-selected className="relative -mb-px h-10 text-[14px] font-medium text-white after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-[#00C6FF] outline-none focus-visible:ring-2 focus-visible:ring-[#00C6FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2D6B]">
      Live
    </button>
    <button role="tab" aria-selected={false} tabIndex={-1} className="relative -mb-px h-10 text-[14px] font-medium text-white/70 hover:text-white">
      Playback
    </button>
  </div>
</div>
{/* Segmented on dark: track bg-white/10, active segment bg-white/15 text-white */}`;
