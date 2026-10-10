import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDismiss } from '../hooks/useDismiss';
import { useIsCompact } from '../hooks/useIsCompact';
import { SURFACE } from '../ui/styles';
import { BottomSheet } from './BottomSheet';
import { focusInitial, panelKeyDown } from './focus';

interface PickerPopoverProps {
  open: boolean;
  onClose: () => void;
  /** Element the popover is positioned against (and that doesn't count as "outside"). */
  anchorRef: React.RefObject<HTMLElement | null>;
  /** Where focus returns after Esc or a container scroll (the trigger). */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /** aria-label of the dialog, e.g. "Choose date". */
  label: string;
  width: number;
  align?: 'start' | 'end';
  id?: string;
  /**
   * 'dialog' (default) moves focus inside and traps Tab.
   * 'listbox' keeps focus on the combobox input (time picker) and only hosts the list.
   */
  kind?: 'dialog' | 'listbox';
  padding?: string;
  children: React.ReactNode;
}

interface Position {
  top: number;
  left: number;
  width: number;
}

const Floating: React.FC<Omit<PickerPopoverProps, 'open'>> = ({
  onClose,
  anchorRef,
  returnFocusRef,
  label,
  width,
  align = 'start',
  id,
  kind = 'dialog',
  padding = 'p-4',
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Position | null>(null);

  useLayoutEffect(() => {
    const place = () => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor || !panel) return;
      const r = anchor.getBoundingClientRect();
      const w = Math.min(width, window.innerWidth - 16);
      let left = align === 'end' ? r.right - w : r.left;
      left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
      const h = panel.offsetHeight;
      let top = r.bottom + 4;
      if (top + h > window.innerHeight - 8 && r.top - h - 4 > 8) top = r.top - h - 4;
      setPos((p) => (p && p.top === top && p.left === left && p.width === w ? p : { top, left, width: w }));
    };
    place();
    const ro = new ResizeObserver(place);
    if (panelRef.current) ro.observe(panelRef.current);
    window.addEventListener('resize', place);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', place);
    };
  }, [anchorRef, width, align]);

  const placed = pos !== null;
  useEffect(() => {
    if (placed && kind === 'dialog' && panelRef.current) focusInitial(panelRef.current);
  }, [placed, kind]);

  useDismiss(true, [panelRef, anchorRef], (reason) => {
    const hadFocus = panelRef.current?.contains(document.activeElement) ?? false;
    onClose();
    if (reason === 'scroll' && hadFocus) returnFocusRef?.current?.focus({ preventScroll: true });
  });

  const close = () => {
    onClose();
    returnFocusRef?.current?.focus({ preventScroll: true });
  };

  return createPortal(
    <div
      ref={panelRef}
      id={id}
      role={kind === 'dialog' ? 'dialog' : undefined}
      aria-label={kind === 'dialog' ? label : undefined}
      onKeyDown={kind === 'dialog' ? (e) => panelKeyDown(e, panelRef.current, true, close) : undefined}
      style={pos ? { top: pos.top, left: pos.left, width: pos.width } : { top: 0, left: -9999, width, visibility: 'hidden' }}
      className={`fixed z-50 ${SURFACE} ${padding}`}
    >
      {children}
    </div>,
    document.body,
  );
};

/** Popover on desktop (portal, positioned against the trigger); bottom sheet below 768px. */
export const PickerPopover: React.FC<PickerPopoverProps> = ({ open, ...props }) => {
  const compact = useIsCompact();
  if (!open) return null;
  if (compact) {
    const close = () => {
      props.onClose();
      props.returnFocusRef?.current?.focus({ preventScroll: true });
    };
    return (
      <BottomSheet label={props.label} id={props.id} onClose={close}>
        {props.children}
      </BottomSheet>
    );
  }
  return <Floating {...props} />;
};
