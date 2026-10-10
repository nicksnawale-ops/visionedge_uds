import React, { useEffect, useId, useRef, useState } from 'react';
import { Code2, Eye, Maximize2, Monitor, Smartphone, Tablet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CodeBlock } from '../../../components/common/CodeBlock';
import { usePhotoAvailable } from '../login/LoginBackground';
import { BackgroundStyle, USE_CASES, UseCaseId, getUseCase } from '../login/backgrounds';

/* ── Devices and styles ──────────────────────────────────────────── */

interface Device {
  id: 'desktop' | 'tablet' | 'mobile';
  label: string;
  width: number;
  height: number;
  icon: LucideIcon;
}

const DEVICES: Device[] = [
  { id: 'desktop', label: 'Desktop', width: 1440, height: 900, icon: Monitor },
  { id: 'tablet', label: 'Tablet', width: 1024, height: 768, icon: Tablet },
  { id: 'mobile', label: 'Mobile', width: 390, height: 844, icon: Smartphone },
];

const CHIP = 'px-3 py-1 rounded-full text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]';
const CHIP_ON = 'bg-[#1E63FF]/[0.08] text-[#1E63FF]';
const CHIP_OFF = 'text-[#4B5465] hover:bg-[#F7F9FC]';
const SEGMENT_GROUP = 'flex items-center p-0.5 bg-[#EEF1F6] rounded-[6px] border border-[#DDE2EA]';
const SEGMENT =
  'flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]';
const SEGMENT_ON = 'bg-white text-[#121722] shadow-sm font-semibold';
const SEGMENT_OFF = 'text-[#4B5465] hover:text-[#121722]';
const ROW_LABEL = 'text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] w-[72px] shrink-0';

/** Control styles for templates that add their own showcase rows (extraRows). */
export const SHOWCASE_STYLES = { CHIP, CHIP_ON, CHIP_OFF, SEGMENT_GROUP, SEGMENT, SEGMENT_ON, SEGMENT_OFF } as const;

/* ── Browser frame ───────────────────────────────────────────────── */

