import React, { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { StatusIcon } from '../../../shared/authUi';
import { BUTTON } from '../../../profile/ui';
import { IMPORT_COUNTS, IMPORT_FILE } from '../../data/importSample';

/** Step 5 — Done: summary + View imported records + Import another file. */
export const DoneStep: React.FC<{ onAnother: () => void; cancelledAt?: number }> = ({ onAnother, cancelledAt }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus({ preventScroll: true }), []);
  const imported = cancelledAt ? Math.round((IMPORT_COUNTS.ready * cancelledAt) / 100) : IMPORT_COUNTS.ready;
  return (
    <div className="bg-white rounded-[12px] border border-[#DDE2EA] p-8 flex flex-col items-center text-center">
      <StatusIcon icon={CheckCircle2} tone="cyan" />
      <h2 ref={ref} tabIndex={-1} className="text-[20px] leading-[28px] font-semibold text-[#121722] outline-none">
        {cancelledAt ? 'Import cancelled' : 'Import complete'}
      </h2>
      <p className="mt-2 max-w-[420px] text-[14px] leading-[20px] text-[#4B5465]">
        {imported} records from <span className="font-mono">{IMPORT_FILE.name}</span> were imported.
        {cancelledAt ? ' The rest were not imported.' : ` ${IMPORT_COUNTS.errors + IMPORT_COUNTS.duplicates} rows were skipped and are listed in the error report.`}
      </p>
      <dl className="mt-6 grid grid-cols-3 gap-6">
        {[
          ['Imported', imported],
          ['Skipped', cancelledAt ? IMPORT_FILE.rows - imported : IMPORT_COUNTS.errors + IMPORT_COUNTS.duplicates],
          ['In file', IMPORT_FILE.rows],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">{k}</dt>
            <dd className="mt-0.5 text-[20px] font-semibold text-[#121722] tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 w-full flex flex-col @min-[480px]:flex-row @min-[480px]:justify-center gap-2 [&>*]:w-full @min-[480px]:[&>*]:w-auto">
        <a href="#records" onClick={(e) => e.preventDefault()} className={BUTTON.primary}>
          View imported records
        </a>
        <button type="button" onClick={onAnother} className={BUTTON.secondary}>
          Import another file
        </button>
      </div>
    </div>
  );
};
