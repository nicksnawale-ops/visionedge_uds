import React, { useId, useState } from 'react';
import { ChevronDown, Copy } from 'lucide-react';
import { useToast } from '../../../components/common/Toast';
import { BUTTON } from '../dashboard/primitives';
import { DEMO_DETAILS } from './errorTypes';

interface TechnicalDetailsProps {
  /** "503" or a label such as "CAN'T CONNECT". */
  code: string;
  path: string;
}

/**
 * "Technical details" disclosure, collapsed by default: what support needs (code, request ID, time, path),
 * never stack traces, hostnames or IPs.
 */
export const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({ code, path }) => {
  const id = useId();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const rows: [string, string][] = [
    ['Error code', code],
    ['Request ID', DEMO_DETAILS.requestId],
    ['Time', DEMO_DETAILS.time],
    ['Path', path],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API blocked (e.g. insecure context): fall back to a hidden textarea.
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    showToast('Details copied', 'success');
  };

  return (
    <div className="w-full">
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} className={BUTTON.ghostSm}>
        Technical details
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <div id={id} hidden={!open} className="mt-3 text-left">
        <div className="rounded-[8px] bg-[#F7F9FC] border border-[#DDE2EA] p-4">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[12px] leading-[18px]">
            {rows.map(([k, v]) => (
              <React.Fragment key={k}>
                <dt className="text-[#4B5465]">{k}</dt>
                <dd className="text-[#121722] break-all">{v}</dd>
              </React.Fragment>
            ))}
          </dl>
          <button type="button" onClick={copy} className={`${BUTTON.ghostSm} mt-2 -ml-3`}>
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            Copy details
          </button>
        </div>
      </div>
    </div>
  );
};
