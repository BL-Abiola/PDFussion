"use client";

import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, FileType2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";
import { FileItemType } from "./pdf-fusion-client";
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={cn(
        "flex items-center gap-4 bg-muted/30 p-3 border-y",
        isDragging ? "shadow-md bg-accent" : "hover:bg-muted"
      )}
    >
      <button {...attributes} {...listeners} className="cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground">
        <GripVertical size={18} />
      </button>
      <FileType2 className="h-6 w-6 text-primary flex-shrink-0" />
      <div className="flex-1 truncate px-4 md:px-6">
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
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-full"
        onClick={() => onDelete(fileItem.id)}
        aria-label="Delete file"
      >
        <Trash2 size={16} />
      </Button>
    </motion.li>
  );
}
