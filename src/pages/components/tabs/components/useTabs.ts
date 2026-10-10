import React, { useCallback, useId, useRef, useState } from 'react';
import type { Activation, TabItem } from './tabStyles';

interface UseTabsOptions {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  activation?: Activation;
  orientation?: 'horizontal' | 'vertical';
  /** Accessible name of the tab list. */
  label: string;
  /** Extra keys on a focused tab (e.g. Delete closes it). */
  onTabKeyDown?: (e: React.KeyboardEvent, item: TabItem) => void;
  /** False when no tab panels are rendered (bare tab bars), so aria-controls never points at nothing. */
  controls?: boolean;
}

/**
 * Shared tab behaviour (WAI-ARIA tabs pattern):
 * - roving tabindex: only the selected tab is in the Tab order;
 * - ←/→ (↑/↓ when vertical) move focus, Home/End go to the ends, focus wraps;
 * - automatic activation selects on focus; manual activation waits for Enter/Space;
 * - disabled tabs (aria-disabled) stay focusable but never activate.
 */
export function useTabs({ items, value, onChange, activation = 'automatic', orientation = 'horizontal', label, onTabKeyDown, controls = true }: UseTabsOptions) {
  const base = useId();
  const refs = useRef(new Map<string, HTMLElement>());
  const [focused, setFocused] = useState<string | null>(null);

  const tabId = (id: string) => `${base}-tab-${id}`;
  const panelId = (id: string) => `${base}-panel-${id}`;

  const activate = useCallback(
    (item: TabItem) => {
      if (!item.disabled && item.id !== value) onChange(item.id);
    },
    [onChange, value]
  );

  const moveTo = (index: number) => {
    const item = items[(index + items.length) % items.length];
    refs.current.get(item.id)?.focus();
    if (activation === 'automatic') activate(item);
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const item = items[index];
    const prev = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const next = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    if (e.key === next) moveTo(index + 1);
    else if (e.key === prev) moveTo(index - 1);
    else if (e.key === 'Home') moveTo(0);
    else if (e.key === 'End') moveTo(items.length - 1);
    else if (e.key === 'Enter' || e.key === ' ') activate(item);
    else {
      onTabKeyDown?.(e, item);
      return;
    }
    e.preventDefault();
  };

  const getListProps = () => ({
    role: 'tablist' as const,
    'aria-label': label,
    'aria-orientation': orientation,
  });

  const getTabProps = (item: TabItem, index: number) => ({
    id: tabId(item.id),
    role: 'tab' as const,
    type: 'button' as const,
    'aria-selected': item.id === value,
    'aria-controls': controls ? panelId(item.id) : undefined,
    'aria-disabled': item.disabled ? true : undefined,
    // Roving tabindex: the selected tab is the single Tab stop (the first enabled one if none is selected).
    tabIndex: item.id === value || (!items.some((i) => i.id === value) && index === 0) ? 0 : -1,
    ref: (el: HTMLElement | null) => {
      if (el) refs.current.set(item.id, el);
      else refs.current.delete(item.id);
    },
    onClick: () => activate(item),
    onKeyDown: (e: React.KeyboardEvent) => onKeyDown(e, index),
    onFocus: () => setFocused(item.id),
    onBlur: () => setFocused((f) => (f === item.id ? null : f)),
  });

  const getPanelProps = (id: string) => ({
    id: panelId(id),
    role: 'tabpanel' as const,
    'aria-labelledby': tabId(id),
    tabIndex: 0,
  });

  const ids = items.map((i) => i.id);

  return { getListProps, getTabProps, getPanelProps, focused, refs, tabId, panelId, ids };
}

export type TabsApi = ReturnType<typeof useTabs>;
