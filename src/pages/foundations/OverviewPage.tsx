import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Logo } from '../../components/brand/Logo';
import { ArrowRight, Compass, Shield, Sparkles, CheckCircle2, ArrowUpRight, Palette, Type, MousePointerClick, Table2, Layers, BookOpen } from 'lucide-react';

interface OverviewPageProps {
  onNavigate: (path: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  return (
    <div>
      <PageHeader
        category="FOUNDATIONS"
        title="Overview"
        description="The definitive design system and source of truth for VisionEdge enterprise products. Built for speed, clarity, and rock-solid consistency across every operator console."
      />

      {/* Golden Rule Banner (Deep Navy #0B2D6B, 16px radius, White text, Cyan button) */}
      <section id="golden-rule" className="mb-12">
        <div className="rounded-[16px] bg-[#0B2D6B] p-8 md:p-10 text-white shadow-[0_10px_30px_rgba(11,45,107,0.15)] relative overflow-hidden">
          {/* Official Logo brand watermark in banner */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-25 pointer-events-none hidden sm:flex items-center justify-center">
            <Logo size={140} />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-[#00C6FF] text-[11px] font-mono uppercase tracking-[0.08em] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE GOLDEN RULE</span>
            </div>
            <h2 className="text-[24px] md:text-[28px] font-bold text-white tracking-tight leading-snug mb-3">
              &ldquo;If a value is not in this guide, do not invent it. Propose it for addition instead.&rdquo;
            </h2>
            <p className="text-[15px] text-white/80 leading-relaxed mb-6">
              VisionEdge interfaces govern live high-stakes environments — vehicle access, campus safety, and critical facility operations. Visual precision directly influences operator decision speed.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/guidelines/design-tokens')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#00C6FF] text-[#0B2D6B] text-[14px] font-semibold hover:bg-white hover:text-[#0B2D6B] transition-all shadow-[0_2px_8px_rgba(0,198,255,0.3)] active:scale-[0.98]"
              >
                <span>Explore design tokens</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('/guidelines/review-checklist')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-white/10 text-white text-[14px] font-medium hover:bg-white/20 transition-colors"
              >
                <span>Review QA Checklist</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Four Core Principles */}
      <section id="principles" className="mb-12">
        <div className="mb-6">
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] mb-1">
            CORE PHILOSOPHY
          </div>
          <h2 className="text-[20px] font-semibold text-[#121722]">
            Design Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Principle 01 */}
          <div className="p-6 rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)] hover:shadow-[0_4px_12px_rgba(11,45,107,0.08)] transition-all">
            <div className="inline-block px-2.5 py-1 rounded bg-[#1E63FF]/[0.08] text-[#1E63FF] font-mono text-[11px] font-medium mb-3">
              PRINCIPLE 01
            </div>
            <h3 className="text-[17px] font-semibold text-[#121722] mb-2">
              Clarity first
            </h3>
            <p className="text-[14px] text-[#4B5465] leading-relaxed">
              Operators scan live CCTV data and high-velocity vehicle movements under time pressure. Visual hierarchy must make the single next action immediately obvious without cognitive pause.
            </p>
          </div>

          {/* Principle 02 */}
          <div className="p-6 rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)] hover:shadow-[0_4px_12px_rgba(11,45,107,0.08)] transition-all">
            <div className="inline-block px-2.5 py-1 rounded bg-[#1E63FF]/[0.08] text-[#1E63FF] font-mono text-[11px] font-medium mb-3">
              PRINCIPLE 02
            </div>
            <h3 className="text-[17px] font-semibold text-[#121722] mb-2">
              Calm by default, loud when it matters
            </h3>
            <p className="text-[14px] text-[#4B5465] leading-relaxed">
              Screens are mostly pure white and subtle gray neutrals. Vivid brand color and high-contrast alert states are strictly conserved for actions, active selection, and critical events.
            </p>
          </div>

          {/* Principle 03 */}
          <div className="p-6 rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)] hover:shadow-[0_4px_12px_rgba(11,45,107,0.08)] transition-all">
            <div className="inline-block px-2.5 py-1 rounded bg-[#1E63FF]/[0.08] text-[#1E63FF] font-mono text-[11px] font-medium mb-3">
              PRINCIPLE 03
            </div>
            <h3 className="text-[17px] font-semibold text-[#121722] mb-2">
              Consistent everywhere
            </h3>
            <p className="text-[14px] text-[#4B5465] leading-relaxed">
              The same element shares identical look, keyboard interaction, and feedback across ANPR Gate systems, HostelTrack, Meal Pulse, and upcoming industrial modules.
            </p>
          </div>

          {/* Principle 04 */}
          <div className="p-6 rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)] hover:shadow-[0_4px_12px_rgba(11,45,107,0.08)] transition-all">
            <div className="inline-block px-2.5 py-1 rounded bg-[#1E63FF]/[0.08] text-[#1E63FF] font-mono text-[11px] font-medium mb-3">
              PRINCIPLE 04
            </div>
            <h3 className="text-[17px] font-semibold text-[#121722] mb-2">
              Accessible to all
            </h3>
            <p className="text-[14px] text-[#4B5465] leading-relaxed">
              WCAG 2.2 AA compliant across all views. Color is never the sole signal for state — explicit icons and text tags ensure total color-blind accessibility and screen-reader fidelity.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section id="quick-links" className="mb-12">
        <div className="mb-6">
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] mb-1">
            STANDARDS DIRECTORY
          </div>
          <h2 className="text-[20px] font-semibold text-[#121722]">
            Jump to System Foundations & Components
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Closed Color Palette',
              desc: 'Deep Navy, Royal Blue, Cyan, and 11 neutrals.',
              path: '/foundations/colors',
              icon: Palette,
            },
            {
              title: 'Typography & JetBrains Mono',
              desc: '13 strict scale steps, line-heights, and tabular numbers.',
              path: '/foundations/typography',
              icon: Type,
            },
            {
              title: 'Buttons & Action States',
              desc: 'Primary, Secondary, Ghost, Accent, and Destructive matrix.',
              path: '/components/buttons',
              icon: MousePointerClick,
            },
            {
              title: 'Enterprise Data Tables',
              desc: 'ANPR vehicle logs, sticky headers, selection, and density.',
              path: '/components/tables',
              icon: Table2,
            },
            {
              title: 'Design Tokens',
              desc: 'Exportable CSS variables, JSON schema, and Tailwind.',
              path: '/guidelines/design-tokens',
              icon: Layers,
            },
            {
              title: 'Brand & Logo Assets',
              desc: 'Ribbon "V" mark rules, clear space, and forbidden uses.',
              path: '/foundations/brand-logo',
              icon: BookOpen,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => onNavigate(item.path)}
                className="p-5 rounded-[12px] border border-[#DDE2EA] bg-white text-left hover:border-[#1E63FF] hover:shadow-[0_4px_12px_rgba(11,45,107,0.08)] transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-[8px] bg-[#F7F9FC] border border-[#DDE2EA] flex items-center justify-center text-[#1E63FF] mb-3 group-hover:bg-[#1E63FF]/10 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-[15px] font-semibold text-[#121722] group-hover:text-[#1E63FF] transition-colors mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[13px] text-[#4B5465] leading-snug">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[12px] font-medium text-[#1E63FF]">
                  <span>View standards</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* What's New in v1.0 */}
      <section id="release-notes" className="mb-12">
        <div className="p-6 rounded-[12px] border border-[#DDE2EA] bg-[#F7F9FC]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#121722]">
              What&apos;s new in VisionEdge Design System v1.0
            </h3>
            <span className="text-[12px] font-mono text-[#6B7485]">
              RELEASED 30 SEP 2026
            </span>
          </div>

          <div className="space-y-3">
            {[
              'Theme lock enforcement: 100% bright, pure light surfaces. Zero dark-mode ambiguity.',
              'Closed 3-color brand system: Deep Navy (#0B2D6B), Royal Blue (#1E63FF), and Cyan (#00C6FF).',
              '60·30·10 enterprise color distribution matrix with built-in contrast compliance validator.',
              'High-density ANPR Table pattern supporting 48px standard and 40px compact row modes.',
              'Interactive WCAG 2.2 AA Contrast Checker and live Design Token exporter.',
              'Component specifications with variant × state testing playgrounds for buttons, inputs, cards, and modals.',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[14px] text-[#353D4C]">
                <CheckCircle2 className="w-4 h-4 text-[#00C6FF] shrink-0 mt-0.5" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
