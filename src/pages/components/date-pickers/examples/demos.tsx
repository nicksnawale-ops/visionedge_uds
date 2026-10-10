import React, { useState } from 'react';
import type { YearMonth } from '../calendar/MonthYearGrid';
import type { DateRange } from '../calendar/Presets';
import { DatePicker } from '../pickers/DatePicker';
import { DateRangePicker } from '../pickers/DateRangePicker';
import { DateTimePicker, type DateTimeValue } from '../pickers/DateTimePicker';
import { InlineCalendar } from '../pickers/InlineCalendar';
import { MonthPicker } from '../pickers/MonthPicker';
import { TimePicker } from '../pickers/TimePicker';
import { TimeRangePicker } from '../pickers/TimeRangePicker';
import type { PickerType } from '../pickersSpec';
import { Segmented } from '../ui/Segmented';
import { TODAY } from '../utils/dateMath';
import { formatRange, toIsoDate, toIsoIST } from '../utils/formatIST';

/** Shows what the app would send: ISO 8601 with the IST offset. */
const Sent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[12px] text-[#4B5465]">
    Sends <code className="font-mono text-[12px] text-[#121722]">{children}</code>
  </p>
);

export const SingleDateDemo: React.FC = () => {
  const [value, setValue] = useState<Date | null>(TODAY);
  return (
    <div className="flex flex-col gap-2 w-full max-w-[280px]">
      <DatePicker label="Date of joining" value={value} onChange={setValue} max={TODAY} />
      <Sent>{value ? `"${toIsoDate(value)}"` : 'null'}</Sent>
    </div>
  );
};

export const RangeDemo: React.FC = () => {
  const [value, setValue] = useState<DateRange>({ start: new Date(2026, 8, 1), end: TODAY });
  return (
    <div className="flex flex-col gap-2">
      <DateRangePicker label="Vehicle log · Date range" value={value} onChange={setValue} maxDays={90} max={TODAY} />
      <p className="text-[12px] text-[#4B5465]" aria-live="polite">
        Showing entries for {formatRange(value.start, value.end)}
      </p>
    </div>
  );
};

const CLOCKS = [
  { value: '24', label: '24-hour' },
  { value: '12', label: '12-hour' },
] as const;

export const DateTimeDemo: React.FC = () => {
  const [value, setValue] = useState<DateTimeValue | null>({ date: TODAY, minutes: 14 * 60 + 5 });
  const [clock, setClock] = useState<'24' | '12'>('24');
  return (
    <div className="flex flex-col gap-3 w-full max-w-[300px]">
      <Segmented label="Clock format" options={CLOCKS} value={clock} onChange={setClock} className="self-start" />
      <DateTimePicker label="Schedule maintenance start" value={value} onChange={setValue} hour12={clock === '12'} min={TODAY} />
      <Sent>{value ? `"${toIsoIST(value.date, value.minutes)}"` : 'null'}</Sent>
    </div>
  );
};

export const TimeDemo: React.FC = () => {
  const [from, setFrom] = useState<number | null>(12 * 60);
  const [to, setTo] = useState<number | null>(14 * 60 + 30);
  const [curfew, setCurfew] = useState<number | null>(22 * 60);
  return (
    <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
      <TimeRangePicker
        label="Lunch meal window"
        from={from}
        to={to}
        onChange={(f, t) => {
          setFrom(f);
          setTo(t);
        }}
      />
      <TimePicker label="Hostel curfew" value={curfew} onChange={setCurfew} min={20 * 60} max={23 * 60 + 30} hint="Between 20:00 and 23:30" />
    </div>
  );
};

export const MonthDemo: React.FC = () => {
  const [value, setValue] = useState<YearMonth | null>({ year: 2026, month: 8 });
  return <MonthPicker label="Monthly attendance report" value={value} onChange={setValue} />;
};

export const DEMOS: Record<PickerType, React.FC> = {
  single: SingleDateDemo,
  range: RangeDemo,
  datetime: DateTimeDemo,
  time: TimeDemo,
  month: MonthDemo,
  inline: () => <InlineCalendar />,
};
