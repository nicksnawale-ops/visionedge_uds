import React from 'react';
import { Check, X } from 'lucide-react';

interface DoDontItemProps {
  type: 'do' | 'dont';
  title: string;
  description: string;
  example: React.ReactNode;
}

export const DoDontItem: React.FC<DoDontItemProps> = ({ type, title, description, example }) => {
  const isDo = type === 'do';

  return (
    <div className="flex-1 min-w-[280px] rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden shadow-[0_1px_3px_rgba(11,45,107,0.08)] flex flex-col">
      {/* 4px Top Bar: Cyan for Do, #121722 for Don't */}
      <div className={`h-1 w-full ${isDo ? 'bg-[#00C6FF]' : 'bg-[#121722]'}`} />

      {/* Mini Visual Example Container */}
      <div className="p-4 bg-[#F7F9FC] border-b border-[#DDE2EA] flex items-center justify-center min-h-[120px]">
        {example}
      </div>

      {/* Text Guidance */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <div className="flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              isDo ? 'bg-[#00C6FF]/15 text-[#0B2D6B]' : 'bg-[#121722]/10 text-[#121722]'
            }`}
          >
            {isDo ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
          </div>
          <h4 className="text-[14px] font-semibold text-[#121722]">{title}</h4>
        </div>
        <p className="text-[13px] text-[#4B5465] leading-relaxed pl-7">{description}</p>
      </div>
    </div>
  );
};

interface DoDontPairProps {
  doTitle?: string;
  doDescription: string;
  doExample: React.ReactNode;
  dontTitle?: string;
  dontDescription: string;
  dontExample: React.ReactNode;
  className?: string;
}

export const DoDontPair: React.FC<DoDontPairProps> = ({
  doTitle = 'Do',
  doDescription,
  doExample,
  dontTitle = "Don't",
  dontDescription,
  dontExample,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 my-6 ${className}`}>
      <DoDontItem
        type="do"
        title={doTitle}
        description={doDescription}
        example={doExample}
      />
      <DoDontItem
        type="dont"
        title={dontTitle}
        description={dontDescription}
        example={dontExample}
      />
    </div>
  );
};
