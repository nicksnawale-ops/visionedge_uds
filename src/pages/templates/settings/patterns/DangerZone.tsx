import React, { useId } from 'react';

export interface DangerAction {
  label: string;
  description: string;
  /** The Destructive button (hidden for viewers by the caller). */
  action?: React.ReactNode;
}

/** Danger zone card: 1px Gray 200 border with a 4px Gray 900 left bar; one row per irreversible action. */
export const DangerZone: React.FC<{ actions: DangerAction[]; overlay?: React.ReactNode; settingId?: string }> = ({ actions, overlay, settingId }) => {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      data-setting-id={settingId}
      tabIndex={settingId ? -1 : undefined}
      className="relative bg-white rounded-[12px] border border-[#DDE2EA] border-l-4 border-l-[#121722] outline-none scroll-mt-24"
    >
      {overlay}
      <div className="px-4 @min-[768px]:px-6 py-5 border-b border-[#DDE2EA]">
        <h4 id={titleId} className="text-[16px] leading-[24px] font-semibold text-[#121722]">
          Danger zone
        </h4>
        <p className="mt-0.5 text-[12px] leading-[16px] text-[#6B7485]">These actions can’t be undone. Each one asks you to confirm.</p>
      </div>
      <ul className="divide-y divide-[#DDE2EA]">
        {actions.map((a) => (
          <li key={a.label} className="px-4 @min-[768px]:px-6 py-5 flex flex-col @min-[640px]:flex-row @min-[640px]:items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[14px] leading-[20px] font-medium text-[#121722]">{a.label}</p>
              <p className="text-[12px] leading-[16px] text-[#4B5465]">{a.description}</p>
            </div>
            {a.action}
          </li>
        ))}
      </ul>
    </section>
  );
};
