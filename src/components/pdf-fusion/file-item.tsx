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
        isDragging && "opacity-60"
      )}
    >
      <div className={cn(
        "flex items-center w-full bg-card p-2 border rounded-lg transition-all duration-200",
        "hover:border-primary/40 hover:shadow-sm",
        isDragging ? "shadow-lg bg-accent border-primary" : "shadow-sm",
      )}>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none p-1.5 -m-1.5 text-muted-foreground hover:text-foreground"
          aria-label="Drag to reorder"
        >
          <GripVertical size={18} />
        </button>

        <div className="flex-shrink-0 mx-2">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1 truncate min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {fileItem.file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatBytes(fileItem.file.size)}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-full flex-shrink-0 ml-2"
          onClick={() => onDelete(fileItem.id)}
          aria-label="Delete file"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </motion.li>
  );
}
