import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { SpecTable } from '../../../components/common/SpecTable';
import { DoDontPair } from '../../../components/common/DoDont';
import { SHOWCASE_STYLES, SourceFile, TemplateShowcase } from '../shared/TemplateShowcase';
import { FormsScreen } from './FormsScreen';
import { FieldCatalog, FIELD_COUNT } from './FieldCatalog';
import { FormAnatomyLegend } from './AnatomyOverlay';
import { FORMS_PREVIEW_PATH, FORM_STATES, FormStateId, PATTERNS, PatternId, getPattern } from './formStates';

import singleSource from './patterns/SinglePageForm.tsx?raw';
import sectionedSource from './patterns/SectionedForm.tsx?raw';
import wizardSource from './patterns/WizardForm.tsx?raw';
import drawerSource from './patterns/DrawerForm.tsx?raw';
import modalSource from './patterns/ModalForm.tsx?raw';
import editSource from './patterns/EditRecordForm.tsx?raw';
import importSource from './patterns/BulkImport/BulkImport.tsx?raw';
import layoutSource from './foundations/FormLayout.tsx?raw';
import sectionSource from './foundations/FormSection.tsx?raw';
import actionBarSource from './foundations/ActionBar.tsx?raw';
import summarySource from './foundations/ErrorSummary.tsx?raw';
import formStateSource from './foundations/useFormState.ts?raw';
import validatorsSource from './foundations/validators.ts?raw';

const DIR = 'src/pages/templates/forms';

const PATTERN_SOURCE: Record<PatternId, SourceFile> = {
  single: { name: 'SinglePageForm.tsx', code: singleSource, dir: `${DIR}/patterns` },
  sectioned: { name: 'SectionedForm.tsx', code: sectionedSource, dir: `${DIR}/patterns` },
  wizard: { name: 'WizardForm.tsx', code: wizardSource, dir: `${DIR}/patterns` },
  drawer: { name: 'DrawerForm.tsx', code: drawerSource, dir: `${DIR}/patterns` },
  modal: { name: 'ModalForm.tsx', code: modalSource, dir: `${DIR}/patterns` },
  edit: { name: 'EditRecordForm.tsx', code: editSource, dir: `${DIR}/patterns` },
  import: { name: 'BulkImport.tsx', code: importSource, dir: `${DIR}/patterns/BulkImport` },
};

const FOUNDATION_SOURCE: SourceFile[] = [
  { name: 'FormLayout.tsx', code: layoutSource, dir: `${DIR}/foundations` },
  { name: 'FormSection.tsx', code: sectionSource, dir: `${DIR}/foundations` },
  { name: 'ActionBar.tsx', code: actionBarSource, dir: `${DIR}/foundations` },
  { name: 'ErrorSummary.tsx', code: summarySource, dir: `${DIR}/foundations` },
  { name: 'useFormState.ts', code: formStateSource, dir: `${DIR}/foundations` },
  { name: 'validators.ts', code: validatorsSource, dir: `${DIR}/foundations` },
];

const { CHIP, CHIP_ON, CHIP_OFF } = SHOWCASE_STYLES;
const TH = 'py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left';
const TABLE_WRAP = 'overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]';

const VALIDATION: { title: string; text: string }[] = [
  { title: 'When to validate', text: 'Each field on blur (never while typing a first value); every field on submit. Errors clear as soon as the value is fixed.' },
  { title: 'Error summary', text: 'After a failed submit, a Critical-style summary at the top says "Fix 3 fields to continue" and links to each field. Focus moves to the summary.' },
  { title: 'Message patterns', text: '"Enter…" for typed values ("Enter a 6-digit PIN code"), "Choose…" for selections ("Choose a state"), "… must be …" for relationships ("End date must be after start date").' },
  { title: 'Required vs optional', text: 'Most fields are required, so mark the optional ones with "(optional)" and say so once under the title. No asterisks.' },
  { title: 'Keep the input', text: 'Errors never clear the form. A server error keeps every value and offers Try again.' },
  { title: 'Duplicates', text: 'Warn softly when a similar record exists, link to it, and let people continue anyway.' },
];

const ACCESSIBILITY = [
  { title: 'Labels and groups', text: 'Every input has a <label>; radio groups, checkbox groups, ranges and repeater rows use fieldset + legend.' },
  { title: 'Errors are connected', text: 'aria-invalid and aria-describedby tie each message to its field; the error summary is focusable and its links move focus to the field.' },
  { title: 'Announcements', text: 'aria-live announces autosave, PIN auto-fill, repeater changes and import progress (every 25%, not every tick).' },
  { title: 'Steps and sections', text: 'The stepper uses aria-current="step"; the section index uses aria-current="location" and moves focus into the section.' },
  { title: 'Drawers and modals', text: 'Focus moves in, Tab stays inside, Esc closes (asking first if anything was typed), and focus returns to the trigger.' },
  { title: 'Keyboard first', text: 'The combobox, date picker and repeater work with the keyboard alone; all targets are at least 44px; AA contrast throughout.' },
];

