import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Check, ChevronDown, Lock, Plus, Search, X, type LucideIcon } from 'lucide-react';
import { Tooltip } from '../ui';
import { SEARCH_THRESHOLD, SelectOption, fixedContainer, isTimeList, matches, splitMatch } from './selectHelpers';

export type { SelectOption } from './selectHelpers';

interface CommonProps {
  /** Trigger id: keeps `<label htmlFor>` and field focus (e.g. jump to an error) working. */
  id?: string;
  /** Read-only (e.g. while saving): Gray 50, not openable. */
  readOnly?: boolean;
  /** Locked with a reason: Lock icon + tooltip (e.g. "Managed by your administrator"). */
  locked?: string;
  /** 'pill': dashed Royal Blue "+ Add …" action trigger that always shows the placeholder. */
  variant?: 'field' | 'pill';
  /** id of the visible label. */
  labelledBy?: string;
  /** Name when there's no visible label (e.g. table filters). */
  ariaLabel?: string;
  /** Row description / error text. */
  describedBy?: string;
  options: readonly SelectOption[];
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  /** 'md' 40px (default) · 'sm' 32px compact · 'lg' 44px (mobile section nav). */
  size?: 'md' | 'sm' | 'lg';
  /** Table filter: active style when a value other than the first ("All …") is chosen. */
  filter?: boolean;
  icon?: LucideIcon;
  /** Fixed text before the value, e.g. "Section:". */
  prefix?: string;
  /** Width classes for the trigger (defaults to full width). */
  className?: string;
  /** Defaults to on above 8 options (not for time lists). */
  searchable?: boolean;
  popoverMinWidth?: number;
  /** Prefer opening upward (e.g. at the bottom of a card); flips when there's no room. */
  placement?: 'below' | 'above';
}

interface SingleProps extends CommonProps {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
}

interface MultiProps extends CommonProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
}

export type ProfileSelectProps = SingleProps | MultiProps;

interface Position {
  top: number;
  left: number;
  above: boolean;
  maxHeight: number;
}

const GAP = 4;
const EDGE = 8;
const MAX_HEIGHT = 320;

/**
 * Profile select (listbox pattern; multi uses aria-multiselectable). Variants: single, searchable (auto above
 * 8 options), multi (chips + checkboxes), time (auto for "HH:MM" lists), compact (size="sm"), filter, plus
 * read-only, locked and the "Add …" pill. The popover is portalled to the element `position: fixed` resolves
 * against (the showcase frame, or the viewport), so cards, tables and modals never clip it; z-[80] keeps it
 * above modals (z-[70]).
 */
