import React, { useId, useMemo, useState } from 'react';
import { Copy, Download, Info } from 'lucide-react';
import { useToast } from '../../../../components/common/Toast';
import { Field, FieldErrorText, InfoAlert } from '../../shared/authUi';
import { OtpInput } from '../../login/OtpInput';
import { between, hashSeed, seeded } from '../../dashboard/data/seed';
import { DEMO_CODE } from '../profileStates';
import { BUTTON, Modal } from '../ui';

const MANUAL_KEY = 'JBSW Y3DP EHPK 3PXP';

/** 10 one-time codes, "4821-9930". Seeded per generation, so they are stable on every render. */
export const backupCodes = (generation: number): string[] => {
  const rand = seeded(hashSeed(`backup-codes-${generation}`));
  return Array.from({ length: 10 }, () => `${between(rand, 1000, 9999)}-${between(rand, 1000, 9999)}`);
};

const downloadText = (filename: string, text: string) => {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/** Decorative QR placeholder: 21×21 modules in Gray 900 on white with the three finder squares. */
const QrPlaceholder: React.FC = () => {
  const cells = useMemo(() => {
    const rand = seeded(hashSeed('profile-qr'));
    const finder = (x: number, y: number) =>
      [
        [0, 0],
        [14, 0],
        [0, 14],
      ].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
    const finderOn = (x: number, y: number) => {
      const fx = x >= 14 ? x - 14 : x;
      const fy = y >= 14 ? y - 14 : y;
      const ring = fx === 0 || fx === 6 || fy === 0 || fy === 6;
      const core = fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4;
      return ring || core;
    };
    const list: [number, number][] = [];
    for (let y = 0; y < 21; y++)
      for (let x = 0; x < 21; x++) {
        const on = finder(x, y) ? finderOn(x, y) : rand() < 0.48;
        if (on) list.push([x, y]);
      }
    return list;
  }, []);

  return (
    <svg
      viewBox="-2 -2 25 25"
      width={160}
      height={160}
      role="img"
      aria-label="QR code for your authenticator app (sample)"
      className="shrink-0 rounded-[8px] border border-[#DDE2EA] bg-white"
    >
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#121722" />
      ))}
    </svg>
  );
};

