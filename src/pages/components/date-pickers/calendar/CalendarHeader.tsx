import React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { FOCUS } from '../ui/styles';

interface CalendarHeaderProps {
  /** "September 2026" */
  label: string;
  labelId: string;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  /** Opens the month/year grid. */
  onLabel?: () => void;
  prevLabel?: string;
  nextLabel?: string;
  touch?: boolean;
}

/** Month-year label button (14px SemiBold) between Prev/Next Ghost icon buttons (32px). */
export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  label,
  labelId,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  onLabel,
  prevLabel = 'Previous month',
  nextLabel = 'Next month',
  touch = false,
}) => {
  const spacer = <span className={touch ? 'w-10' : 'w-8'} aria-hidden="true" />;
  return (
    <div className="flex items-center justify-between gap-2 mb-2">
      {onPrev ? (
        <IconButton data-part="nav-prev" icon={ChevronLeft} label={prevLabel} touch={touch} onClick={onPrev} disabled={prevDisabled} />
      ) : (
        spacer
      )}
      {onLabel ? (
        <button
          type="button"
          data-part="header-label"
          onClick={onLabel}
          aria-label={`${label}, choose month and year`}
          className={`inline-flex items-center gap-1 ${touch ? 'h-10' : 'h-8'} px-2 rounded-[8px] text-[14px] leading-5 font-semibold text-[#121722] hover:bg-[#EEF1F6] transition-colors ${FOCUS}`}
        >
          <span id={labelId}>{label}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#4B5465]" aria-hidden="true" />
        </button>
      ) : (
        <span id={labelId} data-part="header-label" className="text-[14px] leading-5 font-semibold text-[#121722]">
          {label}
        </span>
      )}
      {onNext ? (
        <IconButton data-part="nav-next" icon={ChevronRight} label={nextLabel} touch={touch} onClick={onNext} disabled={nextDisabled} />
      ) : (
        spacer
      )}
    </div>
  );
};
