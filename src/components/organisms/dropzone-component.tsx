"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  onDrop: (files: File[]) => void;
  className?: string;
  acceptedFileTypes?: string[];
  multiple?: boolean;
  children?: React.ReactNode;
  label?: string;
}

const Dropzone: React.FC<DropzoneProps> = ({
  onDrop,
  className,
  acceptedFileTypes,
  multiple = true,
  children,
  label,
}) => {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: acceptedFileTypes?.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {} as Record<string, string[]>
    ),
    multiple,
  });

  return (
    <div>
      {label && <label className="block mb-2 font-medium">{label}</label>}
      <div
        {...getRootProps()}
        className={cn(
          "border border-dashed border-gray-400 p-4 rounded-md cursor-pointer text-center transition-colors hover:border-primary",
          isDragActive && "border-primary bg-gray-100",
          className
        )}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-sm text-muted-foreground">
            Drop the files here...
          </p>
        ) : (
          children || (
            <p className="text-sm text-muted-foreground">
              Drag & drop some files here, or click to select
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default Dropzone;
