"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AboutDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About PDFusion</DialogTitle>
          <DialogDescription>
            <div className="space-y-4 py-4 text-sm text-foreground">
                <p>
                    PDFusion is a powerful and easy-to-use tool to merge your PDF files seamlessly.
                </p>
                <p>
                    All processing is done securely in your browser. No files are ever sent to a server.
                </p>
                <p className="font-semibold">Version 1.0.0</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
