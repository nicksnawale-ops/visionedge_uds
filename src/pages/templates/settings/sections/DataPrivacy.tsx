import React, { useState } from 'react';
import { Download, ShieldCheck } from 'lucide-react';
import { ConfirmDestructiveModal } from '../../profile/modals/ConfirmDestructiveModal';
import { BUTTON, Badge } from '../../profile/ui';
import { useSettings } from '../SettingsContext';
import { OPTIONS } from '../data/settingsIndex';
import { DATA_REQUESTS } from '../data/system';
import { CardBody, SectionCard } from '../patterns/SectionCard';
import { BoundRow, RowSelect, RowSwitch } from '../patterns/SettingRow';
import { DangerZone } from '../patterns/DangerZone';
import { TABLE } from '../patterns/table';

const REQUEST_STATUS = { Open: 'info', 'In review': 'neutral', Completed: 'live' } as const;

export const DataPrivacy: React.FC = () => {
  const { values, set, viewOnly, toast, announce, marker } = useSettings();
  const [purging, setPurging] = useState(false);
  const shortName = String(values['org.short'] || 'PIT');
  const str = (id: string) => String(values[id] ?? '');

  return (
    <>
      <SectionCard title="Retention" description="Older data is deleted every night at 03:00 IST." overlay={marker(5)}>
        <BoundRow id="retention.video">{(c) => <RowSelect control={c} options={OPTIONS.video} value={str('retention.video')} onChange={(v) => set('retention.video', v)} className="max-w-[200px]!" />}</BoundRow>
        <BoundRow id="retention.snapshots">
          {(c) => <RowSelect control={c} options={OPTIONS.snapshots} value={str('retention.snapshots')} onChange={(v) => set('retention.snapshots', v)} className="max-w-[200px]!" />}
        </BoundRow>
        <BoundRow id="retention.events">{(c) => <RowSelect control={c} options={OPTIONS.events} value={str('retention.events')} onChange={(v) => set('retention.events', v)} className="max-w-[200px]!" />}</BoundRow>
        <BoundRow id="retention.audit">{(c) => <RowSelect control={c} options={OPTIONS.auditRetention} value={str('retention.audit')} onChange={() => undefined} className="max-w-[200px]!" />}</BoundRow>
      </SectionCard>

      <SectionCard title="Privacy" description="Who sees personal data, and how it leaves VisionEdge.">
        <BoundRow id="privacy.blurFaces">{(c) => <RowSwitch control={c} checked={Boolean(values['privacy.blurFaces'])} onChange={(v) => set('privacy.blurFaces', v)} />}</BoundRow>
        <BoundRow id="privacy.maskPlates">{(c) => <RowSwitch control={c} checked={Boolean(values['privacy.maskPlates'])} onChange={(v) => set('privacy.maskPlates', v)} />}</BoundRow>
        <BoundRow id="privacy.personalData">{(c) => <RowSwitch control={c} checked onChange={() => undefined} />}</BoundRow>
        <div className="px-4 @min-[768px]:px-6 pb-5">
          <p className="flex items-start gap-3 p-4 rounded-[8px] bg-[#F7F9FC] border border-[#DDE2EA] text-[13px] leading-[20px] text-[#353D4C]">
            <ShieldCheck className="w-5 h-5 shrink-0 text-[#1E63FF]" aria-hidden="true" />
            VisionEdge supports compliance with India's Digital Personal Data Protection Act, 2023. Review retention with your data protection officer.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title="Data requests"
        description="Access, correction and erasure requests from people in your data."
        settingId="privacy.requests"
        actions={
          !viewOnly && (
            <button
              type="button"
              onClick={() => {
                toast("Preparing your export. We'll email a download link to security@pit.edu.in within 1 hour.", 'info');
                announce('Export started');
              }}
              className={BUTTON.secondary}
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Export organization data
            </button>
          )
        }
      >
        <div className={TABLE.scroll}>
          <table className={`${TABLE.table} min-w-[520px]`}>
            <caption className="sr-only">Data subject requests</caption>
            <thead>
              <tr className={TABLE.headRow}>
                {['Request ID', 'Type', 'Status', 'Due date'].map((h) => (
                  <th key={h} scope="col" className={TABLE.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={TABLE.body}>
              {DATA_REQUESTS.map((r) => (
                <tr key={r.id} className={TABLE.row}>
                  <th scope="row" className={`${TABLE.td} text-left font-mono text-[13px] text-[#121722]`}>
                    {r.id}
                  </th>
                  <td className={TABLE.td}>{r.type}</td>
                  <td className={TABLE.td}>
                    <Badge tone={REQUEST_STATUS[r.status]}>{r.status}</Badge>
                  </td>
                  <td className={TABLE.td}>{r.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CardBody className="pt-3! text-[12px] text-[#4B5465]">Requests must be answered within the period set by your data policy.</CardBody>
      </SectionCard>

      <DangerZone
        settingId="privacy.purge"
        overlay={marker(11)}
        actions={[
          {
            label: 'Purge recordings older than 7 days',
            description: 'Frees storage now instead of waiting for retention. Recordings linked to open incidents are kept.',
            action: !viewOnly && (
              <button type="button" onClick={() => setPurging(true)} className={BUTTON.destructive}>
                Purge recordings
              </button>
            ),
          },
        ]}
      />

      {purging && (
        <ConfirmDestructiveModal
          title="Purge recordings older than 7 days?"
          body="About 1.4 TB of video is deleted permanently. Event records and snapshots are kept."
          confirmLabel="Purge recordings"
          confirmText={shortName}
          onClose={() => setPurging(false)}
          onConfirm={() => {
            setPurging(false);
            toast('Purging recordings. Storage updates within an hour.', 'info');
            announce('Purge started');
          }}
        />
      )}
    </>
  );
};
