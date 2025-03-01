import Icons from "@/icons";
import { CloudUpload, X } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  maxFileSize: number;
  acceptedFiles: string[];
};

const FileUploader = (props: Props) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  return (
    <div className="space-y-5">
      <section className="flex items-center justify-center py-7 border border-dashed border-neutral-border rounded-md">
        <div
          {...getRootProps({ className: "dropzone" })}
          className="flex flex-col gap-2 items-center"
        >
          <input {...getInputProps()} />
          <Icons.CloudUploadIcon className="text-primary-blue h-7 w-7" />
          <div className="flex flex-col items-center"></div>
          <div className="flex flex-col items-center gap-0.5">
            <p>
              Drag and drop file here or{" "}
              <span className="text-primary-blue font-semibold cursor-pointer">
                Choose file
              </span>
            </p>
            <p className="text-c1 text-neutral-lightGrey">
              Maximum file size of {props.maxFileSize} MB |{" "}
              {props.acceptedFiles.join(", ")} file
            </p>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-3 gap-5">
        {acceptedFiles.map((file) => {
          return (
            <div className="p-4 flex flex-col border border-neutral-border rounded-md col-span-1">
              <div className="flex items-start justify-between">
                <div className="flex gap-5 items-start">
                  <Icons.FileIcon className="h-5 w-5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-b1-b text-neutral-black">
                      {file.name}
                    </span>
                    <span className="text-c1 text-neutral-lightGrey">
                      {file.size * 0.001} KB
                    </span>
                  </div>
                </div>
                <X className="h-5 w-5 text-neutral-darkGrey cursor-pointer" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileUploader;

