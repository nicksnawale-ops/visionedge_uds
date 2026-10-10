import React, { useEffect, useRef, useState } from 'react';
import { Info, RefreshCw } from 'lucide-react';
import { InfoAlert } from '../../shared/authUi';
import { ConfirmDestructiveModal } from '../../profile/modals/ConfirmDestructiveModal';
import { BUTTON, Badge, MONO, Spinner } from '../../profile/ui';
import { useSettings } from '../SettingsContext';
import { OPTIONS, TIMES } from '../data/settingsIndex';
import { EDGE_DEVICES, VERSION } from '../data/system';
import { CardBody, SectionCard } from '../patterns/SectionCard';
import { BoundRow, RowSelect } from '../patterns/SettingRow';
import { DangerZone } from '../patterns/DangerZone';
import { TABLE } from '../patterns/table';

/** Mini bullet bar for a table cell: 6px track, Royal Blue fill, Deep Navy 80% marker. */
const MiniBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <span className="flex items-center gap-2 w-[120px]" role="img" aria-label={`${label} ${value}%`}>
    <span className="w-7 text-[11px] text-[#4B5465]" aria-hidden="true">
      {label}
    </span>
    <span className="relative flex-1 h-1.5 rounded-full bg-[#EEF1F6]" aria-hidden="true">
      <span className="absolute inset-y-0 left-0 rounded-full bg-[#1E63FF]" style={{ width: `${value}%` }} />
      <span className="absolute -top-0.5 -bottom-0.5 w-[2px] bg-[#0B2D6B]" style={{ left: 'calc(80% - 1px)' }} />
    </span>
    <span className="w-8 text-right text-[12px] tabular-nums text-[#121722]" aria-hidden="true">
      {value}%
    </span>
  </span>
);

