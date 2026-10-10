import React, { useId } from 'react';

interface SettingsLayoutProps {
  /** View-only banner and other page-level messages. */
  banners?: React.ReactNode;
  /** Settings header: H1, subtitle, search. */
  header: React.ReactNode;
  /** Section nav in its three forms: vertical (≥1024px), tabs (768–1023px), select (<768px). */
  nav: { vertical: React.ReactNode; tabs: React.ReactNode; select: React.ReactNode };
  /** The selected section (SectionFrame + cards). */
  children: React.ReactNode;
  /** Sticky bar, shown only with unsaved changes. */
  unsavedBar?: React.ReactNode;
}

/**
 * Settings layout inside the product AppShell.
 * Gray 50 content, 32px padding (24px tablet, 16px mobile), max width 1280px, 12 columns, 24px gutter.
 * ≥1280px nav 3 + content 9 · 1024–1279px 4 + 8 · <1024px nav under the header, full width.
 */
export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ banners, header, nav, children, unsavedBar }) => (
  <div className="min-h-full flex flex-col">
    <div className="flex-1 w-full max-w-[1344px] mx-auto p-4 @min-[768px]:p-6 @min-[1280px]:p-8">
      <div className="grid grid-cols-12 gap-6">
        {banners && <div className="col-span-12 space-y-3">{banners}</div>}
        <div className="col-span-12">{header}</div>
        <div className="col-span-12 @min-[1024px]:hidden">
          <div className="hidden @min-[768px]:block">{nav.tabs}</div>
          <div className="@min-[768px]:hidden">{nav.select}</div>
        </div>
        <div className="hidden @min-[1024px]:block col-span-4 @min-[1280px]:col-span-3 self-start sticky top-6">{nav.vertical}</div>
        <div className="col-span-12 @min-[1024px]:col-span-8 @min-[1280px]:col-span-9 min-w-0">{children}</div>
      </div>
    </div>
    {unsavedBar}
  </div>
);

/** H2 (24/32), 14px description, then the section's cards 24px apart. */
export const SectionFrame: React.FC<{
  title: string;
  description: string;
  headingRef?: React.Ref<HTMLHeadingElement>;
  marker?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, description, headingRef, marker, children }) => {
  const id = useId();
  return (
    <section aria-labelledby={id}>
      <div className="relative mb-6">
        {marker}
        <h2 id={id} ref={headingRef} tabIndex={-1} className="text-[24px] leading-[32px] font-semibold text-[#121722] outline-none">
          {title}
        </h2>
        <p className="mt-1 text-[14px] leading-[20px] text-[#4B5465]">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
};
