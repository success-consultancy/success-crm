'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { FILE_UPLOAD_URL, TENANT } from '@/constants/file-upload-constants';
import { UploadedFileMeta } from '@/types/common';

type Props = {
  type: string;
  maxFileSize: number; // in MB
  acceptedFiles: string[];
  onUploadComplete?: (files: UploadedFileMeta[]) => void;
};

type FileWithStatus = {
  file: File;
  status: 'idle' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
};

const FileUploader = (props: Props) => {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  // const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileMeta[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Filter files that exceed the max file size
      const validFiles = acceptedFiles.filter((file) => file.size <= props.maxFileSize * 1024 * 1024);

      // Filter files that are already in the list
      const newFiles = validFiles.filter((newFile) => !files.some((f) => f.file.name === newFile.name));

      // Add new files to the state
      setFiles((prev) => [...prev, ...newFiles.map((file) => ({ file, status: 'idle' as const }))]);

      // Automatically upload new files
      newFiles.forEach((file) => handleFileUpload(file));
    },
    [files, props.maxFileSize],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: props.acceptedFiles.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: props.maxFileSize * 1024 * 1024,
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
        return <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-blue border-t-transparent" />;
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

  return (
    <div className="space-y-5">
      <section
        className={`flex items-center justify-center py-7 border border-dashed rounded-md transition-colors ${
          isDragActive ? 'border-primary-blue bg-blue-50' : 'border-neutral-border'
        }`}
      >
        <div {...getRootProps()} className="flex flex-col gap-2 items-center cursor-pointer w-full h-full p-4">
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
        </div>
      </section>

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
