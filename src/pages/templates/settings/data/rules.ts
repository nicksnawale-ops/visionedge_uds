/** Alert rules across modules, plus the rule builder's options and plain-English summary. */
import { MODULES, ModuleId } from './system';

export type RuleSeverity = 'critical' | 'info' | 'neutral';

/** A module, or "all" for events every module raises (camera health, tampering). */
export type RuleModule = ModuleId | 'all';

export const RULE_MODULES: { value: RuleModule; label: string }[] = [{ value: 'all', label: 'All modules' }, ...MODULES.map((m) => ({ value: m.id, label: m.label }))];

export const moduleLabel = (m: RuleModule): string => RULE_MODULES.find((x) => x.value === m)?.label ?? m;

export interface AlertRule {
  id: string;
  name: string;
  module: RuleModule;
  trigger: string;
  severity: RuleSeverity;
  notify: string;
  schedule: string;
  enabled: boolean;
}

const RULES: Omit<AlertRule, 'id'>[] = [
  { name: 'Watchlist vehicle at any gate', module: 'anpr', trigger: 'Watchlist match', severity: 'critical', notify: 'Security supervisors', schedule: 'Always', enabled: true },
  { name: 'Unauthorized hostel exit', module: 'hosteltrack', trigger: 'Exit without outpass', severity: 'critical', notify: 'Hostel wardens', schedule: '22:00–06:00', enabled: true },
  { name: 'Long canteen queue', module: 'mealpulse', trigger: 'Estimated wait', severity: 'info', notify: 'Canteen managers', schedule: 'Meal windows', enabled: true },
  { name: 'Visitor overstayed', module: 'visitor', trigger: 'Pass expired', severity: 'info', notify: 'Operators', schedule: 'Working hours', enabled: true },
  { name: 'Camera offline > 5 min', module: 'all', trigger: 'Camera offline', severity: 'critical', notify: 'Administrators', schedule: 'Always', enabled: true },
];

export const getRules = (): AlertRule[] => RULES.map((r, i) => ({ ...r, id: `rule-${i}` }));

/* ── Rule builder ────────────────────────────────────────────────── */

export interface RuleEvent {
  value: string;
  label: string;
  phrase: string;
  module: RuleModule;
}

/** Events by module; "All modules" events come first. */
export const RULE_EVENTS: RuleEvent[] = [
  { value: 'tampering', label: 'Camera tampering', phrase: 'camera tampering is detected', module: 'all' },
  { value: 'line', label: 'Line crossing', phrase: 'someone crosses a line', module: 'all' },
  { value: 'offline', label: 'Camera offline', phrase: 'a camera goes offline', module: 'all' },
  { value: 'watchlist', label: 'Watchlist vehicle detected', phrase: 'a watchlist vehicle is detected', module: 'anpr' },
  { value: 'unknown', label: 'Unknown vehicle', phrase: 'an unknown vehicle is seen', module: 'anpr' },
  { value: 'low-confidence', label: 'Low-confidence read', phrase: 'a plate is read below the confidence threshold', module: 'anpr' },
  { value: 'unauthorized-exit', label: 'Unauthorized exit', phrase: 'a student exits without an outpass', module: 'hosteltrack' },
  { value: 'late-entry', label: 'Late entry', phrase: 'a student enters after curfew', module: 'hosteltrack' },
  { value: 'duplicate', label: 'Duplicate meal attempt', phrase: 'a duplicate meal attempt happens', module: 'mealpulse' },
  { value: 'queue', label: 'Long queue', phrase: 'the queue gets too long', module: 'mealpulse' },
  { value: 'visitor-watchlist', label: 'Watchlisted visitor', phrase: 'a watchlisted visitor arrives', module: 'visitor' },
  { value: 'overstay', label: 'Visitor overstayed', phrase: 'a visitor overstays their pass', module: 'visitor' },
];

export const eventsFor = (module: RuleModule): RuleEvent[] => RULE_EVENTS.filter((e) => e.module === module);

