import React from 'react';
import { DIM_OPACITY } from './chartUtils';

export interface LegendItem {
  key: string;
  label: string;
  color: string;
  /** Use 0.5 for the "same colour at 50%" series. */
  opacity?: number;
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  /** Rendered top-right. Omitted automatically for single-series charts. */
  legend?: LegendItem[];
  activeKey?: string | null;
  onLegendHover?: (key: string | null) => void;
  className?: string;
  children: React.ReactNode;
}

/** White chart card: 1px Gray 200 border, 12px radius, 24px padding, title + subtitle + top-right legend. */
export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  legend,
  activeKey = null,
  onLegendHover,
  className = '',
  children,
}) => {
  const showLegend = legend && legend.length > 1;

  return (
    <div
      className={`w-full min-w-0 bg-white p-6 rounded-[12px] border border-[#DDE2EA] shadow-[0_1px_3px_rgba(11,45,107,0.08)] ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 mb-4">
        <div className="min-w-0">
          <h3 className="text-[16px] leading-[24px] font-semibold text-[#121722]">{title}</h3>
          {subtitle && <p className="text-[12px] leading-[16px] text-[#4B5465] mt-0.5">{subtitle}</p>}
        </div>

        {showLegend && (
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:justify-end pt-1" aria-label="Legend">
            {legend.map((item) => (
              <li
                key={item.key}
                className="flex items-center gap-1.5 text-[12px] text-[#353D4C] transition-opacity"
                style={{ opacity: activeKey == null || activeKey === item.key ? 1 : DIM_OPACITY }}
                onMouseEnter={() => onLegendHover?.(item.key)}
                onMouseLeave={() => onLegendHover?.(null)}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color, opacity: item.opacity ?? 1 }}
                />
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {children}
    </div>
  );
};
