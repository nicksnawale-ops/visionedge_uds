import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { PreviewPanel, TabItem } from '../../components/common/PreviewPanel';
import { SpecTable } from '../../components/common/SpecTable';
import { DoDontPair } from '../../components/common/DoDont';
import { ArrowRight, ExternalLink } from 'lucide-react';

export const LinksPage: React.FC = () => {
  const previewTabs: TabItem[] = [
    {
      id: 'inline',
      label: 'Inline Link',
      component: (
        <p className="text-[14px] text-[#353D4C] max-w-lg leading-relaxed text-center">
          For full gate calibration logs, refer to the{' '}
          <a
            href="#inline"
            className="text-[#1E63FF] underline hover:text-[#0B2D6B] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
          >
            ANPR Hardware Documentation
          </a>{' '}
          or contact the on-duty facility engineer.
        </p>
      ),
      code: `<p className="text-[14px] text-[#353D4C]">
  Refer to the{" "}
  <a
    href="/docs/anpr"
    className="text-[#1E63FF] underline hover:text-[#0B2D6B] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
  >
    ANPR Hardware Documentation
  </a>
</p>`,
    },
    {
      id: 'standalone',
      label: 'Standalone Link',
      component: (
        <div className="flex flex-col items-center gap-3">
          <a
            href="#standalone"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1E63FF] hover:underline hover:text-[#0B2D6B] transition-colors group"
          >
            <span>View all security incident logs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      ),
      code: `<a
  href="/security/incidents"
  className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1E63FF] hover:underline hover:text-[#0B2D6B] transition-colors group"
>
  <span>View all security incident logs</span>
  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
</a>`,
    },
    {
      id: 'external',
      label: 'External Link',
      component: (
        <a
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1E63FF] underline hover:text-[#0B2D6B] transition-colors"
        >
          <span>MoRTH National Vehicle Registry</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#6B7485]" />
        </a>
      ),
      code: `<a
  href="https://vahan.parivahan.gov.in"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1E63FF] underline hover:text-[#0B2D6B]"
>
  <span>MoRTH National Vehicle Registry</span>
  <ExternalLink className="w-3.5 h-3.5 text-[#6B7485]" />
</a>`,
    },
    {
      id: 'on-dark',
      label: 'On Dark',
      component: (
        <div className="p-6 rounded-[8px] bg-[#0B2D6B] text-center w-full max-w-md">
          <span className="text-[13px] text-white/80 block mb-2">Gate Console Offline</span>
          <a
            href="#on-dark"
            className="text-[14px] text-[#00C6FF] underline hover:text-white font-medium transition-colors"
          >
            Run manual diagnostic scan &rarr;
          </a>
        </div>
      ),
      code: `// On Dark: Cyan text with underline, hover transitions to pure White
<a
  href="/diagnostics"
  className="text-[14px] text-[#00C6FF] underline hover:text-white font-medium transition-colors"
>
  Run manual diagnostic scan &rarr;
</a>`,
    },
  ];

  return (
    <div>
      <PageHeader
        category="COMPONENTS"
        title="Links"
        description="Links navigate between routes or external portals, whereas buttons perform mutating actions. Links must always feature clear affordance, underline rules, and accessible focus outlines."
      />

      <section id="preview" className="mb-12">
        <PreviewPanel tabs={previewTabs} />
      </section>

      {/* Specifications */}
      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Link Specifications
        </h2>
        <SpecTable
          rows={[
            { property: 'Inline Links', value: 'Royal Blue (#1E63FF) with permanent underline', token: 'text-[#1E63FF] underline' },
            { property: 'Inline Hover', value: 'Deep Navy (#0B2D6B)', token: 'hover:text-[#0B2D6B]' },
            { property: 'Standalone Links', value: 'No underline at rest, underlined on hover', token: 'no-underline hover:underline' },
            { property: 'External Icon', value: '12px–14px ExternalLink icon in Gray 500', token: 'w-3.5 h-3.5 text-[#6B7485]' },
            { property: 'On Dark', value: 'Cyan (#00C6FF) underlined, hover White', token: 'text-[#00C6FF] hover:text-white' },
            { property: 'Focus Visible', value: '2px outline, 2px offset', token: 'focus-visible:ring-2 focus-visible:ring-offset-2' },
          ]}
        />
      </section>

      {/* Do & Don't Guidelines */}
      <section id="do-dont">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Link Guidelines
        </h2>
        <DoDontPair
          doTitle="Do use descriptive link labels"
          doDescription="Ensure screen-reader operators immediately understand the destination: 'Download 2026 ANPR compliance guidelines'."
          doExample={
            <a href="#do" className="text-[#1E63FF] underline text-[14px]">
              Download 2026 ANPR compliance guidelines
            </a>
          }
          dontTitle="Don't use 'click here' or naked raw URLs"
          dontDescription="'Click here' lacks semantic context and violates WCAG 2.2 AA non-text destination accessibility."
          dontExample={
            <span className="text-[14px]">
              To see reports,{' '}
              <a href="#dont" className="text-[#1E63FF] underline">
                click here
              </a>
            </span>
          }
        />
      </section>
    </div>
  );
};
