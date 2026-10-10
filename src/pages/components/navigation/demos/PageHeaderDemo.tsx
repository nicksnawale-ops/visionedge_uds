import React, { useId, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { ELEV2, FOCUS_INSET, FOCUS_LIGHT } from '../shared/navStyles';
import { useMenuKeys } from '../shared/useMenuKeys';
import { useClickOutside } from '../shared/useClickOutside';
import { Breadcrumbs, Crumb } from './BreadcrumbsDemo';

const PRIMARY = `h-10 px-4 rounded-[8px] bg-[#1E63FF] text-[14px] font-semibold text-white hover:bg-[#0B2D6B] whitespace-nowrap ${FOCUS_LIGHT}`;
const SECONDARY = `h-10 px-4 rounded-[8px] bg-white border border-[#1E63FF] text-[14px] font-semibold text-[#1E63FF] hover:bg-[#F7F9FC] hover:text-[#0B2D6B] whitespace-nowrap ${FOCUS_LIGHT}`;

/** Kebab menu for the actions that don't fit (max 1 Primary + 2 Secondary are shown). */
const MoreActions: React.FC<{ items: string[] }> = ({ items }) => {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const id = useId();
  const onKeyDown = useMenuKeys(menu, open, () => setOpen(false), btn);
  useClickOutside([menu, btn], open, () => setOpen(false));
  return (
    <div className="relative">
      <button
        ref={btn}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label="More actions"
        onClick={() => setOpen((o) => !o)}
        className={`w-10 h-10 rounded-[8px] inline-flex items-center justify-center text-[#4B5465] hover:bg-[#EEF1F6] ${FOCUS_LIGHT}`}
      >
        <MoreVertical className="w-5 h-5" aria-hidden="true" />
      </button>
      {open && (
        <div ref={menu} id={id} role="menu" aria-label="More actions" onKeyDown={onKeyDown} className={`absolute right-0 top-full mt-2 z-50 w-[200px] py-1 rounded-[8px] bg-white border border-[#DDE2EA] ${ELEV2}`}>
          {items.map((i) => (
            <button
              key={i}
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => {
                setOpen(false);
                btn.current?.focus();
              }}
              className={`w-full h-10 px-4 text-left text-[14px] text-[#353D4C] hover:bg-[#F7F9FC] ${FOCUS_INSET}`}
            >
              {i}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface DemoHeaderProps {
  crumbs?: Crumb[];
  back?: { label: string; onClick?: () => void };
  title: string;
  titleRef?: React.Ref<HTMLHeadingElement>;
  badge?: string;
  subtitle: string;
  primary?: string;
  secondary?: string[];
  more?: string[];
}

/** Page header: breadcrumbs → back link → title + status badge → subtitle; actions on the right. */
export const DemoPageHeader: React.FC<DemoHeaderProps> = ({ crumbs, back, title, titleRef, badge, subtitle, primary, secondary = [], more = [] }) => (
  <div className="@container">
    {crumbs && (
      <div className="mb-3">
        <Breadcrumbs items={crumbs} size={12} />
      </div>
    )}
    {back && (
      <a
        href="#page-header"
        onClick={(e) => {
          e.preventDefault();
          back.onClick?.();
        }}
        className={`mb-2 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1E63FF] hover:underline rounded-[4px] ${FOCUS_LIGHT}`}
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        {back.label}
      </a>
    )}
    <div className="flex flex-col gap-3 @min-[620px]:flex-row @min-[620px]:items-start @min-[620px]:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 ref={titleRef} tabIndex={-1} className="text-[24px] leading-[32px] font-semibold text-[#121722] outline-none">
            {title}
          </h3>
          {badge && (
            <span className="h-6 px-2 inline-flex items-center gap-1.5 rounded-full bg-[#EEF1F6] text-[12px] font-medium text-[#121722]">
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#0B2D6B]" />
              {badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-[14px] text-[#4B5465]">{subtitle}</p>
      </div>
      {(primary || secondary.length > 0 || more.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {more.length > 0 && <MoreActions items={more} />}
          {secondary.slice(0, 2).map((s) => (
            <button key={s} type="button" className={SECONDARY}>
              {s}
            </button>
          ))}
          {primary && (
            <button type="button" className={PRIMARY}>
              {primary}
            </button>
          )}
        </div>
      )}
    </div>
  </div>
);

/* ── List → detail → back, keeping filters and scroll ── */

const ROWS = Array.from({ length: 24 }, (_, i) => ({
  plate: `KA ${String((i % 5) + 1).padStart(2, '0')} AB ${1200 + i * 37}`,
  dir: i % 3 === 0 ? 'Exit' : 'Entry',
  gate: `Gate ${(i % 4) + 1}`,
  time: `${String(8 + Math.floor(i / 3)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
}));

export const ListDetailDemo: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Entry' | 'Exit'>('All');
  const [open, setOpen] = useState<number | null>(null);
  const scroll = useRef(0);
  const listRef = useRef<HTMLUListElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lastRow = useRef<number | null>(null);
  const selectId = useId();
  const rows = ROWS.map((r, i) => ({ ...r, i })).filter((r) => filter === 'All' || r.dir === filter);

  useLayoutEffect(() => {
    if (open !== null) {
      titleRef.current?.focus();
    } else if (listRef.current) {
      listRef.current.scrollTop = scroll.current;
      if (lastRow.current !== null) listRef.current.querySelector<HTMLElement>(`[data-row="${lastRow.current}"]`)?.focus();
    }
  }, [open]);

  if (open !== null) {
    const r = ROWS[open];
    return (
      <div className="min-h-[400px]">
        <DemoPageHeader
          back={{ label: 'Back to vehicle log', onClick: () => setOpen(null) }}
          title={r.plate}
          titleRef={titleRef}
          badge={r.dir}
          subtitle={`${r.gate} · Today ${r.time}`}
          primary="Export"
        />
        <p className="mt-6 text-[14px] text-[#4B5465]">Go back: the list keeps its filter ({filter}) and scroll position.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[400px]">
      <DemoPageHeader title="Vehicle log" subtitle={`${rows.length} movements today`} primary="Export" secondary={['Filters']} />
      <div className="mt-4 flex items-center gap-2">
        <label htmlFor={selectId} className="text-[14px] text-[#353D4C]">
          Direction
        </label>
        <select
          id={selectId}
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'All' | 'Entry' | 'Exit')}
          className="h-10 px-3 rounded-[8px] border border-[#8C95A6] bg-white text-[14px] text-[#121722] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20"
        >
          <option>All</option>
          <option>Entry</option>
          <option>Exit</option>
        </select>
      </div>
      <ul ref={listRef} className="mt-3 h-[240px] overflow-y-auto rounded-[8px] border border-[#DDE2EA] divide-y divide-[#DDE2EA]" aria-label="Vehicle movements">
        {rows.map((r) => (
          <li key={r.i}>
            <a
              href="#page-header"
              data-row={r.i}
              onClick={(e) => {
                e.preventDefault();
                scroll.current = listRef.current?.scrollTop ?? 0;
                lastRow.current = r.i;
                setOpen(r.i);
              }}
              className={`h-11 px-3 flex items-center gap-3 text-[14px] hover:bg-[#F7F9FC] ${FOCUS_INSET}`}
            >
              <span className="font-mono text-[13px] text-[#121722]">{r.plate}</span>
              <span className="text-[#4B5465]">{r.dir}</span>
              <span className="ml-auto text-[12px] text-[#6B7485]">
                {r.gate} · {r.time}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const DetailHeaderDemo: React.FC = () => (
  <div className="min-h-[220px]">
    <DemoPageHeader
      crumbs={[{ label: 'Reports' }, { label: 'Vehicle log' }, { label: 'KA 01 AB 1234' }]}
      back={{ label: 'Back to vehicle log' }}
      title="KA 01 AB 1234"
      badge="Blocked"
      subtitle="Last seen at Gate 2 · Today 09:42"
      primary="Unblock vehicle"
      secondary={['Export', 'Share']}
      more={['Add to watchlist', 'View on map', 'Delete record']}
    />
  </div>
);

export const EditHeaderDemo: React.FC = () => (
  <div className="min-h-[160px]">
    <DemoPageHeader back={{ label: 'Back to visitor details' }} title="Edit visitor" subtitle="Rahul Mehta · Visitor pass V-2041" primary="Save changes" secondary={['Cancel']} />
  </div>
);

export const PAGE_HEADER_CODE = `// Page header: breadcrumbs (optional) → back link (detail pages) → H1 + badge → subtitle; actions right
<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
  <div>
    <a href="/reports/vehicle-log" className="mb-2 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1E63FF] hover:underline">
      <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to vehicle log
    </a>
    <div className="flex items-center gap-3">
      <h1 className="text-[24px] leading-[32px] font-semibold text-[#121722]">KA 01 AB 1234</h1>
      <span className="h-6 px-2 rounded-full bg-[#EEF1F6] text-[12px] font-medium text-[#121722]">Blocked</span>
    </div>
    <p className="mt-1 text-[14px] text-[#4B5465]">Last seen at Gate 2 · Today 09:42</p>
  </div>
  <div className="flex items-center gap-2">
    <button aria-haspopup="menu" aria-label="More actions" className="w-10 h-10 rounded-[8px] text-[#4B5465] hover:bg-[#EEF1F6]"><MoreVertical className="w-5 h-5" /></button>
    <button className="h-10 px-4 rounded-[8px] border border-[#1E63FF] text-[#1E63FF] font-semibold">Export</button>
    <button className="h-10 px-4 rounded-[8px] border border-[#1E63FF] text-[#1E63FF] font-semibold">Share</button>
    <button className="h-10 px-4 rounded-[8px] bg-[#1E63FF] text-white font-semibold">Unblock vehicle</button>
  </div>
</div>

// The list keeps its filters and scroll: store them (URL or state) before opening a record, restore on Back.`;
