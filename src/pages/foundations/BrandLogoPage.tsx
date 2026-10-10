import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Logo, logoSrc } from '../../components/brand/Logo';
import { SpecTable } from '../../components/common/SpecTable';
import { DoDontPair } from '../../components/common/DoDont';
import { Download } from 'lucide-react';

export const BrandLogoPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        category="FOUNDATIONS"
        title="Brand & Logo"
        description="The official VisionEdge ribbon 'V' mark represents continuous spatial intelligence, precision telemetry, and secure perimeter control."
      />

      {/* Primary Display & Clear Space */}
      <section id="primary-display" className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
              Primary Logo Display &amp; Clear Space
            </h2>
            <p className="text-[14px] text-[#4B5465]">
              The official transparent mark with mandatory ¼ clear space buffer on all boundaries.
            </p>
          </div>

          {/* Download Button */}
          <a
            href={logoSrc}
            download="visionedge-logo.png"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E63FF] text-white rounded-[8px] font-semibold text-[13px] hover:bg-[#0B2D6B] transition-colors shadow-sm self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download logo (PNG)</span>
          </a>
        </div>

        {/* Clear Space Visual Canvas: <Logo size={120} /> on White with dashed #1E63FF box (¼ height = 30px on every side) */}
        <div className="rounded-[12px] border border-[#DDE2EA] bg-[#F7F9FC] p-8 md:p-12 flex flex-col items-center justify-center">
          <div className="relative p-[30px] border-2 border-dashed border-[#1E63FF] rounded-[8px] bg-white flex items-center justify-center shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
            {/* Corner Distance guides */}
            <div className="absolute top-1.5 left-2.5 text-[11px] font-mono text-[#1E63FF] font-semibold">
              ¼ H (30px)
            </div>
            <div className="absolute bottom-1.5 right-2.5 text-[11px] font-mono text-[#1E63FF] font-semibold">
              ¼ H (30px)
            </div>
            <Logo size={120} />
          </div>
          <div className="mt-4 text-center">
            <span className="text-[14px] font-semibold text-[#121722] block">
              Clear Space Buffer = ¼ of Logo Height (30px for 120px display)
            </span>
            <span className="text-[12px] text-[#6B7485]">
              No other text, graphic elements, or borders may intrude inside this boundary.
            </span>
          </div>
        </div>
      </section>

      {/* Approved Backgrounds Showcase: <Logo size={80} /> on White, Gray 50, Deep Navy, Black */}
      <section id="approved-backgrounds" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Approved Background Surfaces
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            The VisionEdge logo must only ever be displayed on the four verified brand surfaces below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. White */}
          <div className="rounded-[12px] border border-[#DDE2EA] bg-white p-6 flex flex-col items-center justify-between min-h-[190px] shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
            <div className="flex-1 flex items-center justify-center py-2">
              <Logo size={80} />
            </div>
            <div className="text-center pt-3 border-t border-[#DDE2EA] w-full">
              <span className="text-[13px] font-semibold text-[#121722] block">White (#FFFFFF)</span>
              <span className="text-[11px] text-[#4B5465]">Primary application canvas</span>
            </div>
          </div>

          {/* 2. Gray 50 */}
          <div className="rounded-[12px] border border-[#DDE2EA] bg-[#F7F9FC] p-6 flex flex-col items-center justify-between min-h-[190px]">
            <div className="flex-1 flex items-center justify-center py-2">
              <Logo size={80} />
            </div>
            <div className="text-center pt-3 border-t border-[#DDE2EA] w-full">
              <span className="text-[13px] font-semibold text-[#121722] block">Gray 50 (#F7F9FC)</span>
              <span className="text-[11px] text-[#4B5465]">Subtle panels & headers</span>
            </div>
          </div>

          {/* 3. Deep Navy */}
          <div className="rounded-[12px] bg-[#0B2D6B] p-6 flex flex-col items-center justify-between min-h-[190px] shadow-[0_4px_12px_rgba(11,45,107,0.15)]">
            <div className="flex-1 flex items-center justify-center py-2">
              <Logo size={80} />
            </div>
            <div className="text-center pt-3 border-t border-white/10 w-full">
              <span className="text-[13px] font-semibold text-white block">Deep Navy (#0B2D6B)</span>
              <span className="text-[11px] text-white/70">Sidebar & executive headers</span>
            </div>
          </div>

          {/* 4. Black */}
          <div className="rounded-[12px] bg-[#000000] p-6 flex flex-col items-center justify-between min-h-[190px]">
            <div className="flex-1 flex items-center justify-center py-2">
              <Logo size={80} />
            </div>
            <div className="text-center pt-3 border-t border-white/20 w-full">
              <span className="text-[13px] font-semibold text-white block">Black (#000000)</span>
              <span className="text-[11px] text-white/70">CCTV video monitoring</span>
            </div>
          </div>
        </div>
      </section>

      {/* Minimum Size Standards */}
      <section id="minimum-sizing" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Minimum Sizing Standards
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Strict digital height constraints ensuring legibility across responsive viewports.
          </p>
        </div>

        <div className="rounded-[12px] border border-[#DDE2EA] bg-white p-6 shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            {/* Size 1: 32px Standard App */}
            <div className="flex items-center gap-4 p-4 rounded-[8px] bg-[#F7F9FC] border border-[#DDE2EA]">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded border border-[#DDE2EA] shrink-0">
                <Logo size={32} />
              </div>
              <div>
                <span className="text-[14px] font-semibold text-[#121722] block">
                  32px Standard App Header
                </span>
                <span className="text-[12px] text-[#4B5465]">
                  Default desktop sidebar &amp; topbar
                </span>
              </div>
            </div>

            {/* Size 2: 24px Minimum Screen */}
            <div className="flex items-center gap-4 p-4 rounded-[8px] bg-[#F7F9FC] border border-[#DDE2EA]">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded border border-[#DDE2EA] shrink-0">
                <Logo size={24} />
              </div>
              <div>
                <span className="text-[14px] font-semibold text-[#121722] block">
                  24px Minimum Screen
                </span>
                <span className="text-[12px] text-[#4B5465]">
                  Smallest digital in-app rendering
                </span>
              </div>
            </div>

            {/* Size 3: 16px Favicon */}
            <div className="flex items-center gap-4 p-4 rounded-[8px] bg-[#F7F9FC] border border-[#DDE2EA]">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded border border-[#DDE2EA] shrink-0">
                <Logo size={16} />
              </div>
              <div>
                <span className="text-[14px] font-semibold text-[#121722] block">
                  16px Browser Favicon
                </span>
                <span className="text-[12px] text-[#4B5465]">
                  Permitted strictly for browser tabs
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Never Do This" Logo Misuse Examples */}
      <section id="never-rules" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Logo Misuse Rules (&ldquo;Never Do This&rdquo;)
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            The exact real logo image with forbidden treatments demonstrated. Each is strictly prohibited in production.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Never 1: Rotated -25deg */}
          <div className="p-4 rounded-[12px] border border-[#DDE2EA] bg-white flex flex-col items-center">
            <div className="h-28 w-full bg-[#F7F9FC] rounded-[8px] flex items-center justify-center mb-3 overflow-hidden">
              <div style={{ transform: 'rotate(-25deg)' }}>
                <Logo size={48} />
              </div>
            </div>
            <span className="text-[13px] font-semibold text-[#121722]">Rotated (-25°)</span>
            <span className="text-[11px] font-bold text-[#DC2626] mt-0.5">✕ Forbidden</span>
          </div>

          {/* Never 2: Stretched (horizontal scale breaking aspect ratio) */}
          <div className="p-4 rounded-[12px] border border-[#DDE2EA] bg-white flex flex-col items-center">
            <div className="h-28 w-full bg-[#F7F9FC] rounded-[8px] flex items-center justify-center mb-3 overflow-hidden">
              <div style={{ transform: 'scaleX(3)' }}>
                <Logo size={32} />
              </div>
            </div>
            <span className="text-[13px] font-semibold text-[#121722]">Stretched / Distorted</span>
            <span className="text-[11px] font-bold text-[#DC2626] mt-0.5">✕ Forbidden</span>
          </div>

          {/* Never 3: Recolored (CSS hue-rotate) */}
          <div className="p-4 rounded-[12px] border border-[#DDE2EA] bg-white flex flex-col items-center">
            <div className="h-28 w-full bg-[#F7F9FC] rounded-[8px] flex items-center justify-center mb-3 overflow-hidden">
              <div style={{ filter: 'hue-rotate(140deg)' }}>
                <Logo size={48} />
              </div>
            </div>
            <span className="text-[13px] font-semibold text-[#121722]">Recolored (Hue Rotate)</span>
            <span className="text-[11px] font-bold text-[#DC2626] mt-0.5">✕ Forbidden</span>
          </div>

          {/* Never 4: Placed on Royal Blue #1E63FF */}
          <div className="p-4 rounded-[12px] border border-[#DDE2EA] bg-white flex flex-col items-center">
            <div className="h-28 w-full bg-[#1E63FF] rounded-[8px] flex items-center justify-center mb-3 overflow-hidden">
              <Logo size={48} />
            </div>
            <span className="text-[13px] font-semibold text-[#121722]">Placed on Royal Blue</span>
            <span className="text-[11px] font-bold text-[#DC2626] mt-0.5">✕ Forbidden</span>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Logo Asset Specifications
        </h2>
        <SpecTable
          rows={[
            { property: 'File Path', value: 'src/assets/images/logo.png', token: "import logo from '../../assets/images/logo.png'" },
            { property: 'File Format', value: 'Transparent 32-bit PNG (RGBA)', token: 'image/png' },
            { property: 'Component', value: '<Logo size={32} />', token: 'src/components/brand/Logo.tsx' },
            { property: 'Aspect Ratio', value: 'Natural height-based scaling (width auto, object-contain)', token: 'object-contain' },
            { property: 'Minimum Screen Size', value: '24px digital height (16px favicon only)', token: 'h-[24px]' },
            { property: 'Standard Height', value: '32px app header / sidebar', token: 'h-[32px]' },
            { property: 'Clear Space', value: '¼ of logo height on every boundary', token: 'padding: 25%' },
          ]}
        />
      </section>

      {/* Do & Don't Guidelines */}
      <section id="do-dont">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Implementation Guidelines
        </h2>
        <DoDontPair
          doTitle="Do place the shared <Logo /> on approved backgrounds"
          doDescription="Display the official image on crisp White #FFFFFF, Gray 50 #F7F9FC, Deep Navy #0B2D6B or Black #000000 surfaces."
          doExample={<Logo size={40} />}
          dontTitle="Don't use redraws, inline SVGs, or custom icons as a logo"
          dontDescription="Never draw custom V vectors or substitute icon libraries. Always import and render the shared <Logo /> component."
          dontExample={
            <div className="p-2 border border-red-400 bg-red-50 rounded text-center text-[12px] font-mono text-red-600">
              [ Custom Drawn Vector / Icon ]
            </div>
          }
        />
      </section>
    </div>
  );
};
