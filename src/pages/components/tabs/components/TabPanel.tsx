import React, { useLayoutEffect, useRef, useState } from 'react';
import type { TabsApi } from './useTabs';
import { reducedMotion } from './tabStyles';

interface TabPanelsProps {
  api: Pick<TabsApi, 'getPanelProps' | 'ids'>;
  value: string;
  /** Renders a panel's content. */
  render: (id: string) => React.ReactNode;
  /** Show skeletons instead of content (the tab bar stays where it is). */
  loading?: boolean;
  className?: string;
}

/** Skeleton lines for a loading panel. */
export const PanelSkeleton: React.FC = () => (
  <div className="space-y-3" aria-hidden="true">
    <span className="block h-4 w-2/5 rounded-[4px] bg-[#EEF1F6] motion-safe:animate-pulse" />
    <span className="block h-3 w-4/5 rounded-[4px] bg-[#EEF1F6] motion-safe:animate-pulse" />
    <span className="block h-3 w-3/5 rounded-[4px] bg-[#EEF1F6] motion-safe:animate-pulse" />
  </div>
);

/**
 * Panels: every tab gets an (empty, hidden) panel element so aria-controls always resolves; its content is
 * rendered on first open (lazy), then kept mounted so scroll position and form input survive.
 * The active panel fades in over 150ms (none with reduced motion).
 */
export const TabPanels: React.FC<TabPanelsProps> = ({ api, value, render, loading = false, className = '' }) => {
  const [visited, setVisited] = useState<string[]>([value]);
  if (!visited.includes(value)) setVisited((v) => [...v, value]);
  const refs = useRef(new Map<string, HTMLDivElement>());

  useLayoutEffect(() => {
    const el = refs.current.get(value);
    if (!el?.animate || reducedMotion()) return;
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease-out' });
  }, [value]);

  return (
    <>
      {api.ids.map((id) => (
        <div
          key={id}
          {...api.getPanelProps(id)}
          ref={(el) => {
            if (el) refs.current.set(id, el);
            else refs.current.delete(id);
          }}
          hidden={id !== value}
          aria-busy={(id === value && loading) || undefined}
          className={`outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2 rounded-[4px] ${className}`}
        >
          {id === value && loading ? <PanelSkeleton /> : visited.includes(id) ? render(id) : null}
        </div>
      ))}
    </>
  );
};
