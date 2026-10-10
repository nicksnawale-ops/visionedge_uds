import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { PALETTE_ITEMS, PaletteItem, SHORTCUTS } from '../navigationSpec';
import { DemoScope } from '../shared/DemoScope';
import { ELEV3, FOCUS_LIGHT, isTyping } from '../shared/navStyles';
import { useFocusTrap } from '../shared/useFocusTrap';

const GROUPS: PaletteItem['group'][] = ['Recent', 'Pages', 'Actions', 'Settings'];

export const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="inline-flex items-center h-5 px-1.5 rounded-[4px] border border-[#DDE2EA] bg-[#F7F9FC] font-mono text-[11px] text-[#353D4C]">{children}</kbd>
);

/** Label with the matching text highlighted (Royal Blue 12%). */
const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  const q = query.trim();
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-[#1E63FF]/[0.12] text-inherit rounded-[2px]">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
};

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSelect: (item: PaletteItem) => void;
}

/**
 * Command palette replica (contained in its demo frame): dialog with a 56px combobox input and a grouped
 * listbox. ↑/↓ move (wrapping), Enter opens, Esc closes; focus is trapped and restored.
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const base = useId();
  useFocusTrap(dialog, open, { initial: input, onEscape: onClose });

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = PALETTE_ITEMS.filter((i) => !q || i.label.toLowerCase().includes(q) || i.path.toLowerCase().includes(q));
    return GROUPS.flatMap((g) => match.filter((i) => i.group === g));
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setIndex(0);
    }
  }, [open]);

  // Keep the selected row visible inside the list (never scrolls the page).
  useEffect(() => {
    const l = list.current;
    const el = l?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!l || !el) return;
    const top = el.offsetTop;
    if (top < l.scrollTop) l.scrollTop = top - 32;
    else if (top + el.offsetHeight > l.scrollTop + l.clientHeight) l.scrollTop = top + el.offsetHeight - l.clientHeight;
  }, [index]);

  if (!open) return null;

  const optId = (i: number) => `${base}-opt-${i}`;
  const onKey = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') setIndex((i) => (i + 1) % results.length);
    else if (e.key === 'ArrowUp') setIndex((i) => (i - 1 + results.length) % results.length);
    else if (e.key === 'Enter') onSelect(results[index]);
    else return;
    e.preventDefault();
  };

  return (
    <div className="absolute inset-0 z-50">
      <div aria-hidden="true" className="absolute inset-0 bg-black/50 rounded-[inherit]" onClick={onClose} />
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className={`absolute left-1/2 -translate-x-1/2 top-[15%] w-[640px] max-w-[calc(100%-32px)] rounded-[12px] bg-white overflow-hidden ${ELEV3}`}
      >
        <div className="relative h-14 flex items-center border-b border-[#DDE2EA]">
          <Search className="absolute left-4 w-5 h-5 text-[#6B7485]" aria-hidden="true" />
          <input
            ref={input}
            role="combobox"
            aria-expanded="true"
            aria-controls={`${base}-list`}
            aria-autocomplete="list"
            aria-activedescendant={results.length ? optId(index) : undefined}
            aria-label="Search pages, actions and settings"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={onKey}
            placeholder="Search…"
            className="w-full h-full pl-12 pr-12 text-[16px] text-[#121722] placeholder:text-[#6B7485] bg-transparent outline-none"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className={`absolute right-2 w-10 h-10 rounded-[8px] inline-flex items-center justify-center text-[#4B5465] hover:bg-[#EEF1F6] ${FOCUS_LIGHT}`}>
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <div ref={list} id={`${base}-list`} role="listbox" aria-label="Results" className="relative max-h-[300px] overflow-y-auto py-1">
          {results.length === 0 && (
            <p role="presentation" className="px-4 py-8 text-center text-[14px] text-[#4B5465]">
              No results for ‘{query}’
            </p>
          )}
          {GROUPS.map((g) => {
            const rows = results.map((r, i) => ({ r, i })).filter(({ r }) => r.group === g);
            if (!rows.length) return null;
            return (
              <div key={g} role="group" aria-labelledby={`${base}-${g}`}>
                <p id={`${base}-${g}`} role="presentation" className="px-4 pt-3 pb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  {g}
                </p>
                {rows.map(({ r, i }) => {
                  const Icon = r.icon;
                  const sel = i === index;
                  return (
                    <div
                      key={r.id}
                      id={optId(i)}
                      role="option"
                      aria-selected={sel}
                      onPointerMove={() => setIndex(i)}
                      onPointerDown={(e) => e.preventDefault()}
                      onClick={() => onSelect(r)}
                      className={`relative h-10 px-4 flex items-center gap-3 cursor-pointer ${sel ? 'bg-[#1E63FF]/[0.08]' : ''}`}
                    >
                      {sel && <span aria-hidden="true" className="absolute left-0 inset-y-0 w-[3px] bg-[#1E63FF]" />}
                      <Icon className="w-4 h-4 shrink-0 text-[#4B5465]" aria-hidden="true" />
                      <span className="text-[14px] text-[#121722] whitespace-nowrap">
                        <Highlight text={r.label} query={query} />
                      </span>
                      <span className="flex-1 min-w-0 text-[12px] text-[#6B7485] truncate">{r.path}</span>
                      {r.shortcut && (
                        <span className="hidden sm:inline-flex gap-1" aria-hidden="true">
                          {r.shortcut.split(' ').map((k) => (
                            <Kbd key={k}>{k}</Kbd>
                          ))}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="h-10 px-4 flex items-center gap-2 bg-[#F7F9FC] border-t border-[#DDE2EA] text-[12px] text-[#4B5465]">
          <Kbd>↑↓</Kbd> to navigate · <Kbd>Enter</Kbd> to open · <Kbd>Esc</Kbd> to close
        </div>
      </div>
    </div>
  );
};

/** "?" panel listing the shortcuts (contained dialog). */
const ShortcutsDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useFocusTrap(ref, open, { onEscape: onClose });
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50">
      <div aria-hidden="true" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`absolute left-1/2 -translate-x-1/2 top-[15%] w-[420px] max-w-[calc(100%-32px)] rounded-[12px] bg-white p-5 ${ELEV3}`}>
        <div className="flex items-center justify-between">
          <h3 id={titleId} className="text-[16px] font-semibold text-[#121722]">
            Keyboard shortcuts
          </h3>
          <button type="button" onClick={onClose} aria-label="Close" className={`w-10 h-10 rounded-[8px] inline-flex items-center justify-center text-[#4B5465] hover:bg-[#EEF1F6] ${FOCUS_LIGHT}`}>
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <ShortcutList />
      </div>
    </div>
  );
};

