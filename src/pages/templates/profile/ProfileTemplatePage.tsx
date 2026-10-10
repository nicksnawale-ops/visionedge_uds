import React, { useId, useRef, useState } from 'react';
import { Check, Lock, X } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { SpecTable } from '../../../components/common/SpecTable';
import { DoDontPair } from '../../../components/common/DoDont';
import { SHOWCASE_STYLES, SourceFile, TemplateShowcase } from '../shared/TemplateShowcase';
import { ProfileScreen } from './ProfileScreen';
import { ProfileSelect } from './parts/ProfileSelect';
import { ProfileAnatomyLegend } from './AnatomyOverlay';
import {
  PROFILE_PREVIEW_PATH,
  PROFILE_STATES,
  ProfileStateId,
  SECTIONS,
  SectionId,
  ViewerMode,
  getProfileState,
  viewerForState,
} from './profileStates';

import profileLayoutSource from './ProfileLayout.tsx?raw';
import profileScreenSource from './ProfileScreen.tsx?raw';
import profileHeaderSource from './ProfileHeader.tsx?raw';
import sectionNavSource from './SectionNav.tsx?raw';
import unsavedBarSource from './UnsavedChangesBar.tsx?raw';
import personalDetailsSource from './sections/PersonalDetails.tsx?raw';
import confirmModalSource from './modals/ConfirmDestructiveModal.tsx?raw';
import uiSource from './ui.tsx?raw';

const DIR = 'src/pages/templates/profile';

/** The clean layout first, then the key building blocks — not every sample-data file. */
const SOURCE_FILES: SourceFile[] = [
  { name: 'ProfileLayout.tsx', code: profileLayoutSource },
  { name: 'ProfileScreen.tsx', code: profileScreenSource },
  { name: 'ProfileHeader.tsx', code: profileHeaderSource },
  { name: 'SectionNav.tsx', code: sectionNavSource },
  { name: 'UnsavedChangesBar.tsx', code: unsavedBarSource },
  { name: 'PersonalDetails.tsx', code: personalDetailsSource, dir: `${DIR}/sections` },
  { name: 'ConfirmDestructiveModal.tsx', code: confirmModalSource, dir: `${DIR}/modals` },
  { name: 'ui.tsx', code: uiSource },
];

const { SEGMENT_GROUP, SEGMENT, SEGMENT_ON, SEGMENT_OFF } = SHOWCASE_STYLES;
const TH = 'py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left';
const TABLE_WRAP = 'overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]';

/* ── Sections and viewer modes ───────────────────────────────────── */

const SECTION_ROWS: Record<SectionId, { contains: string; components: string }> = {
  overview: { contains: 'Personal information, Organization & role, Security status, Recent activity; Danger zone in the admin view', components: 'Definition list, Badges, timeline' },
  personal: { contains: 'Profile photo, Basic, Contact and Preferences groups, change-email flow', components: 'Field (shared), PhoneInput + Select (Register), OtpInput (Login), crop modal' },
  security: { contains: 'Password, two-step verification, backup codes, sign-in alerts', components: 'PasswordStrength (Register), OtpInput (Login), Toggle, 3-step modal' },
  sessions: { contains: 'Active sessions table, sign out (one or all), trusted devices', components: 'Tables standard, Destructive confirmation' },
  notifications: { contains: 'Event × channel matrix, quiet hours, digest', components: 'Checkbox matrix with row and column headers, Toggle, radio group' },
  access: { contains: 'Role, module access, sites and cameras, request access change', components: 'Badges (read-only) or Selects and chips (admin)' },
  activity: { contains: 'Search, event type, date range, Export CSV, 30 events with pagination', components: 'Tables standard, Segmented control, empty state' },
};