const FormsTemplatePage: React.FC = () => {
  const [pattern, setPattern] = useState<PatternId>('single');
  const [state, setState] = useState<FormStateId>('empty');
  const [anatomy, setAnatomy] = useState(false);
  const meta = getPattern(pattern);

  return (
    <div>
      <PageHeader
        category="TEMPLATES"
        title="Form Pages"
        description="Generic patterns for creating, registering and onboarding anything in VisionEdge. Pick a pattern, then reuse the fields and states."
      />

      <section id="showcase" className="mb-12 scroll-mt-24">
        <TemplateShowcase<FormStateId>
          states={FORM_STATES}
          state={state}
          onStateChange={setState}
          stateGroupLabel="Form state"
          showUseCase={false}
          showBackgroundToggle={false}
          previewPath={FORMS_PREVIEW_PATH}
          urlPill={`app.visionedge.ai${meta.path}`}
          sourceFiles={[PATTERN_SOURCE[pattern], ...FOUNDATION_SOURCE]}
          sourceDir={DIR}
          extraToggle={{ label: 'Show anatomy', pressed: anatomy, onToggle: () => setAnatomy((a) => !a) }}
          extraRows={[
            {
              label: 'Pattern',
              content: (
                <div role="group" aria-label="Form pattern" className="flex flex-wrap gap-1.5">
                  {PATTERNS.map((p) => (
                    <button key={p.id} type="button" aria-pressed={p.id === pattern} onClick={() => setPattern(p.id)} className={`${CHIP} ${p.id === pattern ? CHIP_ON : CHIP_OFF}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              ),
            },
          ]}
          buildPreviewHref={({ state: s }) => `${FORMS_PREVIEW_PATH}?pattern=${pattern}&state=${s}`}
          renderScreen={({ state: s }) => <FormsScreen pattern={pattern} state={s} onPatternChange={setPattern} showAnatomy={anatomy} />}
        />
        <p className="mt-3 text-[13px] leading-[20px] text-[#353D4C]">
          <span className="font-semibold text-[#121722]">{meta.label}: </span>
          {meta.useWhen}
        </p>
        {anatomy && (
          <div className="mt-4 rounded-[12px] border border-[#DDE2EA] bg-white p-5">
            <FormAnatomyLegend />
          </div>
        )}
      </section>

      <section id="choosing" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Choosing a Pattern</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">Use the simplest pattern that fits the number of fields and how people work.</p>
        <div className={TABLE_WRAP}>
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                {['Pattern', 'Use when', 'Typical fields', 'Example'].map((h) => (
                  <th key={h} scope="col" className={TH}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {PATTERNS.map((p) => (
                <tr key={p.id} className="align-top">
                  <th scope="row" className="py-3 px-4 text-left font-medium text-[#121722] whitespace-nowrap">
                    {p.label}
                  </th>
                  <td className="py-3 px-4 text-[#353D4C] min-w-[260px]">{p.useWhen.replace('Use this when ', '').replace(/^./, (c) => c.toUpperCase())}</td>
                  <td className="py-3 px-4 text-[#353D4C] whitespace-nowrap">{p.typicalFields}</td>
                  <td className="py-3 px-4 text-[#4B5465] min-w-[200px]">{p.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="catalog" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Field Catalog</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">{FIELD_COUNT} fields, each with its states. Switch a card between Default, Filled, Error, Disabled and Read-only.</p>
        <FieldCatalog />
      </section>

      <section id="anatomy" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Layout Anatomy</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">
          Turn on <strong className="font-semibold text-[#121722]">Show anatomy</strong> in the showcase. The error summary (4) appears in Validation errors; the repeater (8) and section index (9) in
          the Sectioned pattern; the stepper (9) in Wizard and Bulk import.
        </p>
        <FormAnatomyLegend />
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
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {FORM_STATES.map((s) => (
                <tr key={s.id} className="align-top">
                  <th scope="row" className="py-3 px-4 text-left font-medium text-[#121722] whitespace-nowrap">
                    {s.label}
                  </th>
                  <td className="py-3 px-4 text-[#353D4C] min-w-[180px]">{s.trigger}</td>
                  <td className="py-3 px-4 text-[#4B5465] min-w-[260px]">{s.behaviour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="validation" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">Validation Rules</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VALIDATION.map((n) => (
            <li key={n.title} className="p-4 rounded-[12px] border border-[#DDE2EA] bg-white">
              <span className="block text-[14px] leading-[20px] font-semibold text-[#121722]">{n.title}</span>
              <span className="block mt-1 text-[13px] leading-[20px] text-[#4B5465]">{n.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">Specifications</h2>
        <SpecTable
          rows={[
            { property: 'Form Width', value: 'Max 720px; single column, pairs only for short related fields', token: 'max-w-[720px]' },
            { property: 'Section Card', value: 'White, 1px Gray 200, 12px radius, 24px padding', token: 'rounded-[12px] p-6' },
            { property: 'Field Gap', value: '16px between fields', token: 'space-y-4' },
            { property: 'Section Gap', value: '24px between sections', token: 'space-y-6' },
            { property: 'Input', value: '40px, label above (14px Medium), helper 12px below', token: 'h-10' },
            { property: 'Action Bar', value: 'Sticky bottom, 16px × 24px padding, elevation-2, 1px top border', token: 'py-4 px-6 shadow-[0_-4px_12px_…]' },
            { property: 'Drawer', value: '560px; full-screen sheet below 768px', token: 'w-[560px]' },
            { property: 'Modal', value: '480px for small creates', token: 'max-w-[480px]' },
            { property: 'Stepper', value: '24px circles, 12px Medium labels, 1px connectors', token: 'w-6 h-6' },
            { property: 'Highlight Flash', value: 'Royal Blue 8%, 600ms on new rows', token: 'FLASH_MS = 600' },
            { property: 'Autosave', value: '30 seconds after the last change', token: 'AUTOSAVE_MS = 30000' },
          ]}
        />
      </section>

      <section id="do-dont" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-2">Do &amp; Don&apos;t</h2>
        {(
          [
            ['Do mark optional fields, not required ones, when most fields are required', 'One note under the title explains the rule.', "Don't put asterisks on every field", 'A wall of asterisks is noise.', 'Alternate contact (optional)', 'Name * Email * Phone * City *'],
            ['Do use the simplest pattern that fits the number of fields', 'Three fields belong in a modal.', "Don't build a wizard for 5 fields", 'Extra steps add clicks, not clarity.', 'Add category — 3 fields, one modal', 'Step 1 of 4 · Step 2 of 4 · … (5 fields)'],
            ['Do show an error summary and keep the input after errors', 'Links take people straight to each field.', "Don't clear the form or show only a generic “Invalid input”", 'Retyping everything is the fastest way to lose people.', 'Fix 2 fields to continue: Email, PIN code', 'Invalid input.'],
            ['Do keep one Primary action in a sticky action bar', 'Always visible, always the same place.', "Don't put Save buttons at both the top and the bottom", 'Two Primaries compete and confuse.', '[Cancel] [Save as draft] [Create record]', '[Save] … [Save]'],
            ['Do warn about likely duplicates and let users decide', '“A similar record already exists” with View existing / Continue anyway.', "Don't silently block or silently create duplicates", 'Both erode trust in the data.', 'Similar: Sharma Logistics (REC-2026-0098)', 'Error 409'],
            ['Do confirm before discarding unsaved changes', '“Discard this new record?” with Keep editing.', "Don't lose data on navigation or Escape", 'One accidental key press shouldn’t cost ten minutes.', 'Discard this new record? [Keep editing] [Discard]', '(form closes, data gone)'],
          ] as const
        ).map(([doTitle, doDesc, dontTitle, dontDesc, good, bad]) => (
          <DoDontPair
            key={doTitle}
            doTitle={doTitle}
            doDescription={doDesc}
            doExample={<div className="w-[240px] rounded-[6px] bg-white border border-[#DDE2EA] p-3 text-[11px] leading-[16px] text-[#121722] text-center">{good}</div>}
            dontTitle={dontTitle}
            dontDescription={dontDesc}
            dontExample={<div className="w-[240px] rounded-[6px] bg-white border border-[#DDE2EA] p-3 text-[11px] leading-[16px] text-[#353D4C] text-center">{bad}</div>}
          />
        ))}
      </section>

      <section id="accessibility" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Accessibility</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">Built into the template above — keep these when you adapt it.</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACCESSIBILITY.map((n) => (
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
          {[
            'Sentence case for titles, labels and buttons.',
            'Labels are nouns ("PIN code"); buttons are verbs ("Create record", "Save as draft").',
            'Helper text explains the format before errors happen ("6 digits").',
            'No jargon: "Reference ID", not "Primary key".',
            'Specific errors that say how to fix it.',
          ].map((rule) => (
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
                ['Submit', 'Create record'],
                ['Pincode*', 'PIN code'],
                ['Invalid value', 'Enter a 6-digit PIN code'],
                ['Date (DD/MM/YYYY)', 'Start date — helper: For example, 30 Sep 2026'],
                ['Entity_Type', 'Entity type'],
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

export default FormsTemplatePage;
