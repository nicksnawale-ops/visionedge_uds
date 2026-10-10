import React, { useEffect, useId, useState } from 'react';
import { ExternalLink, Lock, Plus, UserPlus } from 'lucide-react';
import { Tabs } from '../../dashboard/primitives';
import { ConfirmDestructiveModal } from '../../profile/modals/ConfirmDestructiveModal';
import { PROFILE_PREVIEW_PATH } from '../../profile/paths';
import { Avatar, BUTTON, Badge, CHECKBOX, Modal, TEXT_INPUT, Tooltip } from '../../profile/ui';
import { SettingsSelect } from '../parts/SettingsSelect';
import { useSettings } from '../SettingsContext';
import { Invitation, OrgUser, ROLE_OPTIONS, getInvitations, getOrgUsers } from '../data/users';
import { PERMISSION_GROUPS, ROLE_COLUMNS, RoleName, defaultMatrix } from '../data/permissions';
import { getSites } from '../data/sites';
import { SectionCard } from '../patterns/SectionCard';
import { TABLE } from '../patterns/table';
import { InviteUsersModal } from '../modals/InviteUsersModal';

type Tab = 'users' | 'roles' | 'invites';

const STATUS: Record<OrgUser['status'], React.ReactNode> = {
  Active: <Badge tone="live">Active</Badge>,
  Invited: <Badge tone="info">Invited</Badge>,
  Suspended: <Badge tone="neutral">Suspended</Badge>,
};

type Dialog = { kind: 'role'; user: OrgUser } | { kind: 'suspend'; user: OrgUser } | { kind: 'revoke'; invite: Invitation } | { kind: 'invite' } | { kind: 'custom-role' } | null;

