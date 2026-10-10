import React, { useRef, useState } from 'react';
import { Check, ShieldAlert, X } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { SpecTable } from '../../../components/common/SpecTable';
import { DoDontPair } from '../../../components/common/DoDont';
import { SourceFile, TemplateShowcase } from '../shared/TemplateShowcase';
import { DashboardScreen } from './DashboardScreen';
import { AnatomyLegend } from './AnatomyOverlay';
import { DASHBOARD_PREVIEW_PATH, DASHBOARD_STATES, DashboardStateId } from './dashboardStates';
import type { UseCaseId } from './data/useCases';

import dashboardScreenSource from './DashboardScreen.tsx?raw';
import appShellSource from './shell/AppShell.tsx?raw';
import shellSidebarSource from './shell/ShellSidebar.tsx?raw';
import shellTopBarSource from './shell/ShellTopBar.tsx?raw';
import kpiRowSource from './widgets/KpiRow.tsx?raw';
import mainTrendSource from './widgets/MainTrendCard.tsx?raw';
import cameraTileSource from './widgets/CameraTile.tsx?raw';
import eventsTableSource from './widgets/RecentEventsTable.tsx?raw';
import chartFrameSource from './charts/ChartFrame.tsx?raw';
import primitivesSource from './primitives.tsx?raw';

const DIR = 'src/pages/templates/dashboard';

/** The layout and the key building blocks — not every sample-data file. */
const SOURCE_FILES: SourceFile[] = [
  { name: 'DashboardScreen.tsx', code: dashboardScreenSource },
  { name: 'AppShell.tsx', code: appShellSource, dir: `${DIR}/shell` },
  { name: 'ShellSidebar.tsx', code: shellSidebarSource, dir: `${DIR}/shell` },
  { name: 'ShellTopBar.tsx', code: shellTopBarSource, dir: `${DIR}/shell` },
  { name: 'KpiRow.tsx', code: kpiRowSource, dir: `${DIR}/widgets` },
  { name: 'MainTrendCard.tsx', code: mainTrendSource, dir: `${DIR}/widgets` },
  { name: 'CameraTile.tsx', code: cameraTileSource, dir: `${DIR}/widgets` },
  { name: 'RecentEventsTable.tsx', code: eventsTableSource, dir: `${DIR}/widgets` },
  { name: 'ChartFrame.tsx', code: chartFrameSource, dir: `${DIR}/charts` },
  { name: 'primitives.tsx', code: primitivesSource },
];

/* ── Grid & spacing diagram ──────────────────────────────────────── */

interface Span {
  label: string;
  span: number;
}

const LAYOUTS: { title: string; note: string; rows: Span[][] }[] = [
  {
    title: 'Desktop · ≥1280px',
    note: 'Sidebar 240px · 32px content padding',
    rows: [
      [{ label: 'Page header', span: 12 }],
      [{ label: 'KPI', span: 3 }, { label: 'KPI', span: 3 }, { label: 'KPI', span: 3 }, { label: 'KPI', span: 3 }],
      [{ label: 'Main chart', span: 8 }, { label: 'Live alerts', span: 4 }],
      [{ label: 'Live cameras', span: 8 }, { label: 'System health', span: 4 }],
      [{ label: 'Insight', span: 6 }, { label: 'Insight', span: 6 }],
      [{ label: 'Recent events', span: 12 }],
    ],
  },
  {
    title: 'Tablet · 1024–1279px',
    note: 'Sidebar 72px · 24px padding · 768–1023px: KPIs 2×2, insights stacked',
    rows: [
      [{ label: 'Page header', span: 12 }],
      [{ label: 'KPI', span: 3 }, { label: 'KPI', span: 3 }, { label: 'KPI', span: 3 }, { label: 'KPI', span: 3 }],
      [{ label: 'Main chart', span: 12 }],
      [{ label: 'Live alerts', span: 12 }],
      [{ label: 'Live cameras', span: 12 }],
      [{ label: 'System health', span: 12 }],
      [{ label: 'Insight', span: 6 }, { label: 'Insight', span: 6 }],
      [{ label: 'Recent events', span: 12 }],
    ],
  },
  {
    title: 'Mobile · <768px',
    note: 'Sidebar becomes a drawer · 16px padding · table scrolls inside its card',
    rows: [
      [{ label: 'Page header', span: 12 }],
      [{ label: 'KPI', span: 12 }],
      [{ label: 'KPI', span: 12 }],
      [{ label: 'Main chart', span: 12 }],
      [{ label: 'Live alerts', span: 12 }],
      [{ label: '…', span: 12 }],
    ],
  },
];

