import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { PreviewPanel, TabItem } from '../../components/common/PreviewPanel';
import { SpecTable } from '../../components/common/SpecTable';
import { DoDontPair } from '../../components/common/DoDont';
import { MoreVertical, ArrowUpRight, ArrowDownRight, Video, Car, Users, Utensils, Sparkles } from 'lucide-react';

export const CardsKpiPage: React.FC = () => {
  const previewTabs: TabItem[] = [
    {
      id: 'kpi-row',
      label: 'Demo Dashboard KPI Row',
      component: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* Tile 1: Most Important with 4px Cyan top bar */}
          <div className="rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden shadow-[0_1px_3px_rgba(11,45,107,0.08)] flex flex-col justify-between relative hover:shadow-[0_4px_12px_rgba(11,45,107,0.08)] transition-all">
            <div className="h-1 bg-[#00C6FF] w-full" />
            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                    VEHICLES TODAY
                  </span>
                  <Car className="w-4 h-4 text-[#1E63FF]" />
                </div>
                <div className="text-[32px] leading-[40px] font-bold text-[#0B2D6B] font-mono tabular-nums">
                  1,284
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3 text-[12px]">
                <span className="inline-flex items-center font-semibold text-[#00C6FF] bg-[#00C6FF]/15 px-1.5 py-0.5 rounded text-[11px]">
                  <ArrowUpRight className="w-3 h-3" />
                  +12.4%
                </span>
                <span className="text-[#4B5465]">vs yesterday</span>
              </div>
            </div>
          </div>

          {/* Tile 2: Students present */}
          <div className="rounded-[12px] border border-[#DDE2EA] bg-white p-5 shadow-[0_1px_3px_rgba(11,45,107,0.08)] flex flex-col justify-between hover:shadow-[0_4px_12px_rgba(11,45,107,0.08)] transition-all">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  STUDENTS PRESENT
                </span>
                <Users className="w-4 h-4 text-[#4B5465]" />
              </div>
              <div className="text-[32px] leading-[40px] font-bold text-[#0B2D6B] font-mono tabular-nums">
                942
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-[12px]">
              <span className="inline-flex items-center font-semibold text-[#00C6FF] bg-[#00C6FF]/15 px-1.5 py-0.5 rounded text-[11px]">
                <ArrowUpRight className="w-3 h-3" />
                98.1%
              </span>
              <span className="text-[#4B5465]">campus occupancy</span>
            </div>
          </div>

          {/* Tile 3: Meals served */}
          <div className="rounded-[12px] border border-[#DDE2EA] bg-white p-5 shadow-[0_1px_3px_rgba(11,45,107,0.08)] flex flex-col justify-between hover:shadow-[0_4px_12px_rgba(11,45,107,0.08)] transition-all">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  MEALS SERVED
                </span>
                <Utensils className="w-4 h-4 text-[#4B5465]" />
              </div>
              <div className="text-[32px] leading-[40px] font-bold text-[#0B2D6B] font-mono tabular-nums">
                2,310
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-[12px]">
              <span className="text-[#4B5465]">Lunch distribution complete</span>
            </div>
          </div>

          {/* Tile 4: Active cameras */}
          <div className="rounded-[12px] border border-[#DDE2EA] bg-white p-5 shadow-[0_1px_3px_rgba(11,45,107,0.08)] flex flex-col justify-between hover:shadow-[0_4px_12px_rgba(11,45,107,0.08)] transition-all">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  ACTIVE CAMERAS
                </span>
                <Video className="w-4 h-4 text-[#1E63FF]" />
              </div>
              <div className="text-[32px] leading-[40px] font-bold text-[#0B2D6B] font-mono tabular-nums">
                36 / 38
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-[12px]">
              <span className="w-2 h-2 rounded-full bg-[#00C6FF] animate-pulse" />
              <span className="text-[#4B5465]">2 offline for scheduled calibration</span>
            </div>
          </div>
        </div>
      ),
      code: `// Primary KPI Tile with 4px Cyan indicator bar
<div className="rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
  <div className="h-1 bg-[#00C6FF] w-full" />
  <div className="p-5">
    <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
      VEHICLES TODAY
    </span>
    <div className="text-[32px] leading-[40px] font-bold text-[#0B2D6B] font-mono tabular-nums">
      1,284
    </div>
    <div className="flex items-center gap-1.5 mt-3 text-[12px]">
      <span className="font-semibold text-[#00C6FF] bg-[#00C6FF]/15 px-1.5 py-0.5 rounded text-[11px]">
        +12.4%
      </span>
      <span className="text-[#4B5465]">vs yesterday</span>
    </div>
  </div>
</div>`,
    },
    {
      id: 'surface-card',
      label: 'Surface Panel Card',
      component: (
        <div className="rounded-[12px] border border-[#DDE2EA] bg-white p-6 shadow-[0_1px_3px_rgba(11,45,107,0.08)] w-full max-w-lg">
          <div className="flex items-center justify-between pb-4 border-b border-[#DDE2EA] mb-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[#121722]">
                Gate Access Telemetry
              </h3>
              <p className="text-[13px] text-[#4B5465] mt-0.5">
                Cluster North-01 active optical streams
              </p>
            </div>
            <button className="text-[#6B7485] hover:text-[#121722] p-1 rounded hover:bg-[#F7F9FC]">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-[14px]">
            <div className="flex items-center justify-between py-2 border-b border-[#F7F9FC]">
              <span className="text-[#4B5465]">Optical Recognition Rate</span>
              <span className="font-mono font-bold text-[#0B2D6B]">99.82%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F7F9FC]">
              <span className="text-[#4B5465]">Average Gate Dispatch Latency</span>
              <span className="font-mono font-bold text-[#0B2D6B]">240ms</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[#4B5465]">Automatic Barrier State</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#00C6FF]/15 text-[#0B2D6B]">
                ARMED &amp; ACTIVE
              </span>
            </div>
          </div>
        </div>
      ),
      code: `// Standard Surface Card
<div className="rounded-[12px] border border-[#DDE2EA] bg-white p-6 shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
  <div className="flex items-center justify-between pb-4 border-b border-[#DDE2EA] mb-4">
    <h3 className="text-[18px] font-semibold text-[#121722]">
      Gate Access Telemetry
    </h3>
    <button className="text-[#6B7485] hover:text-[#121722]">
      <MoreVertical className="w-4 h-4" />
    </button>
  </div>
  {/* Card body */}
</div>`,
    },
    {
      id: 'camera-tile',
      label: 'Camera Monitoring Tile',
      component: (
        <div className="w-full max-w-md rounded-[12px] bg-black overflow-hidden shadow-md border border-[#1F2633] relative">
          {/* Simulated 1080p CCTV video surface */}
          <div className="h-48 bg-[#121722] flex flex-col items-center justify-center text-center p-4">
            <Video className="w-8 h-8 text-[#4B5465] mb-2" />
            <span className="text-[12px] font-mono text-[#C3CAD5]">
              [ RTSP 1080p · 30 FPS · H.265 STREAM ]
            </span>
          </div>

          {/* Bottom Overlay: Black 60% strip with Camera Name + Cyan Live Dot */}
          <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C6FF] animate-pulse" />
              <span className="text-[13px] font-semibold font-mono tracking-tight">
                CAM_GATE_04_NORTH
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#00C6FF] font-semibold">
              LIVE 14:05:32
            </span>
          </div>
        </div>
      ),
      code: `// Camera Tile: Pure Black background with Cyan live dot on a Black 60% strip
<div className="rounded-[12px] bg-black overflow-hidden relative border border-[#1F2633]">
  <video src="..." autoPlay muted loop className="w-full h-48 object-cover" />
  <div className="absolute bottom-0 inset-x-0 bg-black/60 px-4 py-2.5 flex items-center justify-between text-white">
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-[#00C6FF] animate-pulse" />
      <span className="text-[13px] font-semibold font-mono">CAM_GATE_04_NORTH</span>
    </div>
    <span className="text-[11px] font-mono text-[#00C6FF]">LIVE</span>
  </div>
</div>`,
    },
  ];

  return (
    <div>
      <PageHeader
        category="COMPONENTS"
        title="Cards & KPI Tiles"
        description="Clean, single-elevation surface cards, bold 32/40 KPI summary numbers, and dedicated CCTV camera monitoring viewports."
        updatedBadge
      />

      <section id="preview" className="mb-12">
        <PreviewPanel tabs={previewTabs} />
      </section>

      {/* Specifications */}
      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Card &amp; KPI Specifications
        </h2>
        <SpecTable
          rows={[
            { property: 'Card Surface', value: '#FFFFFF (White), 1px border #DDE2EA', token: 'bg-white border border-[#DDE2EA]' },
            { property: 'Border Radius', value: '12px (radius-lg)', token: 'rounded-[12px]' },
            { property: 'Inner Padding', value: '24px (space-6) desktop, 16px (space-4) mobile', token: 'p-6 sm:p-6' },
            { property: 'KPI Number', value: '32px / 40px Bold Deep Navy (#0B2D6B)', token: 'text-[32px] font-bold text-[#0B2D6B] font-mono' },
            { property: 'Top Indicator Bar', value: '4px height (#00C6FF or #1E63FF) on top KPI only', token: 'h-1 bg-[#00C6FF]' },
            { property: 'Camera Tile Background', value: '#000000 (Black) or Gray 900 (#121722)', token: 'bg-black' },
          ]}
        />
      </section>

      {/* Do & Don't Guidelines */}
      <section id="do-dont">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Card Guidelines
        </h2>
        <DoDontPair
          doTitle="Do use 4px top accent bars strictly on the single most critical KPI"
          doDescription="Conserving accent bars creates an immediate visual anchor for executive and operations dashboards."
          doExample={
            <div className="border border-[#DDE2EA] rounded-[12px] bg-white overflow-hidden w-40">
              <div className="h-1 bg-[#00C6FF] w-full" />
              <div className="p-3 text-[12px] font-bold text-[#0B2D6B]">Primary KPI</div>
            </div>
          }
          dontTitle="Don't put colored accent bars on every tile in the grid"
          dontDescription="When all cards are marked with bright bars, none stand out, ruining visual priority."
          dontExample={
            <div className="flex gap-2">
              <div className="border border-[#DDE2EA] rounded-[8px] bg-white overflow-hidden w-24">
                <div className="h-1 bg-[#00C6FF] w-full" />
                <div className="p-2 text-[10px]">KPI 1</div>
              </div>
              <div className="border border-[#DDE2EA] rounded-[8px] bg-white overflow-hidden w-24">
                <div className="h-1 bg-[#1E63FF] w-full" />
                <div className="p-2 text-[10px]">KPI 2</div>
              </div>
            </div>
          }
        />
      </section>
    </div>
  );
};
