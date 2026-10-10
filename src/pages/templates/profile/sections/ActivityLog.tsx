import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, ListFilter, Search } from 'lucide-react';
import { Segmented } from '../../dashboard/primitives';
import { useProfile } from '../ProfileContext';
import { ACTIVITY_RANGES, ACTIVITY_TYPES, ActivityRange, ActivityRow } from '../data/activity';
import { ProfileSelect } from '../parts/ProfileSelect';
import { BUTTON, Badge, IconButton, MONO, ProfileCard } from '../ui';

const PAGE_SIZES = [10, 25, 50] as const;
const events = (n: number) => `${n} event${n === 1 ? '' : 's'}`;
const TH = 'h-10 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left whitespace-nowrap';
const TD = 'h-12 px-4 text-[14px] text-[#353D4C]';

const toCsv = (rows: ActivityRow[]): string =>
  [
    ['Time (IST)', 'Event', 'Details', 'Device', 'IP', 'Result'],
    ...rows.map((r) => [r.time, r.event, r.details, r.device, r.ip, r.result]),
  ]
    .map((cells) => cells.map((c) => `"${c.replace(/"/g, '""')}"`).join(','))
    .join('\n');

export const ActivityLog: React.FC = () => {
  const uid = useId();
  const { activity, toast, announce, marker, viewer, name } = useProfile();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<string>('all');
  const [range, setRange] = useState<ActivityRange>('30d');
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10);
  const [page, setPage] = useState(0);

  useEffect(() => setPage(0), [query, type, range, pageSize]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const maxDay = ACTIVITY_RANGES.find((r) => r.id === range)?.days ?? 29;
    return activity.filter(
      (r) =>
        r.day <= maxDay &&
        (type === 'all' || r.type === type) &&
        (!q || [r.event, r.details, r.device, r.time].some((v) => v.toLowerCase().includes(q)))
    );
  }, [activity, query, type, range]);

  // Announce the result count when filters change (not on first render).
  const firstCount = useRef(true);
  useEffect(() => {
    if (firstCount.current) {
      firstCount.current = false;
      return;
    }
    announce(`${filtered.length} ${filtered.length === 1 ? 'event' : 'events'} shown`);
  }, [filtered.length]); // Only when the count changes.

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const clear = () => {
    setQuery('');
    setType('all');
    setRange('30d');
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = viewer === 'self' ? 'my-activity.csv' : `${name.toLowerCase().replace(/\s+/g, '-')}-activity.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`Exported ${filtered.length} events to CSV`, 'success');
  };

  return (
    <ProfileCard title="Activity" description={`${filtered.length} of ${activity.length} events · All times IST`} overlay={marker(6)} flush>
      {/* Filters */}
      <div className="px-4 @min-[768px]:px-6 pb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px] @min-[1024px]:flex-none @min-[1024px]:w-[220px]">
          <label htmlFor={`${uid}-q`} className="sr-only">
            Search activity
          </label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7485] pointer-events-none" aria-hidden="true" />
          <input
            id={`${uid}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full h-10 pl-9 pr-3 rounded-[8px] border border-[#8C95A6] bg-white text-[16px] @min-[640px]:text-[14px] text-[#121722] placeholder:text-[#6B7485] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20"
          />
        </div>
        <ProfileSelect
          id={`${uid}-type`}
          ariaLabel="Event type"
          filter
          size="sm"
          icon={ListFilter}
          className="min-w-[180px]"
          value={type}
          onChange={setType}
          options={[
            { value: 'all', label: 'All event types', meta: String(activity.length), srText: events(activity.length) },
            ...ACTIVITY_TYPES.map((t) => {
              const n = activity.filter((r) => r.type === t).length;
              return { value: t, label: t, meta: String(n), srText: events(n) };
            }),
          ]}
        />
        <Segmented label="Date range" options={ACTIVITY_RANGES.map((r) => ({ id: r.id, label: r.label }))} value={range} onChange={setRange} />
        <button type="button" onClick={exportCsv} disabled={filtered.length === 0} className={`${BUTTON.secondary} @min-[1024px]:ml-auto disabled:opacity-50 disabled:cursor-not-allowed`}>
          <Download className="w-4 h-4" aria-hidden="true" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto border-t border-[#DDE2EA]">
        <table className="w-full min-w-[880px] border-collapse">
          <caption className="sr-only">Activity log, {filtered.length} events</caption>
          <thead>
            <tr className="bg-[#F7F9FC] border-b border-[#DDE2EA]">
              <th scope="col" className={`${TH} @min-[768px]:pl-6`}>Time (IST)</th>
              <th scope="col" className={TH}>Event</th>
              <th scope="col" className={TH}>Details</th>
              <th scope="col" className={TH}>Device</th>
              <th scope="col" className={TH}>IP address</th>
              <th scope="col" className={`${TH} @min-[768px]:pr-6`}>Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF1F6]">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-[#F7F9FC] transition-colors">
                <td className={`${TD} @min-[768px]:pl-6 whitespace-nowrap tabular-nums`}>{r.time}</td>
                <th scope="row" className={`${TD} text-left font-medium text-[#121722] whitespace-nowrap`}>
                  {r.event}
                </th>
                <td className={`${TD} min-w-[200px]`}>{r.details}</td>
                <td className={`${TD} whitespace-nowrap`}>{r.device}</td>
                <td className={`${TD} whitespace-nowrap`}>
                  <span className={MONO}>{r.ip}</span>
                </td>
                <td className={`${TD} @min-[768px]:pr-6`}>
                  {r.result === 'Success' ? <Badge tone="live">Success</Badge> : <Badge tone="critical">Failed</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-[14px] leading-[20px] font-medium text-[#121722]">No activity for these filters.</p>
            <button type="button" onClick={clear} className={`${BUTTON.ghost} mt-2`}>
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="px-4 @min-[768px]:px-6 py-3 border-t border-[#DDE2EA] flex flex-wrap items-center justify-between gap-3 text-[13px] text-[#4B5465]">
          <div className="flex items-center gap-2">
            <label id={`${uid}-size-label`} htmlFor={`${uid}-size`}>
              Rows per page
            </label>
            <ProfileSelect
              id={`${uid}-size`}
              labelledBy={`${uid}-size-label`}
              size="sm"
              className="w-20"
              popoverMinWidth={80}
              placement="above"
              value={String(pageSize)}
              onChange={(v) => setPageSize(Number(v) as (typeof PAGE_SIZES)[number])}
              options={PAGE_SIZES.map((n) => ({ value: String(n), label: String(n) }))}
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-2 tabular-nums" aria-live="polite">
              {page * pageSize + 1}–{Math.min(filtered.length, (page + 1) * pageSize)} of {filtered.length}
            </span>
            <IconButton icon={ChevronLeft} label="Previous page" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="disabled:opacity-40 disabled:cursor-not-allowed" />
            <IconButton icon={ChevronRight} label="Next page" disabled={page >= pageCount - 1} onClick={() => setPage((p) => p + 1)} className="disabled:opacity-40 disabled:cursor-not-allowed" />
          </div>
        </div>
      )}
    </ProfileCard>
  );
};