/** Browser-style frame. The screen renders at the device's real size, then scales down to fit. */
const BrowserFrame: React.FC<{ device: Device; urlPill: string; children: React.ReactNode }> = ({
  device,
  urlPill,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(device.width);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setAvailable(el.clientWidth);
    const observer = new ResizeObserver((entries) => setAvailable(entries[0].contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = Math.min(1, available / device.width);

  return (
    <div ref={ref} className="w-full">
      <div
        className="mx-auto rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden shadow-[0_4px_12px_rgba(11,45,107,0.12)]"
        style={{ width: device.width * scale }}
      >
        <div className="h-9 flex items-center gap-3 px-3 bg-[#F7F9FC] border-b border-[#DDE2EA]">
          <div className="flex gap-1.5 shrink-0" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-full bg-[#C3CAD5]" />
            ))}
          </div>
          <div className="flex-1 min-w-0 flex justify-center">
            <span className="max-w-full truncate inline-flex items-center h-6 px-3 rounded-full bg-white border border-[#DDE2EA] font-mono text-[12px] text-[#6B7485]">
              {urlPill}
            </span>
          </div>
          <div className="w-[42px] shrink-0" aria-hidden="true" />
        </div>
        <div className="relative overflow-hidden" style={{ width: device.width * scale, height: device.height * scale }}>
          <div
            className="overflow-y-auto overflow-x-hidden"
            style={{ width: device.width, height: device.height, transform: `scale(${scale})`, transformOrigin: 'top left' }}
          >
            {children}
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[12px] text-[#6B7485] tabular-nums">
        {device.label} · {device.width} × {device.height}
        {scale < 1 ? ` · shown at ${Math.round(scale * 100)}%` : ' · actual size'}
      </p>
    </div>
  );
};

/* ── Showcase ────────────────────────────────────────────────────── */

export interface ShowcaseState<S extends string> {
  id: S;
  label: string;
  /** One-line description shown under the preview. */
  behaviour: string;
}

export interface SourceFile {
  name: string;
  code: string;
  /** Folder, when it differs from the showcase sourceDir (e.g. shared files). */
  dir?: string;
}

export interface ScreenRenderProps<S extends string> {
  state: S;
  onStateChange: (state: S) => void;
  useCase: UseCaseId;
  background: BackgroundStyle;
}

interface TemplateShowcaseProps<S extends string> {
  states: ShowcaseState<S>[];
  state: S;
  onStateChange: (state: S) => void;
  /** Full-screen route, e.g. /templates/login/preview. */
  previewPath: string;
  /** Address shown in the browser frame, e.g. app.visionedge.ai/login. */
  urlPill: string;
  sourceFiles: SourceFile[];
  /** Folder shown in the code block filename. */
  sourceDir: string;
  renderScreen: (props: ScreenRenderProps<S>) => React.ReactNode;
  /** Accessible name of the state chip group, e.g. "Login state". */
  stateGroupLabel: string;
  /** Show the Illustration | Photo toggle (auth templates). Default true. */
  showBackgroundToggle?: boolean;
  /** Optional on/off toggle shown before "Open full screen", e.g. "Show anatomy". */
  extraToggle?: { label: string; pressed: boolean; onToggle: () => void };
  /** Custom full-screen URL; defaults to ?state=&usecase=&bg=. */
  buildPreviewHref?: (params: { state: S; useCase: UseCaseId; background: BackgroundStyle }) => string;
  /** Optional labelled rows of template-specific controls, shown after Use case. */
  extraRows?: { label: string; content: React.ReactNode }[];
  /** Label of the first row. Default "State". */
  stateRowLabel?: string;
  /** Show the Use case row. Default true (generic templates such as Error Pages hide it). */
  showUseCase?: boolean;
  /** Group the state chips under Overline headings. Default: one flat list. */
  stateGroups?: { label: string; ids: S[] }[];
  /** Reason a state can't be picked right now (chip disabled, reason shown as a tooltip). */
  stateDisabledReason?: (id: S) => string | undefined;
}

/**
 * Showcase card for page templates: State, Use case (+ Illustration/Photo for auth templates), Device,
 * an optional extra toggle, "Open full screen", Preview / Code, and the selected state's description.
 */
export function TemplateShowcase<S extends string>({
  states,
  state,
  onStateChange,
  previewPath,
  urlPill,
  sourceFiles,
  sourceDir,
  renderScreen,
  stateGroupLabel,
  showBackgroundToggle = true,
  extraToggle,
  buildPreviewHref,
  extraRows,
  stateRowLabel = 'State',
  showUseCase = true,
  stateGroups,
  stateDisabledReason,
}: TemplateShowcaseProps<S>) {
  const tooltipId = useId();
  const chipTipId = useId();
  const [device, setDevice] = useState<Device>(DEVICES[0]);
  const [useCaseId, setUseCaseId] = useState<UseCaseId>('generic');
  const [background, setBackground] = useState<BackgroundStyle>('illustration');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [file, setFile] = useState(sourceFiles[0].name);

  const useCase = getUseCase(useCaseId);
  const photoReady = usePhotoAvailable(useCase.photo) === true;
  const meta = states.find((s) => s.id === state);
  const source = sourceFiles.find((s) => s.name === file) ?? sourceFiles[0];

  // A use case without a photo file can't stay on "Photo".
  useEffect(() => {
    if (!photoReady && background === 'photo') setBackground('illustration');
  }, [photoReady, background]);

  const fullScreenHref = buildPreviewHref
    ? buildPreviewHref({ state, useCase: useCaseId, background })
    : `${previewPath}?state=${state}&usecase=${useCaseId}&bg=${background}`;

  return (
    <div className="rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
      <div className="border-b border-[#DDE2EA] px-4 py-3 space-y-3">
        {/* Row 1: state */}
        <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
          <span className={`${ROW_LABEL} pt-1.5`}>{stateRowLabel}</span>
          {stateGroups ? (
            <div role="group" aria-label={stateGroupLabel} className="flex flex-wrap gap-x-5 gap-y-2 flex-1 min-w-0">
              {stateGroups.map((g) => (
                <div key={g.label} role="group" aria-label={g.label} className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#6B7485] mr-0.5" aria-hidden="true">
                    {g.label}
                  </span>
                  {g.ids.map((id) => {
                    const s = states.find((x) => x.id === id);
                    if (!s) return null;
                    const reason = stateDisabledReason?.(s.id);
                    if (!reason) {
                      return (
                        <button key={s.id} type="button" aria-pressed={s.id === state} onClick={() => onStateChange(s.id)} className={`${CHIP} ${s.id === state ? CHIP_ON : CHIP_OFF}`}>
                          {s.label}
                        </button>
                      );
                    }
                    return (
                      <span key={s.id} className="relative group">
                        <button type="button" aria-pressed={false} aria-disabled="true" aria-describedby={`${chipTipId}-${s.id}`} className={`${CHIP} text-[#8C95A6] cursor-not-allowed`}>
                          {s.label}
                        </button>
                        <span
                          id={`${chipTipId}-${s.id}`}
                          role="tooltip"
                          className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 whitespace-nowrap rounded-[4px] bg-[#1F2633] px-2.5 py-1.5 text-[12px] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                        >
                          {reason}
                        </span>
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div role="group" aria-label={stateGroupLabel} className="flex flex-wrap gap-1.5 flex-1 min-w-0">
              {states.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={s.id === state}
                  onClick={() => onStateChange(s.id)}
                  className={`${CHIP} ${s.id === state ? CHIP_ON : CHIP_OFF}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Row 2: use case + background style */}
        {showUseCase && (
        <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
          <span className={`${ROW_LABEL} pt-1.5`}>Use case</span>
          <div role="group" aria-label="Use case" className="flex flex-wrap gap-1.5 flex-1 min-w-0">
            {USE_CASES.map((u) => (
              <button
                key={u.id}
                type="button"
                aria-pressed={u.id === useCaseId}
                onClick={() => setUseCaseId(u.id)}
                className={`${CHIP} ${u.id === useCaseId ? CHIP_ON : CHIP_OFF}`}
              >
                {u.label}
              </button>
            ))}
          </div>
          {showBackgroundToggle && (
            <div role="group" aria-label="Background style" className={SEGMENT_GROUP}>
              <button
                type="button"
                aria-pressed={background === 'illustration'}
                onClick={() => setBackground('illustration')}
                className={`${SEGMENT} ${background === 'illustration' ? SEGMENT_ON : SEGMENT_OFF}`}
              >
                Illustration
              </button>
              <span className="relative group">
                <button
                  type="button"
                  aria-pressed={background === 'photo'}
                  aria-disabled={!photoReady}
                  aria-describedby={photoReady ? undefined : tooltipId}
                  onClick={() => photoReady && setBackground('photo')}
                  className={`${SEGMENT} ${
                    !photoReady ? 'text-[#8C95A6] cursor-not-allowed' : background === 'photo' ? SEGMENT_ON : SEGMENT_OFF
                  }`}
                >
                  Photo
                </button>
                {!photoReady && (
                  <span
                    id={tooltipId}
                    role="tooltip"
                    className="pointer-events-none absolute right-0 top-full mt-2 z-20 whitespace-nowrap rounded-[4px] bg-[#1F2633] px-2.5 py-1.5 text-[12px] text-white font-mono opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    Add public/login-bg/{useCase.id}.webp to enable
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
        )}

        {extraRows?.map((row) => (
          <div key={row.label} className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className={ROW_LABEL}>{row.label}</span>
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">{row.content}</div>
          </div>
        ))}

        {/* Row 3: device, full screen, preview / code */}
        <div className="flex flex-wrap items-center gap-3">
          <span className={ROW_LABEL}>Device</span>
          <div role="group" aria-label="Device size" className={SEGMENT_GROUP}>
            {DEVICES.map((d) => {
              const Icon = d.icon;
              return (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={d.id === device.id}
                  onClick={() => setDevice(d)}
                  className={`${SEGMENT} ${d.id === device.id ? SEGMENT_ON : SEGMENT_OFF}`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {d.label} <span className="tabular-nums">({d.width})</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {extraToggle && (
              <button
                type="button"
                aria-pressed={extraToggle.pressed}
                onClick={extraToggle.onToggle}
                className={`${SEGMENT} h-8 border border-[#DDE2EA] ${extraToggle.pressed ? 'bg-[#1E63FF]/[0.08] text-[#1E63FF] font-semibold' : 'bg-white ' + SEGMENT_OFF}`}
              >
                {extraToggle.label}
              </button>
            )}
            <a
              href={fullScreenHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[13px] font-semibold text-[#1E63FF] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
            >
              <Maximize2 className="w-4 h-4" aria-hidden="true" />
              Open full screen
            </a>

            {/* Preview vs Code toggle (same pattern as PreviewPanel) */}
            <div className={SEGMENT_GROUP}>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`${SEGMENT} ${viewMode === 'preview' ? SEGMENT_ON : SEGMENT_OFF}`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('code')}
                className={`${SEGMENT} ${viewMode === 'code' ? SEGMENT_ON : SEGMENT_OFF}`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Code</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'preview' ? (
        <div className="preview-grid-canvas p-4 md:p-8">
          <BrowserFrame device={device} urlPill={urlPill}>
            {renderScreen({ state, onStateChange, useCase: useCaseId, background })}
          </BrowserFrame>
        </div>
      ) : (
        <div className="p-4 bg-[#F7F9FC] space-y-3">
          <div role="group" aria-label="Source file" className="flex flex-wrap gap-1.5">
            {sourceFiles.map((s) => (
              <button
                key={s.name}
                type="button"
                aria-pressed={s.name === file}
                onClick={() => setFile(s.name)}
                className={`${CHIP} font-mono ${s.name === file ? CHIP_ON : CHIP_OFF}`}
              >
                {s.name}
              </button>
            ))}
          </div>
          <CodeBlock code={source.code} filename={`${source.dir ?? sourceDir}/${source.name}`} />
        </div>
      )}

      {meta && (
        <div className="border-t border-[#DDE2EA] px-4 sm:px-6 py-4 text-[13px] leading-[20px] text-[#353D4C]">
          <span className="font-semibold text-[#121722]">{meta.label}: </span>
          {meta.behaviour}
        </div>
      )}
    </div>
  );
}
