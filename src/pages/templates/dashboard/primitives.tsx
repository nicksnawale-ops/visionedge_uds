/**
 * Small UI pieces for the dashboard template, built to the existing standards
 * (Cards, Buttons, Badges, Navigation). Kept local so no shared component changes.
 */
import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { StatusTone } from './data/events';
import { FLASH_MS } from './dashboardStates';

/* ── Buttons (Buttons standard) ──────────────────────────────────── */

const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2';
/** Small buttons are 32px visually with a 44px hit area. */
const HIT = "relative after:absolute after:content-[''] after:-inset-y-1.5 after:inset-x-0";

export const BUTTON = {
  primary: `inline-flex items-center justify-center gap-2 h-10 px-4 rounded-[8px] bg-[#1E63FF] text-white text-[14px] font-semibold whitespace-nowrap shadow-[0_1px_3px_rgba(30,99,255,0.3)] hover:bg-[#0B2D6B] transition-colors ${FOCUS}`,
  secondary: `inline-flex items-center justify-center gap-2 h-10 px-4 rounded-[8px] bg-white text-[#1E63FF] border border-[#1E63FF] text-[14px] font-semibold whitespace-nowrap hover:bg-[#F7F9FC] hover:text-[#0B2D6B] hover:border-[#0B2D6B] transition-colors ${FOCUS}`,
  secondarySm: `${HIT} inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-[8px] bg-white text-[#1E63FF] border border-[#1E63FF] text-[12px] font-semibold whitespace-nowrap hover:bg-[#F7F9FC] hover:text-[#0B2D6B] transition-colors ${FOCUS}`,
  ghostSm: `${HIT} inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-[8px] text-[#1E63FF] text-[12px] font-semibold whitespace-nowrap hover:bg-[#EEF1F6] hover:text-[#0B2D6B] transition-colors ${FOCUS}`,
  onDark: `inline-flex items-center justify-center gap-2 h-10 px-4 rounded-[8px] bg-white text-[#0B2D6B] text-[14px] font-semibold whitespace-nowrap hover:bg-[#00C6FF] transition-colors ${FOCUS}`,
  ghostOnDark: `inline-flex items-center justify-center gap-2 h-10 px-4 rounded-[8px] text-white text-[14px] font-semibold whitespace-nowrap hover:bg-white/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white`,
} as const;

/** Standalone link (Links standard). */
export const LINK = `inline-flex items-center min-h-[44px] text-[14px] font-medium text-[#1E63FF] rounded-[4px] hover:underline hover:text-[#0B2D6B] transition-colors ${FOCUS}`;

/** Prevents navigation on demo-only links. */
export const demoLink = (e: React.MouseEvent) => e.preventDefault();

export const IconButton: React.FC<
  { icon: LucideIcon; label: string; onDark?: boolean; ref?: React.Ref<HTMLButtonElement> } & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ icon: Icon, label, onDark = false, className = '', ref, ...rest }) => (
  <button
    ref={ref}
    type="button"
    aria-label={label}
    className={`relative w-11 h-11 shrink-0 rounded-[8px] flex items-center justify-center transition-colors ${
      onDark
        ? 'text-white/70 hover:text-white hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-white'
        : `text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] ${FOCUS}`
    } ${className}`}
    {...rest}
  >
    <Icon className="w-5 h-5" aria-hidden="true" />
  </button>
);

/* ── Badges (Badges standard, 24px pills) ────────────────────────── */

const BADGE_TONES: Record<StatusTone, string> = {
  live: 'bg-[#00C6FF]/15 text-[#0B2D6B]',
  info: 'bg-[#1E63FF]/[0.08] text-[#1E63FF]',
  critical: 'bg-[#0B2D6B] text-white',
  neutral: 'bg-[#EEF1F6] text-[#353D4C]',
};

