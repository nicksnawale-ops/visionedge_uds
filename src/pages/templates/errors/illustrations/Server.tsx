import React from 'react';
import { Badge, CYAN, Canvas, Exclamation, Ground, Hourglass, IllustrationProps, LINE, Rack } from './parts';

/** 500 / 502 / 504: a server rack with an alert badge, a broken cable between two servers, or a server with an hourglass. */
export const ServerIllustration: React.FC<IllustrationProps & { variant: 'alert' | 'cable' | 'hourglass' }> = ({ size, variant }) => (
  <Canvas size={size}>
    {variant === 'cable' ? (
      <>
        <Rack x={22} y={60} w={56} units={4} />
        <Rack x={122} y={60} w={56} units={4} />
        {/* Broken cable */}
        <path d="M78 82c12 0 12 22 18 22" {...LINE} strokeWidth={2.5} />
        <path d="M122 82c-12 0-12 22-18 22" {...LINE} strokeWidth={2.5} />
        <path d="M100 92l-3-6M100 116l3 6M94 100h-6M106 106h6" {...LINE} />
        <circle cx={100} cy={46} r={14} {...CYAN} />
        <path d="M94 40l12 12M106 40l-12 12" {...LINE} />
      </>
    ) : (
      <>
        <Rack x={62} y={34} w={76} units={5} />
        <Badge cx={142} cy={42} r={22}>{variant === 'alert' ? <Exclamation cx={142} cy={42} /> : <Hourglass cx={142} cy={42} />}</Badge>
      </>
    )}
    <Ground />
  </Canvas>
);
