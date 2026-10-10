import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ICON_BTN } from './styles';

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon;
  label: string;
  /** 32px by default; 40px for touch. */
  touch?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

/** Hit area grows to 40×40 around the 32px visual so touch targets stay ≥40px. */
const HIT_AREA = "relative before:absolute before:-inset-1 before:content-['']";

/** Ghost icon button (32px visual with a 40px hit area; 40px on touch) with a required accessible label. */
export const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, label, touch = false, className = '', ref, type = 'button', ...rest }) => (
  <button ref={ref} type={type} aria-label={label} className={`${ICON_BTN} ${touch ? 'w-10 h-10' : `w-8 h-8 ${HIT_AREA}`} ${className}`} {...rest}>
    <Icon className="w-4 h-4" aria-hidden="true" />
  </button>
);
