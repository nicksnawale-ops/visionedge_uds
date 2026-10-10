import React, { useId, useRef, useState } from 'react';
import { Check, Lock, X } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { SpecTable } from '../../../components/common/SpecTable';
import { DoDontPair } from '../../../components/common/DoDont';
import { CodeBlock } from '../../../components/common/CodeBlock';
import { SHOWCASE_STYLES, SourceFile, TemplateShowcase } from '../shared/TemplateShowcase';
import { BUTTON } from '../profile/ui';
import { SettingsScreen } from './SettingsScreen';
import { SettingsAnatomyLegend } from './AnatomyOverlay';
import { SectionCard } from './patterns/SectionCard';
import { RadioGroup, RowInput, RowSelect, RowSwitch, SettingRow } from './patterns/SettingRow';
import { Slider } from './patterns/Slider';
import { ToggleChips } from './patterns/ChipsInput';
import { OPTIONS } from './data/settingsIndex';
import { SettingsSelect } from './parts/SettingsSelect';
import {
  SETTINGS_PREVIEW_PATH,
  SETTINGS_SECTIONS,
  SETTINGS_STATES,
  SettingsRole,
  SettingsSectionId,
  SettingsStateId,
  getSettingsState,
  roleForState,
} from './settingsStates';

import settingsLayoutSource from './SettingsLayout.tsx?raw';
import settingRowSource from './patterns/SettingRow.tsx?raw';
import settingsScreenSource from './SettingsScreen.tsx?raw';
import sectionCardSource from './patterns/SectionCard.tsx?raw';
import detectionSource from './sections/Detection.tsx?raw';
import searchSource from './SettingsSearch.tsx?raw';
import navSource from './SettingsNav.tsx?raw';
import drawerSource from './patterns/Drawer.tsx?raw';
import ruleBuilderSource from './drawers/RuleBuilderDrawer.tsx?raw';

const DIR = 'src/pages/templates/settings';

const SOURCE_FILES: SourceFile[] = [
  { name: 'SettingsLayout.tsx', code: settingsLayoutSource },
  { name: 'SettingRow.tsx', code: settingRowSource, dir: `${DIR}/patterns` },
  { name: 'SectionCard.tsx', code: sectionCardSource, dir: `${DIR}/patterns` },
  { name: 'SettingsScreen.tsx', code: settingsScreenSource },
  { name: 'Detection.tsx', code: detectionSource, dir: `${DIR}/sections` },
  { name: 'SettingsSearch.tsx', code: searchSource },
  { name: 'SettingsNav.tsx', code: navSource },
  { name: 'Drawer.tsx', code: drawerSource, dir: `${DIR}/patterns` },
  { name: 'RuleBuilderDrawer.tsx', code: ruleBuilderSource, dir: `${DIR}/drawers` },
];

const ROW_SNIPPET = `<SectionCard title="Plate reading" description="How plates are read, matched and stored.">
  <SettingRow
    label="Confidence threshold"
    description="Reads below this are marked for review instead of matched."
    modified={isModified('det.anpr.confidence')}
    helper={\`Plates below \${value}% are marked for review\`}
  >
    {(control) => <Slider control={control} value={value} min={50} max={99} unit="%" onChange={setValue} />}
  </SettingRow>

  <SettingRow label="Audit logs" description="Changes to settings, users and rules." locked="Set by your data policy.">
    {(control) => <RowSelect control={control} options={auditOptions} value="2" onChange={() => {}} />}
  </SettingRow>
</SectionCard>`;

const { SEGMENT_GROUP, SEGMENT, SEGMENT_ON, SEGMENT_OFF } = SHOWCASE_STYLES;
const TH = 'py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left';
const TABLE_WRAP = 'overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]';

/* ── Setting row pattern: live examples ──────────────────────────── */

