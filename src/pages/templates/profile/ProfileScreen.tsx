import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eye, ShieldAlert } from 'lucide-react';
import { ToastProvider, useToast } from '../../../components/common/Toast';
import { CriticalAlert, InfoAlert, demoLink } from '../shared/authUi';
import { isValidEmail } from '../register/registerStates';
import { LOGIN_PREVIEW_PATH } from '../login/paths';
import { AppShell } from '../dashboard/shell/AppShell';
import { initialAlerts } from '../dashboard/data/alerts';
import { PROFILE_SHELL, PROFILE_USE_CASE } from './profileShell';
import { ModalRequest, PersonalErrors, PersonalField, ProfileContext, ProfileContextValue } from './ProfileContext';
import { ProfileLayout, SectionFrame } from './ProfileLayout';
import { ProfileHeader } from './ProfileHeader';
import { HorizontalSectionNav, VerticalSectionNav } from './SectionNav';
import { SectionSelectNav as SelectSectionNav } from './parts/SectionSelectNav';
import { UnsavedChangesBar } from './UnsavedChangesBar';
import { AnatomyMarker } from './AnatomyOverlay';
import { Overview } from './sections/Overview';
import { PersonalDetails as PersonalDetailsSection } from './sections/PersonalDetails';
import { Security } from './sections/Security';
import { Sessions } from './sections/Sessions';
import { Notifications } from './sections/Notifications';
import { Access } from './sections/Access';
import { ActivityLog } from './sections/ActivityLog';
import { AvatarCropModal, SAMPLE_PHOTO } from './modals/AvatarCropModal';
import { ChangeEmailModal } from './modals/ChangeEmailModal';
import { ChangePasswordModal } from './modals/ChangePasswordModal';
import { BackupCodesModal, TwoStepOffModal, TwoStepSetupModal } from './modals/TwoStepSetupModal';
import { ConfirmDestructiveModal } from './modals/ConfirmDestructiveModal';
import { RequestAccessModal } from './modals/RequestAccessModal';
import { CameraListModal } from './modals/CameraListModal';
import {
  ProfileStateId,
  SAVE_DELAY_MS,
  SectionId,
  ViewerMode,
  getProfileState,
  getSection,
  viewerForState,
} from './profileStates';
import { PENDING_EMAIL, PersonalDetails, fullName, getProfileUser, initialsOf } from './data/users';
import { getSessions } from './data/sessions';
import { getActivity } from './data/activity';
import { AccessLevel, getCameraIds, getModuleAccess } from './data/access';
import { BUTTON, Skeleton } from './ui';

export interface ProfileScreenProps {
  state?: ProfileStateId;
  viewer?: ViewerMode;
  /** Section to show; changing it later navigates (through the unsaved-changes guard). */
  section?: SectionId;
  /** Reports navigation, so the showcase Section select stays in sync. */
  onSectionChange?: (section: SectionId) => void;
  /** Full-screen route: fill the viewport and own the page landmarks. */
  fillViewport?: boolean;
  /** Overlay numbered anatomy markers (reference page). */
  showAnatomy?: boolean;
}

const PERSONAL_FIELDS: PersonalField[] = ['firstName', 'lastName', 'displayName', 'mobile', 'altContact'];

/** Form standard: specific, helpful messages. */
const validate = (d: PersonalDetails): PersonalErrors => {
  const errors: PersonalErrors = {};
  if (!d.firstName.trim()) errors.firstName = 'Enter your first name';
  if (!d.lastName.trim()) errors.lastName = 'Enter your last name';
  if (d.displayName.length > 40) errors.displayName = 'Use 40 characters or fewer';
  if (d.mobile && d.mobile.length !== 10) errors.mobile = 'Enter a 10-digit mobile number';
  const alt = d.altContact.trim();
  if (alt && !isValidEmail(alt) && !/^\d{10}$/.test(alt.replace(/\D/g, ''))) errors.altContact = 'Enter an email address or a 10-digit phone number';
  return errors;
};

const same = <T,>(a: T, b: T): boolean => JSON.stringify(a) === JSON.stringify(b);

/**
 * VisionEdge user profile: product AppShell + profile header + section nav + the selected section.
 * One sticky bar handles unsaved changes; leaving a section with changes asks first.
 */
