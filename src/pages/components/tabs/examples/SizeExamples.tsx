import React, { useState } from 'react';
import { ExampleFrame } from '../ExampleFrame';
import { LineTabs } from '../components/LineTabs';
import { ContainedTabs } from '../components/ContainedTabs';
import { SegmentedControl } from '../components/SegmentedControl';
import type { TabSize } from '../components/tabStyles';
import { PERIOD, WITH_ICONS } from '../tabsSpec';
import { samplePanel } from './panels';

const SIZES: { size: TabSize; name: string; spec: string }[] = [
  { size: 'sm', name: 'Small', spec: '32px · 13px text · 16px icon' },
  { size: 'md', name: 'Medium', spec: '40px · 14px text · 16px icon' },
  { size: 'lg', name: 'Large', spec: '48px · 16px text · 20px icon' },
];

const Row: React.FC<{ name: string; spec: string; children: React.ReactNode }> = ({ name, spec, children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-2 sm:gap-6 items-start">
    <div>
      <p className="text-[14px] font-semibold text-[#121722]">{name}</p>
      <p className="text-[12px] text-[#6B7485]">{spec}</p>
    </div>
    <div className="min-w-0">{children}</div>
  </div>
);

const LineSize: React.FC<{ size: TabSize }> = ({ size }) => {
  const [v, setV] = useState('overview');
  return <LineTabs items={WITH_ICONS} value={v} onChange={setV} label={`Line tabs, ${size}`} size={size} />;
};
const ContainedSize: React.FC<{ size: TabSize }> = ({ size }) => {
  const [v, setV] = useState('overview');
  return <ContainedTabs items={WITH_ICONS} value={v} onChange={setV} label={`Contained tabs, ${size}`} size={size} render={samplePanel(WITH_ICONS)} />;
};
const SegmentedSize: React.FC<{ size: TabSize }> = ({ size }) => {
  const [v, setV] = useState('week');
  return <SegmentedControl items={PERIOD} value={v} onChange={setV} label={`Period, ${size}`} size={size} />;
};

const code = (comp: string, extra = '') => `// Sizes: Small 32/13/16 · Medium 40/14/16 (default) · Large 48/16/20
<${comp} size="sm" ${extra}/>
<${comp} size="md" ${extra}/>
<${comp} size="lg" ${extra}/>

// sm: h-8 text-[13px] [&_svg]:w-4 [&_svg]:h-4
// md: h-10 text-[14px] [&_svg]:w-4 [&_svg]:h-4
// lg: h-12 text-[16px] [&_svg]:w-5 [&_svg]:h-5`;

/** Small, Medium and Large for Line, Contained and Segmented tabs. */
export const SizeExamples: React.FC = () => (
  <div className="space-y-8">
    <ExampleFrame title="Line tab sizes" useWhen="Medium by default; Small in dense panels and drawers; Large on touch-first screens." code={code('LineTabs', 'items={tabs} value={tab} onChange={setTab} label="Sections" ')}>
      <div className="space-y-6">
        {SIZES.map((s) => (
          <Row key={s.size} name={s.name} spec={s.spec}>
            <LineSize size={s.size} />
          </Row>
        ))}
      </div>
    </ExampleFrame>
    <ExampleFrame title="Contained tab sizes" useWhen="match the size of the card around the tabs: Small in compact cards, Medium elsewhere." code={code('ContainedTabs', 'items={tabs} value={tab} onChange={setTab} label="Sections" ')}>
      <div className="space-y-6">
        {SIZES.map((s) => (
          <Row key={s.size} name={s.name} spec={s.spec}>
            <ContainedSize size={s.size} />
          </Row>
        ))}
      </div>
    </ExampleFrame>
    <ExampleFrame title="Segmented control sizes" useWhen="match neighbouring controls: Small next to 32px buttons and filters, Medium next to 40px inputs." code={code('SegmentedControl', 'items={periods} value={period} onChange={setPeriod} label="Period" ')}>
      <div className="space-y-6">
        {SIZES.map((s) => (
          <Row key={s.size} name={s.name} spec={s.spec}>
            <SegmentedSize size={s.size} />
          </Row>
        ))}
      </div>
    </ExampleFrame>
  </div>
);
