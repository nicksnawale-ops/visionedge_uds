import React, { useState } from 'react';
import { Check, ExternalLink, X } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { SpecTable } from '../../../components/common/SpecTable';
import { DoDontPair } from '../../../components/common/DoDont';
import { CodeBlock } from '../../../components/common/CodeBlock';
import { SHOWCASE_STYLES, SourceFile, TemplateShowcase } from '../shared/TemplateShowcase';
import { ErrorPage } from './ErrorPage';
import { ERRORS_PREVIEW_PATH } from './paths';
import { ERROR_GROUPS, ERROR_TYPES, ErrorContext, ErrorTypeId, getErrorType } from './errorTypes';

import errorPageSource from './ErrorPage.tsx?raw';
import errorTypesSource from './errorTypes.ts?raw';
import detailsSource from './TechnicalDetails.tsx?raw';
import countdownSource from './RetryCountdown.tsx?raw';
import partsSource from './illustrations/parts.tsx?raw';

const DIR = 'src/pages/templates/errors';

const SOURCE_FILES: SourceFile[] = [
  { name: 'ErrorPage.tsx', code: errorPageSource },
  { name: 'errorTypes.ts', code: errorTypesSource },
  { name: 'TechnicalDetails.tsx', code: detailsSource },
  { name: 'RetryCountdown.tsx', code: countdownSource },
  { name: 'parts.tsx', code: partsSource, dir: `${DIR}/illustrations` },
];

const { SEGMENT_GROUP, SEGMENT, SEGMENT_ON, SEGMENT_OFF } = SHOWCASE_STYLES;
const TH = 'py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left';
const TABLE_WRAP = 'overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]';

const ANATOMY: { n: number; name: string; detail: string }[] = [
  { n: 1, name: 'Logo', detail: '32px VisionEdge logo + name, top-left 32px; links home (Full page only)' },
  { n: 2, name: 'Illustration', detail: '200 × 160 (160 in-app), decorative, aria-hidden' },
  { n: 3, name: 'Code label', detail: 'Overline pill, Royal Blue 8% fill: "ERROR 503", "MAINTENANCE"' },
  { n: 4, name: 'Title', detail: 'H1 28/36 SemiBold (24/32 in-app); receives focus on load' },
  { n: 5, name: 'Message', detail: '16/24 Gray 600, 2–3 lines: what happened and what to do' },
  { n: 6, name: 'Actions', detail: 'One Primary Large (48px) + one Secondary; stacked on mobile' },
  { n: 7, name: 'Extras', detail: 'Search, countdown, auto-retry, info box, checklist or browser list' },
  { n: 8, name: 'Technical details', detail: 'Collapsed disclosure: code, request ID, time, path + Copy' },
  { n: 9, name: 'Footer', detail: 'Support email, system status, copyright (Full page only)' },
];

const STATIC_FILES: { file: string; use: string }[] = [
  { file: '404.html', use: 'Unknown paths served by the proxy or CDN' },
  { file: '500.html', use: 'The app server returned an unhandled error' },
  { file: '502.html', use: 'The proxy got no valid answer from the app server' },
  { file: '503.html', use: 'The app is overloaded or restarting (auto-reloads every 30 s)' },
  { file: '504.html', use: 'The proxy timed out waiting for the app' },
  { file: 'maintenance.html', use: 'Switched on during scheduled maintenance windows' },
  { file: 'offline.html', use: 'Cached by the browser for when there is no connection' },
];

const NGINX = `# Serve the static fallback pages from the proxy, so they load even when the app is down.
error_page 404 /errors/404.html;
error_page 500 /errors/500.html;
error_page 502 503 504 /errors/503.html;

location /errors/ {
    root /var/www/visionedge;   # where public/errors/ is deployed
    internal;                   # only reachable as an error page
}

# During maintenance: return 503 with the maintenance page
# if (-f /var/www/visionedge/maintenance.on) { return 503; }
# error_page 503 /errors/maintenance.html;`;

