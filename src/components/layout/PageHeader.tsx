import React from 'react';

interface PageHeaderProps {
  category: string;
  title: string;
  description: string;
  lastUpdated?: string;
  updatedBadge?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  category,
  title,
  description,
  lastUpdated = '30 Sep 2026',
  updatedBadge,
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-4">
        <div>
          {/* Overline tag */}
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] mb-1">
            {category}
          </div>

          {/* H1 Title */}
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] leading-[36px] font-semibold text-[#121722] tracking-tight">
              {title}
            </h1>
            {updatedBadge && (
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#00C6FF]/15 text-[#00C6FF] border border-[#00C6FF]/30 uppercase tracking-wider">
                Updated
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[15px] leading-relaxed text-[#4B5465] mt-1.5 max-w-2xl">
            {description}
          </p>
        </div>

        {/* Last updated timestamp */}
        <div className="shrink-0 text-[12px] font-normal text-[#6B7485] sm:text-right pt-1">
          Last updated {lastUpdated}
        </div>
      </div>

      {/* 1px divider */}
      <hr className="border-t border-[#DDE2EA]" />
    </div>
  );
};
