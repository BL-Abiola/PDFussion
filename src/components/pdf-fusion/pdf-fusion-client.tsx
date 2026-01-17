"use client";

import { useState, useCallback, useMemo } from "react";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import { FileDropzone } from "./file-dropzone";
import { FileQueue } from "./file-queue";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type FileItemType = {
  id: string;
  file: File;
};

let fileCounter = 0;

export function PdfFusionClient() {
  const [files, setFiles] = useState<FileItemType[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    setMergedPdfUrl(null);
    const newFiles = acceptedFiles.map((file) => ({
      id: `file-${fileCounter++}`,
      file,
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  }, []);

  const handleReorder = useCallback((reorderedFiles: FileItemType[]) => {
    setFiles(reorderedFiles);
  }, []);

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please upload at least two PDF files to merge.");
      return;
    }
    setIsMerging(true);
    setProgress(0);
    setError(null);
    setMergedPdfUrl(null);

    try {
      const mergedPdf = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const file = files[i].file;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        setProgress(((i + 1) / files.length) * 100);
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (e) {
      console.error(e);
      setError("An error occurred while merging the PDFs. Please ensure they are valid files.");
    } finally {
      setIsMerging(false);
    }
  };
  
  const MemoizedFileQueue = useMemo(() => <FileQueue files={files} onReorder={handleReorder} onDelete={handleDelete} />, [files, handleReorder, handleDelete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-3xl mx-auto rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden"
    >
      <div className="p-6 md:p-8 space-y-6">
        <FileDropzone onDrop={handleDrop} />
        
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h2 className="text-lg font-semibold text-foreground mb-3">File Queue</h2>
              <ScrollArea className="h-full max-h-[40vh] w-full pr-3">
                {MemoizedFileQueue}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
          {(files.length > 0 || error) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 md:px-8 pb-6"
            >
              {error && (
                <div className="mb-4 flex items-center gap-2 text-destructive p-3 bg-destructive/10 rounded-lg">
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
              {isMerging && (
                  <div className="w-full space-y-2">
                    <p className="text-sm text-center text-muted-foreground">Merging... {Math.round(progress)}%</p>
                    <Progress value={progress} className="w-full h-2" />
                  </div>
              )}
            </motion.div>
          )}
      </AnimatePresence>

      {(files.length > 0) && (
        <>
          <Separator />
          <div className="p-6 bg-muted/50 flex justify-center">
            <AnimatePresence mode="wait">
              {mergedPdfUrl ? (
                <motion.a
                  key="download"
                  href={mergedPdfUrl}
                  download="merged.pdf"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={cn(buttonVariants({ size: 'lg', variant: 'success' }), "gap-2")}
                >
                  <CheckCircle size={20} />
                  <span>Download PDF</span>
                </motion.a>
              ) : (
                <motion.div
                  key="merge"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button
                    size="lg"
                    onClick={handleMerge}
                    disabled={isMerging}
                  >
                    {isMerging ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Download size={20} />
                    )}
                    <span className="ml-2">
                      {isMerging ? "Merging..." : `Merge ${files.length} Files`}
                    </span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.div>
  );
}
