import React, { useId } from 'react';
import { MinusCircle } from 'lucide-react';
import { useProfile } from '../ProfileContext';
import { ACCESS_LEVELS, AccessLevel, accessLabel } from '../data/access';
import { ALL_SITES } from '../data/users';
import { ProfileSelect } from '../parts/ProfileSelect';
import type { SelectOption } from '../parts/selectHelpers';
import { BUTTON, Badge, Chip, LINK, ProfileCard } from '../ui';

/** Access levels with the badge marker (Info dot, Neutral dot, No-access icon) and their existing descriptions. */
const LEVEL_OPTIONS: SelectOption[] = ACCESS_LEVELS.map((l) =>
  l.value === 'none' ? { ...l, icon: MinusCircle } : { ...l, dot: l.value === 'full' ? 'bg-[#1E63FF]' : 'bg-[#8C95A6]' },
);

const TH = 'h-10 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left whitespace-nowrap';

export const AccessBadge: React.FC<{ level: AccessLevel }> = ({ level }) =>
  level === 'full' ? (
    <Badge tone="info">Full access</Badge>
  ) : level === 'read' ? (
    <Badge tone="neutral">Read only</Badge>
  ) : (
    <Badge tone="neutral">
      <MinusCircle className="w-3.5 h-3.5" aria-hidden="true" />
      No access
    </Badge>
  );

export const Access: React.FC = () => {
  const uid = useId();
  const { viewer, user, access, setAccessLevel, sites, setSites, openModal, marker, name, saving } = useProfile();
  const editable = viewer === 'admin';
  const addable = ALL_SITES.filter((s) => !sites.includes(s));

  return (
    <>
      <ProfileCard
        title="Role"
        overlay={marker(6)}
        actions={
          !editable ? (
            <button type="button" onClick={() => openModal({ kind: 'request-access' })} className={BUTTON.secondary}>
              Request access change
            </button>
          ) : undefined
        }
      >
        <p className="text-[16px] leading-[24px] font-medium text-[#121722]">{user.role}</p>
        <p className="text-[14px] leading-[20px] text-[#4B5465]">{user.roleDescription}</p>
        <p className="mt-2 text-[12px] leading-[16px] text-[#6B7485]">
          Assigned by {user.roleAssignedBy} on {user.roleAssignedOn}
        </p>
      </ProfileCard>

      <ProfileCard
        title="Module access"
        description={editable ? `Changes apply when you save. ${name} sees them at their next page load.` : 'What you can do in each VisionEdge product.'}
        flush
      >
        <div className="relative overflow-x-auto border-t border-[#DDE2EA]">
          <table className="w-full min-w-[520px] border-collapse text-[14px]">
            <caption className="sr-only">Module access</caption>
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-[#DDE2EA]">
                <th scope="col" className={`${TH} @min-[768px]:pl-6`}>Module</th>
                <th scope="col" className={TH}>Access level</th>
                <th scope="col" className={`${TH} @min-[768px]:pr-6`}>Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF1F6]">
              {access.map((m) => (
                <tr key={m.id} className="hover:bg-[#F7F9FC] transition-colors">
                  <th scope="row" className="h-12 px-4 @min-[768px]:pl-6 text-left font-medium text-[#121722] whitespace-nowrap">
                    {m.module}
                  </th>
                  <td className="h-12 px-4 py-1.5">
                    {editable ? (
                      <ProfileSelect
                        ariaLabel={`Access level for ${m.module}`}
                        size="sm"
                        className="w-[160px]"
                        popoverMinWidth={260}
                        value={m.level}
                        disabled={saving}
                        onChange={(v) => setAccessLevel(m.id, v as AccessLevel)}
                        options={LEVEL_OPTIONS}
                      />
                    ) : (
                      <AccessBadge level={m.level} />
                    )}
                  </td>
                  <td className="h-12 px-4 @min-[768px]:pr-6 text-[#353D4C] whitespace-nowrap">
                    {m.scope}
                    {editable && <span className="sr-only">, {accessLabel(m.level)}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ProfileCard>

      <ProfileCard title="Sites & cameras">
        <ul className="flex flex-wrap items-center gap-1.5" aria-label="Sites">
          {sites.map((s) => (
            <li key={s}>
              <Chip onRemove={editable && sites.length > 1 && !saving ? () => setSites(sites.filter((x) => x !== s)) : undefined} removeLabel={`Remove ${s}`}>
                {s}
              </Chip>
            </li>
          ))}
          {editable && addable.length > 0 && (
            <li className="flex items-center gap-1.5">
              <ProfileSelect
                id={`${uid}-add`}
                ariaLabel="Add a site"
                variant="pill"
                placeholder="Add site"
                disabled={saving}
                value=""
                onChange={(v) => v && setSites([...sites, v])}
                options={addable.map((s) => ({ value: s, label: s }))}
              />
            </li>
          )}
        </ul>
        <p className="mt-4 flex flex-wrap items-center gap-x-2 text-[14px] leading-[20px] text-[#121722]">
          <span className="tabular-nums">{user.stats.cameras} cameras assigned</span>
          <span aria-hidden="true" className="text-[#8C95A6]">
            ·
          </span>
          <button type="button" onClick={() => openModal({ kind: 'camera-list' })} className={LINK}>
            View list
          </button>
        </p>
      </ProfileCard>
    </>
  );
};