export const ProfileSelect: React.FC<ProfileSelectProps> = (props) => {
  const {
    id,
    labelledBy,
    ariaLabel,
    describedBy,
    options,
    placeholder = 'Select',
    invalid = false,
    disabled = false,
    size = 'md',
    filter = false,
    icon: Icon,
    prefix,
    className = 'w-full',
    popoverMinWidth = 220,
    placement = 'below',
    readOnly = false,
    locked,
    variant = 'field',
  } = props;
  /** Not openable: disabled, read-only or locked. */
  const inert = disabled || readOnly || !!locked;
  const uid = useId();
  const listId = `${uid}-list`;
  const valueId = `${uid}-value`;
  const nameId = `${uid}-name`;
  const fieldRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const typeahead = useRef({ query: '', at: 0 });

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const [query, setQuery] = useState('');
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState(popoverMinWidth);
  const [pos, setPos] = useState<Position | null>(null);
  const [shown, setShown] = useState(false);

  const time = isTimeList(options);
  const searchable = props.searchable ?? (!time && options.length > SEARCH_THRESHOLD);
  const isSelected = (o: SelectOption) => (props.multiple ? props.value.includes(o.value) : o.value === props.value);
  const selectedIndex = options.findIndex(isSelected);
  const current = selectedIndex >= 0 ? options[selectedIndex] : null;
  const visible = options.map((o, i) => ({ o, i })).filter(({ o }) => !searchable || matches(o, query));
  const navigable = visible.filter(({ o }) => !o.disabled).map(({ i }) => i);
  const filterActive = filter && !props.multiple && options.length > 0 && props.value !== options[0].value;
  const labelIds = [labelledBy ?? (ariaLabel ? nameId : undefined), valueId].filter(Boolean).join(' ');

  const openAt = (index: number, viaKeyboard: boolean) => {
    if (inert) return;
    const anchor = fieldRef.current;
    if (!anchor) return;
    setHost(fixedContainer(anchor) ?? document.body);
    setWidth(Math.max(popoverMinWidth, anchor.offsetWidth));
    setQuery('');
    setActive(index >= 0 && !options[index]?.disabled ? index : Math.max(0, options.findIndex((o) => !o.disabled)));
    setKeyboard(viaKeyboard);
    setPos(null);
    setShown(false);
    setOpen(true);
  };

  const close = (refocus: boolean) => {
    setOpen(false);
    setPos(null);
    setShown(false);
    if (refocus) triggerRef.current?.focus({ preventScroll: true });
  };

  const choose = (index: number) => {
    const o = options[index];
    if (!o || o.disabled) return;
    if (props.multiple) {
      props.onChange(props.value.includes(o.value) ? props.value.filter((v) => v !== o.value) : [...props.value, o.value]);
      return;
    }
    props.onChange(o.value);
    close(true);
  };

  /** Type-ahead (no search field): repeated letters cycle, quick typing matches a prefix ("14" → 14:00). */
  const matchTyped = (ch: string, from: number): number => {
    const now = Date.now();
    const t = typeahead.current;
    t.query = now - t.at < 700 ? t.query + ch : ch;
    t.at = now;
    const q = t.query.toLowerCase();
    const start = t.query.length === 1 ? from + 1 : from;
    for (let k = 0; k < options.length; k += 1) {
      const i = (start + k) % options.length;
      if (!options[i].disabled && options[i].label.toLowerCase().startsWith(q)) return i;
    }
    return -1;
  };

  // Place in the coordinate space of the fixed-position container (scaled showcase frame or viewport).
  useLayoutEffect(() => {
    if (!open || !host) return;
    const place = () => {
      const anchor = fieldRef.current;
      const pop = popRef.current;
      if (!anchor || !pop) return;
      const framed = host !== document.body;
      const hr = framed ? host.getBoundingClientRect() : new DOMRect(0, 0, window.innerWidth, window.innerHeight);
      const hostWidth = framed ? host.offsetWidth : window.innerWidth;
      const scale = framed && hostWidth ? hr.width / hostWidth : 1;
      const r = anchor.getBoundingClientRect();
      const visTop = Math.max(hr.top, 0);
      const visBottom = Math.min(hr.bottom, window.innerHeight);
      const roomBelow = (visBottom - r.bottom) / scale - GAP - EDGE;
      const roomAbove = (r.top - visTop) / scale - GAP - EDGE;
      const h = Math.min(pop.scrollHeight, MAX_HEIGHT);
      const above = placement === 'above' ? h <= roomAbove || roomAbove > roomBelow : h > roomBelow && roomAbove > roomBelow;
      const maxHeight = Math.max(120, Math.min(MAX_HEIGHT, above ? roomAbove : roomBelow));
      const height = Math.min(h, maxHeight);
      const top = above ? (r.top - hr.top) / scale - GAP - height : (r.bottom - hr.top) / scale + GAP;
      const w = Math.min(width, hostWidth - EDGE * 2);
      const left = Math.max(EDGE, Math.min((r.left - hr.left) / scale, hostWidth - w - EDGE));
      setPos((p) => (p && p.top === top && p.left === left && p.above === above && p.maxHeight === maxHeight ? p : { top, left, above, maxHeight }));
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open, host, width, placement, query]);

  const placed = pos !== null;
  useEffect(() => {
    if (!open || !placed) return;
    (searchable ? searchRef.current : listRef.current)?.focus({ preventScroll: true });
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, [open, placed, searchable]);

  // Keep the active option in view; on open, centre the selected one (time lists start at the current value).
  const centred = useRef(false);
  useEffect(() => {
    if (!open) centred.current = false;
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    if (!open || !placed || !list || !el) return;
    if (!centred.current) {
      centred.current = true;
      list.scrollTop = el.offsetTop - list.clientHeight / 2 + el.offsetHeight / 2;
      return;
    }
    if (el.offsetTop < list.scrollTop) list.scrollTop = el.offsetTop - 6;
    else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight + 6;
  }, [active, open, placed]);

  useEffect(() => {
    if (!open) return;
    const inside = (t: EventTarget | null) => t instanceof Node && (!!popRef.current?.contains(t) || !!fieldRef.current?.contains(t));
    const onPointer = (e: PointerEvent) => {
      if (!inside(e.target)) close(false);
    };
    const onScroll = (e: Event) => {
      if (e.target instanceof Node && popRef.current?.contains(e.target)) return;
      close(!!popRef.current?.contains(document.activeElement));
    };
    document.addEventListener('pointerdown', onPointer, true);
    document.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('pointerdown', onPointer, true);
      document.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  const step = (dir: 1 | -1): number => {
    if (!navigable.length) return -1;
    const at = navigable.indexOf(active);
    if (at < 0) return navigable[dir === 1 ? 0 : navigable.length - 1];
    return navigable[Math.max(0, Math.min(navigable.length - 1, at + dir))];
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (inert) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      openAt(selectedIndex, true);
    } else if (!searchable && e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const i = matchTyped(e.key, selectedIndex);
      if (i >= 0) openAt(i, true);
    }
  };

  /** Shared by the listbox and the search field. */
  const onPopoverKeyDown = (e: React.KeyboardEvent) => {
    const inSearch = e.target === searchRef.current;
    let next = -1;
    if (e.key === 'ArrowDown') next = step(1);
    else if (e.key === 'ArrowUp') next = step(-1);
    else if ((e.key === 'Home' || e.key === 'End') && !(inSearch && query)) next = e.key === 'Home' ? (navigable[0] ?? -1) : (navigable[navigable.length - 1] ?? -1);
    else if (e.key === 'Enter' || (e.key === ' ' && !inSearch)) {
      e.preventDefault();
      if (navigable.includes(active)) choose(active);
      return;
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close(true);
      return;
    } else if (e.key === 'Tab') {
      // Focus goes back to the trigger; the browser's Tab then moves on from there.
      e.stopPropagation();
      close(true);
      return;
    } else if (!inSearch && e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      next = matchTyped(e.key, active);
    }
    if (next < 0) return;
    e.preventDefault();
    setKeyboard(true);
    setActive(next);
  };

  /* ── Trigger ── */
  const height = size === 'sm' ? 'h-8 text-[13px]' : size === 'lg' ? 'h-11 text-[14px]' : 'h-10 text-[14px]';
  const look = disabled
    ? 'bg-[#F7F9FC] border border-[#DDE2EA] text-[#8C95A6] cursor-not-allowed'
    : readOnly || locked
      ? 'bg-[#F7F9FC] border border-[#DDE2EA] text-[#353D4C] cursor-default'
      : invalid
      ? 'bg-white border-2 border-[#0B2D6B] text-[#121722]'
      : filterActive
        ? `bg-[#1E63FF]/[0.08] border border-[#1E63FF] text-[#1E63FF] ${open ? 'ring-[3px] ring-[#1E63FF]/20' : ''}`
        : open
          ? 'bg-white border border-[#1E63FF] ring-[3px] ring-[#1E63FF]/20 text-[#121722]'
          : 'bg-white border border-[#8C95A6] hover:border-[#4B5465] text-[#121722]';
  const focusRing = disabled ? '' : 'focus-within:border-[#1E63FF] focus-within:ring-[3px] focus-within:ring-[#1E63FF]/20';
  const iconTone = disabled ? 'text-[#8C95A6]' : filterActive ? 'text-[#1E63FF]' : 'text-[#4B5465]';
  const mono = time ? 'font-mono tabular-nums' : '';

  const chevron = (
    <ChevronDown className={`w-4 h-4 shrink-0 ${iconTone} transition-transform duration-150 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
  );

  const triggerButtonProps = {
    ref: triggerRef,
    id,
    type: 'button' as const,
    disabled,
    'aria-haspopup': 'listbox' as const,
    'aria-expanded': open,
    'aria-controls': open ? listId : undefined,
    'aria-labelledby': labelIds,
    'aria-describedby': describedBy,
    'aria-invalid': invalid || undefined,
    'aria-readonly': readOnly || !!locked || undefined,
    onClick: (e: React.MouseEvent) => (open ? close(true) : openAt(selectedIndex, e.detail === 0)),
    onKeyDown: onTriggerKeyDown,
  };

  const multiValues = props.multiple ? options.filter((o) => props.value.includes(o.value)) : [];

  const trigger = props.multiple ? (
    <div ref={fieldRef} className={`relative flex items-center gap-1.5 min-h-10 pl-2 pr-3 py-1 rounded-[8px] transition-colors ${look} ${focusRing} ${className}`}>
      {multiValues.slice(0, 2).map((o) => (
        <span key={o.value} className="inline-flex items-center gap-1 h-6 pl-2 pr-1 rounded-full bg-[#EEF1F6] text-[12px] text-[#121722] max-w-[140px]">
          <span className="truncate">{o.label}</span>
          {!disabled && (
            <button
              type="button"
              aria-label={`Remove ${o.label}`}
              onClick={() => props.onChange(props.value.filter((v) => v !== o.value))}
              className="relative w-4 h-4 inline-flex items-center justify-center rounded-full text-[#4B5465] hover:bg-[#DDE2EA] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] before:absolute before:-inset-3 before:content-['']"
            >
              <X className="w-3 h-3" aria-hidden="true" />
            </button>
          )}
        </span>
      ))}
      {multiValues.length > 2 && <span className="text-[12px] text-[#4B5465] whitespace-nowrap">+{multiValues.length - 2} more</span>}
      <button {...triggerButtonProps} className={`flex-1 min-w-[40px] h-8 flex items-center justify-end gap-2 outline-none ${disabled ? 'cursor-not-allowed' : ''}`}>
        <span id={valueId} className={multiValues.length ? 'sr-only' : 'flex-1 text-left text-[#6B7485] truncate'}>
          {multiValues.length ? `${multiValues.length} selected: ${multiValues.map((o) => o.label).join(', ')}` : placeholder}
        </span>
        {invalid && <AlertCircle className="w-4 h-4 shrink-0 text-[#0B2D6B]" aria-hidden="true" />}
        {chevron}
      </button>
    </div>
  ) : variant === 'pill' ? (
    <div ref={fieldRef} className={`relative inline-flex ${className}`}>
      <button
        {...triggerButtonProps}
        className={`relative h-8 inline-flex items-center gap-1.5 pl-2.5 pr-2 rounded-full border border-dashed text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2 before:absolute before:-inset-y-1 before:inset-x-0 before:content-[''] ${
          disabled ? 'border-[#DDE2EA] text-[#8C95A6] cursor-not-allowed' : `border-[#1E63FF] text-[#1E63FF] bg-white ${open ? 'bg-[#1E63FF]/[0.08]' : 'hover:bg-[#1E63FF]/[0.08]'}`
        }`}
      >
        <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span id={valueId}>{placeholder}</span>
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-150 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
    </div>
  ) : (
    <div ref={fieldRef} className={`relative ${className}`}>
      {(() => {
        // Option icons show in the trigger only when every option has one (e.g. landing pages, sections).
        const LeadIcon = Icon ?? (options.every((o) => o.icon) ? current?.icon : undefined);
        const button = (describedByTip?: string) => (
          <button
            {...triggerButtonProps}
            aria-describedby={[describedBy, describedByTip].filter(Boolean).join(' ') || undefined}
            className={`w-full ${height} flex items-center gap-2 px-3 rounded-[8px] text-left outline-none transition-colors ${look} ${
              disabled ? '' : 'focus-visible:border-[#1E63FF] focus-visible:ring-[3px] focus-visible:ring-[#1E63FF]/20'
            }`}
          >
            {LeadIcon && <LeadIcon className={`w-4 h-4 shrink-0 ${iconTone}`} aria-hidden="true" />}
            {prefix && (
              <span className={`shrink-0 ${disabled ? '' : 'text-[#4B5465]'}`} aria-hidden="true">
                {prefix}
              </span>
            )}
            <span id={valueId} className={`flex-1 min-w-0 truncate ${mono} ${current ? (filterActive ? 'font-medium' : '') : 'text-[#6B7485]'}`}>
              {current ? current.label : placeholder}
            </span>
            {invalid && <AlertCircle className="w-4 h-4 shrink-0 text-[#0B2D6B]" aria-hidden="true" />}
            {locked ? <Lock className="w-4 h-4 shrink-0 text-[#6B7485]" aria-hidden="true" /> : chevron}
          </button>
        );
        return locked ? (
          <Tooltip content={locked} placement="top" align="end" className="w-full">
            {(tipId) => button(tipId)}
          </Tooltip>
        ) : (
          button()
        );
      })()}
    </div>
  );

  /* ── Popover ── */
  const groups: { name?: string; items: { o: SelectOption; i: number }[] }[] = [];
  visible.forEach((item) => {
    const last = groups[groups.length - 1];
    if (last && last.name === item.o.group) last.items.push(item);
    else groups.push({ name: item.o.group, items: [item] });
  });

  const renderOption = ({ o, i }: { o: SelectOption; i: number }) => {
    const selected = isSelected(o);
    const isActive = i === active;
    const parts = searchable ? splitMatch(o.label, query) : null;
    return (
      <div
        key={o.value}
        id={`${listId}-${i}`}
        data-index={i}
        role="option"
        aria-selected={selected}
        aria-disabled={o.disabled || undefined}
        onMouseDown={(e) => e.preventDefault()}
        onMouseMove={() => {
          if (!o.disabled && (!isActive || keyboard)) {
            setActive(i);
            setKeyboard(false);
          }
        }}
        onClick={() => choose(i)}
        className={`min-h-10 flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] select-none ${o.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${
          selected && !props.multiple ? 'bg-[#1E63FF]/[0.08]' : isActive && !o.disabled ? 'bg-[#F7F9FC]' : ''
        } ${isActive && keyboard ? 'ring-2 ring-inset ring-[#1E63FF]' : ''}`}
      >
        {props.multiple && (
          <span
            aria-hidden="true"
            className={`w-4 h-4 shrink-0 rounded-[4px] border flex items-center justify-center ${selected ? 'bg-[#1E63FF] border-[#1E63FF]' : 'bg-white border-[#8C95A6]'}`}
          >
            {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
          </span>
        )}
        {o.icon ? (
          <o.icon className={`w-4 h-4 shrink-0 ${selected && !props.multiple ? 'text-[#1E63FF]' : 'text-[#4B5465]'}`} aria-hidden="true" />
        ) : o.dot ? (
          <span className="w-4 h-4 shrink-0 flex items-center justify-center" aria-hidden="true">
            <span className={`w-2 h-2 rounded-full ${o.dot}`} />
          </span>
        ) : null}
        <span className="flex-1 min-w-0">
          <span className={`block truncate text-[14px] leading-5 ${mono} ${selected && !props.multiple ? 'text-[#1E63FF] font-medium' : 'text-[#353D4C]'}`}>
            {parts ? (
              <>
                {parts[0]}
                <mark className="bg-[#1E63FF]/[0.12] text-inherit rounded-[2px]">{parts[1]}</mark>
                {parts[2]}
              </>
            ) : (
              o.label
            )}
            {o.srText && <span className="sr-only">, {o.srText}</span>}
          </span>
          {o.description && <span className="block text-[12px] leading-4 text-[#6B7485]">{o.description}</span>}
        </span>
        {o.meta && (
          <span className="shrink-0 font-mono text-[12px] text-[#6B7485] tabular-nums" aria-hidden={o.srText ? true : undefined}>
            {o.meta}
          </span>
        )}
        {!props.multiple && <Check className={`w-4 h-4 shrink-0 ${selected ? 'text-[#1E63FF]' : 'invisible'}`} aria-hidden="true" />}
      </div>
    );
  };

  const popover =
    open && host
      ? createPortal(
          <div
            ref={popRef}
            onKeyDown={onPopoverKeyDown}
            style={
              pos
                ? { top: pos.top, left: pos.left, width: Math.min(width, (host === document.body ? window.innerWidth : host.offsetWidth) - EDGE * 2), maxHeight: pos.maxHeight }
                : { top: 0, left: -9999, width, visibility: 'hidden' }
            }
            className={`fixed z-[80] flex flex-col rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_4px_12px_rgba(11,45,107,0.12)] text-left transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none ${
              shown ? 'opacity-100 translate-y-0' : `opacity-0 ${pos?.above ? 'translate-y-1' : '-translate-y-1'}`
            }`}
          >
            {searchable && (
              <div className="p-1.5 pb-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7485] pointer-events-none" aria-hidden="true" />
                  <input
                    ref={searchRef}
                    type="text"
                    role="combobox"
                    aria-expanded="true"
                    aria-controls={listId}
                    aria-autocomplete="list"
                    aria-activedescendant={navigable.includes(active) ? `${listId}-${active}` : undefined}
                    aria-label="Search options"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      const first = options.findIndex((o) => !o.disabled && matches(o, e.target.value));
                      if (first >= 0) setActive(first);
                      setKeyboard(true);
                    }}
                    placeholder="Search"
                    className="w-full h-9 pl-8 pr-2 rounded-[8px] border border-[#DDE2EA] bg-white text-[14px] text-[#121722] placeholder:text-[#6B7485] outline-none focus:border-[#1E63FF]"
                  />
                </div>
              </div>
            )}
            <div
              ref={listRef}
              id={listId}
              role="listbox"
              tabIndex={-1}
              aria-labelledby={labelledBy ?? (ariaLabel ? nameId : undefined)}
              aria-multiselectable={props.multiple || undefined}
              aria-activedescendant={!searchable && navigable.includes(active) ? `${listId}-${active}` : undefined}
              className="relative flex-1 min-h-0 overflow-y-auto p-1.5 outline-none"
            >
              {visible.length === 0 && <p className="px-2.5 py-3 text-[14px] text-[#6B7485]">No matches</p>}
              {groups.map((g, gi) =>
                g.name ? (
                  <div key={g.name} role="group" aria-labelledby={`${uid}-g${gi}`} className={gi > 0 ? 'mt-1.5 pt-1.5 border-t border-[#DDE2EA]' : ''}>
                    <div id={`${uid}-g${gi}`} role="presentation" className="px-2.5 pt-1 pb-1 text-[11px] leading-4 font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                      {g.name}
                    </div>
                    {g.items.map(renderOption)}
                  </div>
                ) : (
                  <React.Fragment key={`g${gi}`}>{g.items.map(renderOption)}</React.Fragment>
                ),
              )}
            </div>
            {props.multiple && (
              <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-[#DDE2EA]">
                <span className="text-[12px] text-[#4B5465]" aria-live="polite">
                  {props.value.length} selected
                </span>
                <button
                  type="button"
                  onClick={() => props.onChange([])}
                  disabled={!props.value.length}
                  className="h-8 px-2 rounded-[8px] text-[13px] font-semibold text-[#1E63FF] hover:bg-[#EEF1F6] disabled:text-[#8C95A6] disabled:hover:bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
                >
                  Clear
                </button>
              </div>
            )}
          </div>,
          host,
        )
      : null;

  return (
    <>
      {ariaLabel && !labelledBy && (
        <span id={nameId} className="sr-only">
          {ariaLabel}
        </span>
      )}
      {trigger}
      {popover}
    </>
  );
};
