"use client";

import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, FileText } from "lucide-react";
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
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.2 } },
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      variants={variants}
      layout
      className={cn(
        "flex items-center w-full bg-background border rounded-lg p-3",
        isDragging ? "opacity-75 shadow-lg" : ""
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground flex-shrink-0"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </div>

      <div className="flex-shrink-0 ml-2">
        <FileText className="h-6 w-6 text-primary/80" />
      </div>
      
      <div className="flex-1 truncate min-w-0 mx-3">
        <p className="truncate text-sm font-medium text-foreground">
          {fileItem.file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatBytes(fileItem.file.size)}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-full flex-shrink-0"
        onClick={() => onDelete(fileItem.id)}
        aria-label="Delete file"
      >
        <Trash2 size={16} />
      </Button>
    </motion.li>
  );
}