const RowExamples: React.FC = () => {
  const [toggle, setToggle] = useState(true);
  const [select, setSelect] = useState('30');
  const [input, setInput] = useState('Pune Institute of Technology');
  const [slider, setSlider] = useState(85);
  const [radio, setRadio] = useState('edge');
  const [chips, setChips] = useState<string[]>(['indian', 'bh']);
  const [modified, setModified] = useState(90);
  const [email, setEmail] = useState('security@pit');

  return (
    <div className="@container space-y-6">
      <SectionCard title="Control types" description="One row per control. The control always sits left-aligned in the right 7 columns.">
        <SettingRow label="Toggle" description="Turns a single behaviour on or off. Shows On/Off in words.">
          {(c) => <RowSwitch control={c} checked={toggle} onChange={setToggle} />}
        </SettingRow>
        <SettingRow label="Select" description="One choice from a short list, with units in every option.">
          {(c) => <RowSelect control={c} options={OPTIONS.video} value={select} onChange={setSelect} className="max-w-[200px]!" />}
        </SettingRow>
        <SettingRow label="Input" description="Free text such as a name or an address." learnMore>
          {(c) => <RowInput control={c} value={input} onChange={setInput} />}
        </SettingRow>
        <SettingRow label="Slider" description="A number in a range. The value box can be typed into." helper={`Plates below ${slider}% are marked for review`}>
          {(c) => <Slider control={c} value={slider} min={50} max={99} unit="%" onChange={setSlider} />}
        </SettingRow>
        <SettingRow label="Radio group" description="Two to four options that all deserve to be seen." group>
          {(c) => <RadioGroup control={c} name="example-processing" options={OPTIONS.processing} value={radio} onChange={setRadio} />}
        </SettingRow>
        <SettingRow label="Chips" description="Several choices at once, each a toggle button." group>
          {(c) => <ToggleChips options={OPTIONS.plateFormats} value={chips} onChange={setChips} labelledBy={c.labelId} describedBy={c.describedBy} />}
        </SettingRow>
        <SettingRow label="Button" description="Opens a flow instead of changing a value directly." group>
          {() => (
            <button type="button" className={BUTTON.secondary}>
              Configure
            </button>
          )}
        </SettingRow>
      </SectionCard>

      <SectionCard title="Variants" description="Modified, Locked, Error and Disabled.">
        <SettingRow label="Modified" description="Changed but not saved: 3px Royal Blue bar and a Modified tag." modified={modified !== 85}>
          {(c) => <Slider control={c} value={modified} min={50} max={99} unit="%" onChange={setModified} />}
        </SettingRow>
        <SettingRow label="Locked" description="Managed by license or policy. The reason is in the tooltip." locked="Set by your organization’s data policy.">
          {(c) => <RowSelect control={c} options={OPTIONS.auditRetention} value="2" onChange={() => undefined} className="max-w-[200px]!" />}
        </SettingRow>
        <SettingRow label="Error" description="A specific message under the control." error={/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? undefined : 'Enter a valid email, like security@pit.edu.in'}>
          {(c) => <RowInput control={c} type="email" value={email} onChange={setEmail} />}
        </SettingRow>
        <SettingRow label="Disabled" description="Viewer role or while saving: visible, read-only styling, not hidden." disabled>
          {(c) => <RowSelect control={c} options={OPTIONS.industry} value="education" onChange={() => undefined} />}
        </SettingRow>
      </SectionCard>
    </div>
  );
};

/* ── Mini visuals ────────────────────────────────────────────────── */

const Mini: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-[240px] rounded-[6px] bg-white border border-[#DDE2EA] overflow-hidden text-[10px] text-[#353D4C]">{children}</div>
);
const MiniRow: React.FC<{ label: string; desc?: string; control: React.ReactNode; bar?: boolean }> = ({ label, desc, control, bar }) => (
  <div className={`relative grid grid-cols-12 gap-2 px-2 py-1.5 border-b border-[#DDE2EA] last:border-b-0 ${bar ? 'border-l-[3px] border-l-[#1E63FF]' : ''}`}>
    <span className="col-span-5">
      <span className="block font-medium text-[#121722]">{label}</span>
      {desc && <span className="block text-[9px] text-[#4B5465]">{desc}</span>}
    </span>
    <span className="col-span-7 flex items-center">{control}</span>
  </div>
);
const MiniSwitch: React.FC<{ on?: boolean }> = ({ on = true }) => (
  <span className={`w-6 h-3.5 rounded-full p-0.5 flex ${on ? 'bg-[#1E63FF] justify-end' : 'bg-[#C3CAD5]'}`}>
    <span className="w-2.5 h-2.5 rounded-full bg-white" />
  </span>
);

