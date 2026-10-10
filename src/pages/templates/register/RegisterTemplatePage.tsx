import React, { useRef, useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Circle, CornerRightUp, X } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { SpecTable } from '../../../components/common/SpecTable';
import { DoDontPair } from '../../../components/common/DoDont';
import { SourceFile, TemplateShowcase } from '../shared/TemplateShowcase';
import { RegisterScreen } from './RegisterScreen';
import { COPY, REGISTER_PREVIEW_PATH, REGISTER_STATES, RegisterStateId } from './registerStates';

import registerScreenSource from './RegisterScreen.tsx?raw';
import registerCardSource from './RegisterCard.tsx?raw';
import stepperSource from './Stepper.tsx?raw';
import accountStepSource from './steps/AccountStep.tsx?raw';
import organizationStepSource from './steps/OrganizationStep.tsx?raw';
import securityStepSource from './steps/SecurityStep.tsx?raw';
import passwordStrengthSource from './PasswordStrength.tsx?raw';
import phoneInputSource from './PhoneInput.tsx?raw';
import selectSource from './Select.tsx?raw';
import registerStatesSource from './registerStates.ts?raw';

/* ── Showcase ────────────────────────────────────────────────────── */

const SOURCE_FILES: SourceFile[] = [
  { name: 'RegisterScreen.tsx', code: registerScreenSource },
  { name: 'RegisterCard.tsx', code: registerCardSource },
  { name: 'Stepper.tsx', code: stepperSource },
  { name: 'AccountStep.tsx', code: accountStepSource, dir: 'src/pages/templates/register/steps' },
  { name: 'OrganizationStep.tsx', code: organizationStepSource, dir: 'src/pages/templates/register/steps' },
  { name: 'SecurityStep.tsx', code: securityStepSource, dir: 'src/pages/templates/register/steps' },
  { name: 'PasswordStrength.tsx', code: passwordStrengthSource },
  { name: 'PhoneInput.tsx', code: phoneInputSource },
  { name: 'Select.tsx', code: selectSource },
  { name: 'registerStates.ts', code: registerStatesSource },
];

/* ── Flow overview ───────────────────────────────────────────────── */

const FLOW = ['Account', 'Organization', 'Security', 'Verify email', 'Pending approval', 'Sign in'];

const FlowNode: React.FC<{ label: string; step?: number; muted?: boolean }> = ({ label, step, muted = false }) => (
  <div
    className={`shrink-0 w-[120px] rounded-[8px] border bg-white px-3 py-2.5 text-center shadow-[0_1px_3px_rgba(11,45,107,0.08)] ${
      muted ? 'border-dashed border-[#8C95A6]' : 'border-[#DDE2EA]'
    }`}
  >
    {step && <span className="block text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">Step {step}</span>}
    <span className="block text-[13px] leading-[20px] font-semibold text-[#121722]">{label}</span>
  </div>
);

const FlowArrow: React.FC = () => <ArrowRight className="w-4 h-4 shrink-0 text-[#C3CAD5]" aria-hidden="true" />;

const FlowDiagram: React.FC = () => (
  <div className="overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-[#F7F9FC] p-6">
    <div
      role="img"
      aria-label="Registration flow: Account, then Organization, then Security, then Verify email, then Pending approval, then Sign in. An invite link goes straight to Security."
      className="min-w-[880px]"
    >
      <div className="flex items-center gap-2">
        {FLOW.map((label, i) => (
          <React.Fragment key={label}>
            <FlowNode label={label} step={i < 3 ? i + 1 : undefined} />
            {i < FLOW.length - 1 && <FlowArrow />}
          </React.Fragment>
        ))}
      </div>
      {/* Branch: invite link → Security (sits under Organization, points up-right to Security) */}
      <div className="mt-4 flex items-center gap-2 pl-[136px]">
        <FlowNode label="Invite link" muted />
        <CornerRightUp className="w-5 h-5 text-[#C3CAD5]" aria-hidden="true" />
        <span className="text-[12px] leading-[16px] text-[#4B5465]">Skips to Security with steps 1–2 pre-filled</span>
      </div>
    </div>
  </div>
);

/* ── Layout anatomy ──────────────────────────────────────────────── */

