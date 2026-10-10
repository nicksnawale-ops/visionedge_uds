import React, { useState } from 'react';
import { LogOut, Monitor, Smartphone, Tablet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useProfile } from '../ProfileContext';
import { DeviceKind, getTrustedDevices, maskIp } from '../data/sessions';
import { BUTTON, Badge, MONO, ProfileCard, Tooltip } from '../ui';

export const DEVICE_ICONS: Record<DeviceKind, LucideIcon> = { desktop: Monitor, phone: Smartphone, tablet: Tablet };

const TH = 'h-10 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left whitespace-nowrap';
const TD = 'h-12 px-4 text-[14px] text-[#353D4C] whitespace-nowrap';

export const Sessions: React.FC = () => {
  const { sessions, viewer, openModal, marker, name, toast, announce } = useProfile();
  const self = viewer === 'self';
  const others = sessions.filter((s) => !s.current);
  const [trusted, setTrusted] = useState(() => getTrustedDevices(viewer));

  return (
    <>
      <ProfileCard
        title="Active sessions"
        description={self ? `${sessions.length} active · IP addresses are partly hidden` : `${name} is signed in on ${sessions.length} device${sessions.length === 1 ? '' : 's'}`}
        overlay={marker(6)}
        flush
        actions={
          others.length > 0 ? (
            <button type="button" onClick={() => openModal({ kind: 'sign-out-all' })} className={BUTTON.destructive}>
              <LogOut className="w-4 h-4" aria-hidden="true" />
              {self ? 'Sign out of all other sessions' : 'Sign out of all sessions'}
            </button>
          ) : undefined
        }
      >
        <div className="relative overflow-x-auto border-t border-[#DDE2EA]">
          <table className="w-full min-w-[760px] border-collapse">
            <caption className="sr-only">Active sessions</caption>
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-[#DDE2EA]">
                <th scope="col" className={`${TH} @min-[768px]:pl-6`}>Device</th>
                <th scope="col" className={TH}>Location</th>
                <th scope="col" className={TH}>IP address</th>
                <th scope="col" className={TH}>Signed in</th>
                <th scope="col" className={TH}>Last active</th>
                <th scope="col" className={`${TH} @min-[768px]:pr-6`}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF1F6]">
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[14px] text-[#4B5465]">
                    {name} isn't signed in anywhere.
                  </td>
                </tr>
              )}
              {sessions.map((s) => {
                const Icon = DEVICE_ICONS[s.kind];
                return (
                  <tr key={s.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <th scope="row" className={`${TD} @min-[768px]:pl-6 font-normal text-left`}>
                      <span className="flex items-center gap-3">
                        <Icon className="w-[18px] h-[18px] text-[#4B5465] shrink-0" aria-hidden="true" />
                        <span className="font-medium text-[#121722]">{s.device}</span>
                        {s.current && <Badge tone="live">This device</Badge>}
                      </span>
                    </th>
                    <td className={TD}>{s.location}</td>
                    <td className={TD}>
                      <span className={MONO}>{maskIp(s.ip)}</span>
                    </td>
                    <td className={TD}>{s.signedIn}</td>
                    <td className={TD}>
                      <Tooltip content={s.lastActiveAbsolute} placement="top">
                        {(tip) => (
                          <span tabIndex={0} aria-describedby={tip} className="rounded-[4px] underline decoration-dotted decoration-[#8C95A6] underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]">
                            {s.lastActive}
                          </span>
                        )}
                      </Tooltip>
                    </td>
                    <td className={`${TD} @min-[768px]:pr-6 text-right`}>
                      {!s.current && (
                        <button
                          type="button"
                          onClick={() => openModal({ kind: 'sign-out-session', session: s })}
                          aria-label={`Sign out ${s.device} in ${s.location}`}
                          className={BUTTON.ghostSm}
                        >
                          Sign out
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ProfileCard>

      <ProfileCard title="Trusted devices" description="These devices skip two-step verification for 30 days.">
        {trusted.length === 0 ? (
          <p className="text-[14px] text-[#4B5465]">No trusted devices.</p>
        ) : (
          <ul className="divide-y divide-[#EEF1F6] -my-2">
            {trusted.map((d) => {
              const Icon = DEVICE_ICONS[d.kind];
              return (
                <li key={d.id} className="flex items-center gap-3 py-2 min-h-[56px]">
                  <Icon className="w-[18px] h-[18px] text-[#4B5465] shrink-0" aria-hidden="true" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14px] leading-[20px] font-medium text-[#121722]">{d.name}</span>
                    <span className="block text-[12px] leading-[16px] text-[#6B7485]">{d.added}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTrusted((list) => list.filter((x) => x.id !== d.id));
                      toast(`${d.name.split(' · ')[0]} removed from trusted devices`, 'success');
                      announce(`${d.name} removed`);
                    }}
                    aria-label={`Remove ${d.name}`}
                    className={BUTTON.ghostSm}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </ProfileCard>
    </>
  );
};
