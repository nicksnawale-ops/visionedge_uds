import React, { useEffect, useRef } from 'react';
import type { ObjectKind } from '../useCases';
import { BoxRect, DetectionBox } from './DetectionBox';

/** Where the object sits (left = 0, it is moved by its track). */
const SHAPES: Record<Exclude<ObjectKind, 'mixed'>, BoxRect> = {
  vehicle: { left: 0, top: 54, width: 24, height: 18 },
  person: { left: 0, top: 36, width: 8, height: 34 },
  tray: { left: 0, top: 58, width: 16, height: 11 },
};

/** Abstract, decorative objects: never real faces or real plates. */
const Shape: React.FC<{ kind: Exclude<ObjectKind, 'mixed'> }> = ({ kind }) => {
  const r = SHAPES[kind];
  const style = { left: `${r.left}%`, top: `${r.top}%`, width: `${r.width}%`, height: `${r.height}%` };
  if (kind === 'vehicle')
    return (
      <span className="absolute rounded-[6px] bg-[#C3CAD5]" style={style}>
        <span className="absolute left-[12%] right-[12%] top-[10%] h-[34%] rounded-[3px] bg-[#4B5465]" />
        <span className="absolute left-1/2 -translate-x-1/2 bottom-[10%] w-[34%] h-[16%] rounded-[1px] bg-white" />
      </span>
    );
  if (kind === 'person')
    return (
      <span className="absolute" style={style}>
        <span className="absolute left-1/2 -translate-x-1/2 top-0 w-[70%] aspect-square rounded-full bg-[#8C95A6]" />
        <span className="absolute left-0 right-0 top-[26%] bottom-0 rounded-t-[40%] rounded-b-[4px] bg-[#6B7485]" />
      </span>
    );
  return (
    <span className="absolute rounded-[3px] bg-[#DDE2EA]" style={style}>
      {[18, 46, 74].map((l) => (
        <span key={l} className="absolute top-[22%] w-[18%] h-[56%] rounded-full bg-[#8C95A6]" style={{ left: `${l}%` }} />
      ))}
    </span>
  );
};

interface MovingObjectsProps {
  kind: ObjectKind;
  /** Chip on the detection box (e.g. "MH12 AB 1234 · 98%"). */
  label: string;
  /** Extra chip next to the label (ANPR vehicle type). */
  extra?: string;
  /** Deterministic offset so tiles don't move in sync. */
  index: number;
  /** Animate (≤ 9 tiles, live, not reduced motion). Otherwise a static frame. */
  animate: boolean;
  /** Tab hidden: pause running animations. */
  hidden: boolean;
  small?: boolean;
}

/**
 * Subtle deterministic motion with CSS transforms only (Web Animations API, no global keyframes):
 * an object crosses the scene, its detection box follows and fades out ~3s after the object leaves.
 * Paused while the tab is hidden; a static frame with prefers-reduced-motion.
 */
export const MovingObjects: React.FC<MovingObjectsProps> = ({ kind, label, extra, index, animate, hidden, small }) => {
  const objRef = useRef<HTMLSpanElement>(null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const anims = useRef<Animation[]>([]);
  const shape: Exclude<ObjectKind, 'mixed'> = kind === 'mixed' ? (index % 3 === 1 ? 'vehicle' : 'person') : kind;
  const r = SHAPES[shape];

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const obj = objRef.current;
    const box = boxRef.current;
    if (!animate || reduced || !obj || !box || !obj.animate) return;
    const duration = 10000 + (index % 4) * 900;
    const delay = -((index * 2300) % duration);
    const timing: KeyframeAnimationOptions = { duration, delay, iterations: Infinity, easing: 'linear' };
    anims.current = [
      obj.animate(
        [
          { transform: 'translateX(-30%)' },
          { transform: 'translateX(110%)', offset: 0.7 },
          { transform: 'translateX(110%)' },
        ],
        timing
      ),
      box.animate(
        [
          { transform: 'translateX(-30%)', opacity: 1 },
          { transform: 'translateX(78%)', opacity: 1, offset: 0.55 },
          { transform: 'translateX(78%)', opacity: 1, offset: 0.63 },
          { transform: 'translateX(78%)', opacity: 0, offset: 0.93 },
          { transform: 'translateX(78%)', opacity: 0 },
        ],
        timing
      ),
    ];
    return () => {
      anims.current.forEach((a) => a.cancel());
      anims.current = [];
    };
  }, [animate, index]);

  useEffect(() => {
    anims.current.forEach((a) => (hidden ? a.pause() : a.play()));
  }, [hidden]);

  // Static frame: the object mid-scene with its box.
  const still = animate ? undefined : { transform: 'translateX(34%)' };
  return (
    <>
      <span ref={objRef} aria-hidden="true" className="absolute inset-0 pointer-events-none" style={still}>
        <Shape kind={shape} />
      </span>
      <span ref={boxRef} aria-hidden="true" className="absolute inset-0 pointer-events-none" style={still}>
        <DetectionBox rect={{ left: r.left - 1, top: r.top - 2, width: r.width + 2, height: r.height + 4 }} label={label} extra={extra} small={small} />
      </span>
    </>
  );
};
