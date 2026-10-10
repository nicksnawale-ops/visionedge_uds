import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Plus } from 'lucide-react';
import { BARE_INPUT, BaseFieldProps, FieldShell, describedBy, segmented } from './FieldShell';

interface ComboboxFieldProps extends BaseFieldProps {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  /** Allow "Create 'xyz'" when nothing matches. */
  onCreate?: (v: string) => void;
  placeholder?: string;
}

/**
 * Searchable combobox: type to filter, ↑ ↓ to move, Enter to choose, Esc to close.
 * With no match it says "No results" and, if allowed, offers "Create 'xyz'".
 */
export const ComboboxField: React.FC<ComboboxFieldProps> = ({ id, label, optional, helper, error, disabled, readOnly, onBlur, options, value, onChange, onCreate, placeholder = 'Type to search' }) => {
  const listId = useId();
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => setQuery(value), [value]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q && q !== value.toLowerCase() ? options.filter((o) => o.toLowerCase().includes(q)) : options;
  }, [options, query, value]);
  const canCreate = Boolean(onCreate && query.trim() && !options.some((o) => o.toLowerCase() === query.trim().toLowerCase()));
  const count = matches.length + (canCreate ? 1 : 0);

  const choose = (i: number) => {
    if (i < matches.length) onChange(matches[i]);
    else if (canCreate) {
      onCreate?.(query.trim());
      onChange(query.trim());
    }
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setOpen(true);
      setActive((a) => (open ? Math.min(count - 1, a + 1) : 0));
    } else if (e.key === 'ArrowUp') setActive((a) => Math.max(0, a - 1));
    else if (e.key === 'Enter' && open && count) choose(active);
    else if (e.key === 'Escape' && open) {
      setOpen(false);
      setQuery(value);
    } else return;
    e.preventDefault();
  };

  const optId = (i: number) => `${listId}-${i}`;
  return (
    <FieldShell id={id} label={label} optional={optional} helper={helper} error={error}>
      <div
        ref={rootRef}
        className="relative"
        onBlur={(e) => {
          if (rootRef.current?.contains(e.relatedTarget as Node | null)) return;
          setOpen(false);
          if (query !== value) setQuery(value);
          onBlur?.();
        }}
      >
        <div className={segmented({ error, disabled, readOnly })}>
          <input
            id={id}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && count ? optId(active) : undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(id, helper, error)}
            autoComplete="off"
            value={query}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onFocus={() => !readOnly && setOpen(true)}
            onKeyDown={onKeyDown}
            className={BARE_INPUT}
          />
          <span className="flex items-center pr-3 text-[#4B5465]" aria-hidden="true">
            <ChevronDown className="w-4 h-4" />
          </span>
        </div>
        {open && !readOnly && !disabled && (
          <ul id={listId} role="listbox" aria-label={label} className="absolute z-40 mt-2 w-full max-h-[240px] overflow-y-auto rounded-[8px] bg-white border border-[#DDE2EA] shadow-[0_4px_12px_rgba(11,45,107,0.12)] py-1">
            {matches.map((o, i) => (
              <li
                key={o}
                id={optId(i)}
                role="option"
                aria-selected={o === value}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
                onMouseEnter={() => setActive(i)}
                className={`flex items-center justify-between gap-2 px-3 min-h-[44px] text-[14px] text-[#121722] cursor-pointer ${i === active ? 'bg-[#F7F9FC]' : ''}`}
              >
                {o}
                {o === value && <Check className="w-4 h-4 text-[#1E63FF]" aria-hidden="true" />}
              </li>
            ))}
            {matches.length === 0 && (
              <li role="presentation" className="px-3 py-2 text-[13px] text-[#6B7485]">
                No results
              </li>
            )}
            {canCreate && (
              <li
                id={optId(matches.length)}
                role="option"
                aria-selected={false}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(matches.length)}
                onMouseEnter={() => setActive(matches.length)}
                className={`flex items-center gap-2 px-3 min-h-[44px] text-[14px] font-medium text-[#1E63FF] cursor-pointer border-t border-[#EEF1F6] ${active === matches.length ? 'bg-[#F7F9FC]' : ''}`}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Create ‘{query.trim()}’
              </li>
            )}
          </ul>
        )}
      </div>
    </FieldShell>
  );
};
