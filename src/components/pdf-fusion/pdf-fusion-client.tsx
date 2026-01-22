"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import { FileDropzone } from "./file-dropzone";
import { FileQueue } from "./file-queue";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Files, X } from "lucide-react";
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
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  }, []);

  const handleReorder = useCallback((reorderedFiles: FileItemType[]) => {
    setFiles(reorderedFiles);
  }, []);
  
  const handleClearAll = () => {
    setFiles([]);
  };

  const reset = () => {
    setFiles([]);
    setIsMerging(false);
    setProgress(0);
  };

  const handleMerge = async () => {
    if (files.length < 1) {
      toast({
        variant: "destructive",
        title: "No files",
        description: "Please upload at least one PDF file.",
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
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        setProgress(((i + 1) / files.length) * 100);
      }

      const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: true });
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      onMergeComplete({ name: filename, url });

      toast({
        title: "Merge successful!",
        description: `${filename} has been added to your library.`,
      });

      reset();

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
      className="relative w-full mx-auto rounded-xl border bg-card text-card-foreground shadow-lg overflow-hidden flex flex-col max-h-[80vh]"
    >
      <div className="p-6">
        <FileDropzone onDrop={handleDrop} hasFiles={files.length > 0} />
      </div>
      
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-1 flex flex-col min-h-0 border-t"
          >
             <div className="p-4 px-6 border-b bg-card flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Your Files</h2>
                <p className="text-sm text-muted-foreground mt-1">Drag to reorder.</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
            <ScrollArea className="w-full flex-1">
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
              className="px-6 pb-6 pt-2"
            >
              <div className="w-full space-y-2">
                <p className="text-sm text-center text-muted-foreground">Merging... {Math.round(progress)}%</p>
                <Progress value={progress} className="w-full h-2" />
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {(files.length > 0) && (
        <div className="p-6 bg-muted/50 border-t">
            <div className="flex justify-center">
                <Button
                    size="lg"
                    onClick={handleMerge}
                    disabled={isMerging}
                    className="shadow-lg w-full"
                >
                    {isMerging ? (
                    <Loader2 className="animate-spin" size={20} />
                    ) : (
                    <Files size={20} />
                    )}
                    <span className="ml-2">
                    {isMerging ? "Merging..." : `Merge ${files.length} Files`}
                    </span>
                </Button>
            </div>
        </div>
      )}
    </motion.div>
  );
}
