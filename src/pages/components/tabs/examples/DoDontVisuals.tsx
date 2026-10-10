import React from 'react';
import { Check, Info } from 'lucide-react';
import { DoDontPair } from '../../../../components/common/DoDont';

/* Decorative mini visuals: static markup, hidden from assistive tech (the pair's text carries the meaning). */

const Line: React.FC<{ tabs: string[]; active?: number; activeClass?: string; className?: string; wrap?: boolean }> = ({ tabs, active = 0, activeClass = 'text-[#1E63FF] after:bg-[#1E63FF]', className = '', wrap }) => (
  <span aria-hidden="true" className={`flex ${wrap ? 'flex-wrap' : ''} gap-x-5 border-b border-[#DDE2EA] ${className}`}>
    {tabs.map((t, i) => (
      <span
        key={t + i}
        className={`relative h-8 inline-flex items-center text-[13px] font-medium whitespace-nowrap after:absolute after:content-[''] after:inset-x-0 after:-bottom-px after:h-[2px] ${i === active ? activeClass : 'text-[#4B5465]'}`}
      >
        {t}
      </span>
    ))}
  </span>
);

const Seg: React.FC<{ tabs: string[] }> = ({ tabs }) => (
  <span aria-hidden="true" className="inline-flex p-1 rounded-[8px] bg-[#EEF1F6]">
    {tabs.map((t, i) => (
      <span key={t} className={`h-7 px-3 inline-flex items-center rounded-[6px] text-[13px] font-medium ${i === 0 ? 'bg-white text-[#121722] shadow-[0_1px_3px_rgba(11,45,107,0.08)]' : 'text-[#4B5465]'}`}>
        {t}
      </span>
    ))}
  </span>
);

const Box: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div aria-hidden="true" className={`w-full max-w-[280px] rounded-[8px] bg-white border border-[#DDE2EA] p-3 ${className}`}>
    {children}
  </div>
);

const Bars: React.FC = () => (
  <span className="mt-3 flex items-end gap-1 h-10">
    {[40, 70, 55, 90, 65, 80].map((h, i) => (
      <span key={i} className="flex-1 rounded-t-[2px] bg-[#1E63FF]/30" style={{ height: `${h}%` }} />
    ))}
  </span>
);