const ACCESSIBILITY = [
  { title: 'Focus starts on the title', text: 'The H1 receives focus on load, so screen readers announce what happened first.' },
  { title: 'Status changes are announced', text: 'Countdown finished, retrying and back online are announced once through aria-live="polite" — never every second.' },
  { title: 'Decorative illustrations', text: 'Illustrations are aria-hidden; the code label, title and message carry the meaning.' },
  { title: 'Keyboard and touch', text: 'Every action is a real link or button, 48px tall, in a logical order; the details disclosure uses aria-expanded.' },
  { title: 'Contrast and zoom', text: 'AA contrast on Gray 50; layout works at 200% zoom and 320px width with no horizontal scroll.' },
  { title: 'Calm by default', text: 'No red, no flashing; the only motion is a 250ms fade-in, removed with reduced motion.' },
];

const ErrorsTemplatePage: React.FC = () => {
  const [type, setType] = useState<ErrorTypeId>('404');
  const [context, setContext] = useState<ErrorContext>('page');
  const meta = getErrorType(type);

  const changeContext = (c: ErrorContext) => {
    setContext(c);
    // Full-page-only types fall back to 404 in the In-app context.
    if (c === 'app' && !meta.contexts.includes('app')) setType('404');
  };

  return (
    <div>
      <PageHeader
        category="TEMPLATES"
        title="Error Pages"
        description="Generic error and availability pages for all VisionEdge products. Use the same page for every module."
      />

      <section id="showcase" className="mb-12 scroll-mt-24">
        <TemplateShowcase<ErrorTypeId>
          states={ERROR_TYPES.map((e) => ({ id: e.id, label: e.chip, behaviour: e.when }))}
          state={type}
          onStateChange={setType}
          stateGroupLabel="Error type"
          stateRowLabel="Error type"
          stateGroups={ERROR_GROUPS.map((g) => ({ label: g.label, ids: ERROR_TYPES.filter((e) => e.group === g.id).map((e) => e.id) }))}
          stateDisabledReason={(id) => (context === 'app' && !getErrorType(id).contexts.includes('app') ? 'Full page only' : undefined)}
          showUseCase={false}
          showBackgroundToggle={false}
          previewPath={ERRORS_PREVIEW_PATH}
          urlPill={`app.visionedge.ai${meta.path}`}
          sourceFiles={SOURCE_FILES}
          sourceDir={DIR}
          extraRows={[
            {
              label: 'Context',
              content: (
                <div role="group" aria-label="Context" className={SEGMENT_GROUP}>
                  {(
                    [
                      ['page', 'Full page'],
                      ['app', 'In-app'],
                    ] as const
                  ).map(([id, label]) => (
                    <button key={id} type="button" aria-pressed={context === id} onClick={() => changeContext(id)} className={`${SEGMENT} ${context === id ? SEGMENT_ON : SEGMENT_OFF}`}>
                      {label}
                    </button>
                  ))}
                </div>
              ),
            },
          ]}
          buildPreviewHref={({ state }) => `${ERRORS_PREVIEW_PATH}?type=${state}&context=${context}`}
          renderScreen={({ state }) => <ErrorPage type={state} context={context} embedded />}
        />
      </section>

      <section id="catalog" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Error Catalog</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">
          Fourteen pages cover every failure people see. There is no 505 page: HTTP 505 never reaches end users, and 500, 502, 503 and 504 cover server-side failures.
        </p>
        <div className={TABLE_WRAP}>
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                {['Code', 'Title', 'When it’s shown', 'Primary action', 'Secondary action', 'Auto-retry', 'Context'].map((h) => (
                  <th key={h} scope="col" className={TH}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {ERROR_TYPES.map((e) => (
                <tr key={e.id} className="align-top">
                  <th scope="row" className="py-3 px-4 text-left font-mono text-[13px] font-semibold text-[#121722] whitespace-nowrap">
                    {e.status ?? '—'}
                    {!/^Error/.test(e.label) && <span className="block font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">{e.label}</span>}
                  </th>
                  <td className="py-3 px-4 text-[#121722] min-w-[200px]">{e.title}</td>
                  <td className="py-3 px-4 text-[#4B5465] min-w-[240px]">{e.when}</td>
                  <td className="py-3 px-4 text-[#353D4C] whitespace-nowrap">{e.primary?.label ?? '—'}</td>
                  <td className="py-3 px-4 text-[#353D4C] whitespace-nowrap">{e.secondary?.label ?? '—'}</td>
                  <td className="py-3 px-4 text-[#353D4C]">{e.autoRetry ? 'Yes' : 'No'}</td>
                  <td className="py-3 px-4 text-[#353D4C] whitespace-nowrap">{e.contexts.length === 2 ? 'Both' : 'Full page'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="anatomy" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Layout Anatomy</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">The 503 page, which has every region. In-app pages drop the logo (1) and footer (9).</p>
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 items-start">
          <div className="h-[760px] rounded-[12px] border border-[#DDE2EA] overflow-hidden" inert>
            <ErrorPage type="503" embedded showAnatomy />
          </div>
          <ol className="space-y-3">
            {ANATOMY.map((a) => (
              <li key={a.n} className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-[#1E63FF] text-white text-[12px] font-semibold flex items-center justify-center shrink-0 tabular-nums">{a.n}</span>
                <span className="min-w-0">
                  <span className="block text-[14px] leading-[20px] font-semibold text-[#121722]">{a.name}</span>
                  <span className="block text-[13px] leading-[20px] text-[#4B5465]">{a.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="static" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Static Fallback Pages</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">
          Self-contained HTML in <code className="font-mono text-[13px]">public/errors/</code>: inline CSS, the logo as a data URI, inline SVG, no JavaScript bundle and no
          external requests. These pages must be hosted on the proxy/CDN so they load even when the app server is down.
        </p>
        <ul className="mb-6 rounded-[12px] border border-[#DDE2EA] bg-white divide-y divide-[#DDE2EA]">
          {STATIC_FILES.map((f) => (
            <li key={f.file} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
              <span className="font-mono text-[13px] text-[#121722] w-[140px]">{f.file}</span>
              <span className="flex-1 min-w-[200px] text-[13px] text-[#4B5465]">{f.use}</span>
              <a
                href={`/errors/${f.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[44px] text-[13px] font-semibold text-[#1E63FF] hover:underline rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
                aria-label={`Open ${f.file} in a new tab`}
              >
                Open
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        <CodeBlock code={NGINX} filename="nginx.conf (example)" />
      </section>

      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">Specifications</h2>
        <SpecTable
          rows={[
            { property: 'Content Width', value: 'Max 560px, centred text, Gray 50 background', token: 'max-w-[560px] bg-[#F7F9FC]' },
            { property: 'Illustration', value: '200 × 160 full page · 160 × 128 in-app; 1.5px Royal Blue 35% strokes, 8% / 12% fills', token: 'viewBox="0 0 200 160"' },
            { property: 'Code Label', value: 'Overline pill, Royal Blue 8% fill, Royal Blue text', token: 'bg-[#1E63FF]/[0.08] text-[#1E63FF]' },
            { property: 'Title', value: 'H1 28/36 SemiBold full page · 24/32 in-app', token: 'text-[28px] leading-[36px]' },
            { property: 'Message', value: '16/24 Gray 600, 2–3 lines', token: 'text-[16px] leading-[24px] text-[#4B5465]' },
            { property: 'Actions', value: 'Primary + Secondary Large (48px), 12px gap; full width below 640px', token: 'h-12 gap-3' },
            { property: 'Auto-retry', value: '20 s in the app (503) · 30 s on static pages; thin Royal Blue progress bar', token: 'seconds: 20' },
            { property: 'Countdown', value: 'JetBrains Mono, m:ss (h:mm:ss for maintenance)', token: 'font-mono tabular-nums' },
            { property: 'Details Box', value: 'Gray 50, 1px Gray 200, 8px radius, JetBrains Mono 12px', token: 'bg-[#F7F9FC] font-mono text-[12px]' },
            { property: 'Entrance', value: 'Fade in and rise 8px over 250ms; none with reduced motion', token: 'duration: 250' },
          ]}
        />
      </section>

      <section id="do-dont" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-2">Do &amp; Don&apos;t</h2>
        {(
          [
            ['Do say what happened and what to do next in plain words', '“The server didn’t respond in time. This is usually temporary.”', "Don't show raw stack traces or server messages", '“NullReferenceException at Gateway.Proxy…” helps no one.', 'The server took too long to respond', 'Error: upstream timed out (110) while reading response header'],
            ['Do offer one clear Primary action', 'Try again, Go to dashboard, Sign in again.', "Don't leave users at a dead end with no way back", 'A page with no buttons forces them to guess.', '[ Try again ]  [ Go back ]', '(no actions)'],
            ['Do auto-retry for temporary server errors and offline states', 'A countdown and a progress bar show it is handled.', "Don't make users refresh again and again", 'Repeated manual refreshes add load to a struggling server.', 'Retrying in 0:20…', 'Press F5 to try again'],
            ['Do show a request ID for support', 'req_7f3a9c21 lets support find the exact failure.', "Don't expose internal hostnames, IPs or file paths", 'They help attackers, not users.', 'Request ID req_7f3a9c21', 'app-node-07.internal (10.2.4.17) /srv/app/index.js'],
            ['Do keep error pages calm and on-brand', 'Royal Blue line art, friendly words.', "Don't use red, alarming icons or blame", '“You broke something” makes a bad moment worse.', 'Something went wrong on our side', 'FATAL ERROR!!! You broke something'],
          ] as const
        ).map(([doTitle, doDesc, dontTitle, dontDesc, good, bad]) => (
          <DoDontPair
            key={doTitle}
            doTitle={doTitle}
            doDescription={doDesc}
            doExample={<div className="w-[240px] rounded-[6px] bg-white border border-[#DDE2EA] p-3 text-[11px] leading-[16px] text-[#121722] text-center">{good}</div>}
            dontTitle={dontTitle}
            dontDescription={dontDesc}
            dontExample={<div className="w-[240px] rounded-[6px] bg-white border border-[#DDE2EA] p-3 font-mono text-[10px] leading-[14px] text-[#353D4C] break-all">{bad}</div>}
          />
        ))}
      </section>

      <section id="accessibility" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Accessibility</h2>
        <p className="text-[14px] text-[#4B5465] mb-4">Built into the template above — keep these when you adapt it.</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACCESSIBILITY.map((n) => (
            <li key={n.title} className="flex gap-3 p-4 rounded-[12px] border border-[#DDE2EA] bg-white">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-[#00C6FF]/15 text-[#0B2D6B] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] leading-[20px] font-semibold text-[#121722]">{n.title}</span>
                <span className="block mt-0.5 text-[13px] leading-[20px] text-[#4B5465]">{n.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section id="content">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">Content Guidelines</h2>
        <ul className="mb-6 space-y-2">
          {[
            'Sentence case for titles, labels and buttons.',
            'No jargon: “The server took too long to respond”, not “Gateway timeout”.',
            'No blame: describe what happened, not what the user did.',
            'Give a specific next step: Try again, Sign in again, Request access.',
            'State times in IST: “Expected back 04:00 IST”.',
          ].map((rule) => (
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
                ['404 Not Found', 'Page not found'],
                ['Forbidden', "You don't have access to this page"],
                ['Error: ETIMEDOUT', 'The request took too long'],
                ['Invalid user action', "Something's wrong with this request"],
                ['Service down until 22:30 UTC', 'Expected back 04:00 IST'],
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

export default ErrorsTemplatePage;
