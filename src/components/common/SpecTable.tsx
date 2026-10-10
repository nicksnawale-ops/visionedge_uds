import React from 'react';

export interface SpecRow {
  property: string;
  value: string;
  token?: string;
  notes?: string;
}

interface SpecTableProps {
  rows: SpecRow[];
  caption?: string;
  className?: string;
}

export const SpecTable: React.FC<SpecTableProps> = ({ rows, caption, className = '' }) => {
  return (
    <div className={`overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)] ${className}`}>
      {caption && (
        <div className="px-4 py-3 border-b border-[#DDE2EA] bg-[#F7F9FC]">
          <h4 className="text-[13px] font-semibold text-[#121722]">{caption}</h4>
        </div>
      )}
      <table className="w-full text-left border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
            <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
              Property
            </th>
            <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
              Value
            </th>
            <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
              Token / Class
            </th>
            {rows.some((r) => r.notes) && (
              <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                Guidelines
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#DDE2EA]">
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-[#F7F9FC] transition-colors">
              <td className="py-3 px-4 font-medium text-[#121722] whitespace-nowrap">
                {row.property}
              </td>
              <td className="py-3 px-4 text-[#353D4C] whitespace-nowrap">
                {row.value}
              </td>
              <td className="py-3 px-4">
                {row.token ? (
                  <code className="px-2 py-0.5 rounded bg-[#F7F9FC] border border-[#DDE2EA] font-mono text-[12px] text-[#1E63FF] font-medium">
                    {row.token}
                  </code>
                ) : (
                  <span className="text-[#8C95A6]">—</span>
                )}
              </td>
              {rows.some((r) => r.notes) && (
                <td className="py-3 px-4 text-[13px] text-[#4B5465]">
                  {row.notes || '—'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
