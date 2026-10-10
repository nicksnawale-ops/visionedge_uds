import React from 'react';

interface SettingsHeaderProps {
  /** "VisionEdge ANPR" */
  product: string;
  /** The settings search (right side). */
  search: React.ReactNode;
  marker?: React.ReactNode;
  searchMarker?: React.ReactNode;
}

/** H1 "Settings" + subtitle on the left, the settings search on the right. No Primary button. */
export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ product, search, marker, searchMarker }) => (
  <div className="relative flex flex-col @min-[768px]:flex-row @min-[768px]:items-end justify-between gap-4">
    {marker}
    <div className="min-w-0">
      <h1 className="text-[28px] leading-[36px] font-semibold text-[#121722]">Settings</h1>
      <p className="mt-1 text-[14px] leading-[20px] text-[#4B5465]">Manage your organization, cameras, detection and integrations for {product}.</p>
    </div>
    <div className="relative">
      {searchMarker}
      {search}
    </div>
  </div>
);
