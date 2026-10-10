import React, { useEffect, useId, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Check, Code2, Eye, Table2, X } from 'lucide-react';
import { CodeBlock } from '../common/CodeBlock';
import { ChartDataTable, ChartTableData } from './ChartDataTable';

export type ChartCategory = 'trend' | 'comparison' | 'composition' | 'distribution' | 'kpi';

export const CHART_CATEGORIES: { id: ChartCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'trend', label: 'Trend' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'composition', label: 'Composition' },
  { id: 'distribution', label: 'Distribution' },
  { id: 'kpi', label: 'KPI & Progress' },
];

export interface ChartEntry {
  /** Used in the URL hash: #chart=<id> */
  id: string;
  label: string;
  category: ChartCategory;
  icon: LucideIcon;
  /** Rendered only while selected, so each chart animates in on selection. */
  render: () => React.ReactNode;
  code: string;
  whenToUse: string;
  whenNotToUse: string;
  table: ChartTableData;
}

const HASH_KEY = 'chart';

const readHashChart = (): string | null => {
  const match = window.location.hash.match(new RegExp(`${HASH_KEY}=([\\w-]+)`));
  return match ? match[1] : null;
};

const writeHashChart = (id: string) => {
  const { pathname, search } = window.location;
  window.history.replaceState(window.history.state, '', `${pathname}${search}#${HASH_KEY}=${id}`);
};

interface ChartShowcaseProps {
  charts: ChartEntry[];
}

/** Showcase card for the Charts page: category chips, wrapping chart tabs and a Preview / Code toggle. */
export const ChartShowcase: React.FC<ChartShowcaseProps> = ({ charts }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const tableId = useId();

  const [category, setCategory] = useState<ChartCategory | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string>(() => {
    const fromHash = readHashChart();
    return charts.some((c) => c.id === fromHash) ? (fromHash as string) : charts[0].id;
  });
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [showTable, setShowTable] = useState(false);

  // A shared link (#chart=…) scrolls the showcase into view, and back/forward hash edits re-select.
  useEffect(() => {
    if (readHashChart()) rootRef.current?.scrollIntoView({ block: 'start' });
    const onHashChange = () => {
      const chart = charts.find((c) => c.id === readHashChart());
      if (!chart) return;
      setSelectedId(chart.id);
      // Make sure the linked chart's tab is visible under the active filter.
      setCategory((cat) => (cat === 'all' || cat === chart.category ? cat : 'all'));
      rootRef.current?.scrollIntoView({ block: 'start' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []); // Mount only: `charts` is rebuilt on every page render.

  const visible = category === 'all' ? charts : charts.filter((c) => c.category === category);
  const current = charts.find((c) => c.id === selectedId) ?? charts[0];

  const selectChart = (id: string) => {
    setSelectedId(id);
    setShowTable(false);
    writeHashChart(id);
  };

  const selectCategory = (next: ChartCategory | 'all') => {
    setCategory(next);
    const inCategory = next === 'all' ? charts : charts.filter((c) => c.category === next);
    if (!inCategory.some((c) => c.id === selectedId) && inCategory.length > 0) selectChart(inCategory[0].id);
  };

  return (
    <div
      ref={rootRef}
      className="scroll-mt-24 rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden shadow-[0_1px_3px_rgba(11,45,107,0.08)]"
    >
      {/* Picker */}
      <div className="border-b border-[#DDE2EA] bg-white px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div role="group" aria-label="Filter charts by category" className="flex flex-wrap items-center gap-1.5">
            {CHART_CATEGORIES.map((cat) => {
              const isActive = cat.id === category;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => selectCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] ${
                    isActive ? 'bg-[#1E63FF]/[0.08] text-[#1E63FF]' : 'text-[#4B5465] hover:bg-[#F7F9FC]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Preview vs Code toggle (same pattern as PreviewPanel) */}
          <div className="flex items-center p-0.5 bg-[#EEF1F6] rounded-[6px] ml-auto border border-[#DDE2EA]">
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded transition-colors ${
                viewMode === 'preview'
                  ? 'bg-white text-[#121722] shadow-sm font-semibold'
                  : 'text-[#4B5465] hover:text-[#121722]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded transition-colors ${
                viewMode === 'code'
                  ? 'bg-white text-[#121722] shadow-sm font-semibold'
                  : 'text-[#4B5465] hover:text-[#121722]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>
          </div>
        </div>

        <div role="tablist" aria-label="Charts" className="flex flex-wrap gap-x-1 -mb-px">
          {visible.map((chart) => {
            const isActive = chart.id === current.id;
            const Icon = chart.icon;
            return (
              <button
                key={chart.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId}
                onClick={() => selectChart(chart.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-[14px] font-medium border-b-2 transition-colors outline-none focus-visible:bg-[#F7F9FC] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E63FF] ${
                  isActive
                    ? 'text-[#1E63FF] border-[#1E63FF]'
                    : 'text-[#4B5465] border-transparent hover:text-[#121722]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                {chart.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div id={panelId} role="tabpanel" aria-label={current.label}>
        {viewMode === 'preview' ? (
          <div className="preview-grid-canvas p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-[220px]">
            <div key={current.id} className="w-full min-w-0 flex items-center justify-center">
              {current.render()}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-[#F7F9FC]">
            <CodeBlock code={current.code} filename={`${current.label}.tsx`} />
          </div>
        )}

        {/* Guidance + table view */}
        <div className="border-t border-[#DDE2EA] px-4 sm:px-6 py-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-8">
            <p className="flex items-start gap-2 text-[13px] leading-[20px] text-[#353D4C] flex-1">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-[#00C6FF]/15 text-[#0B2D6B] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" aria-hidden="true" />
              </span>
              <span>
                <span className="font-semibold text-[#121722]">When to use: </span>
                {current.whenToUse}
              </span>
            </p>
            <p className="flex items-start gap-2 text-[13px] leading-[20px] text-[#353D4C] flex-1">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-[#121722]/10 text-[#121722] flex items-center justify-center shrink-0">
                <X className="w-3 h-3" aria-hidden="true" />
              </span>
              <span>
                <span className="font-semibold text-[#121722]">When not to use: </span>
                {current.whenNotToUse}
              </span>
            </p>
          </div>

          <button
            type="button"
            aria-expanded={showTable}
            aria-controls={tableId}
            onClick={() => setShowTable((v) => !v)}
            className="inline-flex items-center gap-2 h-[32px] px-3 rounded-[8px] text-[#1E63FF] font-semibold text-[13px] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
          >
            <Table2 className="w-4 h-4" aria-hidden="true" />
            {showTable ? 'Hide table' : 'View as table'}
          </button>

          {showTable && (
            <div id={tableId}>
              <ChartDataTable data={current.table} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
