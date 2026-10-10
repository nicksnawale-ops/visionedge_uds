import React from 'react';
import { BLUE, CYAN, Canvas, DOT, Ground, IllustrationProps, LINE } from './parts';

/** Offline: a WiFi symbol with a slash, and a cloud. */
export const OfflineIllustration: React.FC<IllustrationProps> = ({ size }) => (
  <Canvas size={size}>
    {/* Cloud */}
    <path d="M118 74h40a18 18 0 0 0 0-36 26 26 0 0 0-50 6 15 15 0 0 0 10 30z" {...BLUE} />
    {/* WiFi */}
    <circle cx={86} cy={122} r={28} {...CYAN} />
    <path d="M68 112a26 26 0 0 1 36 0M74 119a17 17 0 0 1 24 0M80 126a8 8 0 0 1 12 0" {...LINE} strokeWidth={2.5} />
    <circle cx={86} cy={132} r={2.5} {...DOT} />
    <path d="M64 100l44 44" {...LINE} strokeWidth={2.5} />
    <Ground />
  </Canvas>
);
