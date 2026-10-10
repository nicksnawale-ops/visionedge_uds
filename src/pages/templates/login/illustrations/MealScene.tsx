import React from 'react';
import { BLUE, CYAN, LINE, SceneProps, svgProps } from './sceneStyle';

/** Meal Pulse: a canteen tray with a bowl and a plate (top view); top-right a dome camera above a counter. */
export const MealScene: React.FC<SceneProps> = ({ part, className }) => {
  if (part === 'top-right') {
    return (
      <svg {...svgProps('0 0 220 200', className)}>
        {/* Ceiling mount and dome camera */}
        <line x1={20} y1={12} x2={200} y2={12} {...LINE} />
        <line x1={110} y1={12} x2={110} y2={30} {...LINE} />
        <rect x={84} y={30} width={52} height={10} rx={3} {...LINE} />
        <path d="M90 40 H130 A20 20 0 0 1 90 40 Z" {...BLUE} />
        <circle cx={110} cy={48} r={6} {...CYAN} />
        {/* View cone */}
        <path d="M100 62 L52 132 M120 62 L168 132" {...LINE} strokeDasharray="4 6" />
        {/* Counter with a tray stack */}
        <rect x={24} y={140} width={172} height={14} rx={4} {...BLUE} />
        <rect x={36} y={154} width={148} height={38} rx={2} {...LINE} />
        <rect x={62} y={124} width={56} height={6} rx={2} {...CYAN} />
        <rect x={64} y={130} width={52} height={6} rx={2} {...LINE} />
        <circle cx={152} cy={128} r={10} {...CYAN} />
      </svg>
    );
  }

  return (
    <svg {...svgProps('0 0 360 260', className)}>
      {/* Tray */}
      <rect x={16} y={24} width={328} height={216} rx={22} {...BLUE} />
      <rect x={30} y={38} width={300} height={188} rx={14} {...LINE} />
      {/* Plate with food */}
      <circle cx={112} cy={140} r={66} {...LINE} />
      <circle cx={112} cy={140} r={50} {...CYAN} />
      <path d="M86 128 Q100 110 120 122 Q136 132 128 150 Q112 166 92 152 Q80 142 86 128 Z" {...BLUE} />
      <circle cx={136} cy={124} r={7} {...LINE} />
      <circle cx={100} cy={166} r={6} {...LINE} />
      {/* Bowl */}
      <circle cx={244} cy={98} r={42} {...LINE} />
      <circle cx={244} cy={98} r={30} {...CYAN} />
      <path d="M226 92 Q244 80 262 92" {...LINE} />
      {/* Cup */}
      <circle cx={276} cy={180} r={22} {...BLUE} />
      <circle cx={276} cy={180} r={14} {...LINE} />
      {/* Spoon and fork */}
      <ellipse cx={204} cy={160} rx={7} ry={11} {...LINE} />
      <line x1={204} y1={171} x2={204} y2={214} {...LINE} />
      <path d="M228 150 V166 M234 150 V166 M240 150 V166 M228 166 Q234 172 240 166 M234 170 V214" {...LINE} />
    </svg>
  );
};
