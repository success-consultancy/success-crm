'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

type Props = {
  maxFileSize: number; // in MB
  acceptedFiles: string[];
  onUploadComplete?: (fileUrls: string[]) => void;
};

type FileWithStatus = {
  file: File;
  status: 'idle' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
};

const FileUploader = (props: Props) => {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
    accept: props.acceptedFiles.reduce(
      (acc, type) => {
        acc[type] = [];
        return acc;
      },
      {} as Record<string, string[]>,
    ),
    maxSize: props.maxFileSize * 1024 * 1024,
  });

  const handleFileUpload = async (file: File) => {
    // Update file status to uploading
    setFiles((prev) => prev.map((f) => (f.file.name === file.name ? { ...f, status: 'uploading' } : f)));
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://3lbqul2ps1.execute-api.us-east-1.amazonaws.com/Prod/fileUpload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Handle success
        const data = await response.json();
        setFiles((prev) => prev.map((f) => (f.file.name === file.name ? { ...f, status: 'success' } : f)));

        // Call the onUploadComplete callback if provided
        if (props.onUploadComplete && data.fileUrl) {
          props.onUploadComplete([data.fileUrl]);
        }
      } else {
        // Handle error
        const errorData = await response.json();
        setFiles((prev) =>
          prev.map((f) =>
            f.file.name === file.name
              ? {
                  ...f,
                  status: 'error',
                  errorMessage: errorData.message || 'Failed to upload file',
                }
              : f,
          ),
        );
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
              {isDragActive ? 'Drop the files here' : 'Drag and drop file here or '}
              {!isDragActive && <span className="text-primary-blue font-semibold">Choose file</span>}
            </p>
            <p className="text-c1 text-neutral-lightGrey">
              Maximum file size of {props.maxFileSize} MB | {props.acceptedFiles.join(', ')} files
            </p>
          </div>
        </div>
      </section>

      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {files.map((fileWithStatus) => (
            <div
              key={fileWithStatus.file.name}
              className="p-4 flex flex-col border border-neutral-border rounded-md col-span-1"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3 items-start">
                  <File className="h-5 w-5 text-neutral-darkGrey" />
                  <div className="flex flex-col gap-0.5 max-w-[180px]">
                    <span className="text-b1-b text-neutral-black truncate" title={fileWithStatus.file.name}>
                      {fileWithStatus.file.name}
                    </span>
                    <span className="text-c1 text-neutral-lightGrey">{getFileSize(fileWithStatus.file.size)}</span>
                    {fileWithStatus.status === 'error' && (
                      <span className="text-c1 text-red-500">{fileWithStatus.errorMessage}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
      )}
    </div>
  );
};

export default FileUploader;
