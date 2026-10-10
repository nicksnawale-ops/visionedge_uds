import React from 'react';
import { PreviewPanel } from '../../../components/common/PreviewPanel';

interface ExampleFrameProps {
  title: string;
  /** One line: "Use when…". */
  useWhen: string;
  code: string;
  children: React.ReactNode;
  /** Max width of the preview content (default 760px). */
  maxWidth?: string;
}

/** Live preview on the dotted canvas (shared PreviewPanel, read-only), a copyable snippet and a "Use when…" note. */
export const ExampleFrame: React.FC<ExampleFrameProps> = ({ title, useWhen, code, children, maxWidth = 'max-w-[760px]' }) => (
  <div className="space-y-2">
    <PreviewPanel title={title} defaultCode={code} defaultChildren={<div className={`w-full ${maxWidth} text-left`}>{children}</div>} />
    <p className="text-[13px] leading-[20px] text-[#4B5465]">
      <span className="font-semibold text-[#121722]">Use when: </span>
      {useWhen}
    </p>
  </div>
);