const ACCESSIBILITY_NOTES = [
  { title: 'Grouped nav landmark', text: 'nav "Settings sections" with a labelled group per Overline heading and aria-current on the active item; tabs and a grouped select on smaller screens.' },
  { title: 'Rows tie label, description and control', text: 'Each control is labelled by its row label and described by the description, helper, error and lock reason (aria-describedby).' },
  { title: 'Slider with a visible value', text: 'Native range input (arrow keys, Page Up/Down, Home/End) plus a number box that always shows the value and its unit.' },
  { title: 'Drawers and modals', text: 'Focus moves in, Tab stays inside, Esc closes, and focus returns to the control that opened them.' },
  { title: 'Announced search and saves', text: 'Search result counts, saves and Undo are announced in an aria-live region; "Modified" is part of the row’s accessible name.' },
  { title: 'Permission matrix', text: 'A table with row and column headers, a sticky first column on small screens, and a label on every checkbox ("Operator: Export data").' },
];

const CONTENT_RULES = [
  'Sentence case everywhere: "Confidence threshold", not "Confidence Threshold".',
  'Labels are nouns; descriptions are one short sentence that says what happens.',
  'Always state units: "10 min", "30 days", "85%".',
  'Errors say how to fix it: "Enter a valid stream URL starting with rtsp://".',
  'Precise verbs: "Sign out", "Remove", "Revoke" — never "OK" or "Yes".',
];

/* ── Page ────────────────────────────────────────────────────────── */

