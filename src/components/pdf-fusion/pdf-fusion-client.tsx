"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { AnimatePresence, motion } from "framer-motion";
import { FileDropzone } from "./file-dropzone";
import { FileQueue } from "./file-queue";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Files, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FileItemType } from "./types";

type PdfFusionClientProps = {
  onMergeComplete: (mergedFile: { name: string; url: string }) => void;
};

let fileCounter = 0;

export function PdfFusionClient({ onMergeComplete }: PdfFusionClientProps) {
  const [files, setFiles] = useState<FileItemType[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: `file-${fileCounter++}`,
      file,
      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setFiles((prevFiles) => {
      const fileToDelete = prevFiles.find(f => f.id === id);
      if (fileToDelete?.previewUrl) {
        URL.revokeObjectURL(fileToDelete.previewUrl);
      }
      return prevFiles.filter((file) => file.id !== id);
    });
  }, []);

  const handleReorder = useCallback((reorderedFiles: FileItemType[]) => {
    setFiles(reorderedFiles);
  }, []);

  const clearAndRevokeUrls = (filesToClear: FileItemType[]) => {
     filesToClear.forEach(item => {
      if (item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });
    setFiles([]);
  }

  const handleClearAll = () => {
    clearAndRevokeUrls(files);
  };

  const reset = () => {
    clearAndRevokeUrls(files);
    setIsMerging(false);
    setProgress(0);
  };

  const handleMerge = async () => {
    if (files.length < 1) {
      toast({
        variant: "destructive",
        title: "No files",
        description: "Please upload at least one PDF or image file.",
      });
      return;
    }

    setIsMerging(true);
    setProgress(0);

    const filename = `merged-${Date.now()}.pdf`;

    try {
      const mergedPdf = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const file = files[i].file;
        const arrayBuffer = await file.arrayBuffer();

        if (file.type === "application/pdf") {
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(
            pdf,
            pdf.getPageIndices()
          );
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } else if (file.type.startsWith("image/")) {
          let image;
          if (file.type === "image/jpeg") {
            image = await mergedPdf.embedJpg(arrayBuffer);
          } else if (file.type === "image/png") {
            image = await mergedPdf.embedPng(arrayBuffer);
          } else {
            toast({
              variant: "destructive",
              title: "Unsupported Image",
              description: `Cannot merge '${file.name}'. Only JPG and PNG images are supported.`,
            });
            continue;
          }

          if (image) {
            const page = mergedPdf.addPage();
            const pageDims = page.getSize();
            const imageDims = image;
            
            const scale = Math.min(pageDims.width / imageDims.width, pageDims.height / imageDims.height);
            const scaledWidth = imageDims.width * scale;
            const scaledHeight = imageDims.height * scale;

            page.drawImage(image, {
              x: page.getWidth() / 2 - scaledWidth / 2,
              y: page.getHeight() / 2 - scaledHeight / 2,
              width: scaledWidth,
              height: scaledHeight,
            });
          }
        }
        setProgress(((i + 1) / files.length) * 100);
      }

      if (mergedPdf.getPageCount() === 0) {
        toast({
            variant: "destructive",
            title: "No compatible files",
            description: "No compatible files were found to merge. Please use PDF, JPG, or PNG files.",
        });
        setIsMerging(false);
        return;
      }

      const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: true });
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      onMergeComplete({ name: filename, url });

      toast({
        variant: "success",
        title: "Merge successful!",
        description: `${filename} has been added to your library.`,
      });

      reset();
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description:
          "Could not merge the files. Please ensure they are valid and not corrupted.",
      });
    } finally {
      setIsMerging(false);
    }
  };
  
  const hasFiles = files.length > 0;

  return (
    <div className="w-full rounded-2xl border bg-card/60 text-card-foreground shadow-2xl backdrop-blur-lg">
      <div className="p-6">
        <FileDropzone onDrop={handleDrop} hasFiles={hasFiles} />
      </div>

      <AnimatePresence>
        {hasFiles && (
          <motion.div
            key="files-present"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="px-6 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Your Files</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag to reorder files.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClearAll} className="h-8">
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
            <ScrollArea className="flex-grow">
              <div className="px-6 pb-6">
                <FileQueue
                  files={files}
                  onReorder={handleReorder}
                  onDelete={handleDelete}
                />
              </div>
            </ScrollArea>
            <div className="border-t bg-card/40 rounded-b-2xl p-6 text-center mt-auto">
              {isMerging ? (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full space-y-3"
                  >
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">
                      Processing your files...
                    </p>
                    <Progress value={progress} className="w-full h-2" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(progress)}% complete
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <h3 className="text-md font-medium text-foreground">
                      Ready to go?
                    </h3>
                    <div className="flex justify-center">
                      <Button
                        size="lg"
                        onClick={handleMerge}
                        className="shadow-lg w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Files size={20} />
                        <span className="ml-2">
                          {`Merge ${files.length} Item${
                            files.length > 1 ? "s" : ""
                          }`}
                        </span>
                      </Button>
                    </div>
                  </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
