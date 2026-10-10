import React, { useId, useMemo, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Field, FieldErrorText } from '../../shared/authUi';
import { BUTTON, CHECKBOX, IconButton, RADIO, TEXT_INPUT } from '../../profile/ui';
import { SettingsSelect } from '../parts/SettingsSelect';
import { Drawer } from '../patterns/Drawer';
import { ToggleChips } from '../patterns/ChipsInput';
import { TimeRangeSelect } from '../patterns/TimeRangeSelect';
import { CONDITION_FIELDS, Channel, OPERATORS, RULE_MODULES, RULE_ROLES, RuleDraft, RuleModule, Schedule, eventsFor, ruleSummary } from '../data/rules';

interface RuleBuilderDrawerProps {
  zones: string[];
  initial: RuleDraft;
  editing: boolean;
  onSave: (draft: RuleDraft, summary: string) => void;
  onTest: (summary: string) => void;
  onClose: () => void;
  overlay?: React.ReactNode;
}

/** A labelled block of the sentence: WHEN / IF / THEN / ESCALATE. */
const Block: React.FC<{ word: string; hint: string; children: React.ReactNode }> = ({ word, hint, children }) => (
  <fieldset className="relative pl-4 border-l-2 border-[#1E63FF]/30">
    <legend className="flex items-baseline gap-2 mb-3">
      <span className="text-[11px] leading-[16px] font-semibold uppercase tracking-[0.08em] text-[#1E63FF]">{word}</span>
      <span className="text-[12px] text-[#4B5465]">{hint}</span>
    </legend>
    <div className="space-y-3">{children}</div>
  </fieldset>
);

