import type { SpecRow } from '../../../components/common/SpecTable';

export type PickerType = 'single' | 'range' | 'datetime' | 'time' | 'month' | 'inline';

export const PICKER_TYPES: ReadonlyArray<{ id: PickerType; label: string; useWhen: string }> = [
  { id: 'single', label: 'Single date', useWhen: 'Use when the user knows one exact date, e.g. "Date of joining" on a staff or student record.' },
  { id: 'range', label: 'Date range', useWhen: 'Use when filtering logs or reports by a period, e.g. "Vehicle log · Date range" above the ANPR entries table.' },
  { id: 'datetime', label: 'Date & time', useWhen: 'Use when an exact moment matters, e.g. "Schedule maintenance start" for the Gate 3 camera.' },
  { id: 'time', label: 'Time', useWhen: 'Use when only the time of day matters, e.g. the Meal Pulse "Lunch meal window" or a hostel curfew.' },
  { id: 'month', label: 'Month', useWhen: 'Use when the report covers a whole month, e.g. "Monthly attendance report".' },
  { id: 'inline', label: 'Inline calendar', useWhen: 'Use when users browse days that have activity, e.g. the "Recordings calendar" on a camera details panel.' },
];

export const TYPE_DETAILS: Record<PickerType, { title: string; points: string[] }> = {
  single: {
    title: 'Single date picker',
    points: [
      '40px field, label above, CalendarDays Ghost icon button on the right; displays "30 Sep 2026".',
      'Type DD/MM/YYYY (slashes are inserted for you) or open the one-month calendar.',
      'Footer: Ghost "Today" (left) and "Clear" (right). Selecting a day closes the popover.',
    ],
  },
  range: {
    title: 'Date range picker with presets',
    points: [
      'Secondary-style trigger with CalendarRange icon: "01 Sep – 30 Sep 2026".',
      'Presets (160px): Today, Yesterday, Last 7 days, Last 30 days, This month, Last month, Custom range.',
      'Typed start/end inputs above two months. Hover previews the range while choosing the end date.',
      'Footer summary ("30 days selected"), Ghost "Cancel", Primary Small "Apply". Nothing changes until Apply.',
      'Max 90 days (configurable): days beyond the limit are disabled with "Choose a range of 90 days or less". Future dates are disabled for logs.',
    ],
  },
  datetime: {
    title: 'Date & time picker',
    points: [
      'One field: "30 Sep 2026, 14:05" with an IST suffix; typed DD/MM/YYYY HH:MM also works.',
      'Popover: calendar + Hour and Min columns (15-minute steps by default) + "IST (UTC+05:30)".',
      '24-hour by default; the 12-hour variant adds an AM/PM segmented control. Applies on Apply.',
    ],
  },
  time: {
    title: 'Time picker & time range',
    points: [
      '40px field "14:30" with a Clock icon; list in 15-minute steps scrolls to the current value.',
      'Typed HH:MM (24h) is allowed. Optional min/max: options outside are disabled.',
      'Time range pair "From 12:00 – To 14:30" validates "End time must be after start time".',
    ],
  },
  month: {
    title: 'Month picker',
    points: ['Field shows "Sep 2026".', 'Popover: year header with Prev/Next and a 3×4 month grid (64×40 cells).', 'Future months are disabled for reports on past data.'],
  },
  inline: {
    title: 'Inline calendar',
    points: [
      'Full month inside a 320px card, no popover.',
      '4px Cyan dot = has events, 4px Deep Navy dot = has alerts (max 2 dots), tooltip "12 events · 1 alert" and screen-reader text.',
      'Clicking a day filters the list beside it. While markers load, days show skeleton dots.',
    ],
  },
};

export const CHOOSING: ReadonlyArray<[need: string, use: string, example: string]> = [
  ['One known date', 'Single date picker', 'Date of joining'],
  ['A period for logs or reports', 'Date range with presets', 'Vehicle log filter'],
  ['An exact moment', 'Date & time picker', 'Maintenance start'],
  ['Time of day only', 'Time picker / time range', 'Meal window, curfew'],
  ['A whole month', 'Month picker', 'Monthly report'],
  ['Browsing days with activity', 'Inline calendar', 'Recordings calendar'],
  ['Quick fixed periods on dashboards', 'Segmented control (Today · 7 days · 30 days), not a picker', 'Dashboard KPI period'],
];

