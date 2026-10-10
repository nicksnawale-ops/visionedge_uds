import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from './Toast';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'tsx',
  filename,
  className = '',
}) => {
  const { copyToClipboard } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(code, 'Code snippet');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-[8px] border border-[#DDE2EA] bg-[#F7F9FC] overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#DDE2EA] bg-[#EEF1F6]/50 text-[12px] font-mono text-[#4B5465]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C3CAD5]" />
          <span>{filename || language.toUpperCase()}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium text-[#1E63FF] hover:text-[#0B2D6B] hover:bg-white rounded transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#00C6FF]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy code'}</span>
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-[13px] leading-[20px] font-mono text-[#121722]">
        <pre className="selection:bg-[#DBEAFE] selection:text-[#0B2D6B]">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