export const Badge: React.FC<{ tone: StatusTone; children: React.ReactNode }> = ({ tone, children }) => (
  <span
    className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[12px] font-medium whitespace-nowrap ${BADGE_TONES[tone]}`}
  >
    {tone === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-[#00C6FF]" aria-hidden="true" />}
    {children}
  </span>
);

/* ── Card (Cards standard) ───────────────────────────────────────── */

interface CardProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  /** Anatomy marker or other overlay. */
  overlay?: React.ReactNode;
  children: React.ReactNode;
}

/** White card, 1px Gray 200 border, 12px radius, 24px padding, elevation-1. */
export const Card: React.FC<CardProps> = ({ title, subtitle, actions, className = '', overlay, children }) => {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className={`relative min-w-0 bg-white rounded-[12px] border border-[#DDE2EA] shadow-[0_1px_3px_rgba(11,45,107,0.08)] p-4 @min-[768px]:p-6 ${className}`}
    >
      {overlay}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 mb-4">
        <div className="min-w-0">
          <h2 id={titleId} className="text-[16px] leading-[24px] font-semibold text-[#121722]">
            {title}
          </h2>
          {subtitle && <p className="text-[12px] leading-[16px] text-[#4B5465]">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
};

/* ── Segmented control and tabs ──────────────────────────────────── */

interface Option<T extends string> {
  id: T;
  label: string;
}

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex items-center p-0.5 bg-[#EEF1F6] rounded-[8px] border border-[#DDE2EA]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={o.id === value}
          onClick={() => onChange(o.id)}
          className={`h-9 px-3 rounded-[6px] text-[13px] font-medium whitespace-nowrap transition-colors ${FOCUS} ${
            o.id === value ? 'bg-white text-[#121722] font-semibold shadow-sm' : 'text-[#4B5465] hover:text-[#121722]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Tabs with the Royal Blue 2px indicator (Navigation standard). Arrow keys move between tabs. */
export function Tabs<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = options[(index + (e.key === 'ArrowRight' ? 1 : options.length - 1)) % options.length];
    onChange(next.id);
    (e.currentTarget.parentElement?.querySelector(`[data-tab="${next.id}"]`) as HTMLElement | null)?.focus();
  };
  return (
    <div role="tablist" aria-label={label} className="flex items-center gap-1 border-b border-[#DDE2EA]">
      {options.map((o, i) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          data-tab={o.id}
          aria-selected={o.id === value}
          tabIndex={o.id === value ? 0 : -1}
          onClick={() => onChange(o.id)}
          onKeyDown={(e) => onKeyDown(e, i)}
          className={`-mb-px h-11 px-3 border-b-2 text-[14px] font-medium transition-colors ${FOCUS} ${
            o.id === value ? 'border-[#1E63FF] text-[#1E63FF]' : 'border-transparent text-[#4B5465] hover:text-[#121722]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ── Popovers ────────────────────────────────────────────────────── */

/** Open state for a menu or popover: closes on outside click and Esc (returning focus to the trigger). */
export function usePopover<T extends HTMLElement = HTMLButtonElement>() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<T>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return { open, setOpen, rootRef, triggerRef };
}

export const POPOVER =
  'absolute z-40 mt-2 rounded-[8px] bg-white border border-[#DDE2EA] shadow-[0_4px_12px_rgba(11,45,107,0.12)]';

/* ── Skeletons and motion ────────────────────────────────────────── */

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`block rounded-[4px] bg-[#EEF1F6] motion-safe:animate-pulse ${className}`} aria-hidden="true" />
);

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Briefly highlights an element (Royal Blue 8%, 600ms) when `value` changes. Not on first render. */
export function useFlash(ref: React.RefObject<HTMLElement | null>, value: string | number): void {
  const previous = useRef(value);
  useLayoutEffect(() => {
    if (previous.current === value) return;
    previous.current = value;
    const el = ref.current;
    if (!el?.animate || reducedMotion()) return;
    el.animate(
      [{ backgroundColor: 'rgba(30, 99, 255, 0.08)' }, { backgroundColor: 'rgba(30, 99, 255, 0)' }],
      { duration: FLASH_MS, easing: 'ease-out' }
    );
  }, [ref, value]);
}
