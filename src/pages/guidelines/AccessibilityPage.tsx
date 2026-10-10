import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SpecTable } from '../../components/common/SpecTable';
import { DoDontPair } from '../../components/common/DoDont';
import { Check, X, ShieldCheck, Keyboard, ZoomIn, Eye, Sparkles } from 'lucide-react';

export const AccessibilityPage: React.FC = () => {
  const contrastPairs = [
    { fg: '#FFFFFF', bg: '#0B2D6B', fgName: 'White', bgName: 'Deep Navy', ratio: '13.1:1', status: 'pass', level: 'AAA (Super Pass)' },
    { fg: '#353D4C', bg: '#FFFFFF', fgName: 'Gray 700 (Body)', bgName: 'White', ratio: '10.9:1', status: 'pass', level: 'AAA Pass' },
    { fg: '#0B2D6B', bg: '#00C6FF', fgName: 'Deep Navy', bgName: 'Cyan', ratio: '6.6:1', status: 'pass', level: 'AA / AAA Pass' },
    { fg: '#FFFFFF', bg: '#1E63FF', fgName: 'White', bgName: 'Royal Blue', ratio: '4.9:1', status: 'pass', level: 'AA Pass' },
    { fg: '#1E63FF', bg: '#FFFFFF', fgName: 'Royal Blue', bgName: 'White', ratio: '4.9:1', status: 'pass', level: 'AA Pass' },
    { fg: '#6B7485', bg: '#FFFFFF', fgName: 'Gray 500 (Caption)', bgName: 'White', ratio: '4.7:1', status: 'pass', level: 'AA Pass (Lightest Readable Text)' },
    { fg: '#8C95A6', bg: '#FFFFFF', fgName: 'Gray 400 (Border)', bgName: 'White', ratio: '3.0:1', status: 'pass', level: 'AA Graphical Element Pass (3:1)' },
    { fg: '#1E63FF', bg: '#0B2D6B', fgName: 'Royal Blue', bgName: 'Deep Navy', ratio: '2.7:1', status: 'fail', level: 'FAIL (Forbidden pairing)' },
    { fg: '#00C6FF', bg: '#FFFFFF', fgName: 'Cyan', bgName: 'White', ratio: '2.0:1', status: 'fail', level: 'FAIL (Forbidden for text on white)' },
  ];

  return (
    <div>
      <PageHeader
        category="GUIDELINES"
        title="Accessibility (WCAG 2.2 AA)"
        description="VisionEdge is engineered for mission-critical operations. Every visual and interactive standard guarantees compliance with WCAG 2.2 AA accessibility requirements."
      />

      {/* Verified Contrast Ratio Proof Table */}
      <section id="contrast-table" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            System Contrast Ratio Matrix
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Verified mathematical luminance ratios across approved foreground and background pairings.
          </p>
        </div>

        <div className="overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  Color Pair
                </th>
                <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  Visual Swatch Preview
                </th>
                <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  Contrast Ratio
                </th>
                <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  Compliance Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {contrastPairs.map((pair, idx) => (
                <tr key={idx} className="hover:bg-[#F7F9FC]">
                  <td className="py-3 px-4 font-medium text-[#121722] whitespace-nowrap">
                    {pair.fgName} on {pair.bgName}
                  </td>
                  <td className="py-3 px-4">
                    <div
                      className="px-3 py-1 rounded-[6px] border border-[#DDE2EA] inline-flex items-center text-[13px] font-medium"
                      style={{ backgroundColor: pair.bg, color: pair.fg }}
                    >
                      Sample Text
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#121722]">
                    {pair.ratio}
                  </td>
                  <td className="py-3 px-4">
                    {pair.status === 'pass' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#00C6FF]/15 text-[#0B2D6B]">
                        <Check className="w-3.5 h-3.5" />
                        <span>{pair.level}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#121722]/10 text-[#121722]">
                        <X className="w-3.5 h-3.5" />
                        <span>{pair.level}</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Six Pillars of VisionEdge Accessibility */}
      <section id="pillars" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Core Accessibility Tenets
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Engineering mandates enforced in all UI pull requests before staging deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-[12px] border border-[#DDE2EA] bg-white shadow-sm">
            <div className="w-8 h-8 rounded-[6px] bg-[#EEF1F6] flex items-center justify-center text-[#1E63FF] mb-3">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-[15px] font-semibold text-[#121722] mb-1">
              1. Never Color Alone
            </h3>
            <p className="text-[13px] text-[#4B5465] leading-relaxed">
              Every status pill, metric indicator, and error validation must combine color with a distinct icon and clear text label for deuteranopia and protanopia accessibility.
            </p>
          </div>

          <div className="p-5 rounded-[12px] border border-[#DDE2EA] bg-white shadow-sm">
            <div className="w-8 h-8 rounded-[6px] bg-[#EEF1F6] flex items-center justify-center text-[#1E63FF] mb-3">
              <Keyboard className="w-4 h-4" />
            </div>
            <h3 className="text-[15px] font-semibold text-[#121722] mb-1">
              2. Full Keyboard Navigation
            </h3>
            <p className="text-[13px] text-[#4B5465] leading-relaxed">
              All clickable affordances feature persistent 2px focus outlines with 2px offsets. Logical tab order is strictly maintained across table rows, drawers, and modal dialogs.
            </p>
          </div>

          <div className="p-5 rounded-[12px] border border-[#DDE2EA] bg-white shadow-sm">
            <div className="w-8 h-8 rounded-[6px] bg-[#EEF1F6] flex items-center justify-center text-[#1E63FF] mb-3">
              <ZoomIn className="w-4 h-4" />
            </div>
            <h3 className="text-[15px] font-semibold text-[#121722] mb-1">
              3. 200% Zoom Resiliency
            </h3>
            <p className="text-[13px] text-[#4B5465] leading-relaxed">
              Text size and containers are built with responsive flexbox and clamp bounds. Content never clips or collapses into horizontal scroll locks at 200% browser zoom.
            </p>
          </div>
        </div>
      </section>

      {/* Do & Don't Guidelines */}
      <section id="do-dont">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Accessibility Rules
        </h2>
        <DoDontPair
          doTitle="Do preserve prominent focus-visible rings"
          doDescription="Allow keyboard power operators to scan through complex forms with immediate visual feedback."
          doExample={
            <button className="px-4 py-2 bg-[#1E63FF] text-white text-[13px] font-semibold rounded-[6px] ring-2 ring-[#1E63FF] ring-offset-2">
              Focused Action Button
            </button>
          }
          dontTitle="Don't strip outline-none without providing an alternative focus ring"
          dontDescription="Suppressing focus outlines leaves keyboard and screen reader operators completely stranded."
          dontExample={
            <button className="px-4 py-2 bg-[#1E63FF] text-white text-[13px] font-semibold rounded-[6px] outline-none">
              Hidden Focus Ring (Broken)
            </button>
          }
        />
      </section>
    </div>
  );
};