export const UsersRoles: React.FC = () => {
  const uid = useId();
  const { viewOnly, toast, undoToast, announce, marker, jumpId } = useSettings();
  const [tab, setTab] = useState<Tab>('users');

  // A settings-search result opens the matching tab.
  useEffect(() => {
    const tabs: Record<string, Tab> = { 'users.users': 'users', 'users.roles': 'roles', 'users.invites': 'invites' };
    if (jumpId && tabs[jumpId]) setTab(tabs[jumpId]);
  }, [jumpId]);
  const [users, setUsers] = useState(() => getOrgUsers());
  const [invites, setInvites] = useState(() => getInvitations());
  const [columns, setColumns] = useState<string[]>([...ROLE_COLUMNS]);
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>(defaultMatrix);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [newRole, setNewRole] = useState<string>('Operator');
  const [customName, setCustomName] = useState('');
  const [customError, setCustomError] = useState('');
  const sites = getSites().filter((s) => s.status === 'active').map((s) => s.name);
  const done = (m: string) => {
    toast(m, 'success');
    announce(m);
  };

  const setPermission = (perm: string, label: string, role: string, on: boolean) => {
    setMatrix((m) => ({ ...m, [perm]: { ...m[perm], [role]: on } }));
    undoToast(`${role}: “${label}” ${on ? 'allowed' : 'removed'}`, () => setMatrix((m) => ({ ...m, [perm]: { ...m[perm], [role]: !on } })));
  };

  return (
    <>
      <SectionCard
        title="People and access"
        settingId="users.users"
        overlay={marker(5)}
        actions={
          !viewOnly &&
          (tab === 'roles' ? (
            <button type="button" onClick={() => setDialog({ kind: 'custom-role' })} className={BUTTON.secondary}>
              <Plus className="w-4 h-4" aria-hidden="true" />
              Create custom role
            </button>
          ) : (
            <button type="button" onClick={() => setDialog({ kind: 'invite' })} className={BUTTON.secondary}>
              <UserPlus className="w-4 h-4" aria-hidden="true" />
              Invite users
            </button>
          ))
        }
      >
        <div className="px-4 @min-[768px]:px-6 pt-2 overflow-x-auto" data-setting-id="users.roles">
          <Tabs<Tab>
            label="Users and roles"
            options={[
              { id: 'users', label: `Users (${users.length})` },
              { id: 'roles', label: 'Roles & permissions' },
              { id: 'invites', label: `Invitations (${invites.length})` },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>

        <div role="tabpanel" aria-label={tab === 'users' ? 'Users' : tab === 'roles' ? 'Roles & permissions' : 'Invitations'} data-setting-id={tab === 'invites' ? 'users.invites' : undefined}>
          {tab === 'users' && (
            <div className={TABLE.scroll}>
              <table className={`${TABLE.table} min-w-[960px]`}>
                <caption className="sr-only">Users</caption>
                <thead>
                  <tr className={TABLE.headRow}>
                    {['Name', 'Email', 'Role', 'Sites', 'Status', 'Last active'].map((h) => (
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
                  {users.map((u) => (
                    <tr key={u.id} className={TABLE.row}>
                      <th scope="row" className={`${TABLE.td} text-left font-medium text-[#121722]`}>
                        <span className="flex items-center gap-2.5">
                          <Avatar initials={u.initials} size={32} tone={u.status === 'Suspended' ? 'navy' : 'royal'} />
                          {u.name}
                        </span>
                      </th>
                      <td className={`${TABLE.td} text-[13px]`}>{u.email}</td>
                      <td className={TABLE.td}>{u.role}</td>
                      <td className={`${TABLE.td} text-[13px]`}>{u.sites}</td>
                      <td className={TABLE.td}>{STATUS[u.status]}</td>
                      <td className={TABLE.td}>{u.lastActive}</td>
                      <td className={`${TABLE.td} text-right`}>
                        <span className="inline-flex gap-1">
                          <a
                            href={`${PROFILE_PREVIEW_PATH}?state=admin&viewer=admin`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={BUTTON.ghostSm}
                            aria-label={`View profile of ${u.name} (opens in a new tab)`}
                          >
                            View profile
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                          {!viewOnly && u.role !== 'Administrator' && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setNewRole(u.role);
                                  setDialog({ kind: 'role', user: u });
                                }}
                                className={BUTTON.ghostSm}
                                aria-label={`Change role for ${u.name}`}
                              >
                                Change role
                              </button>
                              {u.status !== 'Suspended' && (
                                <button type="button" onClick={() => setDialog({ kind: 'suspend', user: u })} className={BUTTON.ghostSm} aria-label={`Suspend ${u.name}`}>
                                  Suspend
                                </button>
                              )}
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'roles' && (
            <div className={`${TABLE.scroll} border-t border-[#DDE2EA]`}>
              <table className={`${TABLE.table} min-w-[880px]`}>
                <caption className="sr-only">Permissions by role. Rows are permissions, columns are roles.</caption>
                <thead>
                  <tr className={TABLE.headRow}>
                    <th scope="col" className={`${TABLE.th} sticky left-0 z-10 bg-[#F7F9FC] min-w-[200px]`}>
                      Permission
                    </th>
                    {columns.map((r) => (
                      <th key={r} scope="col" className={`${TABLE.th} text-center whitespace-normal min-w-[96px] leading-[14px]`}>
                        {r}
                      </th>
                    ))}
                  </tr>
                </thead>
                {PERMISSION_GROUPS.map((g) => (
                  <tbody key={g.label} className="border-b border-[#DDE2EA] last:border-b-0">
                    <tr>
                      <th scope="colgroup" colSpan={columns.length + 1} className="sticky left-0 bg-white pt-4 pb-1 pl-4 @min-[768px]:pl-6 text-left text-[12px] font-semibold text-[#353D4C]">
                        {g.label}
                      </th>
                    </tr>
                    {g.permissions.map((p) => (
                      <tr key={p.id} className={TABLE.row}>
                        <th scope="row" className="sticky left-0 z-[1] bg-white h-11 pl-4 @min-[768px]:pl-6 pr-4 text-left font-normal text-[#121722] whitespace-nowrap shadow-[1px_0_0_#DDE2EA]">
                          {p.label}
                        </th>
                        {columns.map((r) => {
                          const admin = r === 'Administrator';
                          const label = `${r}: ${p.label}`;
                          const checked = admin || Boolean(matrix[p.id]?.[r]);
                          return (
                            <td key={r} className="text-center">
                              <label className="relative inline-flex items-center justify-center gap-1 w-11 h-11 cursor-pointer has-[:disabled]:cursor-not-allowed">
                                {admin ? (
                                  <Tooltip content="Administrators always have full access">
                                    {(tip) => (
                                      <span className="inline-flex items-center gap-1">
                                        <input
                                          type="checkbox"
                                          checked
                                          aria-disabled="true"
                                          aria-label={`${label}, always allowed`}
                                          aria-describedby={tip}
                                          onChange={() => undefined}
                                          onClick={(e) => e.preventDefault()}
                                          className={CHECKBOX}
                                        />
                                        <Lock className="w-3 h-3 text-[#6B7485]" aria-hidden="true" />
                                      </span>
                                    )}
                                  </Tooltip>
                                ) : (
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    disabled={viewOnly}
                                    aria-label={label}
                                    onChange={(e) => setPermission(p.id, p.label, r, e.target.checked)}
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
          )}

          {tab === 'invites' && (
            <div className={`${TABLE.scroll} border-t border-[#DDE2EA]`}>
              {invites.length === 0 ? (
                <p className="px-6 py-10 text-center text-[14px] text-[#4B5465]">No pending invitations.</p>
              ) : (
                <table className={`${TABLE.table} min-w-[760px]`}>
                  <caption className="sr-only">Pending invitations</caption>
                  <thead>
                    <tr className={TABLE.headRow}>
                      {['Email', 'Role', 'Invited by', 'Sent', 'Expires'].map((h) => (
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
                    {invites.map((inv) => (
                      <tr key={inv.id} className={TABLE.row}>
                        <th scope="row" className={`${TABLE.td} text-left font-medium text-[#121722]`}>
                          {inv.email}
                        </th>
                        <td className={TABLE.td}>{inv.role}</td>
                        <td className={TABLE.td}>{inv.invitedBy}</td>
                        <td className={TABLE.td}>{inv.sent}</td>
                        <td className={TABLE.td}>{inv.expires}</td>
                        <td className={`${TABLE.td} text-right`}>
                          {!viewOnly && (
                            <span className="inline-flex gap-1">
                              <button type="button" onClick={() => done(`Invite sent again to ${inv.email}`)} className={BUTTON.ghostSm} aria-label={`Resend invite to ${inv.email}`}>
                                Resend
                              </button>
                              <button type="button" onClick={() => setDialog({ kind: 'revoke', invite: inv })} className={BUTTON.ghostSm} aria-label={`Revoke invite to ${inv.email}`}>
                                Revoke
                              </button>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </SectionCard>

      {dialog?.kind === 'invite' && (
        <InviteUsersModal
          sites={sites}
          onClose={() => setDialog(null)}
          onSend={(emails, role) => {
            setInvites((list) => [...list, ...emails.map((email, i) => ({ id: `new-${list.length + i}`, email, role, invitedBy: 'Priya Sharma', sent: '30 Sep', expires: 'Expires in 7 days' }))]);
            setDialog(null);
            setTab('invites');
            done(`${emails.length === 1 ? 'Invite' : `${emails.length} invites`} sent`);
          }}
        />
      )}
      {dialog?.kind === 'role' && (
        <Modal
          title={`Change role for ${dialog.user.name}`}
          description="The new permissions apply at their next page load."
          onClose={() => setDialog(null)}
          footer={
            <>
              <button type="button" onClick={() => setDialog(null)} className={BUTTON.secondary}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsers((list) => list.map((u) => (u.id === dialog.user.id ? { ...u, role: newRole as RoleName } : u)));
                  setDialog(null);
                  done(`${dialog.user.name} is now ${newRole}`);
                }}
                className={BUTTON.primary}
              >
                Change role
              </button>
            </>
          }
        >
          <label id={`${uid}-role-label`} htmlFor={`${uid}-role`} className="block mb-1.5 text-[14px] font-medium text-[#121722]">
            Role
          </label>
          <SettingsSelect
            id={`${uid}-role`}
            labelledBy={`${uid}-role-label`}
            value={newRole}
            onChange={setNewRole}
            options={ROLE_OPTIONS.filter((o) => o.value !== 'Administrator')}
          />
        </Modal>
      )}
      {dialog?.kind === 'suspend' && (
        <ConfirmDestructiveModal
          title={`Suspend ${dialog.user.name}?`}
          body={`${dialog.user.name} is signed out everywhere and can't sign in until reactivated from their profile.`}
          confirmLabel="Suspend user"
          confirmText={dialog.user.email}
          onClose={() => setDialog(null)}
          onConfirm={() => {
            setUsers((list) => list.map((u) => (u.id === dialog.user.id ? { ...u, status: 'Suspended' } : u)));
            setDialog(null);
            done(`${dialog.user.name} is suspended`);
          }}
        />
      )}
      {dialog?.kind === 'revoke' && (
        <ConfirmDestructiveModal
          title="Revoke this invite?"
          body={`The link sent to ${dialog.invite.email} stops working. You can invite them again later.`}
          confirmLabel="Revoke invite"
          onClose={() => setDialog(null)}
          onConfirm={() => {
            setInvites((list) => list.filter((i) => i.id !== dialog.invite.id));
            setDialog(null);
            done(`Invite to ${dialog.invite.email} revoked`);
          }}
        />
      )}
      {dialog?.kind === 'custom-role' && (
        <Modal
          title="Create custom role"
          description="Starts with no permissions. Tick the ones it needs in the matrix."
          onClose={() => setDialog(null)}
          footer={
            <>
              <button type="button" onClick={() => setDialog(null)} className={BUTTON.secondary}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const name = customName.trim();
                  if (!name) return setCustomError('Enter a role name');
                  if (columns.some((c) => c.toLowerCase() === name.toLowerCase())) return setCustomError('A role with this name already exists');
                  setColumns((c) => [...c, name]);
                  setDialog(null);
                  setCustomName('');
                  done(`Role “${name}” created`);
                }}
                className={BUTTON.primary}
              >
                Create role
              </button>
            </>
          }
        >
          <label htmlFor={`${uid}-custom`} className="block mb-1.5 text-[14px] font-medium text-[#121722]">
            Role name
          </label>
          <input
            id={`${uid}-custom`}
            value={customName}
            aria-invalid={customError ? true : undefined}
            aria-describedby={`${uid}-custom-error`}
            onChange={(e) => {
              setCustomName(e.target.value);
              setCustomError('');
            }}
            placeholder="e.g. Night shift lead"
            className={`${TEXT_INPUT} w-full`}
          />
          <p id={`${uid}-custom-error`} className="mt-1.5 text-[12px] font-medium text-[#0B2D6B]" aria-live="polite">
            {customError}
          </p>
        </Modal>
      )}
    </>
  );
};
