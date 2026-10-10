import React from 'react';
import { CalendarRange, CircleAlert, Inbox, RotateCw } from 'lucide-react';

export type ChartStatus = 'ready' | 'loading' | 'empty' | 'error';

interface ChartStateProps {
  status: ChartStatus;
  /** Height of the plot area the state replaces, so the card does not jump. */
  height?: number;
  onRetry?: () => void;
  onChangeRange?: () => void;
  children?: React.ReactNode;
}

const SKELETON_BARS = [55, 80, 40, 95, 65, 75, 50];

/** Wraps a chart body and swaps in Loading, Empty or Error states. */
export const ChartState: React.FC<ChartStateProps> = ({
  status,
  height = 240,
  onRetry,
  onChangeRange,
  children,
}) => {
  if (status === 'ready') return <>{children}</>;

  if (status === 'loading') {
    return (
      <div role="status" aria-live="polite" className="flex flex-col" style={{ height }}>
        <span className="sr-only">Loading chart data</span>
        <div className="flex-1 flex items-end gap-[6%] px-2 border-b border-[#EEF1F6] motion-safe:animate-pulse">
          {SKELETON_BARS.map((h, i) => (
            <div key={i} className="flex-1 bg-[#EEF1F6] rounded-t-[4px]" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="flex justify-between gap-2 pt-2 px-2 motion-safe:animate-pulse">
          {SKELETON_BARS.map((_, i) => (
            <div key={i} className="h-2.5 flex-1 mx-1 bg-[#EEF1F6] rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  const isEmpty = status === 'empty';
  const Icon = isEmpty ? Inbox : CircleAlert;

  return (
    <div
      role={isEmpty ? 'status' : 'alert'}
      className="flex flex-col items-center justify-center text-center gap-3 px-4"
      style={{ height }}
    >
      <div className="w-10 h-10 rounded-full bg-[#F7F9FC] border border-[#DDE2EA] flex items-center justify-center">
        <Icon className={`w-5 h-5 ${isEmpty ? 'text-[#6B7485]' : 'text-[#0B2D6B]'}`} aria-hidden="true" />
      </div>
      <p className="text-[14px] font-semibold text-[#121722]">
        {isEmpty ? 'No data for this period' : "Couldn't load data"}
      </p>
      {isEmpty ? (
        <button
          type="button"
          onClick={onChangeRange}
          className="h-[36px] px-3 rounded-[8px] text-[#1E63FF] font-semibold text-[14px] whitespace-nowrap hover:bg-[#EEF1F6] hover:text-[#0B2D6B] transition-all flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
        >
          <CalendarRange className="w-4 h-4" aria-hidden="true" />
          Change date range
        </button>
      ) : (
        <button
          type="button"
          onClick={onRetry}
          className="h-[36px] px-4 rounded-[8px] bg-white border border-[#1E63FF] text-[#1E63FF] font-semibold text-[14px] whitespace-nowrap hover:bg-[#F7F9FC] hover:border-[#0B2D6B] hover:text-[#0B2D6B] transition-all flex items-center gap-2 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
        >
          <RotateCw className="w-4 h-4" aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  );
};
