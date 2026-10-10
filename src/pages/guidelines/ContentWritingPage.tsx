import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SpecTable } from '../../components/common/SpecTable';
import { DoDontPair } from '../../components/common/DoDont';
import { FileEdit, Check, X } from 'lucide-react';

export const ContentWritingPage: React.FC = () => {
  const writingRules = [
    {
      context: 'Error Messaging',
      bad: 'Invalid input. Error 4021 occurred.',
      good: 'Enter a 10-digit mobile number starting with 6, 7, 8, or 9.',
      reason: 'State the exact fix rather than opaque diagnostic codes.',
    },
    {
      context: 'Action Buttons',
      bad: 'Click Here to Submit Information',
      good: 'Register vehicle permit',
      reason: 'Use 1–3 word verb-first labels stating the precise outcome.',
    },
    {
      context: 'Empty States',
      bad: 'No Data Found in Database.',
      good: 'No vehicles recorded today. New entries will appear automatically as cameras detect incoming traffic.',
      reason: 'Explain why the view is blank and what will cause content to appear.',
    },
    {
      context: 'Dialog Confirmations',
      bad: 'Are you sure? [OK] [Cancel]',
      good: 'Delete vehicle record permanently? [Cancel] [Delete record]',
      reason: 'Repeat the destructive verb in the confirmation button to prevent accidental clicks.',
    },
    {
      context: 'Date & Time Logs',
      bad: '09/30/26, 2:05pm',
      good: '30 Sep 2026 at 14:05:32 UTC',
      reason: 'Use 3-letter month to prevent DD/MM confusion and 24h military clock for telemetry logs.',
    },
  ];

  return (
    <div>
      <PageHeader
        category="GUIDELINES"
        title="Content & Writing"
        description="VisionEdge editorial standards: sentence case headings, outcome-focused verb actions, constructive error guidance, and unambiguous date-time phrasing."
      />

      {/* Before / After Content Guidance Table */}
      <section id="before-after" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Before &amp; After Phrasing Benchmarks
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Replace developer placeholders and ambiguous system slang with clear operator prose.
          </p>
        </div>

        <div className="overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  Scenario
                </th>
                <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  Avoid (Ambiguous / Robotic)
                </th>
                <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  Prescribed (VisionEdge Standard)
                </th>
                <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  Rationale
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {writingRules.map((rule, idx) => (
                <tr key={idx} className="hover:bg-[#F7F9FC]">
                  <td className="py-3 px-4 font-semibold text-[#121722] whitespace-nowrap">
                    {rule.context}
                  </td>
                  <td className="py-3 px-4 text-[#DC2626]">
                    <div className="flex items-center gap-1.5">
                      <X className="w-3.5 h-3.5 shrink-0" />
                      <span>{rule.bad}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#0B2D6B] font-medium">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#00C6FF] shrink-0" />
                      <span>{rule.good}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[13px] text-[#4B5465]">
                    {rule.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Do & Don't Guidelines */}
      <section id="do-dont">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Writing Guidelines
        </h2>
        <DoDontPair
          doTitle="Do use Sentence Case for all titles, labels, and table headers"
          doDescription="Sentence case matches natural human reading rhythm and keeps interfaces feeling calm and modern."
          doExample={
            <h4 className="text-[15px] font-semibold text-[#121722]">
              Assigned gate access permissions
            </h4>
          }
          dontTitle="Don't use Title Case or full Uppercase shouting"
          dontDescription="Capitalizing every word slows reading speed by 15% and feels outdated."
          dontExample={
            <h4 className="text-[15px] font-semibold text-[#121722]">
              Assigned Gate Access Permissions
            </h4>
          }
        />
      </section>
    </div>
  );
};
