import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { SpecTable } from '../../../components/common/SpecTable';
import { SHOWCASE_STYLES, SourceFile, TemplateShowcase } from '../shared/TemplateShowcase';
import { LiveViewScreen } from './LiveViewScreen';
import { AnatomyLegend } from './AnatomyOverlay';
import { LAYOUTS, LIVE_STATES, LayoutId, LiveStateId, Surface } from './liveViewStates';
import { LIVE_VIEW_PREVIEW_PATH } from './paths';
import { TileStatesGallery } from './reference/TileStatesGallery';
import { UseCaseComparison } from './reference/UseCaseComparison';
import { ACCESSIBILITY, DoDontList, LAYOUT_SNIPPET, PERFORMANCE, SPEC_ROWS } from './reference/referenceContent';
import liveTileSource from './wall/LiveTile.tsx?raw';
import videoWallSource from './wall/VideoWall.tsx?raw';
import toolbarSource from './toolbar/LiveToolbar.tsx?raw';
import feedSource from './panels/DetectionFeed.tsx?raw';
import surfaceSource from './surface/ControlRoomSurface.tsx?raw';

const DIR = 'src/pages/templates/live-view';
const SOURCE_FILES: SourceFile[] = [
  { name: 'LiveViewLayout.tsx', code: LAYOUT_SNIPPET },
  { name: 'LiveTile.tsx', code: liveTileSource, dir: `${DIR}/wall` },
  { name: 'VideoWall.tsx', code: videoWallSource, dir: `${DIR}/wall` },
  { name: 'LiveToolbar.tsx', code: toolbarSource, dir: `${DIR}/toolbar` },
  { name: 'DetectionFeed.tsx', code: feedSource, dir: `${DIR}/panels` },
  { name: 'ControlRoomSurface.tsx', code: surfaceSource, dir: `${DIR}/surface` },
];

const { CHIP, CHIP_ON, CHIP_OFF, SEGMENT_GROUP, SEGMENT, SEGMENT_ON, SEGMENT_OFF } = SHOWCASE_STYLES;
const H2 = 'text-[20px] font-semibold text-[#121722] mb-1';
const LEAD = 'text-[14px] text-[#4B5465] mb-4 max-w-3xl';

