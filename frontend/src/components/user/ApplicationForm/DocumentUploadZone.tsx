import React, { useCallback, useState } from 'react';
import type { CertificateType } from '../../../types';
import { CERTIFICATE_TYPES } from './CertificateTypeSelector';

export interface UploadedFile {
  documentType: string;
  file: File;
  preview: string;
  progress: number;
  error?: string;
}

interface DocumentUploadZoneProps {
  certType: CertificateType;
  files: UploadedFile[];
  onAdd: (file: UploadedFile) => void;
  onRemove: (index: number) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const DocumentUploadZone: React.FC<DocumentUploadZoneProps> = ({
  certType, files, onAdd, onRemove,
}) => {
  const [dragging, setDragging] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('');

  const certInfo = CERTIFICATE_TYPES.find((c) => c.id === certType);
  const requiredDocs = certInfo?.docs || [];

  const handleFile = useCallback(
    (file: File) => {
      if (!selectedDocType) {
        alert('Please select a document type first.');
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert('Only JPG, PNG, and PDF files are allowed.');
        return;
      }
      if (file.size > MAX_SIZE) {
        alert('File size must be under 5MB.');
        return;
      }

      const isPdf = file.type === 'application/pdf';
      const preview = isPdf ? '' : URL.createObjectURL(file);

      onAdd({
        documentType: selectedDocType,
        file,
        preview,
        progress: 0,
      });

      setSelectedDocType('');
    },
    [selectedDocType, onAdd]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = e.dataTransfer.files;
      if (files) {
        Array.from(files).forEach((file) => handleFile(file));
      }
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => handleFile(file));
    }
    e.target.value = '';
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-1">Upload Documents</h2>
      <p className="text-slate-400 text-sm mb-6">कागजातहरू अपलोड गर्नुहोस् (JPG, PNG, PDF — max 5MB each)</p>

      {/* Required Documents Checklist */}
      <div className="glass-card-dark p-4 mb-5 border border-slate-700/30">
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Required Documents for {certInfo?.labelEnglish}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {requiredDocs.map((doc) => {
            const uploaded = files.some((f) => f.documentType === doc);
            return (
              <div key={doc} className={`flex items-center gap-2 text-sm p-2 rounded-lg
                ${uploaded ? 'text-emerald-400' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs flex-shrink-0
                  ${uploaded ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-600'}`}>
                  {uploaded ? '✓' : '○'}
                </span>
                {doc}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <label className="form-label">Document Type *</label>
          <select
            value={selectedDocType}
            onChange={(e) => setSelectedDocType(e.target.value)}
            className="form-input"
          >
            <option value="">Select document type...</option>
            {requiredDocs.map((doc) => (
              <option key={doc} value={doc}>{doc}</option>
            ))}
            <option value="other">Other Supporting Document</option>
          </select>
        </div>
      </div>

      {/* Drop Zone */}
      <label
        htmlFor="doc-file-input"
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2
                     border-dashed cursor-pointer transition-all duration-200
                     ${dragging
                       ? 'border-primary-500 bg-primary-500/10'
                       : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/40'
                     }
                     ${!selectedDocType ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="text-4xl">{dragging ? '📂' : '☁️'}</div>
        <div className="text-center">
          <p className="text-white font-medium text-sm">
            {dragging ? 'Drop file here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-slate-400 text-xs mt-1">JPG, PNG, PDF up to 5MB</p>
          {!selectedDocType && (
            <p className="text-amber-400 text-xs mt-1">← Select document type first</p>
          )}
        </div>
      </label>
      <input
        id="doc-file-input"
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        multiple
        onChange={handleInputChange}
        className="hidden"
        disabled={!selectedDocType}
      />

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="mt-5 space-y-3">
          <p className="text-sm font-semibold text-slate-300">
            Uploaded ({files.length} file{files.length > 1 ? 's' : ''})
          </p>
          {files.map((f, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/40 group"
            >
              {/* Thumbnail / Icon */}
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-700
                              flex items-center justify-center border border-slate-600">
                {f.preview ? (
                  <img src={f.preview} alt={f.documentType} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">📄</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{f.documentType}</p>
                <p className="text-slate-400 text-xs truncate">{f.file.name}</p>
                <p className="text-slate-500 text-xs">{formatSize(f.file.size)}</p>
                {/* Progress bar */}
                {f.progress > 0 && f.progress < 100 && (
                  <div className="mt-1.5 h-1 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 transition-all duration-300"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}
                {f.progress === 100 && (
                  <p className="text-emerald-400 text-xs mt-1">✓ Uploaded</p>
                )}
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400
                           transition-all p-1.5 rounded-lg hover:bg-red-500/10"
                aria-label="Remove file"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUploadZone;
