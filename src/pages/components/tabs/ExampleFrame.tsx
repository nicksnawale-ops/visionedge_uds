import React from 'react';
import { PreviewPanel } from '../../../components/common/PreviewPanel';

interface ExampleFrameProps {
  title: string;
  /** One line: "Use when…". */
  useWhen: string;
  code: string;
  children: React.ReactNode;
  /** Remove the white card (e.g. dark-surface examples bring their own background). */
  bare?: boolean;
}

/** Live preview on the dotted canvas (shared PreviewPanel), a copyable snippet and a "Use when…" note. */
export const ExampleFrame: React.FC<ExampleFrameProps> = ({ title, useWhen, code, children, bare = false }) => (
  <div className="space-y-2">
    <PreviewPanel
      title={title}
      defaultCode={code}
      defaultChildren={<div className={`w-full max-w-[760px] text-left ${bare ? '' : 'bg-white rounded-[12px] border border-[#DDE2EA] p-5'}`}>{children}</div>}
    />
    <p className="text-[13px] leading-[20px] text-[#4B5465]">
      <span className="font-semibold text-[#121722]">Use when: </span>
      {useWhen}
    </p>
  </div>
);
