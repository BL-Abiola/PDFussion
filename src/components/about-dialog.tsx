"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function AboutDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">About PDFusion</DialogTitle>
          <DialogDescription>
            A simple PDF and image merger.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
            <div className="space-y-1">
                <h3 className="font-semibold text-foreground">Purpose</h3>
                <p className="text-sm text-muted-foreground">
                A simple app that helps you merge PDFs and images securely on your device.
                </p>
            </div>
            <div className="space-y-1">
                <h3 className="font-semibold text-foreground">Developer</h3>
                <p className="text-sm text-muted-foreground">
                BL_Abiola
                </p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Contact</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <a href="https://x.com/BL_Abiola" target="_blank" rel="noopener noreferrer">
                            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 fill-current"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                            X
                        </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <a href="mailto:abiolalabs29@gmail.com">
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                        </a>
                    </Button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
