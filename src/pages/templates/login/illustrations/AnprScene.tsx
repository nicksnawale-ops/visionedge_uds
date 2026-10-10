import React from 'react';
import { BLUE, CYAN, LINE, SCENE_TEXT, SceneProps, svgProps } from './sceneStyle';

const MONO = '"JetBrains Mono", Consolas, "Courier New", monospace';

/** ANPR: side view of a car with a number plate inside scan-corner brackets; top-right a boom barrier. */
export const AnprScene: React.FC<SceneProps> = ({ part, className }) => {
  if (part === 'top-right') {
    return (
      <svg {...svgProps('0 0 240 170', className)}>
        {/* Base and post */}
        <rect x={20} y={146} width={52} height={14} rx={3} {...BLUE} />
        <rect x={32} y={60} width={28} height={88} rx={4} {...BLUE} />
        <circle cx={46} cy={74} r={9} {...CYAN} />
        <circle cx={46} cy={74} r={3} {...LINE} />
        {/* Arm, slightly raised, with stripes */}
        <g transform="rotate(-12 46 74)">
          <rect x={52} y={68} width={176} height={12} rx={6} {...LINE} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={72 + i * 32} y={68} width={16} height={12} {...CYAN} />
          ))}
        </g>
        {/* Status light */}
        <rect x={38} y={34} width={16} height={20} rx={4} {...LINE} />
        <circle cx={46} cy={44} r={4} {...CYAN} />
      </svg>
    );
  }

  return (
    <svg {...svgProps('0 0 360 240', className)}>
      {/* Ground */}
      <line x1={0} y1={212} x2={360} y2={212} {...LINE} />
      {/* Body */}
      <path
        d="M24 180 V150 Q24 136 40 132 L88 124 L128 88 Q136 80 152 80 H236 Q250 80 260 90 L292 124 L328 132 Q342 136 342 152 V180 Q342 186 336 186 H24 Q24 186 24 180 Z"
        {...BLUE}
      />
      {/* Windows */}
      <path d="M100 124 L134 94 Q138 90 146 90 H184 V124 Z" {...CYAN} />
      <path d="M196 90 H234 Q244 90 250 98 L274 124 H196 Z" {...CYAN} />
      {/* Door line and handle */}
      <path d="M190 128 V182" {...LINE} />
      <path d="M200 140 H214" {...LINE} />
      {/* Lights */}
      <path d="M26 146 H40" {...LINE} />
      <rect x={326} y={140} width={12} height={10} rx={3} {...CYAN} />
      {/* Wheels */}
      {[90, 278].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={186} r={26} {...BLUE} />
          <circle cx={cx} cy={186} r={10} {...LINE} />
        </g>
      ))}

      {/* Number plate with scan-corner brackets */}
      <rect x={128} y={150} width={104} height={22} rx={3} {...LINE} fill="#FFFFFF" />
      <text
        x={180}
        y={165}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={11}
        fontWeight={600}
        letterSpacing={0.5}
        {...SCENE_TEXT}
      >
        MH12 AB 1234
      </text>
      <path
        d="M118 150 V140 H128 M232 140 H242 V150 M242 172 V182 H232 M128 182 H118 V172"
        {...LINE}
      />
    </svg>
  );
};
