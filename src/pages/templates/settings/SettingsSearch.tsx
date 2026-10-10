import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { BUTTON, POPOVER } from '../profile/ui';
import { SettingDef, searchSettings } from './data/settingsIndex';

interface SettingsSearchProps {
  query: string;
  onQuery: (q: string) => void;
  /** Panel open (the "Search results" state opens it on load). */
  open: boolean;
  onOpen: (open: boolean) => void;
  onPick: (def: SettingDef) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

/** Wraps matches in a Royal Blue 12% highlight. */
export const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="bg-[#1E63FF]/[0.12] text-inherit rounded-[2px] px-px">
            {p}
          </mark>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        )
      )}
    </>
  );
};

/**
 * "Search settings…" (280px): a combobox that searches every section. Results are grouped by section;
 * ↑ ↓ move, Enter opens the setting, Esc closes. "/" focuses it (handled by the screen).
 */
export const SettingsSearch: React.FC<SettingsSearchProps> = ({ query, onQuery, open, onOpen, onPick, inputRef }) => {
  const uid = useId();
  const listId = `${uid}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const groups = useMemo(() => searchSettings(query), [query]);
  const flat = useMemo(() => groups.flatMap((g) => g.results), [groups]);
  const total = flat.length;
  const showPanel = open && query.trim().length > 0;

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!showPanel) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [showPanel, onOpen]);

  const pick = (def: SettingDef) => {
    onOpen(false);
    onPick(def);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (showPanel) onOpen(false);
      else onQuery('');
      return;
    }
    if (!showPanel || !total) return;
    if (e.key === 'ArrowDown') setActive((a) => (a + 1) % total);
    else if (e.key === 'ArrowUp') setActive((a) => (a - 1 + total) % total);
    else if (e.key === 'Enter') pick(flat[active]);
    else return;
    e.preventDefault();
  };

  let index = -1;
  return (
    <div ref={rootRef} className="relative w-full @min-[768px]:w-[280px]">
      <label htmlFor={`${uid}-input`} className="sr-only">
        Search settings
      </label>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7485] pointer-events-none" aria-hidden="true" />
      <input
        id={`${uid}-input`}
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showPanel && total ? `${uid}-opt-${active}` : undefined}
        aria-keyshortcuts="/"
        autoComplete="off"
        value={query}
        placeholder="Search settings…"
        onChange={(e) => {
          onQuery(e.target.value);
          onOpen(true);
        }}
        onFocus={() => query && onOpen(true)}
        onKeyDown={onKeyDown}
        className="w-full h-10 pl-9 pr-10 rounded-[8px] border border-[#8C95A6] bg-white text-[16px] @min-[640px]:text-[14px] text-[#121722] placeholder:text-[#6B7485] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20"
      />
      {query ? (
        <button
          type="button"
          onClick={() => {
            onQuery('');
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-0 top-0 w-10 h-10 flex items-center justify-center rounded-[8px] text-[#4B5465] hover:text-[#0B2D6B] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      ) : (
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-[#DDE2EA] bg-[#F7F9FC] font-mono text-[11px] text-[#4B5465]" aria-hidden="true">
          /
        </kbd>
      )}

      <div className="sr-only" aria-live="polite">
        {query.trim() ? (total ? `${total} setting${total === 1 ? '' : 's'} found` : `No settings match ${query}`) : ''}
      </div>

      {showPanel && (
        <div className={`${POPOVER} right-0 w-[min(440px,calc(100cqw-32px))] max-h-[420px] overflow-y-auto z-50`}>
          {total === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-[14px] text-[#121722]">No settings match ‘{query.trim()}’.</p>
              <button
                type="button"
                onClick={() => {
                  onQuery('');
                  inputRef.current?.focus();
                }}
                className={`${BUTTON.ghost} mt-2`}
              >
                Clear search
              </button>
            </div>
          ) : (
            <div id={listId} role="listbox" aria-label="Settings results" className="py-1">
              {groups.map((g) => (
                <div key={g.section} role="group" aria-labelledby={`${uid}-g-${g.section}`}>
                  <p id={`${uid}-g-${g.section}`} className="px-4 pt-3 pb-1 text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                    {g.sectionLabel}
                  </p>
                  {g.results.map((d) => {
                    index += 1;
                    const i = index;
                    return (
                      <div
                        key={d.id}
                        id={`${uid}-opt-${i}`}
                        role="option"
                        aria-selected={i === active}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => pick(d)}
                        onMouseEnter={() => setActive(i)}
                        className={`px-4 py-2 min-h-[44px] cursor-pointer ${i === active ? 'bg-[#F7F9FC]' : ''}`}
                      >
                        <span className="block text-[14px] leading-[20px] font-medium text-[#121722]">
                          <Highlight text={d.label} query={query} />
                        </span>
                        <span className="block text-[12px] leading-[16px] text-[#4B5465]">
                          {g.sectionLabel} · {d.card}
                          {d.description.toLowerCase().includes(query.trim().toLowerCase()) && (
                            <>
                              {' · '}
                              <Highlight text={d.description} query={query} />
                            </>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
