import type { SVGProps } from 'react';
import { JSON_TOKENS } from '../../../../theme/tokens';

const { royalBlue, cyan } = JSON_TOKENS.colors.brand;

export interface SceneProps {
  /** Bottom-left scene (280–360px wide) or the smaller top-right detail (180–240px wide). */
  part: 'bottom-left' | 'top-right';
  className?: string;
}

type Paint = Pick<
  SVGProps<SVGElement>,
  'stroke' | 'strokeOpacity' | 'strokeWidth' | 'strokeLinejoin' | 'strokeLinecap' | 'fill' | 'fillOpacity' | 'vectorEffect'
>;

/** 1.5px Royal Blue line at 35%, rounded joins; stays 1.5px at any rendered size. */
export const LINE: Paint = {
  stroke: royalBlue,
  strokeOpacity: 0.35,
  strokeWidth: 1.5,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
  fill: 'none',
  vectorEffect: 'non-scaling-stroke',
};

/** Line + Royal Blue 8% fill. */
export const BLUE: Paint = { ...LINE, fill: royalBlue, fillOpacity: 0.08 };

/** Line + Cyan 12% fill. */
export const CYAN: Paint = { ...LINE, fill: cyan, fillOpacity: 0.12 };

/** Text inside an illustration (only the ANPR plate). */
export const SCENE_TEXT = { fill: royalBlue, fillOpacity: 0.6 } as const;

/** Shared <svg> attributes: decorative, never focusable. The caller sets the width. */
export const svgProps = (viewBox: string, className = ''): SVGProps<SVGSVGElement> => ({
  viewBox,
  className: `block h-auto ${className}`,
  'aria-hidden': true,
  focusable: false,
});
