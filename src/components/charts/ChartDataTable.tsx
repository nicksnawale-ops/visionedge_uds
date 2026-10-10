import React from 'react';
import { formatNumber } from './chartUtils';

export type CellValue = string | number;

export interface TableColumn {
  key: string;
  label: string;
  /** Right-aligns the column with tabular figures. */
  numeric?: boolean;
  mono?: boolean;
  format?: (value: CellValue) => string;
}

export interface ChartTableData {
  caption: string;
  columns: TableColumn[];
  rows: Record<string, CellValue>[];
}

/** Accessible table view of a chart's data: Overline headers, Body text, right-aligned numbers. */
export const ChartDataTable: React.FC<{ data: ChartTableData }> = ({ data }) => (
  <div className="overflow-x-auto rounded-[8px] border border-[#DDE2EA] bg-white">
    <table className="w-full text-left border-collapse text-[14px] leading-[20px]">
      <caption className="sr-only">{data.caption}</caption>
      <thead>
        <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
          {data.columns.map((col) => (
            <th
              key={col.key}
              scope="col"
              className={`py-2.5 px-4 text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#6B7485] whitespace-nowrap ${
                col.numeric ? 'text-right' : ''
              }`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#DDE2EA]">
        {data.rows.map((row, idx) => (
          <tr key={idx}>
            {data.columns.map((col, colIdx) => {
              const raw = row[col.key];
              const text = col.format ? col.format(raw) : typeof raw === 'number' ? formatNumber(raw) : raw;
              const Cell = colIdx === 0 ? 'th' : 'td';
              return (
                <Cell
                  key={col.key}
                  scope={colIdx === 0 ? 'row' : undefined}
                  className={`py-2.5 px-4 text-[#353D4C] font-normal whitespace-nowrap ${
                    col.numeric ? 'text-right tabular-nums' : ''
                  } ${col.mono ? 'font-mono text-[13px]' : ''}`}
                >
                  {text}
                </Cell>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