const SUB = 'block mb-1 text-[12px] leading-[16px] font-medium text-[#4B5465]';
const CHANNELS: { value: Channel; label: string }[] = [
  { value: 'in-app', label: 'In-app' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
];
const SCHEDULES: { value: Schedule; label: string }[] = [
  { value: 'always', label: 'Always' },
  { value: 'working', label: 'Working hours' },
  { value: 'custom', label: 'Custom schedule' },
];

/** "New alert rule": WHEN … AT … DURING → IF → THEN notify … via … as … → ESCALATE, with a live plain-English summary. */
export const RuleBuilderDrawer: React.FC<RuleBuilderDrawerProps> = ({ zones, initial, editing, onSave, onTest, onClose, overlay }) => {
  const uid = useId();
  const [draft, setDraft] = useState<RuleDraft>(initial);
  const [errors, setErrors] = useState<{ name?: string; roles?: string }>({});
  const nextCondition = useRef(initial.conditions.length + 1);
  const summary = useMemo(() => ruleSummary(draft), [draft]);
  const patch = (p: Partial<RuleDraft>) => setDraft((d) => ({ ...d, ...p }));

  const save = () => {
    const next = { name: draft.name.trim() ? undefined : 'Enter a rule name', roles: draft.roles.length ? undefined : 'Choose who to notify' };
    setErrors(next);
    if (next.name) return document.getElementById(`${uid}-name`)?.focus();
    if (next.roles) return document.querySelector<HTMLElement>(`[aria-labelledby="${uid}-roles"] button`)?.focus();
    onSave(draft, summary);
  };

  return (
    <Drawer
      title={editing ? 'Edit alert rule' : 'New alert rule'}
      description="Build the rule as a sentence. The summary shows exactly what it will do."
      onClose={onClose}
      overlay={overlay}
      footer={
        <>
          <button type="button" onClick={onClose} className={BUTTON.ghost}>
            Cancel
          </button>
          <button type="button" onClick={() => onTest(summary)} className={BUTTON.secondary}>
            Send test alert
          </button>
          <button type="button" onClick={save} className={BUTTON.primary}>
            Save rule
          </button>
        </>
      }
    >
      <form noValidate onSubmit={(e) => (e.preventDefault(), save())} className="space-y-6">
        <Field id={`${uid}-name`} label="Rule name" value={draft.name} error={errors.name} placeholder="e.g. Watchlist vehicle at main gates" onChange={(e) => patch({ name: e.target.value })} />

        <Block word="When" hint="what happens, where and when">
          <div>
            <label id={`${uid}-module-label`} htmlFor={`${uid}-module`} className={SUB}>
              Module
            </label>
            <SettingsSelect
              id={`${uid}-module`}
              labelledBy={`${uid}-module-label`}
              value={draft.module}
              onChange={(v) => {
                const module = v as RuleModule;
                patch({ module, event: eventsFor(module)[0].value });
              }}
              options={RULE_MODULES}
            />
          </div>
          <div>
            <label id={`${uid}-event-label`} htmlFor={`${uid}-event`} className={SUB}>
              Event
            </label>
            <SettingsSelect id={`${uid}-event`} labelledBy={`${uid}-event-label`} value={draft.event} onChange={(v) => patch({ event: v })} options={eventsFor(draft.module)} />
          </div>
          <div>
            <span id={`${uid}-zones`} className={SUB}>
              At (leave empty for every site)
            </span>
            <ToggleChips options={zones.map((z) => ({ value: z, label: z }))} value={draft.zones} onChange={(v) => patch({ zones: v })} labelledBy={`${uid}-zones`} />
          </div>
          <div role="radiogroup" aria-labelledby={`${uid}-during`}>
            <span id={`${uid}-during`} className={SUB}>
              During
            </span>
            <div className="flex flex-wrap gap-x-5">
              {SCHEDULES.map((s) => (
                <label key={s.value} className="inline-flex items-center gap-2 min-h-[44px] text-[14px] text-[#121722] cursor-pointer">
                  <input type="radio" name={`${uid}-schedule`} checked={draft.schedule === s.value} onChange={() => patch({ schedule: s.value })} className={RADIO} />
                  {s.label}
                </label>
              ))}
            </div>
            {draft.schedule === 'custom' && (
              <TimeRangeSelect idPrefix={`${uid}-custom`} name="Custom schedule" from={draft.customFrom} to={draft.customTo} onFrom={(v) => patch({ customFrom: v })} onTo={(v) => patch({ customTo: v })} />
            )}
          </div>
        </Block>

        <Block word="If" hint="optional extra conditions">
          {draft.conditions.map((c, i) => (
            <div key={c.id} role="group" aria-label={`Condition ${i + 1}`} className="flex flex-wrap items-center gap-2">
              <SettingsSelect
                ariaLabel={`Condition ${i + 1} field`}
                size="sm"
                className="min-w-[150px]"
                value={c.field}
                onChange={(v) => patch({ conditions: draft.conditions.map((x) => (x.id === c.id ? { ...x, field: v } : x)) })}
                options={CONDITION_FIELDS}
              />
              <SettingsSelect
                ariaLabel={`Condition ${i + 1} operator`}
                size="sm"
                className="min-w-[120px]"
                value={c.operator}
                onChange={(v) => patch({ conditions: draft.conditions.map((x) => (x.id === c.id ? { ...x, operator: v } : x)) })}
                options={OPERATORS}
              />
              <input
                aria-label={`Condition ${i + 1} value`}
                value={c.value}
                placeholder="Value"
                onChange={(e) => patch({ conditions: draft.conditions.map((x) => (x.id === c.id ? { ...x, value: e.target.value } : x)) })}
                className={`${TEXT_INPUT} w-[120px]`}
              />
              <IconButton icon={X} label={`Remove condition ${i + 1}`} onClick={() => patch({ conditions: draft.conditions.filter((x) => x.id !== c.id) })} />
            </div>
          ))}
          <button
            type="button"
            onClick={() => patch({ conditions: [...draft.conditions, { id: nextCondition.current++, field: 'confidence', operator: 'above', value: '' }] })}
            className={BUTTON.ghostSm}
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Add condition
          </button>
        </Block>

        <Block word="Then" hint="who hears about it, and how">
          <div>
            <span id={`${uid}-roles`} className={SUB}>
              Notify
            </span>
            <ToggleChips options={RULE_ROLES.map((r) => ({ value: r, label: r }))} value={draft.roles} onChange={(v) => patch({ roles: v })} labelledBy={`${uid}-roles`} describedBy={`${uid}-roles-error`} />
            <div id={`${uid}-roles-error`} aria-live="polite">
              {errors.roles && !draft.roles.length && <FieldErrorText>{errors.roles}</FieldErrorText>}
            </div>
          </div>
          <fieldset>
            <legend className={SUB}>Via</legend>
            <div className="flex flex-wrap gap-x-5">
              {CHANNELS.map((ch) => (
                <label key={ch.value} className="inline-flex items-center gap-2 min-h-[44px] text-[14px] text-[#121722] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.channels.includes(ch.value)}
                    onChange={() => patch({ channels: draft.channels.includes(ch.value) ? draft.channels.filter((x) => x !== ch.value) : [...draft.channels, ch.value] })}
                    className={CHECKBOX}
                  />
                  {ch.label}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className={SUB}>Severity</legend>
            <div className="flex flex-wrap gap-x-5">
              {(['critical', 'info'] as const).map((s) => (
                <label key={s} className="inline-flex items-center gap-2 min-h-[44px] text-[14px] text-[#121722] cursor-pointer">
                  <input type="radio" name={`${uid}-severity`} checked={draft.severity === s} onChange={() => patch({ severity: s })} className={RADIO} />
                  {s === 'critical' ? 'Critical' : 'Info'}
                </label>
              ))}
            </div>
          </fieldset>
        </Block>

        <Block word="Escalate" hint="if nobody acknowledges it">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label id={`${uid}-after-label`} htmlFor={`${uid}-after`} className={SUB}>
                Not acknowledged in
              </label>
              <SettingsSelect
                id={`${uid}-after`}
                labelledBy={`${uid}-after-label`}
                className="w-[140px]"
                value={draft.escalateAfter}
                onChange={(v) => patch({ escalateAfter: v })}
                options={['5', '10', '15', '30'].map((m) => ({ value: m, label: `${m} min` }))}
              />
            </div>
            <div>
              <label id={`${uid}-to-label`} htmlFor={`${uid}-to`} className={SUB}>
                Escalate to
              </label>
              <SettingsSelect
                id={`${uid}-to`}
                labelledBy={`${uid}-to-label`}
                className="w-[220px]"
                value={draft.escalateTo}
                onChange={(v) => patch({ escalateTo: v })}
                options={[{ value: '', label: "Don't escalate" }, ...RULE_ROLES.map((r) => ({ value: r, label: r }))]}
              />
            </div>
          </div>
        </Block>

        <div className="rounded-[8px] bg-[#F7F9FC] border border-[#DDE2EA] p-4">
          <p className="text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">Rule summary</p>
          <p className="mt-1 text-[14px] leading-[22px] text-[#121722]" aria-live="polite">
            {summary}
          </p>
        </div>
        <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
      </form>
    </Drawer>
  );
};
