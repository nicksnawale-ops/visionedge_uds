import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { Badge } from '../../profile/ui';

interface ModuleCardProps {
  /** Module name, e.g. "ANPR". */
  title: string;
  description: string;
  /** Licensed modules show "Enabled"; others "Not licensed" (their rows are locked). */
  licensed: boolean;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

/**
 * Collapsible module card (Detection & AI → Module settings). Same surface as SectionCard; the title is a
 * disclosure button (aria-expanded / aria-controls) with the license badge and a chevron.
 */
export const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, licensed, open, onToggle, children }) => {
  const uid = useId();
  const bodyId = `${uid}-body`;
  const titleId = `${uid}-title`;
  return (
    <section aria-labelledby={titleId} className="relative min-w-0 bg-white rounded-[12px] border border-[#DDE2EA] shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
      <h4 className={`m-0 ${open ? 'border-b border-[#DDE2EA]' : ''}`}>
        <button
          id={titleId}
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={onToggle}
          className={`w-full px-4 @min-[768px]:px-6 py-4 flex items-center gap-3 text-left hover:bg-[#F7F9FC] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E63FF] ${open ? 'rounded-t-[12px]' : 'rounded-[12px]'}`}
        >
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-[16px] leading-[24px] font-semibold text-[#121722]">{title}</span>
              {licensed ? <Badge tone="live">Enabled</Badge> : <Badge tone="neutral">Not licensed</Badge>}
            </span>
            <span className="block mt-0.5 text-[12px] leading-[16px] font-normal text-[#6B7485]">{description}</span>
          </span>
          <ChevronDown className={`w-5 h-5 shrink-0 text-[#4B5465] motion-safe:transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </h4>
      <div id={bodyId} hidden={!open}>
        {open && children}
      </div>
    </section>
  );
};

/** Overline that separates groups of rows inside a module card ("Face matching", "Entry rules"). */
export const RowGroupLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="px-4 @min-[768px]:px-6 pt-5 pb-0 text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
    {children}
  </p>
);