/** The seven Do & Don't pairs for tabs. */
export const DoDontVisuals: React.FC = () => (
  <div>
    <DoDontPair
      className="mt-0"
      doTitle="Do use short, sentence-case nouns"
      doDescription="1–2 words that name the view: Overview, Activity, Settings."
      doExample={
        <Box>
          <Line tabs={['Overview', 'Activity', 'Settings']} />
        </Box>
      }
      dontTitle="Don't use verbs, all caps or long labels"
      dontDescription="'View activity', 'ALERTS' and 'Camera configuration settings' are slower to scan."
      dontExample={
        <Box>
          <Line tabs={['View activity', 'ALERTS', 'Camera config…']} />
        </Box>
      }
    />
    <DoDontPair
      doTitle="Do use a segmented control to switch a display"
      doDescription="Chart or table, day or week: the same data shown a different way."
      doExample={
        <Box>
          <Seg tabs={['Chart', 'Table']} />
          <Bars />
        </Box>
      }
      dontTitle="Don't use a segmented control for page sections"
      dontDescription="Different content (Overview, Activity, Settings) belongs in line tabs."
      dontExample={
        <Box>
          <Seg tabs={['Overview', 'Activity', 'Settings']} />
        </Box>
      }
    />
    <DoDontPair
      doTitle="Do keep tabs on one line"
      doDescription="When tabs don't fit, scroll them or move the rest into a More menu."
      doExample={
        <Box>
          <span className="flex items-end gap-2">
            <Line tabs={['Overview', 'Gates', 'Vehicles']} className="flex-1 min-w-0 overflow-hidden" />
            <span className="h-7 mb-0.5 px-2 inline-flex items-center rounded-[6px] text-[12px] font-medium text-[#4B5465] bg-[#F7F9FC] whitespace-nowrap">More (5)</span>
          </span>
        </Box>
      }
      dontTitle="Don't wrap tabs onto a second row"
      dontDescription="Two rows make it unclear which row the panel belongs to, and rows jump when selected."
      dontExample={
        <Box>
          <Line wrap tabs={['Overview', 'Gates', 'Vehicles', 'Watchlist', 'Alerts', 'Reports', 'Audit']} />
        </Box>
      }
    />
    <DoDontPair
      doTitle="Do explain a disabled tab"
      doDescription="Keep it visible and focusable, with a tooltip that says when it becomes available."
      doExample={
        <Box>
          <span className="flex gap-5 border-b border-[#DDE2EA]">
            <span className="relative h-8 inline-flex items-center text-[13px] font-medium text-[#1E63FF] after:absolute after:content-[''] after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-[#1E63FF]">Overview</span>
            <span className="h-8 inline-flex items-center text-[13px] font-medium text-[#8C95A6]">Analytics</span>
          </span>
          <span className="mt-2 ml-10 inline-block px-2 py-1 rounded-[6px] bg-[#121722] text-white text-[11px] whitespace-nowrap">Available after setup is complete</span>
        </Box>
      }
      dontTitle="Don't hide tabs or disable them silently"
      dontDescription="Tabs that appear and disappear move the layout and leave people guessing."
      dontExample={
        <Box>
          <span className="flex gap-5 border-b border-[#DDE2EA]">
            <span className="relative h-8 inline-flex items-center text-[13px] font-medium text-[#1E63FF] after:absolute after:content-[''] after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-[#1E63FF]">Overview</span>
            <span className="h-8 inline-flex items-center text-[13px] font-medium text-[#C3CAD5]">Analytics</span>
          </span>
        </Box>
      }
    />
    <DoDontPair
      doTitle="Do use a stepper for sequential steps"
      doDescription="Steps that must happen in order (details, documents, review) need progress, not tabs."
      doExample={
        <Box>
          <span className="flex items-center gap-2 text-[12px] font-medium text-[#121722]">
            <span className="w-5 h-5 rounded-full bg-[#1E63FF] text-white inline-flex items-center justify-center">
              <Check className="w-3 h-3" />
            </span>
            Details
            <span className="flex-1 h-px bg-[#1E63FF]" />
            <span className="w-5 h-5 rounded-full border-2 border-[#1E63FF] text-[#1E63FF] inline-flex items-center justify-center text-[11px]">2</span>
            Review
          </span>
        </Box>
      }
      dontTitle="Don't use tabs as a wizard"
      dontDescription="'Step 1, Step 2, Step 3' tabs let people skip ahead and hide what's required."
      dontExample={
        <Box>
          <Line tabs={['Step 1', 'Step 2', 'Step 3']} />
        </Box>
      }
    />
    <DoDontPair
      doTitle="Do use one level of tabs"
      doDescription="If a panel needs its own sections, use headings, a segmented control or vertical tabs."
      doExample={
        <Box>
          <Line tabs={['Overview', 'Activity']} />
          <span className="mt-3 block text-[12px] font-semibold text-[#121722]">Today</span>
          <span className="mt-1 block h-2 w-3/4 rounded bg-[#EEF1F6]" />
          <span className="mt-2 block text-[12px] font-semibold text-[#121722]">This week</span>
          <span className="mt-1 block h-2 w-2/3 rounded bg-[#EEF1F6]" />
        </Box>
      }
      dontTitle="Don't nest tabs inside tabs"
      dontDescription="Two tab bars stacked compete for attention and break keyboard expectations."
      dontExample={
        <Box>
          <Line tabs={['Overview', 'Activity']} />
          <Line tabs={['Today', 'Week', 'Month']} className="mt-2" />
        </Box>
      }
    />
    <DoDontPair
      doTitle="Do use White and Cyan on dark surfaces"
      doDescription="Active White with a Cyan indicator; inactive White 70%."
      doExample={
        <div aria-hidden="true" className="w-full max-w-[280px] rounded-[8px] bg-[#0B2D6B] px-3 pt-2">
          <span className="flex gap-5 border-b border-white/15">
            <span className="relative h-8 inline-flex items-center text-[13px] font-medium text-white after:absolute after:content-[''] after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-[#00C6FF]">Live</span>
            <span className="h-8 inline-flex items-center text-[13px] font-medium text-white/70">Playback</span>
          </span>
        </div>
      }
      dontTitle="Don't put light-surface tabs on Deep Navy"
      dontDescription="Royal Blue and Gray 600 text fail contrast on dark backgrounds."
      dontExample={
        <div aria-hidden="true" className="w-full max-w-[280px] rounded-[8px] bg-[#0B2D6B] px-3 pt-2">
          <span className="flex gap-5 border-b border-[#4B5465]">
            <span className="relative h-8 inline-flex items-center text-[13px] font-medium text-[#1E63FF] after:absolute after:content-[''] after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-[#1E63FF]">Live</span>
            <span className="h-8 inline-flex items-center text-[13px] font-medium text-[#4B5465]">Playback</span>
          </span>
        </div>
      }
    />
    <p className="flex items-start gap-2 text-[13px] text-[#4B5465]">
      <Info className="w-4 h-4 mt-0.5 shrink-0 text-[#6B7485]" aria-hidden="true" />
      Not sure tabs are right? See the "Not tabs" table under Choosing the Right Tab.
    </p>
  </div>
);
