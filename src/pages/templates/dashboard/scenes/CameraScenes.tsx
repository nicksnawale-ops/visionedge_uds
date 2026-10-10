/**
 * Decorative camera scenes, drawn in Gray 800 / Gray 700 on the Black camera tile.
 * Never real footage. aria-hidden: the tile's text describes the camera.
 */
import React from 'react';
import type { SceneKind } from '../data/useCases';

const G800 = '#1F2633';
const G700 = '#353D4C';

const Gate: React.FC = () => (
  <>
    <rect x="0" y="118" width="320" height="62" fill={G800} />
    <path d="M0 118 L120 92 H200 L320 118 Z" fill={G800} opacity="0.6" />
    {/* Guard booth */}
    <rect x="232" y="54" width="48" height="64" rx="3" fill={G700} />
    <rect x="240" y="64" width="32" height="18" rx="2" fill={G800} />
    {/* Barrier */}
    <rect x="216" y="86" width="10" height="32" fill={G700} />
    <rect x="60" y="86" width="160" height="6" rx="3" fill={G700} />
    {/* Car */}
    <path d="M128 128 V116 Q128 110 136 109 L148 107 L158 96 Q162 92 170 92 H196 Q204 92 208 98 L216 107 L222 109 Q228 110 228 116 V128 Z" fill={G700} />
    <rect x="154" y="98" width="20" height="10" rx="2" fill={G800} />
    <rect x="178" y="98" width="22" height="10" rx="2" fill={G800} />
    <circle cx="146" cy="130" r="8" fill={G800} />
    <circle cx="210" cy="130" r="8" fill={G800} />
  </>
);

const Parking: React.FC = () => (
  <>
    <rect x="0" y="100" width="320" height="80" fill={G800} />
    {[20, 90, 160, 230].map((x) => (
      <path key={x} d={`M${x} 180 L${x + 30} 100`} stroke={G700} strokeWidth="3" />
    ))}
    {[[40, 124], [180, 120]].map(([x, y]) => (
      <g key={x}>
        <rect x={x} y={y} width="70" height="30" rx="8" fill={G700} />
        <rect x={x + 12} y={y - 12} width="46" height="16" rx="6" fill={G700} />
      </g>
    ))}
    {/* Person */}
    <circle cx="186" cy="92" r="7" fill={G700} />
    <rect x="178" y="100" width="16" height="30" rx="6" fill={G700} />
    <rect x="20" y="20" width="280" height="10" rx="2" fill={G800} />
  </>
);

const Corridor: React.FC = () => (
  <>
    <path d="M0 0 L120 60 V130 L0 180 Z" fill={G800} />
    <path d="M320 0 L200 60 V130 L320 180 Z" fill={G800} />
    <path d="M0 180 L120 130 H200 L320 180 Z" fill={G700} opacity="0.5" />
    <rect x="120" y="60" width="80" height="70" fill={G800} opacity="0.5" />
    {[[30, 40], [70, 58]].map(([x, h]) => (
      <path key={x} d={`M${x} ${60 - h / 4} L${x + 22} ${66 - h / 6} V${120 + h / 8} L${x} ${130 + h / 4} Z`} fill={G700} />
    ))}
    {[[268, 40], [228, 58]].map(([x, h]) => (
      <path key={x} d={`M${x} ${60 - h / 4} L${x - 22} ${66 - h / 6} V${120 + h / 8} L${x} ${130 + h / 4} Z`} fill={G700} />
    ))}
    {/* Student */}
    <circle cx="162" cy="66" r="7" fill={G700} />
    <rect x="154" y="74" width="16" height="36" rx="6" fill={G700} />
    <rect x="156" y="108" width="5" height="22" fill={G700} />
    <rect x="163" y="108" width="5" height="22" fill={G700} />
  </>
);

const Canteen: React.FC = () => (
  <>
    <rect x="0" y="112" width="320" height="68" fill={G800} />
    {/* Counter with trays */}
    <rect x="10" y="100" width="300" height="16" rx="3" fill={G700} />
    {[30, 90, 150, 210, 270].map((x) => (
      <rect key={x} x={x - 18} y="92" width="36" height="8" rx="2" fill={G800} />
    ))}
    {/* Menu board */}
    <rect x="200" y="16" width="100" height="44" rx="3" fill={G800} />
    <rect x="210" y="26" width="60" height="4" rx="2" fill={G700} />
    <rect x="210" y="36" width="76" height="4" rx="2" fill={G700} />
    <rect x="210" y="46" width="52" height="4" rx="2" fill={G700} />
    {/* Student in queue */}
    <circle cx="124" cy="50" r="8" fill={G700} />
    <rect x="114" y="60" width="20" height="40" rx="7" fill={G700} />
    <circle cx="80" cy="58" r="7" fill={G700} opacity="0.7" />
    <rect x="71" y="67" width="18" height="33" rx="6" fill={G700} opacity="0.7" />
  </>
);

const Turnstile: React.FC = () => (
  <>
    <rect x="0" y="124" width="320" height="56" fill={G800} />
    <rect x="20" y="16" width="280" height="14" rx="2" fill={G800} />
    {[70, 190].map((x) => (
      <g key={x}>
        <rect x={x} y="80" width="34" height="48" rx="6" fill={G700} />
        <rect x={x + 6} y="86" width="22" height="8" rx="2" fill={G800} />
        <path d={`M${x + 34} 104 H${x + 62}`} stroke={G700} strokeWidth="4" strokeLinecap="round" />
      </g>
    ))}
    {/* Visitor */}
    <circle cx="160" cy="46" r="8" fill={G700} />
    <rect x="150" y="56" width="20" height="40" rx="7" fill={G700} />
    <rect x="152" y="94" width="6" height="30" fill={G700} />
    <rect x="162" y="94" width="6" height="30" fill={G700} />
  </>
);

const SCENES: Record<SceneKind, React.FC> = {
  gate: Gate,
  parking: Parking,
  corridor: Corridor,
  canteen: Canteen,
  turnstile: Turnstile,
};

export const CameraScene: React.FC<{ kind: SceneKind; className?: string }> = ({ kind, className = '' }) => {
  const Scene = SCENES[kind];
  return (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" className={`block w-full h-full ${className}`} aria-hidden="true" focusable="false">
      <Scene />
    </svg>
  );
};