/** 2-column JetBrains Mono grid with "Copy all" and "Download .txt". */
export const CodeGrid: React.FC<{ codes: string[]; used?: number }> = ({ codes, used = 0 }) => {
  const { copyToClipboard } = useToast();
  return (
    <div>
      <ol className="grid grid-cols-2 gap-x-6 gap-y-2 p-4 rounded-[8px] bg-[#F7F9FC] border border-[#DDE2EA]">
        {codes.map((c, i) => (
          <li key={c} className={`font-mono text-[14px] leading-[20px] tabular-nums ${i < used ? 'text-[#8C95A6] line-through' : 'text-[#121722]'}`}>
            {c}
            {i < used && <span className="sr-only"> (used)</span>}
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => copyToClipboard(codes.slice(used).join('\n'), 'backup codes')} className={BUTTON.secondarySm}>
          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
          Copy all
        </button>
        <button type="button" onClick={() => downloadText('visionedge-backup-codes.txt', codes.slice(used).join('\n'))} className={BUTTON.secondarySm}>
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          Download .txt
        </button>
      </div>
    </div>
  );
};

/* ── Setup (3 steps) ─────────────────────────────────────────────── */

interface TwoStepSetupModalProps {
  onEnabled: () => void;
  onClose: () => void;
}

export const TwoStepSetupModal: React.FC<TwoStepSetupModalProps> = ({ onEnabled, onClose }) => {
  const uid = useId();
  const { copyToClipboard } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const codes = useMemo(() => backupCodes(0), []);

  const verify = () => {
    if (code.length < 6) return setError('Enter all 6 digits of your code');
    if (code !== DEMO_CODE) return setError("That code didn't work. Check your app and try again.");
    setStep(3);
  };

  const titles = { 1: 'Scan the QR code', 2: 'Enter the code from your app', 3: 'Save your backup codes' } as const;

  return (
    <Modal
      title={titles[step]}
      description={<span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">Step {step} of 3</span>}
      // Closing after verifying still turns two-step on; earlier it leaves it off.
      onClose={step === 3 ? onEnabled : onClose}
      footer={
        step === 1 ? (
          <>
            <button type="button" onClick={onClose} className={BUTTON.secondary}>
              Cancel
            </button>
            <button type="button" onClick={() => setStep(2)} className={BUTTON.primary}>
              Continue
            </button>
          </>
        ) : step === 2 ? (
          <>
            <button type="button" onClick={() => setStep(1)} className={BUTTON.secondary}>
              Back
            </button>
            <button type="button" onClick={verify} className={BUTTON.primary}>
              Verify
            </button>
          </>
        ) : (
          <button type="button" onClick={onEnabled} className={BUTTON.primary}>
            Done
          </button>
        )
      }
    >
      {step === 1 && (
        <div className="flex flex-col @min-[480px]:flex-row items-center @min-[480px]:items-start gap-5">
          <QrPlaceholder />
          <div className="min-w-0 space-y-3 text-[14px] leading-[20px] text-[#353D4C]">
            <p>Open your authenticator app (for example Google Authenticator or Microsoft Authenticator) and scan this code.</p>
            <div>
              <p className="text-[12px] leading-[16px] text-[#4B5465]">Can't scan? Enter this key instead:</p>
              <div className="mt-1 flex items-center gap-2">
                <code className="px-2 py-1 rounded-[4px] bg-[#F7F9FC] border border-[#DDE2EA] font-mono text-[14px] text-[#121722] whitespace-nowrap">{MANUAL_KEY}</code>
                <button type="button" onClick={() => copyToClipboard(MANUAL_KEY.replace(/\s/g, ''), 'setup key')} className={BUTTON.ghostSm} aria-label="Copy setup key">
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <span id={`${uid}-label`} className="block mb-1.5 text-[14px] leading-[20px] font-medium text-[#121722]">
            6-digit code
          </span>
          <OtpInput
            value={code}
            onChange={(v) => {
              setCode(v);
              setError('');
            }}
            labelledBy={`${uid}-label`}
            describedBy={`${uid}-error`}
            invalid={Boolean(error)}
            autoFocus
          />
          <div id={`${uid}-error`} aria-live="polite">
            {error && <FieldErrorText>{error}</FieldErrorText>}
          </div>
          <p className="mt-3 text-[12px] leading-[16px] text-[#6B7485]">Demo: use code {DEMO_CODE}.</p>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <p className="text-[14px] leading-[20px] text-[#353D4C]">
            Each code signs you in once if you lose your phone. Store them somewhere safe — you won't see them again after this step.
          </p>
          <CodeGrid codes={codes} />
        </div>
      )}
    </Modal>
  );
};

/* ── Turn off ────────────────────────────────────────────────────── */

export const TwoStepOffModal: React.FC<{ onConfirm: () => void; onClose: () => void }> = ({ onConfirm, onClose }) => {
  const uid = useId();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const confirm = () => (password ? onConfirm() : setError('Enter your current password'));

  return (
    <Modal
      title="Turn off two-step verification?"
      role="alertdialog"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={BUTTON.secondary}>
            Keep it on
          </button>
          <button type="button" onClick={confirm} className={BUTTON.destructive}>
            Turn off two-step verification
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <InfoAlert icon={Info}>Without it, anyone who knows your password can sign in. Your backup codes stop working.</InfoAlert>
        <Field
          id={`${uid}-password`}
          label="Current password"
          type="password"
          autoComplete="current-password"
          value={password}
          error={error}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && confirm()}
        />
      </div>
    </Modal>
  );
};

/* ── View / regenerate backup codes ──────────────────────────────── */

interface BackupCodesModalProps {
  regenerate: boolean;
  remaining: number;
  onRegenerated: () => void;
  onClose: () => void;
}

/** "View codes" asks for the password first (codes are never shown without it); regenerating confirms first. */
export const BackupCodesModal: React.FC<BackupCodesModalProps> = ({ regenerate, remaining, onRegenerated, onClose }) => {
  const uid = useId();
  const [stage, setStage] = useState<'confirm' | 'codes'>('confirm');
  const [generation, setGeneration] = useState(0);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const codes = useMemo(() => backupCodes(generation), [generation]);

  const proceed = () => {
    if (!password) return setError('Enter your current password');
    if (regenerate) {
      setGeneration(1);
      onRegenerated();
    }
    setStage('codes');
  };

  return (
    <Modal
      title={regenerate ? (stage === 'confirm' ? 'Generate new backup codes?' : 'Your new backup codes') : 'Backup codes'}
      role={regenerate && stage === 'confirm' ? 'alertdialog' : 'dialog'}
      description={
        stage === 'confirm'
          ? regenerate
            ? `Your ${remaining} remaining codes stop working straight away.`
            : 'Enter your password to see your codes.'
          : regenerate
            ? '10 new codes. Store them somewhere safe.'
            : `${remaining} of 10 remaining. Used codes are crossed out.`
      }
      onClose={onClose}
      footer={
        stage === 'confirm' ? (
          <>
            <button type="button" onClick={onClose} className={BUTTON.secondary}>
              Cancel
            </button>
            <button type="button" onClick={proceed} className={regenerate ? BUTTON.destructive : BUTTON.primary}>
              {regenerate ? 'Generate new codes' : 'Show codes'}
            </button>
          </>
        ) : (
          <button type="button" onClick={onClose} className={BUTTON.primary}>
            Done
          </button>
        )
      }
    >
      {stage === 'confirm' ? (
        <Field
          id={`${uid}-password`}
          label="Current password"
          type="password"
          autoComplete="current-password"
          value={password}
          error={error}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && proceed()}
        />
      ) : (
        <CodeGrid codes={codes} used={regenerate ? 0 : 10 - remaining} />
      )}
    </Modal>
  );
};
