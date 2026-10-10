import React, { useId, useMemo, useState } from 'react';
import { Bell, Camera, Car, ClipboardList, DoorOpen, FileText, History, Info, LayoutGrid, Settings, UserCheck, Users, Utensils } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CodeBlock } from '../../../components/common/CodeBlock';
import { LineTabs } from './components/LineTabs';
import { ContainedTabs } from './components/ContainedTabs';
import { SegmentedControl } from './components/SegmentedControl';
import { VerticalTabs } from './components/VerticalTabs';
import { ScrollableTabs } from './components/ScrollableTabs';
import { ClosableTabs, MAX_OPEN } from './components/ClosableTabs';
import { TabPanels } from './components/TabPanel';
import type { Activation, Surface, TabItem, TabSize } from './components/tabStyles';
import { PLAYGROUND_LABELS } from './tabsSpec';
import { samplePanel } from './examples/panels';

type TabType = 'line' | 'icons' | 'counts' | 'status' | 'contained' | 'segmented' | 'vertical' | 'scrollable' | 'closable' | 'full' | 'dark';

const TYPES: { id: TabType; label: string; component: string }[] = [
  { id: 'line', label: 'Line', component: 'LineTabs' },
  { id: 'icons', label: 'Line with icons', component: 'LineTabs' },
  { id: 'counts', label: 'Line with counts', component: 'LineTabs' },
  { id: 'status', label: 'Line with status dot', component: 'LineTabs' },
  { id: 'contained', label: 'Contained', component: 'ContainedTabs' },
  { id: 'segmented', label: 'Segmented', component: 'SegmentedControl' },
  { id: 'vertical', label: 'Vertical', component: 'VerticalTabs' },
  { id: 'scrollable', label: 'Scrollable / overflow', component: 'ScrollableTabs' },
  { id: 'closable', label: 'Closable', component: 'ClosableTabs' },
  { id: 'full', label: 'Full-width', component: 'LineTabs' },
  { id: 'dark', label: 'Dark', component: 'LineTabs' },
];

const ICONS: Record<string, [LucideIcon, string]> = {
  Overview: [LayoutGrid, 'LayoutGrid'],
  Activity: [History, 'History'],
  Alerts: [Bell, 'Bell'],
  Cameras: [Camera, 'Camera'],
  Reports: [FileText, 'FileText'],
  Users: [Users, 'Users'],
  Gates: [DoorOpen, 'DoorOpen'],
  Vehicles: [Car, 'Car'],
  Visitors: [UserCheck, 'UserCheck'],
  Meals: [Utensils, 'Utensils'],
  Audit: [ClipboardList, 'ClipboardList'],
  Settings: [Settings, 'Settings'],
};
const COUNTS = [12, 248, 3, 1248, 56, 9, 31, 4, 870, 15, 2, 64];

/** Max tabs each type allows. */
const CAP: Partial<Record<TabType, number>> = { segmented: 4, full: 4, closable: MAX_OPEN };
/** Types that have a dark-surface version. */
const DARK_OK: TabType[] = ['line', 'icons', 'counts', 'status', 'segmented', 'full', 'dark'];

interface Config {
  type: TabType;
  size: TabSize;
  icons: boolean;
  counts: boolean;
  n: number;
  activation: Activation;
  surface: Surface;
  disabled: boolean;
}

const DISABLED_REASON = 'Available after setup is complete';

/** n labels with Overview first and Settings last. */
const labelsFor = (n: number) => [...PLAYGROUND_LABELS.slice(0, n - 1), 'Settings'];

const buildItems = (c: Config, n: number): TabItem[] => {
  const showIcons = c.icons || c.type === 'icons' || c.type === 'vertical';
  const showCounts = (c.counts || c.type === 'counts') && c.type !== 'segmented' && c.type !== 'vertical';
  return labelsFor(n).map((label, i) => ({
    id: label.toLowerCase(),
    label,
    icon: showIcons ? ICONS[label][0] : undefined,
    count: showCounts ? COUNTS[i] : undefined,
    status: c.type === 'status' ? (i === 0 ? 'live' : label === 'Alerts' ? 'attention' : undefined) : undefined,
    // Disable the second tab (never the first, which starts selected).
    disabled: c.disabled && i === 1 ? DISABLED_REASON : undefined,
  }));
};