export const ShortcutList: React.FC = () => (
  <dl className="mt-2 divide-y divide-[#DDE2EA]">
    {SHORTCUTS.map(([keys, desc]) => (
      <div key={desc} className="py-2 flex items-center justify-between gap-4">
        <dt className="text-[14px] text-[#353D4C]">{desc}</dt>
        <dd className="flex items-center gap-1 shrink-0">
          {keys.map((k, i) => (k === 'then' ? <span key={i} className="text-[12px] text-[#6B7485]">then</span> : <Kbd key={i}>{k}</Kbd>))}
        </dd>
      </div>
    ))}
  </dl>
);

const GO: Record<string, string> = { d: 'Dashboard', l: 'Live view', a: 'Alerts' };

/** Demo: shortcuts only work while focus is inside this frame (Ctrl/Cmd K, "/", "?", G then D/L/A). */
export const CommandPaletteDemo: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [help, setHelp] = useState(false);
  const [page, setPage] = useState('Dashboard');
  const [status, setStatus] = useState('Click inside this frame, then press Ctrl K (or Cmd K), /, ? or G then D.');
  const gAt = useRef(0);
  const frame = useRef<HTMLDivElement>(null);

  const select = (item: PaletteItem) => {
    setOpen(false);
    if (item.id === 'a-shortcuts') {
      setHelp(true);
      return;
    }
    if (item.group === 'Pages' || item.group === 'Recent') setPage(item.label);
    setStatus(`Opened “${item.label}” (${item.path}).`);
  };

  const onShortcut = (e: React.KeyboardEvent): boolean => {
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 'k') {
      setHelp(false);
      setOpen((o) => !o);
      return true;
    }
    if (open || help || isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey) return false;
    if (e.key === '/') {
      setOpen(true);
      return true;
    }
    if (e.key === '?') {
      setHelp(true);
      return true;
    }
    if (k === 'g') {
      gAt.current = Date.now();
      setStatus('G pressed: now press D, L or A.');
      return true;
    }
    if (GO[k] && Date.now() - gAt.current < 1500) {
      gAt.current = 0;
      setPage(GO[k]);
      setStatus(`Went to ${GO[k]}.`);
      return true;
    }
    return false;
  };

  return (
    <DemoScope label="Command palette demo" onShortcut={onShortcut}>
      <div
        ref={frame}
        tabIndex={-1}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) frame.current?.focus();
        }}
        className="relative h-[540px] rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
      >
        <div className="h-16 px-4 flex items-center gap-3 border-b border-[#DDE2EA]">
          <span className="text-[14px] font-medium text-[#121722] mr-auto">{page}</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-keyshortcuts="Control+K Meta+K /"
            className={`w-[320px] max-w-full h-10 px-3 flex items-center gap-2 rounded-[8px] border border-[#8C95A6] bg-white text-[14px] text-[#6B7485] hover:border-[#4B5465] ${FOCUS_LIGHT}`}
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span className="flex-1 text-left">Search…</span>
            <span className="h-6 px-1.5 inline-flex items-center rounded-[4px] bg-[#F7F9FC] border border-[#DDE2EA] font-mono text-[11px] text-[#4B5465]">Ctrl K</span>
          </button>
        </div>
        <div className="p-6 space-y-3" onMouseDown={() => frame.current?.focus()}>
          <p className="text-[14px] text-[#4B5465]" aria-live="polite">
            {status}
          </p>
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} aria-hidden="true" className="block h-10 rounded-[8px] bg-[#F7F9FC] border border-[#DDE2EA]" />
          ))}
        </div>
        <CommandPalette open={open} onClose={() => setOpen(false)} onSelect={select} />
        <ShortcutsDialog open={help} onClose={() => setHelp(false)} />
      </div>
    </DemoScope>
  );
};

