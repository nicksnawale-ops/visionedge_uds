import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eye } from 'lucide-react';
import { ToastProvider, useToast } from '../../../components/common/Toast';
import { InfoAlert } from '../shared/authUi';
import { LOGIN_PREVIEW_PATH } from '../login/paths';
import { AppShell } from '../dashboard/shell/AppShell';
import { initialAlerts } from '../dashboard/data/alerts';
import { SETTINGS_SHELL, SETTINGS_USE_CASE } from './settingsShell';
import { UnsavedChangesBar } from '../profile/UnsavedChangesBar';
import { ConfirmDestructiveModal } from '../profile/modals/ConfirmDestructiveModal';
import { Skeleton } from '../profile/ui';
import { SettingsContext, SettingsContextValue } from './SettingsContext';
import { SectionFrame, SettingsLayout } from './SettingsLayout';
import { SettingsHeader } from './SettingsHeader';
import { SettingsSearch } from './SettingsSearch';
import { SelectSettingsNav, TabSettingsNav, VerticalSettingsNav } from './SettingsNav';
import { AnatomyMarker } from './AnatomyOverlay';
import { UndoToast, UndoToastItem } from './patterns/UndoToast';
import { General } from './sections/General';
import { Sites } from './sections/Sites';
import { License } from './sections/License';
import { Cameras } from './sections/Cameras';
import { Detection } from './sections/Detection';
import { AlertRules } from './sections/AlertRules';
import { UsersRoles } from './sections/UsersRoles';
import { Integrations } from './sections/Integrations';
import { DataPrivacy } from './sections/DataPrivacy';
import { AuditLog } from './sections/AuditLog';
import { System } from './sections/System';
import {
  FLASH_MS,
  SAVE_DELAY_MS,
  SettingsRole,
  SettingsSectionId,
  SettingsStateId,
  UNDO_MS,
  getSettingsSection,
  getSettingsState,
  roleForState,
} from './settingsStates';
import {
  INVALID_VALUES,
  SETTING_DEFS,
  SettingDef,
  SettingValue,
  SettingValues,
  UNSAVED_CHANGES,
  defaultValues,
  rowOfValue,
  validateSettings,
  valueIdsOf,
} from './data/settingsIndex';
import { getCameras } from './data/cameras';

export interface SettingsScreenProps {
  state?: SettingsStateId;
  role?: SettingsRole;
  /** Section to show; changing it later navigates (through the unsaved-changes guard). */
  section?: SettingsSectionId;
  onSectionChange?: (section: SettingsSectionId) => void;
  /** Full-screen route: fill the viewport and own the page landmarks. */
  fillViewport?: boolean;
  showAnatomy?: boolean;
}

const SECTIONS: Record<SettingsSectionId, React.FC> = {
  general: General,
  sites: Sites,
  license: License,
  cameras: Cameras,
  detection: Detection,
  alerts: AlertRules,
  users: UsersRoles,
  integrations: Integrations,
  privacy: DataPrivacy,
  audit: AuditLog,
  system: System,
};

const same = (a: SettingValue | undefined, b: SettingValue | undefined) => JSON.stringify(a) === JSON.stringify(b);

/**
 * VisionEdge settings: product AppShell ("Settings" active) + header with search + grouped section nav
 * + the selected section. Form settings save through one sticky bar; leaving with changes asks first.
 */
export const SettingsScreen: React.FC<SettingsScreenProps> = (props) => (
  // Toasts sit bottom-right in the product (the shared provider stacks them top-right).
  <div className={`${props.fillViewport ? '' : 'h-full'} [&>.fixed]:top-auto! [&>.fixed]:bottom-5!`}>
    <ToastProvider>
      <SettingsContent key={`${props.state ?? 'default'}-${roleForState(props.state ?? 'default', props.role ?? 'admin')}`} {...props} />
    </ToastProvider>
  </div>
);

