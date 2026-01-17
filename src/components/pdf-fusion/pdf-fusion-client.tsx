"use client";

import { useState, useCallback, useMemo } from "react";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import { FileDropzone } from "./file-dropzone";
import { FileQueue } from "./file-queue";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
      className="relative w-full max-w-3xl mx-auto bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-2xl shadow-xl overflow-hidden"
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
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">File Queue</h2>
              <ScrollArea className="h-full max-h-[260px] w-full pr-3">
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
                    <p className="text-sm text-center text-primary">Merging... {Math.round(progress)}%</p>
                    <Progress value={progress} className="w-full h-2" />
                  </div>
              )}
            </motion.div>
          )}
      </AnimatePresence>

      {(files.length > 0) && (
        <>
          <Separator className="bg-white/30 dark:bg-slate-700/50"/>
          <div className="p-6 md:p-8 bg-black/5 dark:bg-black/10 flex justify-end">
            <AnimatePresence mode="wait">
              {mergedPdfUrl ? (
                <motion.a
                  key="download"
                  href={mergedPdfUrl}
                  download="merged.pdf"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 bg-emerald-500 text-white hover:bg-emerald-500/90"
                >
                  <CheckCircle size={20} />
                  Download PDF
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
                    className="bg-gradient-to-r from-primary via-violet-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
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