/** The builder event that best matches a rule's trigger (for Edit). */
const TRIGGER_EVENT: Record<string, string> = {
  'Watchlist match': 'watchlist',
  'Exit without outpass': 'unauthorized-exit',
  'Estimated wait': 'queue',
  'Pass expired': 'overstay',
  'Camera offline': 'offline',
};
export const eventForRule = (rule: AlertRule): string => {
  const match = TRIGGER_EVENT[rule.trigger];
  return match && eventsFor(rule.module).some((e) => e.value === match) ? match : eventsFor(rule.module)[0].value;
};

export const RULE_ROLES = ['Administrators', 'Security supervisors', 'Hostel wardens', 'Canteen managers', 'Operators'] as const;

export type Schedule = 'always' | 'working' | 'custom';
export type Channel = 'in-app' | 'email' | 'sms';

export interface RuleCondition {
  id: number;
  field: string;
  operator: string;
  value: string;
}

export interface RuleDraft {
  name: string;
  module: RuleModule;
  event: string;
  zones: string[];
  schedule: Schedule;
  customFrom: string;
  customTo: string;
  conditions: RuleCondition[];
  roles: string[];
  channels: Channel[];
  severity: 'critical' | 'info';
  escalateAfter: string;
  escalateTo: string;
}

export const CONDITION_FIELDS = [
  { value: 'confidence', label: 'Confidence' },
  { value: 'vehicle', label: 'Vehicle type' },
  { value: 'repeat', label: 'Times seen today' },
];
export const OPERATORS = [
  { value: 'is', label: 'is' },
  { value: 'above', label: 'is above' },
  { value: 'below', label: 'is below' },
];

const joinList = (items: string[], word = 'or'): string =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} ${word} ${items[items.length - 1]}`;

const CHANNEL_LABEL: Record<Channel, string> = { 'in-app': 'in-app', email: 'email', sms: 'SMS' };

/** "When a watchlist vehicle is detected at Gate 1 or Gate 3, at any time, notify … Escalate to …" */
export function ruleSummary(draft: RuleDraft): string {
  const event = RULE_EVENTS.find((e) => e.value === draft.event)?.phrase ?? 'the event happens';
  const where = draft.zones.length ? ` at ${joinList(draft.zones)}` : ' at any site';
  const when =
    draft.schedule === 'always' ? 'at any time' : draft.schedule === 'working' ? 'during working hours' : `between ${draft.customFrom} and ${draft.customTo}`;
  const conds = draft.conditions
    .filter((c) => c.value.trim())
    .map((c) => `${CONDITION_FIELDS.find((f) => f.value === c.field)?.label.toLowerCase()} ${OPERATORS.find((o) => o.value === c.operator)?.label} ${c.value.trim()}`);
  const ifPart = conds.length ? `, if ${joinList(conds, 'and')}` : '';
  const who = draft.roles.length ? joinList(draft.roles, 'and') : 'nobody yet';
  const how = draft.channels.length ? ` by ${joinList(draft.channels.map((c) => CHANNEL_LABEL[c]), 'and')}` : '';
  const severity = draft.severity === 'critical' ? 'Critical' : 'Info';
  const escalate = draft.escalateTo ? ` Escalate to ${draft.escalateTo} after ${draft.escalateAfter} minutes.` : '';
  return `When ${event}${where}, ${when}${ifPart}, notify ${who}${how} as ${severity}.${escalate}`;
}

export const emptyRule = (): RuleDraft => ({
  name: '',
  module: 'all',
  event: eventsFor('all')[0].value,
  zones: [],
  schedule: 'always',
  customFrom: '22:00',
  customTo: '06:00',
  conditions: [],
  roles: [],
  channels: ['in-app'],
  severity: 'info',
  escalateAfter: '10',
  escalateTo: '',
});

/** The filled example used by the "Rule builder" state. */
export const exampleRule = (zones: string[]): RuleDraft => ({
  ...emptyRule(),
  name: `${eventsFor('all')[0].label} at ${zones[0]} or ${zones[2] ?? zones[1]}`,
  zones: [zones[0], zones[2] ?? zones[1]],
  roles: ['Security supervisors'],
  channels: ['in-app', 'sms'],
  severity: 'critical',
  escalateTo: 'Administrators',
});