const LiveViewTemplatePage: React.FC = () => {
  const [state, setState] = useState<LiveStateId>('default');
  const [layout, setLayout] = useState<LayoutId>('3x3');
  const [surface, setSurface] = useState<Surface>('light');
  const [anatomy, setAnatomy] = useState(false);

  return (
    <div>
      <PageHeader category="TEMPLATES" title="Live View Page" description="Real-time CCTV monitoring with live detections and alerts for every VisionEdge product." />

      <section id="showcase" className="mb-12 scroll-mt-24">
        <TemplateShowcase
          states={LIVE_STATES}
          state={state}
          onStateChange={setState}
          stateGroupLabel="Live view state"
          previewPath={LIVE_VIEW_PREVIEW_PATH}
          urlPill="app.visionedge.ai/live"
          sourceFiles={SOURCE_FILES}
          sourceDir={DIR}
          showBackgroundToggle={false}
          extraToggle={{ label: 'Show anatomy', pressed: anatomy, onToggle: () => setAnatomy((a) => !a) }}
          extraRows={[
            {
              label: 'Layout',
              content: (
                <div role="group" aria-label="Layout" className="flex flex-wrap gap-1.5">
                  {LAYOUTS.map((l) => (
                    <button key={l.id} type="button" aria-pressed={layout === l.id} onClick={() => setLayout(l.id)} className={`${CHIP} ${layout === l.id ? CHIP_ON : CHIP_OFF}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              ),
            },
            {
              label: 'Surface',
              content: (
                <div role="group" aria-label="Surface" className={SEGMENT_GROUP}>
                  {(
                    [
                      ['light', 'Light'],
                      ['control', 'Control room'],
                    ] as const
                  ).map(([v, label]) => (
                    <button key={v} type="button" aria-pressed={surface === v} onClick={() => setSurface(v)} className={`${SEGMENT} ${surface === v ? SEGMENT_ON : SEGMENT_OFF}`}>
                      {label}
                    </button>
                  ))}
                </div>
              ),
            },
          ]}
          buildPreviewHref={({ state: s, useCase }) => `${LIVE_VIEW_PREVIEW_PATH}?usecase=${useCase}&state=${s}&layout=${encodeURIComponent(layout)}&surface=${surface}`}
          renderScreen={({ state: s, useCase }) => <LiveViewScreen state={s} useCase={useCase} layout={layout} surface={surface} showAnatomy={anatomy} />}
        />
        {anatomy && (
          <div className="mt-4 rounded-[12px] border border-[#DDE2EA] bg-white p-5">
            <AnatomyLegend />
          </div>
        )}
      </section>

      <section id="anatomy" className="mb-12 scroll-mt-24">
        <h2 className={H2}>Layout Anatomy</h2>
        <p className={LEAD}>
          Turn on <strong className="font-semibold text-[#121722]">Show anatomy</strong> in the showcase to see these regions. The alert banner (11) appears in the Critical alert state.
        </p>
        <div className="rounded-[12px] border border-[#DDE2EA] bg-white p-5">
          <AnatomyLegend />
        </div>
      </section>

      <section id="tile" className="mb-12 scroll-mt-24">
        <h2 className={H2}>Camera Tile</h2>
        <p className={LEAD}>Every tile state side by side. Tiles are always Black; overlays sit on Black 60% strips at the edges. Hover or focus a tile to see its controls.</p>
        <TileStatesGallery />
      </section>

      <section id="feed" className="mb-12 scroll-mt-24">
        <h2 className={H2}>Detection Feed</h2>
        <p className={LEAD}>The activity panel’s live log. Items are 72px with a 64×40 thumbnail, the identifier in JetBrains Mono, camera and zone, relative time, confidence and a status badge.</p>
        <ul className="space-y-2 list-disc pl-5 marker:text-[#1E63FF] text-[14px] leading-[20px] text-[#353D4C] max-w-3xl">
          <li>New items slide in at the top over 200ms. If the user has scrolled down, the list keeps its place and a “12 new detections ↑” pill appears instead.</li>
          <li>Filter with All · Flagged and a type select; “Pause feed” stops new items without pausing the wall.</li>
          <li>Clicking an item flashes its camera tile and opens the detection drawer (snapshot, facts, sightings, actions).</li>
          <li>The list keeps at most 200 items, with “View full log” at the bottom.</li>
        </ul>
      </section>

      <section id="states" className="mb-12 scroll-mt-24">
        <h2 className={H2}>States</h2>
        <p className={LEAD}>Pick any state in the showcase (or with ?state=). Use cases change the scenes, overlays, detections, stats, alert titles and primary actions; layouts change the grid.</p>
        <div className="overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white">
          <table className="w-full min-w-[560px] border-collapse text-[14px]">
            <caption className="sr-only">Live view states</caption>
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                <th scope="col" className="py-2.5 px-4 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  State
                </th>
                <th scope="col" className="py-2.5 px-4 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  What the user sees
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {LIVE_STATES.map((s) => (
                <tr key={s.id}>
                  <th scope="row" className="py-3 px-4 text-left font-semibold text-[#121722] whitespace-nowrap align-top">
                    {s.label}
                  </th>
                  <td className="py-3 px-4 text-[#4B5465]">{s.behaviour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="overlays" className="mb-12 scroll-mt-24">
        <h2 className={H2}>Use-case Overlays</h2>
        <p className={LEAD}>The same tile, detection item and drawer facts, filled per product.</p>
        <UseCaseComparison />
      </section>

      <section id="specs" className="mb-12 scroll-mt-24">
        <h2 className={H2}>Specifications</h2>
        <SpecTable rows={SPEC_ROWS} />
      </section>

      <section id="do-dont" className="mb-12 scroll-mt-24">
        <h2 className={H2}>Do &amp; Don’t</h2>
        <DoDontList />
      </section>

      <section id="accessibility" className="mb-12 scroll-mt-24">
        <h2 className={H2}>Accessibility</h2>
        <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-[#1E63FF] text-[14px] leading-[20px] text-[#353D4C] max-w-3xl">
          {ACCESSIBILITY.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>

      <section id="performance" className="scroll-mt-24">
        <h2 className={H2}>Performance</h2>
        <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-[#1E63FF] text-[14px] leading-[20px] text-[#353D4C] max-w-3xl">
          {PERFORMANCE.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default LiveViewTemplatePage;
