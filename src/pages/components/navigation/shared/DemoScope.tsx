import React from 'react';

interface DemoScopeProps {
  /** Accessible name of the demo region. */
  label: string;
  /**
   * Handle a key pressed while focus is inside the demo. Return true when it was a demo shortcut:
   * the event is then stopped here, so it never reaches the real app's own shortcuts (Ctrl K, etc.).
   */
  onShortcut: (e: React.KeyboardEvent) => boolean;
  className?: string;
  children: React.ReactNode;
}

/** Keyboard boundary for demos: shortcuts only work while focus is inside, and never leak to the app. */
export const DemoScope: React.FC<DemoScopeProps> = ({ label, onShortcut, className = '', children }) => (
  <div
    role="group"
    aria-label={label}
    className={className}
    onKeyDown={(e) => {
      if (onShortcut(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }}
  >
    {children}
  </div>
);
