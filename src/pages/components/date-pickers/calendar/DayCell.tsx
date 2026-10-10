import React from 'react';
import { dateKey } from '../utils/dateMath';
import { formatDayLabel } from '../utils/formatIST';

export interface DayMarkers {
  events: number;
  alerts: number;
}

export interface DayState {
  date: Date;
  outside: boolean;
  today: boolean;
  selected: boolean;
  /** Strictly between start and end (or the hover preview end). */
  inRange: boolean;
  /** Range start/end cells that carry half of the band. */
  bandStart: boolean;
  bandEnd: boolean;
  /** Hover-preview end while choosing the end date. */
  previewEnd: boolean;
  disabledReason: string | null;
  markers: DayMarkers | null;
  loadingMarkers: boolean;
  /** Roving tabindex: the one day cell in the Tab order. */
  focusable: boolean;
  autoFocus: boolean;
}

interface DayCellProps {
  state: DayState;
  touch: boolean;
  tdClass: string;
  onSelect: (d: Date) => void;
  onKey: (e: React.KeyboardEvent, d: Date) => void;
  onHover: (d: Date | null) => void;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** Text equivalent of the event dots: "12 events · 1 alert". */
export const markerText = (m: DayMarkers): string =>
  [m.events ? plural(m.events, 'event') : '', m.alerts ? plural(m.alerts, 'alert') : ''].filter(Boolean).join(' · ');

const tone = (s: DayState): string => {
  if (s.disabledReason) return 'text-[#C3CAD5] cursor-not-allowed';
  if (s.selected) return 'bg-[#1E63FF] text-white font-semibold hover:bg-[#0B2D6B]';
  if (s.previewEnd) return 'border border-dashed border-[#1E63FF] text-[#121722]';
  if (s.today) return `border border-[#1E63FF] text-[#1E63FF] font-medium ${s.inRange ? 'hover:bg-[#1E63FF]/[0.12]' : 'hover:bg-[#EEF1F6]'}`;
  if (s.inRange) return 'text-[#121722] hover:bg-[#1E63FF]/[0.12]';
  if (s.outside) return 'text-[#8C95A6] hover:bg-[#EEF1F6]';
  return 'text-[#353D4C] hover:bg-[#EEF1F6]';
};

/** 36×36 day (40×40 on touch), 8px radius, 14px tabular numbers. */
export const DayCell: React.FC<DayCellProps> = ({ state: s, touch, tdClass, onSelect, onKey, onHover }) => {
  const disabled = !!s.disabledReason;
  const hasMarkers = !!s.markers && (s.markers.events > 0 || s.markers.alerts > 0);
  const tip = disabled ? s.disabledReason : hasMarkers && s.markers ? markerText(s.markers) : null;
  const band = s.inRange || s.bandStart || s.bandEnd;
  const label = [
    formatDayLabel(s.date),
    s.today ? 'today' : '',
    hasMarkers && s.markers ? markerText(s.markers).replace(' · ', ', ') : '',
    disabled ? `unavailable: ${s.disabledReason}` : '',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <td role="gridcell" aria-selected={s.selected} className={`relative p-0 text-center align-middle group/day ${tdClass}`}>
      {band && (
        <span
          aria-hidden="true"
          className={`absolute top-[2px] bottom-[2px] bg-[#1E63FF]/[0.08] ${
            s.bandStart && !s.bandEnd ? 'left-1/2 right-0' : s.bandEnd && !s.bandStart ? 'left-0 right-1/2' : 'inset-x-0'
          }`}
        />
      )}
      <button
        type="button"
        data-date={dateKey(s.date)}
        data-today={s.today || undefined}
        data-selected={s.selected || undefined}
        data-in-range={s.inRange || undefined}
        data-autofocus={s.autoFocus || undefined}
        tabIndex={s.focusable ? 0 : -1}
        aria-label={label}
        aria-current={s.today ? 'date' : undefined}
        aria-disabled={disabled || undefined}
        onClick={() => {
          if (!disabled) onSelect(s.date);
        }}
        onKeyDown={(e) => onKey(e, s.date)}
        onMouseEnter={() => onHover(disabled ? null : s.date)}
        onFocus={() => onHover(disabled ? null : s.date)}
        className={`relative z-[1] mx-auto flex items-center justify-center rounded-[8px] text-[14px] leading-5 tabular-nums transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2 ${
          touch ? 'w-10 h-10' : 'w-9 h-9'
        } ${tone(s)}`}
      >
        {s.date.getDate()}
        {s.loadingMarkers ? (
          <span aria-hidden="true" className="absolute bottom-[3px] left-1/2 -translate-x-1/2 flex gap-[3px]">
            <span className="w-1 h-1 rounded-full bg-[#DDE2EA] motion-safe:animate-pulse" />
            <span className="w-1 h-1 rounded-full bg-[#DDE2EA] motion-safe:animate-pulse" />
          </span>
        ) : (
          hasMarkers &&
          s.markers && (
            <span aria-hidden="true" className="absolute bottom-[3px] left-1/2 -translate-x-1/2 flex gap-[3px]">
              {s.markers.events > 0 && <span className="w-1 h-1 rounded-full bg-[#00C6FF]" />}
              {s.markers.alerts > 0 && <span className={`w-1 h-1 rounded-full ${s.selected ? 'bg-white' : 'bg-[#0B2D6B]'}`} />}
            </span>
          )
        )}
      </button>
      {tip && !touch && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-20 whitespace-nowrap px-2 py-1 rounded-[4px] bg-[#1F2633] text-white text-[12px] leading-4 font-normal hidden group-hover/day:block group-focus-within/day:block"
        >
          {tip}
        </span>
      )}
    </td>
  );
};
