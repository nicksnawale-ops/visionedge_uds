import React, { Suspense, lazy, useState } from 'react';
import { ChartLine, Donut } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import type { TabItem } from '../../components/common/PreviewPanel';
import { SpecTable } from '../../components/common/SpecTable';
import { DoDontPair } from '../../components/common/DoDont';
import { CodeBlock } from '../../components/common/CodeBlock';
import type { ChartEntry } from '../../components/charts/ChartShowcase';
import { DONUT_CHART_TABLE, buildLineChartTable } from '../../components/charts/existingChartTables';

// Chart components and code snippets load in their own chunk.
const ChartGallery = lazy(() => import('../../components/charts/ChartGallery'));
const ChartStatesDemo = lazy(() => import('../../components/charts/ChartStatesDemo'));

const SectionFallback: React.FC<{ height: number }> = ({ height }) => (
  <div
    role="status"
    className="rounded-[12px] border border-[#DDE2EA] bg-white motion-safe:animate-pulse"
    style={{ height }}
  >
    <span className="sr-only">Loading charts</span>
  </div>
);

const CHART_STATE_CODE = `import { ChartCard } from '@/components/charts/ChartCard';
import { ChartState } from '@/components/charts/ChartState';

<ChartCard title="Vehicle entries by gate" subtitle="ANPR · Today · 30 Sep 2026">
  <ChartState
    status={status}            // 'loading' | 'empty' | 'error' | 'ready'
    height={260}               // match the chart height so the card doesn't jump
    onRetry={refetch}          // Error → Secondary "Retry"
    onChangeRange={openPicker} // Empty → Ghost "Change date range"
  >
    <EntriesByGateBar data={data} />
  </ChartState>
</ChartCard>`;

const CHOOSING_ROWS: { goal: string; recommended: string; avoid: string }[] = [
  { goal: 'Trend over time', recommended: 'Line / Area', avoid: 'Pie' },
  { goal: 'Compare categories', recommended: 'Bar / Horizontal bar', avoid: 'Pie with many slices' },
  { goal: 'Part of a whole', recommended: 'Donut / Stacked bar', avoid: 'Line' },
  { goal: 'Two dimensions / patterns', recommended: 'Heatmap', avoid: 'Grouped bar with many groups' },
  { goal: 'Single KPI vs target', recommended: 'Gauge / Bullet bar', avoid: 'Pie' },
  { goal: 'Small trend in a tile', recommended: 'Sparkline', avoid: 'Full chart' },
];

