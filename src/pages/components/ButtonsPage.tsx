import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { PreviewPanel, TabItem } from '../../components/common/PreviewPanel';
import { SpecTable } from '../../components/common/SpecTable';
import { DoDontPair } from '../../components/common/DoDont';
import { Plus, Download, Eye, Trash2, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { MatrixSelect } from './buttons/parts/MatrixSelect';
import { SIZE_OPTIONS, STATE_OPTIONS, VARIANT_OPTIONS } from './buttons/parts/matrixOptions';

export const ButtonsPage: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<'primary' | 'secondary' | 'ghost' | 'accent' | 'destructive' | 'on-dark'>('primary');
  const [selectedState, setSelectedState] = useState<'default' | 'hover' | 'focus' | 'disabled' | 'loading'>('default');
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Interactive Button Matrix helper
  const getButtonClasses = (
    variant: 'primary' | 'secondary' | 'ghost' | 'accent' | 'destructive' | 'on-dark',
    state: 'default' | 'hover' | 'focus' | 'disabled' | 'loading',
    size: 'sm' | 'md' | 'lg'
  ) => {
    let base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-[8px] transition-all whitespace-nowrap cursor-pointer ';

    // Size
    if (size === 'sm') base += 'h-[32px] px-3 text-[12px] ';
    if (size === 'md') base += 'h-[40px] px-4 text-[14px] ';
    if (size === 'lg') base += 'h-[48px] px-6 text-[15px] ';

    // Disabled state
    if (state === 'disabled') {
      return base + 'bg-[#EEF1F6] text-[#8C95A6] border border-[#DDE2EA] cursor-not-allowed shadow-none ';
    }

    // Focus state ring
    const focusRing = state === 'focus' ? 'ring-2 ring-[#1E63FF] ring-offset-2 ' : '';

    if (variant === 'primary') {
      let colors = 'bg-[#1E63FF] text-white shadow-[0_1px_3px_rgba(30,99,255,0.3)] ';
      if (state === 'hover') colors = 'bg-[#0B2D6B] text-white shadow-[0_4px_12px_rgba(11,45,107,0.25)] -translate-y-0.5 ';
      return base + colors + focusRing;
    }

    if (variant === 'secondary') {
      let colors = 'bg-white text-[#1E63FF] border border-[#1E63FF] shadow-sm ';
      if (state === 'hover') colors = 'bg-[#F7F9FC] text-[#0B2D6B] border-[#0B2D6B] -translate-y-0.5 ';
      return base + colors + focusRing;
    }

    if (variant === 'ghost') {
      let colors = 'bg-transparent text-[#1E63FF] ';
      if (state === 'hover') colors = 'bg-[#EEF1F6] text-[#0B2D6B] ';
      return base + colors + focusRing;
    }

    if (variant === 'accent') {
      let colors = 'bg-[#00C6FF] text-[#0B2D6B] shadow-[0_2px_8px_rgba(0,198,255,0.3)] ';
      if (state === 'hover') colors = 'bg-[#0B2D6B] text-[#00C6FF] -translate-y-0.5 ';
      return base + colors + focusRing;
    }

    if (variant === 'destructive') {
      let colors = 'bg-[#121722] text-white shadow-sm ';
      if (state === 'hover') colors = 'bg-[#000000] text-white -translate-y-0.5 ';
      return base + colors + focusRing;
    }

    if (variant === 'on-dark') {
      let colors = 'bg-white text-[#0B2D6B] shadow-sm ';
      if (state === 'hover') colors = 'bg-[#00C6FF] text-[#0B2D6B] -translate-y-0.5 ';
      return base + colors + focusRing;
    }

    return base;
  };

  const previewTabs: TabItem[] = [
    {
      id: 'primary',
      label: 'Primary Button',
      component: (
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button className="h-[40px] px-4 rounded-[8px] bg-[#1E63FF] text-white font-semibold text-[14px] hover:bg-[#0B2D6B] transition-all flex items-center gap-2 shadow-[0_1px_3px_rgba(30,99,255,0.3)]">
            <Plus className="w-4 h-4" />
            <span>Add vehicle record</span>
          </button>
          <button className="h-[40px] px-4 rounded-[8px] bg-[#1E63FF] text-white font-semibold text-[14px] flex items-center gap-2 opacity-90 cursor-wait">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Saving record...</span>
          </button>
        </div>
      ),
      code: `<button className="h-[40px] px-4 rounded-[8px] bg-[#1E63FF] text-white font-semibold text-[14px] hover:bg-[#0B2D6B] transition-all flex items-center gap-2 shadow-[0_1px_3px_rgba(30,99,255,0.3)] active:scale-[0.98]">
  <Plus className="w-4 h-4" />
  <span>Add vehicle record</span>
</button>`,
    },
    {
      id: 'secondary',
      label: 'Secondary Button',
      component: (
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button className="h-[40px] px-4 rounded-[8px] bg-white border border-[#1E63FF] text-[#1E63FF] font-semibold text-[14px] hover:bg-[#F7F9FC] hover:border-[#0B2D6B] hover:text-[#0B2D6B] transition-all flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            <span>Export audit report</span>
          </button>
          <button className="h-[40px] px-4 rounded-[8px] bg-white border border-[#DDE2EA] text-[#4B5465] font-semibold text-[14px] hover:bg-[#F7F9FC] transition-all">
            Cancel
          </button>
        </div>
      ),
      code: `<button className="h-[40px] px-4 rounded-[8px] bg-white border border-[#1E63FF] text-[#1E63FF] font-semibold text-[14px] hover:bg-[#F7F9FC] hover:border-[#0B2D6B] hover:text-[#0B2D6B] transition-all flex items-center gap-2 shadow-sm">
  <Download className="w-4 h-4" />
  <span>Export audit report</span>
</button>`,
    },
    {
      id: 'ghost',
      label: 'Ghost Button',
      component: (
        <button className="h-[40px] px-4 rounded-[8px] text-[#1E63FF] font-semibold text-[14px] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] transition-all flex items-center gap-2">
          <span>View all active alerts</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ),
      code: `<button className="h-[40px] px-4 rounded-[8px] text-[#1E63FF] font-semibold text-[14px] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] transition-all flex items-center gap-2">
  <span>View all active alerts</span>
  <ArrowRight className="w-4 h-4" />
</button>`,
    },
    {
      id: 'accent',
      label: 'Accent (Cyan)',
      component: (
        <button className="h-[40px] px-4 rounded-[8px] bg-[#00C6FF] text-[#0B2D6B] font-semibold text-[14px] hover:bg-[#0B2D6B] hover:text-[#00C6FF] transition-all flex items-center gap-2 shadow-[0_2px_8px_rgba(0,198,255,0.3)]">
          <Eye className="w-4 h-4" />
          <span>View live camera stream</span>
        </button>
      ),
      code: `// Strictly ONE Accent button per screen for standout actions
<button className="h-[40px] px-4 rounded-[8px] bg-[#00C6FF] text-[#0B2D6B] font-semibold text-[14px] hover:bg-[#0B2D6B] hover:text-[#00C6FF] transition-all flex items-center gap-2 shadow-[0_2px_8px_rgba(0,198,255,0.3)]">
  <Eye className="w-4 h-4" />
  <span>View live camera stream</span>
</button>`,
    },
    {
      id: 'destructive',
      label: 'Destructive',
      component: (
        <button className="h-[40px] px-4 rounded-[8px] bg-[#121722] text-white font-semibold text-[14px] hover:bg-black transition-all flex items-center gap-2 shadow-sm">
          <Trash2 className="w-4 h-4" />
          <span>Delete vehicle permit</span>
        </button>
      ),
      code: `// Destructive actions use Gray 900 / Black fill and always trigger confirmation
<button className="h-[40px] px-4 rounded-[8px] bg-[#121722] text-white font-semibold text-[14px] hover:bg-black transition-all flex items-center gap-2 shadow-sm">
  <Trash2 className="w-4 h-4" />
  <span>Delete vehicle permit</span>
</button>`,
    },
    {
      id: 'on-dark',
      label: 'On Dark (Navy Strip)',
      component: (
        <div className="w-full max-w-md p-4 rounded-[8px] bg-[#0B2D6B] flex items-center justify-between">
          <span className="text-[13px] text-white font-medium">ANPR Console Header</span>
          <button className="h-[36px] px-4 rounded-[6px] bg-white text-[#0B2D6B] font-semibold text-[13px] hover:bg-[#00C6FF] transition-colors">
            Configure Gate
          </button>
        </div>
      ),
      code: `// On Dark: White fill with Deep Navy text, hover to Cyan
<button className="h-[36px] px-4 rounded-[6px] bg-white text-[#0B2D6B] font-semibold text-[13px] hover:bg-[#00C6FF] transition-colors">
  Configure Gate
</button>`,
    },
  ];

  return (
    <div>
      <PageHeader
        category="COMPONENTS"
        title="Buttons"
        description="The primary action trigger in VisionEdge. Enforces exactly one Primary button per view, strict verb-first phrasing, 8px icon spacing, and accessible focus outlines."
        updatedBadge
      />

      {/* Main Interactive Preview Panel */}
      <section id="preview" className="mb-12">
        <PreviewPanel tabs={previewTabs} />
      </section>

      {/* Interactive Variant × State Matrix Playground */}
      <section id="matrix-playground" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Interactive Variant × State Matrix
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Configure and test every variant, state, and size combination.
          </p>
        </div>

        <div className="rounded-[12px] border border-[#DDE2EA] bg-white p-6 shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-[#DDE2EA] mb-6">
            {/* Variant selector */}
            <div>
              <label id="matrix-variant-label" className="text-[12px] font-semibold text-[#121722] block mb-1.5 uppercase tracking-wider">
                Variant
              </label>
              <MatrixSelect labelId="matrix-variant-label" options={VARIANT_OPTIONS} value={selectedVariant} onChange={setSelectedVariant} />
            </div>

            {/* State selector */}
            <div>
              <label id="matrix-state-label" className="text-[12px] font-semibold text-[#121722] block mb-1.5 uppercase tracking-wider">
                Simulated State
              </label>
              <MatrixSelect labelId="matrix-state-label" options={STATE_OPTIONS} value={selectedState} onChange={setSelectedState} />
            </div>

            {/* Size selector */}
            <div>
              <label id="matrix-size-label" className="text-[12px] font-semibold text-[#121722] block mb-1.5 uppercase tracking-wider">
                Size
              </label>
              <MatrixSelect labelId="matrix-size-label" options={SIZE_OPTIONS} value={selectedSize} onChange={setSelectedSize} />
            </div>
          </div>

          {/* Render Area */}
          <div
            className={`p-8 rounded-[8px] flex items-center justify-center transition-all ${
              selectedVariant === 'on-dark' ? 'bg-[#0B2D6B]' : 'preview-grid-canvas'
            }`}
          >
            <button
              disabled={selectedState === 'disabled'}
              className={getButtonClasses(selectedVariant, selectedState, selectedSize)}
            >
              {selectedState === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : (
                <Plus className="w-4 h-4 shrink-0" />
              )}
              <span>
                {selectedState === 'loading'
                  ? 'Saving changes...'
                  : selectedState === 'disabled'
                  ? 'Action unavailable'
                  : 'Register gate access'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Button Specifications
        </h2>
        <SpecTable
          rows={[
            { property: 'Primary Fill', value: '#1E63FF (Royal Blue)', token: 'bg-[#1E63FF]', notes: 'Single primary CTA per viewport' },
            { property: 'Primary Hover', value: '#0B2D6B (Deep Navy)', token: 'hover:bg-[#0B2D6B]', notes: 'Provides immediate high-contrast feedback' },
            { property: 'Border Radius', value: '8px (radius-md)', token: 'rounded-[8px]' },
            { property: 'Typography', value: 'Inter SemiBold 600, 14px', token: 'text-[14px] font-semibold' },
            { property: 'Icon Gap', value: '8px (space-2)', token: 'gap-2' },
            { property: 'Focus Ring', value: '2px White offset + 4px Royal Blue outline', token: 'ring-2 ring-[#1E63FF] ring-offset-2' },
            { property: 'Touch Target', value: 'Minimum 44×44px on mobile', token: 'min-h-[44px]' },
          ]}
        />
      </section>

      {/* Do & Don't Guidelines */}
      <section id="do-dont">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Button Usage Rules
        </h2>
        <DoDontPair
          doTitle="Do use 1–3 word verb-first actions"
          doDescription="Phrasing must clearly state the outcome: 'Add camera', 'Save settings', 'Export report'."
          doExample={
            <button className="h-[40px] px-4 bg-[#1E63FF] text-white font-semibold text-[13px] rounded-[8px]">
              Register new vehicle
            </button>
          }
          dontTitle="Don't use ambiguous words like 'OK', 'Yes', or 'Click here'"
          dontDescription="Vague buttons increase cognitive burden and lead to accidental destructive submissions."
          dontExample={
            <button className="h-[40px] px-4 bg-[#1E63FF] text-white font-semibold text-[13px] rounded-[8px]">
              Click here to proceed
            </button>
          }
        />

        <DoDontPair
          doTitle="Do place Primary button on the right in dialog footers"
          doDescription="Follow natural operator reading order: Cancel on the left, Primary confirmation on the right."
          doExample={
            <div className="flex items-center gap-3">
              <button className="h-[36px] px-3 bg-white border border-[#DDE2EA] text-[#4B5465] text-[13px] rounded-[6px]">
                Cancel
              </button>
              <button className="h-[36px] px-3 bg-[#1E63FF] text-white text-[13px] font-semibold rounded-[6px]">
                Confirm gate exit
              </button>
            </div>
          }
          dontTitle="Don't place two Primary or Accent buttons side by side"
          dontDescription="Two competing solid blue buttons confuse visual hierarchy and cause operator hesitation."
          dontExample={
            <div className="flex items-center gap-3">
              <button className="h-[36px] px-3 bg-[#1E63FF] text-white text-[13px] rounded-[6px]">
                Save draft
              </button>
              <button className="h-[36px] px-3 bg-[#1E63FF] text-white text-[13px] rounded-[6px]">
                Publish now
              </button>
            </div>
          }
        />
      </section>
    </div>
  );
};
