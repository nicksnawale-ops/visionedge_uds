import React from 'react';
import { BLUE, CYAN, LINE, SceneProps, svgProps } from './sceneStyle';

/** QR-code-like pattern (5×5), fixed so it renders the same every time. */
const QR = ['11101', '10011', '01110', '11001', '10111'];

/** Visitor management: an entry turnstile; top-right a visitor ID badge with a QR-code square. */
export const VisitorScene: React.FC<SceneProps> = ({ part, className }) => {
  if (part === 'top-right') {
    return (
      <svg {...svgProps('0 0 180 230', className)}>
        {/* Lanyard and clip */}
        <path d="M60 0 L82 34 M120 0 L98 34" {...LINE} />
        <rect x={78} y={30} width={24} height={14} rx={4} {...CYAN} />
        {/* Badge */}
        <rect x={24} y={44} width={132} height={176} rx={14} {...BLUE} />
        <rect x={24} y={44} width={132} height={22} rx={0} {...CYAN} />
        {/* Portrait placeholder */}
        <circle cx={62} cy={98} r={14} {...LINE} />
        <path d="M40 134 Q62 112 84 134" {...LINE} />
        {/* Name lines */}
        <path d="M96 92 H138 M96 106 H128 M40 152 H96" {...LINE} />
        {/* QR code */}
        <rect x={98} y={150} width={46} height={46} rx={4} {...LINE} />
        {QR.flatMap((row, r) =>
          row.split('').map((bit, c) =>
            bit === '1' ? <rect key={`${r}-${c}`} x={102 + c * 8} y={154 + r * 8} width={6} height={6} rx={1} {...CYAN} /> : null
          )
        )}
      </svg>
    );
  }

  return (
    <svg {...svgProps('0 0 360 280', className)}>
      <line x1={0} y1={262} x2={360} y2={262} {...LINE} />
      {/* Overhead frame */}
      <path d="M40 262 V40 H320 V262" {...LINE} />
      <rect x={140} y={52} width={80} height={20} rx={4} {...CYAN} />
      <path d="M170 62 L180 56 L190 62" {...LINE} />
      {/* Two turnstile cabinets */}
      <rect x={70} y={150} width={56} height={112} rx={10} {...BLUE} />
      <rect x={234} y={150} width={56} height={112} rx={10} {...BLUE} />
      {/* Reader panels */}
      <rect x={82} y={162} width={32} height={18} rx={4} {...CYAN} />
      <rect x={246} y={162} width={32} height={18} rx={4} {...CYAN} />
      {/* Tripod arms on the left cabinet */}
      <circle cx={126} cy={200} r={8} {...LINE} />
      <path d="M134 200 H196 M131 206 L170 238 M131 194 L162 168" {...LINE} />
      {/* Floor guide */}
      <path d="M150 262 L160 226 H200 L210 262" {...LINE} strokeDasharray="4 6" />
    </svg>
  );
};
