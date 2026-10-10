import React from 'react';
import { BLUE, CYAN, Canvas, DOT, Ground, IllustrationProps, LINE } from './parts';

/** 401: a clock beside a shield. */
export const SessionIllustration: React.FC<IllustrationProps> = ({ size }) => (
  <Canvas size={size}>
    {/* Clock */}
    <circle cx={76} cy={84} r={42} {...BLUE} />
    <circle cx={76} cy={84} r={34} {...LINE} strokeDasharray="1 8" />
    <path d="M76 62v22l14 10" {...LINE} strokeWidth={2.5} />
    <circle cx={76} cy={84} r={2.5} {...DOT} />
    {/* Shield */}
    <path d="M140 46l30 11v24c0 22-14 36-30 44-16-8-30-22-30-44V57z" {...CYAN} />
    <path d="M128 86l9 9 17-19" {...LINE} strokeWidth={2.5} />
    <Ground />
  </Canvas>
);
