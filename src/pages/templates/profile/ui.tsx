/**
 * Small UI pieces for the profile template, built to the existing standards
 * (Buttons, Cards, Selection controls, Alerts & Modals, Tooltips). The app has no shared
 * Modal, Toggle, Checkbox or Tooltip component, so they live here; everything else is imported.
 */
import React, { useEffect, useId, useRef } from 'react';
import { Loader2, X } from 'lucide-react';
import { BUTTON as DASHBOARD_BUTTON, IconButton } from '../dashboard/primitives';

export { Badge, IconButton, LINK, POPOVER, Skeleton, demoLink, usePopover } from '../dashboard/primitives';

const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2';
const HIT = "relative after:absolute after:content-[''] after:-inset-y-1.5 after:inset-x-0";

/** Dashboard button styles plus Ghost (40px) and Destructive (Gray 900, Buttons standard). */
export const BUTTON = {
  ...DASHBOARD_BUTTON,
  ghost: `inline-flex items-center justify-center gap-2 h-10 px-4 rounded-[8px] text-[#1E63FF] text-[14px] font-semibold whitespace-nowrap hover:bg-[#EEF1F6] hover:text-[#0B2D6B] transition-colors ${FOCUS}`,
  destructive: `inline-flex items-center justify-center gap-2 h-10 px-4 rounded-[8px] bg-[#121722] text-white text-[14px] font-semibold whitespace-nowrap shadow-sm hover:bg-black transition-colors ${FOCUS}`,
  destructiveSm: `${HIT} inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-[8px] bg-[#121722] text-white text-[12px] font-semibold whitespace-nowrap hover:bg-black transition-colors ${FOCUS}`,
  disabled:
    'inline-flex items-center justify-center gap-2 h-10 px-4 rounded-[8px] bg-[#EEF1F6] text-[#8C95A6] border border-[#DDE2EA] text-[14px] font-semibold whitespace-nowrap cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2',
} as const;

export const OVERLINE = 'text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#6B7485]';

export const CHECKBOX =
  'w-4 h-4 shrink-0 rounded-[4px] border border-[#8C95A6] accent-[#1E63FF] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2 disabled:cursor-not-allowed aria-disabled:cursor-not-allowed aria-disabled:opacity-60';

export const RADIO =
  'w-4 h-4 shrink-0 border border-[#8C95A6] accent-[#1E63FF] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2 disabled:cursor-not-allowed';

export const NATIVE_SELECT =
  'h-10 pl-3 pr-8 rounded-[8px] border border-[#8C95A6] bg-white text-[14px] text-[#121722] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20 disabled:bg-[#EEF1F6] disabled:text-[#8C95A6] disabled:border-[#DDE2EA] disabled:cursor-not-allowed';

export const TEXT_INPUT =
  'h-10 px-3 rounded-[8px] border border-[#8C95A6] bg-white text-[16px] @min-[640px]:text-[14px] text-[#121722] placeholder:text-[#6B7485] outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20';

/** Masked or technical values (IDs, IPs, keys). */
export const MONO = 'font-mono text-[13px] text-[#121722]';

/* ── Spinner ─────────────────────────────────────────────────────── */

export const Spinner: React.FC = () => <Loader2 className="w-4 h-4 motion-safe:animate-spin" aria-hidden="true" />;

/* ── Avatar ──────────────────────────────────────────────────────── */

const AVATAR_SIZES = {
  88: 'w-[88px] h-[88px] text-[28px]',
  64: 'w-16 h-16 text-[22px]',
  32: 'w-8 h-8 text-[12px]',
  24: 'w-6 h-6 text-[10px]',
} as const;

