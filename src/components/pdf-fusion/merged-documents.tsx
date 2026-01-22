"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileDown, Trash2, Library } from "lucide-react";
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
      <div className="w-full min-h-[200px] rounded-xl border bg-card text-card-foreground shadow-lg flex flex-col items-center justify-center text-center p-8">
        <Library className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold text-foreground">Your Library is Empty</h3>
        <p className="text-muted-foreground mt-2 max-w-xs">
          After you merge some PDFs, they will appear here for you to download or manage.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border bg-card text-card-foreground shadow-lg flex flex-col">
      <div className="p-4 sm:px-6 border-b">
        <h2 className="text-lg font-semibold text-foreground">Your Merged Documents</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Download or delete your previously merged files from this session.
        </p>
      </div>
      <ScrollArea className="flex-1" style={{ maxHeight: "65vh" }}>
        <ul className="p-4 sm:p-6 space-y-3">
          <AnimatePresence>
            {documents.map((doc) => (
              <MergedDocumentItem key={doc.id} document={doc} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </ul>
      </ScrollArea>
    </div>
  );
}

function MergedDocumentItem({ document, onDelete }: { document: MergedDocument, onDelete: (id: string) => void }) {
    const variants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, x: 100, transition: { duration: 0.3 } },
    };

    return (
        <motion.li
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className="flex items-center w-full bg-secondary/30 p-3 sm:p-4 border rounded-xl shadow-sm"
        >
            <div className="flex-1 truncate min-w-0 pr-2">
                <p className="truncate font-medium text-foreground">{document.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                    Created: {format(document.timestamp, "MMM d, yyyy 'at' h:mm a")}
                </p>
            </div>
            <div className="flex items-center flex-shrink-0 ml-2 space-x-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary hover:bg-primary/10 h-9 w-9 rounded-full"
                    asChild
                >
                    <a href={document.url} download={document.name} aria-label={`Download ${document.name}`}>
                        <FileDown size={18} />
                    </a>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 rounded-full"
                    onClick={() => onDelete(document.id)}
                    aria-label={`Delete ${document.name}`}
                >
                    <Trash2 size={18} />
                </Button>
            </div>
        </motion.li>
    );
}