export const ProfileScreen: React.FC<ProfileScreenProps> = (props) => (
  // Toasts sit bottom-right in the product (the shared provider stacks them top-right).
  <div className={`${props.fillViewport ? '' : 'h-full'} [&>.fixed]:top-auto! [&>.fixed]:bottom-5!`}>
    <ToastProvider>
      {/* Picking another state or viewer starts from a clean slate. */}
      <ProfileContent
        key={`${props.state ?? 'default'}-${viewerForState(props.state ?? 'default', props.viewer ?? 'self')}`}
        {...props}
      />
    </ToastProvider>
  </div>
);

const ProfileContent: React.FC<ProfileScreenProps> = ({
  state = 'default',
  viewer: requestedViewer = 'self',
  section: sectionProp,
  onSectionChange,
  fillViewport = false,
  showAnatomy = false,
}) => {
  const { showToast } = useToast();
  const meta = getProfileState(state);
  const viewer = viewerForState(state, requestedViewer);
  const self = viewer === 'self';
  const user = useMemo(() => getProfileUser(viewer), [viewer]);
  const activity = useMemo(() => getActivity(viewer), [viewer]);
  const loading = state === 'loading';

  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  /* ── Section and navigation guard ── */
  const [section, setSection] = useState<SectionId>(sectionProp ?? meta.section);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusHeading = useRef(false);

  /* ── Personal details (saved + draft) ── */
  const [details, setDetails] = useState<PersonalDetails>(user.details);
  const [draft, setDraft] = useState<PersonalDetails>(() => {
    const short = `${user.details.firstName} ${user.details.lastName[0]}.`;
    if (state === 'editing' || state === 'saving') return { ...user.details, displayName: short, altContact: self ? 'priya.sharma@pit.ac.in' : '' };
    if (state === 'validation-error') return { ...user.details, firstName: '', mobile: '98765432' };
    return user.details;
  });
  const [touched, setTouched] = useState<PersonalField[]>(state === 'validation-error' ? ['firstName', 'mobile'] : []);
  const [saving, setSaving] = useState(state === 'saving');
  const fieldEls = useRef<Partial<Record<PersonalField, HTMLElement | null>>>({});

  /* ── Account ── */
  const [photo, setPhoto] = useState<string | null>(null);
  const [email, setEmail] = useState(user.email);
  const [pendingEmail, setPendingEmail] = useState<string | null>(state === 'email-pending' && self ? PENDING_EMAIL : null);
  const [twoStep, setTwoStep] = useState(!(state === 'two-step-off' && self));
  const [requireTwoStep, setRequireTwoStep] = useState(false);
  const [backupRemaining, setBackupRemaining] = useState(8);
  const [suspended, setSuspended] = useState(state === 'suspended');
  const [sessions, setSessions] = useState(() => getSessions(viewer));

  /* ── Access (editable in the admin view) ── */
  const [savedAccess, setSavedAccess] = useState(() => getModuleAccess(viewer));
  const [access, setAccess] = useState(savedAccess);
  const [savedSites, setSavedSites] = useState(user.sites);
  const [sites, setSites] = useState(user.sites);

  /* ── Shell ── */
  const [site, setSite] = useState(PROFILE_SHELL.site);
  const [live, setLive] = useState(true);
  const [userCollapsed, setUserCollapsed] = useState(false);
  const alerts = useMemo(() => initialAlerts(PROFILE_USE_CASE, false), []);
  const searchRef = useRef<HTMLInputElement>(null);

  /* ── Modals and announcements ── */
  const [modal, setModal] = useState<ModalRequest | null>(() => {
    if (!self) return null;
    if (state === 'photo-crop') return { kind: 'photo', sample: true };
    if (state === 'two-step-setup') return { kind: 'two-step-setup' };
    return null;
  });
  const [liveMessage, setLiveMessage] = useState('');
  const announce = useCallback((message: string) => setLiveMessage(message), []);
  const toast = useCallback((message: string, type: 'success' | 'info' | 'critical' = 'success') => showToast(message, type), [showToast]);
  const close = () => setModal(null);

  const name = fullName(details);
  const errors = useMemo(() => {
    const all = validate(draft);
    return Object.fromEntries(Object.entries(all).filter(([k]) => touched.includes(k as PersonalField))) as PersonalErrors;
  }, [draft, touched]);

  const dirtyPersonal = !same(draft, details);
  const dirtyAccess = !same(access, savedAccess) || !same(sites, savedSites);
  const dirty = dirtyPersonal || dirtyAccess;

  useEffect(() => {
    if (state === 'saved') {
      showToast('Profile updated', 'success');
      announce('Profile updated');
    }
  }, []); // Once, when the Saved state opens.

  const navigate = useCallback(
    (next: SectionId) => {
      setSection(next);
      onSectionChange?.(next);
      focusHeading.current = true;
    },
    [onSectionChange]
  );

  // After a user-initiated switch, move focus to the new section's heading.
  useEffect(() => {
    if (!focusHeading.current) return;
    focusHeading.current = false;
    headingRef.current?.focus();
  }, [section]);

  const discard = useCallback(() => {
    setDraft(details);
    setTouched([]);
    setAccess(savedAccess);
    setSites(savedSites);
  }, [details, savedAccess, savedSites]);

  const goTo = useCallback(
    (next: SectionId) => {
      if (next === section) return;
      if (dirty && !saving) setModal({ kind: 'discard', next });
      else navigate(next);
    },
    [section, dirty, saving, navigate]
  );

  // The showcase Section select (or ?section=) asks to navigate.
  const firstSectionProp = useRef(true);
  useEffect(() => {
    if (firstSectionProp.current) {
      firstSectionProp.current = false;
      return;
    }
    if (sectionProp && sectionProp !== section) goTo(sectionProp);
  }, [sectionProp]); // Only when the requested section changes.

  const save = () => {
    if (saving) return;
    if (dirtyPersonal) {
      const all = validate(draft);
      const invalid = PERSONAL_FIELDS.filter((f) => all[f]);
      if (invalid.length) {
        setTouched(PERSONAL_FIELDS);
        fieldEls.current[invalid[0]]?.focus();
        announce(`Check ${invalid.length === 1 ? '1 field' : `${invalid.length} fields`} before saving`);
        return;
      }
    }
    setSaving(true);
    announce('Saving changes');
    timers.current.push(
      window.setTimeout(() => {
        setSaving(false);
        if (dirtyPersonal) {
          setDetails(draft);
          setTouched([]);
        }
        if (dirtyAccess) {
          setSavedAccess(access);
          setSavedSites(sites);
        }
        const message = dirtyAccess && !dirtyPersonal ? `Access updated for ${name}` : 'Profile updated';
        showToast(message, 'success');
        announce(message);
      }, SAVE_DELAY_MS)
    );
  };

  // Ctrl/Cmd + K focuses the product search on the full-screen route.
  useEffect(() => {
    if (!fillViewport) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fillViewport]);

  const marker = useCallback((n: number, inset = false) => <AnatomyMarker n={n} show={showAnatomy} inset={inset} />, [showAnatomy]);

  const signOutSessions = useCallback((ids: string[]) => setSessions((list) => list.filter((s) => !ids.includes(s.id))), []);

  const context: ProfileContextValue = {
    state,
    organization: PROFILE_SHELL.organization,
    viewer,
    user,
    details,
    name,
    initials: initialsOf(details),
    photo,
    setPhoto,
    email,
    pendingEmail,
    setPendingEmail,
    setEmail,
    twoStep,
    setTwoStep,
    requireTwoStep,
    setRequireTwoStep,
    backupRemaining,
    setBackupRemaining,
    suspended,
    setSuspended,
    sessions,
    signOutSessions,
    activity,
    draft,
    updateDraft: (patch) => setDraft((d) => ({ ...d, ...patch })),
    errors,
    blurField: (field) => setTouched((t) => (t.includes(field) ? t : [...t, field])),
    fieldRef: (field) => (el) => {
      fieldEls.current[field] = el;
    },
    saving,
    access,
    moduleCount: savedAccess.filter((m) => m.level !== 'none').length,
    setAccessLevel: (id, level: AccessLevel) => setAccess((list) => list.map((m) => (m.id === id ? { ...m, level } : m))),
    sites,
    setSites,
    goTo,
    openModal: setModal,
    toast,
    announce,
    marker,
  };

  const sectionMeta = getSection(section);
  const others = sessions.filter((s) => !s.current);

  /* ── Section content ── */
  const content = loading ? (
    <section aria-label="Loading profile" aria-busy="true" className="relative">
      {marker(5)}
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-80 max-w-full mt-2 mb-6" />
      <div className="space-y-6">
        {[180, 220, 160].map((h, i) => (
          <div key={i} className="relative bg-white rounded-[12px] border border-[#DDE2EA] p-6 space-y-3" style={{ height: h }}>
            {i === 0 && marker(6)}
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </section>
  ) : (
    <SectionFrame
      title={sectionMeta.label}
      description={self ? sectionMeta.description : sectionMeta.adminDescription}
      headingRef={headingRef}
      marker={marker(5)}
    >
      {section === 'overview' && <Overview />}
      {section === 'personal' && <PersonalDetailsSection />}
      {section === 'security' && <Security />}
      {section === 'sessions' && <Sessions />}
      {section === 'notifications' && <Notifications />}
      {section === 'access' && <Access />}
      {section === 'activity' && <ActivityLog />}
    </SectionFrame>
  );

  const navProps = { current: section, onSelect: goTo, loading };

  return (
    <ProfileContext.Provider value={context}>
      <div className={`@container w-full ${fillViewport ? 'h-screen' : 'h-full'}`}>
        <AppShell
          useCase={PROFILE_SHELL}
          userCollapsed={userCollapsed}
          onToggleCollapsed={() => setUserCollapsed((c) => !c)}
          searchRef={searchRef}
          onSearch={(q) => q && showToast(`Search for "${q}" opens in the full product`, 'info')}
          site={site}
          onSiteChange={setSite}
          live={live}
          onToggleLive={() => setLive((l) => !l)}
          alerts={alerts}
          unread={alerts.length}
          signOutHref={`${LOGIN_PREVIEW_PATH}?usecase=${PROFILE_USE_CASE}`}
          newTab={!fillViewport}
          anatomy={{ sidebar: null, topBar: null }}
          landmarkMain={fillViewport}
          // Settings pages sit outside the module nav; in the admin view "Users" is where you came from.
          activeNavId={self ? null : 'users'}
          accountCurrent={self ? 'profile' : undefined}
          contentLabel="Profile content"
        >
          <ProfileLayout
            breadcrumb={
              <nav aria-label="Breadcrumb" className="relative">
                {marker(1)}
                <ol className="flex flex-wrap items-center gap-1.5 text-[12px] leading-[16px] text-[#4B5465]">
                  <li>
                    <a href={self ? '#settings' : '#users'} onClick={demoLink} className="inline-flex items-center min-h-[24px] rounded-[2px] hover:text-[#1E63FF] hover:underline outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]">
                      {self ? 'Settings' : 'Users'}
                    </a>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="font-medium text-[#353D4C]">
                    {self ? 'My profile' : name}
                  </li>
                </ol>
              </nav>
            }
            banners={
              !self && !loading ? (
                <>
                  {suspended && (
                    <div role="alert">
                      <CriticalAlert icon={ShieldAlert}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-medium">This account is suspended. The user can't sign in.</p>
                          <button
                            type="button"
                            onClick={() => {
                              setSuspended(false);
                              showToast(`${name} can sign in again`, 'success');
                              announce(`${name} reactivated`);
                            }}
                            className={BUTTON.onDark}
                          >
                            Reactivate
                          </button>
                        </div>
                      </CriticalAlert>
                    </div>
                  )}
                  <InfoAlert icon={Eye}>You're viewing another user's profile. Changes are recorded in the audit log.</InfoAlert>
                </>
              ) : undefined
            }
            header={<ProfileHeader loading={loading} />}
            nav={{
              vertical: (
                <div className="relative">
                  {marker(4)}
                  <VerticalSectionNav {...navProps} viewer={viewer} />
                </div>
              ),
              tabs: (
                <div className="relative">
                  {marker(4)}
                  <HorizontalSectionNav {...navProps} />
                </div>
              ),
              select: (
                <div className="relative">
                  {marker(4)}
                  <SelectSectionNav {...navProps} />
                </div>
              ),
            }}
            unsavedBar={(dirty || saving) && !loading ? <UnsavedChangesBar onDiscard={discard} onSave={save} saving={saving} marker={marker(7, true)} /> : undefined}
          >
            {content}
          </ProfileLayout>
        </AppShell>

        <div className="sr-only" aria-live="polite">
          {liveMessage}
        </div>

        {/* ── Modals ── */}
        {modal?.kind === 'photo' && (
          <AvatarCropModal
            initialImage={modal.sample ? SAMPLE_PHOTO : null}
            onClose={close}
            onSave={(src) => {
              setPhoto(src);
              close();
              showToast('Photo updated', 'success');
              announce('Photo updated');
            }}
          />
        )}
        {modal?.kind === 'email' && (
          <ChangeEmailModal
            currentEmail={email}
            pendingEmail={pendingEmail}
            startOnCode={modal.step === 'code'}
            onClose={close}
            onPending={setPendingEmail}
            onVerified={(next) => {
              setEmail(next);
              setPendingEmail(null);
              close();
              showToast(`Email changed to ${next}`, 'success');
              announce(`Email changed to ${next}`);
            }}
          />
        )}
        {modal?.kind === 'password' && (
          <ChangePasswordModal
            fullName={name}
            email={email}
            onClose={close}
            onUpdated={() => {
              signOutSessions(others.map((s) => s.id));
              close();
              showToast('Password updated. Other devices were signed out.', 'success');
              announce('Password updated. Other devices were signed out.');
            }}
          />
        )}
        {modal?.kind === 'two-step-setup' && (
          <TwoStepSetupModal
            onClose={close}
            onEnabled={() => {
              setTwoStep(true);
              setBackupRemaining(10);
              close();
              showToast('Two-step verification is on', 'success');
              announce('Two-step verification is on');
            }}
          />
        )}
        {modal?.kind === 'two-step-off' && (
          <TwoStepOffModal
            onClose={close}
            onConfirm={() => {
              setTwoStep(false);
              close();
              showToast('Two-step verification is off', 'info');
              announce('Two-step verification is off');
            }}
          />
        )}
        {modal?.kind === 'backup-codes' && (
          <BackupCodesModal
            regenerate={modal.regenerate}
            remaining={backupRemaining}
            onClose={close}
            onRegenerated={() => {
              setBackupRemaining(10);
              showToast('New backup codes generated. The old ones no longer work.', 'success');
            }}
          />
        )}
        {modal?.kind === 'sign-out-all' && (
          <ConfirmDestructiveModal
            title={self ? 'Sign out of all other sessions?' : `Sign ${name} out everywhere?`}
            body={
              self
                ? `You'll be signed out on ${others.length} other ${others.length === 1 ? 'device' : 'devices'}. This device stays signed in.`
                : `${name} will be signed out on ${others.length} ${others.length === 1 ? 'device' : 'devices'} and has to sign in again.`
            }
            confirmLabel={self ? 'Sign out of all other sessions' : 'Sign out of all sessions'}
            onClose={close}
            onConfirm={() => {
              signOutSessions(others.map((s) => s.id));
              close();
              const message = self ? `Signed out of ${others.length} other sessions` : `${name} was signed out of ${others.length} sessions`;
              showToast(message, 'success');
              announce(message);
            }}
          />
        )}
        {modal?.kind === 'sign-out-session' && (
          <ConfirmDestructiveModal
            title={`Sign out ${modal.session.device}?`}
            body={`${self ? 'This session' : `${name}'s session`} in ${modal.session.location} ends straight away.`}
            confirmLabel="Sign out"
            onClose={close}
            onConfirm={() => {
              signOutSessions([modal.session.id]);
              close();
              showToast(`Signed out ${modal.session.device}`, 'success');
              announce(`Signed out ${modal.session.device}`);
            }}
          />
        )}
        {modal?.kind === 'suspend' && (
          <ConfirmDestructiveModal
            title={`Suspend ${name}?`}
            body={`${name} is signed out on every device and can't sign in until you reactivate the account. Their data and history are kept.`}
            confirmLabel="Suspend user"
            confirmText={email}
            onClose={close}
            onConfirm={() => {
              setSuspended(true);
              signOutSessions(sessions.map((s) => s.id));
              close();
              showToast(`${name} is suspended`, 'info');
              announce(`${name} is suspended`);
            }}
          />
        )}
        {modal?.kind === 'reset-password' && (
          <ConfirmDestructiveModal
            title="Send a password reset email?"
            body={
              <>
                {name} gets a link at <strong className="font-semibold text-[#121722]">{email}</strong> to choose a new password. The link expires in 24
                hours; their current password keeps working until then.
              </>
            }
            confirmLabel="Send reset email"
            tone="primary"
            onClose={close}
            onConfirm={() => {
              close();
              showToast(`Password reset email sent to ${email}`, 'success');
              announce('Password reset email sent');
            }}
          />
        )}
        {modal?.kind === 'request-access' && (
          <RequestAccessModal
            approver={user.roleAssignedBy}
            onClose={close}
            onSent={() => {
              close();
              showToast('Request sent to your administrator', 'success');
              announce('Request sent to your administrator');
            }}
          />
        )}
        {modal?.kind === 'camera-list' && <CameraListModal ids={getCameraIds(user.stats.cameras)} onClose={close} />}
        {modal?.kind === 'discard' && (
          <ConfirmDestructiveModal
            title="Discard unsaved changes?"
            body={`Your changes to ${getSection(section).label} will be lost.`}
            cancelLabel="Keep editing"
            confirmLabel="Discard changes"
            onClose={() => {
              close();
              onSectionChange?.(section);
            }}
            onConfirm={() => {
              const next = modal.next;
              discard();
              close();
              navigate(next);
            }}
          />
        )}
      </div>
    </ProfileContext.Provider>
  );
};
