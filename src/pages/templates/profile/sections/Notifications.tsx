import React, { useId, useState } from 'react';
import { Lock } from 'lucide-react';
import { useProfile } from '../ProfileContext';
import { CHANNELS, Channel, DIGEST_OPTIONS, DigestOption, NOTIFICATION_GROUPS, QUIET_TIMES, defaultMatrix } from '../data/notifications';
import { CHECKBOX, ProfileCard, RADIO, Toggle, Tooltip } from '../ui';
import { ProfileSelect } from '../parts/ProfileSelect';

export const Notifications: React.FC = () => {
  const uid = useId();
  const { viewer, toast, announce, marker, name } = useProfile();
  const readOnly = viewer === 'admin';
  const groups = NOTIFICATION_GROUPS;
  const [matrix, setMatrix] = useState(() => defaultMatrix(groups));
  const [quiet, setQuiet] = useState(false);
  const [from, setFrom] = useState('22:00');
  const [to, setTo] = useState('07:00');
  const [digest, setDigest] = useState<DigestOption>('daily');

  const toggle = (eventId: string, eventLabel: string, channel: Channel, channelLabel: string) => {
    const next = !matrix[eventId][channel];
    setMatrix((m) => ({ ...m, [eventId]: { ...m[eventId], [channel]: next } }));
    announce(`${channelLabel} ${next ? 'on' : 'off'} for ${eventLabel}`);
  };

  return (
    <>
      <ProfileCard
        title="Notification preferences"
        description={readOnly ? `Only ${name} can change these preferences.` : 'Changes save automatically. Critical alerts always reach you in the app.'}
        overlay={marker(6)}
        flush
      >
        <div className="relative overflow-x-auto border-t border-[#DDE2EA]">
          <table className="w-full min-w-[520px] border-collapse text-[14px]">
            <caption className="sr-only">Notification channels for each event. Columns: In-app, Email, SMS.</caption>
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-[#DDE2EA]">
                <th scope="col" className="h-10 pl-4 @min-[768px]:pl-6 pr-4 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  Event
                </th>
                {CHANNELS.map((c) => (
                  <th key={c.id} scope="col" className="h-10 w-24 px-2 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] last:pr-4 @min-[768px]:last:pr-6">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            {groups.map((g) => (
              <tbody key={g.id} className="border-b border-[#DDE2EA] last:border-b-0">
                <tr>
                  <th scope="colgroup" colSpan={4} className="pt-4 pb-1 pl-4 @min-[768px]:pl-6 text-left text-[12px] leading-[16px] font-semibold text-[#353D4C]">
                    {g.label}
                  </th>
                </tr>
                {g.events.map((e) => (
                  <tr key={e.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <th scope="row" className="h-11 pl-4 @min-[768px]:pl-6 pr-4 text-left font-normal text-[#121722]">
                      {e.label}
                      {e.critical && <span className="ml-2 align-middle text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">Critical</span>}
                    </th>
                    {CHANNELS.map((c) => {
                      const locked = e.critical && c.id === 'inApp';
                      const label = `${c.label} for ${e.label}`;
                      return (
                        <td key={c.id} className="px-2 text-center last:pr-4 @min-[768px]:last:pr-6">
                          {/* 44px cell target around the 16px checkbox */}
                          <label className="relative inline-flex items-center justify-center gap-1 w-11 h-11 cursor-pointer has-[:disabled]:cursor-not-allowed">
                            {locked ? (
                              <Tooltip content="Required for critical alerts">
                                {(tip) => (
                                  <span className="inline-flex items-center gap-1">
                                    <input
                                      type="checkbox"
                                      checked
                                      aria-disabled="true"
                                      aria-label={`${label}, required for critical alerts`}
                                      aria-describedby={tip}
                                      onChange={() => undefined}
                                      onClick={(ev) => ev.preventDefault()}
                                      className={CHECKBOX}
                                    />
                                    <Lock className="w-3 h-3 text-[#6B7485]" aria-hidden="true" />
                                  </span>
                                )}
                              </Tooltip>
                            ) : (
                              <input
                                type="checkbox"
                                checked={matrix[e.id][c.id]}
                                disabled={readOnly}
                                aria-label={label}
                                onChange={() => toggle(e.id, e.label, c.id, c.label)}
                                className={CHECKBOX}
                              />
                            )}
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </ProfileCard>

      <div className="grid grid-cols-1 @min-[1280px]:grid-cols-2 gap-6">
        <ProfileCard title="Quiet hours" description="Pause email and SMS overnight.">
          <Toggle
            label="Turn on quiet hours"
            checked={quiet}
            disabled={readOnly}
            onChange={(on) => {
              setQuiet(on);
              toast(on ? `Quiet hours on, ${from}–${to}` : 'Quiet hours off', 'success');
            }}
          />
          <div className="mt-3 grid grid-cols-2 gap-4">
            {[
              { key: 'from', label: 'From', value: from, set: setFrom },
              { key: 'to', label: 'To', value: to, set: setTo },
            ].map((f) => (
              <div key={f.key}>
                <label id={`${uid}-${f.key}-label`} htmlFor={`${uid}-${f.key}`} className="block mb-1.5 text-[14px] leading-[20px] font-medium text-[#121722]">
                  {f.label}
                </label>
                <ProfileSelect
                  id={`${uid}-${f.key}`}
                  labelledBy={`${uid}-${f.key}-label`}
                  value={f.value}
                  disabled={!quiet || readOnly}
                  onChange={f.set}
                  options={QUIET_TIMES.map((t) => ({ value: t, label: t }))}
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-[16px] text-[#4B5465]">Critical alerts are always delivered.</p>
        </ProfileCard>

        <ProfileCard title="Digest" description="A summary email instead of one email per event.">
          <fieldset>
            <legend className="sr-only">Digest frequency</legend>
            <div className="space-y-1">
              {DIGEST_OPTIONS.map((o) => (
                <label key={o.id} className="flex items-start gap-3 min-h-[44px] py-2 cursor-pointer has-[:disabled]:cursor-not-allowed">
                  <input
                    type="radio"
                    name={`${uid}-digest`}
                    value={o.id}
                    checked={digest === o.id}
                    disabled={readOnly}
                    onChange={() => {
                      setDigest(o.id);
                      toast(`Digest: ${o.label}`, 'success');
                    }}
                    className={`${RADIO} mt-0.5`}
                  />
                  <span>
                    <span className="block text-[14px] leading-[20px] font-medium text-[#121722]">{o.label}</span>
                    <span className="block text-[12px] leading-[16px] text-[#4B5465]">{o.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </ProfileCard>
      </div>
    </>
  );
};
