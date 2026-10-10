import React, { useId } from 'react';
import { NAV_STYLES } from '../profile/SectionNav';
import { Skeleton } from '../profile/ui';
import { SettingsSelect } from './parts/SettingsSelect';
import { SETTINGS_GROUPS, SettingsSectionId } from './settingsStates';

export interface NavProblems {
  /** Count shown as a Deep Navy pill (e.g. offline cameras). */
  counts: Partial<Record<SettingsSectionId, number>>;
}

interface SettingsNavProps {
  current: SettingsSectionId;
  onSelect: (id: SettingsSectionId) => void;
  problems: NavProblems;
  loading: boolean;
}

const OVERLINE = 'text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#6B7485]';

const problemLabel = (id: SettingsSectionId, n: number) =>
  id === 'cameras' ? `${n} offline` : id === 'integrations' ? `${n} error${n === 1 ? '' : 's'}` : `${n} need attention`;

/** Critical count pill (Deep Navy, White text), with words for screen readers. */
const Count: React.FC<{ id: SettingsSectionId; n: number }> = ({ id, n }) => (
  <span className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-[#0B2D6B] text-white text-[11px] font-semibold tabular-nums">
    {n}
    <span className="sr-only">, {problemLabel(id, n)}</span>
  </span>
);

const go = (e: React.MouseEvent, id: SettingsSectionId, onSelect: (id: SettingsSectionId) => void) => {
  e.preventDefault();
  onSelect(id);
};

/** ≥1024px: sticky grouped nav with Overline group headings (profile nav styles). */
export const VerticalSettingsNav: React.FC<SettingsNavProps> = ({ current, onSelect, problems, loading }) => (
  <nav aria-label="Settings sections" className={NAV_STYLES.card}>
    {SETTINGS_GROUPS.map((g) => (
      <div key={g.id} role="group" aria-labelledby={`settings-nav-${g.id}`} className="pt-2 first:pt-0">
        <p id={`settings-nav-${g.id}`} className={`${OVERLINE} px-3 pt-1 pb-1`}>
          {g.label}
        </p>
        <ul className="space-y-0.5">
          {g.sections.map((s) => {
            const Icon = s.icon;
            const active = s.id === current;
            const count = problems.counts[s.id];
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
                    {count ? <Count id={s.id} n={count} /> : null}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </nav>
);

/** 768–1023px: one horizontally scrollable tab bar; group names sit before their tabs. */
export const TabSettingsNav: React.FC<SettingsNavProps> = ({ current, onSelect, problems, loading }) => (
  <nav aria-label="Settings sections" className="overflow-x-auto border-b border-[#DDE2EA]">
    <div className="flex items-end gap-4 w-max">
      {SETTINGS_GROUPS.map((g) => (
        <div key={g.id} role="group" aria-labelledby={`settings-tabs-${g.id}`} className="flex items-end gap-1">
          <span id={`settings-tabs-${g.id}`} className={`${OVERLINE} self-center pr-1 text-[10px]`}>
            {g.label}
          </span>
          {g.sections.map((s) => {
            const active = s.id === current;
            const count = problems.counts[s.id];
            return loading ? (
              <Skeleton key={s.id} className="h-4 w-20 my-3.5" />
            ) : (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => go(e, s.id, onSelect)}
                aria-current={active ? 'page' : undefined}
                className={`${NAV_STYLES.tab} ${active ? NAV_STYLES.tabActive : NAV_STYLES.tabIdle}`}
              >
                {s.label}
                {count ? <Count id={s.id} n={count} /> : null}
              </a>
            );
          })}
        </div>
      ))}
    </div>
  </nav>
);

/** <768px: SettingsSelect grouped by Overline headings, with problem counts as meta. */
export const SelectSettingsNav: React.FC<SettingsNavProps> = ({ current, onSelect, problems, loading }) => {
  const id = useId();
  if (loading) return <Skeleton className="h-11 w-full rounded-[8px]!" />;
  return (
    <div className="relative">
      <SettingsSelect
        id={id}
        ariaLabel="Section"
        prefix="Section:"
        size="lg"
        value={current}
        onChange={(v) => onSelect(v as SettingsSectionId)}
        options={SETTINGS_GROUPS.flatMap((g) =>
          g.sections.map((s) => {
            const n = problems.counts[s.id];
            return { value: s.id, label: s.label, group: g.label, meta: n ? problemLabel(s.id, n) : undefined, srText: n ? problemLabel(s.id, n) : undefined };
          }),
        )}
      />
    </div>
  );
};
