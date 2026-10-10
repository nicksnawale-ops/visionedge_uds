import React from 'react';
import { BLUE, CYAN, Canvas, Ground, IllustrationProps, LINE, Rack } from './parts';

/** Server unreachable: a laptop and a server joined by a dashed line with an X. */
export const UnreachableIllustration: React.FC<IllustrationProps> = ({ size }) => (
  <Canvas size={size}>
    {/* Laptop */}
    <rect x={18} y={74} width={56} height={38} rx={4} {...BLUE} />
    <path d="M10 118h72l-6 8H16z" {...BLUE} />
    {/* Server */}
    <Rack x={128} y={54} w={52} units={4} />
    {/* Dashed link with an X */}
    <path d="M78 96h48" {...LINE} strokeDasharray="4 5" />
    <circle cx={102} cy={96} r={12} {...CYAN} />
    <path d="M97 91l10 10M107 91l-10 10" {...LINE} />
    <Ground />
  </Canvas>
);
