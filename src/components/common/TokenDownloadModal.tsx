import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, FileJson } from 'lucide-react';
import { CSS_TOKENS_RAW, JSON_TOKENS } from '../../theme/tokens';
import { useToast } from './Toast';

interface TokenDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TokenDownloadModal: React.FC<TokenDownloadModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'css' | 'json'>('css');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const jsonString = JSON.stringify(JSON_TOKENS, null, 2);
  const content = activeTab === 'css' ? CSS_TOKENS_RAW : jsonString;
  const filename = activeTab === 'css' ? 'visionedge-tokens.css' : 'visionedge-tokens.json';

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    showToast(`Copied ${filename} to clipboard`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], {
      type: activeTab === 'css' ? 'text/css;charset=utf-8' : 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 50% Black Scrim */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-white rounded-[16px] border border-[#DDE2EA] shadow-[0_12px_32px_rgba(11,45,107,0.18)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDE2EA]">
          <div className="flex items-center gap-2">
            <h3 className="text-[18px] font-semibold text-[#121722]">
              Download VisionEdge Design Tokens
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B7485] hover:text-[#121722] p-1.5 rounded-[6px] hover:bg-[#F7F9FC] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#DDE2EA] bg-[#F7F9FC]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('css')}
              className={`flex items-center gap-2 px-3 py-1.5 text-[14px] font-medium rounded-[6px] transition-colors ${
                activeTab === 'css'
                  ? 'bg-white text-[#1E63FF] shadow-sm border border-[#DDE2EA]'
                  : 'text-[#4B5465] hover:text-[#121722]'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>CSS Variables (.css)</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-2 px-3 py-1.5 text-[14px] font-medium rounded-[6px] transition-colors ${
                activeTab === 'json'
                  ? 'bg-white text-[#1E63FF] shadow-sm border border-[#DDE2EA]'
                  : 'text-[#4B5465] hover:text-[#121722]'
              }`}
            >
              <FileJson className="w-4 h-4" />
              <span>JSON Tokens (.json)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#1E63FF] bg-white border border-[#DDE2EA] rounded-[6px] hover:bg-[#F7F9FC] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00C6FF]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-white bg-[#1E63FF] rounded-[6px] hover:bg-[#0B2D6B] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="p-6 bg-[#F7F9FC] max-h-[380px] overflow-y-auto">
          <pre className="text-[12px] leading-relaxed font-mono text-[#121722] bg-white p-4 rounded-[8px] border border-[#DDE2EA] overflow-x-auto">
            <code>{content}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#DDE2EA] bg-white text-[12px] text-[#4B5465]">
          <span>Includes colors, typography scale, 4px spacing grid, radius, and shadows.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-[13px] font-medium text-[#4B5465] hover:text-[#121722] rounded-[6px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
