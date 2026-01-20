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
        "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/40 bg-primary/10 p-12 text-center transition-colors duration-300 hover:border-primary hover:bg-primary/20",
        isDragActive && "border-primary bg-primary/20"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3 text-primary">
        <UploadCloud
          className={cn(
            "h-10 w-10 transition-transform duration-300",
            isDragActive && "scale-110"
          )}
        />
        <p className="text-lg font-medium text-foreground">
          {isDragActive
            ? "Drop the files here!"
            : "Drag & drop PDFs here, or click to select"}
        </p>
        <p className="text-sm text-muted-foreground">
          All processing is done on your device for privacy.
        </p>
      </div>
    </div>
  );
}
