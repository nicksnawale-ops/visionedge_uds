import React, { useId, useMemo, useState } from 'react';
import { ListFilter, Plus, RotateCw, Search } from 'lucide-react';
import { ConfirmDestructiveModal } from '../../profile/modals/ConfirmDestructiveModal';
import { BUTTON, Badge, CHECKBOX, MONO, Modal, OVERLINE } from '../../profile/ui';
import { SettingsSelect } from '../parts/SettingsSelect';
import { useSettings } from '../SettingsContext';
import { CameraStatus, SettingsCamera, getCameras } from '../data/cameras';
import { getSites } from '../data/sites';
import { EDGE_DEVICES, LICENSED_MODULES, MODULES } from '../data/system';
import { CardBody, SectionCard } from '../patterns/SectionCard';
import { TABLE } from '../patterns/table';
import { AddCameraDrawer } from '../drawers/AddCameraDrawer';

const STATUS_BADGE: Record<CameraStatus, React.ReactNode> = {
  online: <Badge tone="live">Online</Badge>,
  offline: <Badge tone="critical">Offline</Badge>,
  maintenance: <Badge tone="neutral">Maintenance</Badge>,
};

type Confirm = { kind: 'remove'; ids: string[] } | { kind: 'move'; ids: string[] } | null;

export const Cameras: React.FC = () => {
  const uid = useId();
  const { state, viewOnly, toast, announce, marker } = useSettings();
  const [cameras, setCameras] = useState<SettingsCamera[]>(() => getCameras());
  const [query, setQuery] = useState('');
  const [site, setSite] = useState('all');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<{ camera?: SettingsCamera; prefilled?: boolean } | null>(state === 'drawer' && !viewOnly ? { prefilled: true } : null);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [moveTo, setMoveTo] = useState('North campus');
  const sites = getSites();
  const modules = MODULES.filter((m) => LICENSED_MODULES.has(m.id)).map((m) => ({ id: m.id, label: m.label }));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cameras.filter(
      (c) =>
        (site === 'all' || c.site === site) &&
        (status === 'all' || c.status === status) &&
        (type === 'all' || c.type === type) &&
        (!q || `${c.id} ${c.name} ${c.zone}`.toLowerCase().includes(q))
    );
  }, [cameras, query, site, status, type]);

  const online = cameras.filter((c) => c.status === 'online').length;
  const summary = [
    { label: 'Online', value: online },
    { label: 'Offline', value: cameras.filter((c) => c.status === 'offline').length },
    { label: 'Recording', value: online },
    { label: 'Edge devices', value: EDGE_DEVICES.length },
  ];
  const allSelected = filtered.length > 0 && filtered.every((c) => selected.includes(c.id));
  const noun = (n: number) => `${n} camera${n === 1 ? '' : 's'}`;
  const done = (message: string) => {
    toast(message, 'success');
    announce(message);
  };

  return (
    <>
      <SectionCard title="Status" description="Right now, across every site.">
        <dl className="grid grid-cols-2 @min-[1024px]:grid-cols-4">
          {summary.map((s, i) => (
            <div key={s.label} className={`px-4 @min-[768px]:px-6 py-4 border-[#DDE2EA] ${i % 2 ? 'border-l' : ''} ${i >= 2 ? 'border-t @min-[1024px]:border-t-0 @min-[1024px]:border-l' : ''}`}>
              <dt className={OVERLINE}>{s.label}</dt>
              <dd className="mt-1 text-[24px] leading-[32px] font-semibold text-[#121722] tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>

      <SectionCard
        title="Cameras"
        description={`${filtered.length} of ${cameras.length} shown`}
        settingId="cameras.table"
        overlay={marker(5)}
        actions={
          !viewOnly && (
            <button type="button" onClick={() => setDrawer({})} className={BUTTON.secondary}>
              <Plus className="w-4 h-4" aria-hidden="true" />
              Add camera
            </button>
          )
        }
      >
        <CardBody className="flex flex-wrap items-center gap-2 py-4!">
          <div className="relative flex-1 min-w-[180px] @min-[1024px]:flex-none @min-[1024px]:w-[220px]">
            <label htmlFor={`${uid}-q`} className="sr-only">
              Search cameras
            </label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7485] pointer-events-none" aria-hidden="true" />
            <input
              id={`${uid}-q`}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ID, name or zone"
              className="w-full h-10 pl-9 pr-3 rounded-[8px] border border-[#8C95A6] bg-white text-[16px] @min-[640px]:text-[14px] text-[#121722] placeholder:text-[#6B7485] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20"
            />
          </div>
          {(
            [
              ['site', 'Site', site, setSite, [['all', 'All sites'], ...sites.map((s) => [s.name, s.name])], (c: SettingsCamera) => c.site],
              ['status', 'Status', status, setStatus, [['all', 'All statuses'], ['online', 'Online'], ['offline', 'Offline'], ['maintenance', 'Maintenance']], (c: SettingsCamera) => c.status],
              ['type', 'Type', type, setType, [['all', 'All types'], ['Fixed', 'Fixed'], ['PTZ', 'PTZ'], ['ANPR', 'ANPR']], (c: SettingsCamera) => c.type],
            ] as const
          ).map(([key, label, value, set, options, field]) => (
            <SettingsSelect
              key={key}
              id={`${uid}-${key}`}
              ariaLabel={label}
              filter
              size="sm"
              icon={ListFilter}
              className="min-w-[160px]"
              value={value}
              onChange={set}
              options={options.map(([v, l]) => {
                const n = v === 'all' ? cameras.length : cameras.filter((c) => field(c) === v).length;
                return { value: v, label: l, meta: String(n), srText: noun(n) };
              })}
            />
          ))}
        </CardBody>

        {selected.length > 0 && !viewOnly && (
          <div className="px-4 @min-[768px]:px-6 py-2.5 bg-[#1E63FF]/[0.08] border-t border-[#DDE2EA] flex flex-wrap items-center justify-between gap-2 text-[13px]">
            <span className="font-semibold text-[#0B2D6B]" aria-live="polite">
              {noun(selected.length)} selected
            </span>
            <span className="flex flex-wrap gap-2">
              <button
                type="button"
                className={BUTTON.secondarySm}
                onClick={() => {
                  done(`Restarting ${noun(selected.length)}. They'll be back in about a minute.`);
                  setSelected([]);
                }}
              >
                <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                Restart
              </button>
              <button type="button" className={BUTTON.secondarySm} onClick={() => setConfirm({ kind: 'move', ids: selected })}>
                Move to site
              </button>
              <button type="button" className={BUTTON.destructiveSm} onClick={() => setConfirm({ kind: 'remove', ids: selected })}>
                Remove
              </button>
            </span>
          </div>
        )}

        <div className={`${TABLE.scroll} max-h-[560px] border-t border-[#DDE2EA]`}>
          <table className={`${TABLE.table} min-w-[1000px]`}>
            <caption className="sr-only">Cameras, {filtered.length} shown</caption>
            <thead className="sticky top-0 z-10">
              <tr className={TABLE.headRow}>
                {!viewOnly && (
                  <th scope="col" className={`${TABLE.th} w-12`}>
                    <input
                      type="checkbox"
                      aria-label="Select all cameras shown"
                      checked={allSelected}
                      onChange={() => setSelected(allSelected ? [] : filtered.map((c) => c.id))}
                      className={CHECKBOX}
                    />
                  </th>
                )}
                {['Camera ID', 'Name', 'Site / zone', 'Type', 'Resolution', 'FPS', 'Status', 'Last seen'].map((h) => (
                  <th key={h} scope="col" className={`${TABLE.th} ${h === 'FPS' ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
                <th scope="col" className={TABLE.th}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className={TABLE.body}>
              {filtered.map((c) => (
                <tr key={c.id} className={`${TABLE.row} ${selected.includes(c.id) ? 'bg-[#1E63FF]/[0.04]' : ''}`}>
                  {!viewOnly && (
                    <td className={TABLE.td}>
                      <input
                        type="checkbox"
                        aria-label={`Select ${c.id}`}
                        checked={selected.includes(c.id)}
                        onChange={() => setSelected((s) => (s.includes(c.id) ? s.filter((x) => x !== c.id) : [...s, c.id]))}
                        className={CHECKBOX}
                      />
                    </td>
                  )}
                  <th scope="row" className={`${TABLE.td} text-left`}>
                    <span className={`${MONO} font-semibold`}>{c.id}</span>
                  </th>
                  <td className={`${TABLE.td} text-[#121722]`}>{c.name}</td>
                  <td className={TABLE.td}>
                    {c.site} · {c.zone}
                  </td>
                  <td className={TABLE.td}>{c.type}</td>
                  <td className={`${TABLE.td} tabular-nums`}>{c.resolution}</td>
                  <td className={`${TABLE.td} text-right tabular-nums`}>{c.fps}</td>
                  <td className={TABLE.td}>{STATUS_BADGE[c.status]}</td>
                  <td className={TABLE.td}>{c.lastSeen}</td>
                  <td className={`${TABLE.td} text-right`}>
                    {!viewOnly && (
                      <span className="inline-flex gap-1">
                        <button type="button" onClick={() => setDrawer({ camera: c })} className={BUTTON.ghostSm} aria-label={`Edit ${c.id}`}>
                          Edit
                        </button>
                        <button type="button" onClick={() => done(`Restarting ${c.id}`)} className={BUTTON.ghostSm} aria-label={`Restart ${c.id}`}>
                          Restart
                        </button>
                        <button type="button" onClick={() => setConfirm({ kind: 'remove', ids: [c.id] })} className={BUTTON.ghostSm} aria-label={`Remove ${c.id}`}>
                          Remove
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="px-6 py-10 text-center text-[14px] text-[#4B5465]">No cameras match these filters.</p>}
        </div>
      </SectionCard>

      {drawer && (
        <AddCameraDrawer
          modules={modules}
          camera={drawer.camera}
          prefilled={drawer.prefilled}
          overlay={marker(10, true)}
          onClose={() => setDrawer(null)}
          onSave={(cam) => {
            setCameras((list) => (list.some((c) => c.id === cam.id) ? list.map((c) => (c.id === cam.id ? { ...c, ...cam } : c)) : [...list, cam]));
            setDrawer(null);
            done(drawer.camera ? `${cam.id} updated` : `${cam.id} added to ${cam.site}`);
          }}
        />
      )}

      {confirm?.kind === 'remove' && (
        <ConfirmDestructiveModal
          title={`Remove ${confirm.ids.length === 1 ? confirm.ids[0] : noun(confirm.ids.length)}?`}
          body="Recordings already stored are kept until their retention ends. The camera stops streaming and recording straight away."
          confirmLabel={confirm.ids.length === 1 ? 'Remove camera' : `Remove ${noun(confirm.ids.length)}`}
          onClose={() => setConfirm(null)}
          onConfirm={() => {
            setCameras((list) => list.filter((c) => !confirm.ids.includes(c.id)));
            setSelected([]);
            setConfirm(null);
            done(`Removed ${confirm.ids.length === 1 ? confirm.ids[0] : noun(confirm.ids.length)}`);
          }}
        />
      )}
      {confirm?.kind === 'move' && (
        <Modal
          title={`Move ${noun(confirm.ids.length)}`}
          description="Cameras keep their recordings. Zone-based rules stop applying until you assign a new zone."
          onClose={() => setConfirm(null)}
          footer={
            <>
              <button type="button" onClick={() => setConfirm(null)} className={BUTTON.secondary}>
                Cancel
              </button>
              <button
                type="button"
                className={BUTTON.primary}
                onClick={() => {
                  setCameras((list) => list.map((c) => (confirm.ids.includes(c.id) ? { ...c, site: moveTo } : c)));
                  setSelected([]);
                  setConfirm(null);
                  done(`Moved ${noun(confirm.ids.length)} to ${moveTo}`);
                }}
              >
                Move to {moveTo}
              </button>
            </>
          }
        >
          <label id={`${uid}-move-label`} htmlFor={`${uid}-move`} className="block mb-1.5 text-[14px] font-medium text-[#121722]">
            Site
          </label>
          <SettingsSelect
            id={`${uid}-move`}
            labelledBy={`${uid}-move-label`}
            value={moveTo}
            onChange={setMoveTo}
            options={sites.map((s) => ({ value: s.name, label: s.name }))}
          />
        </Modal>
      )}
    </>
  );
};
