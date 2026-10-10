import React, { useLayoutEffect, useRef } from 'react';
import { LINK, demoLink } from './authUi';
import { DotGrid, LoginBackground, useResolvedBackground } from '../login/LoginBackground';
import { BackgroundStyle, UseCaseConfig, defaultBackgroundStyle } from '../login/backgrounds';

/** Screen chrome copy shared by every auth template. */
export const AUTH_COPY = {
  help: { prompt: 'Need help?', link: 'Contact support' },
  footer: { copyright: '© 2026 VisionEdge', privacy: 'Privacy policy', terms: 'Terms of use', version: 'v1.0.0' },
} as const;

/** Card widths used by the auth templates (100% − 32px on mobile). */
const CARD_WIDTH = {
  440: 'max-w-[440px]',
  480: 'max-w-[480px]',
} as const;

export interface AuthLayoutProps {
  useCase: UseCaseConfig;
  /** Requested background; "photo" falls back to the illustration when the file is missing. */
  background?: BackgroundStyle;
  /** Full-screen route: fill the browser viewport (min-height 100vh). */
  fillViewport?: boolean;
  cardWidth?: keyof typeof CARD_WIDTH;
  /** The card. */
  children: React.ReactNode;
}

/**
 * Fades the card in and lifts it 8px over 250ms ease-out; no motion with prefers-reduced-motion.
 * The card's resting state is always visible — the animation only plays over it, so it can't get stuck.
 */
function useEntrance(ref: React.RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animation = el.animate(
      [
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 250, easing: 'ease-out' }
    );
    return () => animation.cancel();
  }, [ref]);
}

/**
 * Auth screen frame: a centered card on a use-case background,
 * "Need help?" in the top-right corner and a one-line footer at the bottom.
 * Responds to its own width (container queries), so it previews true to size.
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({
  useCase,
  background,
  fillViewport = false,
  cardWidth = 440,
  children,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useEntrance(cardRef);
  const mode = useResolvedBackground(useCase, background ?? defaultBackgroundStyle(useCase));
  const onPhoto = mode === 'photo';
  // <main> only when the screen is the whole page; inside the docs it sits in the page's own <main>.
  const Main = fillViewport ? 'main' : 'div';

  const subtle = onPhoto ? 'text-white/70' : 'text-[#6B7485]';
  const helpLink = onPhoto ? `${LINK} !text-[#00C6FF] hover:!text-white` : LINK;
  const footerLink = `inline-flex items-center min-h-8 rounded-[4px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2 ${
    onPhoto ? 'text-white/70 hover:text-white' : 'text-[#6B7485] hover:text-[#1E63FF]'
  }`;

  return (
    <div className={`@container relative isolate w-full flex flex-col ${fillViewport ? 'min-h-screen' : 'min-h-full'}`}>
      <LoginBackground useCase={useCase} mode={mode} />

      {/* Equal top and bottom padding reserve room for the help link and footer,
          so the card is centered on the whole screen and nothing can overlap it.
          From 960px the help link sits well clear of the card, so only the footer needs room
          (960, not 1024, so a page scrollbar can't flip the layout back).
          DOM order is card → help → footer so keyboard focus starts in the card. */}
      <Main className="relative flex-1 flex items-center justify-center px-4 py-[104px] @min-[640px]:px-6 @min-[640px]:py-[92px] @min-[960px]:py-16">
        <div ref={cardRef} className={`relative w-full ${CARD_WIDTH[cardWidth]}`}>
          {!onPhoto && <DotGrid className="absolute -right-12 -bottom-12" />}
          {children}
        </div>
      </Main>

      <div
        className={`absolute top-6 right-6 h-11 flex items-center gap-x-1.5 text-[14px] leading-[20px] ${
          onPhoto ? 'text-white/70' : 'text-[#4B5465]'
        }`}
      >
        <span>{AUTH_COPY.help.prompt}</span>
        <a href="#support" onClick={demoLink} className={helpLink}>
          {AUTH_COPY.help.link}
        </a>
      </div>

      <footer
        className={`absolute bottom-6 inset-x-4 flex flex-wrap items-center justify-center gap-x-2 text-[12px] leading-[16px] ${subtle}`}
      >
        <span>{AUTH_COPY.footer.copyright}</span>
        <span aria-hidden="true">·</span>
        <a href="#privacy" onClick={demoLink} className={footerLink}>
          {AUTH_COPY.footer.privacy}
        </a>
        <span aria-hidden="true">·</span>
        <a href="#terms" onClick={demoLink} className={footerLink}>
          {AUTH_COPY.footer.terms}
        </a>
        <span aria-hidden="true">·</span>
        <span>{AUTH_COPY.footer.version}</span>
      </footer>
    </div>
  );
};
