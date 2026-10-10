import React, { useState } from 'react';
import { ExampleFrame } from '../ExampleFrame';
import { LineTabs } from '../components/LineTabs';
import { TabPanels } from '../components/TabPanel';
import type { TabItem } from '../components/tabStyles';
import { samplePanel } from './panels';

type State = 'default' | 'hover' | 'focus' | 'active' | 'disabled';
const STATES: { id: State; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'hover', label: 'Hover' },
  { id: 'focus', label: 'Focus' },
  { id: 'active', label: 'Active' },
  { id: 'disabled', label: 'Disabled' },
];

const RING = 'ring-2 ring-[#1E63FF] ring-offset-2';
const UNDER = "after:absolute after:content-[''] after:inset-x-0 after:-bottom-px after:h-[2px] after:rounded-full";

/** Static, forced-state samples (decorative; the caption under each one carries the meaning). */
const SAMPLES: { type: string; render: (s: State) => React.ReactNode; notes: Record<State, string> }[] = [
  {
    type: 'Line',
    render: (s) => (
      <span className="inline-flex border-b border-[#DDE2EA] px-2 bg-white">
        <span
          className={`relative h-10 inline-flex items-center rounded-t-[4px] text-[14px] font-medium ${UNDER} ${
            { default: 'text-[#4B5465]', hover: 'text-[#121722] after:bg-[#C3CAD5]', focus: `text-[#4B5465] ${RING}`, active: 'text-[#1E63FF] after:bg-[#1E63FF]', disabled: 'text-[#8C95A6]' }[s]
          }`}
        >
          Activity
        </span>
      </span>
    ),
    notes: { default: 'Gray 600', hover: 'Gray 900 + Gray 300 line', focus: '2px ring, 2px offset', active: 'Royal Blue + 2px line', disabled: 'Gray 400, tooltip' },
  },
  {
    type: 'Contained',
    render: (s) => (
      <span className="inline-flex items-end px-2 pt-2 bg-[#F7F9FC] border-b border-[#DDE2EA]">
        <span
          className={`-mb-px h-10 px-3 inline-flex items-center rounded-t-[8px] text-[14px] font-medium border ${
            {
              default: 'border-transparent text-[#4B5465]',
              hover: 'border-transparent bg-[#EEF1F6] text-[#121722]',
              focus: `border-transparent text-[#4B5465] ${RING}`,
              active: 'bg-white border-[#DDE2EA] border-b-white text-[#121722]',
              disabled: 'border-transparent text-[#8C95A6]',
            }[s]
          }`}
        >
          Activity
        </span>
      </span>
    ),
    notes: { default: 'Gray 600 on Gray 50', hover: 'Gray 100 fill', focus: '2px ring, 2px offset', active: 'White, joins panel', disabled: 'Gray 400, tooltip' },
  },
  {
    type: 'Segmented',
    render: (s) => (
      <span className="inline-flex p-1 rounded-[8px] bg-[#EEF1F6]">
        <span
          className={`h-8 px-3 inline-flex items-center rounded-[6px] text-[14px] font-medium ${
            {
              default: 'text-[#4B5465]',
              hover: 'text-[#121722]',
              focus: `text-[#4B5465] ${RING}`,
              active: 'bg-white text-[#121722] shadow-[0_1px_3px_rgba(11,45,107,0.08)]',
              disabled: 'text-[#8C95A6]',
            }[s]
          }`}
        >
          Week
        </span>
      </span>
    ),
    notes: { default: 'Gray 600 on Gray 100', hover: 'Gray 900', focus: '2px ring, 2px offset', active: 'White, elevation-1', disabled: 'Gray 400, tooltip' },
  },
  {
    type: 'Vertical',
    render: (s) => (
      <span
        className={`relative w-[140px] h-10 px-3 inline-flex items-center rounded-[8px] text-[14px] font-medium ${
          {
            default: 'text-[#353D4C]',
            hover: 'bg-[#F7F9FC] text-[#121722]',
            focus: `text-[#353D4C] ${RING}`,
            active: 'bg-[#1E63FF]/[0.08] text-[#1E63FF]',
            disabled: 'text-[#8C95A6]',
          }[s]
        }`}
      >
        {s === 'active' && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-[#1E63FF]" />}
        Security
      </span>
    ),
    notes: { default: 'Gray 700', hover: 'Gray 50 fill', focus: '2px ring, 2px offset', active: 'Blue 8% + 3px bar', disabled: 'Gray 400, tooltip' },
  },
  {
    type: 'On dark',
    render: (s) => (
      <span className="inline-flex px-3 pt-1 rounded-[8px] bg-[#0B2D6B]">
        <span className="inline-flex border-b border-white/15">
          <span
            className={`relative h-10 inline-flex items-center rounded-t-[4px] text-[14px] font-medium ${UNDER} ${
              {
                default: 'text-white/70',
                hover: 'text-white after:bg-white/40',
                focus: 'text-white/70 ring-2 ring-[#00C6FF] ring-offset-2 ring-offset-[#0B2D6B]',
                active: 'text-white after:bg-[#00C6FF]',
                disabled: 'text-white/40',
              }[s]
            }`}
          >
            Playback
          </span>
        </span>
      </span>
    ),
    notes: { default: 'White 70%', hover: 'White', focus: 'Cyan ring', active: 'White + 2px Cyan', disabled: 'White 40%' },
  },
];

const MATRIX_CODE = `// States (light): focus ring on keyboard focus only
default  text-[#4B5465]
hover    hover:text-[#121722] + 2px Gray 300 underline (line)
focus    outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2
active   aria-selected="true" text-[#1E63FF] + 2px Royal Blue indicator
disabled aria-disabled="true" text-[#8C95A6] cursor-not-allowed  // still focusable, never activates

// On dark: focus-visible:ring-[#00C6FF] focus-visible:ring-offset-[#0B2D6B]`;

const DISABLED_ITEMS: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'activity', label: 'Activity' },
  { id: 'analytics', label: 'Analytics', disabled: 'Available after setup is complete' },
  { id: 'settings', label: 'Settings' },
];

const DISABLED_CODE = `// Disabled: aria-disabled (not disabled) so keyboard users can reach it and hear why
<button
  role="tab"
  aria-selected={false}
  aria-disabled="true"
  aria-describedby="analytics-tip"
  tabIndex={-1}
  className="relative -mb-px h-10 text-[14px] font-medium text-[#8C95A6] cursor-not-allowed"
>
  Analytics
</button>
<span role="tooltip" id="analytics-tip">Available after setup is complete</span>`;

const LOADING_CODE = `// Loading: skeletons in the panel only; the tab bar never moves or disables
<div role="tabpanel" aria-busy={loading} tabIndex={0}>
  {loading ? (
    <div className="space-y-3" aria-hidden="true">
      <span className="block h-4 w-2/5 rounded-[4px] bg-[#EEF1F6] motion-safe:animate-pulse" />
      <span className="block h-3 w-4/5 rounded-[4px] bg-[#EEF1F6] motion-safe:animate-pulse" />
    </div>
  ) : (
    content
  )}
</div>`;

const DisabledDemo: React.FC = () => {
  const [v, setV] = useState('overview');
  return (
    <LineTabs items={DISABLED_ITEMS} value={v} onChange={setV} label="Camera report">
      {(api) => (
        <div className="pt-5">
          <TabPanels api={api} value={v} render={samplePanel(DISABLED_ITEMS)} />
        </div>
      )}
    </LineTabs>
  );
};

const LoadingDemo: React.FC = () => {
  const [v, setV] = useState('overview');
  const [loading, setLoading] = useState(true);
  const items: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'settings', label: 'Settings' },
  ];
  return (
    <div>
      <label className="mb-4 inline-flex items-center gap-2 text-[14px] text-[#353D4C] cursor-pointer">
        <input type="checkbox" checked={loading} onChange={(e) => setLoading(e.target.checked)} className="w-4 h-4 accent-[#1E63FF]" />
        Panel is loading
      </label>
      <LineTabs items={items} value={v} onChange={setV} label="Loading example">
        {(api) => (
          <div className="pt-5 min-h-[80px]">
            <TabPanels api={api} value={v} loading={loading} render={samplePanel(items)} />
          </div>
        )}
      </LineTabs>
    </div>
  );
};

/** Default · Hover · Focus · Active · Disabled for each tab type, plus live disabled and loading demos. */
export const StateMatrix: React.FC = () => (
  <div className="space-y-8">
    <ExampleFrame title="State matrix" useWhen="checking a custom tab against the system. Every type uses the same five states." code={MATRIX_CODE}>
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <caption className="sr-only">Tab states by type</caption>
          <thead>
            <tr>
              <th scope="col" className="pb-3 pr-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                Type
              </th>
              {STATES.map((s) => (
                <th key={s.id} scope="col" className="pb-3 px-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE2EA]">
            {SAMPLES.map((row) => (
              <tr key={row.type}>
                <th scope="row" className="py-4 pr-4 text-[14px] font-semibold text-[#121722] whitespace-nowrap align-top">
                  {row.type}
                </th>
                {STATES.map((s) => (
                  <td key={s.id} className="py-4 px-3 align-top">
                    <div aria-hidden="true" className="min-h-[52px] flex items-center">
                      {row.render(s.id)}
                    </div>
                    <p className="mt-2 text-[12px] text-[#6B7485]">{row.notes[s.id]}</p>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ExampleFrame>
    <ExampleFrame title="Disabled tab" useWhen="a view exists but isn't ready yet. Explain why in a tooltip; don't hide the tab." code={DISABLED_CODE}>
      <DisabledDemo />
    </ExampleFrame>
    <ExampleFrame title="Loading panel" useWhen="panel content is still loading. Show skeletons in the panel only, never in the tab bar." code={LOADING_CODE}>
      <LoadingDemo />
    </ExampleFrame>
  </div>
);
