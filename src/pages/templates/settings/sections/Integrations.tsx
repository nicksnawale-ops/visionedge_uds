import React, { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, KeyRound, Send } from 'lucide-react';
import { Field } from '../../shared/authUi';
import { ConfirmDestructiveModal } from '../../profile/modals/ConfirmDestructiveModal';
import { BUTTON, Badge, CHECKBOX, MONO, Modal, Spinner } from '../../profile/ui';
import { useSettings } from '../SettingsContext';
import { DELIVERIES, Integration, WEBHOOK_EVENTS, getIntegrations } from '../data/integrations';
import { ApiKey, INITIAL_KEYS, maskKey } from '../data/apiKeys';
import { CardBody, SectionCard } from '../patterns/SectionCard';
import { BoundRow, RowInput, SettingRow } from '../patterns/SettingRow';
import { TABLE } from '../patterns/table';
import { CreateApiKeyModal } from '../modals/CreateApiKeyModal';

const STATUS: Record<Integration['status'], React.ReactNode> = {
  connected: <Badge tone="live">Connected</Badge>,
  'not-connected': <Badge tone="neutral">Not connected</Badge>,
  error: <Badge tone="critical">Error</Badge>,
};

/** Configure / connect / fix: endpoint, account and a masked secret. */
const ConfigureModal: React.FC<{ integration: Integration; fixing: boolean; onSaved: () => void; onClose: () => void }> = ({ integration, fixing, onSaved, onClose }) => {
  const uid = useId();
  const [busy, setBusy] = useState(false);
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const timer = useRef<number | undefined>(undefined);
  const save = () => {
    if (!secret.trim()) return setError(fixing ? 'Enter the new API secret from your SMS provider' : 'Enter the secret or password');
    setBusy(true);
    timer.current = window.setTimeout(onSaved, 1000);
  };
  return (
    <Modal
      title={`${integration.status === 'not-connected' ? 'Connect' : 'Configure'} ${integration.name}`}
      description={fixing ? 'Paste the new credentials. We test the connection before saving.' : integration.description}
      onClose={() => {
        window.clearTimeout(timer.current);
        onClose();
      }}
      footer={
        <>
          <button type="button" onClick={onClose} className={BUTTON.secondary}>
            Cancel
          </button>
          <button type="button" onClick={save} aria-disabled={busy || undefined} className={`${BUTTON.primary} min-w-[140px]`}>
            {busy ? (
              <>
                <Spinner />
                Testing…
              </>
            ) : (
              'Save and test'
            )}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Field id={`${uid}-endpoint`} label="Server or endpoint" defaultValue={integration.id === 'smtp' ? 'smtp.pit.edu.in:587' : `https://api.example.in/${integration.id}`} />
        <Field id={`${uid}-account`} label="Account or client ID" defaultValue="visionedge-pit" />
        <Field
          id={`${uid}-secret`}
          label={fixing ? 'New API secret' : 'Secret or password'}
          type="password"
          autoComplete="off"
          value={secret}
          error={error}
          helper="Stored encrypted. It's never shown again after you save."
          onChange={(e) => {
            setSecret(e.target.value);
            setError('');
          }}
        />
      </div>
    </Modal>
  );
};

type Dialog = { kind: 'configure'; integration: Integration; fixing: boolean } | { kind: 'create-key'; created: boolean } | { kind: 'revoke'; key: ApiKey } | null;

export const Integrations: React.FC = () => {
  const { state, viewOnly, smsError, setSmsError, values, set, touch, toast, announce, marker } = useSettings();
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [dialog, setDialog] = useState<Dialog>(() => {
    if (viewOnly) return null;
    if (state === 'api-key-created') return { kind: 'create-key', created: true };
    if (state === 'destructive') return { kind: 'revoke', key: INITIAL_KEYS[0] };
    return null;
  });
  const [sending, setSending] = useState(false);
  const sendTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(sendTimer.current), []);
  const integrations = getIntegrations(smsError);
  const events = values['webhook.events'] as string[];
  const done = (m: string) => {
    toast(m, 'success');
    announce(m);
  };

  return (
    <>
      <SectionCard title="Connected services" description="Generic connectors. Your provider’s details go in Configure." settingId="int.cards" overlay={marker(5)}>
        <CardBody>
          <ul className="grid grid-cols-1 @min-[1280px]:grid-cols-2 gap-4">
            {integrations.map((it) => {
              const Icon = it.icon;
              return (
                <li key={it.id} className={`flex flex-col gap-3 p-6 rounded-[12px] bg-white ${it.status === 'error' ? 'border-2 border-[#0B2D6B]' : 'border border-[#DDE2EA]'}`}>
                  <div className="flex items-start gap-3">
                    <span className="w-10 h-10 shrink-0 rounded-[8px] bg-[#F7F9FC] border border-[#DDE2EA] flex items-center justify-center text-[#353D4C]" aria-hidden="true">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-[14px] leading-[20px] font-semibold text-[#121722]">{it.name}</h5>
                      <p className="text-[12px] leading-[16px] text-[#4B5465]">{it.description}</p>
                    </div>
                    {STATUS[it.status]}
                  </div>
                  {it.error && (
                    <p role="alert" className="flex items-start gap-2 text-[13px] leading-[18px] font-medium text-[#0B2D6B]">
                      <AlertCircle className="w-4 h-4 mt-px shrink-0" aria-hidden="true" />
                      {it.error}
                    </p>
                  )}
                  {!viewOnly && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setDialog({ kind: 'configure', integration: it, fixing: it.status === 'error' })}
                        className={BUTTON.secondarySm}
                        aria-label={`${it.status === 'error' ? 'Fix' : it.status === 'connected' ? 'Configure' : 'Connect'} ${it.name}`}
                      >
                        {it.status === 'error' ? 'Fix now' : it.status === 'connected' ? 'Configure' : 'Connect'}
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </CardBody>
      </SectionCard>

      <SectionCard
        title="API keys"
        description="Stored keys are always masked. A new key is shown once."
        settingId="int.apiKeys"
        actions={
          !viewOnly && (
            <button type="button" onClick={() => setDialog({ kind: 'create-key', created: false })} className={BUTTON.secondary}>
              <KeyRound className="w-4 h-4" aria-hidden="true" />
              Create API key
            </button>
          )
        }
      >
        <div className={TABLE.scroll}>
          <table className={`${TABLE.table} min-w-[820px]`}>
            <caption className="sr-only">API keys</caption>
            <thead>
              <tr className={TABLE.headRow}>
                {['Name', 'Key', 'Scopes', 'Created', 'Last used'].map((h) => (
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
              {keys.map((k) => (
                <tr key={k.id} className={TABLE.row}>
                  <th scope="row" className={`${TABLE.td} text-left font-medium text-[#121722]`}>
                    {k.name}
                  </th>
                  <td className={TABLE.td}>
                    <span className={MONO} aria-label={viewOnly ? 'Key hidden' : `Key ending in ${k.last4}`}>
                      {maskKey(k.last4, viewOnly)}
                    </span>
                  </td>
                  <td className={`${TABLE.td} font-mono text-[12px]`}>{k.scopes.join(', ')}</td>
                  <td className={TABLE.td}>{k.created}</td>
                  <td className={TABLE.td}>{k.lastUsed}</td>
                  <td className={`${TABLE.td} text-right`}>
                    {!viewOnly && (
                      <button type="button" onClick={() => setDialog({ kind: 'revoke', key: k })} className={BUTTON.destructiveSm} aria-label={`Revoke ${k.name}`}>
                        Revoke
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
        title="Webhooks"
        description="Events are signed with your secret so your system can trust them."
        actions={
          !viewOnly && (
            <button
              type="button"
              onClick={() => {
                setSending(true);
                sendTimer.current = window.setTimeout(() => {
                  setSending(false);
                  done('Test event delivered · 200 OK in 182 ms');
                }, 900);
              }}
              aria-disabled={sending || undefined}
              className={`${BUTTON.secondary} min-w-[164px]`}
            >
              {sending ? <Spinner /> : <Send className="w-4 h-4" aria-hidden="true" />}
              {sending ? 'Sending…' : 'Send test event'}
            </button>
          )
        }
      >
        <BoundRow id="webhook.url">
          {(c) => <RowInput control={c} type="url" mono value={String(values['webhook.url'])} onChange={(v) => set('webhook.url', v)} onBlur={() => touch('webhook.url')} />}
        </BoundRow>
        <BoundRow id="webhook.events" group>
          {(c) => (
            <div role="group" aria-labelledby={c.labelId} aria-describedby={c.describedBy} className="grid grid-cols-1 @min-[480px]:grid-cols-2 gap-x-4">
              {WEBHOOK_EVENTS.map((ev) => (
                <label key={ev.value} className={`flex items-center gap-2 min-h-[44px] text-[14px] text-[#121722] ${c.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input
                    type="checkbox"
                    disabled={c.disabled}
                    checked={events.includes(ev.value)}
                    onChange={() => set('webhook.events', events.includes(ev.value) ? events.filter((x) => x !== ev.value) : [...events, ev.value])}
                    className={CHECKBOX}
                  />
                  {ev.label}
                </label>
              ))}
            </div>
          )}
        </BoundRow>
        <SettingRow label="Signing secret" description="Sent in the X-VisionEdge-Signature header. Rotate it if it may have leaked." disabled={viewOnly}>
          {() => (
            <span className="flex flex-wrap items-center gap-3">
              <span className={MONO}>{viewOnly ? 'whsec_••••••••••••' : 'whsec_••••••••a91c'}</span>
              {!viewOnly && (
                <button type="button" onClick={() => done('Signing secret rotated. Update your endpoint within 24 hours.')} className={BUTTON.ghostSm}>
                  Rotate secret
                </button>
              )}
            </span>
          )}
        </SettingRow>
        <div className="px-4 @min-[768px]:px-6 pb-5">
          <h5 className="mb-2 text-[12px] leading-[16px] font-semibold text-[#353D4C]">Recent deliveries</h5>
          <div className={`${TABLE.scroll} rounded-[8px] border border-[#DDE2EA]`}>
            <table className={`${TABLE.table} min-w-[480px] text-[13px]`}>
              <caption className="sr-only">Recent webhook deliveries</caption>
              <thead>
                <tr className={TABLE.headRow}>
                  {['Event', 'Time', 'Status', 'Duration'].map((h) => (
                    <th key={h} scope="col" className={`${TABLE.th} h-9`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={TABLE.body}>
                {DELIVERIES.map((d) => (
                  <tr key={d.id}>
                    <td className={`${TABLE.td} h-10 font-mono text-[12px]`}>{d.event}</td>
                    <td className={`${TABLE.td} h-10`}>{d.time}</td>
                    <td className={`${TABLE.td} h-10`}>{d.status === 200 ? <Badge tone="live">200 OK</Badge> : <Badge tone="critical">500 Error</Badge>}</td>
                    <td className={`${TABLE.td} h-10 tabular-nums`}>{d.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      {dialog?.kind === 'configure' && (
        <ConfigureModal
          integration={dialog.integration}
          fixing={dialog.fixing}
          onClose={() => setDialog(null)}
          onSaved={() => {
            if (dialog.integration.id === 'sms') setSmsError(false);
            setDialog(null);
            done(`${dialog.integration.name} connected`);
          }}
        />
      )}
      {dialog?.kind === 'create-key' && (
        <CreateApiKeyModal
          created={dialog.created}
          onClose={() => setDialog(null)}
          onCreated={(key) => {
            setKeys((list) => [...list, key]);
            announce('API key created. Copy it now; it will not be shown again.');
          }}
        />
      )}
      {dialog?.kind === 'revoke' && (
        <ConfirmDestructiveModal
          title={`Revoke “${dialog.key.name}”?`}
          body={`Anything using the key ending in ${dialog.key.last4} stops working straight away. This can't be undone; create a new key if you need one.`}
          confirmLabel="Revoke key"
          onClose={() => setDialog(null)}
          onConfirm={() => {
            setKeys((list) => list.filter((k) => k.id !== dialog.key.id));
            setDialog(null);
            done(`Revoked “${dialog.key.name}”`);
          }}
        />
      )}
    </>
  );
};
