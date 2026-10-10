import React, { useId, useRef, useState } from 'react';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { Tooltip } from '../../../templates/profile/ui';
import { ELEV2, FOCUS_INSET, FOCUS_LIGHT } from '../shared/navStyles';
import { useMenuKeys } from '../shared/useMenuKeys';
import { useClickOutside } from '../shared/useClickOutside';

export interface Crumb {
  label: string;
}

const MAX_CHARS = 24;
const MAX_VISIBLE = 4;

const noNav = (e: React.MouseEvent) => e.preventDefault();

/** Ancestor link; labels over 24 characters truncate with a tooltip showing the full name. */
const CrumbLink: React.FC<{ label: string; size: 12 | 14 }> = ({ label, size }) => {
  const long = label.length > MAX_CHARS;
  const cls = `rounded-[4px] hover:text-[#1E63FF] hover:underline underline-offset-2 whitespace-nowrap ${FOCUS_LIGHT}`;
  if (!long)
    return (
      <a href="#breadcrumbs" onClick={noNav} className={cls}>
        {label}
      </a>
    );
  return (
    <Tooltip content={label} placement="bottom" align="start">
      {() => (
        // The full name is the accessible name; the tooltip shows it visually.
        <a href="#breadcrumbs" onClick={noNav} aria-label={label} className={cls}>
          {label.slice(0, MAX_CHARS - 1)}…
        </a>
      )}
    </Tooltip>
  );
};

const Sep: React.FC = () => (
  <span aria-hidden="true" className="mx-2 text-[#C3CAD5]">
    /
  </span>
);

/** "…" button listing hidden levels (role="menu"). */
const Overflow: React.FC<{ hidden: Crumb[] }> = ({ hidden }) => {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const onKeyDown = useMenuKeys(menu, open, () => setOpen(false), btn);
  useClickOutside([menu, btn], open, () => setOpen(false));
  return (
    <span className="relative inline-flex">
      <button
        ref={btn}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Show ${hidden.length} more levels`}
        onClick={() => setOpen((o) => !o)}
        className={`w-7 h-6 -my-1 rounded-[4px] inline-flex items-center justify-center text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#121722] ${FOCUS_LIGHT}`}
      >
        <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
      </button>
      {open && (
        <div ref={menu} id={menuId} role="menu" aria-label="Hidden levels" onKeyDown={onKeyDown} className={`absolute left-0 top-full mt-2 z-50 min-w-[200px] py-1 rounded-[8px] bg-white border border-[#DDE2EA] ${ELEV2}`}>
          {hidden.map((c) => (
            <a
              key={c.label}
              role="menuitem"
              tabIndex={-1}
              href="#breadcrumbs"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                btn.current?.focus();
              }}
              className={`h-10 px-4 flex items-center text-[14px] text-[#353D4C] hover:bg-[#F7F9FC] whitespace-nowrap ${FOCUS_INSET}`}
            >
              {c.label}
            </a>
          ))}
        </div>
      )}
    </span>
  );
};

interface BreadcrumbsProps {
  items: Crumb[];
  size?: 12 | 14;
  /** Mobile: only "← Parent page". */
  compact?: boolean;
}

