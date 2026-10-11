'use client';

import { useState } from 'react';
import { Attachments } from '@/components/ai-elements';
import { LoadingSpinner } from '@/components/ai/LoadingSpinner';
import { uploadDocumentFile } from '@/lib/upload-document';

export default function DocumentUpload() {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async () => {
    setUploading(true);
    setUploadError(null);
    try {
      for (const file of files) {
        await uploadDocumentFile(file);
      }
      setFiles([]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Document upload failed.';
      setUploadError(message);
      console.error('Document upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-bold mb-2">Upload Documents</h2>
      <Attachments
        files={files}
        onChange={setFiles}
        multiple
        accept=".pdf,.txt,.docx"
      />
      {uploadError ? <p role="alert" className="mt-2 text-sm text-destructive">{uploadError}</p> : null}
      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? <LoadingSpinner /> : 'Upload files'}
        </button>
      )}
    </div>
  );
}