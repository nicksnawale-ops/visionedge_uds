import React, { useEffect, useId, useState } from 'react';
import { Lock } from 'lucide-react';
import { ExampleFrame } from '../ExampleFrame';
import { LineTabs } from '../components/LineTabs';
import { TabPanels } from '../components/TabPanel';
import { ConfirmModal } from '../components/ConfirmModal';
import { useTabUrlSync } from '../components/useTabUrlSync';
import { Activation, TabItem, reducedMotion } from '../components/tabStyles';
import { BASIC, WITH_ICONS } from '../tabsSpec';
import { samplePanel } from './panels';

const KEYS: [string, string][] = [
  ['Tab', 'Moves into the tab list (to the selected tab), then on to the panel'],
  ['← / →', 'Previous / next tab, wrapping at the ends (↑ / ↓ for vertical tabs)'],
  ['Home / End', 'First / last tab'],
  ['Enter / Space', 'Activates the focused tab (manual activation)'],
  ['Delete', 'Closes the focused tab (closable tabs)'],
];

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="inline-flex items-center h-6 px-1.5 rounded-[4px] border border-[#C3CAD5] bg-[#F7F9FC] font-mono text-[12px] text-[#121722] whitespace-nowrap">{children}</kbd>
);

/* ── Keyboard + activation ── */

