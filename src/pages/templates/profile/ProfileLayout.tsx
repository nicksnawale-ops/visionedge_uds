import React, { useId } from 'react';

interface ProfileLayoutProps {
  /** "Settings / My profile" */
  breadcrumb: React.ReactNode;
  /** Admin, suspended or other page-level banners. */
  banners?: React.ReactNode;
  /** Header card with the stats strip. */
  header: React.ReactNode;
  /** Section nav in its three forms: vertical (≥1024px), tabs (768–1023px), select (<768px). */
  nav: { vertical: React.ReactNode; tabs: React.ReactNode; select: React.ReactNode };
  /** The selected section (SectionFrame + cards). */
  children: React.ReactNode;
  /** Sticky bar, shown only with unsaved changes. */
  unsavedBar?: React.ReactNode;
}

/**
 * Profile page layout inside the product AppShell.
 * Gray 50 content, 32px padding (24px tablet, 16px mobile), max width 1200px, 12 columns, 24px gutter.
 * ≥1280px nav 3 + content 9 · 1024–1279px 4 + 8 · <1024px nav above the content, full width.
 */
export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ breadcrumb, banners, header, nav, children, unsavedBar }) => (
  <div className="min-h-full flex flex-col">
    <div className="flex-1 w-full max-w-[1264px] mx-auto p-4 @min-[768px]:p-6 @min-[1280px]:p-8">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 -mb-2">{breadcrumb}</div>
        {banners && <div className="col-span-12 space-y-3">{banners}</div>}
        <div className="col-span-12">{header}</div>

        {/* Tabs (768–1023px) or a select (<768px) under the header card */}
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

interface SectionFrameProps {
  title: string;
  description: string;
  /** Focus target after the user switches sections. */
  headingRef?: React.Ref<HTMLHeadingElement>;
  marker?: React.ReactNode;
  children: React.ReactNode;
}

/** H3 title, 14px description, then the section's cards 24px apart. */
export const SectionFrame: React.FC<SectionFrameProps> = ({ title, description, headingRef, marker, children }) => {
  const id = useId();
  return (
    <section aria-labelledby={id} className="relative">
      {marker}
      <h3 id={id} ref={headingRef} tabIndex={-1} className="text-[20px] leading-[28px] font-semibold text-[#121722] outline-none">
        {title}
      </h3>
      <p className="mt-1 mb-6 text-[14px] leading-[20px] text-[#4B5465]">{description}</p>
      <div className="space-y-6">{children}</div>
    </section>
  );
};
