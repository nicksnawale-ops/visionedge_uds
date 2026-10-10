import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { DATE_OPTIONS, TableQueryApi, applyQuery } from '../hooks/useTableQuery';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { GATES, STATUSES, STATUS_LABEL, VEHICLES } from '../sampleData';
import { BTN, INPUT } from '../tableStyles';
import { CheckList, DateList, FilterPanel, GateList } from './FilterMenu';

type MenuId = 'status' | 'gate' | 'date';

/** "Status: Verified, Processing" for 1–2 values, "Status · 3" for more. */
const summary = (name: string, labels: string[]) => (labels.length === 0 ? name : labels.length <= 2 ? `${name}: ${labels.join(', ')}` : `${name} · ${labels.length}`);

interface FilterToolbarProps {
  api: TableQueryApi;
  /** Extra controls at the right of the toolbar (e.g. Columns). */
  extra?: React.ReactNode;
}

/**
 * Filter toolbar (16px padding, 1px bottom border): search (320px, debounced 300ms) + Status, Gate and Date
 * filter buttons. Below 768px the search goes full width and the filters scroll sideways in one row.
 */
export const FilterToolbar: React.FC<FilterToolbarProps> = ({ api, extra }) => {
  const { query, update } = api;
  const [text, setText] = useState(query.q);
  const debounced = useDebouncedValue(text, 300);
  const [open, setOpen] = useState<MenuId | null>(null);
  const [left, setLeft] = useState(0);
  const buttons = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounced !== query.q) update({ q: debounced });
  }, [debounced]); // Only when the settled text changes.

  // "Clear all" outside the toolbar empties the search box too.
  useEffect(() => {
    if (query.q === '' && text !== '' && debounced === text) setText('');
  }, [query.q]); // Only when the query's search changes.

  // Counts for each option, with every other filter applied.
  const statusCounts = useMemo(() => applyQuery(VEHICLES, { ...query, status: [] }), [query]);
  const gateCounts = useMemo(() => applyQuery(VEHICLES, { ...query, gate: [] }), [query]);

  const toggle = (id: MenuId) => {
    if (open === id) return setOpen(null);
    const b = buttons.current[id];
    const tb = toolbarRef.current;
    if (b && tb) setLeft(b.getBoundingClientRect().left - tb.getBoundingClientRect().left);
    setOpen(id);
  };
  const close = (refocus: boolean) => {
    const id = open;
    setOpen(null);
    if (refocus && id) buttons.current[id]?.focus();
  };

  const dateLabel = query.date === 'all' ? [] : [query.date === 'custom' ? 'Custom' : DATE_OPTIONS.find((d) => d.value === query.date)!.label];
  const MENUS: { id: MenuId; text: string; active: boolean }[] = [
    { id: 'status', text: summary('Status', query.status.map((s) => STATUS_LABEL[s])), active: query.status.length > 0 },
    { id: 'gate', text: summary('Gate', query.gate.map((g) => g.split(' – ')[0])), active: query.gate.length > 0 },
    { id: 'date', text: summary('Date', dateLabel), active: query.date !== 'all' },
  ];

  return (
    <div ref={toolbarRef} className="relative p-4 border-b border-[#DDE2EA] flex flex-col md:flex-row md:items-center gap-3">
      <div className="relative w-full md:w-[320px] shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7485]" aria-hidden="true" />
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search plate, driver or gate…"
          aria-label="Search vehicles"
          className={`${INPUT} w-full pl-9`}
        />
      </div>
      <div className="flex items-center gap-2 overflow-x-auto max-[767px]:-mx-4 max-[767px]:px-4 [scrollbar-width:none]" role="group" aria-label="Filters">
        {MENUS.map((m) => (
          <button
            key={m.id}
            ref={(el) => {
              buttons.current[m.id] = el;
            }}
            type="button"
            data-filter-button
            aria-haspopup="dialog"
            aria-expanded={open === m.id}
            onClick={() => toggle(m.id)}
            className={`${m.active ? BTN.activeSm : BTN.secondarySm} shrink-0`}
          >
            {m.text}
            <ChevronDown className={`w-4 h-4 motion-safe:transition-transform ${open === m.id ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
        ))}
      </div>
      {extra && <div className="md:ml-auto flex items-center gap-2 flex-wrap">{extra}</div>}

      {open && (
        <FilterPanel label={`${open[0].toUpperCase()}${open.slice(1)} filter`} left={left} onClose={close}>
          {open === 'status' && (
            <CheckList
              legend="Status"
              options={STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s], count: statusCounts.filter((r) => r.status === s).length }))}
              selected={query.status}
              onChange={(status) => update({ status })}
            />
          )}
          {open === 'gate' && (
            <GateList
              gates={GATES.map((g) => ({ value: g, label: g, count: gateCounts.filter((r) => r.gate === g).length }))}
              selected={query.gate}
              onChange={(gate) => update({ gate })}
            />
          )}
          {open === 'date' && <DateList value={query.date} from={query.from} to={query.to} onChange={(patch) => update(patch)} />}
        </FilterPanel>
      )}
    </div>
  );
};
