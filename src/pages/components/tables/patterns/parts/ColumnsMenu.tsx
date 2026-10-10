import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Columns3, GripVertical, Lock } from 'lucide-react';
import { BTN, CHECKBOX, FOCUS, POPOVER } from '../tableStyles';

export interface ColumnDef<K extends string> {
  key: K;
  label: string;
  /** Always shown (e.g. Plate). */
  locked?: boolean;
}

interface ColumnsMenuProps<K extends string> {
  columns: ColumnDef<K>[];
  /** Current order. */
  order: K[];
  hidden: K[];
  onOrder: (order: K[]) => void;
  onHidden: (hidden: K[]) => void;
  onReset: () => void;
}

/**
 * "Columns" (Secondary Small) → 240px menu: show/hide checkboxes (locked columns can't be hidden), drag handles
 * to reorder (↑ / ↓ on a focused handle does the same), and Ghost "Reset to default". Esc closes.
 */
export function ColumnsMenu<K extends string>({ columns, order, hidden, onOrder, onHidden, onReset }: ColumnsMenuProps<K>) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState<K | null>(null);
  const [status, setStatus] = useState('');
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const byKey = (k: K) => columns.find((c) => c.key === k)!;

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>('input:not([disabled]), button')?.focus();
    const onDown = (e: PointerEvent) => {
      if (!panel.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // Locked columns stay where they are; others can't move above them.
  const firstMovable = order.findIndex((k) => !byKey(k).locked);
  const move = (k: K, to: number) => {
    const from = order.indexOf(k);
    if (to < firstMovable || to >= order.length || from === to) return;
    const next = [...order];
    next.splice(from, 1);
    next.splice(to, 0, k);
    onOrder(next);
    setStatus(`${byKey(k).label} moved to position ${to + 1} of ${order.length}`);
  };

  return (
    <div className="relative">
      <button ref={btn} type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? panelId : undefined} onClick={() => setOpen((o) => !o)} className={BTN.secondarySm}>
        <Columns3 className="w-4 h-4" aria-hidden="true" />
        Columns
        <ChevronDown className="w-4 h-4" aria-hidden="true" />
      </button>
      {open && (
        <div
          ref={panel}
          id={panelId}
          role="dialog"
          aria-label="Columns"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              setOpen(false);
              btn.current?.focus();
            }
          }}
          className={`${POPOVER} right-0 top-full w-[240px] py-1`}
        >
          <p className="px-3 pt-2 pb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">Show and order columns</p>
          <ul aria-label="Columns">
            {order.map((k, i) => {
              const c = byKey(k);
              const shown = !hidden.includes(k);
              return (
                <li
                  key={k}
                  draggable={!c.locked}
                  onDragStart={(e) => {
                    setDragging(k);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (dragging && dragging !== k && !c.locked) move(dragging, i);
                  }}
                  onDragEnd={() => setDragging(null)}
                  className={`flex items-center gap-2 h-10 max-[767px]:h-11 pl-1 pr-3 ${dragging === k ? 'bg-[#1E63FF]/[0.08]' : 'hover:bg-[#F7F9FC]'}`}
                >
                  {c.locked ? (
                    <span className="w-7 shrink-0" aria-hidden="true" />
                  ) : (
                  <button
                    type="button"
                    aria-label={`Reorder ${c.label}. Use the up and down arrow keys.`}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        move(k, i + (e.key === 'ArrowUp' ? -1 : 1));
                        // Keep focus on the moved handle.
                        window.setTimeout(() => panel.current?.querySelector<HTMLElement>(`[data-handle="${k}"]`)?.focus(), 0);
                      }
                    }}
                    data-handle={k}
                    className={`w-7 h-8 inline-flex items-center justify-center rounded-[4px] text-[#8C95A6] hover:text-[#4B5465] cursor-grab ${FOCUS}`}
                  >
                    <GripVertical className="w-4 h-4" aria-hidden="true" />
                  </button>
                  )}
                  <label className={`flex-1 flex items-center gap-2 text-[14px] ${c.locked ? 'text-[#4B5465]' : 'text-[#353D4C] cursor-pointer'}`}>
                    <input
                      type="checkbox"
                      checked={shown}
                      disabled={c.locked}
                      onChange={() => onHidden(shown ? [...hidden, k] : hidden.filter((h) => h !== k))}
                      className={CHECKBOX}
                    />
                    {c.label}
                  </label>
                  {c.locked && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#6B7485]">
                      <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span className="sr-only">Always shown</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-1 px-2 pt-1 border-t border-[#DDE2EA]">
            <button
              type="button"
              onClick={() => {
                onReset();
                setStatus('Columns reset to default');
              }}
              className={BTN.ghostSm}
            >
              Reset to default
            </button>
          </div>
          <p role="status" className="sr-only">
            {status}
          </p>
        </div>
      )}
    </div>
  );
}
