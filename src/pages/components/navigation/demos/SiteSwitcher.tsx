import React, { useEffect, useId, useRef, useState } from 'react';
import { Building2, Check, ChevronsUpDown, Search } from 'lucide-react';
import { SITES } from '../navigationSpec';
import { ELEV2, FOCUS_NAVY } from '../shared/navStyles';
import { useClickOutside } from '../shared/useClickOutside';
import { SideTooltip } from '../shared/SideTooltip';

interface SiteSwitcherProps {
  site: string;
  onChange: (site: string) => void;
  collapsed: boolean;
}

/**
 * Site/workspace switcher: a 40px button (White 6% fill, 8px radius) showing the current site; opens a
 * dropdown with a search field (combobox) and the site list (listbox). ↑/↓ move, Enter picks, Esc closes.
 */
export const SiteSwitcher: React.FC<SiteSwitcherProps> = ({ site, onChange, collapsed }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const btn = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const popId = useId();
  const results = SITES.filter((s) => s.toLowerCase().includes(query.trim().toLowerCase()));

  useClickOutside([pop, btn], open, () => setOpen(false));
  useEffect(() => {
    if (open) {
      setQuery('');
      setIndex(Math.max(0, SITES.indexOf(site)));
      input.current?.focus();
    }
  }, [open, site]);

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) btn.current?.focus();
  };
  const pick = (s: string) => {
    onChange(s);
    close();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') setIndex((i) => Math.min(results.length - 1, i + 1));
    else if (e.key === 'ArrowUp') setIndex((i) => Math.max(0, i - 1));
    else if (e.key === 'Enter' && results[index]) pick(results[index]);
    else if (e.key === 'Escape') close();
    else if (e.key === 'Tab') return close(false);
    else return;
    e.preventDefault();
    e.stopPropagation();
  };

  const button = (describedBy?: string) => (
    <button
      ref={btn}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? popId : undefined}
      aria-label={collapsed ? `Site: ${site}. Change site` : undefined}
      aria-describedby={describedBy || undefined}
      onClick={() => setOpen((o) => !o)}
      className={`relative h-10 flex items-center gap-2 rounded-[8px] bg-white/[0.06] hover:bg-white/10 text-white ${collapsed ? 'w-10 justify-center mx-auto' : 'w-full px-3'} ${FOCUS_NAVY}`}
    >
      <Building2 className="w-4 h-4 shrink-0 text-white/80" aria-hidden="true" />
      {!collapsed && (
        <>
          <span className="flex-1 min-w-0 text-left text-[14px] font-medium truncate">
            <span className="sr-only">Site: </span>
            {site}
          </span>
          <ChevronsUpDown className="w-4 h-4 shrink-0 text-white/60" aria-hidden="true" />
        </>
      )}
    </button>
  );

  return (
    <div className={`relative ${collapsed ? '' : 'px-2'}`}>
      {collapsed ? <SideTooltip content={`Site: ${site}`}>{() => button()}</SideTooltip> : button()}
      {open && (
        <div
          ref={pop}
          id={popId}
          role="dialog"
          aria-label="Change site"
          className={`absolute z-50 w-[240px] rounded-[8px] bg-white border border-[#DDE2EA] ${ELEV2} ${collapsed ? 'left-full top-0 ml-2' : 'left-2 top-full mt-2'}`}
        >
          <div className="relative p-2 border-b border-[#DDE2EA]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7485]" aria-hidden="true" />
            <input
              ref={input}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={results[index] ? `${listId}-${index}` : undefined}
              aria-label="Search sites"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIndex(0);
              }}
              onKeyDown={onKey}
              placeholder="Search sites"
              className="w-full h-10 pl-9 pr-3 rounded-[8px] border border-[#8C95A6] text-[14px] text-[#121722] placeholder:text-[#6B7485] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20"
            />
          </div>
          <ul id={listId} role="listbox" aria-label="Sites" className="max-h-[220px] overflow-y-auto py-1">
            {results.map((s, i) => (
              <li
                key={s}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={s === site}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => pick(s)}
                onPointerMove={() => setIndex(i)}
                className={`h-10 px-3 flex items-center gap-2 text-[14px] cursor-pointer ${i === index ? 'bg-[#1E63FF]/[0.08] text-[#121722]' : 'text-[#353D4C]'}`}
              >
                <span className="flex-1 truncate">{s}</span>
                {s === site && <Check className="w-4 h-4 text-[#1E63FF]" aria-hidden="true" />}
              </li>
            ))}
            {!results.length && <li className="px-3 py-3 text-[13px] text-[#4B5465]">No sites match “{query}”</li>}
          </ul>
        </div>
      )}
    </div>
  );
};
