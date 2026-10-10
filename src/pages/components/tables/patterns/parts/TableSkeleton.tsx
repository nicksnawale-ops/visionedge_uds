import React from 'react';

/** Bar widths per column, varied so rows don't look identical. */
const WIDTHS = [
  ['w-4', 'w-24', 'w-28', 'w-32', 'w-20', 'w-14', 'w-16'],
  ['w-4', 'w-20', 'w-36', 'w-24', 'w-24', 'w-12', 'w-14'],
  ['w-4', 'w-24', 'w-24', 'w-28', 'w-16', 'w-14', 'w-16'],
];

/**
 * 8 skeleton rows (Gray 100 bars). The shimmer only runs when motion is allowed; with reduced motion the
 * bars are static. Decorative for assistive tech: the table is marked aria-busy instead.
 */
export const TableSkeleton: React.FC<{ columns: number; rows?: number; rowHeight?: string }> = ({ columns, rows = 8, rowHeight = 'h-12' }) => (
  <>
    {Array.from({ length: rows }, (_, r) => (
      <tr key={r} className={`${rowHeight} border-b border-[#DDE2EA] last:border-b-0`} aria-hidden="true">
        {Array.from({ length: columns }, (_, c) => (
          <td key={c} className="px-4">
            <span className={`block h-3.5 rounded-[4px] bg-[#EEF1F6] motion-safe:animate-pulse ${WIDTHS[r % 3][c % 7]}`} />
          </td>
        ))}
      </tr>
    ))}
  </>
);
