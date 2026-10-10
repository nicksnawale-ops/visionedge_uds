import React, { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, FileText, UploadCloud, X } from 'lucide-react';
import { BUTTON } from '../../profile/ui';
import { UploadedFile, formatBytes } from '../data/sampleRecord';
import { BaseFieldProps, FieldShell, describedBy } from './FieldShell';

interface FileDropzoneProps extends BaseFieldProps {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  /** Accepted extensions, e.g. [".pdf", ".jpg", ".png"]. */
  accept: string[];
  maxBytes: number;
  maxFiles?: number;
}

/**
 * File upload: drag and drop or "Choose files". Each file shows a progress bar (demo upload),
 * a Remove button, or a specific error ("This file is larger than 10 MB").
 */
export const FileDropzone: React.FC<FileDropzoneProps> = ({ id, label, optional, helper, error, disabled, readOnly, files, onChange, accept, maxBytes, maxFiles = 5 }) => {
  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const latest = useRef(files);
  latest.current = files;
  const nextId = useRef(0);
  const uploading = files.some((f) => f.progress < 100 && !f.error);

  // Demo upload: +20% every 250ms per file in progress. Cleared when done or unmounted.
  useEffect(() => {
    if (!uploading) return;
    const t = window.setInterval(() => {
      onChange(latest.current.map((f) => (f.progress < 100 && !f.error ? { ...f, progress: Math.min(100, f.progress + 20) } : f)));
    }, 250);
    return () => window.clearInterval(t);
  }, [uploading, onChange]);

  const add = (list: FileList | null) => {
    if (!list) return;
    const room = maxFiles - files.length;
    const incoming = Array.from(list).slice(0, Math.max(0, room)).map((file): UploadedFile => {
      const ext = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
      nextId.current += 1;
      const base = { id: `${uid}-${nextId.current}`, name: file.name, size: file.size, progress: 0 };
      if (!accept.includes(ext)) return { ...base, error: `This file type isn't supported. Use ${accept.map((a) => a.slice(1).toUpperCase()).join(', ')}.` };
      if (file.size > maxBytes) return { ...base, error: `This file is larger than ${formatBytes(maxBytes)}. Choose a smaller file.` };
      return base;
    });
    onChange([...files, ...incoming]);
  };

  const locked = disabled || readOnly;
  const help = helper ?? `${accept.map((a) => a.slice(1).toUpperCase()).join(', ')} · up to ${formatBytes(maxBytes)} each · ${maxFiles} files max.`;
  return (
    <FieldShell id={id} label={label} optional={optional} helper={help} error={error} group>
      {!locked && files.length < maxFiles && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            add(e.dataTransfer.files);
          }}
          className={`flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-[8px] border-2 border-dashed text-center transition-colors ${
            over ? 'border-[#1E63FF] bg-[#1E63FF]/[0.08]' : error ? 'border-[#0B2D6B] bg-white' : 'border-[#C3CAD5] bg-[#F7F9FC]'
          }`}
        >
          <UploadCloud className="w-6 h-6 text-[#1E63FF]" aria-hidden="true" />
          <p className="text-[14px] text-[#353D4C]">Drag files here, or</p>
          <button id={id} type="button" onClick={() => inputRef.current?.click()} aria-describedby={describedBy(id, help, error)} className={BUTTON.secondarySm}>
            Choose files
          </button>
          <input ref={inputRef} type="file" multiple accept={accept.join(',')} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => (add(e.target.files), (e.target.value = ''))} />
        </div>
      )}
      {files.length > 0 && (
        <ul className="mt-3 space-y-2" aria-label="Files">
          {files.map((f) => (
            <li key={f.id} className={`flex items-center gap-3 px-3 py-2 rounded-[8px] border bg-white ${f.error ? 'border-2 border-[#0B2D6B]' : 'border-[#DDE2EA]'}`}>
              {f.error ? <AlertCircle className="w-4 h-4 shrink-0 text-[#0B2D6B]" aria-hidden="true" /> : <FileText className="w-4 h-4 shrink-0 text-[#4B5465]" aria-hidden="true" />}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] leading-[18px] font-medium text-[#121722] truncate">{f.name}</p>
                {f.error ? (
                  <p className="text-[12px] leading-[16px] font-medium text-[#0B2D6B]">{f.error}</p>
                ) : f.progress < 100 ? (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-[#DDE2EA] overflow-hidden" role="progressbar" aria-valuenow={f.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Uploading ${f.name}`}>
                      <div className="h-full bg-[#1E63FF] transition-[width] duration-200" style={{ width: `${f.progress}%` }} />
                    </div>
                    <span className="text-[12px] tabular-nums text-[#4B5465]">{f.progress}%</span>
                  </div>
                ) : (
                  <p className="text-[12px] leading-[16px] text-[#4B5465]">{formatBytes(f.size)} · Uploaded</p>
                )}
              </div>
              {!locked && (
                <button
                  type="button"
                  onClick={() => onChange(files.filter((x) => x.id !== f.id))}
                  aria-label={`Remove ${f.name}`}
                  className="w-11 h-11 -my-2 -mr-2 rounded-[8px] flex items-center justify-center text-[#4B5465] hover:bg-[#EEF1F6] hover:text-[#0B2D6B] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </FieldShell>
  );
};
