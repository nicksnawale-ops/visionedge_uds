import React from 'react';
import { Info, KeyRound, MonitorSmartphone, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { InfoAlert } from '../../shared/authUi';
import { formatPhone } from '../../register/registerStates';
import { useProfile } from '../ProfileContext';
import { DATE_FORMATS, LANGUAGES, TIME_ZONE, labelOf } from '../data/users';
import { Avatar, BUTTON, Badge, Chip, LINK, MONO, OVERLINE, ProfileCard, Tooltip } from '../ui';

const EditLink: React.FC<{ onClick: () => void; label: string; children: React.ReactNode }> = ({ onClick, label, children }) => (
  <a
    href="#personal"
    aria-label={label}
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={LINK}
  >
    {children}
  </a>
);

/* ── Personal information ── */

const PersonalInfoCard: React.FC = () => {
  const { details, name, email, user, goTo, marker, viewer } = useProfile();
  const rows: { term: string; value: React.ReactNode }[] = [
    { term: 'Full name', value: details.displayName ? `${name} (${details.displayName})` : name },
    { term: 'Work email', value: email },
    { term: 'Mobile', value: details.mobile ? `+91 ${formatPhone(details.mobile)}` : '—' },
    { term: 'Employee ID', value: <span className={MONO}>{user.employeeId}</span> },
    { term: 'Department', value: user.department },
    { term: 'Language', value: labelOf(LANGUAGES, details.language) },
    { term: 'Time zone', value: TIME_ZONE.label },
    { term: 'Date format', value: labelOf(DATE_FORMATS, details.dateFormat).split(' (')[0] },
  ];
  return (
    <ProfileCard
      title="Personal information"
      overlay={marker(6)}
      actions={
        <EditLink onClick={() => goTo('personal')} label={viewer === 'self' ? 'Edit personal information' : `Edit ${name}'s personal information`}>
          Edit
        </EditLink>
      }
    >
      <dl className="grid grid-cols-1 @min-[640px]:grid-cols-2 gap-x-6 gap-y-4">
        {rows.map((r) => (
          <div key={r.term} className="min-w-0">
            <dt className={OVERLINE}>{r.term}</dt>
            <dd className="mt-0.5 text-[14px] leading-[20px] text-[#121722] break-words">{r.value}</dd>
          </div>
        ))}
      </dl>
    </ProfileCard>
  );
};

/* ── Organization & role ── */

const OrganizationCard: React.FC = () => {
  const { user, organization, sites } = useProfile();
  return (
    <ProfileCard title="Organization & role">
      <dl className="space-y-4">
        <div>
          <dt className={OVERLINE}>Organization</dt>
          <dd className="mt-0.5 text-[14px] leading-[20px] text-[#121722]">{organization}</dd>
        </div>
        <div>
          <dt className={OVERLINE}>Role</dt>
          <dd className="mt-0.5">
            <span className="block text-[14px] leading-[20px] font-medium text-[#121722]">{user.role}</span>
            <span className="block text-[13px] leading-[20px] text-[#4B5465]">{user.roleDescription}</span>
          </dd>
        </div>
        <div>
          <dt className={OVERLINE}>Sites</dt>
          <dd className="mt-1.5 flex flex-wrap gap-1.5">
            {sites.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </dd>
        </div>
        <div>
          <dt className={OVERLINE}>Reporting manager</dt>
          <dd className="mt-1.5 flex items-center gap-2">
            <Avatar initials={user.manager.initials} size={24} tone="navy" />
            <span className="text-[14px] leading-[20px] text-[#121722]">
              {user.manager.name}
              <span className="text-[#4B5465]"> · {user.manager.title}</span>
            </span>
          </dd>
        </div>
      </dl>
    </ProfileCard>
  );
};

/* ── Security status ── */

const StatusRow: React.FC<{ icon: LucideIcon; label: string; badge: React.ReactNode; action?: React.ReactNode }> = ({ icon: Icon, label, badge, action }) => (
  <li className="flex items-center gap-3 min-h-[44px] py-1.5">
    <span className="w-8 h-8 rounded-full bg-[#EEF1F6] text-[#353D4C] flex items-center justify-center shrink-0" aria-hidden="true">
      <Icon className="w-4 h-4" />
    </span>
    <span className="flex-1 min-w-0 text-[14px] leading-[20px] font-medium text-[#121722]">{label}</span>
    {badge}
    {action}
  </li>
);

const SecurityStatusCard: React.FC = () => {
  const { twoStep, user, sessions, goTo, openModal, viewer, requireTwoStep, name } = useProfile();
  const self = viewer === 'self';
  return (
    <ProfileCard title="Security status">
      <ul className="divide-y divide-[#EEF1F6] -my-1.5">
        <StatusRow icon={ShieldCheck} label="Two-step verification" badge={twoStep ? <Badge tone="live">On</Badge> : <Badge tone="neutral">Off</Badge>} />
        <StatusRow
          icon={KeyRound}
          label="Password changed"
          badge={
            <Tooltip content={self ? 'Changed on 20 Aug 2026, 10:12 IST' : 'Changed on 13 Sep 2026, 16:40 IST'} align="end">
              {(tip) => (
                <span tabIndex={0} aria-describedby={tip} className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]">
                  <Badge tone="neutral">{user.passwordAge} days ago</Badge>
                </span>
              )}
            </Tooltip>
          }
        />
        <StatusRow
          icon={MonitorSmartphone}
          label="Active sessions"
          badge={<Badge tone="info">{sessions.length}</Badge>}
          action={
            <a
              href="#sessions"
              aria-label="Review active sessions"
              onClick={(e) => {
                e.preventDefault();
                goTo('sessions');
              }}
              className={`${LINK} ml-1`}
            >
              Review
            </a>
          }
        />
      </ul>
      {!twoStep && (
        <div className="mt-4">
          <InfoAlert icon={Info}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p>{self ? 'Turn on two-step verification to protect your account.' : `${name} hasn't turned on two-step verification.`}</p>
              {self ? (
                <button
                  type="button"
                  onClick={() => {
                    goTo('security');
                    openModal({ kind: 'two-step-setup' });
                  }}
                  className={BUTTON.secondarySm}
                >
                  Turn on
                </button>
              ) : (
                !requireTwoStep && (
                  <button type="button" onClick={() => goTo('security')} className={BUTTON.secondarySm}>
                    Require it
                  </button>
                )
              )}
            </div>
          </InfoAlert>
        </div>
      )}
    </ProfileCard>
  );
};

/* ── Recent activity ── */

const RecentActivityCard: React.FC = () => {
  const { activity, goTo } = useProfile();
  return (
    <ProfileCard
      title="Recent activity"
      actions={
        <a
          href="#activity"
          aria-label="View all activity"
          onClick={(e) => {
            e.preventDefault();
            goTo('activity');
          }}
          className={LINK}
        >
          View all
        </a>
      }
    >
      <ol className="relative">
        {activity.slice(0, 5).map((a, i, list) => (
          <li key={a.id} className="relative flex gap-4 pb-4 last:pb-0">
            {i < list.length - 1 && <span className="absolute left-[3.5px] top-3 bottom-0 w-px bg-[#DDE2EA]" aria-hidden="true" />}
            <span className="relative mt-1.5 w-2 h-2 rounded-full bg-[#1E63FF] shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[14px] leading-[20px] font-medium text-[#121722]">
                {a.event}
                {a.result === 'Failed' && <span className="sr-only"> (failed)</span>}
              </p>
              <p className="text-[12px] leading-[16px] text-[#6B7485]">
                {a.details} · <time title={`${a.time} IST`}>{a.short}</time>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </ProfileCard>
  );
};

/* ── Danger zone (admin view) ── */

const DangerZone: React.FC = () => {
  const { openModal, marker, suspended, setSuspended, name, toast, announce } = useProfile();
  return (
    <section
      aria-labelledby="danger-zone-title"
      className="relative bg-white rounded-[12px] border border-[#DDE2EA] border-l-4 border-l-[#121722] p-4 @min-[768px]:p-6"
    >
      {marker(8)}
      <h4 id="danger-zone-title" className="text-[16px] leading-[24px] font-semibold text-[#121722]">
        Danger zone
      </h4>
      <p className="mt-0.5 text-[14px] leading-[20px] text-[#4B5465]">These actions affect the user's access straight away.</p>
      <ul className="mt-4 divide-y divide-[#EEF1F6]">
        <li className="py-3 first:pt-0 flex flex-col @min-[640px]:flex-row @min-[640px]:items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-[#121722]">{suspended ? 'Reactivate user' : 'Suspend user'}</p>
            <p className="text-[13px] leading-[20px] text-[#4B5465]">
              {suspended ? `${name} can sign in again with their current password.` : `${name} is signed out everywhere and can't sign in until reactivated.`}
            </p>
          </div>
          {suspended ? (
            <button
              type="button"
              onClick={() => {
                setSuspended(false);
                toast(`${name} can sign in again`, 'success');
                announce(`${name} reactivated`);
              }}
              className={BUTTON.secondary}
            >
              Reactivate user
            </button>
          ) : (
            <button type="button" onClick={() => openModal({ kind: 'suspend' })} className={BUTTON.destructive}>
              Suspend user
            </button>
          )}
        </li>
        <li className="py-3 last:pb-0 flex flex-col @min-[640px]:flex-row @min-[640px]:items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-[#121722]">Delete user</p>
            <p className="text-[13px] leading-[20px] text-[#4B5465]">Permanently removes the account. Activity history is kept for audits.</p>
          </div>
          <Tooltip content="Users with activity history can only be suspended" align="end">
            {(tip) => (
              <button type="button" aria-disabled="true" aria-describedby={tip} onClick={(e) => e.preventDefault()} className={`${BUTTON.disabled} w-full @min-[640px]:w-auto`}>
                Delete user
              </button>
            )}
          </Tooltip>
        </li>
      </ul>
    </section>
  );
};

export const Overview: React.FC = () => {
  const { viewer } = useProfile();
  return (
    <>
      <PersonalInfoCard />
      <div className="grid grid-cols-1 @min-[1280px]:grid-cols-2 gap-6">
        <OrganizationCard />
        <SecurityStatusCard />
      </div>
      <RecentActivityCard />
      {viewer === 'admin' && <DangerZone />}
    </>
  );
};
