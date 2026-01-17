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
        "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-8 text-center transition-all duration-300 ease-in-out hover:border-primary/80 hover:bg-gray-100/50 dark:border-gray-700 dark:bg-gray-800/20 dark:hover:border-primary/60 dark:hover:bg-gray-800/40",
        isDragActive &&
          "border-primary ring-4 ring-primary/20 bg-primary/5 dark:bg-primary/10"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
        <UploadCloud
          className={cn(
            "h-12 w-12 transition-transform duration-300",
            isDragActive && "scale-125 text-primary"
          )}
        />
        <p className="text-lg font-semibold">
          {isDragActive
            ? "Drop the files here!"
            : "Drag & drop PDFs here, or click to select"}
        </p>
        <p className="text-sm text-gray-400">
          All processing is done in your browser.
        </p>
      </div>
    </div>
  );
}
