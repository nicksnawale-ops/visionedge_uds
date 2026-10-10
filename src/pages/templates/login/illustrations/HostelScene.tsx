import React from 'react';
import { BLUE, CYAN, LINE, SceneProps, svgProps } from './sceneStyle';

/** HostelTrack: a 3-storey hostel block with a wall-mounted camera; top-right a door with an access card reader. */
export const HostelScene: React.FC<SceneProps> = ({ part, className }) => {
  if (part === 'top-right') {
    return (
      <svg {...svgProps('0 0 200 240', className)}>
        {/* Door frame and door */}
        <rect x={20} y={20} width={104} height={200} rx={4} {...LINE} />
        <rect x={30} y={30} width={84} height={190} rx={2} {...BLUE} />
        <rect x={44} y={46} width={56} height={60} rx={4} {...CYAN} />
        <circle cx={102} cy={132} r={4} {...LINE} />
        <line x1={0} y1={220} x2={200} y2={220} {...LINE} />
        {/* Card reader */}
        <rect x={140} y={104} width={34} height={52} rx={6} {...BLUE} />
        <circle cx={157} cy={120} r={4} {...CYAN} />
        <path d="M148 136 H166 M148 144 H166" {...LINE} />
        {/* Card with contactless waves */}
        <rect x={150} y={60} width={34} height={24} rx={4} {...CYAN} transform="rotate(-14 167 72)" />
        <path d="M134 74 A10 10 0 0 1 134 90 M128 70 A16 16 0 0 1 128 94" {...LINE} />
      </svg>
    );
  }

  const windows = [0, 1, 2].flatMap((row) => [0, 1, 2, 3, 4].map((col) => ({ row, col })));
  return (
    <svg {...svgProps('0 0 340 300', className)}>
      <line x1={0} y1={290} x2={340} y2={290} {...LINE} />
      {/* Roof and block */}
      <path d="M22 70 L170 30 L318 70 Z" {...CYAN} />
      <rect x={36} y={70} width={268} height={220} {...BLUE} />
      {/* Floor lines */}
      <path d="M36 140 H304 M36 210 H304" {...LINE} />
      {/* Windows: 3 storeys × 5 */}
      {windows.map(({ row, col }) => {
        const x = 54 + col * 50;
        const y = 88 + row * 70;
        const lit = (row + col) % 3 === 0;
        return <rect key={`${row}-${col}`} x={x} y={y} width={32} height={36} rx={3} {...(lit ? CYAN : LINE)} />;
      })}
      {/* Entrance */}
      <rect x={146} y={236} width={48} height={54} rx={3} {...CYAN} />
      <path d="M170 236 V290" {...LINE} />
      {/* Wall-mounted camera */}
      <path d="M304 96 H318 V104" {...LINE} />
      <rect x={312} y={102} width={26} height={14} rx={4} transform="rotate(18 312 109)" {...BLUE} />
      <circle cx={334} cy={118} r={3} {...CYAN} />
    </svg>
  );
};
