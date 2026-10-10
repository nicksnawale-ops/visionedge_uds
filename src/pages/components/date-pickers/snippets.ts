import type { PickerType } from './pickersSpec';

const DAY_CELL = `// Day cell recipe (36×36, 40×40 on touch)
const day = 'w-9 h-9 rounded-[8px] text-[14px] tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2';
const tone = {
  default:  'text-[#353D4C] hover:bg-[#EEF1F6]',
  today:    'border border-[#1E63FF] text-[#1E63FF]',
  selected: 'bg-[#1E63FF] text-white font-semibold',
  inRange:  'text-[#121722]',               // cell sits on a bg-[#1E63FF]/[0.08] band
  outside:  'text-[#8C95A6]',
  disabled: 'text-[#C3CAD5] cursor-not-allowed', // aria-disabled + reason tooltip
};`;

export const SNIPPETS: Record<PickerType, string> = {
  single: `import { DatePicker } from './pickers/DatePicker';

// "Today" is fixed to 30 Sep 2026 in the demos.
const [joined, setJoined] = useState<Date | null>(new Date(2026, 8, 30));

<DatePicker
  label="Date of joining"
  value={joined}            // shows "30 Sep 2026"
  onChange={setJoined}      // typed DD/MM/YYYY or picked
  max={TODAY}               // future days disabled with a reason
/>

// Field: 40px, label above, CalendarDays Ghost icon button
<div className="h-10 flex items-center rounded-[8px] border border-[#8C95A6] bg-white
                hover:border-[#4B5465] focus-within:border-[#1E63FF] focus-within:ring-2 focus-within:ring-[#1E63FF]/20">
  <input placeholder="DD/MM/YYYY" className="flex-1 px-3 text-[14px] bg-transparent outline-none" />
  <button aria-label="Choose date" aria-haspopup="dialog" aria-expanded={open}
          className="w-8 h-8 mr-1 rounded-[8px] text-[#4B5465] hover:bg-[#EEF1F6]">
    <CalendarDays className="w-4 h-4" />
  </button>
</div>

${DAY_CELL}`,
  range: `import { DateRangePicker } from './pickers/DateRangePicker';

const [range, setRange] = useState({ start: new Date(2026, 8, 1), end: new Date(2026, 8, 30) });

<DateRangePicker
  label="Vehicle log · Date range"
  value={range}             // "01 Sep – 30 Sep 2026"
  onChange={setRange}       // called only on Apply
  maxDays={90}              // "Choose a range of 90 days or less"
  max={TODAY}               // no future dates for history
/>

// Popover: presets (160px) | typed inputs + two months | footer
<div role="dialog" aria-label="Choose date range"
     className="flex rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_4px_12px_rgba(11,45,107,0.12)]">
  <div className="w-[160px] p-2 border-r border-[#DDE2EA]">
    <button aria-pressed className="h-9 px-3 rounded-[8px] bg-[#1E63FF]/[0.08] text-[#1E63FF] font-semibold">Last 30 days</button>
  </div>
  {/* ...months... */}
  <footer className="flex justify-between pt-3 border-t border-[#DDE2EA]">
    <p>30 days selected</p>
    <button className="h-8 px-3 text-[#1E63FF]">Cancel</button>
    <button className="h-8 px-3 rounded-[8px] bg-[#1E63FF] text-white">Apply</button>
  </footer>
</div>

${DAY_CELL}`,
  datetime: `import { DateTimePicker } from './pickers/DateTimePicker';

const [start, setStart] = useState({ date: new Date(2026, 8, 30), minutes: 14 * 60 + 5 });

<DateTimePicker
  label="Schedule maintenance start"
  value={start}             // "30 Sep 2026, 14:05" + IST
  onChange={setStart}
  step={15}                 // minute list in 15-minute steps
  hour12={false}            // true adds an AM/PM segmented control
/>

// Send as ISO 8601 with the IST offset:
toIsoIST(start.date, start.minutes); // "2026-09-30T14:05:00+05:30"`,
  time: `import { TimePicker } from './pickers/TimePicker';
import { TimeRangePicker } from './pickers/TimeRangePicker';

<TimeRangePicker
  label="Lunch meal window"
  from={12 * 60}            // "12:00"
  to={14 * 60 + 30}         // "14:30"
  onChange={(from, to) => setWindow({ from, to })}
/>                          // "End time must be after start time"

<TimePicker
  label="Hostel curfew"
  value={22 * 60}
  onChange={setCurfew}
  min={20 * 60}
  max={23 * 60 + 30}        // other options disabled
/>

// Combobox: <input role="combobox" aria-expanded aria-controls aria-activedescendant />
// Options:  <li role="option" aria-selected className="h-9 rounded-[6px] tabular-nums" />`,
  month: `import { MonthPicker } from './pickers/MonthPicker';

const [month, setMonth] = useState({ year: 2026, month: 8 });

<MonthPicker
  label="Monthly attendance report"
  value={month}             // "Sep 2026"
  onChange={setMonth}
  pastOnly                  // future months disabled
/>

// 3×4 grid of 64×40 cells
<button className="w-16 h-10 rounded-[8px] text-[14px] bg-[#1E63FF] text-white font-semibold">Sep</button>`,
  inline: `import { InlineCalendar } from './pickers/InlineCalendar';

<InlineCalendar />           // 320px card + filtered recordings list

// Markers under the day number (max 2 dots)
<span aria-hidden="true" className="absolute bottom-[3px] left-1/2 -translate-x-1/2 flex gap-[3px]">
  <span className="w-1 h-1 rounded-full bg-[#00C6FF]" />  {/* events */}
  <span className="w-1 h-1 rounded-full bg-[#0B2D6B]" />  {/* alerts */}
</span>
// Text equivalent in the day label: "Tuesday 29 September 2026, 12 events, 1 alert"`,
};
