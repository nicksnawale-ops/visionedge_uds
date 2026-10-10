import React, { useRef, useState } from 'react';
import { Check, Globe, KeyRound, Users, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { SpecTable } from '../../../components/common/SpecTable';
import { DoDontPair } from '../../../components/common/DoDont';
import { Logo } from '../../../components/brand/Logo';
import { LoginScreen } from './LoginScreen';
import { SourceFile, TemplateShowcase } from '../shared/TemplateShowcase';
import { COPY, LOGIN_PREVIEW_PATH, LOGIN_STATES, LoginStateId } from './loginStates';

import loginScreenSource from './LoginScreen.tsx?raw';
import loginCardSource from './LoginCard.tsx?raw';
import loginFormSource from './LoginForm.tsx?raw';
import loginBackgroundSource from './LoginBackground.tsx?raw';
import backgroundsSource from './backgrounds.ts?raw';
import otpInputSource from './OtpInput.tsx?raw';
import loginStatesSource from './loginStates.ts?raw';
import authLayoutSource from '../shared/AuthLayout.tsx?raw';
import authUiSource from '../shared/authUi.tsx?raw';

/* ── Showcase ────────────────────────────────────────────────────── */

const SOURCE_FILES: SourceFile[] = [
  { name: 'LoginScreen.tsx', code: loginScreenSource },
  { name: 'LoginCard.tsx', code: loginCardSource },
  { name: 'LoginForm.tsx', code: loginFormSource },
  { name: 'LoginBackground.tsx', code: loginBackgroundSource },
  { name: 'backgrounds.ts', code: backgroundsSource },
  { name: 'OtpInput.tsx', code: otpInputSource },
  { name: 'loginStates.ts', code: loginStatesSource },
  { name: 'AuthLayout.tsx', code: authLayoutSource, dir: 'src/pages/templates/shared' },
  { name: 'authUi.tsx', code: authUiSource, dir: 'src/pages/templates/shared' },
];

/* ── Layout anatomy ──────────────────────────────────────────────── */

const ANATOMY: { n: number; name: string; detail: string; group: 'Screen' | 'Card' }[] = [
  { n: 1, name: 'Background', detail: 'Use-case illustration on Gray 50 with a 3° band, or a photo under Deep Navy 72%', group: 'Screen' },
  { n: 2, name: 'Help link', detail: '"Need help?" + "Contact support", 24px from the top-right corner', group: 'Screen' },
  { n: 3, name: 'Logo', detail: '<Logo size={40} /> + "VisionEdge", centered, 8px gap', group: 'Card' },
  { n: 4, name: 'Product chip', detail: 'Overline pill, Royal Blue 8% fill (none for Generic)', group: 'Card' },
  { n: 5, name: 'Heading', detail: 'H1 24/32 + subtitle naming the product, 24px below', group: 'Card' },
  { n: 6, name: 'Fields', detail: '40px inputs, label above, 16px apart, no icons', group: 'Card' },
  { n: 7, name: 'Options row', detail: '"Keep me signed in" + "Forgot password?"', group: 'Card' },
  { n: 8, name: 'Primary action', detail: '"Sign in", 48px, full width', group: 'Card' },
  { n: 9, name: 'Access note', detail: '12px, centered, points to the administrator', group: 'Card' },
  { n: 10, name: 'Footer', detail: '© · Privacy · Terms · version, 12px, 24px from the bottom', group: 'Screen' },
];

const Marker: React.FC<{ n: number; className?: string }> = ({ n, className = '' }) => (
  <span
    className={`absolute w-5 h-5 rounded-full bg-[#1E63FF] text-white text-[10px] font-semibold flex items-center justify-center tabular-nums ${className}`}
    aria-hidden="true"
  >
    {n}
  </span>
);

const AnatomyDiagram: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 items-start">
    <div
      className="relative w-full aspect-[16/10] rounded-[12px] border border-[#DDE2EA] overflow-hidden bg-[#F7F9FC]"
      role="img"
      aria-label="Login layout: background with illustrations, help link in the top-right corner, a centered card with logo, product chip, heading, fields, options row, primary button and access note, and a footer at the bottom."
    >
      {/* Background band and scene silhouettes */}
      <div className="absolute top-[70%] -left-[5%] w-[110%] h-[60%] bg-[#EEF1F6] origin-top-left -rotate-3" />
      <div className="absolute -left-4 -bottom-3 w-[22%] aspect-[4/3] rounded-[12px] border-[1.5px] border-[#1E63FF]/35 bg-[#1E63FF]/[0.08]" />
      <div className="absolute right-[8%] top-[16%] w-[13%] aspect-square rounded-[10px] border-[1.5px] border-[#1E63FF]/35 bg-[#00C6FF]/[0.12]" />
      <Marker n={1} className="left-3 top-[60%]" />

      {/* Help link */}
      <div className="absolute right-3 top-3 flex items-center gap-1.5">
        <span className="h-1.5 w-10 rounded-full bg-[#C3CAD5]" />
        <span className="h-1.5 w-12 rounded-full bg-[#1E63FF]/60" />
      </div>
      <Marker n={2} className="right-[110px] top-1.5" />

      {/* Card */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[36%] rounded-[8px] bg-white border border-[#DDE2EA] shadow-[0_12px_32px_rgba(11,45,107,0.12)] p-[3%] flex flex-col gap-[6%]">
        <div className="relative flex flex-col items-center gap-1">
          <span className="h-2 w-1/2 rounded-full bg-[#121722]/70" />
          <span className="h-1.5 w-1/4 rounded-full bg-[#1E63FF]/30" />
          <Marker n={3} className="-left-7 -top-1" />
          <Marker n={4} className="-right-7 top-1" />
        </div>
        <div className="relative space-y-1">
          <span className="block h-2 w-2/3 rounded-full bg-[#121722]/70" />
          <span className="block h-1 w-4/5 rounded-full bg-[#C3CAD5]" />
          <Marker n={5} className="-left-7 -top-1" />
        </div>
        <div className="relative space-y-1.5">
          <span className="block h-3 rounded-[3px] border border-[#8C95A6]" />
          <span className="block h-3 rounded-[3px] border border-[#8C95A6]" />
          <Marker n={6} className="-left-7 top-0" />
        </div>
        <div className="relative flex justify-between">
          <span className="h-1 w-1/3 rounded-full bg-[#C3CAD5]" />
          <span className="h-1 w-1/4 rounded-full bg-[#1E63FF]/60" />
          <Marker n={7} className="-right-7 -top-2" />
        </div>
        <div className="relative">
          <span className="block h-3.5 rounded-[3px] bg-[#1E63FF]" />
          <Marker n={8} className="-left-7 -top-0.5" />
        </div>
        <div className="relative flex justify-center">
          <span className="h-1 w-2/3 rounded-full bg-[#C3CAD5]" />
          <Marker n={9} className="-right-7 -top-2" />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 h-1.5 w-[30%] rounded-full bg-[#C3CAD5]" />
      <Marker n={10} className="bottom-1 left-[32%]" />
    </div>

    <div className="space-y-4">
      {(['Screen', 'Card'] as const).map((group) => (
        <div key={group}>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">{group}</p>
          <ol className="space-y-2.5">
            {ANATOMY.filter((a) => a.group === group).map((a) => (
              <li key={a.n} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-[#1E63FF] text-white text-[10px] font-semibold flex items-center justify-center shrink-0 tabular-nums">
                  {a.n}
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] leading-[20px] font-semibold text-[#121722]">{a.name}</span>
                  <span className="block text-[13px] leading-[20px] text-[#4B5465]">{a.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  </div>
);

/* ── Mini visuals for Do / Don't ─────────────────────────────────── */

const MiniButton: React.FC<{ className: string; children: React.ReactNode }> = ({ className, children }) => (
  <span className={`inline-flex items-center justify-center h-7 px-3 rounded-[6px] text-[11px] font-semibold ${className}`}>
    {children}
  </span>
);

/** Small screen with a centered card; children go inside the card. */
const MiniScreen: React.FC<{ background: React.ReactNode; children: React.ReactNode }> = ({ background, children }) => (
  <div className="relative w-[240px] h-[150px] rounded-[8px] border border-[#DDE2EA] overflow-hidden bg-[#F7F9FC]">
    {background}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] rounded-[6px] bg-white border border-[#DDE2EA] shadow-[0_12px_32px_rgba(11,45,107,0.12)] p-2 flex flex-col gap-1.5">
      {children}
    </div>
  </div>
);

const MiniFields: React.FC = () => (
  <>
    <span className="block h-2.5 rounded-[2px] border border-[#8C95A6]" />
    <span className="block h-2.5 rounded-[2px] border border-[#8C95A6]" />
  </>
);

const CalmBackground = (
  <>
    <div className="absolute top-[70%] -left-[5%] w-[110%] h-[60%] bg-[#EEF1F6] origin-top-left -rotate-3" />
    <div className="absolute -left-3 -bottom-3 w-14 h-12 rounded-[8px] border border-[#1E63FF]/35 bg-[#1E63FF]/[0.08]" />
    <div className="absolute right-4 top-4 w-9 h-9 rounded-[6px] border border-[#1E63FF]/35 bg-[#00C6FF]/[0.12]" />
  </>
);

const BusyBackground = (
  <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
    {Array.from({ length: 24 }, (_, i) => (
      <span key={i} className={['bg-[#00C6FF]', 'bg-[#1E63FF]', 'bg-[#0B2D6B]', 'bg-white'][(i * 7) % 4]} />
    ))}
  </div>
);

const SOCIAL_ICONS: LucideIcon[] = [Globe, Users, KeyRound];

/* ── Page content ────────────────────────────────────────────────── */

const ACCESSIBILITY_NOTES: { title: string; text: string }[] = [
  {
    title: 'Real form semantics',
    text: 'A native <form> with <label for> on every input, autocomplete="username" and "current-password", and Enter submits.',
  },
  {
    title: 'Announced errors',
    text: 'Messages sit in aria-live="polite" regions; inputs set aria-invalid and aria-describedby; focus moves to the first error.',
  },
  {
    title: 'Logical tab order',
    text: 'Email → password → show/hide → keep me signed in → forgot password → Sign in → help and footer links.',
  },
  {
    title: 'Visible focus, AA contrast',
    text: 'Every control shows a Royal Blue focus ring. On photos, a Deep Navy 72% overlay keeps help and footer text readable; Cyan appears only on that dark overlay, never on white.',
  },
  {
    title: 'Targets, zoom and motion',
    text: 'Inputs are 40px and buttons 48px; links and the options row have 44px hit areas. The card reflows at 320px and 200% zoom, and the entrance animation stops with reduced motion.',
  },
  {
    title: 'Decorative backgrounds',
    text: 'Illustrations, the dot grid and photos are aria-hidden. The product name is in the visible subtitle, not only in the picture.',
  },
];

const CONTENT_RULES = [
  'Sentence case everywhere, including buttons and headings.',
  'Start buttons with a verb: "Sign in", "Send reset link", "Verify".',
  'Name the product in the subtitle: "Sign in to continue to VisionEdge ANPR".',
  'No jargon: say "work email", not "UPN" or "identifier".',
  'No blame: "We couldn\'t sign you in", not "You entered wrong details".',
  'Tell people what to do next, and how long to wait.',
];

const CONTENT_EXAMPLES: { avoid: string; use: string }[] = [
  { avoid: 'Login failed', use: COPY.wrongCredentials(2) },
  { avoid: 'Invalid input', use: COPY.errors.email },
  { avoid: 'You entered wrong details', use: "We couldn't sign you in" },
  { avoid: 'Submit', use: COPY.signIn.submit },
  { avoid: 'Account temporarily suspended due to policy', use: COPY.locked.message },
];

const TH = 'py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left';

const LoginTemplatePage: React.FC = () => {
  const [state, setState] = useState<LoginStateId>('default');
  const showcaseRef = useRef<HTMLElement>(null);

  const previewState = (id: LoginStateId) => {
    setState(id);
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      <PageHeader
        category="TEMPLATES"
        title="Login Page"
        description="Reference sign-in experience for every VisionEdge product. Copy this layout; do not redesign it per module."
      />

      <section id="showcase" ref={showcaseRef} className="mb-12 scroll-mt-24">
        <TemplateShowcase
          states={LOGIN_STATES}
          state={state}
          onStateChange={setState}
          stateGroupLabel="Login state"
          previewPath={LOGIN_PREVIEW_PATH}
          urlPill="app.visionedge.ai/login"
          sourceFiles={SOURCE_FILES}
          sourceDir="src/pages/templates/login"
          renderScreen={(props) => <LoginScreen {...props} />}
        />
      </section>

      <section id="anatomy" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Layout Anatomy</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">
          One centered card on a use-case background. Nothing else on the screen: no side panels, no marketing text.
        </p>
        <AnatomyDiagram />
      </section>

      <section id="states" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">States</h2>
        <div className="overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
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
              {LOGIN_STATES.map((s) => (
                <tr key={s.id} className="hover:bg-[#F7F9FC] transition-colors align-top">
                  <th scope="row" className="py-3 px-4 text-left font-medium text-[#121722] whitespace-nowrap">
                    {s.label}
                  </th>
                  <td className="py-3 px-4 text-[#353D4C] min-w-[180px]">{s.trigger}</td>
                  <td className="py-3 px-4 text-[#4B5465] min-w-[260px]">{s.behaviour}</td>
                  <td className="py-2 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => previewState(s.id)}
                      className="inline-flex items-center h-8 px-3 rounded-[8px] text-[13px] font-semibold text-[#1E63FF] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
                      aria-label={`Preview ${s.label} state`}
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] text-[#4B5465]">
          Every state keeps the card in the same place. The full-screen route runs the whole flow with demo data —
          password <code className="font-mono text-[12px] text-[#1E63FF]">visionedge</code>, code{' '}
          <code className="font-mono text-[12px] text-[#1E63FF]">123456</code>. Any other password counts as a failed
          attempt; five in a row lock the account.
        </p>
      </section>

      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">Specifications</h2>
        <SpecTable
          rows={[
            { property: 'Card Width', value: '440px (100% − 32px on mobile)', token: 'max-w-[440px] · px-4' },
            { property: 'Card Radius', value: '16px', token: 'radius-xl' },
            { property: 'Card Padding', value: '40px (24px on mobile)', token: 'p-10 · p-6' },
            { property: 'Card Shadow', value: '0 12px 32px rgba(11,45,107,0.12)', token: 'shadow-[0_12px_32px_rgba(11,45,107,0.12)]' },
            { property: 'Card Border', value: '1px Gray 200', token: 'border-[#DDE2EA]' },
            { property: 'Input Height', value: '40px, label above, no icons', token: 'h-10' },
            { property: 'Button Height', value: '48px, full width (Primary "Sign in")', token: 'h-12 w-full' },
            { property: 'H1', value: '24/32 SemiBold #121722', token: 'text-[24px] leading-[32px] font-semibold' },
            { property: 'Field Spacing', value: '16px', token: 'gap-4' },
            { property: 'Section Spacing', value: '32px below the logo block · 24px below the heading', token: 'mb-8 · mb-6' },
            { property: 'Screen Edges', value: 'Help link and footer 24px from the edges', token: 'p-6' },
            { property: 'Illustration Background', value: 'Gray 50 + Gray 100 band (bottom 30%, 3° slant)', token: '#F7F9FC · #EEF1F6' },
            { property: 'Illustration Stroke', value: '1.5px Royal Blue at 35%, rounded joins; fills Royal Blue 8% / Cyan 12%', token: 'strokeOpacity 0.35' },
            { property: 'Dot Grid', value: '6×6, 4px dots, 24px apart, Royal Blue 25%', token: '≥768px only' },
            { property: 'Photo Overlay', value: 'Deep Navy at 72% over a cover-fit photo', token: 'bg-[#0B2D6B]/[0.72]' },
            { property: 'Animation', value: '250ms ease-out fade + 8px rise; none with reduced motion', token: 'element.animate(…, 250ms)' },
          ]}
        />
      </section>

      <section id="do-dont" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-2">Do &amp; Don&apos;t</h2>
        <DoDontPair
          doTitle="Do keep the card centered, white and simple"
          doDescription="Logo, heading, two fields, one button. The card is the only thing people need to look at."
          doExample={
            <MiniScreen background={CalmBackground}>
              <MiniFields />
              <span className="block h-3 rounded-[2px] bg-[#1E63FF]" />
            </MiniScreen>
          }
          dontTitle="Don't add marketing text, feature lists or multiple buttons to the card"
          dontDescription="Sign-in is a task, not a landing page. Extra content slows people down."
          dontExample={
            <MiniScreen background={CalmBackground}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="flex items-center gap-1">
                  <Check className="w-2 h-2 text-[#1E63FF]" aria-hidden="true" />
                  <span className="h-1 flex-1 rounded-full bg-[#C3CAD5]" />
                </span>
              ))}
              <span className="block h-3 rounded-[2px] bg-[#1E63FF]" />
              <span className="block h-3 rounded-[2px] bg-[#00C6FF]" />
              <span className="block h-3 rounded-[2px] bg-[#0B2D6B]" />
            </MiniScreen>
          }
        />
        <DoDontPair
          doTitle="Do use the background to show the product context"
          doDescription="A calm, low-contrast illustration, or a photo under the Deep Navy 72% overlay."
          doExample={
            <MiniScreen background={CalmBackground}>
              <MiniFields />
              <span className="block h-3 rounded-[2px] bg-[#1E63FF]" />
            </MiniScreen>
          }
          dontTitle="Don't let the background compete with the card"
          dontDescription="No bright, busy or low-contrast photos without the overlay."
          dontExample={
            <MiniScreen background={BusyBackground}>
              <MiniFields />
              <span className="block h-3 rounded-[2px] bg-[#1E63FF]" />
            </MiniScreen>
          }
        />
        <DoDontPair
          doTitle='Do use one Primary "Sign in" button'
          doDescription="One clear next step. Everything else is a link."
          doExample={
            <div className="w-[200px]">
              <MiniButton className="w-full bg-[#1E63FF] text-white">Sign in</MiniButton>
            </div>
          }
          dontTitle="Don't add social or third-party login icons"
          dontDescription="VisionEdge accounts are issued by your organization; social sign-in suggests otherwise."
          dontExample={
            <div className="w-[200px] flex flex-col items-center gap-2">
              <MiniButton className="w-full bg-[#1E63FF] text-white">Sign in</MiniButton>
              <div className="flex gap-2">
                {SOCIAL_ICONS.map((Icon, i) => (
                  <span key={i} className="w-8 h-8 rounded-full border border-[#8C95A6] bg-white flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#4B5465]" aria-hidden="true" />
                  </span>
                ))}
              </div>
            </div>
          }
        />
        <DoDontPair
          doTitle="Do show the real VisionEdge logo via <Logo />"
          doDescription="Always render the shared component at 40px at the top of the card."
          doExample={
            <div className="flex items-center gap-2">
              <Logo size={40} />
              <span className="text-[18px] font-semibold text-[#121722]">VisionEdge</span>
            </div>
          }
          dontTitle="Don't redraw, recolor or stretch it"
          dontDescription="No custom V shapes, tints or distortions — see Brand & Logo for the rules."
          dontExample={
            <div className="p-2 border border-[#121722]/20 bg-white rounded text-center text-[12px] font-mono text-[#4B5465]">
              [ Redrawn / recolored mark ]
            </div>
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
        <div className="overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                <th scope="col" className={TH}>Avoid</th>
                <th scope="col" className={TH}>Use instead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {CONTENT_EXAMPLES.map((ex) => (
                <tr key={ex.avoid}>
                  <td className="py-3 px-4 text-[#4B5465] min-w-[180px]">
                    <span className="inline-flex items-start gap-2">
                      <X className="w-4 h-4 mt-0.5 shrink-0 text-[#121722]" aria-label="Avoid" />
                      {ex.avoid}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#121722] min-w-[260px]">
                    <span className="inline-flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#1E63FF]" aria-label="Use" />
                      {ex.use}
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

export default LoginTemplatePage;
