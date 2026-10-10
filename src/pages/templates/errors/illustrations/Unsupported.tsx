import React from 'react';
import { BrowserWindow, CYAN, Canvas, Ground, IllustrationProps, LINE } from './parts';

/** Unsupported browser: a browser window with a puzzle piece that doesn't fit. */
export const UnsupportedIllustration: React.FC<IllustrationProps> = ({ size }) => (
  <Canvas size={size}>
    <BrowserWindow x={30} y={22} w={124} h={100} />
    <path d="M44 56h48M44 70h64M44 84h36" {...LINE} />
    {/* Puzzle piece */}
    <path
      d="M120 88h12a8 8 0 1 1 16 0h12v14a8 8 0 1 0 0 16v14h-14a8 8 0 1 1-16 0h-10v-14a8 8 0 1 0 0-16z"
      {...CYAN}
      transform="rotate(12 140 110)"
    />
    <Ground />
  </Canvas>
);
