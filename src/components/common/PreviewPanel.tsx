import React, { useState } from 'react';
import { CodeBlock } from './CodeBlock';
import { Eye, Code2 } from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  component: React.ReactNode;
  code: string;
}

interface PreviewPanelProps {
  title?: string;
  tabs?: TabItem[];
  defaultChildren?: React.ReactNode;
  defaultCode?: string;
  className?: string;
  canvasClassName?: string;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  title,
  tabs,
  defaultChildren,
  defaultCode = '',
  className = '',
  canvasClassName = '',
}) => {
  const [activeTabId, setActiveTabId] = useState<string>(tabs && tabs.length > 0 ? tabs[0].id : 'preview');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const currentTab = tabs ? tabs.find((t) => t.id === activeTabId) || tabs[0] : null;

  return (
    <div className={`rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden shadow-[0_1px_3px_rgba(11,45,107,0.08)] ${className}`}>
      {/* Top Bar with Variant Tabs & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#DDE2EA] bg-[#F7F9FC] px-4 py-2 gap-3">
        {title && (
          <span className="text-[14px] font-semibold text-[#121722]">{title}</span>
        )}

        {/* Variant / State Tabs */}
        {tabs && tabs.length > 1 && (
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTabId(tab.id);
                  }}
                  className={`px-3 py-1.5 text-[14px] font-medium transition-all relative whitespace-nowrap ${
                    isActive
                      ? 'text-[#1E63FF] font-semibold'
                      : 'text-[#4B5465] hover:text-[#121722]'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-[#1E63FF]" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Preview vs Code Toggle */}
        <div className="flex items-center p-0.5 bg-[#EEF1F6] rounded-[6px] ml-auto border border-[#DDE2EA]">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded transition-colors ${
              viewMode === 'preview'
                ? 'bg-white text-[#121722] shadow-sm font-semibold'
                : 'text-[#4B5465] hover:text-[#121722]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded transition-colors ${
              viewMode === 'code'
                ? 'bg-white text-[#121722] shadow-sm font-semibold'
                : 'text-[#4B5465] hover:text-[#121722]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'preview' ? (
        <div
          className={`preview-grid-canvas p-6 md:p-8 flex items-center justify-center min-h-[220px] transition-all overflow-x-auto ${canvasClassName}`}
        >
          <div className="w-full flex items-center justify-center">
            {currentTab ? currentTab.component : defaultChildren}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-[#F7F9FC]">
          <CodeBlock code={currentTab ? currentTab.code : defaultCode} />
        </div>
      )}
    </div>
  );
};
