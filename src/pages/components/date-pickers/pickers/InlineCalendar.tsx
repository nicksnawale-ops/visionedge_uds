import React, { useId, useState } from 'react';
import { Calendar } from '../calendar/Calendar';
import { markerText } from '../calendar/DayCell';
import { recordingMarkers, recordingsFor } from '../examples/sampleData';
import { OVERLINE } from '../ui/styles';
import { TODAY } from '../utils/dateMath';
import { TZ_SHORT, formatDate } from '../utils/formatIST';

interface InlineCalendarProps {
  /** Markers still loading: skeleton dots. */
  loading?: boolean;
  /** Hide the adjacent list (state matrix). */
  calendarOnly?: boolean;
}

const Dot: React.FC<{ className: string }> = ({ className }) => <span className={`inline-block w-1 h-1 rounded-full ${className}`} aria-hidden="true" />;

/** Embedded month (no popover) with event dots; clicking a day filters the recordings list beside it. */
export const InlineCalendar: React.FC<InlineCalendarProps> = ({ loading = false, calendarOnly = false }) => {
  const uid = useId();
  const [day, setDay] = useState<Date>(TODAY);
  const items = loading ? [] : recordingsFor(day);
  const m = loading ? null : recordingMarkers(day);

  const card = (
    <div className="w-[320px] max-w-full shrink-0 rounded-[12px] border border-[#DDE2EA] bg-white p-4 shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
      <div className="mb-3">
        <p className={OVERLINE}>Recordings calendar</p>
        <p className="text-[14px] font-semibold text-[#121722]">CAM-04 · Main gate</p>
      </div>
      <Calendar
        value={day}
        onSelect={setDay}
        max={TODAY}
        maxReason="No recordings for future dates"
        markers={recordingMarkers}
        loadingMarkers={loading}
        density="fluid"
      />
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#DDE2EA] text-[12px] text-[#4B5465]">
        <span className="inline-flex items-center gap-1.5">
          <Dot className="bg-[#00C6FF]" /> Has events
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Dot className="bg-[#0B2D6B]" /> Has alerts
        </span>
      </div>
    </div>
  );

  if (calendarOnly) return card;

  return (
    <div className="flex flex-wrap items-start gap-4 w-full max-w-[720px]">
      {card}
      <section aria-labelledby={`${uid}-h`} className="flex-1 min-w-[260px] rounded-[12px] border border-[#DDE2EA] bg-white">
        <div className="px-4 py-3 border-b border-[#DDE2EA]">
          <h3 id={`${uid}-h`} className="text-[14px] font-semibold text-[#121722]">
            {formatDate(day)}
          </h3>
          <p className="text-[12px] text-[#4B5465]" aria-live="polite">
            {loading ? 'Loading recordings…' : m ? markerText(m) : 'No recordings on this day'}
          </p>
        </div>
        {loading ? (
          <ul className="p-4 flex flex-col gap-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <li key={i} className="h-9 rounded-[8px] bg-[#EEF1F6] motion-safe:animate-pulse" />
            ))}
          </ul>
        ) : (
          <ul className="divide-y divide-[#DDE2EA]">
            {items.map((r) => (
              <li key={r.id} className="flex items-start gap-3 px-4 py-3">
                <span className="font-mono text-[13px] font-medium text-[#121722] tabular-nums pt-px">
                  {r.time} <span className="text-[11px] text-[#6B7485]">{TZ_SHORT}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] text-[#121722] truncate">{r.title}</span>
                  <span className="block text-[12px] text-[#4B5465]">{r.camera}</span>
                </span>
                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    r.kind === 'alert' ? 'bg-[#0B2D6B] text-white' : 'bg-[#00C6FF]/15 text-[#0B2D6B]'
                  }`}
                >
                  {r.kind === 'alert' ? 'Alert' : 'Event'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
