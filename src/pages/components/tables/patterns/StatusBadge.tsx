import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { STATUS_LABEL, VehicleStatus } from './sampleData';

/** The Tables page's existing status badge styles, as one component for the patterns. */
export const StatusBadge: React.FC<{ status: VehicleStatus }> = ({ status }) => {
  switch (status) {
    case 'verified':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#00C6FF]/15 text-[#0B2D6B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C6FF]" aria-hidden="true" />
          {STATUS_LABEL.verified}
        </span>
      );
    case 'blacklisted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#0B2D6B] text-white">
          <AlertTriangle className="w-3 h-3 text-[#00C6FF]" aria-hidden="true" />
          {STATUS_LABEL.blacklisted}
        </span>
      );
    case 'processing':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#1E63FF]/[0.08] text-[#1E63FF]">
          <Clock className="w-3 h-3" aria-hidden="true" />
          {STATUS_LABEL.processing}
        </span>
      );
    case 'guest':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#EEF1F6] text-[#353D4C]">{STATUS_LABEL.guest}</span>;
  }
};
