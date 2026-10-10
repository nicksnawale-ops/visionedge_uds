import React, { useId, useState } from 'react';
import { Table2 } from 'lucide-react';
import { ChartDataTable, ChartTableData } from '../../../../components/charts/ChartDataTable';

interface ChartFrameProps {
  /** Same data as the chart, for the accessible "View as table" toggle. */
  table: ChartTableData;
  /** Let the chart use the card's full width (for charts with a minimum width). */
  bleed?: boolean;
  /** Extra content between the chart and the table toggle (e.g. companion bars). */
  after?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Lets a Charts-page component sit inside a dashboard card without a card-in-card look:
 * the chart's own ChartCard chrome (border, padding, shadow, radius, width cap) is flattened
 * and its title is kept for screen readers only (the dashboard card shows the title).
 * The legend, tooltips, hover dimming and keyboard focus are untouched.
 */
export const ChartFrame: React.FC<ChartFrameProps> = ({ table, bleed = false, after, children }) => {
  const [showTable, setShowTable] = useState(false);
  const tableId = useId();

  return (
    <div>
      <div
        className={`[&>div]:border-0! [&>div]:shadow-none! [&>div]:p-0! [&>div]:rounded-none! [&>div]:max-w-none! [&>div]:bg-transparent! [&_h3]:sr-only [&_h3+p]:sr-only ${
          bleed ? '-mx-4 @min-[768px]:-mx-6' : ''
        }`}
      >
        {children}
      </div>
      {after}
      <button
        type="button"
        aria-expanded={showTable}
        aria-controls={tableId}
        onClick={() => setShowTable((v) => !v)}
        className="mt-3 inline-flex items-center gap-2 h-11 px-3 -ml-3 rounded-[8px] text-[13px] font-semibold text-[#1E63FF] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
      >
        <Table2 className="w-4 h-4" aria-hidden="true" />
        {showTable ? 'Hide table' : 'View as table'}
      </button>
      {showTable && (
        <div id={tableId} className="mt-2 max-h-80 overflow-auto">
          <ChartDataTable data={table} />
        </div>
      )}
    </div>
  );
};