const SettingsTemplatePage: React.FC = () => {
  const sectionSelectId = useId();
  const [state, setState] = useState<SettingsStateId>('default');
  const [role, setRole] = useState<SettingsRole>('admin');
  const [section, setSection] = useState<SettingsSectionId>('general');
  const [anatomy, setAnatomy] = useState(false);
  const showcaseRef = useRef<HTMLElement>(null);
  const effectiveRole = roleForState(state, role);

  const changeState = (id: SettingsStateId) => {
    setState(id);
    setSection(getSettingsState(id).section);
    if (id === 'viewer') setRole('viewer');
  };
  const changeRole = (r: SettingsRole) => {
    setRole(r);
    if (r === 'admin' && state === 'viewer') changeState('default');
  };
  const previewState = (id: SettingsStateId) => {
    changeState(id);
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      <PageHeader
        category="TEMPLATES"
        title="Settings Page"
        description="Reference organization and system settings for every VisionEdge product, with the reusable setting-row pattern."
      />

      <section id="showcase" ref={showcaseRef} className="mb-12 scroll-mt-24">
        <TemplateShowcase
          states={SETTINGS_STATES}
          state={state}
          onStateChange={changeState}
          stateGroupLabel="Settings state"
          previewPath={SETTINGS_PREVIEW_PATH}
          urlPill="app.visionedge.ai/settings"
          sourceFiles={SOURCE_FILES}
          sourceDir={DIR}
          showBackgroundToggle={false}
          extraToggle={{ label: 'Show anatomy', pressed: anatomy, onToggle: () => setAnatomy((a) => !a) }}
          extraRows={[
            {
              label: 'Role',
              content: (
                <div role="group" aria-label="Role" className={SEGMENT_GROUP}>
                  {(
                    [
                      ['admin', 'Administrator'],
                      ['viewer', 'Viewer'],
                    ] as const
                  ).map(([id, label]) => (
                    <button key={id} type="button" aria-pressed={effectiveRole === id} onClick={() => changeRole(id)} className={`${SEGMENT} ${effectiveRole === id ? SEGMENT_ON : SEGMENT_OFF}`}>
                      {label}
                    </button>
                  ))}
                </div>
              ),
            },
            {
              label: 'Section',
              content: (
                <>
                  <SettingsSelect
                    id={sectionSelectId}
                    ariaLabel="Section"
                    size="sm"
                    className="min-w-[200px]"
                    value={section}
                    onChange={(v) => setSection(v as SettingsSectionId)}
                    options={SETTINGS_SECTIONS.map((s) => ({ value: s.id, label: s.label }))}
                  />
                </>
              ),
            },
          ]}
          showUseCase={false}
          buildPreviewHref={({ state: s }) => `${SETTINGS_PREVIEW_PATH}?state=${s}&section=${section}&role=${roleForState(s, role)}`}
          renderScreen={({ state: s }) => (
            <SettingsScreen state={s} role={effectiveRole} section={section} onSectionChange={setSection} showAnatomy={anatomy} />
          )}
        />
        <p className="mt-2 text-[12px] leading-[16px] text-[#4B5465]">
          The settings page is generic and identical across all VisionEdge products. Module-specific options appear as module cards.
        </p>
        {anatomy && (
          <div className="mt-4 rounded-[12px] border border-[#DDE2EA] bg-white p-5">
            <SettingsAnatomyLegend />
          </div>
        )}
      </section>

      <section id="anatomy" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Layout Anatomy</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">
          Turn on <strong className="font-semibold text-[#121722]">Show anatomy</strong> in the showcase. Some regions only appear in some states: Modified (7) and the bar
          (9) in Unsaved changes, the drawer (10) in Drawer open or Rule builder, locked rows (8) in License and Data & privacy, Danger zones (11) in Data & privacy and System.
        </p>
        <SettingsAnatomyLegend />
      </section>

      <section id="row-pattern" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Setting Row Pattern</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">
          Build every form setting from <code className="font-mono text-[13px]">SectionCard</code> + <code className="font-mono text-[13px]">SettingRow</code>. The row passes ids
          to its control so the label, description, helper, error and lock reason are always connected. Try the examples below.
        </p>
        <RowExamples />
        <div className="mt-6">
          <CodeBlock code={ROW_SNIPPET} filename={`${DIR}/sections/Detection.tsx (excerpt)`} />
        </div>
      </section>

      <section id="sections-overview" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">Sections Overview</h2>
        <div className={TABLE_WRAP}>
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                {['Section', 'Purpose', 'Typical controls', 'Who can edit'].map((h) => (
                  <th key={h} scope="col" className={TH}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {SETTINGS_SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <tr key={s.id} className="align-top">
                    <th scope="row" className="py-3 px-4 text-left font-medium text-[#121722] whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSection(s.id);
                          showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="inline-flex items-center gap-2 rounded-[4px] hover:text-[#1E63FF] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
                        aria-label={`Show ${s.label} in the showcase`}
                      >
                        <Icon className="w-4 h-4 text-[#4B5465]" aria-hidden="true" />
                        {s.label}
                      </button>
                    </th>
                    <td className="py-3 px-4 text-[#353D4C] min-w-[220px]">{s.purpose}</td>
                    <td className="py-3 px-4 text-[#4B5465] min-w-[220px]">{s.controls}</td>
                    <td className="py-3 px-4 text-[#353D4C] min-w-[160px]">{s.editors}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section id="roles" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">Roles</h2>
        <div className={TABLE_WRAP}>
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                <th scope="col" className={TH}>Area</th>
                <th scope="col" className={TH}>Administrator</th>
                <th scope="col" className={TH}>Viewer (read-only)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {[
                ['Banner', '—', 'Info: "You have view-only access to settings. Contact an administrator to make changes."'],
                ['Controls', 'Editable', 'Disabled with read-only styling; never hidden'],
                ['Primary and Destructive actions', 'Shown', 'Hidden (Add, Create, Save, Revoke, Purge, Restart)'],
                ['Secrets', 'Masked; new API keys shown once', 'Fully masked, no characters revealed'],
                ['Search, filters, Test settings', 'Available', 'Available — they change nothing'],
              ].map(([area, admin, viewer]) => (
                <tr key={area} className="align-top">
                  <th scope="row" className="py-3 px-4 text-left font-medium text-[#121722] whitespace-nowrap">
                    {area}
                  </th>
                  <td className="py-3 px-4 text-[#353D4C] min-w-[200px]">{admin}</td>
                  <td className="py-3 px-4 text-[#353D4C] min-w-[260px]">{viewer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="states" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">States</h2>
        <div className={TABLE_WRAP}>
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                <th scope="col" className={TH}>State</th>
                <th scope="col" className={TH}>When it appears</th>
                <th scope="col" className={TH}>Behaviour</th>
                <th scope="col" className={TH}>
                  <span className="sr-only">Preview</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {SETTINGS_STATES.map((s) => (
                <tr key={s.id} className="align-top hover:bg-[#F7F9FC] transition-colors">
                  <th scope="row" className="py-3 px-4 text-left font-medium text-[#121722] whitespace-nowrap">
                    {s.label}
                  </th>
                  <td className="py-3 px-4 text-[#353D4C] min-w-[180px]">{s.trigger}</td>
                  <td className="py-3 px-4 text-[#4B5465] min-w-[260px]">{s.behaviour}</td>
                  <td className="py-2 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => previewState(s.id)}
                      aria-label={`Preview ${s.label} state`}
                      className="inline-flex items-center h-8 px-3 rounded-[8px] text-[13px] font-semibold text-[#1E63FF] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">Specifications</h2>
        <SpecTable
          rows={[
            { property: 'Setting Row', value: '20px vertical × 24px horizontal padding, 1px Gray 200 divider', token: 'px-6 py-5 border-b-[#DDE2EA]' },
            { property: 'Row Label', value: '14px Medium Gray 900; description 12px Gray 600, max 2 lines', token: 'text-[14px] font-medium · text-[12px] line-clamp-2' },
            { property: 'Label / Control Split', value: '5 / 7 of the card; stacked below 768px', token: 'col-span-5 · col-span-7' },
            { property: 'Card Header', value: '20px × 24px padding, H4 16/24 SemiBold + 12px Gray 500 description, 1px bottom border', token: 'px-6 py-5 border-b' },
            { property: 'Modified', value: '3px Royal Blue left bar + "Modified" Overline in Royal Blue', token: 'w-[3px] bg-[#1E63FF]' },
            { property: 'Content', value: 'Max width 1280px, 12 columns, 24px gutter, 32px padding', token: 'max-w-[1344px] p-8 gap-6' },
            { property: 'Drawer', value: '560px, elevation-3, 24px padding, sticky footer; full screen below 768px', token: 'w-[560px] shadow-[0_12px_32px_…]' },
            { property: 'Modals', value: '480px (confirmations) · 640px (invite, test settings)', token: 'max-w-[480px] · max-w-[640px]' },
            { property: 'Saving', value: 'Form settings: the sticky bar. Inline table toggles: save at once with a 5 s Undo toast', token: 'UNDO_MS = 5000' },
            { property: 'Masked Secret', value: 've_live_••••••••3f9a (last 4); viewers see no characters', token: 'maskKey(last4, viewOnly)' },
            { property: 'Search Highlight', value: 'Match on Royal Blue 12%; jumping flashes the row Royal Blue 8% for 600ms', token: 'bg-[#1E63FF]/[0.12] · FLASH_MS = 600' },
          ]}
        />
      </section>

      <section id="do-dont" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-2">Do &amp; Don&apos;t</h2>
        <DoDontPair
          doTitle="Do group settings by task and explain each in one line"
          doDescription="A label says what it is; the description says what happens."
          doExample={
            <Mini>
              <MiniRow label="Duplicate read window" desc="Reads of one plate in this window count once." control={<span className="px-1.5 py-0.5 rounded-[3px] border border-[#8C95A6]">30 s</span>} />
              <MiniRow label="Capture image" desc="Stores a snapshot with every read." control={<MiniSwitch />} />
            </Mini>
          }
          dontTitle="Don't show bare labels with no description"
          dontDescription="“dup_window” and “cap_img” leave people guessing."
          dontExample={
            <Mini>
              <MiniRow label="dup_window" control={<span className="px-1.5 py-0.5 rounded-[3px] border border-[#8C95A6]">30</span>} />
              <MiniRow label="cap_img" control={<MiniSwitch />} />
            </Mini>
          }
        />
        <DoDontPair
          doTitle="Do save forms with one sticky bar; inline table toggles may save instantly with Undo"
          doDescription="People always know what is saved and how to take it back."
          doExample={
            <Mini>
              <MiniRow label="Confidence" control={<span>90%</span>} bar />
              <div className="flex items-center justify-between px-2 py-1.5 shadow-[0_-4px_12px_rgba(11,45,107,0.12)]">
                <span className="font-medium text-[#121722]">1 unsaved change</span>
                <span className="px-1.5 py-0.5 rounded-[3px] bg-[#1E63FF] text-white">Save changes</span>
              </div>
            </Mini>
          }
          dontTitle="Don't mix silent auto-save and Save buttons in the same card"
          dontDescription="Some changes stick, some don't — and nobody can tell which."
          dontExample={
            <Mini>
              <MiniRow label="Night mode" control={<MiniSwitch />} />
              <MiniRow label="Confidence" control={<span className="px-1.5 py-0.5 rounded-[3px] bg-[#1E63FF] text-white">Save</span>} />
            </Mini>
          }
        />
        <DoDontPair
          doTitle="Do show secrets once at creation, then mask them"
          doDescription="Copy the new key now; afterwards only the last 4 characters show."
          doExample={
            <Mini>
              <div className="p-2 font-mono text-[11px]">ve_live_••••••••3f9a</div>
            </Mini>
          }
          dontTitle="Don't let users reveal stored API keys or passwords"
          dontDescription="A “show” button turns a screenshot into a breach."
          dontExample={
            <Mini>
              <div className="p-2 flex items-center justify-between font-mono text-[11px]">
                ve_live_7Qm2Xr9KpL4t…
                <span className="font-sans text-[#1E63FF]">Show</span>
              </div>
            </Mini>
          }
        />
        <DoDontPair
          doTitle="Do explain locked settings with a reason"
          doDescription="A lock and “Set by your data policy” stop the guessing."
          doExample={
            <Mini>
              <MiniRow
                label="Audit logs"
                desc="Set by your data policy."
                control={
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] border border-[#DDE2EA] bg-[#F7F9FC]">
                    2 years <Lock className="w-2.5 h-2.5" aria-hidden="true" />
                  </span>
                }
              />
            </Mini>
          }
          dontTitle="Don't hide settings a role can't change"
          dontDescription="People think the setting doesn’t exist and ask support."
          dontExample={
            <Mini>
              <div className="p-2 text-[#8C95A6]">(nothing shown)</div>
            </Mini>
          }
        />
        <DoDontPair
          doTitle="Do write alert rules as plain-English summaries"
          doDescription="“When a watchlist vehicle is detected at Gate 1, notify Security supervisors by SMS.”"
          doExample={
            <Mini>
              <div className="p-2 bg-[#F7F9FC] leading-[14px]">When a watchlist vehicle is detected at Gate 1, at any time, notify Security supervisors by SMS as Critical.</div>
            </Mini>
          }
          dontTitle="Don't show raw rule syntax to users"
          dontDescription="Expressions are for engineers, not gate supervisors."
          dontExample={
            <Mini>
              <div className="p-2 font-mono text-[10px] leading-[14px]">evt==WL && zone in [G1] → notify(role:SS, ch:SMS)</div>
            </Mini>
          }
        />
        <DoDontPair
          doTitle="Do put irreversible actions in a Danger zone with type-to-confirm"
          doDescription="Separated, explained and confirmed with the organization’s short name."
          doExample={
            <Mini>
              <div className="border-l-4 border-l-[#121722] p-2 flex items-center justify-between">
                <span className="font-medium text-[#121722]">Purge recordings</span>
                <span className="px-1.5 py-0.5 rounded-[3px] bg-[#121722] text-white">Purge</span>
              </div>
            </Mini>
          }
          dontTitle="Don't place Destructive buttons next to Save"
          dontDescription="One slip deletes data instead of saving it."
          dontExample={
            <Mini>
              <div className="p-2 flex justify-end gap-1">
                <span className="px-1.5 py-0.5 rounded-[3px] bg-[#121722] text-white">Purge all</span>
                <span className="px-1.5 py-0.5 rounded-[3px] bg-[#1E63FF] text-white">Save</span>
              </div>
            </Mini>
          }
        />
      </section>

      <section id="accessibility" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Accessibility</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">Built into the template above — keep these when you adapt it.</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACCESSIBILITY_NOTES.map((n) => (
            <li key={n.title} className="flex gap-3 p-4 rounded-[12px] border border-[#DDE2EA] bg-white">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-[#00C6FF]/15 text-[#0B2D6B] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] leading-[20px] font-semibold text-[#121722]">{n.title}</span>
                <span className="block mt-0.5 text-[13px] leading-[20px] text-[#4B5465]">{n.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section id="content">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">Content Guidelines</h2>
        <ul className="mb-6 space-y-2">
          {CONTENT_RULES.map((rule) => (
            <li key={rule} className="flex items-start gap-2 text-[14px] leading-[20px] text-[#353D4C]">
              <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#1E63FF]" aria-hidden="true" />
              {rule}
            </li>
          ))}
        </ul>
        <div className={TABLE_WRAP}>
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                <th scope="col" className={TH}>Avoid</th>
                <th scope="col" className={TH}>Use instead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {[
                ['Dup. window: 30', 'Duplicate read window · 30 s'],
                ['Invalid URL', 'Enter a valid stream URL starting with rtsp://'],
                ['Delete key? OK / Cancel', 'Revoke “Gate access controller”? · Revoke key'],
                ['Retention: 30', 'Video recordings · 30 days'],
                ['Logout all devices', 'Sign out of all sessions'],
              ].map(([avoid, use]) => (
                <tr key={avoid}>
                  <td className="py-3 px-4 text-[#4B5465] min-w-[200px]">
                    <span className="inline-flex items-start gap-2">
                      <X className="w-4 h-4 mt-0.5 shrink-0 text-[#121722]" aria-label="Avoid" />
                      {avoid}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#121722] min-w-[240px]">
                    <span className="inline-flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#1E63FF]" aria-label="Use" />
                      {use}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SettingsTemplatePage;
