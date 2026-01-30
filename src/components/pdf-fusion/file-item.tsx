"use client";

import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";
import type { FileItemType } from "./types";
import { cn } from "@/lib/utils";

type FileItemProps = {
  fileItem: FileItemType;
  onDelete: (id: string) => void;
};

export function FileItem({ fileItem, onDelete }: FileItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fileItem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
  };

  const variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      variants={variants}
      layout
      {...attributes}
      {...listeners}
      className={cn(
        "relative group/item flex flex-col items-center justify-center rounded-2xl border bg-card p-3 text-center shadow-sm transition-all aspect-square cursor-grab",
        isDragging ? "z-10 scale-105 shadow-2xl bg-accent ring-2 ring-primary" : "hover:shadow-lg hover:-translate-y-1"
      )}
    >
      <FileText className="h-1/3 w-1/3 text-primary/80 mb-2" />

      <div className="flex-1 min-w-0 w-full flex flex-col items-center justify-center">
        <p className="w-full truncate text-sm font-medium text-foreground px-1">
          {fileItem.file.name}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatBytes(fileItem.file.size)}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-7 w-7 rounded-full text-muted-foreground/70 opacity-0 group-hover/item:opacity-100 hover:bg-destructive/10 hover:text-destructive z-20 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation(); // Prevent drag from starting when clicking delete
          onDelete(fileItem.id);
        }}
        aria-label="Delete file"
      >
        <Trash2 size={16} />
      </Button>
    </motion.div>
  );
}
