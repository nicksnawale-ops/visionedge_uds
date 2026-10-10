/** Table styles for settings tables (Tables standard): Overline header on Gray 50, 48px rows, Gray 50 hover. */
export const TABLE = {
  /** Scroll container: positioned so hidden labels inside can't leak width. */
  scroll: 'relative overflow-x-auto',
  table: 'w-full border-collapse text-[14px]',
  headRow: 'bg-[#F7F9FC] border-b border-[#DDE2EA]',
  th: 'h-10 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left whitespace-nowrap first:pl-4 @min-[768px]:first:pl-6 last:pr-4 @min-[768px]:last:pr-6',
  body: 'divide-y divide-[#EEF1F6]',
  row: 'hover:bg-[#F7F9FC] transition-colors',
  td: 'h-12 px-4 text-[#353D4C] whitespace-nowrap first:pl-4 @min-[768px]:first:pl-6 last:pr-4 @min-[768px]:last:pr-6',
} as const;
