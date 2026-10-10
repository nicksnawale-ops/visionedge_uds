import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { BUTTON } from '../../../profile/ui';
import { IMPORT_FILE, MAX_ROWS, TARGET_FIELDS } from '../../data/importSample';
import type { UploadedFile } from '../../data/sampleRecord';
import { FormSection } from '../../foundations/FormSection';
import { FileDropzone } from '../../fields/FileDropzone';

interface UploadStepProps {
  files: UploadedFile[];
  onFiles: (f: UploadedFile[]) => void;
  error?: string;
  onDownloadTemplate: () => void;
}

/** Step 1 — Upload a .csv or .xlsx (max 5,000 rows) or download the template. */
export const UploadStep: React.FC<UploadStepProps> = ({ files, onFiles, error, onDownloadTemplate }) => (
  <FormSection
    title="Upload a file"
    description={`CSV or Excel, up to ${MAX_ROWS.toLocaleString('en-IN')} rows. The first row must be column names.`}
    action={
      <button type="button" onClick={onDownloadTemplate} className={BUTTON.secondarySm}>
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        Download template
      </button>
    }
  >
    <FileDropzone id="import-file" label="File" files={files} onChange={onFiles} accept={['.csv', '.xlsx']} maxBytes={10_000_000} maxFiles={1} error={error} helper={`CSV or XLSX · up to 10 MB · ${MAX_ROWS.toLocaleString('en-IN')} rows max.`} />
    {files.length === 0 && (
      <button
        type="button"
        onClick={() => onFiles([{ id: 'sample', name: IMPORT_FILE.name, size: IMPORT_FILE.size, progress: 0 }])}
        className="inline-flex items-center gap-2 min-h-[44px] text-[14px] font-medium text-[#1E63FF] hover:underline rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]"
      >
        <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
        Use the sample file ({IMPORT_FILE.rows} rows)
      </button>
    )}
    <p className="text-[12px] leading-[16px] text-[#4B5465]">Required columns: {TARGET_FIELDS.filter((f) => f.required).map((f) => f.label).join(', ')}.</p>
  </FormSection>
);
