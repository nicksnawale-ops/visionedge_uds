import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { SECTIONS, SectionId, ViewerMode } from './profileStates';
import { LINK, Skeleton, demoLink } from './ui';

interface SectionNavProps {
  current: SectionId;
  onSelect: (id: SectionId) => void;
  viewer: ViewerMode;
  loading: boolean;
}

/* Nav styles, shared with other settings-style templates (e.g. Settings). */
export const NAV_STYLES = {
  card: 'bg-white rounded-[12px] border border-[#DDE2EA] shadow-[0_1px_3px_rgba(11,45,107,0.08)] p-2',
  item: 'relative h-10 flex items-center gap-3 px-3 rounded-[8px] text-[14px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]',
  itemActive: 'bg-[#1E63FF]/[0.08] text-[#1E63FF]',
  itemIdle: 'text-[#353D4C] hover:bg-[#F7F9FC] hover:text-[#121722]',
  activeBar: 'absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-[#1E63FF]',
  icon: 'w-[18px] h-[18px] shrink-0',
  iconActive: 'text-[#1E63FF]',
  iconIdle: 'text-[#4B5465]',
  tab: '-mb-px h-11 px-3 flex items-center gap-2 border-b-2 text-[14px] font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E63FF] rounded-t-[4px]',
  tabActive: 'border-[#1E63FF] text-[#1E63FF]',
  tabIdle: 'border-transparent text-[#4B5465] hover:text-[#121722]',
  select:
    'w-full h-11 pl-[76px] pr-10 appearance-none rounded-[8px] border border-[#8C95A6] bg-white text-[16px] font-medium text-[#121722] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20',
} as const;

const go = (e: React.MouseEvent, id: SectionId, onSelect: (id: SectionId) => void) => {
  e.preventDefault();
  onSelect(id);
};

/** ≥1024px: sticky vertical nav (white card, 40px items, 3px Royal Blue bar on the active item) + help box. */
export const VerticalSectionNav: React.FC<SectionNavProps> = ({ current, onSelect, viewer, loading }) => (
  <div className="space-y-4">
    <nav aria-label="Profile sections" className={NAV_STYLES.card}>
      <ul className="space-y-0.5">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = s.id === current;
          return (
            <li key={s.id}>
              {loading ? (
                <span className="h-10 flex items-center gap-3 px-3">
                  <Skeleton className="w-[18px] h-[18px] rounded-full!" />
                  <Skeleton className="h-3.5 flex-1" />
                </span>
              ) : (
                <a
                  href={`#${s.id}`}
                  onClick={(e) => go(e, s.id, onSelect)}
                  aria-current={active ? 'page' : undefined}
                  className={`${NAV_STYLES.item} ${active ? NAV_STYLES.itemActive : NAV_STYLES.itemIdle}`}
                >
                  {active && <span className={NAV_STYLES.activeBar} aria-hidden="true" />}
                  <Icon className={`${NAV_STYLES.icon} ${active ? NAV_STYLES.iconActive : NAV_STYLES.iconIdle}`} aria-hidden="true" />
                  <span className="truncate">{s.label}</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
    <div className="rounded-[8px] border border-[#DDE2EA] px-4 pt-3 pb-1 text-[13px] leading-[20px] text-[#4B5465] bg-[#F7F9FC]">
      {viewer === 'self' ? (
        <>
          <p>Need to change your role or site access? Contact your administrator.</p>
          <a href="#contact-admin" onClick={demoLink} className={`${LINK} text-[13px]`}>
            Contact administrator
          </a>
        </>
      ) : (
        <>
          <p>Every change you make to this user is recorded in the audit log.</p>
          <a href="#audit-log" onClick={demoLink} className={`${LINK} text-[13px]`}>
            View audit log
          </a>
        </>
      )}
    </div>
  </div>
);

/** 768–1023px: horizontal, scrollable tabs under the header card (still a nav with aria-current). */
export const HorizontalSectionNav: React.FC<Omit<SectionNavProps, 'viewer'>> = ({ current, onSelect, loading }) => (
  <nav aria-label="Profile sections" className="-mx-1 overflow-x-auto border-b border-[#DDE2EA]">
    <ul className="flex items-center gap-1 px-1 w-max">
      {SECTIONS.map((s) => {
        const Icon = s.icon;
        const active = s.id === current;
        return (
          <li key={s.id}>
            {loading ? (
              <Skeleton className="h-4 w-24 my-3.5" />
            ) : (
              <a
                href={`#${s.id}`}
                onClick={(e) => go(e, s.id, onSelect)}
                aria-current={active ? 'page' : undefined}
                className={`${NAV_STYLES.tab} ${active ? NAV_STYLES.tabActive : NAV_STYLES.tabIdle}`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {s.label}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  </nav>
);

/** <768px: a select ("Section: Security"). Native, so it works with every screen reader and phone picker. */
export const SelectSectionNav: React.FC<Omit<SectionNavProps, 'viewer'>> = ({ current, onSelect, loading }) => {
  const id = useId();
  if (loading) return <Skeleton className="h-11 w-full rounded-[8px]!" />;
  return (
    <div className="relative">
      <label htmlFor={id} className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#4B5465] pointer-events-none">
        Section:
      </label>
      <select
        id={id}
        value={current}
        onChange={(e) => onSelect(e.target.value as SectionId)}
        className={NAV_STYLES.select}
      >
        {SECTIONS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5465] pointer-events-none" aria-hidden="true" />
    </div>
  );
};
