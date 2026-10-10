import React, { useState } from 'react';
import { Info, KeyRound, Smartphone } from 'lucide-react';
import { InfoAlert } from '../../shared/authUi';
import { useProfile } from '../ProfileContext';
import { BUTTON, Badge, ProfileCard, Toggle } from '../ui';

const SelfSecurity: React.FC = () => {
  const { user, twoStep, openModal, backupRemaining, marker, toast } = useProfile();
  const [newDevice, setNewDevice] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(true);

  return (
    <>
      <ProfileCard
        title="Password"
        description={`Last changed ${user.passwordAge} days ago`}
        overlay={marker(6)}
        actions={
          <button type="button" onClick={() => openModal({ kind: 'password' })} className={BUTTON.secondary}>
            <KeyRound className="w-4 h-4" aria-hidden="true" />
            Change password
          </button>
        }
      >
        <p className="text-[13px] leading-[20px] text-[#4B5465]">Changing your password signs you out on every other device.</p>
      </ProfileCard>

      <ProfileCard title="Two-step verification" description="A 6-digit code from your authenticator app, every time you sign in.">
        <Toggle
          label="Require a code at sign-in"
          checked={twoStep}
          onChange={(on) => openModal({ kind: on ? 'two-step-setup' : 'two-step-off' })}
        />
        {twoStep ? (
          <p className="mt-2 flex items-center gap-2 text-[13px] leading-[20px] text-[#353D4C]">
            <Smartphone className="w-4 h-4 text-[#4B5465]" aria-hidden="true" />
            Authenticator app · Added 12 Mar 2025
          </p>
        ) : (
          <div className="mt-3" role="status">
            <InfoAlert icon={Info}>
              Two-step verification is off. Anyone who knows your password can sign in to your account.
            </InfoAlert>
          </div>
        )}
      </ProfileCard>

      <ProfileCard
        title="Backup codes"
        description={twoStep ? `${backupRemaining} of 10 remaining` : 'Available when two-step verification is on.'}
        actions={
          twoStep ? (
            <>
              <button type="button" onClick={() => openModal({ kind: 'backup-codes', regenerate: false })} className={BUTTON.secondary}>
                View codes
              </button>
              <button type="button" onClick={() => openModal({ kind: 'backup-codes', regenerate: true })} className={BUTTON.ghost}>
                Generate new codes
              </button>
            </>
          ) : undefined
        }
      >
        <p className="text-[13px] leading-[20px] text-[#4B5465]">Use a backup code to sign in if you lose your phone. Each code works once.</p>
      </ProfileCard>

      <ProfileCard title="Sign-in alerts">
        <div className="divide-y divide-[#EEF1F6]">
          <Toggle
            label="Email me when there's a sign-in from a new device"
            checked={newDevice}
            onChange={(on) => {
              setNewDevice(on);
              toast(on ? 'New-device sign-in emails on' : 'New-device sign-in emails off', 'success');
            }}
          />
          <Toggle
            label="Email me after 3 failed sign-in attempts"
            checked={failedAttempts}
            onChange={(on) => {
              setFailedAttempts(on);
              toast(on ? 'Failed sign-in emails on' : 'Failed sign-in emails off', 'success');
            }}
          />
        </div>
      </ProfileCard>
    </>
  );
};

const AdminSecurity: React.FC = () => {
  const { user, twoStep, openModal, requireTwoStep, setRequireTwoStep, toast, name, announce, marker, suspended } = useProfile();
  return (
    <>
      <ProfileCard
        title="Password"
        description={`Last changed ${user.passwordAge} days ago`}
        overlay={marker(6)}
        actions={
          <button type="button" onClick={() => openModal({ kind: 'reset-password' })} disabled={suspended} className={`${BUTTON.secondary} disabled:opacity-50 disabled:cursor-not-allowed`}>
            <KeyRound className="w-4 h-4" aria-hidden="true" />
            Reset password
          </button>
        }
      >
        <p className="text-[13px] leading-[20px] text-[#4B5465]">
          {suspended ? 'Reactivate the account before resetting the password.' : `Sends ${name} an email with a link to choose a new password. You never see their password.`}
        </p>
      </ProfileCard>

      <ProfileCard
        title="Two-step verification"
        actions={twoStep ? <Badge tone="live">On</Badge> : <Badge tone="neutral">Off</Badge>}
      >
        <Toggle
          label="Require two-step verification"
          description={`${name} must set up an authenticator app at their next sign-in.`}
          checked={requireTwoStep}
          onChange={(on) => {
            setRequireTwoStep(on);
            const message = on ? `Two-step verification is now required for ${name}` : `Two-step verification is optional for ${name}`;
            toast(message, 'success');
            announce(message);
          }}
        />
      </ProfileCard>
    </>
  );
};

export const Security: React.FC = () => {
  const { viewer } = useProfile();
  return viewer === 'self' ? <SelfSecurity /> : <AdminSecurity />;
};
