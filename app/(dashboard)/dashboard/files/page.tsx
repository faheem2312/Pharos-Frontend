'use client';

import { useEffect, useState, useRef } from 'react';
import { Upload, File as FileIcon, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { apiFetch } from '@/lib/api';

interface FileRecord {
  id: string;
  filename: string;
  contentType: string;
  publicUrl: string;
  createdAt: string;
}

const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
];

export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFiles = () => {
    apiFetch<FileRecord[]>('/files')
      .then(setFiles)
      .catch(() => setFiles([]));
  };

  useEffect(() => {
    loadFiles();
  }, []);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Unsupported file type. Try an image, PDF, or plain text file.');
      return;
    }

    setUploading(true);
    try {
      const { uploadUrl } = await apiFetch<{ uploadUrl: string; publicUrl: string; fileId: string }>(
        '/files/upload-url',
        {
          method: 'POST',
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        },
      );

      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      loadFiles();
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Files</h1>
        <p className="text-sm text-muted-foreground">
          Uploaded directly to storage — images, PDFs, and text files.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Drop a file here, or click to browse</p>
            <p className="text-xs text-muted-foreground">PNG, JPEG, GIF, WEBP, PDF, or TXT</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-input bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary ${
              uploading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            {uploading ? 'Uploading…' : 'Choose file'}
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {files.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No files uploaded yet.</div>
          ) : (
            <div className="divide-y divide-border">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.contentType} · {new Date(file.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <a
                    href={file.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <span>View</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}