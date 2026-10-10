import React from 'react';
import { BLUE, CYAN, Canvas, DOT, Ground, IllustrationProps, LINE } from './parts';

/** 403: a closed door with a padlock in front of it. */
export const ForbiddenIllustration: React.FC<IllustrationProps> = ({ size }) => (
  <Canvas size={size}>
    {/* Door */}
    <rect x={64} y={18} width={72} height={128} rx={6} {...BLUE} />
    <rect x={74} y={28} width={52} height={46} rx={3} {...LINE} />
    <rect x={74} y={84} width={52} height={52} rx={3} {...LINE} />
    <circle cx={124} cy={82} r={3} {...DOT} />
    {/* Padlock */}
    <path d="M86 102v-12a14 14 0 0 1 28 0v12" {...LINE} strokeWidth={3} />
    <rect x={78} y={100} width={44} height={36} rx={6} {...CYAN} />
    <circle cx={100} cy={114} r={4} {...LINE} />
    <path d="M100 118v8" {...LINE} />
    <Ground />
  </Canvas>
);