export const System: React.FC = () => {
  const { values, set, viewOnly, toast, announce, marker } = useSettings();
  const [checking, setChecking] = useState(false);
  const [update, setUpdate] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState('Today 02:00 · Success');
  const [restartAll, setRestartAll] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  const done = (m: string) => {
    toast(m, 'success');
    announce(m);
  };

  return (
    <>
      <SectionCard title="Version" settingId="system.version" overlay={marker(5)}>
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[14px] font-medium text-[#121722]">
              {VERSION.app} · {VERSION.firmware}
            </span>
            {update ? <Badge tone="info">Update available</Badge> : <Badge tone="live">Up to date</Badge>}
            {!update && (
              <button
                type="button"
                onClick={() => {
                  setChecking(true);
                  later(() => {
                    setChecking(false);
                    setUpdate(true);
                    announce(`Update available: ${VERSION.available}`);
                  }, 1000);
                }}
                aria-disabled={checking || undefined}
                className={BUTTON.ghostSm}
              >
                {checking ? <Spinner /> : <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />}
                {checking ? 'Checking…' : 'Check for updates'}
              </button>
            )}
          </div>
          {update && (
            <InfoAlert icon={Info}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p>
                  {VERSION.available} is available. It installs during your maintenance window; live monitoring pauses for about 2 minutes.
                </p>
                {!viewOnly && (
                  <button type="button" onClick={() => done('Update scheduled for Sunday at 02:00')} className={BUTTON.secondarySm}>
                    Schedule update
                  </button>
                )}
              </div>
            </InfoAlert>
          )}
        </CardBody>
      </SectionCard>

      <SectionCard title="Maintenance window" description="Updates and restarts only run in this window.">
        <BoundRow id="maint.window" group>
          {(c) => (
            <div role="group" aria-labelledby={c.labelId} className="flex flex-wrap items-end gap-3">
              {(
                [
                  ['maint.day', 'Day', OPTIONS.maintDay, 'w-[148px]'],
                  ['maint.time', 'Starts at', TIMES, 'w-[112px] font-mono'],
                  ['maint.duration', 'Duration', OPTIONS.duration, 'w-[100px]'],
                ] as const
              ).map(([id, label, options, width]) => (
                <div key={id}>
                  <label htmlFor={`${c.id}-${id}`} className="block mb-1 text-[12px] leading-[16px] font-medium text-[#4B5465]">
                    {label}
                  </label>
                  <RowSelect control={{ ...c, id: `${c.id}-${id}` }} options={options} value={String(values[id])} onChange={(v) => set(id, v)} className={width} />
                </div>
              ))}
            </div>
          )}
        </BoundRow>
      </SectionCard>

      <SectionCard title="Edge devices" description="The marker on each bar is 80%, where processing starts to slow." settingId="system.edge">
        <div className={TABLE.scroll}>
          <table className={`${TABLE.table} min-w-[820px]`}>
            <caption className="sr-only">Edge devices</caption>
            <thead>
              <tr className={TABLE.headRow}>
                {['Device ID', 'Site', 'Cameras', 'CPU / GPU load', 'Temperature', 'Status'].map((h) => (
                  <th key={h} scope="col" className={TABLE.th}>
                    {h}
                  </th>
                ))}
                <th scope="col" className={TABLE.th}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className={TABLE.body}>
              {EDGE_DEVICES.map((d) => (
                <tr key={d.id} className={TABLE.row}>
                  <th scope="row" className={`${TABLE.td} text-left`}>
                    <span className={`${MONO} font-semibold`}>{d.id}</span>
                  </th>
                  <td className={TABLE.td}>{d.site}</td>
                  <td className={`${TABLE.td} tabular-nums`}>{d.cameras}</td>
                  <td className={`${TABLE.td} py-2`}>
                    {d.status === 'online' ? (
                      <span className="flex flex-col gap-1">
                        <MiniBar label="CPU" value={d.cpu} />
                        <MiniBar label="GPU" value={d.gpu} />
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className={`${TABLE.td} tabular-nums`}>{d.status === 'online' ? `${d.temperature} °C` : '—'}</td>
                  <td className={TABLE.td}>{d.status === 'online' ? <Badge tone="live">Online</Badge> : <Badge tone="critical">Offline</Badge>}</td>
                  <td className={`${TABLE.td} text-right`}>
                    {!viewOnly && (
                      <button type="button" onClick={() => done(`Restarting ${d.id}. Its ${d.cameras} cameras pause for about 2 minutes.`)} className={BUTTON.ghostSm} aria-label={`Restart ${d.id}`}>
                        Restart
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        title="Backups"
        description={`Last backup: ${lastBackup}`}
        actions={
          !viewOnly && (
            <button
              type="button"
              aria-disabled={backingUp || undefined}
              onClick={() => {
                if (backingUp) return;
                setBackingUp(true);
                later(() => {
                  setBackingUp(false);
                  setLastBackup('Today 14:06 · Success');
                  done('Backup complete');
                }, 1400);
              }}
              className={`${BUTTON.secondary} min-w-[148px]`}
            >
              {backingUp && <Spinner />}
              {backingUp ? 'Backing up…' : 'Back up now'}
            </button>
          )
        }
      >
        <BoundRow id="backup.schedule">
          {(c) => <RowSelect control={c} options={OPTIONS.backup} value={String(values['backup.schedule'])} onChange={(v) => set('backup.schedule', v)} />}
        </BoundRow>
      </SectionCard>

      <DangerZone
        overlay={marker(11)}
        actions={[
          {
            label: 'Restart all edge devices',
            description: 'Live monitoring pauses for about 2 minutes. Recordings resume automatically.',
            action: !viewOnly && (
              <button type="button" onClick={() => setRestartAll(true)} className={BUTTON.destructive}>
                Restart all edge devices
              </button>
            ),
          },
        ]}
      />
      {restartAll && (
        <ConfirmDestructiveModal
          title="Restart all edge devices?"
          body={`All ${EDGE_DEVICES.length} edge devices restart now. Live monitoring pauses for about 2 minutes and alerts are delayed until they’re back.`}
          confirmLabel="Restart all edge devices"
          onClose={() => setRestartAll(false)}
          onConfirm={() => {
            setRestartAll(false);
            done('Restarting all edge devices');
          }}
        />
      )}
    </>
  );
};
