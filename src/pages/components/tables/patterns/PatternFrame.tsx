import React from 'react';
import { PreviewPanel } from '../../../../components/common/PreviewPanel';

interface PatternFrameProps {
  title: string;
  code: string;
  /** One line, shown under the preview. */
  useWhen: string;
  children: React.ReactNode;
}

/** Live preview on the dotted canvas with Preview / Code (shared PreviewPanel, read-only) and a "Use when…" note. */
export const PatternFrame: React.FC<PatternFrameProps> = ({ title, code, useWhen, children }) => (
  <div className="space-y-2">
    <PreviewPanel title={title} defaultCode={code} defaultChildren={<div className="w-full min-w-0 max-w-full">{children}</div>} canvasClassName="items-start! p-4! md:p-6!" />
    <p className="text-[13px] leading-[20px] text-[#4B5465]">
      <span className="font-semibold text-[#121722]">Use when: </span>
      {useWhen}
    </p>
  </div>
);