/**
 * Breadcrumbs: <nav aria-label="Breadcrumb"> + ordered list; ancestors are links, the current page is text with
 * aria-current="page". Max 4 visible levels: longer paths collapse the middle into "…". Never wraps.
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, size = 14, compact = false }) => {
  if (compact) {
    const parent = items[items.length - 2];
    return (
      <nav aria-label="Breadcrumb">
        <a href="#breadcrumbs" onClick={noNav} className={`inline-flex items-center gap-1.5 min-h-[44px] text-[14px] font-medium text-[#1E63FF] hover:underline ${FOCUS_LIGHT} rounded-[4px]`}>
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {parent.label}
        </a>
      </nav>
    );
  }
  const current = items[items.length - 1];
  const ancestors = items.slice(0, -1);
  const collapse = items.length > MAX_VISIBLE;
  const visibleAncestors = collapse ? [ancestors[0], ...ancestors.slice(-1)] : ancestors;
  const hidden = collapse ? ancestors.slice(1, -1) : [];
  const text = size === 12 ? 'text-[12px]' : 'text-[14px]';

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className={`flex items-center flex-nowrap min-w-0 ${text} text-[#4B5465]`}>
        {visibleAncestors.map((c, i) => (
          <React.Fragment key={c.label}>
            <li className="inline-flex items-center">
              <CrumbLink label={c.label} size={size} />
              <Sep />
            </li>
            {collapse && i === 0 && (
              <li className="inline-flex items-center">
                <Overflow hidden={hidden} />
                <Sep />
              </li>
            )}
          </React.Fragment>
        ))}
        <li className="min-w-0 inline-flex">
          <span aria-current="page" title={current.label.length > MAX_CHARS ? current.label : undefined} className="font-medium text-[#121722] truncate max-w-[24ch]">
            {current.label}
          </span>
        </li>
      </ol>
    </nav>
  );
};

const SHORT: Crumb[] = [{ label: 'Reports' }, { label: 'Vehicle log' }, { label: 'Export' }];
const LONG: Crumb[] = [{ label: 'Gates' }, { label: 'North campus' }, { label: 'Cluster North-04' }, { label: 'Gate 2' }, { label: 'Cameras' }, { label: 'Optical calibration' }];
const LONG_LABEL: Crumb[] = [{ label: 'Reports' }, { label: 'Hostel block A night entries summary' }, { label: 'Export' }];

/** All breadcrumb variants: sizes, collapsed path, truncation and the mobile back link. */
export const BreadcrumbsDemo: React.FC = () => {
  const [size, setSize] = useState<12 | 14>(14);
  const name = useId();
  const row = (label: string, node: React.ReactNode) => (
    <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-1 sm:gap-4 items-center py-3 border-b border-[#DDE2EA] last:border-b-0">
      <p className="text-[12px] font-medium text-[#6B7485]">{label}</p>
      <div className="min-w-0">{node}</div>
    </div>
  );
  return (
    <div className="min-h-[300px]">
      <fieldset className="flex flex-wrap items-center gap-x-4 mb-2">
        <legend className="float-left mr-3 text-[13px] font-medium text-[#121722]">Size</legend>
        {([14, 12] as const).map((s) => (
          <label key={s} className="inline-flex items-center gap-2 min-h-[36px] text-[14px] text-[#353D4C] cursor-pointer">
            <input type="radio" name={name} checked={size === s} onChange={() => setSize(s)} className="w-4 h-4 accent-[#1E63FF]" />
            {s}px
          </label>
        ))}
      </fieldset>
      {row('Standard', <Breadcrumbs items={SHORT} size={size} />)}
      {row('Long path (6 levels)', <Breadcrumbs items={LONG} size={size} />)}
      {row('Long label', <Breadcrumbs items={LONG_LABEL} size={size} />)}
      {row('Mobile', <Breadcrumbs items={SHORT} compact />)}
    </div>
  );
};

export const BREADCRUMBS_CODE = `// Breadcrumbs: ordered list, "/" separators (Gray 300, 8px), current page is text with aria-current
<nav aria-label="Breadcrumb">
  <ol className="flex items-center flex-nowrap text-[14px] text-[#4B5465]">
    <li className="inline-flex items-center">
      <a href="/reports" className="hover:text-[#1E63FF] hover:underline">Reports</a>
      <span aria-hidden="true" className="mx-2 text-[#C3CAD5]">/</span>
    </li>
    {/* more than 4 levels: first · "…" menu button (aria-label="Show 3 more levels") · parent · current */}
    <li className="inline-flex items-center">
      <a href="/reports/vehicle-log" className="hover:text-[#1E63FF] hover:underline">Vehicle log</a>
      <span aria-hidden="true" className="mx-2 text-[#C3CAD5]">/</span>
    </li>
    <li>
      <span aria-current="page" className="font-medium text-[#121722] truncate max-w-[24ch]">Export</span>
    </li>
  </ol>
</nav>

// Mobile: only the parent
<nav aria-label="Breadcrumb">
  <a href="/reports/vehicle-log" className="inline-flex items-center gap-1.5 min-h-[44px] text-[14px] font-medium text-[#1E63FF]">
    <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Vehicle log
  </a>
</nav>`;
