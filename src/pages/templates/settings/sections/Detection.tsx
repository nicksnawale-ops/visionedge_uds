import React, { useEffect, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { BUTTON, Badge } from '../../profile/ui';
import { useSettings } from '../SettingsContext';
import { MEAL_WINDOWS, OPTIONS, getDef } from '../data/settingsIndex';
import { LICENSED_MODULES, MODULES, ModuleId } from '../data/system';
import { SectionCard } from '../patterns/SectionCard';
import { ModuleCard, RowGroupLabel } from '../patterns/ModuleCard';
import { BoundRow, ControlProps, RadioGroup, RowSelect, RowSwitch } from '../patterns/SettingRow';
import { Slider } from '../patterns/Slider';
import { ToggleChips } from '../patterns/ChipsInput';
import { TimeRangeSelect } from '../patterns/TimeRangeSelect';
import { TestDetectionModal } from '../modals/TestDetectionModal';

/** Curfew options, 20:00–23:30. */
const TIMES_EVENING = ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'].map((t) => ({ value: t, label: t }));

const NOT_LICENSED = 'Not included in your license';

/** The first licensed module starts open; the rest start collapsed. */
const FIRST_ENABLED = MODULES.find((m) => LICENSED_MODULES.has(m.id))?.id;

/** Rows of one module card. Unlicensed modules pass a lock reason, which disables every control. */
const ModuleRows: React.FC<{ module: ModuleId; lock?: string }> = ({ module, lock }) => {
  const { values, set, touch } = useSettings();
  const str = (id: string) => String(values[id] ?? '');
  const num = (id: string) => Number(values[id] ?? 0);
  const bool = (id: string) => Boolean(values[id]);
  const toggle = (id: string) => (c: ControlProps) => <RowSwitch control={c} checked={bool(id)} onChange={(v) => set(id, v)} />;
  const select = (id: string, options: readonly { value: string; label: string }[]) => (c: ControlProps) => (
    <RowSelect control={c} options={options} value={str(id)} onChange={(v) => set(id, v)} className="max-w-[200px]!" />
  );

  switch (module) {
    case 'anpr':
      return (
        <>
          <BoundRow id="det.anpr.confidence" lockedOverride={lock} helper={`Plates below ${num('det.anpr.confidence')}% are marked for review`}>
            {(c) => <Slider control={c} value={num('det.anpr.confidence')} min={50} max={99} unit="%" onChange={(v) => set('det.anpr.confidence', v)} />}
          </BoundRow>
          <BoundRow id="det.anpr.formats" lockedOverride={lock} group>
            {(c) => (
              <ToggleChips
                options={OPTIONS.plateFormats}
                value={values['det.anpr.formats'] as string[]}
                onChange={(v) => set('det.anpr.formats', v)}
                labelledBy={c.labelId}
                describedBy={c.describedBy}
                disabled={c.disabled}
              />
            )}
          </BoundRow>
          <BoundRow id="det.anpr.watchlist" lockedOverride={lock} group>
            {(c) => <RadioGroup control={c} name="watchlist" options={OPTIONS.watchlist} value={str('det.anpr.watchlist')} onChange={(v) => set('det.anpr.watchlist', v)} />}
          </BoundRow>
          <BoundRow id="det.anpr.duplicate" lockedOverride={lock}>
            {select('det.anpr.duplicate', OPTIONS.duplicateSeconds)}
          </BoundRow>
          <BoundRow id="det.anpr.capture" lockedOverride={lock}>
            {toggle('det.anpr.capture')}
          </BoundRow>
        </>
      );
    case 'hosteltrack':
      return (
        <>
          <RowGroupLabel>Face matching</RowGroupLabel>
          <BoundRow id="det.hostel.face" lockedOverride={lock} helper={`Matches below ${num('det.hostel.face')}% go to the warden to confirm`}>
            {(c) => <Slider control={c} value={num('det.hostel.face')} min={70} max={99} unit="%" onChange={(v) => set('det.hostel.face', v)} />}
          </BoundRow>
          <BoundRow id="det.hostel.liveness" lockedOverride={lock}>
            {toggle('det.hostel.liveness')}
          </BoundRow>
          <RowGroupLabel>Entry rules</RowGroupLabel>
          <BoundRow id="det.hostel.curfew" lockedOverride={lock}>
            {(c) => <RowSelect control={c} options={TIMES_EVENING} value={str('det.hostel.curfew')} onChange={(v) => set('det.hostel.curfew', v)} className="max-w-[200px]! font-mono" />}
          </BoundRow>
          <BoundRow id="det.hostel.grace" lockedOverride={lock}>
            {select('det.hostel.grace', OPTIONS.minutes([0, 5, 10, 15, 30]))}
          </BoundRow>
          <BoundRow id="det.hostel.multiple" lockedOverride={lock}>
            {select('det.hostel.multiple', OPTIONS.minutes([2, 5, 10, 15]))}
          </BoundRow>
        </>
      );
    case 'mealpulse': {
      const windows = values['det.meal.windows'] as string[];
      const setWindow = (i: number, part: 0 | 1, v: string) => {
        const next = windows.map((w, k) => {
          if (k !== i) return w;
          const [from, to] = w.split('-');
          return part === 0 ? `${v}-${to}` : `${from}-${v}`;
        });
        set('det.meal.windows', next);
        touch('det.meal.windows');
      };
      return (
        <>
          <BoundRow id="det.meal.windows" lockedOverride={lock} group>
            {(c) => (
              <table className="w-full max-w-[420px] border-collapse text-[14px]" aria-labelledby={c.labelId} aria-describedby={c.describedBy}>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Meal</th>
                    <th scope="col">Window</th>
                  </tr>
                </thead>
                <tbody>
                  {windows.map((w, i) => {
                    const [from, to] = w.split('-');
                    return (
                      <tr key={MEAL_WINDOWS[i]} className="align-bottom">
                        <th scope="row" className="pr-4 pb-2 text-left font-medium text-[#121722] whitespace-nowrap">
                          {MEAL_WINDOWS[i]}
                        </th>
                        <td className="pb-2">
                          <TimeRangeSelect
                            idPrefix={`${c.id}-${i}`}
                            name={MEAL_WINDOWS[i]}
                            from={from}
                            to={to}
                            onFrom={(v) => setWindow(i, 0, v)}
                            onTo={(v) => setWindow(i, 1, v)}
                            disabled={c.disabled}
                            invalid={to <= from}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </BoundRow>
          <RowGroupLabel>Meal rules</RowGroupLabel>
          <BoundRow id="det.meal.onePerWindow" lockedOverride={lock}>
            {toggle('det.meal.onePerWindow')}
          </BoundRow>
          <BoundRow id="det.meal.duplicate" lockedOverride={lock}>
            {select('det.meal.duplicate', OPTIONS.minutes([5, 10, 15, 30]))}
          </BoundRow>
          <BoundRow id="det.meal.queue" lockedOverride={lock}>
            {select('det.meal.queue', OPTIONS.minutes([5, 8, 10, 15]))}
          </BoundRow>
        </>
      );
    }
    case 'visitor':
      return (
        <>
          <RowGroupLabel>Visitor passes</RowGroupLabel>
          <BoundRow id="det.visitor.validity" lockedOverride={lock}>
            {select('det.visitor.validity', OPTIONS.hours([1, 2, 4, 8]))}
          </BoundRow>
          <BoundRow id="det.visitor.overstay" lockedOverride={lock}>
            {select('det.visitor.overstay', OPTIONS.minutes([15, 30, 45, 60]))}
          </BoundRow>
          <RowGroupLabel>Arrival</RowGroupLabel>
          <BoundRow id="det.visitor.hostNotify" lockedOverride={lock}>
            {toggle('det.visitor.hostNotify')}
          </BoundRow>
          <BoundRow id="det.visitor.preApproval" lockedOverride={lock}>
            {toggle('det.visitor.preApproval')}
          </BoundRow>
          <BoundRow id="det.visitor.photo" lockedOverride={lock}>
            {toggle('det.visitor.photo')}
          </BoundRow>
        </>
      );
  }
};

/**
 * Detection & AI: one generic layout. "General detection" applies to every module; below it, one
 * collapsible card per module in the license list. Search jumps open the card that holds the row.
 */
export const Detection: React.FC = () => {
  const { values, set, marker, jumpId, jumpKey } = useSettings();
  const [testing, setTesting] = useState(false);
  const jumpModule = jumpId ? getDef(jumpId)?.module : undefined;
  const [open, setOpen] = useState<ModuleId[]>(() => [...new Set([FIRST_ENABLED, jumpModule].filter((m): m is ModuleId => Boolean(m)))]);

  // A search jump opens the module card that holds the row (even if it was collapsed again).
  useEffect(() => {
    if (jumpModule) setOpen((o) => (o.includes(jumpModule) ? o : [...o, jumpModule]));
  }, [jumpModule, jumpKey]);

  const toggleCard = (m: ModuleId) => setOpen((o) => (o.includes(m) ? o.filter((x) => x !== m) : [...o, m]));
  const str = (id: string) => String(values[id] ?? '');
  const num = (id: string) => Number(values[id] ?? 0);

  return (
    <>
      <SectionCard
        title="General detection"
        description="Applies to every module on your edge devices."
        overlay={marker(5)}
        actions={
          <button type="button" onClick={() => setTesting(true)} className={BUTTON.secondary}>
            <FlaskConical className="w-4 h-4" aria-hidden="true" />
            Test settings
          </button>
        }
      >
        <BoundRow id="det.model" group overlay={marker(6, true)}>
          {(c) => (
            <div className="flex flex-wrap items-center gap-3" aria-labelledby={c.labelId}>
              <span className="text-[14px] text-[#121722]">VE-Vision 4.2 · Updated 12 Sep 2026</span>
              <Badge tone="live">Current</Badge>
              <a href="#release-notes" onClick={(e) => e.preventDefault()} className={BUTTON.ghostSm}>
                Release notes
              </a>
            </div>
          )}
        </BoundRow>
        <BoundRow id="det.processing" group>
          {(c) => <RadioGroup control={c} name="processing" options={OPTIONS.processing} value={str('det.processing')} onChange={(v) => set('det.processing', v)} />}
        </BoundRow>
        <BoundRow id="det.night">{(c) => <RowSwitch control={c} checked={Boolean(values['det.night'])} onChange={(v) => set('det.night', v)} />}</BoundRow>
        <BoundRow id="det.motion" helper={num('det.motion') >= 80 ? 'High: expect more events from trees, shadows and rain' : 'Balanced for most outdoor cameras'}>
          {(c) => <Slider control={c} value={num('det.motion')} min={10} max={100} step={5} unit="%" onChange={(v) => set('det.motion', v)} />}
        </BoundRow>
        <BoundRow id="det.clip" group>
          {(c) => <RadioGroup control={c} name="clip" options={OPTIONS.clip} value={str('det.clip')} onChange={(v) => set('det.clip', v)} />}
        </BoundRow>
        <BoundRow id="det.snapshot">
          {(c) => <RowSelect control={c} options={OPTIONS.snapshot} value={str('det.snapshot')} onChange={(v) => set('det.snapshot', v)} className="max-w-[200px]!" />}
        </BoundRow>
      </SectionCard>

      <section aria-labelledby="module-settings-heading" className="space-y-3">
        <div>
          <h3 id="module-settings-heading" className="text-[16px] leading-[24px] font-semibold text-[#121722]">
            Module settings
          </h3>
          <p className="mt-0.5 text-[12px] leading-[16px] text-[#4B5465]">One card per module in your license. Modules you don’t have are shown locked.</p>
        </div>
        {MODULES.map((m) => {
          const licensed = LICENSED_MODULES.has(m.id);
          return (
            <ModuleCard key={m.id} title={m.label} description={m.description} licensed={licensed} open={open.includes(m.id)} onToggle={() => toggleCard(m.id)}>
              <ModuleRows module={m.id} lock={licensed ? undefined : NOT_LICENSED} />
            </ModuleCard>
          );
        })}
      </section>

      {testing && <TestDetectionModal threshold={num('det.motion')} onClose={() => setTesting(false)} />}
    </>
  );
};
