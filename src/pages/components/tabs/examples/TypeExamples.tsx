import React, { useState } from 'react';
import { ExampleFrame } from '../ExampleFrame';
import { LineTabs } from '../components/LineTabs';
import { ContainedTabs } from '../components/ContainedTabs';
import { SegmentedControl } from '../components/SegmentedControl';
import { VerticalTabs } from '../components/VerticalTabs';
import { ScrollableTabs } from '../components/ScrollableTabs';
import { ClosableTabs } from '../components/ClosableTabs';
import { TabsOnDark } from '../components/TabsOnDark';
import { TabPanels } from '../components/TabPanel';
import type { TabItem } from '../components/tabStyles';
import { ALL_CAMERAS, BASIC, CAMERAS, DARK, DISPLAY, MANY, PERIOD, VERTICAL, WITH_COUNTS, WITH_ICONS, WITH_STATUS } from '../tabsSpec';
import { DemoLabel, samplePanel } from './panels';
import * as S from './snippets';

/** Line tabs (plain, icons, counts or status) with their panels. */
const LineDemo: React.FC<{ items: TabItem[]; label: string; fitted?: boolean }> = ({ items, label, fitted }) => {
  const [v, setV] = useState(items[0].id);
  return (
    <LineTabs items={items} value={v} onChange={setV} label={label} fitted={fitted}>
      {(api) => (
        <div className="pt-5">
          <TabPanels api={api} value={v} render={samplePanel(items)} />
        </div>
      )}
    </LineTabs>
  );
};

const ContainedDemo: React.FC = () => {
  const [v, setV] = useState('overview');
  return <ContainedTabs items={WITH_ICONS} value={v} onChange={setV} label="Camera details" render={samplePanel(WITH_ICONS)} />;
};

const SegmentedDemo: React.FC = () => {
  const [period, setPeriod] = useState('week');
  const [display, setDisplay] = useState('chart');
  return (
    <div className="space-y-5">
      <div>
        <DemoLabel>Hug content</DemoLabel>
        <SegmentedControl items={PERIOD} value={period} onChange={setPeriod} label="Period">
          {(api) => (
            <div className="pt-4">
              <TabPanels api={api} value={period} render={(id) => <p className="text-[14px] text-[#4B5465]">Entries grouped by {id}.</p>} />
            </div>
          )}
        </SegmentedControl>
      </div>
      <div className="max-w-[320px]">
        <DemoLabel>Equal width</DemoLabel>
        <SegmentedControl items={DISPLAY} value={display} onChange={setDisplay} label="Display" equal>
          {(api) => (
            <div className="pt-4">
              <TabPanels api={api} value={display} render={(id) => <p className="text-[14px] text-[#4B5465]">Showing the same data as a {id}.</p>} />
            </div>
          )}
        </SegmentedControl>
      </div>
    </div>
  );
};

const VerticalDemo: React.FC = () => {
  const [v, setV] = useState('security');
  return <VerticalTabs items={VERTICAL} value={v} onChange={setV} label="Settings sections" render={samplePanel(VERTICAL)} />;
};

const ScrollDemo: React.FC = () => {
  const [a, setA] = useState('overview');
  const [b, setB] = useState('overview');
  return (
    <div className="space-y-6">
      <div>
        <DemoLabel>Scroll with chevrons</DemoLabel>
        <div className="max-w-[560px]">
          <ScrollableTabs items={MANY} value={a} onChange={setA} label="Modules">
            {(api) => (
              <div className="pt-4">
                <TabPanels api={api} value={a} render={samplePanel(MANY)} />
              </div>
            )}
          </ScrollableTabs>
        </div>
      </div>
      <div>
        <DemoLabel>More menu</DemoLabel>
        <div className="max-w-[560px]">
          <ScrollableTabs mode="more" items={MANY} value={b} onChange={setB} label="Modules, with more menu">
            {(api) => (
              <div className="pt-4">
                <TabPanels api={api} value={b} render={samplePanel(MANY)} />
              </div>
            )}
          </ScrollableTabs>
        </div>
      </div>
    </div>
  );
};