const buildCode = (c: Config, items: TabItem[]): string => {
  const t = TYPES.find((x) => x.id === c.type)!;
  const dark = c.type === 'dark' || (c.surface === 'dark' && DARK_OK.includes(c.type));
  const icons = Array.from(new Set(items.filter((i) => i.icon).map((i) => ICONS[i.label][1])));
  const rows = items.map((i) => {
    const parts = [`id: '${i.id}'`, `label: '${i.label}'`];
    if (i.icon) parts.push(`icon: ${ICONS[i.label][1]}`);
    if (i.count !== undefined) parts.push(`count: ${i.count}`);
    if (i.status) parts.push(`status: '${i.status}'`);
    if (i.disabled) parts.push(`disabled: '${i.disabled}'`);
    return `  { ${parts.join(', ')} },`;
  });
  const props = [`items={tabs}`, `value={tab}`, `onChange={setTab}`, `label="Sections"`];
  if (c.type !== 'vertical' && c.size !== 'md') props.push(`size="${c.size}"`);
  if (c.activation === 'manual' && c.type !== 'closable') props.push(`activation="manual"`);
  if (c.type === 'full') props.push('fitted');
  if (dark) props.push(`surface="dark"`);
  if (c.type === 'closable') props.push('onClose={close}', 'onAdd={add}');
  if (['contained', 'vertical', 'closable'].includes(c.type)) props.push('render={(id) => <Panel id={id} />}');
  const open = dark ? `<div className="bg-[#0B2D6B] p-5 rounded-[8px]">\n  ` : '';
  const close = dark ? `\n</div>` : '';
  const indent = dark ? '    ' : '  ';
  return [
    icons.length ? `import { ${icons.join(', ')} } from 'lucide-react';` : null,
    `import { ${t.component} } from './tabs';`,
    '',
    'const tabs = [',
    ...rows,
    '];',
    `const [tab, setTab] = useState('${items[0].id}');`,
    '',
    `${open}<${t.component}\n${props.map((p) => indent + p).join('\n')}\n${dark ? '  ' : ''}/>${close}`,
  ]
    .filter((l) => l !== null)
    .join('\n');
};

/* ── Controls ── */

const FIELD_LABEL = 'block mb-1.5 text-[13px] font-medium text-[#121722]';