export const PALETTE_CODE = `// Command palette: dialog + combobox input + grouped listbox (aria-activedescendant)
<div className="fixed inset-0 z-50">
  <div aria-hidden="true" className="absolute inset-0 bg-black/50" onClick={close} />
  <div role="dialog" aria-modal="true" aria-label="Search"
    className="absolute left-1/2 -translate-x-1/2 top-[15vh] w-[640px] max-w-[calc(100%-32px)] rounded-[12px] bg-white shadow-[0_12px_32px_rgba(11,45,107,0.18)]">
    <div className="relative h-14 flex items-center border-b border-[#DDE2EA]">
      <Search className="absolute left-4 w-5 h-5 text-[#6B7485]" aria-hidden="true" />
      <input role="combobox" aria-expanded="true" aria-controls="results" aria-activedescendant={'opt-' + index}
        aria-label="Search pages, actions and settings" placeholder="Search…" className="w-full h-full pl-12 text-[16px] outline-none" />
    </div>
    <div id="results" role="listbox" className="max-h-[300px] overflow-y-auto">
      <div role="group" aria-labelledby="g-pages">
        <p id="g-pages" className="px-4 pt-3 pb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">Pages</p>
        <div id="opt-0" role="option" aria-selected="true" className="relative h-10 px-4 flex items-center gap-3 bg-[#1E63FF]/[0.08]">
          <span aria-hidden="true" className="absolute left-0 inset-y-0 w-[3px] bg-[#1E63FF]" />
          <FileText className="w-4 h-4 text-[#4B5465]" aria-hidden="true" />
          <span className="text-[14px]"><mark className="bg-[#1E63FF]/[0.12]">Veh</mark>icle log</span>
          <span className="flex-1 text-[12px] text-[#6B7485]">Reports / Vehicle log</span>
        </div>
      </div>
    </div>
    <div className="h-10 px-4 flex items-center bg-[#F7F9FC] border-t border-[#DDE2EA] text-[12px] text-[#4B5465]">
      ↑↓ to navigate · Enter to open · Esc to close
    </div>
  </div>
</div>`;
