import React from 'react';
import { BLUE, CYAN, LINE, SceneProps, svgProps } from './sceneStyle';

/** Generic: concentric camera-lens rings with a small dome camera; top-right a 3×3 grid of camera feeds. */
export const GenericScene: React.FC<SceneProps> = ({ part, className }) => {
  if (part === 'top-right') {
    const cells = [0, 1, 2].flatMap((row) => [0, 1, 2].map((col) => ({ row, col })));
    const live = new Set(['0-1', '1-2', '2-0']);
    return (
      <svg {...svgProps('0 0 220 220', className)}>
        {cells.map(({ row, col }) => {
          const x = 10 + col * 70;
          const y = 10 + row * 70;
          const isLive = live.has(`${row}-${col}`);
          return (
            <g key={`${row}-${col}`}>
              <rect x={x} y={y} width={60} height={60} rx={10} {...(isLive ? CYAN : BLUE)} />
              {/* Tiny scene inside each feed: horizon + subject */}
              <path d={`M${x + 8} ${y + 44} L${x + 24} ${y + 32} L${x + 36} ${y + 40} L${x + 52} ${y + 28}`} {...LINE} />
              <circle cx={x + 46} cy={y + 14} r={3} {...(isLive ? CYAN : LINE)} />
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <svg {...svgProps('0 0 360 300', className)}>
      {/* Lens rings */}
      <circle cx={150} cy={170} r={122} {...BLUE} />
      <circle cx={150} cy={170} r={94} {...LINE} />
      <circle cx={150} cy={170} r={68} {...CYAN} />
      <circle cx={150} cy={170} r={42} {...BLUE} />
      <circle cx={150} cy={170} r={18} {...LINE} />
      <path d="M126 146 A34 34 0 0 1 162 138" {...LINE} />
      {/* Aperture blades hint */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={150 + Math.cos(r) * 42}
            y1={170 + Math.sin(r) * 42}
            x2={150 + Math.cos(r + 0.9) * 68}
            y2={170 + Math.sin(r + 0.9) * 68}
            {...LINE}
          />
        );
      })}

      {/* Small dome camera */}
      <rect x={282} y={28} width={60} height={10} rx={3} {...LINE} />
      <path d="M288 38 H336 A24 24 0 0 1 288 38 Z" {...BLUE} />
      <circle cx={312} cy={48} r={8} {...CYAN} />
      <circle cx={312} cy={48} r={3} {...LINE} />
    </svg>
  );
};