/** Initials on Royal Blue, or an uploaded image. Decorative: the name is always next to it. */
export const Avatar: React.FC<{ initials: string; size: keyof typeof AVATAR_SIZES; src?: string | null; tone?: 'royal' | 'navy' }> = ({
  initials,
  size,
  src,
  tone = 'royal',
}) =>
  src ? (
    <img src={src} alt="" className={`${AVATAR_SIZES[size]} shrink-0 rounded-full object-cover bg-[#EEF1F6]`} />
  ) : (
    <span
      className={`${AVATAR_SIZES[size]} shrink-0 rounded-full ${tone === 'royal' ? 'bg-[#1E63FF]' : 'bg-[#0B2D6B]'} text-white font-semibold flex items-center justify-center select-none`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );

/* ── Card ────────────────────────────────────────────────────────── */

interface ProfileCardProps {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  overlay?: React.ReactNode;
  /** Remove the body padding (tables that run edge to edge). */
  flush?: boolean;
  children: React.ReactNode;
}

/** White card, 1px Gray 200, 12px radius, 24px padding (16px on mobile), H4 title. */
export const ProfileCard: React.FC<ProfileCardProps> = ({ title, description, actions, className = '', overlay, flush = false, children }) => {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className={`relative min-w-0 bg-white rounded-[12px] border border-[#DDE2EA] shadow-[0_1px_3px_rgba(11,45,107,0.08)] ${flush ? '' : 'p-4 @min-[768px]:p-6'} ${className}`}
    >
      {overlay}
      <div className={`flex flex-wrap items-start justify-between gap-x-4 gap-y-2 ${flush ? 'p-4 @min-[768px]:p-6 pb-4!' : 'mb-4'}`}>
        <div className="min-w-0">
          <h4 id={titleId} className="text-[16px] leading-[24px] font-semibold text-[#121722]">
            {title}
          </h4>
          {description && <p className="mt-0.5 text-[14px] leading-[20px] text-[#4B5465]">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
};

/* ── Tooltip ─────────────────────────────────────────────────────── */

/**
 * Hover and focus tooltip (Gray 800, 12px). The child receives the tooltip id for aria-describedby,
 * so the text is announced with the control.
 */
export const Tooltip: React.FC<{
  content: string;
  children: (describedBy: string) => React.ReactNode;
  placement?: 'top' | 'bottom';
  align?: 'center' | 'start' | 'end';
  className?: string;
}> = ({ content, children, placement = 'top', align = 'center', className = '' }) => {
  const id = useId();
  const position = placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';
  const alignment = align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'start' ? 'left-0' : 'right-0';
  return (
    <span className={`relative inline-flex group/tip ${className}`}>
      {children(id)}
      <span
        id={id}
        role="tooltip"
        className={`pointer-events-none absolute ${position} ${alignment} z-50 w-max max-w-[240px] rounded-[4px] bg-[#1F2633] px-2.5 py-1.5 text-[12px] leading-[16px] font-normal normal-case tracking-normal text-white text-left opacity-0 transition-opacity group-hover/tip:opacity-100 group-focus-within/tip:opacity-100`}
      >
        {content}
      </span>
    </span>
  );
};

/* ── Toggle ──────────────────────────────────────────────────────── */

interface ToggleProps {
  label: string;
  description?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/** Labelled row with a 36×20 switch (Selection controls standard) and a 44px hit area. */
export const Toggle: React.FC<ToggleProps> = ({ label, description, checked, onChange, disabled = false }) => {
  const labelId = useId();
  const descId = useId();
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="min-w-0">
        <span id={labelId} className="block text-[14px] leading-[20px] font-medium text-[#121722]">
          {label}
        </span>
        {description && (
          <span id={descId} className="block mt-0.5 text-[12px] leading-[16px] text-[#4B5465]">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={description ? descId : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="relative shrink-0 w-11 h-11 -my-2.5 -mr-1 flex items-center justify-center rounded-[8px] outline-none group/switch disabled:cursor-not-allowed"
      >
        <span
          className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors group-focus-visible/switch:ring-2 group-focus-visible/switch:ring-[#1E63FF] group-focus-visible/switch:ring-offset-2 ${
            disabled ? 'bg-[#DDE2EA]' : checked ? 'bg-[#1E63FF]' : 'bg-[#C3CAD5]'
          }`}
          aria-hidden="true"
        >
          <span className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
        </span>
      </button>
    </div>
  );
};

/* ── Chip ────────────────────────────────────────────────────────── */

/** Site chip; removable (with a 44px hit area) in editable mode. */
export const Chip: React.FC<{ children: React.ReactNode; onRemove?: () => void; removeLabel?: string }> = ({ children, onRemove, removeLabel }) => (
  <span className="inline-flex items-center gap-1 h-7 pl-2.5 pr-2.5 rounded-full bg-[#EEF1F6] border border-[#DDE2EA] text-[13px] font-medium text-[#353D4C] has-[button]:pr-0.5">
    {children}
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className={`relative after:absolute after:content-[''] after:-inset-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[#4B5465] hover:bg-[#DDE2EA] hover:text-[#121722] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]`}
      >
        <X className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    )}
  </span>
);

/* ── Modal ───────────────────────────────────────────────────────── */

interface ModalProps {
  title: string;
  description?: React.ReactNode;
  /** 480px (confirmations, short forms) or 640px (larger forms, the crop tool). */
  size?: 480 | 640;
  onClose: () => void;
  /** Footer actions, right-aligned; stacked full width on narrow screens. */
  footer?: React.ReactNode;
  /** Element to focus first; defaults to the first field or button in the body. */
  initialFocus?: React.RefObject<HTMLElement | null>;
  /** "alertdialog" for confirmations that interrupt. */
  role?: 'dialog' | 'alertdialog';
  children?: React.ReactNode;
}

const FOCUSABLE = ['button:not([disabled])', 'a[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]']
  .map((s) => `${s}:not([tabindex="-1"])`)
  .join(', ');

/**
 * Modal (Alerts & Modals standard): 16px radius, elevation-3, Black 50% scrim.
 * Focus moves in, Tab stays inside, Esc closes, and focus returns to the trigger on close.
 */
export const Modal: React.FC<ModalProps> = ({ title, description, size = 480, onClose, footer, initialFocus, role = 'dialog', children }) => {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const first =
      initialFocus?.current ??
      dialogRef.current?.querySelector<HTMLElement>(`[data-modal-body] :is(${FOCUSABLE})`) ??
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // A listbox open inside the modal closes first.
        const target = e.target as Partial<HTMLElement> | null;
        if (typeof target?.getAttribute === 'function' && target.getAttribute('aria-expanded') === 'true') return;
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      // Return focus to whatever opened the modal, if it is still on the page.
      if (trigger?.isConnected) trigger.focus();
    };
  }, []); // Mount only: focus handling must not re-run on every render.

  return (
    <div className="fixed inset-0 z-[70] flex items-end @min-[640px]:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={`relative w-full ${size === 480 ? 'max-w-[480px]' : 'max-w-[640px]'} max-h-full flex flex-col rounded-[16px] bg-white border border-[#DDE2EA] shadow-[0_12px_32px_rgba(11,45,107,0.18)]`}
      >
        <div className="flex items-start justify-between gap-4 pl-6 pr-3 pt-5 pb-3">
          <div className="min-w-0 pt-1">
            <h2 id={titleId} className="text-[20px] leading-[28px] font-semibold text-[#121722]">
              {title}
            </h2>
            {description && (
              <div id={descId} className="mt-1 text-[14px] leading-[20px] text-[#4B5465]">
                {description}
              </div>
            )}
          </div>
          <IconButton icon={X} label="Close" onClick={onClose} />
        </div>
        {children && (
          <div data-modal-body className="px-6 pb-6 pt-1 overflow-y-auto min-h-0">
            {children}
          </div>
        )}
        {footer && (
          <div className="flex flex-col-reverse @min-[480px]:flex-row @min-[480px]:justify-end gap-2 px-6 py-4 border-t border-[#DDE2EA] bg-[#F7F9FC] rounded-b-[16px] [&>*]:w-full @min-[480px]:[&>*]:w-auto">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