export const ClosableDemo: React.FC = () => {
  const [open, setOpen] = useState<TabItem[]>(CAMERAS);
  const [v, setV] = useState('CAM-03');
  const add = () => {
    const next = ALL_CAMERAS.find((c) => !open.some((o) => o.id === c));
    if (!next) return;
    setOpen((o) => [...o, { id: next, label: next }]);
    setV(next);
  };
  return (
    <ClosableTabs
      items={open}
      value={v}
      onChange={setV}
      onClose={(id) => setOpen((o) => o.filter((t) => t.id !== id))}
      onAdd={add}
      label="Open cameras"
      render={(id) => (
        <div className="flex items-center gap-3">
          <div className="w-28 h-16 rounded-[8px] bg-[#0B2D6B] flex items-center justify-center text-[12px] font-mono text-white/80" aria-hidden="true">
            {id}
          </div>
          <p className="text-[14px] text-[#4B5465]">Live feed from {id}. Close with the X, a middle-click, or Delete on the focused tab.</p>
        </div>
      )}
    />
  );
};

const FullWidthDemo: React.FC = () => (
  <div className="max-w-[390px] mx-auto">
    <LineDemo items={[{ id: 'today', label: 'Today' }, { id: 'upcoming', label: 'Upcoming' }, { id: 'past', label: 'Past' }]} label="Visitor views" fitted />
  </div>
);

const DarkDemo: React.FC = () => {
  const [a, setA] = useState('live');
  const [b, setB] = useState('day');
  return (
    <div className="space-y-4">
      <TabsOnDark items={DARK} value={a} onChange={setA} label="Camera views">
        Showing {DARK.find((d) => d.id === a)?.label.toLowerCase()} for CAM-07.
      </TabsOnDark>
      <TabsOnDark items={PERIOD} value={b} onChange={setB} label="Period on dark" variant="segmented" background="black" />
    </div>
  );
};

/** The 11 tab types, each with a live preview, code and a "Use when…" line. */
export const TypeExamples: React.FC = () => (
  <div className="space-y-8">
    <ExampleFrame title="Line tabs" useWhen="switching between views of the same page or record. The default choice." code={S.LINE_CODE}>
      <LineDemo items={BASIC} label="Gate sections" />
    </ExampleFrame>
    <ExampleFrame title="Line tabs with icons" useWhen="icons help people scan, and every tab has a clear one. Don't mix tabs with and without icons." code={S.ICONS_CODE}>
      <LineDemo items={WITH_ICONS} label="Gate sections with icons" />
    </ExampleFrame>
    <ExampleFrame title="Line tabs with counts" useWhen="each view has a number worth seeing before you open it, such as open incidents." code={S.COUNTS_CODE}>
      <LineDemo items={WITH_COUNTS} label="Incidents" />
    </ExampleFrame>
    <ExampleFrame title="Line tabs with a status dot" useWhen="a view is live or needs attention. The dot is always backed by screen-reader text." code={S.STATUS_CODE}>
      <LineDemo items={WITH_STATUS} label="Monitoring" />
    </ExampleFrame>
    <ExampleFrame title="Contained tabs" useWhen="tabs sit inside a card, drawer or settings block and should feel attached to their panel." code={S.CONTAINED_CODE}>
      <ContainedDemo />
    </ExampleFrame>
    <ExampleFrame title="Segmented control" useWhen="changing how the same data is shown (chart or table, day or week). 2–4 options." code={S.SEGMENTED_CODE}>
      <SegmentedDemo />
    </ExampleFrame>
    <ExampleFrame title="Vertical tabs" useWhen="there are 6 or more sections, such as settings or a profile. Becomes a select on mobile." code={S.VERTICAL_CODE}>
      <VerticalDemo />
    </ExampleFrame>
    <ExampleFrame title="Scrollable and overflow tabs" useWhen="there are more tabs than fit on one line. Never wrap tabs onto a second row." code={S.SCROLL_CODE}>
      <ScrollDemo />
    </ExampleFrame>
    <ExampleFrame title="Closable tabs" useWhen="people open several items side by side, such as camera feeds or records. Up to 8." code={S.CLOSABLE_CODE}>
      <ClosableDemo />
    </ExampleFrame>
    <ExampleFrame title="Full-width tabs" useWhen="2–4 tabs on mobile or in a narrow panel, where equal widths make bigger targets." code={S.FULL_CODE}>
      <FullWidthDemo />
    </ExampleFrame>
    <ExampleFrame title="Tabs on dark" useWhen="tabs sit on Deep Navy or Black, such as monitoring screens and camera overlays." code={S.DARK_CODE} bare>
      <DarkDemo />
    </ExampleFrame>
  </div>
);
