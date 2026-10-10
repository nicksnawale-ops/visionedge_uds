import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, ListFilter, Pause, Play } from 'lucide-react';
import { LiveSelect } from '../parts/LiveSelect';
import { typeOptions } from '../parts/selectOptions';
import type { SceneKind } from '../../dashboard/data/useCases';
import type { Detection } from '../data/detections';
import { useSurface } from '../surface/ControlRoomSurface';
import { SkeletonRows } from '../ui';
import { DetectionItem } from './DetectionItem';

interface DetectionFeedProps {
  items: Detection[];
  scene: SceneKind;
  now: number;
  types: { value: string; label: string }[];
  feedPaused: boolean;
  onTogglePause: () => void;
  onOpen: (d: Detection) => void;
  loading: boolean;
  /** Announce at most once per 10 s (screen readers). */
  announce: (message: string) => void;
}

/**
 * Live detections. New items slide in at the top (200ms). If the user has scrolled down, the list keeps its
 * place and a "12 new detections ↑" pill appears instead of jumping. Arrow keys move through items.
 */
export const DetectionFeed: React.FC<DetectionFeedProps> = ({ items, scene, now, types, feedPaused, onTogglePause, onOpen, loading, announce }) => {
  const t = useSurface();
  const [flagged, setFlagged] = useState(false);
  const [type, setType] = useState('all');
  const [active, setActive] = useState(0);
  const [seenSeq, setSeenSeq] = useState(() => items[0]?.seq ?? 0);
  const listRef = useRef<HTMLDivElement>(null);
  const prevTop = useRef(items[0]?.seq ?? 0);
  const prevHeight = useRef(0);
  const lastAnnounce = useRef(0);

  const shown = useMemo(() => items.filter((d) => (!flagged || d.status !== 'verified') && (type === 'all' || d.type === type)), [items, flagged, type]);
  const scrolled = () => (listRef.current?.scrollTop ?? 0) > 8;
  const newCount = shown.filter((d) => d.seq > seenSeq).length;

  // Keep the reader's place when items arrive above them; slide new items in when at the top.
  useLayoutEffect(() => {
    const el = listRef.current;
    const top = items[0]?.seq ?? 0;
    if (!el || top === prevTop.current) {
      prevHeight.current = el?.scrollHeight ?? 0;
      return;
    }
    const added = top - prevTop.current;
    prevTop.current = top;
    if (el.scrollTop > 8) {
      el.scrollTop += el.scrollHeight - prevHeight.current;
    } else {
      setSeenSeq(top);
      const first = el.querySelector<HTMLElement>('li');
      if (first?.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        first.animate([{ transform: 'translateY(-12px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 200, easing: 'ease-out' });
      }
    }
    prevHeight.current = el.scrollHeight;
    // Throttled announcement: at most one every 10 s.
    if (now - lastAnnounce.current >= 10) {
      lastAnnounce.current = now;
      announce(`${added} new detection${added === 1 ? '' : 's'}. Latest: ${items[0].primary} at ${items[0].cameraName}`);
    }
  }, [items, now, announce]);

  useEffect(() => {
    if (active >= shown.length) setActive(0);
  }, [shown.length, active]);

  const jumpToTop = () => {
    listRef.current?.scrollTo({ top: 0 });
    setSeenSeq(items[0]?.seq ?? 0);
    listRef.current?.querySelector<HTMLElement>('button[data-seq]')?.focus();
    setActive(0);
  };

  const onItemKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? shown.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const n = Math.max(0, Math.min(shown.length - 1, next));
    setActive(n);
    listRef.current?.querySelectorAll<HTMLElement>('button[data-seq]')[n]?.focus();
  };

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className={`px-3 py-2 border-b ${t.border} flex flex-wrap items-center gap-2`}>
        <div role="group" aria-label="Show" className={`inline-flex p-0.5 rounded-[8px] ${t.segment.group}`}>
          {(
            [
              [false, 'All'],
              [true, 'Flagged'],
            ] as const
          ).map(([v, label]) => (
            <button key={label} type="button" aria-pressed={flagged === v} onClick={() => setFlagged(v)} className={`h-7 px-2.5 rounded-[6px] text-[12px] font-medium ${flagged === v ? t.segment.on : t.segment.off} ${t.focus}`}>
              {label}
            </button>
          ))}
        </div>
        <LiveSelect
          label="Detection type"
          icon={ListFilter}
          options={typeOptions(types, items, ListFilter)}
          value={type}
          onChange={setType}
          size="sm"
          className="min-w-[140px]"
          active={type !== 'all'}
          align="end"
          popoverMinWidth={200}
        />
        <button type="button" onClick={onTogglePause} aria-pressed={feedPaused} className={`${t.btn.ghost} ml-auto`}>
          {feedPaused ? <Play className="w-4 h-4" aria-hidden="true" /> : <Pause className="w-4 h-4" aria-hidden="true" />}
          {feedPaused ? 'Resume feed' : 'Pause feed'}
        </button>
      </div>

      <div className="relative flex-1 min-h-0">
        {newCount > 0 && (
          <button
            type="button"
            onClick={jumpToTop}
            className={`absolute z-10 top-2 left-1/2 -translate-x-1/2 h-8 px-3 inline-flex items-center gap-1.5 rounded-full bg-[#1E63FF] text-white text-[13px] font-medium shadow-[0_4px_12px_rgba(11,45,107,0.12)] ${t.focus}`}
          >
            {newCount} new detection{newCount === 1 ? '' : 's'}
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
        <div
          ref={listRef}
          onScroll={() => {
            if (!scrolled()) setSeenSeq(items[0]?.seq ?? 0);
          }}
          className="h-full overflow-y-auto [overflow-anchor:none]"
        >
          {loading ? (
            <SkeletonRows rows={7} />
          ) : shown.length ? (
            <ul aria-label="Recent detections" className={`divide-y ${t.divide}`}>
              {shown.map((d, i) => (
                <li key={d.seq}>
                  <DetectionItem d={d} scene={scene} now={now} onOpen={onOpen} tabIndex={i === active ? 0 : -1} onKeyDown={(e) => onItemKey(e, i)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className={`px-4 py-10 text-center text-[13px] ${t.muted}`}>No detections match these filters.</p>
          )}
          {!loading && (
            <div className={`px-3 py-3 border-t ${t.border}`}>
              <a href="#full-log" onClick={(e) => e.preventDefault()} className={`text-[13px] font-medium hover:underline rounded-[4px] ${t.link} ${t.focus}`}>
                View full log
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
