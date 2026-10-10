import React, { useState } from 'react';
import { BellRing, Plus } from 'lucide-react';
import { ConfirmDestructiveModal } from '../../profile/modals/ConfirmDestructiveModal';
import { BUTTON, Badge } from '../../profile/ui';
import { useSettings } from '../SettingsContext';
import { AlertRule, RULE_EVENTS, RuleDraft, emptyRule, eventForRule, exampleRule, getRules, moduleLabel } from '../data/rules';
import { allZones } from '../data/sites';
import { SectionCard } from '../patterns/SectionCard';
import { Switch } from '../patterns/SettingRow';
import { TABLE } from '../patterns/table';
import { RuleBuilderDrawer } from '../drawers/RuleBuilderDrawer';

const SEVERITY: Record<AlertRule['severity'], React.ReactNode> = {
  critical: <Badge tone="critical">Critical</Badge>,
  info: <Badge tone="info">Info</Badge>,
  neutral: <Badge tone="neutral">Neutral</Badge>,
};

export const AlertRules: React.FC = () => {
  const { state, viewOnly, toast, undoToast, announce, marker } = useSettings();
  const zones = allZones();
  const [rules, setRules] = useState<AlertRule[]>(() => getRules());
  const [builder, setBuilder] = useState<{ draft: RuleDraft; editId?: string } | null>(() =>
    state === 'rule-builder' && !viewOnly ? { draft: exampleRule(zones) } : null
  );
  const [deleting, setDeleting] = useState<AlertRule | null>(null);

  // Inline toggles save straight away, with Undo.
  const toggle = (rule: AlertRule, enabled: boolean) => {
    setRules((list) => list.map((r) => (r.id === rule.id ? { ...r, enabled } : r)));
    undoToast(`“${rule.name}” turned ${enabled ? 'on' : 'off'}`, () => setRules((list) => list.map((r) => (r.id === rule.id ? { ...r, enabled: !enabled } : r))));
  };

  const create = !viewOnly && (
    <button type="button" onClick={() => setBuilder({ draft: emptyRule() })} className={BUTTON.secondary}>
      <Plus className="w-4 h-4" aria-hidden="true" />
      Create rule
    </button>
  );

  return (
    <>
      <SectionCard
        title="Rules"
        description={`${rules.filter((r) => r.enabled).length} of ${rules.length} on · Toggles save straight away`}
        settingId="alerts.rules"
        overlay={marker(5)}
        actions={rules.length ? create : undefined}
      >
        {rules.length === 0 ? (
          <div className="px-6 py-14 flex flex-col items-center text-center gap-3">
            <BellRing className="w-8 h-8 text-[#1E63FF]" aria-hidden="true" />
            <p className="text-[14px] text-[#353D4C]">No alert rules yet.</p>
            {create}
          </div>
        ) : (
          <div className={TABLE.scroll}>
            <table className={`${TABLE.table} min-w-[1080px]`}>
              <caption className="sr-only">Alert rules</caption>
              <thead>
                <tr className={TABLE.headRow}>
                  {['Rule name', 'Module', 'Trigger', 'Severity', 'Notify', 'Schedule', 'Enabled'].map((h) => (
                    <th key={h} scope="col" className={TABLE.th}>
                      {h}
                    </th>
                  ))}
                  <th scope="col" className={TABLE.th}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className={TABLE.body}>
                {rules.map((r) => (
                  <tr key={r.id} className={TABLE.row}>
                    <th scope="row" className={`${TABLE.td} text-left font-medium text-[#121722] whitespace-normal min-w-[200px]`}>
                      {r.name}
                    </th>
                    <td className={TABLE.td}>{moduleLabel(r.module)}</td>
                    <td className={TABLE.td}>{r.trigger}</td>
                    <td className={TABLE.td}>{SEVERITY[r.severity]}</td>
                    <td className={TABLE.td}>{r.notify}</td>
                    <td className={TABLE.td}>{r.schedule}</td>
                    <td className={TABLE.td}>
                      <span className="inline-flex items-center gap-1.5">
                        <Switch checked={r.enabled} onChange={(v) => toggle(r, v)} label={`${r.name} enabled`} disabled={viewOnly} />
                        <span className="text-[13px]" aria-hidden="true">
                          {r.enabled ? 'On' : 'Off'}
                        </span>
                      </span>
                    </td>
                    <td className={`${TABLE.td} text-right`}>
                      {!viewOnly && (
                        <span className="inline-flex gap-1">
                          <button
                            type="button"
                            onClick={() => setBuilder({ draft: { ...exampleRule(zones), name: r.name, module: r.module, event: eventForRule(r), severity: r.severity === 'critical' ? 'critical' : 'info' }, editId: r.id })}
                            className={BUTTON.ghostSm}
                            aria-label={`Edit ${r.name}`}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRules((list) => [...list, { ...r, id: `${r.id}-copy-${list.length}`, name: `${r.name} (copy)`, enabled: false }]);
                              toast(`Duplicated “${r.name}”. The copy is off until you turn it on.`, 'success');
                            }}
                            className={BUTTON.ghostSm}
                            aria-label={`Duplicate ${r.name}`}
                          >
                            Duplicate
                          </button>
                          <button type="button" onClick={() => setDeleting(r)} className={BUTTON.ghostSm} aria-label={`Delete ${r.name}`}>
                            Delete
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {builder && (
        <RuleBuilderDrawer
          zones={zones}
          initial={builder.draft}
          editing={Boolean(builder.editId)}
          overlay={marker(10, true)}
          onClose={() => setBuilder(null)}
          onTest={() => toast('Test alert sent to you by the chosen channels', 'info')}
          onSave={(draft) => {
            const row: AlertRule = {
              id: builder.editId ?? `rule-new-${rules.length}`,
              name: draft.name.trim(),
              module: draft.module,
              trigger: RULE_EVENTS.find((e) => e.value === draft.event)?.label ?? draft.event,
              severity: draft.severity,
              notify: draft.roles.join(', '),
              schedule: draft.schedule === 'always' ? 'Always' : draft.schedule === 'working' ? 'Working hours' : `${draft.customFrom}–${draft.customTo}`,
              enabled: true,
            };
            setRules((list) => (builder.editId ? list.map((r) => (r.id === row.id ? row : r)) : [...list, row]));
            setBuilder(null);
            toast(`Rule “${row.name}” saved`, 'success');
            announce(`Rule ${row.name} saved`);
          }}
        />
      )}
      {deleting && (
        <ConfirmDestructiveModal
          title={`Delete “${deleting.name}”?`}
          body="Alerts already raised by this rule stay in the log. No new alerts will be raised."
          confirmLabel="Delete rule"
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            setRules((list) => list.filter((r) => r.id !== deleting.id));
            setDeleting(null);
            toast(`Deleted “${deleting.name}”`, 'success');
          }}
        />
      )}
    </>
  );
};
