import React, { useId, useState } from 'react';
import { FieldErrorText, LABEL, OptionalMark } from '../../shared/authUi';
import { SelectField } from '../parts/SelectField';
import { BUTTON, Modal } from '../../profile/ui';
import { ChipsInput, ToggleChips } from '../patterns/ChipsInput';
import { ROLE_OPTIONS } from '../data/users';
import type { RoleName } from '../data/permissions';

interface InviteUsersModalProps {
  sites: string[];
  onSend: (emails: string[], role: RoleName) => void;
  onClose: () => void;
}

const isWorkEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/** Emails as chips, role, sites and an optional message. Invites expire after 7 days. */
export const InviteUsersModal: React.FC<InviteUsersModalProps> = ({ sites, onSend, onClose }) => {
  const uid = useId();
  const [emails, setEmails] = useState<string[]>([]);
  const [role, setRole] = useState<string>('Operator');
  const [chosen, setChosen] = useState<string[]>([sites[0]]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const send = () => {
    if (!emails.length) {
      setError('Add at least one email address');
      document.getElementById(`${uid}-emails`)?.focus();
      return;
    }
    onSend(emails, role as RoleName);
  };

  return (
    <Modal
      title="Invite users"
      description="Each person gets an email to set a password. Invites expire after 7 days."
      size={640}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={BUTTON.secondary}>
            Cancel
          </button>
          <button type="button" onClick={send} className={BUTTON.primary}>
            {emails.length > 1 ? `Send ${emails.length} invites` : 'Send invites'}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <span id={`${uid}-emails-label`} className={LABEL}>
            Email addresses
          </span>
          <ChipsInput
            id={`${uid}-emails`}
            labelledBy={`${uid}-emails-label`}
            values={emails}
            onChange={(v) => {
              setEmails(v);
              setError('');
            }}
            noun="email"
            placeholder="name@pit.edu.in, then Enter"
            validate={(v) => (isWorkEmail(v) ? undefined : `“${v}” isn't a valid email address`)}
          />
          {error && <FieldErrorText>{error}</FieldErrorText>}
        </div>
        <SelectField id={`${uid}-role`} label="Role" options={ROLE_OPTIONS} value={role} onChange={setRole} placeholder="Choose a role" />
        <div>
          <span id={`${uid}-sites`} className={LABEL}>
            Sites
          </span>
          <ToggleChips options={sites.map((s) => ({ value: s, label: s }))} value={chosen} onChange={setChosen} labelledBy={`${uid}-sites`} />
        </div>
        <div>
          <label htmlFor={`${uid}-msg`} className={LABEL}>
            Personal message
            <OptionalMark />
          </label>
          <textarea
            id={`${uid}-msg`}
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Welcome to the gate security team."
            className="w-full px-3 py-2.5 rounded-[8px] border border-[#8C95A6] bg-white text-[16px] @min-[640px]:text-[14px] text-[#121722] placeholder:text-[#6B7485] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20 resize-y"
          />
        </div>
      </div>
    </Modal>
  );
};
