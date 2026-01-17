"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import { FileDropzone } from "./file-dropzone";
import { FileQueue } from "./file-queue";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleDrop = useCallback((acceptedFiles: File[]) => {
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
      toast({
        variant: "destructive",
        title: "Not enough files",
        description: "Please upload at least two PDF files to merge.",
      });
      return;
    }
    setIsMerging(true);
    setProgress(0);
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
      toast({
        title: "Merge successful!",
        description: "Your PDF is ready for download.",
      });
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not merge the PDFs. Please ensure they are valid files.",
      });
    } finally {
      setIsMerging(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-3xl mx-auto rounded-xl border bg-card text-card-foreground shadow-lg overflow-hidden"
    >
      <div className="p-4 md:p-6 space-y-4">
        <FileDropzone onDrop={handleDrop} />
      </div>
      
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h2 className="text-lg font-semibold text-foreground px-4 md:px-6">File Queue</h2>
            <ScrollArea className="w-full max-h-[40vh] border-y">
              <FileQueue files={files} onReorder={handleReorder} onDelete={handleDelete} />
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
          {isMerging && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 md:px-6 pb-4"
            >
              <div className="w-full space-y-2 pt-4">
                <p className="text-sm text-center text-muted-foreground">Merging... {Math.round(progress)}%</p>
                <Progress value={progress} className="w-full h-2" />
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {(files.length > 0) && (
        <div className="p-4 bg-muted/30 flex justify-center">
          <AnimatePresence mode="wait">
            {mergedPdfUrl ? (
              <motion.a
                key="download"
                href={mergedPdfUrl}
                download="merged.pdf"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(buttonVariants({ size: 'lg', variant: 'success' }), "gap-2 shadow-md")}
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
                  className="shadow-md"
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
      )}
    </motion.div>
  );
}