const KeyboardDemo: React.FC = () => {
  const [activation, setActivation] = useState<Activation>('automatic');
  const [v, setV] = useState('overview');
  const name = useId();
  return (
    <div className="space-y-5">
      <fieldset className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <legend className="float-left mr-4 text-[14px] font-semibold text-[#121722]">Activation</legend>
        {(['automatic', 'manual'] as const).map((a) => (
          <label key={a} className="inline-flex items-center gap-2 min-h-[44px] text-[14px] text-[#353D4C] cursor-pointer">
            <input type="radio" name={name} checked={activation === a} onChange={() => setActivation(a)} className="w-4 h-4 accent-[#1E63FF]" />
            {a === 'automatic' ? 'Automatic (select on focus)' : 'Manual (Enter or Space)'}
          </label>
        ))}
      </fieldset>
      <LineTabs items={WITH_ICONS} value={v} onChange={setV} label="Keyboard example" activation={activation}>
        {(api) => (
          <>
            <p className="pt-3 text-[12px] text-[#6B7485]">
              Focused: <span className="font-medium text-[#121722]">{WITH_ICONS.find((i) => i.id === api.focused)?.label ?? '—'}</span> · Selected:{' '}
              <span className="font-medium text-[#121722]">{WITH_ICONS.find((i) => i.id === v)?.label}</span>
            </p>
            <div className="pt-4">
              <TabPanels api={api} value={v} render={samplePanel(WITH_ICONS)} />
            </div>
          </>
        )}
      </LineTabs>
      <table className="w-full text-left border-collapse">
        <caption className="sr-only">Keyboard support</caption>
        <tbody className="divide-y divide-[#DDE2EA]">
          {KEYS.map(([k, d]) => (
            <tr key={k}>
              <th scope="row" className="py-2 pr-4 align-top w-[130px]">
                <Kbd>{k}</Kbd>
              </th>
              <td className="py-2 text-[14px] text-[#4B5465]">{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const KEYBOARD_CODE = `// Roving tabindex + arrow keys (WAI-ARIA tabs pattern)
const onKeyDown = (e: React.KeyboardEvent, index: number) => {
  const go = (i: number) => {
    const t = tabs[(i + tabs.length) % tabs.length];
    refs.current[t.id]?.focus();
    if (activation === 'automatic' && !t.disabled) setActive(t.id); // manual: wait for Enter/Space
  };
  if (e.key === 'ArrowRight') go(index + 1);
  else if (e.key === 'ArrowLeft') go(index - 1);
  else if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(tabs.length - 1);
  else if (e.key === 'Enter' || e.key === ' ') !tabs[index].disabled && setActive(tabs[index].id);
  else return;
  e.preventDefault();
};

<button role="tab" tabIndex={active === tab.id ? 0 : -1} onKeyDown={(e) => onKeyDown(e, i)} … />`;

/* ── URL sync ── */

const URL_IDS = BASIC.map((b) => b.id);

const UrlSyncDemo: React.FC = () => {
  const [v, setV, url] = useTabUrlSync('tab', URL_IDS, 'overview');
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 h-9 px-3 rounded-[8px] border border-[#DDE2EA] bg-[#F7F9FC] font-mono text-[12px] text-[#353D4C] overflow-hidden">
        <Lock className="w-3.5 h-3.5 shrink-0 text-[#6B7485]" aria-hidden="true" />
        <span className="truncate" aria-label="Current address">
          {url}
        </span>
      </div>
      <LineTabs items={BASIC} value={v} onChange={setV} label="URL example">
        {(api) => (
          <div className="pt-5">
            <TabPanels api={api} value={v} render={samplePanel(BASIC)} />
          </div>
        )}
      </LineTabs>
    </div>
  );
};

const URL_CODE = `// Sync the active tab with ?tab= so it can be shared and survives a refresh
const read = () => new URLSearchParams(location.search).get('tab') ?? 'overview';
const [tab, setTab] = useState(read);

const select = (id: string) => {
  setTab(id);
  const u = new URL(location.href);
  u.searchParams.set('tab', id);
  history.replaceState(history.state, '', u); // no extra history entries
};

useEffect(() => {
  const onPop = () => setTab(read());
  window.addEventListener('popstate', onPop);
  return () => window.removeEventListener('popstate', onPop);
}, []);`;

/* ── Persistence + lazy panels ── */

const PERSIST_ITEMS: TabItem[] = [
  { id: 'notes', label: 'Notes' },
  { id: 'log', label: 'Log' },
  { id: 'summary', label: 'Summary' },
];
const LOG = Array.from({ length: 30 }, (_, i) => `${String(8 + Math.floor(i / 4)).padStart(2, '0')}:${String((i * 13) % 60).padStart(2, '0')} · Gate ${(i % 4) + 1} · Vehicle KA 01 AB ${String(1200 + i * 7)}`);

const PersistDemo: React.FC = () => {
  const [v, setV] = useState('notes');
  const [visited, setVisited] = useState<string[]>(['notes']);
  const [note, setNote] = useState('');
  const select = (id: string) => {
    setV(id);
    setVisited((s) => (s.includes(id) ? s : [...s, id]));
  };
  return (
    <LineTabs items={PERSIST_ITEMS} value={v} onChange={select} label="Persistence example">
      {(api) => (
        <>
          <p className="pt-3 text-[12px] text-[#6B7485]">
            Mounted panels: <span className="font-medium text-[#121722]">{PERSIST_ITEMS.filter((i) => visited.includes(i.id)).map((i) => i.label).join(', ')}</span>
          </p>
          <div className="pt-4">
            <TabPanels
              api={api}
              value={v}
              render={(id) =>
                id === 'notes' ? (
                  <label className="block">
                    <span className="block mb-1.5 text-[14px] font-medium text-[#121722]">Shift note</span>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder="Type here, switch tabs, then come back"
                      className="w-full px-3 py-2 rounded-[8px] border border-[#8C95A6] text-[14px] text-[#121722] placeholder:text-[#6B7485] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20"
                    />
                  </label>
                ) : id === 'log' ? (
                  <ul className="h-[140px] overflow-y-auto rounded-[8px] border border-[#DDE2EA] divide-y divide-[#DDE2EA]" aria-label="Gate log">
                    {LOG.map((l) => (
                      <li key={l} className="px-3 py-2 font-mono text-[12px] text-[#353D4C]">
                        {l}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[14px] text-[#4B5465]">This panel was only rendered when you first opened it.</p>
                )
              }
            />
          </div>
        </>
      )}
    </LineTabs>
  );
};

const PERSIST_CODE = `// Lazy, then kept mounted: render a panel the first time it opens and hide (don't unmount) it after
const [visited, setVisited] = useState([active]);
if (!visited.includes(active)) setVisited([...visited, active]);

{visited.map((id) => (
  <div key={id} role="tabpanel" id={'panel-' + id} aria-labelledby={'tab-' + id} tabIndex={0} hidden={id !== active}>
    {renderPanel(id)}
  </div>
))}`;

/* ── Unsaved changes ── */

const UNSAVED_ITEMS: TabItem[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
];
const SAVED_NAME = 'Gate 3 operator';

const UnsavedDemo: React.FC = () => {
  const [v, setV] = useState('profile');
  const [saved, setSaved] = useState(SAVED_NAME);
  const [name, setName] = useState(SAVED_NAME);
  const [pending, setPending] = useState<string | null>(null);
  const dirty = name !== saved;
  const inputId = useId();

  const request = (id: string) => {
    if (v === 'profile' && dirty) setPending(id);
    else setV(id);
  };

  return (
    <>
      <LineTabs items={UNSAVED_ITEMS} value={v} onChange={request} label="Unsaved changes example" activation="manual">
        {(api) => (
          <div className="pt-5">
            <TabPanels
              api={api}
              value={v}
              render={(id) =>
                id === 'profile' ? (
                  <div className="space-y-3 max-w-[360px]">
                    <div>
                      <label htmlFor={inputId} className="block mb-1.5 text-[14px] font-medium text-[#121722]">
                        Display name
                      </label>
                      <input
                        id={inputId}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-10 px-3 rounded-[8px] border border-[#8C95A6] text-[14px] text-[#121722] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSaved(name)}
                        disabled={!dirty}
                        className="h-10 px-4 rounded-[8px] bg-[#1E63FF] text-[14px] font-semibold text-white hover:bg-[#0B2D6B] disabled:bg-[#DDE2EA] disabled:text-[#8C95A6] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
                      >
                        Save
                      </button>
                      <span className="text-[13px] text-[#6B7485]" aria-live="polite">
                        {dirty ? 'Unsaved changes' : 'All changes saved'}
                      </span>
                    </div>
                  </div>
                ) : (
                  samplePanel(UNSAVED_ITEMS)(id)
                )
              }
            />
          </div>
        )}
      </LineTabs>
      {pending && (
        <ConfirmModal
          title="Discard unsaved changes?"
          body="You changed your display name. If you switch tabs now, that change will be lost."
          cancelLabel="Keep editing"
          confirmLabel="Discard changes"
          onCancel={() => setPending(null)}
          onConfirm={() => {
            setName(saved);
            setV(pending);
            setPending(null);
          }}
        />
      )}
    </>
  );
};

const UNSAVED_CODE = `// Confirm before leaving a tab with unsaved edits
const request = (id: string) => {
  if (active === 'profile' && isDirty) setPending(id); // open the confirmation
  else setActive(id);
};

{pending && (
  <ConfirmDialog
    title="Discard unsaved changes?"
    cancelLabel="Keep editing"      // default focus: the safe choice
    confirmLabel="Discard changes"
    onCancel={() => setPending(null)}
    onConfirm={() => { reset(); setActive(pending); setPending(null); }}
  />
)}`;

/* ── Motion ── */

const MOTION: [string, string][] = [
  ['Active indicator', 'Slides to the new tab, 200ms ease-out'],
  ['Panel', 'Fades in, 150ms ease-out; no slide'],
  ['Segmented / contained', 'Colour change only, 150ms'],
  ['Reduced motion', 'Indicator jumps, no fade, no smooth scrolling'],
];

const MotionDemo: React.FC = () => {
  const [v, setV] = useState('overview');
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(reducedMotion());
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return (
    <div className="space-y-5">
      <LineTabs items={WITH_ICONS} value={v} onChange={setV} label="Motion example">
        {(api) => (
          <div className="pt-5">
            <TabPanels api={api} value={v} render={samplePanel(WITH_ICONS)} />
          </div>
        )}
      </LineTabs>
      <p className="text-[12px] text-[#6B7485]">
        Your system setting: <span className="font-medium text-[#121722]">{reduced ? 'reduce motion (animations off)' : 'no preference (animations on)'}</span>
      </p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MOTION.map(([t, d]) => (
          <div key={t} className="rounded-[8px] border border-[#DDE2EA] p-3">
            <dt className="text-[14px] font-semibold text-[#121722]">{t}</dt>
            <dd className="mt-0.5 text-[13px] text-[#4B5465]">{d}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

const MOTION_CODE = `// Indicator: animate left/width after the first placement; skip with reduced motion
<span
  aria-hidden="true"
  className="absolute -bottom-px h-[2px] bg-[#1E63FF] motion-safe:transition-[left,width] motion-safe:duration-200 motion-safe:ease-out"
  style={{ left, width }}
/>

// Panel fade
if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
  panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease-out' });`;

/** Keyboard, activation, URL sync, persistence, lazy panels, unsaved changes and motion. */
export const BehaviorDemos: React.FC = () => (
  <div className="space-y-8">
    <ExampleFrame title="Keyboard and activation" useWhen="always. Automatic suits instant panels; use manual when opening a panel is slow or costly." code={KEYBOARD_CODE}>
      <KeyboardDemo />
    </ExampleFrame>
    <ExampleFrame title="URL sync" useWhen="the view should be shareable, bookmarkable or survive a refresh, such as ?tab=activity." code={URL_CODE}>
      <UrlSyncDemo />
    </ExampleFrame>
    <ExampleFrame title="Persistence and lazy panels" useWhen="panels hold input, scroll position or expensive content. Render on first open, then keep mounted." code={PERSIST_CODE}>
      <PersistDemo />
    </ExampleFrame>
    <ExampleFrame title="Unsaved changes" useWhen="a panel has edits that would be lost. Ask before switching; focus starts on Keep editing." code={UNSAVED_CODE}>
      <UnsavedDemo />
    </ExampleFrame>
    <ExampleFrame title="Motion" useWhen="always: short, functional motion only, and none when reduced motion is on." code={MOTION_CODE}>
      <MotionDemo />
    </ExampleFrame>
  </div>
);
