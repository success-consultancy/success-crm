'use client';

import { useCallback, useState } from 'react';
import { useDropzone, type FileRejection, type FileError } from 'react-dropzone';
import { CloudUpload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { FILE_UPLOAD_URL, TENANT } from '@/constants/file-upload-constants';
import { UploadedFileMeta } from '@/types/common';
import { Spinner } from '@/components/common/spinner';

type Props = {
  type: string;
  maxFileSize: number; // in MB
  acceptedFiles: string[];
  onUploadComplete?: (files: UploadedFileMeta[]) => void;
  maxFiles?: number;
};

type FileWithStatus = {
  file: File;
  status: 'idle' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
};

// Extension -> MIME. Keys are bare, lowercase extensions.
const EXT_TO_MIME: Record<string, string[]> = {
  pdf: ['application/pdf'],
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  webp: ['image/webp'],
  gif: ['image/gif'],
  tif: ['image/tiff'],
  tiff: ['image/tiff'],
  doc: ['application/msword'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  xls: ['application/vnd.ms-excel'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  csv: ['text/csv'],
};

const MIME_TO_EXT = Object.entries(EXT_TO_MIME).reduce((acc, [ext, mimes]) => {
  mimes.forEach((mime) => {
    acc[mime] = acc[mime] || [];
    if (!acc[mime].includes(`.${ext}`)) acc[mime].push(`.${ext}`);
  });
  return acc;
}, {} as Record<string, string[]>);

/**
 * Build react-dropzone's `accept` map. Callers pass either bare/dotted extensions
 * ('PDF', '.docx') or raw MIME types ('application/pdf'), so both are normalised here.
 *
 * Every MIME key also carries its extensions: files dragged in from the OS file
 * explorer often arrive with an empty `file.type`, and extension matching is the
 * only thing that lets those through.
 */
const buildAcceptMap = (acceptedFiles: string[]): Record<string, string[]> => {
  const map: Record<string, string[]> = {};

  const add = (mime: string, ext?: string) => {
    if (!map[mime]) map[mime] = [];
    if (ext && !map[mime].includes(ext)) map[mime].push(ext);
  };

  acceptedFiles.forEach((raw) => {
    const entry = raw.trim().toLowerCase();
    if (!entry) return;

    if (entry.includes('/')) {
      add(entry);
      (MIME_TO_EXT[entry] ?? []).forEach((ext) => add(entry, ext));
      return;
    }

    const ext = entry.replace(/^\./, '');
    (EXT_TO_MIME[ext] ?? []).forEach((mime) => add(mime, `.${ext}`));
  });

  return map;
};

const describeRejection = (error: FileError, props: Props): string => {
  switch (error.code) {
    case 'file-invalid-type':
      return `Only ${props.acceptedFiles.join(', ')} files are allowed`;
    case 'file-too-large':
      return `File is larger than ${props.maxFileSize} MB`;
    case 'too-many-files':
      return `You can upload at most ${props.maxFiles} file${props.maxFiles === 1 ? '' : 's'}`;
    default:
      return error.message;
  }
};

const FileUploader = (props: Props) => {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  // const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileMeta[]>([]);
  const [rejections, setRejections] = useState<{ name: string; message: string }[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setRejections([]);
      const validFiles = acceptedFiles.filter((file) => file.size <= props.maxFileSize * 1024 * 1024);
      const dedupedFiles = validFiles.filter((newFile) => !files.some((f) => f.file.name === newFile.name));
      const remaining = props.maxFiles ? props.maxFiles - files.length : Infinity;
      const newFiles = dedupedFiles.slice(0, remaining);

      setFiles((prev) => [...prev, ...newFiles.map((file) => ({ file, status: 'idle' as const }))]);
      newFiles.forEach((file) => handleFileUpload(file));
    },
    [files, props.maxFileSize, props.maxFiles],
  );

  const acceptMap = buildAcceptMap(props.acceptedFiles);

  const onDropRejected = (rejected: FileRejection[]) => {
    setRejections(
      rejected.map(({ file, errors }) => ({
        name: file.name,
        message: errors.map((error) => describeRejection(error, props)).join(', '),
      })),
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: acceptMap,
    maxSize: props.maxFileSize * 1024 * 1024,
    maxFiles: props.maxFiles ?? 0,
  });

  const handleFileUpload = async (file: File) => {
    // Update file status to uploading
    setFiles((prev) => prev.map((f) => (f.file.name === file.name ? { ...f, status: 'uploading' } : f)));
    setIsUploading(true);

    try {
      const fileUploadUrl = FILE_UPLOAD_URL;
      let remoteFileUrl: string | null = null;
      if (file instanceof Blob) {
        const fileName = file.name;

        // Step 1: Get upload URL and fields
        const uploadResponse = await axios.post(fileUploadUrl, {
          name: fileName,
          folder: `${TENANT}/${props.type || 'agreement'}`,
        });

        const responseBody = uploadResponse.data;
        const formData = new FormData();

        Object.keys(responseBody.fields).forEach((key) => {
          formData.append(key, responseBody.fields[key]);
        });
        formData.append('file', file);

        const uploadURL = responseBody.url;
        remoteFileUrl = responseBody.fileUrl;

        // Step 2: Upload the file
        const response = await axios.post(uploadURL, formData);

        if (uploadResponse.status === 200 || response.status === 204) {
          // Handle success
          setFiles((prev) => prev.map((f) => (f.file.name === file.name ? { ...f, status: 'success' } : f)));

          // Add the new URL to the uploaded URLs
          if (remoteFileUrl) {
            const uploadedFile: UploadedFileMeta = {
              url: remoteFileUrl,
              size: file.size,
              name: file.name,
              addedDate: new Date().toISOString(),
            };

            setUploadedFiles((prev) => {
              const updated = [...prev, uploadedFile];

              if (props.onUploadComplete) {
                props.onUploadComplete(updated);
              }

              return updated;
            });
          }
        } else {
          // Handle error
          setFiles((prev) =>
            prev.map((f) =>
              f.file.name === file.name
                ? {
                    ...f,
                    status: 'error',
                    errorMessage: 'Failed to upload file',
                  }
                : f,
            ),
          );
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setFiles((prev) =>
        prev.map((f) =>
          f.file.name === file.name
            ? {
                ...f,
                status: 'error',
                errorMessage: 'Network error occurred',
              }
            : f,
        ),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.file.name !== fileName));

    setUploadedFiles((prev) => {
      const updated = prev.filter((f) => f.name !== fileName);
      props.onUploadComplete?.(updated);
      return updated;
    });
  };

  const clearAllFiles = () => {
    setFiles([]);
    setRejections([]);
    setUploadedFiles([]);
    props.onUploadComplete?.([]);
  };

  const getFileSize = (size: number) => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getStatusIcon = (status: FileWithStatus['status']) => {
    switch (status) {
      case 'uploading':
        return <Spinner className="h-5 w-5" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getUploadProgress = () => {
    const totalFiles = files.length;
    const completedFiles = files.filter((f) => f.status === 'success' || f.status === 'error').length;
    return totalFiles > 0 ? Math.round((completedFiles / totalFiles) * 100) : 0;
  };

  const isAnyFileUploading = files.some((f) => f.status === 'uploading');
  const atCapacity = props.maxFiles != null && files.length >= props.maxFiles;
  const showDropzone = !isAnyFileUploading && !atCapacity;

  return (
    <div className="space-y-5">
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showDropzone ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <section
          {...getRootProps()}
          className={`relative flex flex-col gap-2 items-center justify-center cursor-pointer py-7 px-4 border border-dashed rounded-md transition-colors ${
            isDragActive ? 'border-primary-blue bg-blue-50' : 'border-neutral-border'
          }`}
        >
          <input {...getInputProps()} />
          <CloudUpload className="text-primary-blue h-7 w-7" />
          <div className="flex flex-col items-center gap-0.5">
            <p>
              {isDragActive ? 'Drop the files here' : 'Drag and drop files here or '}
              {!isDragActive && <span className="text-primary-blue font-semibold">Choose files</span>}
            </p>
            <p className="text-c1 text-neutral-lightGrey">
              Maximum file size of {props.maxFileSize} MB | {props.acceptedFiles.join(', ')} files
            </p>
          </div>
        </section>
      </div>

      {rejections.length > 0 && (
        <div className="space-y-1">
          {rejections.map((rejection) => (
            <div key={rejection.name} className="flex items-start gap-2 text-c1 text-red-500">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>
                <span className="font-semibold">{rejection.name}</span> — {rejection.message}
              </span>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-neutral-black">Uploaded Files ({files.length})</h3>
              {isAnyFileUploading && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${getUploadProgress()}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{getUploadProgress()}%</span>
                </div>
              )}
            </div>
            <button
              onClick={clearAllFiles}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {files.map((fileWithStatus) => (
              <div
                key={fileWithStatus.file.name}
                className="p-4 flex flex-col border border-neutral-border rounded-md col-span-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 items-start flex-1 min-w-0">
                    <File className="h-5 w-5 text-neutral-darkGrey flex-shrink-0" />
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className="text-b1-b text-neutral-black truncate" title={fileWithStatus.file.name}>
                        {fileWithStatus.file.name}
                      </span>
                      <span className="text-c1 text-neutral-lightGrey">{getFileSize(fileWithStatus.file.size)}</span>
                      {fileWithStatus.status === 'error' && (
                        <span className="text-c1 text-red-500">{fileWithStatus.errorMessage}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {getStatusIcon(fileWithStatus.status)}
                    <X
                      className="h-5 w-5 text-neutral-darkGrey cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() => removeFile(fileWithStatus.file.name)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
