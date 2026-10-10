import React from 'react';
import { PreviewPanel } from '../../../../components/common/PreviewPanel';
import { PICKER_TYPES, TYPE_DETAILS } from '../pickersSpec';
import { SNIPPETS } from '../snippets';
import { DEMOS } from './demos';

/** The six picker types, each with a live example, its rules and copyable code. */
export const PickerTypes: React.FC = () => (
  <div className="flex flex-col gap-10">
    {PICKER_TYPES.map((t, i) => {
      const Demo = DEMOS[t.id];
      const detail = TYPE_DETAILS[t.id];
      return (
        <article key={t.id} aria-labelledby={`type-${t.id}`} className="flex flex-col gap-3">
          <h3 id={`type-${t.id}`} className="text-[16px] leading-[24px] font-semibold text-[#121722]">
            {i + 1}. {detail.title}
          </h3>
          <ul className="list-disc pl-5 text-[14px] leading-[20px] text-[#353D4C] space-y-1 max-w-3xl">
            {detail.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <PreviewPanel defaultChildren={<Demo />} defaultCode={SNIPPETS[t.id]} canvasClassName="min-h-[200px]" />
        </article>
      );
    })}
  </div>
);
