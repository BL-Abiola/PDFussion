"use client";

import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";
import { FileItemType } from "./pdf-fusion-client";
import { cn } from "@/lib/utils";

type FileItemProps = {
  fileItem: FileItemType;
  onDelete: (id: string) => void;
  isMergeDone: boolean;
};

export function FileItem({ fileItem, onDelete, isMergeDone }: FileItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fileItem.id, disabled: isMergeDone });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: 200, transition: { duration: 0.3 } },
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number; }; }) => {
    if (info.offset.x > 100) {
      onDelete(fileItem.id);
    }
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
        "flex items-center gap-4 bg-background/50 p-3 border rounded-lg transition-all hover:bg-accent hover:border-primary/50",
        isDragging && "bg-accent ring-2 ring-primary"
      )}
      drag={isMergeDone ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ right: 0.5, left: 0 }}
      onDragEnd={isMergeDone ? handleDragEnd : undefined}
    >
      <button {...attributes} {...listeners} className="cursor-grab touch-none p-2 text-muted-foreground hover:text-foreground" disabled={isMergeDone}>
        <GripVertical size={20} />
      </button>
      <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-md">
        <FileText className="h-6 w-6" />
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
        size="icon"
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 rounded-full flex-shrink-0"
        onClick={() => onDelete(fileItem.id)}
        aria-label="Delete file"
      >
        <Trash2 size={18} />
      </Button>
    </motion.li>
  );
}
