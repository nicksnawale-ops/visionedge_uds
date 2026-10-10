import React, { useEffect, useState } from 'react';
import { BackgroundStyle, UseCaseConfig, UseCaseId } from './backgrounds';
import { SceneProps } from './illustrations/sceneStyle';
import { GenericScene } from './illustrations/GenericScene';
import { AnprScene } from './illustrations/AnprScene';
import { HostelScene } from './illustrations/HostelScene';
import { MealScene } from './illustrations/MealScene';
import { VisitorScene } from './illustrations/VisitorScene';

const SCENES: Record<UseCaseId, React.FC<SceneProps>> = {
  generic: GenericScene,
  anpr: AnprScene,
  hosteltrack: HostelScene,
  mealpulse: MealScene,
  visitor: VisitorScene,
};

/* ── Photo availability ──────────────────────────────────────────── */

const photoCache = new Map<string, Promise<boolean>>();

/** Loads the image once per URL; resolves false when the file is missing or can't be decoded. */
const probePhoto = (src: string): Promise<boolean> => {
  let probe = photoCache.get(src);
  if (!probe) {
    probe = new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.naturalWidth > 0);
      img.onerror = () => resolve(false);
      img.src = src;
    });
    photoCache.set(src, probe);
  }
  return probe;
};

/** true / false once known; null while checking (or when no photo is configured: false). */
export function usePhotoAvailable(src: string | undefined): boolean | null {
  const [available, setAvailable] = useState<boolean | null>(src ? null : false);

  useEffect(() => {
    if (!src) {
      setAvailable(false);
      return;
    }
    let active = true;
    setAvailable(null);
    probePhoto(src).then((ok) => active && setAvailable(ok));
    return () => {
      active = false;
    };
  }, [src]);

  return available;
}

/** The style actually shown: photo only when requested, configured and loaded; otherwise the illustration. */
export function useResolvedBackground(useCase: UseCaseConfig, requested: BackgroundStyle): BackgroundStyle {
  const available = usePhotoAvailable(requested === 'photo' ? useCase.photo : undefined);
  return requested === 'photo' && available === true ? 'photo' : 'illustration';
}

/* ── Pieces ──────────────────────────────────────────────────────── */

/** 6×6 dots, 4px, 24px apart, Royal Blue 25%. Sits partly behind a card corner. ≥768px only. */
export const DotGrid: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width={124}
    height={124}
    viewBox="0 0 124 124"
    className={`hidden @min-[768px]:block pointer-events-none ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    {Array.from({ length: 36 }, (_, i) => (
      <circle key={i} cx={2 + (i % 6) * 24} cy={2 + Math.floor(i / 6) * 24} r={2} className="fill-[#1E63FF]" fillOpacity={0.25} />
    ))}
  </svg>
);

interface LoginBackgroundProps {
  useCase: UseCaseConfig;
  /** Resolved style (see useResolvedBackground). */
  mode: BackgroundStyle;
}

/** Full-bleed layer behind the card. Decorative only. */
export const LoginBackground: React.FC<LoginBackgroundProps> = ({ useCase, mode }) => {
  if (mode === 'photo' && useCase.photo) {
    return (
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <img src={useCase.photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
        {/* Deep Navy 72% so the card always stands out and text stays readable */}
        <div className="absolute inset-0 bg-[#0B2D6B]/[0.72]" />
      </div>
    );
  }

  const Scene = SCENES[useCase.id];

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#F7F9FC]" aria-hidden="true">
      {/* Lower band: bottom 30%, top edge slanted 3° */}
      <div className="absolute top-[70%] -left-[5%] w-[110%] h-[60%] bg-[#EEF1F6] origin-top-left -rotate-3" />

      <div className="hidden @min-[768px]:block">
        <Scene part="bottom-left" className="absolute -left-10 -bottom-6 w-[280px] @min-[1280px]:w-[360px]" />
        <Scene part="top-right" className="absolute right-16 top-24 w-[180px] @min-[1280px]:w-[220px]" />
      </div>
    </div>
  );
};
