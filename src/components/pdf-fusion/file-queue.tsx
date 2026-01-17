"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import { FileItem } from "./file-item";
import { FileItemType } from "./pdf-fusion-client";

type FileQueueProps = {
  files: FileItemType[];
  onReorder: (files: FileItemType[]) => void;
  onDelete: (id: string) => void;
};

export function FileQueue({ files, onReorder, onDelete }: FileQueueProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex((item) => item.id === active.id);
      const newIndex = files.findIndex((item) => item.id === over.id);
      onReorder(arrayMove(files, oldIndex, newIndex));
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={files.map((f) => f.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          <AnimatePresence>
            {files.map((fileItem) => (
              <FileItem
                key={fileItem.id}
                fileItem={fileItem}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </ul>
      </SortableContext>
    </DndContext>
  );
}