const ANATOMY: { n: number; name: string; detail: string; group: 'Screen' | 'Card' }[] = [
  { n: 1, name: 'Background', detail: 'Same use-case illustration or photo as Login', group: 'Screen' },
  { n: 2, name: 'Help link', detail: '"Need help?" + "Contact support", top-right', group: 'Screen' },
  { n: 3, name: 'Logo and chip', detail: '<Logo size={40} /> + product chip, 24px below', group: 'Card' },
  { n: 4, name: 'Stepper', detail: '24px circles, 12px labels, 1px lines; "Step n of 3" on mobile', group: 'Card' },
  { n: 5, name: 'Heading', detail: 'H1 24/32 + subtitle per step', group: 'Card' },
  { n: 6, name: 'Fields', detail: '40px inputs, label above, 16px apart', group: 'Card' },
  { n: 7, name: 'Actions', detail: 'Ghost "Back" (steps 2–3) above one full-width Primary', group: 'Card' },
  { n: 8, name: 'Sign-in link', detail: '"Already have an account? Sign in", centered', group: 'Card' },
  { n: 9, name: 'Footer', detail: '© · Privacy · Terms · version, 24px from the bottom', group: 'Screen' },
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
      aria-label="Register layout: background, help link top-right, a centered card with logo and chip, stepper, heading, fields, actions and sign-in link, and a footer."
    >
      <div className="absolute top-[70%] -left-[5%] w-[110%] h-[60%] bg-[#EEF1F6] origin-top-left -rotate-3" />
      <div className="absolute -left-4 -bottom-3 w-[20%] aspect-[4/3] rounded-[12px] border-[1.5px] border-[#1E63FF]/35 bg-[#1E63FF]/[0.08]" />
      <Marker n={1} className="left-3 top-[60%]" />
      <div className="absolute right-3 top-3 flex items-center gap-1.5">
        <span className="h-1.5 w-10 rounded-full bg-[#C3CAD5]" />
        <span className="h-1.5 w-12 rounded-full bg-[#1E63FF]/60" />
      </div>
      <Marker n={2} className="right-[110px] top-1.5" />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[38%] rounded-[8px] bg-white border border-[#DDE2EA] shadow-[0_12px_32px_rgba(11,45,107,0.12)] p-[3%] flex flex-col gap-[5%]">
        <div className="relative flex flex-col items-center gap-1">
          <span className="h-2 w-1/2 rounded-full bg-[#121722]/70" />
          <span className="h-1.5 w-1/4 rounded-full bg-[#1E63FF]/30" />
          <Marker n={3} className="-left-7 -top-1" />
        </div>
        <div className="relative flex items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1E63FF]" />
          <span className="flex-1 h-px bg-[#C3CAD5] mx-1" />
          <span className="w-2.5 h-2.5 rounded-full border border-[#8C95A6] bg-white" />
          <span className="flex-1 h-px bg-[#C3CAD5] mx-1" />
          <span className="w-2.5 h-2.5 rounded-full border border-[#8C95A6] bg-white" />
          <Marker n={4} className="-right-7 -top-1" />
        </div>
        <div className="relative space-y-1">
          <span className="block h-2 w-2/3 rounded-full bg-[#121722]/70" />
          <span className="block h-1 w-4/5 rounded-full bg-[#C3CAD5]" />
          <Marker n={5} className="-left-7 -top-1" />
        </div>
        <div className="relative space-y-1.5">
          <span className="block h-3 rounded-[3px] border border-[#8C95A6]" />
          <span className="block h-3 rounded-[3px] border border-[#8C95A6]" />
          <span className="block h-3 rounded-[3px] border border-[#8C95A6]" />
          <Marker n={6} className="-left-7 top-1" />
        </div>
        <div className="relative">
          <span className="block h-3.5 rounded-[3px] bg-[#1E63FF]" />
          <Marker n={7} className="-left-7 -top-0.5" />
        </div>
        <div className="relative flex justify-center">
          <span className="h-1 w-2/3 rounded-full bg-[#C3CAD5]" />
          <Marker n={8} className="-right-7 -top-2" />
        </div>
      </div>

      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 h-1.5 w-[30%] rounded-full bg-[#C3CAD5]" />
      <Marker n={9} className="bottom-1 left-[32%]" />
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

const MiniCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-[180px] rounded-[6px] bg-white border border-[#DDE2EA] shadow-[0_4px_12px_rgba(11,45,107,0.12)] p-2.5 flex flex-col gap-1.5 ${className}`}>
    {children}
  </div>
);

const MiniInput: React.FC = () => <span className="block h-2.5 rounded-[2px] border border-[#8C95A6]" />;
const MiniPrimary: React.FC = () => <span className="block h-3 rounded-[2px] bg-[#1E63FF]" />;

const MiniStepper: React.FC = () => (
  <span className="flex items-center">
    <span className="w-2.5 h-2.5 rounded-full bg-[#1E63FF]" />
    <span className="flex-1 h-px bg-[#C3CAD5] mx-1" />
    <span className="w-2.5 h-2.5 rounded-full border border-[#8C95A6]" />
    <span className="flex-1 h-px bg-[#C3CAD5] mx-1" />
    <span className="w-2.5 h-2.5 rounded-full border border-[#8C95A6]" />
  </span>
);

const MiniRule: React.FC<{ met: boolean; label: string }> = ({ met, label }) => (
  <span className="flex items-center gap-1 text-[10px] leading-[14px] text-[#353D4C]">
    {met ? <CheckCircle2 className="w-3 h-3 text-[#1E63FF]" aria-hidden="true" /> : <Circle className="w-3 h-3 text-[#8C95A6]" aria-hidden="true" />}
    {label}
  </span>
);

const MiniAlert: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-[260px] p-3 rounded-[8px] bg-[#1E63FF]/[0.08] border-l-4 border-l-[#1E63FF] text-[12px] leading-[16px] text-[#121722]">
    {children}
  </div>
);

/* ── Page content ────────────────────────────────────────────────── */

const ACCESSIBILITY_NOTES: { title: string; text: string }[] = [
  { title: 'A real form per step', text: 'Each step is a native <form>; Enter submits the current step and the data is kept between steps.' },
  { title: 'Labels and autocomplete', text: 'Every input has a <label for>; autocomplete="name", "email", "organization" and "new-password" help password managers.' },
  { title: 'Announced changes', text: 'Errors, password strength and "Passwords match" sit in aria-live="polite" regions; inputs set aria-invalid and aria-describedby.' },
  { title: 'Stepper and focus', text: 'The current step has aria-current="step" and "Step n of 3" is always available; focus moves to the step heading on every step change.' },
  { title: 'Strength without color', text: 'The meter always shows "Weak / Fair / Good / Strong" as text, and each checklist line says met or not met.' },
  { title: 'Focus, contrast and targets', text: 'Royal Blue focus rings on every control, AA contrast, 44px hit areas for checkboxes, links and options; reflows at 320px and 200% zoom.' },
];

const CONTENT_RULES = [
  'Sentence case everywhere, including buttons and headings.',
  'Start buttons with a verb: "Continue", "Create account", "Verify email".',
  'Name the product in the first step: "Get started with VisionEdge ANPR in a few steps."',
  'No jargon: "work email" and "site / campus", not "UPN" or "tenant".',
  'Helpful, specific errors that say how to fix the problem.',
  'Never confirm whether an account exists for an email address.',
];

const CONTENT_EXAMPLES: { avoid: string; use: string }[] = [
  { avoid: 'Invalid phone', use: COPY.errors.phone },
  { avoid: 'Email is required', use: COPY.errors.email },
  { avoid: 'This email is already registered', use: `${COPY.alerts.takenBefore}Sign in or reset your password.` },
  { avoid: 'Password too weak', use: COPY.errors.password },
  { avoid: 'Submit', use: COPY.actions.create },
];

const TH = 'py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left';

const RegisterTemplatePage: React.FC = () => {
  const [state, setState] = useState<RegisterStateId>('step-account');
  const showcaseRef = useRef<HTMLElement>(null);

  const previewState = (id: RegisterStateId) => {
    setState(id);
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      <PageHeader
        category="TEMPLATES"
        title="Register Page"
        description="Reference sign-up and access-request flow for every VisionEdge product. Pair it with the Login Page template."
      />

      <section id="showcase" ref={showcaseRef} className="mb-12 scroll-mt-24">
        <TemplateShowcase
          states={REGISTER_STATES}
          state={state}
          onStateChange={setState}
          stateGroupLabel="Register state"
          previewPath={REGISTER_PREVIEW_PATH}
          urlPill="app.visionedge.ai/register"
          sourceFiles={SOURCE_FILES}
          sourceDir="src/pages/templates/register"
          renderScreen={(props) => <RegisterScreen {...props} />}
        />
      </section>

      <section id="flow" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Flow Overview</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">
          Three short steps, then email verification and administrator approval. Invitations skip straight to Security.
        </p>
        <FlowDiagram />
      </section>

      <section id="anatomy" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Layout Anatomy</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">
          The same frame as Login, with a 480px card for the guided steps.
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
              {REGISTER_STATES.map((s) => (
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
          The full-screen route runs the whole flow with demo data — verification code{' '}
          <code className="font-mono text-[12px] text-[#1E63FF]">123456</code>; try{' '}
          <code className="font-mono text-[12px] text-[#1E63FF]">taken@organization.com</code> or a Gmail address, or open{' '}
          <code className="font-mono text-[12px] text-[#1E63FF]">?state=invite</code>.
        </p>
      </section>

      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">Specifications</h2>
        <SpecTable
          rows={[
            { property: 'Card Width', value: '480px (100% − 32px on mobile)', token: 'max-w-[480px] · px-4' },
            { property: 'Card Radius', value: '16px', token: 'radius-xl' },
            { property: 'Card Padding', value: '40px (24px on mobile)', token: 'p-10 · p-6' },
            { property: 'Input Height', value: '40px, label above', token: 'h-10' },
            { property: 'Button Height', value: '48px, full width (one Primary per step)', token: 'h-12 w-full' },
            { property: 'Stepper Circle', value: '24px, 12px Medium label, 1px connecting lines', token: 'w-6 h-6' },
            { property: 'Strength Meter', value: '4 segments × 4px high, 4px gap, full radius', token: 'h-1 gap-1 rounded-full' },
            { property: 'Field Spacing', value: '16px', token: 'gap-4' },
            { property: 'Section Spacing', value: '24px (logo block, stepper, heading, actions)', token: 'mb-6' },
            { property: 'OTP Boxes', value: '6 × 48×56px, JetBrains Mono 20px', token: 'max-w-12 h-14' },
            { property: 'Mobile', value: 'Stepper labels hidden, "Step n of 3" shown; illustrations hidden', token: '< 768px' },
          ]}
        />
      </section>

      <section id="do-dont" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-2">Do &amp; Don&apos;t</h2>
        <DoDontPair
          doTitle="Do split long forms into 3 short steps"
          doDescription="A stepper and a few fields per step keep the task approachable."
          doExample={
            <MiniCard>
              <MiniStepper />
              <MiniInput />
              <MiniInput />
              <MiniPrimary />
            </MiniCard>
          }
          dontTitle="Don't show every field on one long page"
          dontDescription="Twelve fields at once feel like paperwork and hide progress."
          dontExample={
            <MiniCard className="max-h-[120px] overflow-hidden">
              {Array.from({ length: 9 }, (_, i) => (
                <MiniInput key={i} />
              ))}
            </MiniCard>
          }
        />
        <DoDontPair
          doTitle="Do show password rules as a live checklist"
          doDescription="Each requirement ticks as it's met, next to the strength meter."
          doExample={
            <MiniCard>
              <MiniInput />
              <span className="grid grid-cols-4 gap-0.5">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={`h-1 rounded-full ${i < 2 ? 'bg-[#1E63FF]' : 'bg-[#DDE2EA]'}`} />
                ))}
              </span>
              <MiniRule met label="At least 12 characters" />
              <MiniRule met label="One number" />
              <MiniRule met={false} label="One symbol" />
            </MiniCard>
          }
          dontTitle="Don't reveal the rules only after an error"
          dontDescription="People shouldn't have to guess, fail and try again."
          dontExample={
            <MiniCard>
              <span className="block h-2.5 rounded-[2px] border-2 border-[#0B2D6B]" />
              <span className="text-[10px] leading-[14px] font-medium text-[#0B2D6B]">Password doesn&apos;t meet the policy</span>
            </MiniCard>
          }
        />
        <DoDontPair
          doTitle="Do use privacy-safe messages for existing emails"
          doDescription="Say what happens next without revealing whether an account exists."
          doExample={<MiniAlert>If this email can be registered, we&apos;ll send a verification code.</MiniAlert>}
          dontTitle="Don't confirm whether an account exists"
          dontDescription="It tells attackers which emails are real."
          dontExample={<MiniAlert>An account with priya.sharma@organization.com already exists.</MiniAlert>}
        />
        <DoDontPair
          doTitle="Do keep one Primary action per step"
          doDescription='"Continue" or "Create account" — Back is a Ghost button.'
          doExample={
            <MiniCard>
              <span className="text-[10px] leading-[14px] font-semibold text-[#1E63FF]">← Back</span>
              <MiniPrimary />
            </MiniCard>
          }
          dontTitle="Don't add social sign-up buttons"
          dontDescription="VisionEdge access is issued through your organization."
          dontExample={
            <MiniCard>
              <MiniPrimary />
              {[0, 1, 2].map((i) => (
                <span key={i} className="block h-3 rounded-[2px] border border-[#8C95A6]" />
              ))}
            </MiniCard>
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

export default RegisterTemplatePage;