export const SPEC_ROWS: SpecRow[] = [
  { property: 'Field height', value: '40px', token: 'h-10' },
  { property: 'Popover radius', value: '12px', token: 'rounded-[12px]' },
  { property: 'Popover padding', value: '16px', token: 'p-4' },
  { property: 'Popover elevation', value: '0 4px 12px rgba(11,45,107,0.12)', token: 'elevation-2' },
  { property: 'Popover width', value: 'Single 312px · range with presets ≈716px', token: 'w-[312px] / w-[716px]' },
  { property: 'Day cell', value: '36×36px (40×40 touch), 8px radius', token: 'w-9 h-9 rounded-[8px]' },
  { property: 'Today', value: '1px Royal Blue border, Royal Blue text', token: 'border-[#1E63FF] text-[#1E63FF]' },
  { property: 'Selected', value: 'Royal Blue fill, White SemiBold', token: 'bg-[#1E63FF] text-white' },
  { property: 'Range band', value: 'Royal Blue 8%, rounded only at the ends', token: 'bg-[#1E63FF]/[0.08]' },
  { property: 'Disabled day', value: 'Gray 300 text, no hover, not-allowed', token: 'text-[#C3CAD5]' },
  { property: 'Outside-month day', value: 'Gray 400, selectable', token: 'text-[#8C95A6]' },
  { property: 'Weekday row', value: 'Overline 11px, Gray 500', token: 'text-[11px] text-[#6B7485]' },
  { property: 'Presets column', value: '160px; active Royal Blue 8% + Royal Blue text', token: 'w-[160px]' },
  { property: 'Time step', value: '15 minutes', token: 'step={15}' },
  { property: 'Event dot', value: '4px · Cyan events / Deep Navy alerts', token: 'w-1 h-1 bg-[#00C6FF] / bg-[#0B2D6B]' },
  { property: 'Max range', value: '90 days (configurable)', token: 'maxDays={90}' },
  { property: 'Week start', value: 'Monday', token: 'Mo Tu We Th Fr Sa Su' },
  { property: 'Time zone', value: 'IST (UTC+05:30); ISO 8601 with offset', token: '+05:30' },
];

export const DO_DONT: ReadonlyArray<{ id: string; doText: string; dontText: string }> = [
  { id: 'presets', doText: 'Offer presets for common ranges like "Last month".', dontText: 'Make users click through 30 days to pick last month.' },
  { id: 'typing', doText: 'Allow typing as well as picking.', dontText: 'Force calendar-only entry for known dates like date of birth.' },
  { id: 'disable', doText: 'Disable impossible dates and explain why.', dontText: 'Let users pick future dates for past logs, then show an error.' },
  { id: 'zone', doText: 'Show the time zone (IST) with times.', dontText: 'Show times without a zone in multi-site systems.' },
  { id: 'apply', doText: 'Apply ranges with an explicit "Apply".', dontText: 'Reload heavy tables on every click inside the calendar.' },
  { id: 'format', doText: 'Use "30 Sep 2026" for display.', dontText: 'Use ambiguous formats like 09/10/26.' },
];

export const A11Y_RULES: ReadonlyArray<[title: string, text: string]> = [
  ['Trigger', 'Has a visible label, aria-haspopup="dialog" and aria-expanded. The time picker input is a combobox with aria-controls and aria-activedescendant.'],
  ['Popover', 'role="dialog" with an aria-label ("Choose date"). Focus moves into it, Tab cycles inside, Esc closes and returns focus to the trigger.'],
  ['Calendar grid', 'role="grid" labelled by the month heading; gridcells carry aria-selected; today has aria-current="date"; unavailable days use aria-disabled with the reason in the label.'],
  ['Announcements', 'Month changes are announced politely ("October 2026"); the range summary updates in a polite live region.'],
  ['Event dots', 'Each day label includes "12 events, 1 alert" so the dots have a text equivalent.'],
  ['Targets & contrast', 'Day cells are 40×40 on touch; text meets AA (Gray 700 on White 10.9:1, White on Royal Blue 4.9:1).'],
  ['Mobile (<768px)', 'Popovers open as a bottom sheet (full width, 16px top radius, drag handle). The range picker stacks months and turns presets into a chip row.'],
];

export const KEYBOARD: ReadonlyArray<[keys: string, action: string]> = [
  ['← / →', 'Previous / next day'],
  ['↑ / ↓', 'Same day previous / next week'],
  ['PageUp / PageDown', 'Previous / next month'],
  ['Shift + PageUp / PageDown', 'Previous / next year'],
  ['Home / End', 'Start / end of the week (Monday / Sunday)'],
  ['Enter / Space', 'Select the focused day'],
  ['Esc', 'Close the popover (or the month grid) and return focus to the trigger'],
  ['Tab / Shift + Tab', 'Cycle presets, inputs, calendar and footer actions'],
  ['Alt + ↓', 'Open the calendar from a date input'],
];
