"use client";

import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

type FileDropzoneProps = {
  onDrop: (acceptedFiles: File[]) => void;
};

export function FileDropzone({ onDrop }: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/30 bg-transparent p-12 text-center transition-colors duration-300 hover:border-white hover:bg-white/10",
        isDragActive && "border-white bg-white/10"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3 text-indigo-200">
        <UploadCloud
          className={cn(
            "h-10 w-10 transition-transform duration-300",
            isDragActive && "scale-110 text-white"
          )}
        />
        <p className="text-lg font-medium text-white">
          {isDragActive
            ? "Drop the files here!"
            : "Drag & drop PDFs here, or click to select"}
        </p>
        <p className="text-sm">
          All processing is done on your device for privacy.
        </p>
      </div>
    </div>
  );
}
