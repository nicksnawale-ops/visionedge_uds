import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '../../../../components/common/Toast';
import { VEHICLES } from './sampleData';
import { ColumnsMenu, ColumnDef } from './parts/ColumnsMenu';
import { COLUMN_LABEL, Cell, ColumnKey, NUMERIC, ViewButton } from './cells';
import { CHECKBOX, FOCUS, TABLE } from './tableStyles';

type Movable = Exclude<ColumnKey, 'plate'>;

const COLUMNS: ColumnDef<ColumnKey>[] = [
  { key: 'plate', label: COLUMN_LABEL.plate, locked: true },
  { key: 'driver', label: COLUMN_LABEL.driver },
  { key: 'gate', label: COLUMN_LABEL.gate },
  { key: 'vehicleType', label: COLUMN_LABEL.vehicleType },
  { key: 'status', label: COLUMN_LABEL.status },
  { key: 'time', label: COLUMN_LABEL.time },
  { key: 'confidence', label: COLUMN_LABEL.confidence },
  { key: 'velocity', label: COLUMN_LABEL.velocity },
];
const DEFAULT_ORDER: ColumnKey[] = COLUMNS.map((c) => c.key);
const ROWS = VEHICLES.slice(0, 12);

/** Sticky-edge shadow, only while the table is scrolled under it. */
const LEFT_SHADOW = 'shadow-[4px_0_6px_-2px_rgba(11,45,107,0.08)]';
const RIGHT_SHADOW = 'shadow-[-4px_0_6px_-2px_rgba(11,45,107,0.08)]';

