import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { PreviewPanel, TabItem } from '../../components/common/PreviewPanel';
import { SpecTable } from '../../components/common/SpecTable';
import { DoDontPair } from '../../components/common/DoDont';
import { ShieldAlert, AlertTriangle, RefreshCw, CheckCircle2, Clock } from 'lucide-react';

export const BadgesStatusPage: React.FC = () => {
  const previewTabs: TabItem[] = [
    {
      id: 'badges-all',
      label: 'All Semantic Status Badges',
      component: (
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Live / Online / Present */}
          <span className="inline-flex items-center gap-1.5 h-[24px] px-2.5 rounded-full text-[12px] font-medium bg-[#00C6FF]/15 text-[#0B2D6B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C6FF] animate-pulse" />
            <span>Camera Online</span>
          </span>

          <span className="inline-flex items-center gap-1.5 h-[24px] px-2.5 rounded-full text-[12px] font-medium bg-[#00C6FF]/15 text-[#0B2D6B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C6FF]" />
            <span>Student Present</span>
          </span>

          {/* Info / Processing */}
          <span className="inline-flex items-center gap-1.5 h-[24px] px-2.5 rounded-full text-[12px] font-medium bg-[#1E63FF]/[0.08] text-[#1E63FF]">
            <Clock className="w-3 h-3 text-[#1E63FF]" />
            <span>Processing OCR</span>
          </span>

          {/* Critical: Deep Navy fill, White text, alert icon */}
          <span className="inline-flex items-center gap-1.5 h-[24px] px-2.5 rounded-full text-[12px] font-medium bg-[#0B2D6B] text-white shadow-sm">
            <ShieldAlert className="w-3 h-3 text-[#00C6FF]" />
            <span>Blacklisted Vehicle</span>
          </span>

          <span className="inline-flex items-center gap-1.5 h-[24px] px-2.5 rounded-full text-[12px] font-medium bg-[#0B2D6B] text-white shadow-sm">
            <AlertTriangle className="w-3 h-3 text-[#00C6FF]" />
            <span>Unauthorized Exit</span>
          </span>

          {/* Neutral / Inactive */}
          <span className="inline-flex items-center gap-1.5 h-[24px] px-2.5 rounded-full text-[12px] font-medium bg-[#EEF1F6] text-[#353D4C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C95A6]" />
            <span>Offline</span>
          </span>
        </div>
      ),
      code: `// Live / Online / Present (Cyan 16% fill, Deep Navy text, Cyan dot)
<span className="inline-flex items-center gap-1.5 h-[24px] px-2.5 rounded-full text-[12px] font-medium bg-[#00C6FF]/15 text-[#0B2D6B]">
  <span className="w-1.5 h-1.5 rounded-full bg-[#00C6FF] animate-pulse" />
  <span>Camera Online</span>
</span>

// Critical Alert (Deep Navy fill, White text, Alert icon)
<span className="inline-flex items-center gap-1.5 h-[24px] px-2.5 rounded-full text-[12px] font-medium bg-[#0B2D6B] text-white">
  <ShieldAlert className="w-3 h-3 text-[#00C6FF]" />
  <span>Blacklisted Vehicle</span>
</span>`,
    },
  ];

  return (
    <div>
      <PageHeader
        category="COMPONENTS"
        title="Badges & Status"
        description="24px high pill badges with 8px horizontal padding, 12px Medium typography, and mandatory companion icons or status dots."
      />

      <section id="preview" className="mb-12">
        <PreviewPanel tabs={previewTabs} />
      </section>

      {/* Specifications */}
      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Badge Specifications
        </h2>
        <SpecTable
          rows={[
            { property: 'Height', value: '24px fixed pill', token: 'h-[24px]' },
            { property: 'Border Radius', value: '999px (full radius)', token: 'rounded-full' },
            { property: 'Padding', value: '8px to 10px horizontal padding', token: 'px-2.5' },
            { property: 'Typography', value: '12px Medium (#0B2D6B or #FFFFFF or #1E63FF)', token: 'text-[12px] font-medium' },
            { property: 'Color Blind Accessibility', value: 'Mandatory accompanying icon or pulsing geometric dot', token: 'icon + text' },
          ]}
        />
      </section>

      {/* Do & Don't Guidelines */}
      <section id="do-dont">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Badge Usage Rules
        </h2>
        <DoDontPair
          doTitle="Do always pair status color with explicit text and an icon"
          doDescription="Ensures compliance with WCAG 2.2 AA non-color signaling: color is never the sole communicator of security status."
          doExample={
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#0B2D6B] text-white">
              <ShieldAlert className="w-3 h-3 text-[#00C6FF]" />
              <span>Blacklisted</span>
            </span>
          }
          dontTitle="Don't use a naked colored circle without a text label"
          dontDescription="A single red or green dot without hover text forces operators to guess system state."
          dontExample={
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
          }
        />
      </section>
    </div>
  );
};
