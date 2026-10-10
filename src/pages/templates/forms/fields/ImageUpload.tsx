import React, { useEffect, useRef, useState } from 'react';
import { ImageIcon, Upload } from 'lucide-react';
import { AvatarCropModal } from '../../profile/modals/AvatarCropModal';
import { BUTTON } from '../../profile/ui';
import { BaseFieldProps, FieldShell } from './FieldShell';

interface ImageUploadProps extends BaseFieldProps {
  /** Image URL (object URL or data URI) or "". */
  value: string;
  onChange: (src: string) => void;
}

const MAX = 2 * 1024 * 1024;

/** Image upload with a 96px preview, Replace, Remove and a "Crop" link (the Profile crop modal). */
export const ImageUpload: React.FC<ImageUploadProps> = ({ id, label, optional, helper = 'JPG or PNG, at least 256 × 256 px, max 2 MB.', error, disabled, readOnly, value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState('');
  const [cropping, setCropping] = useState(false);
  const urls = useRef<string[]>([]);
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);
  const locked = disabled || readOnly;

  return (
    <FieldShell id={id} label={label} optional={optional} helper={helper} error={error ?? (fileError || undefined)} group>
      <div className="flex flex-wrap items-center gap-4">
        <span className="w-24 h-24 rounded-[8px] border border-[#DDE2EA] bg-[#F7F9FC] flex items-center justify-center overflow-hidden shrink-0">
          {value ? <img src={value} alt={`${label} preview`} className="w-full h-full object-cover" /> : <ImageIcon className="w-7 h-7 text-[#8C95A6]" aria-hidden="true" />}
        </span>
        {!locked && (
          <div className="flex flex-wrap items-center gap-2">
            <button id={id} type="button" onClick={() => inputRef.current?.click()} className={BUTTON.secondary}>
              <Upload className="w-4 h-4" aria-hidden="true" />
              {value ? 'Replace' : 'Upload image'}
            </button>
            {value && (
              <>
                <button type="button" onClick={() => setCropping(true)} className={BUTTON.ghost}>
                  Crop
                </button>
                <button type="button" onClick={() => onChange('')} className={BUTTON.ghost}>
                  Remove
                </button>
              </>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (!f) return;
            if (!['image/jpeg', 'image/png'].includes(f.type)) return setFileError("This file isn't a JPG or PNG. Choose a JPG or PNG image.");
            if (f.size > MAX) return setFileError('This file is larger than 2 MB. Choose a smaller image.');
            setFileError('');
            const url = URL.createObjectURL(f);
            urls.current.push(url);
            onChange(url);
          }}
        />
      </div>
      {cropping && value && (
        <AvatarCropModal
          initialImage={value}
          onClose={() => setCropping(false)}
          onSave={(src) => {
            onChange(src);
            setCropping(false);
          }}
        />
      )}
    </FieldShell>
  );
};
