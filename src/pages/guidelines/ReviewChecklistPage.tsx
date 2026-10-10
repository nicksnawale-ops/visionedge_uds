import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useToast } from '../../components/common/Toast';
import { CheckSquare, RotateCcw, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'chk-colors',
    category: 'Visual & Tokens',
    title: 'Closed Palette Enforcement',
    description: 'Only official palette colors used (Deep Navy, Royal Blue, Cyan, 11 neutrals). Zero unauthorized arbitrary hues or dark mode backgrounds.',
  },
  {
    id: 'chk-primary-btn',
    category: 'Actions & Buttons',
    title: 'Single Primary Button Rule',
    description: 'Exactly one Primary button per screen view. All action buttons use 1–3 word verb-first labels (no generic "OK", "Yes", or "Click here").',
  },
  {
    id: 'chk-typography',
    category: 'Typography',
    title: 'Strict Hierarchy & Sentence Case',
    description: 'Exactly one H1 per page. All headings and actions written in sentence case. No italics. 400/500/600/700 weights only.',
  },
  {
    id: 'chk-data-mono',
    category: 'Typography',
    title: 'JetBrains Mono Data Formatting',
    description: 'All license plates, student RFID IDs, camera identifiers, and raw sensor timestamps use JetBrains Mono Data style with tabular numbers.',
  },
  {
    id: 'chk-spacing',
    category: 'Spatial Math',
    title: '4px Grid Discipline',
    description: 'Every padding, margin, and gap is an exact multiple of 4px (4, 8, 12, 16, 24, 32, 48, 64px). Container padding ≥ child gap.',
  },
  {
    id: 'chk-contrast',
    category: 'Accessibility',
    title: 'WCAG 2.2 AA Contrast Compliance',
    description: 'All text meets at least 4.5:1 contrast against its background. Absolutely zero Cyan text or icons on white (which fails at 2.0:1).',
  },
  {
    id: 'chk-no-color-alone',
    category: 'Accessibility',
    title: 'Non-Color State Signaling',
    description: 'Status badges and alerts combine color with explicit text and an accompanying icon for color-blind accessibility.',
  },
  {
    id: 'chk-focus-rings',
    category: 'Accessibility',
    title: 'Visible Focus Outlines Everywhere',
    description: 'All buttons, links, inputs, and tabs show 2px focus outlines with 2px offsets on keyboard navigation. Never remove outline-none blindly.',
  },
  {
    id: 'chk-form-labels',
    category: 'Forms & Inputs',
    title: 'Persistent Input Labels & Constructive Errors',
    description: 'Labels are placed above inputs (never placeholder-as-label). Error text clearly states how to fix the error (e.g. "Enter 10-digit number").',
  },
  {
    id: 'chk-responsive-zoom',
    category: 'Responsive & QA',
    title: 'Mobile, Tablet, Desktop & 200% Zoom',
    description: 'Verified at mobile (4 cols, bottom nav/drawer), tablet (8 cols, 72px sidebar rail), desktop (12 cols), and 200% browser zoom with zero clipping.',
  },
  {
    id: 'chk-states-complete',
    category: 'Responsive & QA',
    title: 'Complete State Design (Empty, Loading, Error)',
    description: 'Tables and data cards include designed skeleton loading states, constructive empty states, and failover error banners.',
  },
];

export const ReviewChecklistPage: React.FC = () => {
  const { showToast } = useToast();
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ve_audit_checklist');
      return saved ? JSON.parse(saved) : ['chk-colors', 'chk-contrast'];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ve_audit_checklist', JSON.stringify(checkedIds));
  }, [checkedIds]);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setCheckedIds([]);
    showToast('Checklist progress reset', 'info');
  };

  const completedCount = checkedIds.length;
  const totalCount = CHECKLIST_ITEMS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div>
      <PageHeader
        category="GUIDELINES"
        title="Review Checklist"
        description="Interactive QA checklist for designers and front-end developers. Audit your view against VisionEdge enterprise standards before merging code."
      />

      {/* Progress Dashboard Card */}
      <section id="progress-card" className="mb-10">
        <div className="rounded-[16px] border border-[#DDE2EA] bg-white p-6 md:p-8 shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDE2EA] mb-6 gap-3">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] block">
                COMPLIANCE SCORECARD
              </span>
              <h3 className="text-[20px] font-semibold text-[#121722] mt-0.5">
                Design System Audit Progress
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[28px] font-bold text-[#0B2D6B] font-mono tabular-nums">
                {progressPercent}%
              </span>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#4B5465] hover:text-[#121722] bg-[#F7F9FC] border border-[#DDE2EA] rounded-[6px] hover:bg-white transition-colors"
                title="Reset all checkboxes"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 w-full bg-[#EEF1F6] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#1E63FF] to-[#00C6FF] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[12px] text-[#4B5465]">
            <span>
              {completedCount} of {totalCount} verified standards
            </span>
            <span>
              {completedCount === totalCount ? (
                <strong className="text-[#00C6FF] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> 100% Production Ready
                </strong>
              ) : (
                `${totalCount - completedCount} items remaining for QA approval`
              )}
            </span>
          </div>
        </div>
      </section>

      {/* Checklist Grid */}
      <section id="checklist-items" className="mb-12">
        <div className="space-y-3">
          {CHECKLIST_ITEMS.map((item, idx) => {
            const isChecked = checkedIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-[12px] border transition-all cursor-pointer flex items-start gap-4 ${
                  isChecked
                    ? 'bg-[#F7F9FC] border-[#00C6FF]/40 shadow-sm'
                    : 'bg-white border-[#DDE2EA] hover:border-[#1E63FF]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(item.id)}
                  className="w-5 h-5 rounded-[4px] border-[#8C95A6] text-[#1E63FF] accent-[#1E63FF] mt-0.5 shrink-0 cursor-pointer"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span
                      className={`text-[15px] font-semibold transition-colors ${
                        isChecked ? 'text-[#0B2D6B]' : 'text-[#121722]'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#EEF1F6] text-[#6B7485]">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#4B5465] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
