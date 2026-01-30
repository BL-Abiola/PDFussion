"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileDown, Trash2, Library, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import type { MergedDocument } from "@/app/page";

type MergedDocumentsProps = {
  documents: MergedDocument[];
  onDelete: (id: string) => void;
};

export function MergedDocuments({ documents, onDelete }: MergedDocumentsProps) {
  if (documents.length === 0) {
    return (
      <div className="w-full min-h-[200px] rounded-2xl border bg-card/60 text-card-foreground shadow-2xl backdrop-blur-lg flex flex-col items-center justify-center text-center p-8">
        <Library className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-semibold text-foreground">Your Library is Empty</h3>
        <p className="text-muted-foreground mt-2 max-w-xs">
          After you merge some PDFs, they will appear here for you to download or manage.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border bg-card/60 text-card-foreground shadow-2xl backdrop-blur-lg flex flex-col">
      <div className="p-4 sm:px-6 border-b">
        <h2 className="text-lg font-semibold text-foreground">Your Merged Documents</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Download or delete your merged files from this session.
        </p>
      </div>
      <ScrollArea className="flex-1" style={{ maxHeight: "65vh" }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 sm:p-6">
          <AnimatePresence>
            {documents.map((doc) => (
              <MergedDocumentItem key={doc.id} document={doc} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}

function MergedDocumentItem({ document, onDelete }: { document: MergedDocument, onDelete: (id: string) => void }) {
    const variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
    };

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className="relative group/item flex flex-col items-center justify-center rounded-2xl border bg-card p-3 text-center shadow-sm transition-all aspect-square hover:shadow-lg hover:-translate-y-1"
        >
            <FileCheck2 className="h-1/3 w-1/3 text-success mb-2" />

            <div className="flex-1 min-w-0 w-full flex flex-col items-center justify-center">
                <p className="w-full truncate text-sm font-medium text-foreground px-1">
                    {document.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    {format(document.timestamp, "MMM d, h:mm a")}
                </p>
            </div>

            <div className="absolute bottom-3 left-2 right-2 flex items-center justify-center space-x-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                 <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-background/50 backdrop-blur-sm shadow-md"
                    asChild
                >
                    <a href={document.url} download={document.name} aria-label={`Download ${document.name}`}>
                        <FileDown size={16} />
                    </a>
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-background/50 backdrop-blur-sm shadow-md hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                    onClick={() => onDelete(document.id)}
                    aria-label={`Delete ${document.name}`}
                >
                    <Trash2 size={16} />
                </Button>
            </div>
        </motion.div>
    );
}