const VIEWER_ROWS: [string, string, string][] = [
  ['Breadcrumb', 'Settings / My profile', 'Users / Rahul Mehta'],
  ['Banner', '—', "Info: \"You're viewing another user's profile. Changes are recorded in the audit log.\""],
  ['Header actions', 'Secondary "Edit profile"', 'Secondary "Reset password" + kebab: Change role, Resend invite, Suspend user'],
  ['Shell', 'No sidebar item active; "My profile" current in the user menu', '"Users" active'],
  ['Security', 'Change password, two-step setup, backup codes, sign-in alerts', 'Reset password (email) and "Require two-step verification"'],
  ['Sessions', 'Sign out other devices; "This device" has no action', 'Sign the user out of one or all sessions'],
  ['Notifications', 'Editable', 'Read-only (only the user can change them)'],
  ['Access & permissions', 'Read-only + "Request access change"', 'Editable access levels and site chips with the unsaved-changes bar'],
  ['Danger zone', '—', 'Suspend user (type the email to confirm); Delete disabled with a reason'],
];

/* ── Mini visuals for Do / Don't ─────────────────────────────────── */

const Mini: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-[240px] rounded-[6px] bg-white border border-[#DDE2EA] overflow-hidden text-[10px] text-[#353D4C]">{children}</div>
);

const MiniFields: React.FC = () => (
  <div className="p-2 space-y-1.5">
    {[0, 1].map((i) => (
      <span key={i} className="block h-5 rounded-[3px] border border-[#8C95A6]" />
    ))}
  </div>
);

const ACCESSIBILITY_NOTES: { title: string; text: string }[] = [
  { title: 'Section nav landmark', text: 'nav "Profile sections" with aria-current on the active item; tabs from 768px and a native select below, so it works everywhere.' },
  { title: 'Forms with fieldsets', text: 'Each group is a fieldset with a legend; labels sit above inputs; errors are tied with aria-describedby and checked on blur.' },
  { title: 'Announced results', text: 'One aria-live region announces saves, sign-outs and filter results; focus moves to the section heading after you switch sections.' },
  { title: 'Modals', text: 'Focus moves in, Tab stays inside, Esc closes, and focus returns to the control that opened the modal.' },
  { title: 'Notification matrix', text: 'A real table with row and column headers; every checkbox is named "Email for Watchlist vehicle detected", and locked ones explain why.' },
  { title: 'Contrast and targets', text: 'AA contrast, status never by color alone (badges have text), and 44px targets on touch, including the 16px checkboxes.' },
];

const CONTENT_RULES = [
  'Sentence case for titles, labels and buttons: "Change password", not "Change Password".',
  'Errors say what to do: "Enter a 10-digit mobile number", not "Invalid input".',
  'Relative times with the absolute time in a tooltip: "2 hours ago" → "30 Sep 2026, 12:02 IST".',
  '"Sign out", never "Logout" or "Log off".',
  'Destructive buttons repeat the action: "Suspend user", never "Yes".',
];

/* ── Page ────────────────────────────────────────────────────────── */

