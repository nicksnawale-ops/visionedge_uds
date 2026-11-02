import React, { useEffect, useState } from 'react';

interface SidebarLensPulseProps {
  /** True when the desktop sidebar is collapsed to the 72px rail. */
  collapsed: boolean;
}

const LENS_STYLES = `
.ve-lens-pulse {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 150px;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
.ve-lens-pulse[data-collapsed='true'] {
  height: 120px;
}
.ve-lens-pulse svg {
  display: block;
  width: 100%;
  height: 100%;
}
.ve-lens-dot {
  opacity: 0.35;
  animation: ve-lens-dot 2.5s ease-in-out infinite;
}
.ve-lens-ripple {
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.05);
  opacity: 0;
  animation: ve-lens-ripple 5s linear infinite;
}
.ve-lens-ripple--2 { animation-delay: 1.7s; }
.ve-lens-ripple--3 { animation-delay: 3.4s; }
.ve-lens-pulse[data-paused='true'] .ve-lens-dot,
.ve-lens-pulse[data-paused='true'] .ve-lens-ripple {
  animation-play-state: paused;
}
@keyframes ve-lens-dot {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.9; }
}
@keyframes ve-lens-ripple {
  0% { transform: scale(0.05); opacity: 0.5; }
  100% { transform: scale(1); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .ve-lens-dot { animation: none; }
  .ve-lens-ripple { animation: none; display: none; }
}
`;

/**
 * Decorative "lens pulse" layer pinned to the bottom of the design system
 * sidebar. Purely visual: aria-hidden, non-interactive, sits behind content.
 */
export const SidebarLensPulse: React.FC<SidebarLensPulseProps> = ({ collapsed }) => {
  const [paused, setPaused] = useState<boolean>(
    () => typeof document !== 'undefined' && document.visibilityState === 'hidden'
  );

  useEffect(() => {
    const onVisibilityChange = () => setPaused(document.visibilityState === 'hidden');
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  // Expanded: lens at bottom-right. Collapsed: bottom-centre of the rail.
  const cx = collapsed ? 110 : 190;
  const cy = 150;
  const rings = collapsed ? [40] : [40, 75, 110];

  return (
    <div
      className="ve-lens-pulse"
      aria-hidden="true"
      data-collapsed={collapsed ? 'true' : 'false'}
      data-paused={paused ? 'true' : 'false'}
    >
      <style>{LENS_STYLES}</style>
      <svg
        viewBox="0 0 220 150"
        preserveAspectRatio={collapsed ? 'xMidYMax slice' : 'xMaxYMax slice'}
        focusable="false"
      >
        {rings.map((r) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity={0.08}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {[1, 2, 3].map((n) => (
          <circle
            key={n}
            className={`ve-lens-ripple ve-lens-ripple--${n}`}
            cx={cx}
            cy={cy}
            r={120}
            fill="none"
            stroke="#00C6FF"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <circle cx={cx} cy={cy} r={14} fill="#00C6FF" fillOpacity={0.15} />
        <circle className="ve-lens-dot" cx={cx} cy={cy} r={5} fill="#00C6FF" />
      </svg>
    </div>
  );
};
