import React from 'react';
import { CYAN, Canvas, Ground, IllustrationProps, LINE } from './parts';

/** 404: large outlined "404", a broken dotted path and a magnifier. */
export const NotFoundIllustration: React.FC<IllustrationProps> = ({ size }) => (
  <Canvas size={size}>
    <text
      x={100}
      y={78}
      textAnchor="middle"
      fontFamily="Inter, 'Segoe UI', Roboto, Arial, sans-serif"
      fontSize={64}
      fontWeight={700}
      letterSpacing={2}
      {...LINE}
      fill="#1E63FF"
      fillOpacity={0.08}
    >
      404
    </text>
    {/* Broken dotted path */}
    <path d="M28 126c18-14 36-14 52-4" {...LINE} strokeDasharray="1 7" strokeWidth={2.5} />
    <path d="M118 112c16-8 34-6 54 8" {...LINE} strokeDasharray="1 7" strokeWidth={2.5} />
    {/* Magnifier over the gap */}
    <circle cx={98} cy={112} r={17} {...CYAN} />
    <path d="M110 124l14 14" {...LINE} strokeWidth={4} />
    <path d="M90 106a10 10 0 0 1 10-4" {...LINE} />
    <Ground />
  </Canvas>
);
