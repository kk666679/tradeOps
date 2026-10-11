'use client';

import { useState } from "react";
import { Attachments } from "@/components/ai-elements/attachments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AILoadingState } from "@/components/common/ailoading-state";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, CheckCircle } from "lucide-react";
import { uploadDocumentFile } from "@/lib/upload-document";

export default function CargoUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async () => {
    setUploading(true);
    setUploadError(null);
    try {
      const filenames: string[] = [];
      for (const file of files) {
        filenames.push(await uploadDocumentFile(file));
      }
      setUploaded((prev) => [...prev, ...filenames]);
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
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Upload className="h-6 w-6" />
            Cargo Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Attachments
            files={files}
            onChange={setFiles}
            multiple
            accept=".pdf,.docx,.txt,.xls,.csv"
          />
          
          {files.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button 
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 gap-2 font-semibold shadow-md"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Upload files ({files.length})
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setFiles([])}
                className="flex-0"
              >
                Clear
              </Button>
            </div>
          )}

          {uploadError ? <p role="alert" className="mt-3 text-sm text-destructive">{uploadError}</p> : null}

          {uploading && (
            <AILoadingState 
              title="Uploading documents..."
              subtitle="Sending the selected files to the document upload endpoint."
            />
          )}
        </CardContent>
      </Card>

      {uploaded.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Uploaded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {uploaded.map((file) => (
                <Badge key={file} variant="secondary">
                  <FileText className="h-3 w-3 mr-1" />
                  {file}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
