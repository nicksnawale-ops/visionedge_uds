import React, { useEffect, useId, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Download, ListFilter, Search } from 'lucide-react';
import { Segmented } from '../../dashboard/primitives';
import { Avatar, BUTTON, IconButton, MONO } from '../../profile/ui';
import { SettingsSelect } from '../parts/SettingsSelect';
import { useSettings } from '../SettingsContext';
import { AUDIT_ACTIONS, getAudit } from '../data/audit';
import { CardBody, SectionCard } from '../patterns/SectionCard';
import { TABLE } from '../patterns/table';

type Range = 'today' | '7d' | '30d';
const RANGES: { id: Range; label: string; days: number }[] = [
  { id: 'today', label: 'Today', days: 0 },
  { id: '7d', label: '7 days', days: 6 },
  { id: '30d', label: '30 days', days: 29 },
];
const PAGE = 10;
const entries = (n: number) => `${n} entr${n === 1 ? 'y' : 'ies'}`;

export const AuditLog: React.FC = () => {
  const uid = useId();
  const { toast, marker } = useSettings();
  const rows = useMemo(() => getAudit(), []);
  const users = useMemo(() => [...new Set(rows.map((r) => r.user))], [rows]);
  const [query, setQuery] = useState('');
  const [user, setUser] = useState('all');
  const [action, setAction] = useState('all');
  const [range, setRange] = useState<Range>('30d');
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<string[]>([]);

  useEffect(() => setPage(0), [query, user, action, range]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const days = RANGES.find((r) => r.id === range)?.days ?? 29;
    return rows.filter(
      (r) => r.day <= days && (user === 'all' || r.user === user) && (action === 'all' || r.action === action) && (!q || `${r.verb} ${r.target} ${r.user}`.toLowerCase().includes(q))
    );
  }, [rows, query, user, action, range]);
  const pageRows = filtered.slice(page * PAGE, page * PAGE + PAGE);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));

  return (
    <SectionCard
      title="Audit log"
      description={`${filtered.length} of ${rows.length} changes · All times IST`}
      settingId="audit.table"
      overlay={marker(5)}
      actions={
        <button type="button" onClick={() => toast(`Exported ${filtered.length} audit entries to CSV`, 'success')} className={BUTTON.secondary}>
          <Download className="w-4 h-4" aria-hidden="true" />
          Export CSV
        </button>
      }
    >
      <CardBody className="flex flex-wrap items-center gap-2 py-4!">
        <div className="relative flex-1 min-w-[180px] @min-[1024px]:flex-none @min-[1024px]:w-[200px]">
          <label htmlFor={`${uid}-q`} className="sr-only">
            Search audit log
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
        <SettingsSelect
          id={`${uid}-user`}
          ariaLabel="User"
          filter
          size="sm"
          icon={ListFilter}
          className="min-w-[160px]"
          value={user}
          onChange={setUser}
          options={[
            { value: 'all', label: 'All users', meta: String(rows.length), srText: entries(rows.length) },
            ...users.map((u) => {
              const n = rows.filter((r) => r.user === u).length;
              return { value: u, label: u, meta: String(n), srText: entries(n) };
            }),
          ]}
        />
        <SettingsSelect
          id={`${uid}-action`}
          ariaLabel="Action type"
          filter
          size="sm"
          icon={ListFilter}
          className="min-w-[160px]"
          value={action}
          onChange={setAction}
          options={[
            { value: 'all', label: 'All actions', meta: String(rows.length), srText: entries(rows.length) },
            ...AUDIT_ACTIONS.map((a) => {
              const n = rows.filter((r) => r.action === a).length;
              return { value: a, label: a, meta: String(n), srText: entries(n) };
            }),
          ]}
        />
        <Segmented label="Date range" options={RANGES.map((r) => ({ id: r.id, label: r.label }))} value={range} onChange={setRange} />
      </CardBody>

      <div className={`${TABLE.scroll} border-t border-[#DDE2EA]`}>
        <table className={`${TABLE.table} min-w-[920px]`}>
          <caption className="sr-only">Audit log, {filtered.length} entries</caption>
          <thead>
            <tr className={TABLE.headRow}>
              {['Time (IST)', 'User', 'Action', 'Target', 'Details', 'IP address'].map((h) => (
                <th key={h} scope="col" className={TABLE.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={TABLE.body}>
            {pageRows.map((r) => {
              const expanded = open.includes(r.id);
              const detailsId = `${uid}-${r.id}`;
              return (
                <React.Fragment key={r.id}>
                  <tr className={TABLE.row}>
                    <td className={`${TABLE.td} tabular-nums`}>{r.time}</td>
                    <td className={TABLE.td}>
                      <span className="flex items-center gap-2">
                        <Avatar initials={r.initials} size={24} />
                        {r.user}
                      </span>
                    </td>
                    <th scope="row" className={`${TABLE.td} text-left font-medium text-[#121722]`}>
                      {r.verb}
                    </th>
                    <td className={`${TABLE.td} whitespace-normal min-w-[200px]`}>{r.target}</td>
                    <td className={TABLE.td}>
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={detailsId}
                        onClick={() => setOpen((o) => (o.includes(r.id) ? o.filter((x) => x !== r.id) : [...o, r.id]))}
                        className={BUTTON.ghostSm}
                      >
                        {expanded ? 'Hide' : 'Show'} changes
                        <span className="sr-only"> for {r.target}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
                      </button>
                    </td>
                    <td className={TABLE.td}>
                      <span className={MONO}>{r.ip}</span>
                    </td>
                  </tr>
                  {expanded && (
                    <tr id={detailsId} className="bg-[#F7F9FC]">
                      <td colSpan={6} className="px-4 @min-[768px]:px-6 py-3">
                        <div className="grid grid-cols-2 gap-3 max-w-[640px]">
                          {(
                            [
                              ['Before', r.before],
                              ['After', r.after],
                            ] as const
                          ).map(([label, lines]) => (
                            <div key={label} className="rounded-[8px] border border-[#DDE2EA] bg-white">
                              <p className="px-3 py-1.5 border-b border-[#DDE2EA] text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">{label}</p>
                              <pre className="px-3 py-2 font-mono text-[12px] leading-[18px] text-[#121722] whitespace-pre-wrap">
                                {lines.map((l) => `${label === 'Before' ? '−' : '+'} ${l}`).join('\n')}
                              </pre>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="px-6 py-10 text-center text-[14px] text-[#4B5465]">No changes match these filters.</p>}
      </div>

      {filtered.length > 0 && (
        <div className="px-4 @min-[768px]:px-6 py-3 border-t border-[#DDE2EA] flex items-center justify-end gap-1 text-[13px] text-[#4B5465]">
          <span className="mr-2 tabular-nums" aria-live="polite">
            {page * PAGE + 1}–{Math.min(filtered.length, (page + 1) * PAGE)} of {filtered.length}
          </span>
          <IconButton icon={ChevronLeft} label="Previous page" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="disabled:opacity-40 disabled:cursor-not-allowed" />
          <IconButton icon={ChevronRight} label="Next page" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} className="disabled:opacity-40 disabled:cursor-not-allowed" />
        </div>
      )}
    </SectionCard>
  );
};