const GridDiagram: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
    {LAYOUTS.map((layout) => (
      <figure key={layout.title} className="rounded-[12px] border border-[#DDE2EA] bg-white p-4">
        <div
          className="relative rounded-[8px] bg-[#F7F9FC] p-2"
          role="img"
          aria-label={`${layout.title}: ${layout.rows.map((r) => r.map((s) => `${s.label} ${s.span} columns`).join(', ')).join('; ')}`}
        >
          {/* 12 column guides */}
          <div className="absolute inset-2 grid grid-cols-12 gap-1 pointer-events-none" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="bg-[#1E63FF]/[0.04]" />
            ))}
          </div>
          <div className="relative space-y-1" aria-hidden="true">
            {layout.rows.map((row, ri) => (
              <div key={ri} className="grid grid-cols-12 gap-1">
                {row.map((s, si) => (
                  <span
                    key={si}
                    className="h-6 rounded-[3px] bg-[#1E63FF]/[0.08] border border-[#1E63FF]/35 text-[10px] leading-[22px] text-[#0B2D6B] text-center truncate px-1"
                    style={{ gridColumn: `span ${s.span} / span ${s.span}` }}
                  >
                    {s.label} · {s.span}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <figcaption className="mt-3">
          <span className="block text-[14px] font-semibold text-[#121722]">{layout.title}</span>
          <span className="block text-[12px] text-[#4B5465]">{layout.note}</span>
        </figcaption>
      </figure>
    ))}
  </div>
);

/* ── Widget catalog ──────────────────────────────────────────────── */

const WIDGETS: { widget: string; purpose: string; component: string; span: string; notes: string }[] = [
  { widget: 'App shell', purpose: 'Product navigation and global tools', component: 'AppShell · ShellSidebar · ShellTopBar', span: '— / — / —', notes: '240 / 72px sidebar, drawer below 768px' },
  { widget: 'Page header', purpose: 'Context, date range, one Primary action', component: 'widgets/PageHeader', span: '12 / 12 / 12', notes: 'Actions wrap below the title on mobile' },
  { widget: 'Alert banner', purpose: 'Something to act on now', component: 'CriticalAlert, InfoAlert (shared/authUi)', span: '12 / 12 / 12', notes: 'Only when there is an unacknowledged critical alert or a system issue' },
  { widget: 'KPI row', purpose: '"Is everything OK right now?"', component: 'KPI tile standard + Sparkline (charts)', span: '3 each / 3 (2×2 < 1024) / 12', notes: 'Max 4 tiles; Cyan bar on the key KPI' },
  { widget: 'Main trend', purpose: "The module's primary trend", component: 'AreaChart · StackedAreaChart · StackedBarChart (charts), LineTrendChart · ComboTrendChart', span: '8 / 12 / 12', notes: 'Tabs in the header; ChartState for each state' },
  { widget: 'Live alerts', purpose: 'Latest alerts to acknowledge', component: 'widgets/LiveAlertsCard + Badges standard', span: '4 / 12 / 12', notes: 'Acknowledged items move down in Neutral' },
  { widget: 'Live cameras', purpose: 'Glanceable feeds', component: 'CameraTile + CameraModal (Camera tile standard)', span: '8 / 12 / 12', notes: '2×2 or 3×3; 1 column on mobile' },
  { widget: 'System health', purpose: 'Infrastructure status', component: 'RadialGauge + BulletBars (charts)', span: '4 / 12 / 12', notes: 'Drops when cameras go offline' },
  { widget: 'Insights', purpose: 'Distribution and composition', component: 'Heatmap · HorizontalBarChart · BulletBars · GroupedBarChart (charts), DonutChart', span: '6 + 6 / 6 + 6 / 12', notes: 'No chart type repeated on the page' },
  { widget: 'Recent events', purpose: 'Searchable log of the latest events', component: 'Tables standard', span: '12 / 12 / 12', notes: 'Scrolls horizontally inside the card on mobile' },
];

/* ── Mini visuals for Do / Don't ─────────────────────────────────── */

const MiniKpis: React.FC<{ count: number }> = ({ count }) => (
  <div className="w-[240px] grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.min(count, 4)}, minmax(0, 1fr))` }}>
    {Array.from({ length: count }, (_, i) => (
      <span key={i} className="h-10 rounded-[4px] bg-white border border-[#DDE2EA] overflow-hidden">
        {i === 0 && <span className="block h-1 bg-[#00C6FF]" />}
      </span>
    ))}
  </div>
);

const MiniHeader: React.FC<{ primaries: number }> = ({ primaries }) => (
  <div className="w-[240px] space-y-2">
    <div className="flex items-center justify-between gap-2">
      <span className="h-3 w-16 rounded-full bg-[#121722]/70" />
      <span className="flex gap-1">
        <span className="h-5 w-10 rounded-[4px] border border-[#1E63FF]" />
        <span className="h-5 w-10 rounded-[4px] bg-[#1E63FF]" />
      </span>
    </div>
    <div className="grid grid-cols-2 gap-1.5">
      {[0, 1].map((i) => (
        <span key={i} className="h-12 rounded-[4px] bg-white border border-[#DDE2EA] p-1.5 flex items-end">
          {i < primaries && <span className="h-3 w-full rounded-[2px] bg-[#1E63FF]" />}
        </span>
      ))}
    </div>
  </div>
);

const MiniBanner: React.FC = () => (
  <div className="w-[240px] space-y-1.5">
    <div className="h-8 rounded-[4px] bg-[#0B2D6B] border-l-4 border-l-[#00C6FF] flex items-center gap-1.5 px-2">
      <ShieldAlert className="w-3 h-3 text-[#00C6FF]" aria-hidden="true" />
      <span className="h-1.5 flex-1 rounded-full bg-white/70" />
      <span className="h-4 w-9 rounded-[3px] bg-white" />
    </div>
    <MiniKpis count={4} />
  </div>
);

const MiniStates: React.FC<{ broken: boolean }> = ({ broken }) => (
  <div className="w-[240px] grid grid-cols-2 gap-1.5">
    {[0, 1, 2, 3].map((i) =>
      broken ? (
        <span key={i} className="h-12 rounded-[4px] bg-white border border-[#DDE2EA]" />
      ) : (
        <span key={i} className="h-12 rounded-[4px] bg-white border border-[#DDE2EA] flex items-center justify-center text-[9px] text-[#4B5465]">
          {i === 1 ? (
            <span className="inline-flex items-center gap-1 rounded-[3px] border border-[#1E63FF] px-1 text-[#1E63FF]">Retry</span>
          ) : (
            <span className="h-5 w-4/5 rounded-[2px] bg-[#1E63FF]/[0.08]" />
          )}
        </span>
      )
    )}
  </div>
);

const MiniCharts: React.FC<{ repeat: boolean }> = ({ repeat }) => (
  <div className="w-[240px] grid grid-cols-2 gap-1.5">
    {(repeat ? ['bar', 'bar', 'bar', 'bar'] : ['area', 'bar', 'donut', 'heat']).map((kind, i) => (
      <span key={i} className="h-12 rounded-[4px] bg-white border border-[#DDE2EA] p-1.5 flex items-end justify-center gap-0.5">
        {kind === 'bar' && [6, 9, 5, 8].map((h, k) => <span key={k} className="w-2 rounded-t-[1px] bg-[#0B2D6B]" style={{ height: h * 3 }} />)}
        {kind === 'area' && <span className="w-full h-6 rounded-t-[8px] bg-[#1E63FF]/[0.12] border-t-2 border-[#1E63FF]" />}
        {kind === 'donut' && <span className="w-8 h-8 rounded-full border-[5px] border-[#0B2D6B] border-r-[#1E63FF] border-b-[#00C6FF]" />}
        {kind === 'heat' && (
          <span className="grid grid-cols-6 gap-0.5 w-full">
            {Array.from({ length: 12 }, (_, k) => (
              <span key={k} className="h-2 rounded-[1px] bg-[#1E63FF]" style={{ opacity: [0.2, 0.4, 0.7, 1][(k * 7) % 4] }} />
            ))}
          </span>
        )}
      </span>
    ))}
  </div>
);

/* ── Page content ────────────────────────────────────────────────── */

const ACCESSIBILITY_NOTES: { title: string; text: string }[] = [
  { title: 'Landmarks and skip link', text: 'nav (product sidebar), header (top bar) and main (content), plus a "Skip to content" link as the first focusable element.' },
  { title: 'Every chart is described', text: 'Charts have role="img" with an aria-label summary, keyboard-focusable marks with tooltips, and a "View as table" toggle.' },
  { title: 'Throttled live updates', text: 'One aria-live="polite" summary per 30-second refresh; changed numbers flash only without reduced motion.' },
  { title: 'Keyboard-reachable cameras', text: 'Live tiles are buttons that open the camera modal; focus moves into the modal, stays there, and returns to the tile on close.' },
  { title: 'Menus and popovers', text: 'Notifications, user menu, site and date range close on Esc and return focus to their trigger.' },
  { title: 'Contrast and targets', text: 'AA contrast throughout, status never shown by color alone, and 44px hit areas for every control.' },
];

const CONTENT_RULES = [
  'Sentence case for titles, labels and buttons.',
  'Plain words: "Vehicles today", not "Total ANPR Recognition Events".',
  'Relative times under an hour ("2 min ago"), absolute times after that ("13:05").',
  'State the time zone once, in the footer: "All times IST".',
  'Alerts say what happened and where: "Blacklisted vehicle MH12 XY 4521 detected at Gate 3".',
];

const TH = 'py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left';

const DashboardTemplatePage: React.FC = () => {
  const [state, setState] = useState<DashboardStateId>('default');
  const [anatomy, setAnatomy] = useState(false);
  const showcaseRef = useRef<HTMLElement>(null);

  const previewState = (id: DashboardStateId) => {
    setState(id);
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      <PageHeader
        category="TEMPLATES"
        title="Dashboard Page"
        description="Reference operations dashboard for every VisionEdge product. Build module dashboards from this layout and these widgets."
      />

      <section id="showcase" ref={showcaseRef} className="mb-12 scroll-mt-24">
        <TemplateShowcase
          states={DASHBOARD_STATES}
          state={state}
          onStateChange={setState}
          stateGroupLabel="Dashboard state"
          previewPath={DASHBOARD_PREVIEW_PATH}
          urlPill="app.visionedge.ai/dashboard"
          sourceFiles={SOURCE_FILES}
          sourceDir={DIR}
          showBackgroundToggle={false}
          extraToggle={{ label: 'Show anatomy', pressed: anatomy, onToggle: () => setAnatomy((a) => !a) }}
          buildPreviewHref={({ state: s, useCase }) => `${DASHBOARD_PREVIEW_PATH}?state=${s}&usecase=${useCase}&range=today`}
          renderScreen={({ state: s, useCase }) => (
            <DashboardScreen state={s} useCase={useCase as UseCaseId} showAnatomy={anatomy} />
          )}
        />
        {anatomy && (
          <div className="mt-4 rounded-[12px] border border-[#DDE2EA] bg-white p-5">
            <AnatomyLegend />
          </div>
        )}
      </section>

      <section id="anatomy" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Layout Anatomy</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">
          Turn on <strong className="font-semibold text-[#121722]">Show anatomy</strong> in the showcase to see these regions on the live
          dashboard. The alert banner (4) appears only in the Critical alert, Degraded and Empty states.
        </p>
        <AnatomyLegend />
      </section>

      <section id="grid" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Grid &amp; Spacing</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">
          12-column grid, max width 1440px, 24px between cards, 32px content padding (24px tablet, 16px mobile), 24px card padding.
        </p>
        <GridDiagram />
      </section>

      <section id="catalog" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">Widget Catalog</h2>
        <div className="overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                {['Widget', 'Purpose', 'Component used', 'Span desktop / tablet / mobile', 'Notes'].map((h) => (
                  <th key={h} scope="col" className={TH}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {WIDGETS.map((w) => (
                <tr key={w.widget} className="align-top hover:bg-[#F7F9FC] transition-colors">
                  <th scope="row" className="py-3 px-4 text-left font-medium text-[#121722] whitespace-nowrap">
                    {w.widget}
                  </th>
                  <td className="py-3 px-4 text-[#353D4C] min-w-[180px]">{w.purpose}</td>
                  <td className="py-3 px-4 text-[#353D4C] min-w-[220px] font-mono text-[12px]">{w.component}</td>
                  <td className="py-3 px-4 text-[#353D4C] whitespace-nowrap tabular-nums">{w.span}</td>
                  <td className="py-3 px-4 text-[#4B5465] min-w-[200px]">{w.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="states" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">States</h2>
        <div className="overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                <th scope="col" className={TH}>State</th>
                <th scope="col" className={TH}>When it appears</th>
                <th scope="col" className={TH}>Behaviour</th>
                <th scope="col" className={TH}>
                  <span className="sr-only">Preview</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {DASHBOARD_STATES.map((s) => (
                <tr key={s.id} className="align-top hover:bg-[#F7F9FC] transition-colors">
                  <th scope="row" className="py-3 px-4 text-left font-medium text-[#121722] whitespace-nowrap">
                    {s.label}
                  </th>
                  <td className="py-3 px-4 text-[#353D4C] min-w-[180px]">{s.trigger}</td>
                  <td className="py-3 px-4 text-[#4B5465] min-w-[260px]">{s.behaviour}</td>
                  <td className="py-2 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => previewState(s.id)}
                      aria-label={`Preview ${s.label} state`}
                      className="inline-flex items-center h-8 px-3 rounded-[8px] text-[13px] font-semibold text-[#1E63FF] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">Specifications</h2>
        <SpecTable
          rows={[
            { property: 'Shell Sidebar', value: '240px expanded · 72px collapsed · drawer < 768px, Deep Navy', token: 'w-[240px] · w-[72px] · bg-[#0B2D6B]' },
            { property: 'Top Bar', value: '64px, White, 1px Gray 200 bottom border', token: 'h-16 border-b-[#DDE2EA]' },
            { property: 'Content Background', value: 'Gray 50, max width 1440px, 12 columns, 24px gutter', token: 'bg-[#F7F9FC] grid-cols-12 gap-6' },
            { property: 'Content Padding', value: '32px desktop · 24px tablet · 16px mobile', token: 'p-8 · p-6 · p-4' },
            { property: 'Card', value: 'White, 1px Gray 200, 12px radius, 24px padding, elevation-1', token: 'rounded-[12px] p-6 shadow-[0_1px_3px_…]' },
            { property: 'KPI Tile', value: 'Overline label, 32/40 Bold Deep Navy, trend + sparkline; 4px Cyan bar on one tile', token: 'h-1 bg-[#00C6FF]' },
            { property: 'Camera Tile', value: 'Black, 12px radius, 16:9; LIVE pill, timestamp, ID strip on Black 60%', token: 'bg-black aspect-video' },
            { property: 'Detection Box', value: '2px Cyan box + Cyan chip, JetBrains Mono, Deep Navy text', token: 'border-2 border-[#00C6FF]' },
            { property: 'Table Row', value: '48px, sticky Overline header, Gray 50 hover', token: 'h-12 sticky top-0' },
            { property: 'Refresh Interval', value: '30 seconds while Live is on', token: 'REFRESH_MS = 30000' },
            { property: 'Highlight Flash', value: 'Royal Blue 8%, 600ms ease-out; none with reduced motion', token: 'FLASH_MS = 600' },
            { property: 'Camera Modal', value: 'Large, 880px, 16px radius, elevation-3', token: 'max-w-[880px]' },
          ]}
        />
      </section>

      <section id="do-dont" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-2">Do &amp; Don&apos;t</h2>
        <DoDontPair
          doTitle='Do lead with 4 KPIs that answer "Is everything OK right now?"'
          doDescription="Four numbers, one highlighted, each with a trend in words."
          doExample={<MiniKpis count={4} />}
          dontTitle="Don't show more than 4 KPI tiles in the top row"
          dontDescription="Beyond four, nothing stands out and the row wraps."
          dontExample={<MiniKpis count={7} />}
        />
        <DoDontPair
          doTitle="Do keep one Primary action in the page header"
          doDescription="The module's main task sits next to the date range and Export."
          doExample={<MiniHeader primaries={0} />}
          dontTitle="Don't add Primary buttons inside widgets"
          dontDescription="Competing Primary buttons make it unclear what matters."
          dontExample={<MiniHeader primaries={2} />}
        />
        <DoDontPair
          doTitle="Do put critical alerts at the top, in Deep Navy, with an action"
          doDescription="One banner above the KPIs with View and Acknowledge."
          doExample={<MiniBanner />}
          dontTitle="Don't rely on color alone or hide alerts below the fold"
          dontDescription="A red dot deep in a card is easy to miss and fails without color vision."
          dontExample={
            <div className="w-[240px] space-y-1.5">
              <MiniKpis count={4} />
              <span className="flex items-center gap-1.5 h-8 rounded-[4px] bg-white border border-[#DDE2EA] px-2">
                <span className="w-2 h-2 rounded-full bg-[#0B2D6B]" />
                <span className="h-1.5 flex-1 rounded-full bg-[#DDE2EA]" />
              </span>
            </div>
          }
        />
        <DoDontPair
          doTitle="Do give every widget its own loading, empty and error state"
          doDescription="One failed source shows Retry in its own card."
          doExample={<MiniStates broken={false} />}
          dontTitle="Don't let one failed widget blank the page"
          dontDescription="A page-level error hides data that is still fine."
          dontExample={<MiniStates broken />}
        />
        <DoDontPair
          doTitle="Do use each chart type once per page, chosen per the Charts guide"
          doDescription="Trend, comparison, composition and distribution each get the right chart."
          doExample={<MiniCharts repeat={false} />}
          dontTitle="Don't repeat the same chart in several cards"
          dontDescription="Identical bar charts make the cards hard to tell apart."
          dontExample={<MiniCharts repeat />}
        />
      </section>

      <section id="accessibility" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Accessibility</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">Built into the template above — keep these when you adapt it.</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACCESSIBILITY_NOTES.map((note) => (
            <li key={note.title} className="flex gap-3 p-4 rounded-[12px] border border-[#DDE2EA] bg-white">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-[#00C6FF]/15 text-[#0B2D6B] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] leading-[20px] font-semibold text-[#121722]">{note.title}</span>
                <span className="block mt-0.5 text-[13px] leading-[20px] text-[#4B5465]">{note.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section id="content">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">Content Guidelines</h2>
        <ul className="mb-6 space-y-2">
          {CONTENT_RULES.map((rule) => (
            <li key={rule} className="flex items-start gap-2 text-[14px] leading-[20px] text-[#353D4C]">
              <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#1E63FF]" aria-hidden="true" />
              {rule}
            </li>
          ))}
        </ul>
        <div className="overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                <th scope="col" className={TH}>Avoid</th>
                <th scope="col" className={TH}>Use instead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {[
                ['Total ANPR Recognition Events', 'Vehicles today'],
                ['Last updated: 2026-09-30T08:33:00Z', 'Updated 2 min ago'],
                ['ALERT!!! Blacklist match', 'Blacklisted vehicle MH12 XY 4521 detected at Gate 3'],
                ['Error 503', "Couldn't load data · Retry"],
                ['No data', 'No data yet'],
              ].map(([avoid, use]) => (
                <tr key={avoid}>
                  <td className="py-3 px-4 text-[#4B5465] min-w-[200px]">
                    <span className="inline-flex items-start gap-2">
                      <X className="w-4 h-4 mt-0.5 shrink-0 text-[#121722]" aria-label="Avoid" />
                      {avoid}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#121722] min-w-[240px]">
                    <span className="inline-flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#1E63FF]" aria-label="Use" />
                      {use}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardTemplatePage;