const SettingsContent: React.FC<SettingsScreenProps> = ({
  state = 'default',
  role: requestedRole = 'admin',
  section: sectionProp,
  onSectionChange,
  fillViewport = false,
  showAnatomy = false,
}) => {
  const { showToast } = useToast();
  const role = roleForState(state, requestedRole);
  const viewOnly = role === 'viewer';
  const loading = state === 'loading';
  const defs = SETTING_DEFS;

  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  /* ── Values: saved vs draft ── */
  const [saved, setSaved] = useState<SettingValues>(() => (state === 'saved' ? { ...defaultValues(), ...UNSAVED_CHANGES } : defaultValues()));
  const [draft, setDraft] = useState<SettingValues>(() => {
    if (state === 'unsaved' || state === 'saving') return { ...defaultValues(), ...UNSAVED_CHANGES };
    if (state === 'validation') return { ...defaultValues(), ...INVALID_VALUES };
    return state === 'saved' ? { ...defaultValues(), ...UNSAVED_CHANGES } : defaultValues();
  });
  const [touched, setTouched] = useState<string[]>(state === 'validation' ? ['hours.time', 'contact.supportEmail'] : []);
  const [saving, setSaving] = useState(state === 'saving');

  const isModified = useCallback((rowId: string) => valueIdsOf(rowId).some((id) => !same(draft[id], saved[id])), [draft, saved]);
  const modifiedRows = defs.filter((d) => !d.item && isModified(d.id));
  const dirty = modifiedRows.length > 0;
  const allErrors = useMemo(() => validateSettings(draft), [draft]);
  const errors = useMemo(() => Object.fromEntries(Object.entries(allErrors).filter(([k]) => touched.includes(k))), [allErrors, touched]);

  /* ── Section, guard, search jump ── */
  const [section, setSection] = useState<SettingsSectionId>(sectionProp ?? getSettingsState(state).section);
  const [guard, setGuard] = useState<{ next: SettingsSectionId; jump?: string } | null>(null);
  const [jump, setJump] = useState<{ id: string; n: number } | null>(null);
  const focusHeading = useRef(false);
  const [query, setQuery] = useState(state === 'search' ? 'retention' : '');
  const [searchOpen, setSearchOpen] = useState(state === 'search');

  /* ── Other screen state ── */
  const [smsError, setSmsError] = useState(true);
  const [liveMessage, setLiveMessage] = useState('');
  const announce = useCallback((m: string) => setLiveMessage(m), []);
  const toast = useCallback((m: string, type: 'success' | 'info' | 'critical' = 'success') => showToast(m, type), [showToast]);
  const [undo, setUndo] = useState<UndoToastItem | null>(null);
  const undoTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(undoTimer.current), []);

  const undoToast = useCallback(
    (message: string, onUndo: () => void) => {
      window.clearTimeout(undoTimer.current);
      setUndo({ id: Date.now(), message, onUndo });
      announce(`${message}. Undo available for 5 seconds.`);
      undoTimer.current = window.setTimeout(() => setUndo(null), UNDO_MS);
    },
    [announce]
  );

  // Saved state: the toast with Undo appears as the screen opens.
  useEffect(() => {
    if (state !== 'saved') return;
    undoToast('Settings saved', () => {
      setSaved(defaultValues());
      setDraft(defaultValues());
    });
  }, []); // Once, when the Saved state opens.

  const navigate = useCallback(
    (next: SettingsSectionId, jumpId?: string) => {
      setSection(next);
      onSectionChange?.(next);
      if (jumpId) setJump({ id: jumpId, n: Date.now() });
      else focusHeading.current = true;
    },
    [onSectionChange]
  );

  const goTo = useCallback(
    (next: SettingsSectionId, jumpId?: string) => {
      if (next === section) {
        if (jumpId) setJump({ id: jumpId, n: Date.now() });
        return;
      }
      if (dirty && !saving) setGuard({ next, jump: jumpId });
      else navigate(next, jumpId);
    },
    [section, dirty, saving, navigate]
  );

  // Focus the section heading after a nav switch; scroll to and flash a search result.
  useEffect(() => {
    if (focusHeading.current) {
      focusHeading.current = false;
      headingRef.current?.focus();
    }
  }, [section]);

  useEffect(() => {
    if (!jump) return;
    // Wait a frame for the section (and any tab it opens) to render.
    const t = window.setTimeout(() => {
      const el = rootRef.current?.querySelector<HTMLElement>(`[data-setting-id="${jump.id}"]`);
      if (!el) return;
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      el.focus({ preventScroll: true });
      if (el.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.animate([{ backgroundColor: 'rgba(30, 99, 255, 0.08)' }, { backgroundColor: 'rgba(30, 99, 255, 0)' }], { duration: FLASH_MS, easing: 'ease-out' });
      }
    }, 60);
    timers.current.push(t);
  }, [jump]);

  // The showcase Section select (or ?section=) asks to navigate.
  const firstSectionProp = useRef(true);
  useEffect(() => {
    if (firstSectionProp.current) {
      firstSectionProp.current = false;
      return;
    }
    if (sectionProp && sectionProp !== section) goTo(sectionProp);
  }, [sectionProp]); // Only when the requested section changes.

  // "/" focuses the settings search (not while typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)) return;
      if (!fillViewport && !rootRef.current?.contains(target)) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fillViewport]);

  /* ── Save / discard ── */
  const discard = useCallback(() => {
    setDraft(saved);
    setTouched([]);
  }, [saved]);

  const save = () => {
    if (saving) return;
    const invalid = Object.keys(allErrors);
    if (invalid.length) {
      setTouched((t) => [...new Set([...t, ...invalid])]);
      const first = defs.find((d) => invalid.includes(d.id));
      const row = first && rootRef.current?.querySelector<HTMLElement>(`[data-setting-id="${first.id}"]`);
      row?.querySelector<HTMLElement>('input:not([type="hidden"]):not([tabindex="-1"]), select, button, textarea')?.focus();
      announce(`Check ${invalid.length === 1 ? '1 setting' : `${invalid.length} settings`} before saving`);
      return;
    }
    setSaving(true);
    announce('Saving changes');
    const before = saved;
    const after = draft;
    timers.current.push(
      window.setTimeout(() => {
        setSaving(false);
        setSaved(after);
        setTouched([]);
        undoToast('Settings saved', () => {
          setSaved(before);
          setDraft(before);
        });
      }, SAVE_DELAY_MS)
    );
  };

  /* ── Shell ── */
  const [site, setSite] = useState(SETTINGS_SHELL.site);
  const [live, setLive] = useState(true);
  const [userCollapsed, setUserCollapsed] = useState(false);
  const alerts = useMemo(() => initialAlerts(SETTINGS_USE_CASE, false), []);
  const shellSearchRef = useRef<HTMLInputElement>(null);

  const marker = useCallback((n: number, inset = false) => <AnatomyMarker n={n} show={showAnatomy} inset={inset} />, [showAnatomy]);
  const offline = useMemo(() => getCameras().filter((c) => c.status === 'offline').length, []);
  const problems = { counts: { cameras: offline, ...(smsError ? { integrations: 1 } : {}) } };

  const context: SettingsContextValue = {
    state,
    role,
    viewOnly,
    readOnly: viewOnly || saving,
    section,
    values: draft,
    set: (id, value) => {
      setDraft((d) => ({ ...d, [id]: value }));
      // Errors re-check live once a row has been touched.
      const row = rowOfValue(id);
      if (allErrors[row]) setTouched((t) => (t.includes(row) ? t : [...t, row]));
    },
    isModified,
    errors,
    touch: (rowId) => setTouched((t) => (t.includes(rowId) ? t : [...t, rowId])),
    smsError,
    setSmsError,
    goTo: (s) => goTo(s),
    jumpId: jump?.id ?? null,
    jumpKey: jump?.n ?? null,
    toast,
    undoToast,
    announce,
    marker,
  };

  const sectionMeta = getSettingsSection(section);
  const Section = SECTIONS[section];
  const navProps = { current: section, onSelect: (id: SettingsSectionId) => goTo(id), problems, loading };

  const content = loading ? (
    <section aria-label="Loading settings" aria-busy="true">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-96 max-w-full mt-2 mb-6" />
      <div className="space-y-6">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white rounded-[12px] border border-[#DDE2EA]">
            <div className="px-6 py-5 border-b border-[#DDE2EA] space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-64" />
            </div>
            {[0, 1, 2].map((r) => (
              <div key={r} className="px-6 py-5 border-b border-[#DDE2EA] last:border-b-0 grid grid-cols-1 @min-[768px]:grid-cols-12 gap-6">
                <div className="@min-[768px]:col-span-5 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="@min-[768px]:col-span-7 h-10 w-full max-w-[360px] rounded-[8px]!" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  ) : (
    <SectionFrame title={sectionMeta.label} description={sectionMeta.description} headingRef={headingRef} marker={marker(4)}>
      <Section key={section} />
    </SectionFrame>
  );

  return (
    <SettingsContext.Provider value={context}>
      <div ref={rootRef} className={`@container w-full ${fillViewport ? 'h-screen' : 'h-full'}`}>
        <AppShell
          useCase={SETTINGS_SHELL}
          userCollapsed={userCollapsed}
          onToggleCollapsed={() => setUserCollapsed((c) => !c)}
          searchRef={shellSearchRef}
          onSearch={(q) => q && showToast(`Search for "${q}" opens in the full product`, 'info')}
          site={site}
          onSiteChange={setSite}
          live={live}
          onToggleLive={() => setLive((l) => !l)}
          alerts={alerts}
          unread={alerts.length}
          signOutHref={`${LOGIN_PREVIEW_PATH}?usecase=${SETTINGS_USE_CASE}`}
          newTab={!fillViewport}
          anatomy={{ sidebar: null, topBar: null }}
          landmarkMain={fillViewport}
          activeNavId="settings"
          contentLabel="Settings content"
        >
          <SettingsLayout
            banners={
              viewOnly ? (
                <div role="status">
                  <InfoAlert icon={Eye}>You have view-only access to settings. Contact an administrator to make changes.</InfoAlert>
                </div>
              ) : undefined
            }
            header={
              <SettingsHeader
                product={`VisionEdge ${SETTINGS_SHELL.productName}`}
                marker={marker(1)}
                searchMarker={marker(2)}
                search={
                  <SettingsSearch
                    query={query}
                    onQuery={setQuery}
                    open={searchOpen}
                    onOpen={setSearchOpen}
                    inputRef={searchRef}
                    onPick={(def: SettingDef) => goTo(def.section, def.id)}
                  />
                }
              />
            }
            nav={{
              vertical: (
                <div className="relative">
                  {marker(3)}
                  <VerticalSettingsNav {...navProps} />
                </div>
              ),
              tabs: (
                <div className="relative">
                  {marker(3)}
                  <TabSettingsNav {...navProps} />
                </div>
              ),
              select: (
                <div className="relative">
                  {marker(3)}
                  <SelectSettingsNav {...navProps} />
                </div>
              ),
            }}
            unsavedBar={
              (dirty || saving) && !loading ? (
                <UnsavedChangesBar
                  onDiscard={discard}
                  onSave={save}
                  saving={saving}
                  message={`${modifiedRows.length} unsaved change${modifiedRows.length === 1 ? '' : 's'} in ${sectionMeta.label}`}
                  marker={marker(9, true)}
                />
              ) : undefined
            }
          >
            {content}
          </SettingsLayout>
        </AppShell>

        <div className="sr-only" aria-live="polite">
          {liveMessage}
        </div>

        <UndoToast
          item={undo}
          raised={dirty || saving}
          onUndo={() => {
            undo?.onUndo();
            window.clearTimeout(undoTimer.current);
            setUndo(null);
            announce('Undone');
          }}
          onDismiss={() => {
            window.clearTimeout(undoTimer.current);
            setUndo(null);
          }}
        />

        {guard && (
          <ConfirmDestructiveModal
            title="Discard unsaved changes?"
            body={`Your ${modifiedRows.length === 1 ? 'change' : `${modifiedRows.length} changes`} to ${sectionMeta.label} will be lost.`}
            cancelLabel="Keep editing"
            confirmLabel="Discard changes"
            onClose={() => {
              setGuard(null);
              onSectionChange?.(section);
            }}
            onConfirm={() => {
              const { next, jump: jumpId } = guard;
              discard();
              setGuard(null);
              navigate(next, jumpId);
            }}
          />
        )}
      </div>
    </SettingsContext.Provider>
  );
};
