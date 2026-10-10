import React from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { SpecTable } from '../../../components/common/SpecTable';
import { AnatomyDiagram } from './AnatomyDiagram';
import { PickerShowcase } from './examples/PickerShowcase';
import { PickerTypes } from './examples/PickerTypes';
import { StateMatrix } from './examples/StateMatrix';
import { FormatsTimeZone } from './examples/FormatsTimeZone';
import { ChoosingTable } from './examples/ChoosingTable';
import { DoDontVisuals } from './examples/DoDontVisuals';
import { AccessibilityNotes } from './examples/AccessibilityNotes';
import { SPEC_ROWS } from './pickersSpec';

const H2 = 'text-[20px] leading-[28px] font-semibold text-[#121722] mb-1 scroll-mt-24';
const LEAD = 'text-[14px] leading-[20px] text-[#4B5465] mb-5 max-w-2xl';

const Section: React.FC<{ id: string; title: string; lead?: string; children: React.ReactNode }> = ({ id, title, lead, children }) => (
  <section id={id} aria-labelledby={`${id}-h`} className="mb-14 scroll-mt-24">
    <h2 id={`${id}-h`} className={H2}>
      {title}
    </h2>
    {lead ? <p className={LEAD}>{lead}</p> : <div className="mb-5" />}
    {children}
  </section>
);

/** Components / Date & Time Pickers. Demo "today" is fixed to 30 Sep 2026 (see utils/dateMath.ts). */
export const DatePickersPage: React.FC = () => (
  <div>
    <PageHeader
      category="COMPONENTS"
      title="Date & Time Pickers"
      description="Pick dates, ranges and times consistently across VisionEdge. Use the simplest picker that fits the task."
    />

    <Section id="showcase" title="Picker Showcase" lead="Switch between the six picker types. Every preview is live: type, click or use the keyboard, then switch to Code to copy it.">
      <PickerShowcase />
    </Section>

    <Section id="types" title="Picker Types" lead="Six pickers cover every VisionEdge screen. Each example uses real product labels.">
      <PickerTypes />
    </Section>

    <Section id="anatomy" title="Calendar Anatomy" lead="One calendar, shared by every picker. Shown here inside the date range popover.">
      <AnatomyDiagram />
    </Section>

    <Section id="states" title="States" lead="Field and popover states. Focus rings appear on keyboard focus only.">
      <StateMatrix />
    </Section>

    <Section id="formats" title="Formats & Time Zone" lead="One display format everywhere, typed entry in DD/MM/YYYY and HH:MM, and IST on every time.">
      <FormatsTimeZone />
    </Section>

    <Section id="choosing" title="Choosing a Picker" lead="Start from the user's need. If a fixed period is enough, you don't need a picker at all.">
      <ChoosingTable />
    </Section>

    <Section id="specs" title="Specifications">
      <SpecTable rows={SPEC_ROWS} />
    </Section>

    <Section id="do-dont" title="Do & Don’t">
      <DoDontVisuals />
    </Section>

    <Section id="accessibility" title="Accessibility" lead="Implemented in every picker on this page. Try them with the keyboard only.">
      <AccessibilityNotes />
    </Section>
  </div>
);
