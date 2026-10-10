import React from 'react';
import { Calendar } from '../calendar/Calendar';
import { DatePicker } from '../pickers/DatePicker';
import { InlineCalendar } from '../pickers/InlineCalendar';
import { END_BEFORE_START } from '../pickers/DateRangePicker';
import { OVERLINE, SURFACE } from '../ui/styles';
import { TODAY } from '../utils/dateMath';
import { DATE_FORMAT_ERROR } from '../utils/parseInput';

const noop = () => undefined;
const MIN = new Date(2026, 8, 10);

const Popover: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className={`${SURFACE} p-4 w-[312px] max-w-full`}>{children}</div>;
const Closed: React.FC = () => <p className="text-[13px] text-[#6B7485]">Popover closed</p>;

interface Row {
  state: string;
  note: string;
  field: React.ReactNode;
  popover: React.ReactNode;
}

const ROWS: Row[] = [
  { state: 'Default', note: 'Empty field, placeholder DD/MM/YYYY.', field: <DatePicker label="Date of joining" value={null} onChange={noop} />, popover: <Closed /> },
  { state: 'Hover', note: 'Border darkens to Gray 600.', field: <DatePicker label="Date of joining" value={TODAY} onChange={noop} force="hover" />, popover: <Closed /> },
  {
    state: 'Focus / open',
    note: 'Royal Blue border + 20% ring while the popover is open.',
    field: <DatePicker label="Date of joining" value={TODAY} onChange={noop} force="focus" />,
    popover: (
      <Popover>
        <Calendar value={TODAY} onSelect={noop} />
      </Popover>
    ),
  },
  { state: 'Filled', note: 'Display format "30 Sep 2026".', field: <DatePicker label="Date of joining" value={new Date(2026, 5, 15)} onChange={noop} />, popover: <Closed /> },
  {
    state: 'Error',
    note: '2px Deep Navy border, alert icon and message.',
    field: (
      <div className="flex flex-col gap-4 w-full max-w-[280px]">
        <DatePicker label="Date of joining" value={null} onChange={noop} defaultText="31/02/2026" error={DATE_FORMAT_ERROR} className="w-full" />
        <DatePicker label="End date" value={null} onChange={noop} defaultText="25/08/2026" error={END_BEFORE_START} className="w-full" />
      </div>
    ),
    popover: <Closed />,
  },
  { state: 'Disabled', note: 'Gray 100 fill, Gray 300 border, no popover.', field: <DatePicker label="Date of joining" value={TODAY} onChange={noop} disabled />, popover: <Closed /> },
  { state: 'Read-only', note: 'Gray 50 fill, value selectable, no calendar button.', field: <DatePicker label="Date of joining" value={TODAY} onChange={noop} readOnly />, popover: <Closed /> },
  {
    state: 'With min/max limits',
    note: 'Days outside the limits are disabled with a reason on hover.',
    field: <DatePicker label="Inspection date" value={new Date(2026, 8, 18)} onChange={noop} min={MIN} max={TODAY} hint="Between 10 Sep and 30 Sep 2026" />,
    popover: (
      <Popover>
        <Calendar value={new Date(2026, 8, 18)} onSelect={noop} min={MIN} max={TODAY} />
      </Popover>
    ),
  },
  { state: 'Loading markers', note: 'Inline calendar shows skeleton dots until event data arrives.', field: <p className="text-[13px] text-[#6B7485]">Inline calendar (no field)</p>, popover: <InlineCalendar loading calendarOnly /> },
];

/** Field and popover side by side for every state. */
export const StateMatrix: React.FC = () => (
  <div className="rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)] divide-y divide-[#DDE2EA]">
    <div className="hidden xl:grid grid-cols-[160px_minmax(0,1fr)_320px] gap-6 px-5 py-2.5 bg-[#F7F9FC] rounded-t-[12px]">
      <span className={OVERLINE}>State</span>
      <span className={OVERLINE}>Field</span>
      <span className={OVERLINE}>Popover</span>
    </div>
    {ROWS.map((r) => (
      <div
        key={r.state}
        className="grid grid-cols-1 md:grid-cols-[160px_minmax(0,1fr)] xl:grid-cols-[160px_minmax(0,1fr)_320px] gap-4 md:gap-x-6 px-5 py-5"
      >
        <div>
          <h3 className="text-[14px] font-semibold text-[#121722]">{r.state}</h3>
          <p className="text-[13px] leading-[18px] text-[#4B5465] mt-0.5">{r.note}</p>
        </div>
        <div className="min-w-0">{r.field}</div>
        <div className="min-w-0 md:col-start-2 xl:col-start-auto">{r.popover}</div>
      </div>
    ))}
  </div>
);
