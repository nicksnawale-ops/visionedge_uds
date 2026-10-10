import React from 'react';
import { Check, X } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { SpecTable } from '../../../components/common/SpecTable';
import { TabsPlayground } from './TabsPlayground';
import { AnatomyDiagram } from './AnatomyDiagram';
import { TypeExamples } from './examples/TypeExamples';
import { SizeExamples } from './examples/SizeExamples';
import { StateMatrix } from './examples/StateMatrix';
import { BehaviorDemos } from './examples/BehaviorDemos';
import { DoDontVisuals } from './examples/DoDontVisuals';
import { ACCESSIBILITY, CHOOSING, CONTENT_RULES, CONTENT_TABLE, NOT_TABS, SPEC_ROWS } from './tabsSpec';

const H2 = 'text-[20px] leading-[28px] font-semibold text-[#121722] mb-1 scroll-mt-24';
const LEAD = 'text-[14px] leading-[20px] text-[#4B5465] mb-5 max-w-2xl';
const TH = 'py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left';
const TABLE_WRAP = 'overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]';

const Section: React.FC<{ id: string; title: string; lead?: string; children: React.ReactNode }> = ({ id, title, lead, children }) => (
  <section id={id} aria-labelledby={`${id}-h`} className="mb-14 scroll-mt-24">
    <h2 id={`${id}-h`} className={H2}>
      {title}
    </h2>
    {lead ? <p className={LEAD}>{lead}</p> : <div className="mb-5" />}
    {children}
  </section>
);

/** Components / Tabs */
export const TabsPage: React.FC = () => (
  <div>
    <PageHeader
      category="COMPONENTS"
      title="Tabs"
      description="Switch between related views of the same content without leaving the page. Choose the tab type by context, not by preference."
    />

    <Section id="showcase" title="Tab Showcase" lead="Try every type and option. The preview and the code update together.">
      <TabsPlayground />
    </Section>

    <Section id="types" title="Tab Types" lead="Eleven types for different contexts. Each preview is live: click, use the keyboard, and switch to Code to copy it.">
      <TypeExamples />
    </Section>

    <Section id="sizes" title="Sizes" lead="Small 32px, Medium 40px (default) and Large 48px. Use one size per tab bar and match neighbouring controls.">
      <SizeExamples />
    </Section>

    <Section id="anatomy" title="Anatomy">
      <AnatomyDiagram />
    </Section>

    <Section id="states" title="States" lead="Default, hover, focus, active and disabled for every type. Focus rings appear on keyboard focus only.">
      <StateMatrix />
    </Section>

    <Section id="behavior" title="Behavior" lead="Keyboard support, activation, URL sync, persistence, unsaved changes and motion.">
      <BehaviorDemos />
    </Section>

    <Section id="choosing" title="Choosing the Right Tab" lead="Pick the type by the situation. If none of these fit, it may not be a tab at all.">
      <div className={TABLE_WRAP}>
        <table className="w-full min-w-[620px] border-collapse text-[14px]">
          <caption className="sr-only">Which tab type to use</caption>
          <thead>
            <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
              <th scope="col" className={TH}>
                Situation
              </th>
              <th scope="col" className={TH}>
                Use
              </th>
              <th scope="col" className={TH}>
                Avoid
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE2EA]">
            {CHOOSING.map(([situation, use, avoid]) => (
              <tr key={situation}>
                <th scope="row" className="py-3 px-4 text-left font-normal text-[#353D4C]">
                  {situation}
                </th>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#121722]">
                    <Check className="w-4 h-4 text-[#1E63FF] shrink-0" aria-hidden="true" />
                    {use}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 text-[#4B5465]">
                    <X className="w-4 h-4 text-[#6B7485] shrink-0" aria-hidden="true" />
                    {avoid}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-8 mb-3 text-[16px] font-semibold text-[#121722]">Not tabs</h3>
      <div className={TABLE_WRAP}>
        <table className="w-full min-w-[420px] border-collapse text-[14px]">
          <caption className="sr-only">When to use something other than tabs</caption>
          <thead>
            <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
              <th scope="col" className={TH}>
                If you need
              </th>
              <th scope="col" className={TH}>
                Use instead
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE2EA]">
            {NOT_TABS.map(([need, use]) => (
              <tr key={need}>
                <th scope="row" className="py-3 px-4 text-left font-normal text-[#353D4C]">
                  {need}
                </th>
                <td className="py-3 px-4 font-medium text-[#121722]">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>

    <Section id="specs" title="Specifications">
      <SpecTable rows={SPEC_ROWS} />
    </Section>

    <Section id="do-dont" title="Do & Don’t">
      <DoDontVisuals />
    </Section>

    <Section id="accessibility" title="Accessibility" lead="Tabs follow the WAI-ARIA tabs pattern. All examples on this page implement it.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACCESSIBILITY.map((a) => (
          <div key={a.title} className="rounded-[12px] border border-[#DDE2EA] bg-white p-5">
            <h3 className="text-[14px] font-semibold text-[#121722]">{a.title}</h3>
            <p className="mt-1 text-[14px] leading-[20px] text-[#4B5465]">{a.text}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section id="content" title="Content">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ul className="space-y-2.5">
          {CONTENT_RULES.map((r) => (
            <li key={r} className="flex items-start gap-2.5 text-[14px] leading-[20px] text-[#353D4C]">
              <Check className="w-4 h-4 mt-0.5 text-[#1E63FF] shrink-0" aria-hidden="true" />
              {r}
            </li>
          ))}
        </ul>
        <div className={TABLE_WRAP}>
          <table className="w-full border-collapse text-[14px]">
            <caption className="sr-only">Tab label examples</caption>
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                <th scope="col" className={TH}>
                  Instead of
                </th>
                <th scope="col" className={TH}>
                  Write
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {CONTENT_TABLE.map(([bad, good]) => (
                <tr key={bad}>
                  <td className="py-3 px-4 text-[#4B5465]">{bad}</td>
                  <td className="py-3 px-4 font-medium text-[#121722]">{good}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  </div>
);
