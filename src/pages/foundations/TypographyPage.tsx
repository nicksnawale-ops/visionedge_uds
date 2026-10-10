import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { TYPOGRAPHY_SPECIMENS } from '../../theme/tokens';
import { useToast } from '../../components/common/Toast';
import { DoDontPair } from '../../components/common/DoDont';
import { Copy, Check, Type, Hash, Clock, Calendar } from 'lucide-react';

export const TypographyPage: React.FC = () => {
  const { copyToClipboard } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyClass = (tailwind: string, idx: number) => {
    copyToClipboard(tailwind, 'Tailwind classes');
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div>
      <PageHeader
        category="FOUNDATIONS"
        title="Typography"
        description="A strict typographic system optimized for high-density IoT operational dashboards, video monitoring, and rapid numerical scanning."
      />

      {/* Font Family Stacks */}
      <section id="font-stacks" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Font Family Stacks
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            VisionEdge enforces exactly two fonts: Inter for clean UI structure and JetBrains Mono for telemetry, IDs, and raw event logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Interface Font */}
          <div className="p-6 rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                INTERFACE SANS STACK
              </span>
              <span className="text-[12px] font-mono text-[#1E63FF] bg-[#1E63FF]/[0.08] px-2 py-0.5 rounded">
                Inter
              </span>
            </div>
            <h3 className="text-[22px] font-semibold text-[#121722] mb-2 font-sans">
              Inter Display &amp; UI
            </h3>
            <p className="text-[13px] text-[#4B5465] leading-relaxed mb-4">
              Loaded weights: 400 (Regular), 500 (Medium), 600 (SemiBold), and 700 (Bold). No italics. Highly legibile x-height designed for computer displays.
            </p>
            <div className="p-3 bg-[#F7F9FC] rounded-[8px] border border-[#DDE2EA]">
              <code className="text-[12px] font-mono text-[#121722] block break-all">
                font-family: &quot;Inter&quot;, &quot;Segoe UI&quot;, Roboto, Arial, sans-serif;
              </code>
            </div>
          </div>

          {/* Data Font */}
          <div className="p-6 rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                DATA MONOSPACE STACK
              </span>
              <span className="text-[12px] font-mono text-[#1E63FF] bg-[#1E63FF]/[0.08] px-2 py-0.5 rounded">
                JetBrains Mono
              </span>
            </div>
            <h3 className="text-[22px] font-semibold text-[#121722] mb-2 font-mono">
              JetBrains Mono Data
            </h3>
            <p className="text-[13px] text-[#4B5465] leading-relaxed mb-4">
              Loaded weights: 400 and 500. Applied strictly for license plates, student RFID badges, sensor values, camera identifiers, and raw timestamps.
            </p>
            <div className="p-3 bg-[#F7F9FC] rounded-[8px] border border-[#DDE2EA]">
              <code className="text-[12px] font-mono text-[#121722] block break-all">
                font-family: &quot;JetBrains Mono&quot;, Consolas, &quot;Courier New&quot;, monospace;
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Type Scale Specimens */}
      <section id="type-scale" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Type Scale Specimens
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Live interactive specimens on pure white. Click &ldquo;Copy classes&rdquo; on any row to copy the exact Tailwind styling.
          </p>
        </div>

        <div className="space-y-4">
          {TYPOGRAPHY_SPECIMENS.map((item, idx) => (
            <div
              key={item.name}
              className="p-5 rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.04)] hover:border-[#1E63FF] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: Spec and Name */}
              <div className="w-full md:w-56 shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[15px] font-semibold text-[#121722]">
                    {item.name}
                  </span>
                  {item.font === 'JetBrains Mono' && (
                    <span className="text-[10px] font-mono font-bold bg-[#1E63FF]/10 text-[#1E63FF] px-1.5 py-0.5 rounded">
                      MONO
                    </span>
                  )}
                </div>
                <div className="text-[12px] font-mono text-[#6B7485] space-y-0.5">
                  <div>
                    {item.size} / {item.lineHeight} · {item.weight}
                  </div>
                  <div className="text-[11px] text-[#8C95A6]">{item.use}</div>
                </div>
              </div>

              {/* Center Column: Live Sample Render */}
              <div className="flex-1 min-w-0 py-1">
                <div className={item.tailwind}>
                  {item.sample}
                </div>
              </div>

              {/* Right Column: Copy button */}
              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => handleCopyClass(item.tailwind, idx)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#1E63FF] bg-[#F7F9FC] border border-[#DDE2EA] rounded-[6px] hover:bg-white hover:border-[#1E63FF] transition-colors"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-[#00C6FF]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedIndex === idx ? 'Copied' : 'Copy classes'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strict Typographic Rules */}
      <section id="typographic-rules" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Formatting &amp; Alignment Rules
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Engineering guidelines governing text behavior across forms, dashboards, and reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
            <div className="w-8 h-8 rounded-[6px] bg-[#EEF1F6] flex items-center justify-center text-[#1E63FF] mb-3">
              <Hash className="w-4 h-4" />
            </div>
            <h3 className="text-[15px] font-semibold text-[#121722] mb-1">
              Tabular Figures
            </h3>
            <p className="text-[13px] text-[#4B5465] leading-relaxed mb-3">
              All numbers in tables, metrics, and counters must use <code className="text-[#121722] font-mono">tabular-nums</code> to preserve vertical decimal alignment and prevent jitter during live updates.
            </p>
            <div className="p-2.5 rounded bg-[#F7F9FC] border border-[#DDE2EA] font-mono text-[13px] text-right text-[#121722] tabular-nums">
              $14,290.50<br />
              $08,120.00
            </div>
          </div>

          <div className="p-5 rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
            <div className="w-8 h-8 rounded-[6px] bg-[#EEF1F6] flex items-center justify-center text-[#1E63FF] mb-3">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-[15px] font-semibold text-[#121722] mb-1">
              Consistent Date Formats
            </h3>
            <p className="text-[13px] text-[#4B5465] leading-relaxed mb-3">
              Dates must always follow the day-month-year pattern with 3-letter month: <code className="text-[#121722] font-mono">30 Sep 2026</code>. Never use numeric ambiguous slashes (09/30/2026).
            </p>
            <div className="p-2.5 rounded bg-[#F7F9FC] border border-[#DDE2EA] text-[13px] text-[#121722]">
              Entry: <span className="font-medium">30 Sep 2026</span>
            </div>
          </div>

          <div className="p-5 rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
            <div className="w-8 h-8 rounded-[6px] bg-[#EEF1F6] flex items-center justify-center text-[#1E63FF] mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-[15px] font-semibold text-[#121722] mb-1">
              Time Formatting
            </h3>
            <p className="text-[13px] text-[#4B5465] leading-relaxed mb-3">
              Raw sensor and event logs use 24-hour military precision: <code className="text-[#121722] font-mono">14:05:32</code>. User-facing notifications use standard 12-hour: <code className="text-[#121722] font-mono">2:05 PM</code>.
            </p>
            <div className="p-2.5 rounded bg-[#F7F9FC] border border-[#DDE2EA] font-mono text-[12px] text-[#121722]">
              Log: 14:05:32.480 UTC
            </div>
          </div>
        </div>
      </section>

      {/* Do & Don't Guidelines */}
      <section id="do-dont">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Typography Guidelines
        </h2>
        <DoDontPair
          doTitle="Do use Sentence Case for all titles & buttons"
          doDescription="Use sentence case for headings, table labels, and actions: 'Add vehicle record', 'Export attendance report'."
          doExample={
            <span className="text-[15px] font-semibold text-[#121722]">
              Register new parking permit
            </span>
          }
          dontTitle="Don't use Title Case or All-Caps for actions"
          dontDescription="Avoid capitalizing every word or shouting in full uppercase ('REGISTER NEW PARKING PERMIT'). Only Overlines use uppercase."
          dontExample={
            <span className="text-[15px] font-semibold text-[#121722]">
              REGISTER NEW PARKING PERMIT
            </span>
          }
        />

        <DoDontPair
          doTitle="Do format license plates & hardware IDs with JetBrains Mono"
          doDescription="JetBrains Mono disambiguates letters and numbers (O vs 0, I vs 1, S vs 5) ensuring zero operator errors during gate dispatch."
          doExample={
            <code className="font-mono text-[14px] font-semibold bg-[#F7F9FC] px-2.5 py-1 rounded border border-[#DDE2EA] text-[#121722]">
              DL-01-AB-1290
            </code>
          }
          dontTitle="Don't use proportional Sans-serif for alphanumeric codes"
          dontDescription="Proportional sans characters can easily cause false plate misidentification in high-speed access control logs."
          dontExample={
            <span className="font-sans text-[14px] bg-[#F7F9FC] px-2.5 py-1 rounded border border-[#DDE2EA] text-[#121722]">
              DL-01-AB-1290
            </span>
          }
        />
      </section>
    </div>
  );
};