export const ChartsPage: React.FC = () => {
  const [hoveredHour, setHoveredHour] = useState<number | null>(6); // Default 14:00

  // Mock hourly entries: 08:00 to 18:00
  const hourlyData = [
    { hour: '08:00', regular: 120, commercial: 45, vip: 18 },
    { hour: '09:00', regular: 280, commercial: 80, vip: 35 },
    { hour: '10:00', regular: 190, commercial: 65, vip: 22 },
    { hour: '11:00', regular: 140, commercial: 90, vip: 15 },
    { hour: '12:00', regular: 220, commercial: 110, vip: 28 },
    { hour: '13:00', regular: 180, commercial: 75, vip: 20 },
    { hour: '14:00', regular: 310, commercial: 95, vip: 42 },
    { hour: '15:00', regular: 240, commercial: 85, vip: 30 },
    { hour: '16:00', regular: 195, commercial: 60, vip: 25 },
    { hour: '17:00', regular: 340, commercial: 70, vip: 48 },
    { hour: '18:00', regular: 260, commercial: 40, vip: 32 },
  ];

  const maxVal = 400;

  const previewTabs: TabItem[] = [
    {
      id: 'line-chart',
      label: 'Vehicle Entries Line Chart',
      component: (
        <div className="w-full max-w-2xl bg-white p-6 rounded-[12px] border border-[#DDE2EA] shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDE2EA] mb-6 gap-2">
            <div>
              <h3 className="text-[17px] font-semibold text-[#121722]">
                Vehicle Gate Entries by Hour
              </h3>
              <p className="text-[12px] text-[#4B5465]">
                Today: 30 Sep 2026 · Real-time Optical Stream
              </p>
            </div>
            {/* Series Legend adhering to strict order: Deep Navy, Royal Blue, Cyan */}
            <div className="flex items-center gap-4 text-[12px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#0B2D6B]" />
                <span className="text-[#353D4C] font-medium">Regular (Navy)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#1E63FF]" />
                <span className="text-[#353D4C] font-medium">Commercial (Blue)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#00C6FF]" />
                <span className="text-[#353D4C] font-medium">VIP Fleet (Cyan)</span>
              </div>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative h-64 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200">
              {/* Horizontal Gridlines in Gray 200 (#DDE2EA) */}
              {[0, 50, 100, 150].map((y) => (
                <line
                  key={y}
                  x1="40"
                  y1={y}
                  x2="590"
                  y2={y}
                  stroke="#DDE2EA"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              ))}

              {/* Y Axis Labels */}
              <text x="5" y="10" fill="#6B7485" fontSize="10" fontFamily="JetBrains Mono">400</text>
              <text x="5" y="60" fill="#6B7485" fontSize="10" fontFamily="JetBrains Mono">300</text>
              <text x="5" y="110" fill="#6B7485" fontSize="10" fontFamily="JetBrains Mono">200</text>
              <text x="5" y="160" fill="#6B7485" fontSize="10" fontFamily="JetBrains Mono">100</text>

              {/* Series 1: Deep Navy Line (Regular) */}
              <polyline
                fill="none"
                stroke="#0B2D6B"
                strokeWidth="2.5"
                points={hourlyData
                  .map((d, i) => `${50 + i * 50},${190 - (d.regular / maxVal) * 180}`)
                  .join(' ')}
              />

              {/* Series 2: Royal Blue Line (Commercial) */}
              <polyline
                fill="none"
                stroke="#1E63FF"
                strokeWidth="2.5"
                points={hourlyData
                  .map((d, i) => `${50 + i * 50},${190 - (d.commercial / maxVal) * 180}`)
                  .join(' ')}
              />

              {/* Series 3: Cyan Line (VIP) */}
              <polyline
                fill="none"
                stroke="#00C6FF"
                strokeWidth="2.5"
                points={hourlyData
                  .map((d, i) => `${50 + i * 50},${190 - (d.vip / maxVal) * 180}`)
                  .join(' ')}
              />

              {/* Data points & X Labels */}
              {hourlyData.map((d, i) => {
                const cx = 50 + i * 50;
                const isHovered = hoveredHour === i;

                return (
                  <g key={d.hour}>
                    {/* Hover vertical guide line */}
                    {isHovered && (
                      <line
                        x1={cx}
                        y1="10"
                        x2={cx}
                        y2="190"
                        stroke="#1E63FF"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Data dots */}
                    <circle
                      cx={cx}
                      cy={190 - (d.regular / maxVal) * 180}
                      r={isHovered ? 4.5 : 3}
                      fill="#0B2D6B"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredHour(i)}
                    />

                    {/* X axis tick text */}
                    <text
                      x={cx}
                      y="198"
                      textAnchor="middle"
                      fill="#6B7485"
                      fontSize="9.5"
                      fontFamily="JetBrains Mono"
                    >
                      {d.hour.slice(0, 2)}h
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Custom Tooltip Card */}
            {hoveredHour !== null && (
              <div
                className="absolute top-2 bg-white border border-[#DDE2EA] rounded-[8px] p-3 shadow-[0_4px_12px_rgba(11,45,107,0.12)] pointer-events-none text-[12px] z-10 transition-all"
                style={{ left: `${Math.min(50 + hoveredHour * 45, 420)}px` }}
              >
                <div className="font-mono font-semibold text-[#121722] border-b border-[#DDE2EA] pb-1 mb-1.5">
                  {hourlyData[hoveredHour].hour} Peak Data
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#0B2D6B] font-medium">Regular:</span>
                    <span className="font-mono font-bold">{hourlyData[hoveredHour].regular}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#1E63FF] font-medium">Commercial:</span>
                    <span className="font-mono font-bold">{hourlyData[hoveredHour].commercial}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#00C6FF] font-medium">VIP:</span>
                    <span className="font-mono font-bold">{hourlyData[hoveredHour].vip}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      code: `// White chart cards. Series order: Deep Navy (#0B2D6B), Royal Blue (#1E63FF), Cyan (#00C6FF), Gray 400 (#8C95A6)
<svg className="w-full h-64" viewBox="0 0 600 200">
  <polyline stroke="#0B2D6B" strokeWidth="2.5" points="..." />
  <polyline stroke="#1E63FF" strokeWidth="2.5" points="..." />
  <polyline stroke="#00C6FF" strokeWidth="2.5" points="..." />
</svg>`,
    },
    {
      id: 'donut-chart',
      label: 'Vehicle Breakdown Donut',
      component: (
        <div className="w-full max-w-md bg-white p-6 rounded-[12px] border border-[#DDE2EA] shadow-[0_1px_3px_rgba(11,45,107,0.08)] flex flex-col items-center">
          <h3 className="text-[17px] font-semibold text-[#121722] mb-4 self-start">
            Vehicle Classification Breakdown
          </h3>

          <div className="relative w-44 h-44 my-2">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {/* Background circle */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#EEF1F6"
                strokeWidth="3.8"
              />
              {/* Slice 1: Deep Navy (55%) */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#0B2D6B"
                strokeWidth="3.8"
                strokeDasharray="55, 100"
              />
              {/* Slice 2: Royal Blue (30%) */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#1E63FF"
                strokeWidth="3.8"
                strokeDasharray="30, 100"
                strokeDashoffset="-55"
              />
              {/* Slice 3: Cyan (15%) */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#00C6FF"
                strokeWidth="3.8"
                strokeDasharray="15, 100"
                strokeDashoffset="-85"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[20px] font-bold text-[#0B2D6B] font-mono">1,284</span>
              <span className="text-[10px] uppercase font-semibold text-[#6B7485]">Total Assets</span>
            </div>
          </div>

          <div className="w-full mt-4 space-y-2 text-[13px]">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-[#4B5465]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B2D6B]" />
                Four Wheeler Passenger (55%)
              </span>
              <span className="font-mono font-semibold text-[#121722]">706</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-[#4B5465]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E63FF]" />
                Heavy Logistics Truck (30%)
              </span>
              <span className="font-mono font-semibold text-[#121722]">385</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-[#4B5465]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00C6FF]" />
                Campus Staff Bus / EV (15%)
              </span>
              <span className="font-mono font-semibold text-[#121722]">193</span>
            </div>
          </div>
        </div>
      ),
      code: `// Donut Chart: Series order Deep Navy (55%), Royal Blue (30%), Cyan (15%)`,
    },
  ];

  // The two original charts keep their JSX and code above; the picker adds category, icon and guidance.
  const [lineTab, donutTab] = previewTabs;
  const existingCharts: ChartEntry[] = [
    {
      id: lineTab.id,
      label: 'Line',
      category: 'trend',
      icon: ChartLine,
      render: () => lineTab.component,
      code: lineTab.code,
      whenToUse: 'Show change over time for 1–4 series.',
      whenNotToUse: 'Unrelated categories with no natural order — use a bar chart.',
      table: buildLineChartTable(hourlyData),
    },
    {
      id: donutTab.id,
      label: 'Donut',
      category: 'composition',
      icon: Donut,
      render: () => donutTab.component,
      code: donutTab.code,
      whenToUse: 'Show 2–4 parts of a whole with the total in the centre.',
      whenNotToUse: 'Comparing similar values or tracking change over time.',
      table: DONUT_CHART_TABLE,
    },
  ];

  return (
    <div>
      <PageHeader
        category="COMPONENTS"
        title="Charts"
        description="Data visualization standards for operational telemetry. Strict palette sequence: Deep Navy, Royal Blue, Cyan, Gray 400. Light gridlines and direct legend keys."
      />

      <section id="preview" className="mb-12">
        <Suspense fallback={<SectionFallback height={520} />}>
          <ChartGallery existing={existingCharts} />
        </Suspense>
      </section>

      {/* Choosing the right chart */}
      <section id="choosing" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Choosing the Right Chart
        </h2>
        <div className="overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                {['Goal', 'Recommended chart', 'Avoid'].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {CHOOSING_ROWS.map((row) => (
                <tr key={row.goal} className="hover:bg-[#F7F9FC] transition-colors">
                  <th scope="row" className="py-3 px-4 font-medium text-[#121722] whitespace-nowrap">
                    {row.goal}
                  </th>
                  <td className="py-3 px-4 text-[#353D4C] whitespace-nowrap">{row.recommended}</td>
                  <td className="py-3 px-4 text-[#4B5465] whitespace-nowrap">{row.avoid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Chart states */}
      <section id="chart-states" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
          Chart States
        </h2>
        <p className="text-[14px] text-[#4B5465] mb-4">
          Wrap every chart body in <code className="font-mono text-[13px] text-[#1E63FF]">ChartState</code> so loading,
          empty and error cases keep the card size and offer a clear next step.
        </p>
        <Suspense fallback={<SectionFallback height={260} />}>
          <ChartStatesDemo />
        </Suspense>
        <CodeBlock code={CHART_STATE_CODE} filename="ChartState usage" className="mt-4" />
      </section>

      {/* Specifications */}
      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Chart Specifications
        </h2>
        <SpecTable
          rows={[
            { property: 'Series 1 (Primary)', value: 'Deep Navy (#0B2D6B)', token: '#0B2D6B', notes: 'First data series / baseline metric' },
            { property: 'Series 2 (Secondary)', value: 'Royal Blue (#1E63FF)', token: '#1E63FF', notes: 'Second data series / comparative trend' },
            { property: 'Series 3 (Accent)', value: 'Cyan (#00C6FF)', token: '#00C6FF', notes: 'Special status, targets, or VIP fleet' },
            { property: 'Series 4 (Neutral)', value: 'Gray 400 (#8C95A6)', token: '#8C95A6', notes: 'Historical comparison or inactive thresholds' },
            { property: 'Gridlines', value: 'Gray 200 (#DDE2EA) 1px dashed', token: '#DDE2EA' },
            { property: 'Axis Typography', value: '11px JetBrains Mono (#6B7485)', token: 'font-mono text-[#6B7485]' },
            { property: 'Chart Card', value: 'White, 1px Gray 200 border, 12px radius, 24px padding', token: 'p-6 rounded-[12px] border-[#DDE2EA]', notes: 'Title 16px SemiBold #121722, subtitle 12px #4B5465' },
            { property: 'Axis Labels (new charts)', value: '12px Gray 600, tabular figures, thousands separators', token: 'text-[12px] text-[#4B5465] tabular-nums', notes: 'e.g. 1,284' },
            { property: 'Gridlines (new charts)', value: 'Horizontal only, 1px solid Gray 200', token: '#DDE2EA', notes: 'No chart borders, 3D, gradients or shadows on data' },
            { property: 'Bar Radius', value: '4px top corners (end corners on horizontal bars)', token: 'radius-sm', notes: 'Only the top segment of a stacked bar is rounded' },
            { property: 'Bar Gap', value: '≥ 30% of bar width', token: 'bar = 56% of band', notes: 'Grouped bars: 30% of bar width between the pair' },
            { property: 'Legend', value: 'Top-right, one row; 8px dots + 12px Gray 700 labels', token: 'w-2 h-2 rounded-full', notes: 'Wraps on mobile; never overlaps title or data; none for single-series charts' },
            { property: 'Tooltip', value: 'White, 1px Gray 200, 8px radius, elevation-2, 12px text', token: 'shadow-[0_4px_12px_rgba(11,45,107,0.12)]', notes: 'Values right-aligned in JetBrains Mono; follows the cursor and flips near edges' },
            { property: 'Hover', value: 'Hovered series / bar 100%, others 40%', token: 'opacity: 0.4', notes: 'Keyboard focus shows the same tooltip' },
            { property: 'Max Series', value: '4 per chart (pie: 2–4 slices)', token: 'MAX_SERIES = 4', notes: 'Then the same four colours at 50% opacity' },
            { property: 'Heatmap Scale', value: 'Gray 50, then Royal Blue at 20 / 40 / 70 / 100%', token: '#F7F9FC · #1E63FF', notes: '5 steps only, with a legend scale and exact counts on hover' },
            { property: 'Pie', value: '2px white separators, outside % labels on leader lines', token: 'stroke="#FFFFFF"', notes: 'Prefer the donut; pie only for 2–4 parts' },
            { property: 'Radial Gauge', value: '270° arc, Gray 200 track, Royal Blue value', token: 'stroke-width 14', notes: 'Centre value in KPI style; 2px Deep Navy target tick' },
            { property: 'Bullet Bar', value: '8px Gray 100 track, Royal Blue fill, full radius', token: 'h-2 rounded-full', notes: '2px Deep Navy target marker; percentage on the right' },
            { property: 'Sparkline', value: '32px high, 1.5px Royal Blue line, no axes', token: 'h-8', notes: 'Inside KPI tiles only' },
            { property: 'Animation', value: '300ms ease-out on first render', token: 'prefers-reduced-motion', notes: 'No animation when reduced motion is requested' },
            { property: 'Responsive', value: 'Fills card width via ResizeObserver', token: 'overflow-x-auto', notes: 'Under 768px, horizontal bar and heatmap scroll inside their own container' },
          ]}
        />
      </section>

      {/* Do & Don't Guidelines */}
      <section id="do-dont">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Data Visualization Rules
        </h2>
        <DoDontPair
          doTitle="Do respect strict series color sequence (Navy → Royal Blue → Cyan)"
          doDescription="Consistently ordering chart series enables operators across different plants and gates to instantly recognize metric hierarchies."
          doExample={
            <div className="flex gap-2">
              <span className="w-8 h-2 bg-[#0B2D6B] rounded" />
              <span className="w-8 h-2 bg-[#1E63FF] rounded" />
              <span className="w-8 h-2 bg-[#00C6FF] rounded" />
            </div>
          }
          dontTitle="Don't use arbitrary rainbow colors or default Chart.js palettes"
          dontDescription="Rainbow series like pink, lime green, and orange violate the closed palette and compromise enterprise clarity."
          dontExample={
            <div className="flex gap-2">
              <span className="w-8 h-2 bg-pink-500 rounded" />
              <span className="w-8 h-2 bg-yellow-400 rounded" />
              <span className="w-8 h-2 bg-green-500 rounded" />
            </div>
          }
        />
      </section>
    </div>
  );
};