const ProfileTemplatePage: React.FC = () => {
  const sectionSelectId = useId();
  const [state, setState] = useState<ProfileStateId>('default');
  const [viewer, setViewer] = useState<ViewerMode>('self');
  const [section, setSection] = useState<SectionId>('overview');
  const [anatomy, setAnatomy] = useState(false);
  const showcaseRef = useRef<HTMLElement>(null);
  const effectiveViewer = viewerForState(state, viewer);

  const changeState = (id: ProfileStateId) => {
    const meta = getProfileState(id);
    setState(id);
    setSection(meta.section);
    if (meta.adminOnly) setViewer('admin');
  };

  const changeViewer = (v: ViewerMode) => {
    setViewer(v);
    // Admin-only states can't be shown as "My profile".
    if (v === 'self' && getProfileState(state).adminOnly) changeState('default');
  };

  const previewState = (id: ProfileStateId) => {
    changeState(id);
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      <PageHeader
        category="TEMPLATES"
        title="User Profile Page"
        description="Reference profile and account settings for every VisionEdge product, including the admin view of another user."
      />

      <section id="showcase" ref={showcaseRef} className="mb-12 scroll-mt-24">
        <TemplateShowcase
          states={PROFILE_STATES}
          state={state}
          onStateChange={changeState}
          stateGroupLabel="Profile state"
          previewPath={PROFILE_PREVIEW_PATH}
          urlPill="app.visionedge.ai/settings/profile"
          sourceFiles={SOURCE_FILES}
          sourceDir={DIR}
          showBackgroundToggle={false}
          extraToggle={{ label: 'Show anatomy', pressed: anatomy, onToggle: () => setAnatomy((a) => !a) }}
          extraRows={[
            {
              label: 'Viewer',
              content: (
                <div role="group" aria-label="Viewer" className={SEGMENT_GROUP}>
                  {(
                    [
                      ['self', 'My profile'],
                      ['admin', 'Admin view'],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={effectiveViewer === id}
                      onClick={() => changeViewer(id)}
                      className={`${SEGMENT} ${effectiveViewer === id ? SEGMENT_ON : SEGMENT_OFF}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ),
            },
            {
              label: 'Section',
              content: (
                <>
                  <ProfileSelect
                    id={sectionSelectId}
                    ariaLabel="Section"
                    size="sm"
                    className="min-w-[200px]"
                    value={section}
                    onChange={(v) => setSection(v as SectionId)}
                    options={SECTIONS.map((s) => ({ value: s.id, label: s.label, icon: s.icon }))}
                  />
                </>
              ),
            },
          ]}
          showUseCase={false}
          buildPreviewHref={({ state: s }) => `${PROFILE_PREVIEW_PATH}?state=${s}&section=${section}&viewer=${viewerForState(s, viewer)}`}
          renderScreen={({ state: s }) => (
            <ProfileScreen
              state={s}
              viewer={effectiveViewer}
              section={section}
              onSectionChange={setSection}
              showAnatomy={anatomy}
            />
          )}
        />
        <p className="mt-2 text-[12px] leading-[16px] text-[#4B5465]">The profile page is generic and identical across all VisionEdge products.</p>
        {anatomy && (
          <div className="mt-4 rounded-[12px] border border-[#DDE2EA] bg-white p-5">
            <ProfileAnatomyLegend />
          </div>
        )}
      </section>

      <section id="anatomy" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Layout Anatomy</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">
          Turn on <strong className="font-semibold text-[#121722]">Show anatomy</strong> in the showcase to see these regions. The unsaved-changes bar (7)
          appears in the Editing, Validation error and Saving states; the Danger zone (8) only in the admin view on Overview.
        </p>
        <ProfileAnatomyLegend />
      </section>

      <section id="sections" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Sections</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">Seven sections in a fixed order. Each has an H3 title, a one-line description, then cards 24px apart.</p>
        <div className={TABLE_WRAP}>
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                {['Section', 'Contains', 'Built with', ''].map((h, i) => (
                  <th key={i} scope="col" className={TH}>
                    {h || <span className="sr-only">Preview</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <tr key={s.id} className="align-top hover:bg-[#F7F9FC] transition-colors">
                    <th scope="row" className="py-3 px-4 text-left font-medium text-[#121722] whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#4B5465]" aria-hidden="true" />
                        {s.label}
                      </span>
                    </th>
                    <td className="py-3 px-4 text-[#353D4C] min-w-[260px]">{SECTION_ROWS[s.id].contains}</td>
                    <td className="py-3 px-4 text-[#4B5465] min-w-[220px]">{SECTION_ROWS[s.id].components}</td>
                    <td className="py-2 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSection(s.id);
                          showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        aria-label={`Show ${s.label} in the showcase`}
                        className="inline-flex items-center h-8 px-3 rounded-[8px] text-[13px] font-semibold text-[#1E63FF] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
                      >
                        Show
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section id="viewer-modes" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Viewer Modes</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">
          The same screen serves two people: you, on your own profile, and an administrator looking at someone else (Rahul Mehta in the demo).
        </p>
        <div className={TABLE_WRAP}>
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                <th scope="col" className={TH}>Area</th>
                <th scope="col" className={TH}>My profile (self)</th>
                <th scope="col" className={TH}>Admin view</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {VIEWER_ROWS.map(([area, selfText, adminText]) => (
                <tr key={area} className="align-top">
                  <th scope="row" className="py-3 px-4 text-left font-medium text-[#121722] whitespace-nowrap">
                    {area}
                  </th>
                  <td className="py-3 px-4 text-[#353D4C] min-w-[220px]">{selfText}</td>
                  <td className="py-3 px-4 text-[#353D4C] min-w-[260px]">{adminText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="states" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">States</h2>
        <div className={TABLE_WRAP}>
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                <th scope="col" className={TH}>State</th>
                <th scope="col" className={TH}>When it appears</th>
                <th scope="col" className={TH}>Behaviour</th>
                <th scope="col" className={TH}>
                  <span className="sr-only">Preview</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {PROFILE_STATES.map((s) => (
                <tr key={s.id} className="align-top hover:bg-[#F7F9FC] transition-colors">
                  <th scope="row" className="py-3 px-4 text-left font-medium text-[#121722] whitespace-nowrap">
                    {s.label}
                  </th>
                  <td className="py-3 px-4 text-[#353D4C] min-w-[180px]">{s.trigger}</td>
                  <td className="py-3 px-4 text-[#4B5465] min-w-[260px]">{s.behaviour}</td>
                  <td className="py-2 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => previewState(s.id)}
                      aria-label={`Preview ${s.label} state`}
                      className="inline-flex items-center h-8 px-3 rounded-[8px] text-[13px] font-semibold text-[#1E63FF] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">Specifications</h2>
        <SpecTable
          rows={[
            { property: 'Avatar Sizes', value: '88px header · 64px form · 32px shell · 24px lists; initials on Royal Blue', token: 'w-[88px] · w-16 · w-8 · w-6' },
            { property: 'Header Card', value: 'White, 1px Gray 200, 12px radius, 24px padding', token: 'rounded-[12px] p-6 border-[#DDE2EA]' },
            { property: 'Stats Strip', value: '4 cells, 1px Gray 200 dividers, Overline + Body Large; 2×2 below 1024px', token: 'grid-cols-4 · grid-cols-2' },
            { property: 'Content', value: 'Gray 50, max width 1200px, 12 columns, 24px gutter, 32px padding', token: 'max-w-[1264px] p-8 gap-6' },
            { property: 'Section Nav Item', value: '40px, 14px Medium, 18px icon; active Royal Blue 8% + 3px bar', token: 'h-10 bg-[#1E63FF]/[0.08]' },
            { property: 'Form', value: '2 columns (1 below 768px), labels above, 40px inputs, 16px gaps, 32px between groups', token: 'grid-cols-2 gap-4 space-y-8' },
            { property: 'Unsaved Bar', value: 'Sticky bottom, White, elevation-2, 1px top border, 16px padding', token: 'sticky bottom-0 p-4 shadow-[0_-4px_12px_…]' },
            { property: 'Modals', value: '480px (confirmations, short forms) · 640px (crop); 16px radius, elevation-3', token: 'max-w-[480px] · max-w-[640px]' },
            { property: 'Danger Zone', value: '1px Gray 200 border with a 4px Gray 900 left bar', token: 'border-l-4 border-l-[#121722]' },
            { property: 'Masked IP', value: 'First two octets, JetBrains Mono: 103.21.xx.xx', token: 'maskIp() · font-mono' },
            { property: 'Photo Upload', value: 'JPG or PNG, ≥256 × 256 px, ≤2 MB; saved as a 256px circle crop', token: 'MAX_BYTES · MIN_PX · OUTPUT' },
          ]}
        />
      </section>

      <section id="do-dont" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-2">Do &amp; Don&apos;t</h2>
        <DoDontPair
          doTitle="Do show a sticky unsaved-changes bar with Save and Discard"
          doDescription="People see that edits are pending and choose what happens to them."
          doExample={
            <Mini>
              <MiniFields />
              <div className="flex items-center justify-between gap-2 px-2 py-1.5 border-t border-[#DDE2EA] shadow-[0_-4px_12px_rgba(11,45,107,0.12)]">
                <span className="font-medium text-[#121722]">Unsaved changes</span>
                <span className="flex gap-1">
                  <span className="px-1.5 py-0.5 rounded-[3px] text-[#1E63FF]">Discard</span>
                  <span className="px-1.5 py-0.5 rounded-[3px] bg-[#1E63FF] text-white">Save</span>
                </span>
              </div>
            </Mini>
          }
          dontTitle="Don't auto-save silently or lose edits on navigation"
          dontDescription="Half-typed values get saved, or work disappears when someone clicks away."
          dontExample={
            <Mini>
              <MiniFields />
              <div className="px-2 py-1.5 text-[#6B7485]">Saving automatically…</div>
            </Mini>
          }
        />
        <DoDontPair
          doTitle="Do make admin-managed fields read-only with a lock and a reason"
          doDescription='"Managed by your administrator" explains why it can’t change.'
          doExample={
            <Mini>
              <div className="p-2">
                <span className="block mb-1 font-medium text-[#121722]">Employee ID</span>
                <span className="flex items-center justify-between h-6 px-2 rounded-[3px] border border-[#8C95A6] bg-[#F7F9FC] font-mono">
                  EMP-2041
                  <Lock className="w-3 h-3 text-[#6B7485]" aria-hidden="true" />
                </span>
                <span className="block mt-1 text-[#4B5465]">Managed by your administrator</span>
              </div>
            </Mini>
          }
          dontTitle="Don't hide them or let them look editable"
          dontDescription="A field that looks editable but rejects changes feels broken."
          dontExample={
            <Mini>
              <div className="p-2">
                <span className="block mb-1 font-medium text-[#121722]">Employee ID</span>
                <span className="flex items-center h-6 px-2 rounded-[3px] border border-[#8C95A6] bg-white font-mono">EMP-2041</span>
              </div>
            </Mini>
          }
        />
        <DoDontPair
          doTitle="Do confirm destructive actions by repeating the action and typing to confirm"
          doDescription='The button says "Suspend user", and the admin types the email first.'
          doExample={
            <Mini>
              <div className="p-2 space-y-1.5">
                <span className="block font-semibold text-[#121722]">Suspend Rahul Mehta?</span>
                <span className="block h-5 rounded-[3px] border border-[#8C95A6] px-1.5 leading-[18px] text-[#6B7485]">rahul.mehta@pit.edu.in</span>
                <span className="flex justify-end gap-1">
                  <span className="px-1.5 py-0.5 rounded-[3px] border border-[#1E63FF] text-[#1E63FF]">Cancel</span>
                  <span className="px-1.5 py-0.5 rounded-[3px] bg-[#121722] text-white">Suspend user</span>
                </span>
              </div>
            </Mini>
          }
          dontTitle={'Don\'t use "Are you sure? Yes / No"'}
          dontDescription="Generic answers are easy to click without reading."
          dontExample={
            <Mini>
              <div className="p-2 space-y-1.5">
                <span className="block font-semibold text-[#121722]">Are you sure?</span>
                <span className="flex justify-end gap-1">
                  <span className="px-1.5 py-0.5 rounded-[3px] border border-[#8C95A6]">No</span>
                  <span className="px-1.5 py-0.5 rounded-[3px] bg-[#1E63FF] text-white">Yes</span>
                </span>
              </div>
            </Mini>
          }
        />
        <DoDontPair
          doTitle="Do mask IPs and personal data in logs"
          doDescription="Enough to recognize a location, not enough to expose it."
          doExample={
            <Mini>
              <div className="p-2 flex items-center justify-between font-mono text-[11px]">
                <span>Chrome on Windows</span>
                <span className="text-[#121722]">103.21.xx.xx</span>
              </div>
            </Mini>
          }
          dontTitle="Don't show full IPs, passwords or codes after setup"
          dontDescription="Logs get screenshotted and shared; secrets shown once stay secret."
          dontExample={
            <Mini>
              <div className="p-2 flex items-center justify-between font-mono text-[11px]">
                <span>Chrome on Windows</span>
                <span className="text-[#121722]">103.21.58.140</span>
              </div>
            </Mini>
          }
        />
        <DoDontPair
          doTitle="Do keep critical alert notifications locked on, with an explanation"
          doDescription='In-app stays on for critical events: "Required for critical alerts".'
          doExample={
            <Mini>
              <div className="p-2 flex items-center justify-between">
                <span className="text-[#121722]">Watchlist vehicle detected</span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-3 h-3 rounded-[2px] bg-[#1E63FF]/60 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" aria-hidden="true" />
                  </span>
                  <Lock className="w-3 h-3 text-[#6B7485]" aria-hidden="true" />
                </span>
              </div>
            </Mini>
          }
          dontTitle="Don't let users silently disable safety alerts"
          dontDescription="A missed watchlist match is a security incident, not a preference."
          dontExample={
            <Mini>
              <div className="p-2 flex items-center justify-between">
                <span className="text-[#121722]">Watchlist vehicle detected</span>
                <span className="w-3 h-3 rounded-[2px] border border-[#8C95A6]" />
              </div>
            </Mini>
          }
        />
      </section>

      <section id="accessibility" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Accessibility</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">Built into the template above — keep these when you adapt it.</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACCESSIBILITY_NOTES.map((note) => (
            <li key={note.title} className="flex gap-3 p-4 rounded-[12px] border border-[#DDE2EA] bg-white">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-[#00C6FF]/15 text-[#0B2D6B] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] leading-[20px] font-semibold text-[#121722]">{note.title}</span>
                <span className="block mt-0.5 text-[13px] leading-[20px] text-[#4B5465]">{note.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section id="content">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">Content Guidelines</h2>
        <ul className="mb-6 space-y-2">
          {CONTENT_RULES.map((rule) => (
            <li key={rule} className="flex items-start gap-2 text-[14px] leading-[20px] text-[#353D4C]">
              <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#1E63FF]" aria-hidden="true" />
              {rule}
            </li>
          ))}
        </ul>
        <div className={TABLE_WRAP}>
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                <th scope="col" className={TH}>Avoid</th>
                <th scope="col" className={TH}>Use instead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {[
                ['Logout', 'Sign out'],
                ['Invalid phone', 'Enter a 10-digit mobile number'],
                ['Are you sure? Yes / No', 'Suspend Rahul Mehta? · Suspend user'],
                ['Last active: 2026-09-30T06:32:00Z', '2 hours ago (tooltip: 30 Sep 2026, 12:02 IST)'],
                ['Error: upload failed (413)', 'This file is larger than 2 MB. Choose a smaller image.'],
              ].map(([avoid, use]) => (
                <tr key={avoid}>
                  <td className="py-3 px-4 text-[#4B5465] min-w-[200px]">
                    <span className="inline-flex items-start gap-2">
                      <X className="w-4 h-4 mt-0.5 shrink-0 text-[#121722]" aria-label="Avoid" />
                      {avoid}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#121722] min-w-[240px]">
                    <span className="inline-flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#1E63FF]" aria-label="Use" />
                      {use}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ProfileTemplatePage;
