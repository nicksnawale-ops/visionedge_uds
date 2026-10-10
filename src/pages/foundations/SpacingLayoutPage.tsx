import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SPACING_TOKENS, RADIUS_TOKENS, SHADOW_TOKENS } from '../../theme/tokens';
import { SpecTable } from '../../components/common/SpecTable';
import { DoDontPair } from '../../components/common/DoDont';
import { LayoutGrid, Eye, Check } from 'lucide-react';

export const SpacingLayoutPage: React.FC = () => {
  const [showGridOverlay, setShowGridOverlay] = useState(false);

  return (
    <div>
      <PageHeader
        category="FOUNDATIONS"
        title="Spacing & Layout"
        description="The mathematical spatial structure of VisionEdge. Built on a strict 4px grid with responsive column allocations, uniform border-radii, and Deep Navy-tinted elevation levels."
      />

      {/* 4px Base Spacing Visual Ruler */}
      <section id="spacing-ruler" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            4px Base Spatial Scale
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Every margin, padding, and gap in VisionEdge is an exact multiple of 4px.
          </p>
        </div>

        <div className="rounded-[12px] border border-[#DDE2EA] bg-white p-6 shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          <div className="space-y-4">
            {SPACING_TOKENS.map((token) => (
              <div
                key={token.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDE2EA] last:border-b-0"
              >
                <div className="w-48 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[14px] font-semibold text-[#121722]">
                      {token.name}
                    </span>
                    <span className="text-[12px] font-mono text-[#6B7485]">
                      ({token.value})
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8C95A6] mt-0.5">{token.use}</div>
                </div>

                {/* Royal Blue Bar Visual representation */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="h-6 bg-[#F7F9FC] border border-[#DDE2EA] rounded flex items-center px-1 flex-1">
                    <div
                      className="h-4 bg-[#1E63FF] rounded-[2px] transition-all"
                      style={{ width: token.value }}
                      title={`${token.name}: ${token.value}`}
                    />
                  </div>
                  <code className="text-[12px] font-mono text-[#1E63FF] w-28 shrink-0 text-right">
                    {token.variable}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive Grid System & Interactive Overlay */}
      <section id="grid-system" className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
              Responsive Grid System
            </h2>
            <p className="text-[14px] text-[#4B5465]">
              Fluid container with fixed column breakpoints and gutter widths.
            </p>
          </div>

          {/* Interactive grid overlay toggle button */}
          <button
            onClick={() => setShowGridOverlay(!showGridOverlay)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-[13px] font-semibold transition-all border ${
              showGridOverlay
                ? 'bg-[#1E63FF] text-white border-[#1E63FF] shadow-sm'
                : 'bg-white text-[#1E63FF] border-[#1E63FF] hover:bg-[#F7F9FC]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{showGridOverlay ? 'Hide 12-Col Grid Overlay' : 'Show 12-Col Grid Overlay'}</span>
          </button>
        </div>

        {/* Live Grid Canvas Preview with optional overlay */}
        <div className="rounded-[12px] border border-[#DDE2EA] bg-[#F7F9FC] p-6 mb-6 relative overflow-hidden">
          {showGridOverlay && (
            <div className="absolute inset-0 pointer-events-none grid grid-cols-12 gap-3 px-6 py-6 z-10">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1E63FF]/[0.08] border border-[#1E63FF]/20 rounded h-full flex items-center justify-center text-[10px] font-mono text-[#1E63FF] font-semibold"
                >
                  Col {i + 1}
                </div>
              ))}
            </div>
          )}

          <div className="relative z-0 space-y-4">
            <div className="p-4 bg-white rounded-[12px] border border-[#DDE2EA] shadow-sm text-center">
              <span className="text-[13px] font-medium text-[#121722]">
                Fluid Content Area (12 Columns · 24px Gutters · Max Width 1040px / 1440px Canvas)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Telemetry Card', 'Gate Monitor', 'Occupancy KPI', 'Recent Alerts'].map((title, i) => (
                <div key={i} className="p-4 bg-white rounded-[8px] border border-[#DDE2EA] text-center">
                  <span className="text-[12px] text-[#4B5465]">{title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Breakpoints Table */}
        <SpecTable
          caption="Grid Breakpoint Specifications"
          rows={[
            { property: 'Desktop (≥1280px)', value: '12 Columns · 24px Gutter · 32px Margin', token: 'grid-cols-12 gap-6', notes: 'Sidebar expanded (240px) + Right TOC panel visible' },
            { property: 'Tablet (768px – 1279px)', value: '8 Columns · 20px Gutter · 24px Margin', token: 'grid-cols-8 gap-5', notes: 'Sidebar automatically collapses to 72px icon-only rail' },
            { property: 'Mobile (<768px)', value: '4 Columns · 16px Gutter · 16px Margin', token: 'grid-cols-4 gap-4', notes: 'Sidebar transitions to off-canvas modal drawer over 50% scrim' },
            { property: 'Top Bar Height', value: '64px fixed', token: 'h-[64px]', notes: 'Sticky at viewport top, 1px bottom border #DDE2EA' },
            { property: 'Content Max Width', value: '1040px reading width / 1440px wide viewport', token: 'max-w-[1040px]', notes: 'Prevents excessive measure for optimal operator legibility' },
          ]}
        />
      </section>

      {/* Radius System */}
      <section id="radius-tokens" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Border Radius Scale
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Strict geometric curve tokens enforcing mathematical containment between inner and outer elements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {RADIUS_TOKENS.map((token) => (
            <div
              key={token.name}
              className="p-5 rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)] flex flex-col items-center text-center justify-between"
            >
              <div
                className="w-16 h-16 bg-[#EEF1F6] border-2 border-[#1E63FF] flex items-center justify-center mb-4 transition-all"
                style={{ borderRadius: token.value }}
              >
                <span className="font-mono text-[11px] font-bold text-[#1E63FF]">
                  {token.value}
                </span>
              </div>
              <div>
                <span className="text-[14px] font-semibold text-[#121722] block">
                  {token.name}
                </span>
                <span className="text-[12px] font-mono text-[#1E63FF] block mt-0.5">
                  {token.variable}
                </span>
                <p className="text-[11px] text-[#4B5465] mt-2 leading-snug">
                  {token.use}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Elevation (Deep Navy-tinted) */}
      <section id="elevation-tokens" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Elevation &amp; Shadows
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Every shadow is tinted with Deep Navy (<code className="font-mono text-[#0B2D6B]">rgba(11,45,107, ...)</code>) to preserve cool crisp harmony without muddy gray halos.
          </p>
        </div>

        <div className="p-8 rounded-[12px] border border-[#DDE2EA] bg-[#F7F9FC] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Elevation 0 */}
          <div className="p-5 rounded-[12px] bg-white border border-[#DDE2EA] flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="text-[11px] font-mono font-medium text-[#6B7485] uppercase tracking-wider block">
                ELEVATION 0
              </span>
              <h4 className="text-[16px] font-semibold text-[#121722] mt-1">
                Flat Surface
              </h4>
            </div>
            <div className="text-[12px] text-[#4B5465] mt-4">
              Flat border only. Standard card panels and resting data tables.
            </div>
            <code className="text-[11px] font-mono text-[#6B7485] mt-2">
              border 1px #DDE2EA
            </code>
          </div>

          {/* Elevation 1 */}
          <div className="p-5 rounded-[12px] bg-white border border-[#DDE2EA] shadow-[0_1px_3px_rgba(11,45,107,0.08)] flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="text-[11px] font-mono font-medium text-[#1E63FF] uppercase tracking-wider block">
                ELEVATION 1
              </span>
              <h4 className="text-[16px] font-semibold text-[#121722] mt-1">
                Subtle Lift
              </h4>
            </div>
            <div className="text-[12px] text-[#4B5465] mt-4">
              Interactive card hover, sticky header bar, and table header separation.
            </div>
            <code className="text-[11px] font-mono text-[#6B7485] mt-2">
              --ve-shadow-1
            </code>
          </div>

          {/* Elevation 2 */}
          <div className="p-5 rounded-[12px] bg-white border border-[#DDE2EA] shadow-[0_4px_12px_rgba(11,45,107,0.12)] flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="text-[11px] font-mono font-medium text-[#1E63FF] uppercase tracking-wider block">
                ELEVATION 2
              </span>
              <h4 className="text-[16px] font-semibold text-[#121722] mt-1">
                Floating Popover
              </h4>
            </div>
            <div className="text-[12px] text-[#4B5465] mt-4">
              Dropdown menus, datepicker flyouts, system tooltips, and toasts.
            </div>
            <code className="text-[11px] font-mono text-[#6B7485] mt-2">
              --ve-shadow-2
            </code>
          </div>

          {/* Elevation 3 */}
          <div className="p-5 rounded-[12px] bg-white border border-[#DDE2EA] shadow-[0_12px_32px_rgba(11,45,107,0.18)] flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="text-[11px] font-mono font-medium text-[#1E63FF] uppercase tracking-wider block">
                ELEVATION 3
              </span>
              <h4 className="text-[16px] font-semibold text-[#121722] mt-1">
                Modal &amp; Drawer
              </h4>
            </div>
            <div className="text-[12px] text-[#4B5465] mt-4">
              Full-screen modal dialogs, slide-over command palette, and critical sheets.
            </div>
            <code className="text-[11px] font-mono text-[#6B7485] mt-2">
              --ve-shadow-3
            </code>
          </div>
        </div>
      </section>

      {/* Do & Don't Guidelines */}
      <section id="do-dont">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Spatial &amp; Radius Rules
        </h2>
        <DoDontPair
          doTitle="Do respect nested radius math: r_inner = r_outer - padding"
          doDescription="When placing a button or pill inside a card with padding, ensure the inner radius mathematically aligns to avoid awkward optical collisions."
          doExample={
            <div className="p-3 bg-white border border-[#DDE2EA] rounded-[12px]">
              <div className="p-2 bg-[#F7F9FC] rounded-[8px] border border-[#DDE2EA] text-[12px] text-center">
                r_inner 8px = r_outer 12px - 4px
              </div>
            </div>
          }
          dontTitle="Don't use arbitrary border-radius without matching container geometry"
          dontDescription="Using fully rounded pills (999px) inside sharp 4px square containers creates mismatched visual tension."
          dontExample={
            <div className="p-3 bg-white border border-[#DDE2EA] rounded-[4px]">
              <div className="p-2 bg-[#F7F9FC] rounded-[999px] border border-[#DDE2EA] text-[12px] text-center">
                Mismatched 999px inside 4px
              </div>
            </div>
          }
        />
      </section>
    </div>
  );
};
