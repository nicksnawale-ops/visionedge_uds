import React, { useId, useState } from 'react';
import { Copy, Info } from 'lucide-react';
import { useToast } from '../../../../components/common/Toast';
import { Field, FieldErrorText, InfoAlert, LABEL } from '../../shared/authUi';
import { BUTTON, CHECKBOX, Modal } from '../../profile/ui';
import { API_SCOPES, ApiKey, NEW_KEY } from '../data/apiKeys';

interface CreateApiKeyModalProps {
  /** Demo state: open on the "shown once" screen. */
  created?: boolean;
  onCreated: (key: ApiKey) => void;
  onClose: () => void;
}

/** Name + scopes → the full key, shown once with Copy and a warning. Afterwards it is only ever masked. */
export const CreateApiKeyModal: React.FC<CreateApiKeyModalProps> = ({ created = false, onCreated, onClose }) => {
  const uid = useId();
  const { copyToClipboard } = useToast();
  const [name, setName] = useState(created ? 'Parking display board' : '');
  const [scopes, setScopes] = useState<string[]>(['events:read']);
  const [errors, setErrors] = useState<{ name?: string; scopes?: string }>({});
  const [shown, setShown] = useState(created);

  const create = () => {
    const next = { name: name.trim() ? undefined : 'Enter a name so you can recognize this key later', scopes: scopes.length ? undefined : 'Choose at least one scope' };
    setErrors(next);
    if (next.name) return document.getElementById(`${uid}-name`)?.focus();
    if (next.scopes) return;
    onCreated({ id: `k-${name}`, name: name.trim(), last4: NEW_KEY.slice(-4), scopes, created: '30 Sep 2026', lastUsed: 'Never' });
    setShown(true);
  };

  if (shown) {
    return (
      <Modal
        title="API key created"
        description={`“${name}” · ${scopes.length} scope${scopes.length === 1 ? '' : 's'}`}
        onClose={onClose}
        footer={
          <button type="button" onClick={onClose} className={BUTTON.primary}>
            I've copied the key
          </button>
        }
      >
        <div className="space-y-4">
          <InfoAlert icon={Info}>Copy this key now. You won't be able to see it again.</InfoAlert>
          <div>
            <span id={`${uid}-key-label`} className={LABEL}>
              Your new key
            </span>
            <div className="flex flex-col @min-[480px]:flex-row gap-2">
              <code aria-labelledby={`${uid}-key-label`} className="flex-1 min-w-0 px-3 py-2.5 rounded-[8px] bg-[#F7F9FC] border border-[#DDE2EA] font-mono text-[13px] text-[#121722] break-all select-all">
                {NEW_KEY}
              </code>
              <button type="button" onClick={() => copyToClipboard(NEW_KEY, 'API key')} className={BUTTON.secondary}>
                <Copy className="w-4 h-4" aria-hidden="true" />
                Copy
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Create API key"
      description="Keys let your own systems call the VisionEdge API. Give each system its own key."
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={BUTTON.secondary}>
            Cancel
          </button>
          <button type="button" onClick={create} className={BUTTON.primary}>
            Create key
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <Field id={`${uid}-name`} label="Key name" value={name} error={errors.name} placeholder="e.g. Parking display board" onChange={(e) => setName(e.target.value)} />
        <fieldset>
          <legend className={LABEL}>Scopes</legend>
          {API_SCOPES.map((s) => (
            <label key={s.value} className="flex items-center gap-3 min-h-[44px] text-[14px] text-[#121722] cursor-pointer">
              <input
                type="checkbox"
                checked={scopes.includes(s.value)}
                onChange={() => setScopes((list) => (list.includes(s.value) ? list.filter((x) => x !== s.value) : [...list, s.value]))}
                className={CHECKBOX}
              />
              {s.label}
              <span className="font-mono text-[12px] text-[#6B7485]">{s.value}</span>
            </label>
          ))}
          {errors.scopes && <FieldErrorText>{errors.scopes}</FieldErrorText>}
        </fieldset>
      </div>
    </Modal>
  );
};