/** Pattern 4: show / hide / reorder columns, sticky selection + Plate (left) and Actions (right), density. */
export const ColumnControlsTable: React.FC = () => {
  const { showToast } = useToast();
  const [order, setOrder] = useState<ColumnKey[]>(DEFAULT_ORDER);
  const [hidden, setHidden] = useState<ColumnKey[]>([]);
  const [compact, setCompact] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [edges, setEdges] = useState({ left: false, right: false });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Plate is pinned first (sticky); the rest follow the chosen order.
  const visible = order.filter((k): k is Movable => k !== 'plate' && !hidden.includes(k));

  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setEdges({ left: el.scrollLeft > 1, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1 });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [measure]);

  useEffect(measure, [order, hidden, compact, measure]);

  const rowH = compact ? 'h-10' : 'h-12';
  const allOn = selected.length === ROWS.length;

  return (
    <div className={TABLE.card}>
      <div className="p-4 border-b border-[#DDE2EA] flex flex-wrap items-center gap-3">
        <ColumnsMenu<ColumnKey>
          columns={COLUMNS}
          order={order}
          hidden={hidden}
          onOrder={(next) => setOrder(['plate', ...next.filter((k) => k !== 'plate')])}
          onHidden={setHidden}
          onReset={() => {
            setOrder(DEFAULT_ORDER);
            setHidden([]);
          }}
        />
        <div role="group" aria-label="Row density" className="inline-flex p-1 rounded-[8px] bg-[#EEF1F6]">
          {(
            [
              [false, 'Comfortable (48px)'],
              [true, 'Compact (40px)'],
            ] as const
          ).map(([v, label]) => (
            <button
              key={label}
              type="button"
              aria-pressed={compact === v}
              onClick={() => setCompact(v)}
              className={`h-7 max-[767px]:h-11 px-3 rounded-[6px] text-[12px] font-medium ${compact === v ? 'bg-white text-[#121722] shadow-[0_1px_3px_rgba(11,45,107,0.08)]' : 'text-[#4B5465] hover:text-[#121722]'} ${FOCUS}`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-[12px] text-[#6B7485] md:ml-auto">Saved per user in production.</span>
      </div>
      <div ref={scrollRef} className={TABLE.scroll} tabIndex={0} role="region" aria-label="Vehicle log, scrolls sideways">
        <table className={`${TABLE.table} min-w-[1100px]`}>
          <caption className="sr-only">Vehicle log with configurable columns</caption>
          <thead>
            <tr className={TABLE.headRow}>
              <th scope="col" className={`sticky left-0 z-20 w-12 min-w-12 px-4 bg-[#F7F9FC]`}>
                <input
                  type="checkbox"
                  checked={allOn}
                  ref={(el) => {
                    if (el) el.indeterminate = selected.length > 0 && !allOn;
                  }}
                  onChange={() => setSelected(allOn ? [] : ROWS.map((r) => r.id))}
                  aria-label="Select all rows"
                  className={CHECKBOX}
                />
              </th>
              <th scope="col" className={`${TABLE.th} sticky left-12 z-20 bg-[#F7F9FC] ${edges.left ? LEFT_SHADOW : ''}`}>
                {COLUMN_LABEL.plate}
              </th>
              {visible.map((k) => (
                <th key={k} scope="col" className={`${TABLE.th} ${NUMERIC.includes(k) ? 'text-right' : ''}`}>
                  {COLUMN_LABEL[k]}
                </th>
              ))}
              <th scope="col" className={`${TABLE.th} sticky right-0 z-20 w-16 bg-[#F7F9FC] text-center ${edges.right ? RIGHT_SHADOW : ''}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => {
              const on = selected.includes(r.id);
              const bg = on ? 'bg-[#EEF1F6]' : 'bg-white group-hover:bg-[#F7F9FC]';
              return (
                <tr key={r.id} className={`group border-b border-[#DDE2EA] last:border-b-0 ${rowH} ${on ? 'bg-[#EEF1F6]' : 'hover:bg-[#F7F9FC]'}`}>
                  <td className={`sticky left-0 z-10 w-12 px-4 ${bg}`}>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => setSelected((s) => (on ? s.filter((x) => x !== r.id) : [...s, r.id]))}
                      aria-label={`Select ${r.plate}`}
                      className={CHECKBOX}
                    />
                  </td>
                  <Cell row={r} col="plate" className={`sticky left-12 z-10 ${bg} ${edges.left ? LEFT_SHADOW : ''}`} />
                  {visible.map((k) => (
                    <Cell key={k} row={r} col={k} />
                  ))}
                  <td className={`sticky right-0 z-10 px-2 text-center ${bg} ${edges.right ? RIGHT_SHADOW : ''}`}>
                    <ViewButton row={r} onView={(row) => showToast(`Opening ${row.plate}`, 'info')} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const COLUMNS_CODE = `// Column controls: show/hide + reorder (Plate locked), sticky key columns, density
<div className="overflow-x-auto" role="region" aria-label="Vehicle log, scrolls sideways" tabIndex={0}>
  <table className="w-full min-w-[1100px] border-collapse text-[14px]">
    <thead>
      <tr className="h-10 bg-[#F7F9FC] border-b border-[#DDE2EA]">
        <th className="sticky left-0 z-20 w-12 px-4 bg-[#F7F9FC]"><input type="checkbox" aria-label="Select all rows" /></th>
        <th className={'sticky left-12 z-20 bg-[#F7F9FC] ' + (scrolledLeft ? 'shadow-[4px_0_6px_-2px_rgba(11,45,107,0.08)]' : '')}>Plate</th>
        {visibleColumns.map((c) => <th key={c.key}>{c.label}</th>)}
        <th className={'sticky right-0 z-20 bg-[#F7F9FC] ' + (moreOnRight ? 'shadow-[-4px_0_6px_-2px_rgba(11,45,107,0.08)]' : '')}>Actions</th>
      </tr>
    </thead>
    {/* Body cells in sticky columns need their own background (bg-white / row hover) */}
  </table>
</div>

// Shadows only while scrolled:
const onScroll = (el) => setEdges({ left: el.scrollLeft > 1, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1 });

// Columns menu (240px): checkbox per column, GripVertical handle to drag (↑/↓ on the focused handle), "Reset to default".
// Density: Comfortable (48px) · Compact (40px). Saved per user in production.`;
