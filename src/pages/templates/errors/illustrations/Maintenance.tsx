import React from 'react';
import { CYAN, Canvas, Ground, IllustrationProps, LINE, Rack } from './parts';

/** 503 and Maintenance: a server with a wrench and a gear. */
export const MaintenanceIllustration: React.FC<IllustrationProps> = ({ size }) => {
  const teeth = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
  return (
    <Canvas size={size}>
      <Rack x={40} y={46} w={72} units={4} />
      {/* Gear */}
      <g transform="translate(146 58)">
        {teeth.map((a) => (
          <path key={a} d={`M${Math.cos(a) * 20} ${Math.sin(a) * 20}L${Math.cos(a) * 27} ${Math.sin(a) * 27}`} {...LINE} strokeWidth={5} />
        ))}
        <circle r={20} {...CYAN} />
        <circle r={7} {...LINE} />
      </g>
      {/* Wrench */}
      <g transform="translate(140 118) rotate(-45)">
        <path d="M-26 -5h34a10 10 0 1 1 0 10h-34a5 5 0 0 1 0-10z" {...CYAN} />
        <path d="M14 -3h6M14 3h6" {...LINE} />
      </g>
      <Ground />
    </Canvas>
  );
};
