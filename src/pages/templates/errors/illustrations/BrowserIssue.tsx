import React from 'react';
import { Badge, BrowserWindow, Canvas, Exclamation, Ground, Hourglass, IllustrationProps, LINE } from './parts';

/** 400 / 408 / 429: a browser window with a warning badge, an hourglass or a speedometer. */
export const BrowserIssueIllustration: React.FC<IllustrationProps & { variant: 'warning' | 'hourglass' | 'speedometer' }> = ({ size, variant }) => (
  <Canvas size={size}>
    <BrowserWindow x={30} y={22} w={124} h={100} />
    {/* Page skeleton lines */}
    <path d="M44 56h64M44 70h88M44 84h52M44 98h76" {...LINE} />
    <Badge cx={150} cy={116} r={24}>
      {variant === 'warning' && (
        <>
          <path d="M150 103l12 21h-24z" {...LINE} />
          <Exclamation cx={150} cy={115} />
        </>
      )}
      {variant === 'hourglass' && <Hourglass cx={150} cy={116} />}
      {variant === 'speedometer' && (
        <>
          <path d="M136 122a14 14 0 0 1 28 0" {...LINE} />
          <path d="M138 114l3 2M150 108v3M162 114l-3 2" {...LINE} />
          <path d="M150 122l9-8" {...LINE} strokeWidth={2.5} />
        </>
      )}
    </Badge>
    <Ground />
  </Canvas>
);
