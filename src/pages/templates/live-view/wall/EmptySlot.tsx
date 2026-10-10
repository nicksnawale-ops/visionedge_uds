import React from 'react';
import { Plus } from 'lucide-react';

/** Empty wall slot: dashed 1px Gray 600 border, Plus icon, "Add camera". Accepts dropped cameras. */
export const EmptySlot: React.FC<{
  slot: number;
  dropActive: boolean;
  onAdd: () => void;
  onDrop: (cameraId: string) => void;
  onDragOver: (on: boolean) => void;
  tabIndex: number;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
}> = ({ slot, dropActive, onAdd, onDrop, onDragOver, tabIndex, onKeyDown, onFocus }) => (
  <div
    role="gridcell"
    tabIndex={tabIndex}
    aria-label={`Empty slot ${slot + 1}. Press Enter to add a camera.`}
    data-slot={slot}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && e.target === e.currentTarget) {
        e.preventDefault();
        onAdd();
      } else onKeyDown(e);
    }}
    onFocus={(e) => e.target === e.currentTarget && onFocus()}
    onClick={onAdd}
    onDragOver={(e) => {
      e.preventDefault();
      onDragOver(true);
    }}
    onDragLeave={() => onDragOver(false)}
    onDrop={(e) => {
      e.preventDefault();
      onDragOver(false);
      const id = e.dataTransfer.getData('text/camera-id');
      if (id) onDrop(id);
    }}
    className={`relative aspect-video rounded-[12px] border border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2 ${
      dropActive ? 'border-[#00C6FF] bg-[#00C6FF]/10' : 'border-[#4B5465] bg-black/[0.04] hover:bg-black/[0.06]'
    }`}
  >
    <Plus className="w-5 h-5 text-[#6B7485]" aria-hidden="true" />
    <span className="text-[13px] font-medium text-[#6B7485]">Add camera</span>
  </div>
);
