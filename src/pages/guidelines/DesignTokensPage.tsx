import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { CodeBlock } from '../../components/common/CodeBlock';
import { CSS_TOKENS_RAW, JSON_TOKENS } from '../../theme/tokens';
import { useToast } from '../../components/common/Toast';
import { Download, Copy, Check, FileCode, FileJson, Layers } from 'lucide-react';

export const DesignTokensPage: React.FC = () => {
  const { showToast, copyToClipboard } = useToast();
  const [activeTab, setActiveTab] = useState<'css' | 'json' | 'tailwind'>('css');

  const TAILWIND_SNIPPET = `// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        ve: {
          navy: 'var(--ve-deep-navy)',
          blue: 'var(--ve-royal-blue)',
          cyan: 'var(--ve-cyan)',
          white: 'var(--ve-white)',
          gray50: 'var(--ve-gray-50)',
          gray100: 'var(--ve-gray-100)',
          gray200: 'var(--ve-gray-200)',
          gray300: 'var(--ve-gray-300)',
          gray400: 'var(--ve-gray-400)',
          gray500: 'var(--ve-gray-500)',
          gray600: 'var(--ve-gray-600)',
          gray700: 'var(--ve-gray-700)',
          gray800: 'var(--ve-gray-800)',
          gray900: 'var(--ve-gray-900)',
          black: 'var(--ve-black)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '999px',
      },
      boxShadow: {
        elevation1: '0 1px 3px rgba(11, 45, 107, 0.08)',
        elevation2: '0 4px 12px rgba(11, 45, 107, 0.12)',
        elevation3: '0 12px 32px rgba(11, 45, 107, 0.18)',
      }
    }
  }
};`;

  const handleDownload = () => {
    let content = CSS_TOKENS_RAW;
    let filename = 'visionedge-tokens.css';
    let mime = 'text/css';

    if (activeTab === 'json') {
      content = JSON.stringify(JSON_TOKENS, null, 2);
      filename = 'visionedge-tokens.json';
      mime = 'application/json';
    } else if (activeTab === 'tailwind') {
      content = TAILWIND_SNIPPET;
      filename = 'tailwind.config.ts';
      mime = 'application/typescript';
    }

    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
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
    <div>
      <PageHeader
        category="GUIDELINES"
        title="Design Tokens"
        description="Machine-readable design tokens for developers. Seamlessly consume VisionEdge standards in pure CSS variables, structured JSON schemas, or Tailwind configurations."
        updatedBadge
      />

      {/* Download and Tab Actions */}
      <section id="tokens-export" className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          {/* Format Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#EEF1F6] rounded-[8px] border border-[#DDE2EA] self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('css')}
              className={`flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium rounded-[6px] transition-colors ${
                activeTab === 'css'
                  ? 'bg-white text-[#1E63FF] font-semibold shadow-sm'
                  : 'text-[#4B5465] hover:text-[#121722]'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>CSS Variables</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium rounded-[6px] transition-colors ${
                activeTab === 'json'
                  ? 'bg-white text-[#1E63FF] font-semibold shadow-sm'
                  : 'text-[#4B5465] hover:text-[#121722]'
              }`}
            >
              <FileJson className="w-4 h-4" />
              <span>JSON Schema</span>
            </button>
            <button
              onClick={() => setActiveTab('tailwind')}
              className={`flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium rounded-[6px] transition-colors ${
                activeTab === 'tailwind'
                  ? 'bg-white text-[#1E63FF] font-semibold shadow-sm'
                  : 'text-[#4B5465] hover:text-[#121722]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Tailwind Config</span>
            </button>
          </div>

          {/* Download File Button */}
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E63FF] text-white rounded-[8px] font-semibold text-[13px] hover:bg-[#0B2D6B] transition-colors shadow-sm self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download {activeTab.toUpperCase()}</span>
          </button>
        </div>

        {/* Code Block Viewer */}
        {activeTab === 'css' && (
          <CodeBlock
            code={CSS_TOKENS_RAW}
            language="css"
            filename="src/index.css"
          />
        )}

        {activeTab === 'json' && (
          <CodeBlock
            code={JSON.stringify(JSON_TOKENS, null, 2)}
            language="json"
            filename="visionedge-tokens.json"
          />
        )}

        {activeTab === 'tailwind' && (
          <CodeBlock
            code={TAILWIND_SNIPPET}
            language="typescript"
            filename="tailwind.config.ts"
          />
        )}
      </section>

      {/* Integration Guide */}
      <section id="integration" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-3">
          Developer Integration Instructions
        </h2>
        <div className="space-y-4 text-[14px] text-[#353D4C] leading-relaxed">
          <p>
            1. <strong>Global CSS:</strong> Paste the <code className="font-mono text-[#1E63FF]">:root</code> variables block directly into your root stylesheet. All variables are prefixed with <code className="font-mono text-[#121722]">--ve-</code> to avoid collision with third-party libraries.
          </p>
          <p>
            2. <strong>Light Theme Enforced:</strong> The root element must specify <code className="font-mono text-[#121722]">background: #FFFFFF</code> and <code className="font-mono text-[#121722]">color: #353D4C</code>. Never add <code className="font-mono text-[#121722]">class=&quot;dark&quot;</code> or dark-mode conditional tokens.
          </p>
          <p>
            3. <strong>Arbitrary Tailwind Utility:</strong> You can apply tokens directly in JSX with Tailwind arbitrary values, e.g. <code className="font-mono text-[#1E63FF]">bg-[#0B2D6B]</code>, <code className="font-mono text-[#1E63FF]">text-[#1E63FF]</code>, or configure custom theme extensions.
          </p>
        </div>
      </section>
    </div>
  );
};