const Radios = <T extends string>({ legend, value, options, onChange }: { legend: string; value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) => {
  const name = useId();
  return (
    <fieldset>
      <legend className={FIELD_LABEL}>{legend}</legend>
      <div className="flex flex-wrap gap-x-4">
        {options.map((o) => (
          <label key={o.id} className="inline-flex items-center gap-2 min-h-[36px] text-[14px] text-[#353D4C] cursor-pointer">
            <input type="radio" name={name} checked={value === o.id} onChange={() => onChange(o.id)} className="w-4 h-4 accent-[#1E63FF]" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
};

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }> = ({ label, checked, onChange, disabled }) => (
  <label className={`inline-flex items-center gap-2 min-h-[36px] text-[14px] ${disabled ? 'text-[#8C95A6] cursor-not-allowed' : 'text-[#353D4C] cursor-pointer'}`}>
    <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-[#1E63FF]" />
    {label}
  </label>
);

/* ── Preview ── */

const darkPanel = (items: TabItem[]) => (id: string) => (
  <p className="text-[14px] text-white/80">Content for {items.find((i) => i.id === id)?.label.toLowerCase()}.</p>
);

const DARK_PANEL = 'focus-visible:ring-[#00C6FF]! focus-visible:ring-offset-[#0B2D6B]!';

const Preview: React.FC<{ c: Config; items: TabItem[] }> = ({ c, items }) => {
  const [value, setValue] = useState(items[0].id);
  const [open, setOpen] = useState<TabItem[]>(items);
  const dark = c.type === 'dark' || (c.surface === 'dark' && DARK_OK.includes(c.type));
  const panel = dark ? darkPanel(items) : samplePanel(items);
  const v = items.some((i) => i.id === value) ? value : items[0].id;
  const label = 'Playground tabs';

  const panels = (api: Parameters<typeof TabPanels>[0]['api']) => (
    <div className="pt-5">
      <TabPanels api={api} value={v} render={panel} className={dark ? DARK_PANEL : ''} />
    </div>
  );

  let node: React.ReactNode;
  switch (c.type) {
    case 'contained':
      node = <ContainedTabs items={items} value={v} onChange={setValue} label={label} size={c.size} activation={c.activation} render={panel} />;
      break;
    case 'segmented':
      node = (
        <SegmentedControl items={items} value={v} onChange={setValue} label={label} size={c.size} activation={c.activation} surface={dark ? 'dark' : 'light'}>
          {panels}
        </SegmentedControl>
      );
      break;
    case 'vertical':
      node = <VerticalTabs items={items} value={v} onChange={setValue} label={label} activation={c.activation} render={panel} />;
      break;
    case 'scrollable':
      node = (
        <ScrollableTabs items={items} value={v} onChange={setValue} label={label} size={c.size} activation={c.activation}>
          {panels}
        </ScrollableTabs>
      );
      break;
    case 'closable': {
      const cv = open.some((i) => i.id === value) ? value : (open[0]?.id ?? '');
      node = (
        <ClosableTabs
          items={open}
          value={cv}
          onChange={setValue}
          onClose={(id) => setOpen((o) => o.filter((t) => t.id !== id))}
          onAdd={() => {
            const next = PLAYGROUND_LABELS.find((l) => !open.some((o) => o.label === l));
            if (!next) return;
            setOpen((o) => [...o, { id: next.toLowerCase(), label: next }]);
            setValue(next.toLowerCase());
          }}
          label={label}
          size={c.size}
          render={panel}
        />
      );
      break;
    }
    default:
      node = (
        <LineTabs items={items} value={v} onChange={setValue} label={label} size={c.size} activation={c.activation} fitted={c.type === 'full'} surface={dark ? 'dark' : 'light'}>
          {panels}
        </LineTabs>
      );
  }

  return dark ? <div className="rounded-[8px] bg-[#0B2D6B] p-5">{node}</div> : <div className="rounded-[12px] border border-[#DDE2EA] bg-white p-5">{node}</div>;
};

/** Interactive playground: every option updates the live preview and the code below it. */
export const TabsPlayground: React.FC = () => {
  const [c, setC] = useState<Config>({ type: 'line', size: 'md', icons: false, counts: false, n: 4, activation: 'automatic', surface: 'light', disabled: false });
  const set = <K extends keyof Config>(k: K, v: Config[K]) => setC((p) => ({ ...p, [k]: v }));
  const typeId = useId();
  const rangeId = useId();

  const cap = CAP[c.type];
  const n = cap ? Math.min(c.n, cap) : c.n;
  const items = useMemo(() => buildItems(c, n), [c, n]);
  const code = useMemo(() => buildCode(c, items), [c, items]);

  const notes: string[] = [];
  if (cap && c.n > cap) notes.push(`Showing ${cap}: ${TYPES.find((t) => t.id === c.type)!.label.toLowerCase()} tabs hold at most ${cap}.`);
  if (c.surface === 'dark' && !DARK_OK.includes(c.type)) notes.push('Dark surface is available for line, full-width and segmented tabs.');
  if (c.type === 'vertical') notes.push('Vertical tabs have one size (40px items) and always show icons.');
  if (c.type === 'segmented' && c.counts) notes.push('Segmented controls don’t show counts.');
  if (c.type === 'closable') notes.push('Closable tabs activate on click or arrow keys; Delete closes the focused tab.');
  if (n > 7 && !['scrollable', 'vertical'].includes(c.type)) notes.push('More than 7 tabs: consider scrollable or vertical tabs.');

  // Remount the preview when the configuration changes so its state starts clean.
  const key = `${c.type}-${c.size}-${c.icons}-${c.counts}-${n}-${c.activation}-${c.surface}-${c.disabled}`;

  return (
    <div className="rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
      <div className="@container p-5 border-b border-[#DDE2EA]">
        <div className="grid grid-cols-1 @min-[560px]:grid-cols-2 @min-[860px]:grid-cols-4 gap-x-6 gap-y-4">
          <div>
            <label htmlFor={typeId} className={FIELD_LABEL}>
              Type
            </label>
            <select
              id={typeId}
              value={c.type}
              onChange={(e) => set('type', e.target.value as TabType)}
              className="w-full h-10 px-3 rounded-[8px] border border-[#8C95A6] bg-white text-[14px] text-[#121722] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20"
            >
              {TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={rangeId} className={FIELD_LABEL}>
              Number of tabs: <span className="font-mono">{c.n}</span>
            </label>
            <input id={rangeId} type="range" min={2} max={12} value={c.n} onChange={(e) => set('n', Number(e.target.value))} className="w-full h-10 accent-[#1E63FF]" />
          </div>
          <Radios<TabSize>
            legend="Size"
            value={c.size}
            onChange={(v) => set('size', v)}
            options={[
              { id: 'sm', label: 'S' },
              { id: 'md', label: 'M' },
              { id: 'lg', label: 'L' },
            ]}
          />
          <Radios<Activation>
            legend="Activation"
            value={c.activation}
            onChange={(v) => set('activation', v)}
            options={[
              { id: 'automatic', label: 'Automatic' },
              { id: 'manual', label: 'Manual' },
            ]}
          />
          <Radios<Surface>
            legend="Surface"
            value={c.type === 'dark' ? 'dark' : c.surface}
            onChange={(v) => set('surface', v)}
            options={[
              { id: 'light', label: 'Light' },
              { id: 'dark', label: 'Dark' },
            ]}
          />
          <fieldset className="@min-[860px]:col-span-3">
            <legend className={FIELD_LABEL}>Options</legend>
            <div className="flex flex-wrap gap-x-5">
              <Toggle label="Icons" checked={c.icons || c.type === 'icons' || c.type === 'vertical'} disabled={c.type === 'icons' || c.type === 'vertical'} onChange={(v) => set('icons', v)} />
              <Toggle label="Counts" checked={c.counts || c.type === 'counts'} disabled={c.type === 'counts'} onChange={(v) => set('counts', v)} />
              <Toggle label="Disabled tab" checked={c.disabled} onChange={(v) => set('disabled', v)} />
            </div>
          </fieldset>
        </div>
        {notes.length > 0 && (
          <ul className="mt-4 space-y-1" aria-live="polite">
            {notes.map((note) => (
              <li key={note} className="flex items-start gap-2 text-[13px] text-[#4B5465]">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-[#6B7485]" aria-hidden="true" />
                {note}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="preview-grid-canvas p-4 md:p-8">
        <div className="max-w-[760px] mx-auto">
          <Preview key={key} c={c} items={items} />
        </div>
      </div>
      <div className="p-4 border-t border-[#DDE2EA]">
        <CodeBlock code={code} language="tsx" />
      </div>
    </div>
  );
};
