import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { PreviewPanel } from '../../../../components/common/PreviewPanel';
import { PICKER_TYPES, type PickerType } from '../pickersSpec';
import { SNIPPETS } from '../snippets';
import { FOCUS } from '../ui/styles';
import { DEMOS } from './demos';

/** Pill-chip switcher for the 6 types, live preview on the dotted canvas, Preview / Code, and a "Use when…" note. */
export const PickerShowcase: React.FC = () => {
  const [type, setType] = useState<PickerType>('range');
  const current = PICKER_TYPES.find((t) => t.id === type) ?? PICKER_TYPES[0];
  const Demo = DEMOS[type];
  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="Picker type" className="flex flex-wrap gap-2">
        {PICKER_TYPES.map((t) => {
          const on = t.id === type;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={on}
              onClick={() => setType(t.id)}
              className={`h-8 max-md:h-10 px-3.5 rounded-full border text-[14px] transition-colors ${FOCUS} ${
                on ? 'border-[#1E63FF] bg-[#1E63FF]/[0.08] text-[#1E63FF] font-semibold' : 'border-[#DDE2EA] bg-white text-[#353D4C] hover:bg-[#EEF1F6]'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <PreviewPanel title={current.label} defaultChildren={<Demo key={type} />} defaultCode={SNIPPETS[type]} canvasClassName="min-h-[260px]" />
      <p className="flex items-start gap-2 text-[14px] leading-[20px] text-[#353D4C]">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-[#1E63FF]" aria-hidden="true" />
        {current.useWhen}
      </p>
    </div>
  );
};
