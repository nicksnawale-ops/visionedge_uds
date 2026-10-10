import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Bookmark, MoreHorizontal, Search, X } from 'lucide-react';
import type { LiveCamera } from '../data/cameras';
import { SITES } from '../data/cameras';
import { useSurface } from '../surface/ControlRoomSurface';

export type CameraDot = 'online' | 'offline' | 'recording';

interface CameraListProps {
  cameras: LiveCamera[];
  dotOf: (c: LiveCamera) => CameraDot;
  focusedCameraId: string | null;
  savedViews: string[];
  /** Click: show in the focused tile. */
  onPick: (cameraId: string) => void;
  /** Menu action: add to the next empty slot. */
  onAddToWall: (cameraId: string) => void;
  onSavedView: (name: string) => void;
  /** Overlay panel (medium screens): shows a close button. */
  onClose?: () => void;
  loading?: boolean;
}

const DOT: Record<CameraDot, string> = { online: 'bg-[#00C6FF]', offline: 'bg-[#8C95A6]', recording: 'bg-[#1E63FF]' };
const DOT_TEXT: Record<CameraDot, string> = { online: 'online', offline: 'offline', recording: 'recording only' };

/**
 * Camera list (280px): search, Site → Zone → Camera tree, saved views. Click shows a camera in the focused tile;
 * rows can be dragged onto a tile; the row menu's "Add to wall" is the keyboard alternative.
 */
export const CameraList: React.FC<CameraListProps> = ({ cameras, dotOf, focusedCameraId, savedViews, onPick, onAddToWall, onSavedView, onClose, loading }) => {
  const t = useSurface();
  const [q, setQ] = useState('');
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const searchId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? cameras.filter((c) => `${c.id} ${c.name} ${c.zone}`.toLowerCase().includes(s)) : cameras;
  }, [cameras, q]);

  useEffect(() => {
    if (!menuFor) return;
    listRef.current?.querySelector<HTMLElement>(`[data-menu="${menuFor}"] [role=menuitem]`)?.focus();
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest(`[data-menu="${menuFor}"], [data-menu-btn="${menuFor}"]`)) setMenuFor(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [menuFor]);

  const closeMenu = (id: string) => {
    setMenuFor(null);
    listRef.current?.querySelector<HTMLElement>(`[data-menu-btn="${id}"]`)?.focus();
  };

  return (
    <section aria-label="Camera list" className={`h-full min-h-0 flex flex-col rounded-[12px] border ${t.panel}`}>
      <div className={`p-3 border-b ${t.border} flex items-center gap-2`}>
        <label htmlFor={searchId} className="sr-only">
          Search cameras
        </label>
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${t.subtle}`} aria-hidden="true" />
          <input id={searchId} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cameras…" className={`w-full h-9 pl-9 pr-2 rounded-[8px] text-[13px] ${t.input}`} />
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close camera list" className={t.btn.iconSm}>
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto py-2">
        {loading ? (
          <div className="px-3 space-y-2" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className={`block h-6 rounded-[4px] ${t.skeleton} motion-safe:animate-pulse`} />
            ))}
          </div>
        ) : (
          SITES.map((site) => {
            const inSite = filtered.filter((c) => c.site === site);
            if (!inSite.length) return null;
            const zones = [...new Set(inSite.map((c) => c.zone))];
            return (
              <div key={site} className="mb-2">
                <p className={`px-3 pt-1 pb-1 text-[11px] font-medium uppercase tracking-[0.08em] ${t.subtle}`}>{site}</p>
                {zones.map((zone) => (
                  <div key={zone} role="group" aria-label={`${site}, ${zone}`}>
                    <p className={`px-3 pl-5 pt-1.5 pb-0.5 text-[12px] font-medium ${t.muted}`}>{zone}</p>
                    <ul>
                      {inSite
                        .filter((c) => c.zone === zone)
                        .map((c) => {
                          const dot = dotOf(c);
                          const on = c.id === focusedCameraId;
                          return (
                            <li key={c.id} className="relative group/row">
                              <div className={`flex items-center pr-1 ${on ? t.selected : t.hover}`}>
                                <button
                                  type="button"
                                  draggable
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData('text/camera-id', c.id);
                                    e.dataTransfer.effectAllowed = 'copy';
                                  }}
                                  onClick={() => onPick(c.id)}
                                  aria-current={on ? 'true' : undefined}
                                  aria-label={`${c.id}, ${c.name}, ${DOT_TEXT[dot]}. Show in focused tile`}
                                  className={`flex-1 min-w-0 h-9 pl-7 pr-2 flex items-center gap-2 text-left ${t.focusInset}`}
                                >
                                  <span aria-hidden="true" className={`w-2 h-2 rounded-full shrink-0 ${DOT[dot]}`} />
                                  <span className={`font-mono text-[12px] ${t.text}`}>{c.id}</span>
                                  <span className={`text-[13px] truncate ${t.muted}`}>{c.name}</span>
                                </button>
                                <button
                                  type="button"
                                  data-menu-btn={c.id}
                                  aria-haspopup="menu"
                                  aria-expanded={menuFor === c.id}
                                  aria-label={`Actions for ${c.id}`}
                                  onClick={() => setMenuFor((m) => (m === c.id ? null : c.id))}
                                  className={`${t.btn.iconSm} w-7 h-7 opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 ${menuFor === c.id ? 'opacity-100' : ''}`}
                                >
                                  <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                                </button>
                              </div>
                              {menuFor === c.id && (
                                <div
                                  data-menu={c.id}
                                  role="menu"
                                  aria-label={`${c.id} actions`}
                                  onKeyDown={(e) => {
                                    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role=menuitem]'));
                                    const i = items.indexOf(document.activeElement as HTMLElement);
                                    if (e.key === 'ArrowDown') items[(i + 1) % items.length]?.focus();
                                    else if (e.key === 'ArrowUp') items[(i - 1 + items.length) % items.length]?.focus();
                                    else if (e.key === 'Escape') closeMenu(c.id);
                                    else return;
                                    e.preventDefault();
                                  }}
                                  className={`absolute right-2 top-full z-30 w-[200px] py-1 rounded-[8px] ${t.popover}`}
                                >
                                  {(
                                    [
                                      ['Show in focused tile', () => onPick(c.id)],
                                      ['Add to wall', () => onAddToWall(c.id)],
                                    ] as const
                                  ).map(([label, run]) => (
                                    <button
                                      key={label}
                                      type="button"
                                      role="menuitem"
                                      tabIndex={-1}
                                      onClick={() => {
                                        run();
                                        closeMenu(c.id);
                                      }}
                                      className={`w-full h-9 px-3 text-left text-[13px] ${t.text} ${t.hover} ${t.focusInset}`}
                                    >
                                      {label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                ))}
              </div>
            );
          })
        )}
        {!loading && !filtered.length && <p className={`px-3 py-4 text-[13px] ${t.muted}`}>No cameras match “{q}”.</p>}
      </div>

      <div className={`border-t ${t.border} p-3`}>
        <p className={`mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] ${t.subtle}`}>Saved views</p>
        <ul className="space-y-0.5">
          {savedViews.map((v) => (
            <li key={v}>
              <button type="button" onClick={() => onSavedView(v)} className={`w-full h-8 px-2 flex items-center gap-2 rounded-[6px] text-[13px] ${t.text} ${t.hover} ${t.focusInset}`}>
                <Bookmark className={`w-4 h-4 ${t.subtle}`} aria-hidden="true" />
                {v}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
