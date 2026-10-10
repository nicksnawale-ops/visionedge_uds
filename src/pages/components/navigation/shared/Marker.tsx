import React from 'react';

/** Numbered anatomy marker (decorative; the legend carries the meaning). */
export const Marker: React.FC<{ n: number; className?: string }> = ({ n, className = '' }) => (
  <span aria-hidden="true" className={`absolute z-10 w-5 h-5 rounded-full bg-[#1E63FF] text-white text-[11px] font-semibold flex items-center justify-center ring-2 ring-white ${className}`}>
    {n}
  </span>
);

/** Legend for anatomy markers. */
export const Legend: React.FC<{ parts: [string, string][] }> = ({ parts }) => (
  <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 p-5 border-t border-[#DDE2EA]">
    {parts.map(([name, desc], i) => (
      <li key={name} className="flex gap-3">
        <span aria-hidden="true" className="w-5 h-5 mt-0.5 shrink-0 rounded-full bg-[#1E63FF] text-white text-[11px] font-semibold flex items-center justify-center">
          {i + 1}
        </span>
        <span>
          <span className="block text-[14px] font-semibold text-[#121722]">{name}</span>
          <span className="block text-[13px] text-[#4B5465]">{desc}</span>
        </span>
      </li>
    ))}
  </ol>
);
