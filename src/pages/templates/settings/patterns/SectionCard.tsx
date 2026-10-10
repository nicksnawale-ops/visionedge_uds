import React, { useId } from 'react';

interface SectionCardProps {
  title: string;
  description?: React.ReactNode;
  /** Card header actions (Secondary buttons, links). */
  actions?: React.ReactNode;
  /** Search jump target for card-level items (tables, action cards). */
  settingId?: string;
  overlay?: React.ReactNode;
  className?: string;
  /** Content below the header: setting rows, or a padded body. */
  children: React.ReactNode;
}

/**
 * Settings card: white, 1px Gray 200, 12px radius. Header 20px × 24px with an H4 title,
 * a 12px description and a 1px Gray 200 bottom border. Setting rows sit directly inside.
 */
export const SectionCard: React.FC<SectionCardProps> = ({ title, description, actions, settingId, overlay, className = '', children }) => {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      data-setting-id={settingId}
      tabIndex={settingId ? -1 : undefined}
      className={`relative min-w-0 bg-white rounded-[12px] border border-[#DDE2EA] shadow-[0_1px_3px_rgba(11,45,107,0.08)] outline-none scroll-mt-24 ${className}`}
    >
      {overlay}
      <div className="px-4 @min-[768px]:px-6 py-5 border-b border-[#DDE2EA] flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h4 id={titleId} className="text-[16px] leading-[24px] font-semibold text-[#121722]">
            {title}
          </h4>
          {description && <p className="mt-0.5 text-[12px] leading-[16px] text-[#6B7485]">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
};

/** Padded body for cards that hold a table toolbar, a grid or free content. */
export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-4 @min-[768px]:px-6 py-5 ${className}`}>{children}</div>
);
