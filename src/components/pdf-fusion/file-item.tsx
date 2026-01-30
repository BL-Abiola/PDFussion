"use client";

import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, FileText, Image as ImageIcon } from "lucide-react";
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

  const isImage = fileItem.file.type.startsWith("image/");

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      variants={variants}
      layout
      {...attributes}
      {...listeners}
      className={cn(
        "relative group/item flex flex-col items-center justify-end rounded-2xl border bg-card text-center shadow-sm transition-all aspect-square cursor-grab overflow-hidden",
        isDragging ? "z-10 scale-105 shadow-2xl bg-accent ring-2 ring-primary" : "hover:shadow-lg hover:-translate-y-1"
      )}
    >
      {isImage && fileItem.previewUrl ? (
        <img
          src={fileItem.previewUrl}
          alt={fileItem.file.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
            {isImage ? (
                <ImageIcon className="h-1/3 w-1/3 text-primary/80" />
            ) : (
                <FileText className="h-1/3 w-1/3 text-primary/80" />
            )}
        </div>
      )}
      
      <div className="relative z-10 w-full bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2 pt-8 text-white">
        <p className="w-full truncate text-sm font-medium text-white">
          {fileItem.file.name}
        </p>
        <p className="text-xs text-white/80 mt-0.5">
          {formatBytes(fileItem.file.size)}
        </p>
      </div>


      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1.5 right-1.5 h-7 w-7 rounded-full text-white/90 bg-black/40 opacity-0 group-hover/item:opacity-100 hover:bg-destructive/80 hover:text-white z-20 cursor-pointer backdrop-blur-sm"
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
