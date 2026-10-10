import React, { useId } from 'react';
import { SECTIONS, SectionId } from '../profileStates';
import { Skeleton } from '../ui';
import { ProfileSelect } from './ProfileSelect';

interface SectionSelectNavProps {
  current: SectionId;
  onSelect: (id: SectionId) => void;
  loading: boolean;
}

/**
 * <768px: "Section: Security" select (44px) with the section icons. Profile-only copy of SectionNav's
 * SelectSectionNav; SectionNav.tsx is shared with other templates and stays unchanged.
 */
export const SectionSelectNav: React.FC<SectionSelectNavProps> = ({ current, onSelect, loading }) => {
  const id = useId();
  if (loading) return <Skeleton className="h-11 w-full rounded-[8px]!" />;
  return (
    <ProfileSelect
      id={id}
      ariaLabel="Section"
      prefix="Section:"
      size="lg"
      value={current}
      onChange={(v) => onSelect(v as SectionId)}
      options={SECTIONS.map((s) => ({ value: s.id, label: s.label, icon: s.icon }))}
    />
  );
};
