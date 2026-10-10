import React from 'react';
import { BUTTON, Modal } from '../ui';

/** Assigned cameras, IDs in JetBrains Mono. */
export const CameraListModal: React.FC<{ ids: string[]; onClose: () => void }> = ({ ids, onClose }) => (
  <Modal
    title="Assigned cameras"
    description={`${ids.length} cameras`}
    onClose={onClose}
    footer={
      <button type="button" onClick={onClose} className={BUTTON.primary}>
        Done
      </button>
    }
  >
    <ul className="grid grid-cols-2 @min-[480px]:grid-cols-3 gap-2 max-h-[320px] overflow-y-auto">
      {ids.map((id) => (
        <li key={id} className="px-2.5 py-1.5 rounded-[4px] bg-[#F7F9FC] border border-[#DDE2EA] font-mono text-[13px] text-[#121722] text-center">
          {id}
        </li>
      ))}
    </ul>
  </Modal>
);
