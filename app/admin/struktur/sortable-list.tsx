"use client";

import { useEffect, useId, useState, useTransition } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Item = { id: string; content: React.ReactNode };

type Props = {
  items: Item[];
  // Dipanggil dengan daftar id sesuai urutan baru
  onReorder: (ids: string[]) => Promise<{ error?: string }>;
  className?: string;
  itemClassName?: string;
  // "grid" untuk susunan kotak-kotak (folder), "list" untuk daftar ke bawah
  layout?: "list" | "grid";
  // tampilkan nomor urutan (01, 02, ...)
  numbered?: boolean;
  // true = tampilan biasa tanpa drag (untuk non-admin)
  disabled?: boolean;
};

function GripIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <circle cx="5" cy="3" r="1.3" fill="currentColor" />
      <circle cx="11" cy="3" r="1.3" fill="currentColor" />
      <circle cx="5" cy="8" r="1.3" fill="currentColor" />
      <circle cx="11" cy="8" r="1.3" fill="currentColor" />
      <circle cx="5" cy="13" r="1.3" fill="currentColor" />
      <circle cx="11" cy="13" r="1.3" fill="currentColor" />
    </svg>
  );
}

function NomorUrut({ index, grid }: { index: number; grid: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none font-[family-name:var(--font-display)] text-xs font-extrabold text-[#FBF6E6]/35 ${
        grid ? "absolute right-3 top-2.5" : "shrink-0 pl-1"
      }`}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

function SortableItem({
  item,
  index,
  grid,
  numbered,
  className,
}: {
  item: Item;
  index: number;
  grid: boolean;
  numbered: boolean;
  className?: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`${className ?? ""} ${
        isDragging ? "relative z-10 opacity-70 shadow-2xl" : ""
      }`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label="Tarik untuk mengubah urutan"
        className={`cursor-grab touch-none rounded-lg p-2 text-[#FBF6E6]/30 transition-colors hover:text-[#FFD21F] active:cursor-grabbing ${
          grid ? "absolute left-1 top-1 z-10" : "shrink-0"
        }`}
      >
        <GripIcon />
      </button>

      {numbered && <NomorUrut index={index} grid={grid} />}

      <div className="min-w-0 flex-1">{item.content}</div>
    </div>
  );
}

export function SortableList({
  items,
  onReorder,
  className,
  itemClassName,
  layout = "list",
  numbered = false,
  disabled = false,
}: Props) {
  const [order, setOrder] = useState(items);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const dndId = useId();
  const grid = layout === "grid";

  // Ikuti data terbaru dari server (setelah tambah/hapus/simpan)
  useEffect(() => {
    setOrder(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = order.findIndex((item) => item.id === active.id);
    const to = order.findIndex((item) => item.id === over.id);
    if (from < 0 || to < 0) return;

    const next = arrayMove(order, from, to);
    setOrder(next);
    setError(null);

    startTransition(async () => {
      const result = await onReorder(next.map((item) => item.id));
      if (result?.error) {
        setError(result.error);
        setOrder(items);
      }
    });
  }

  if (disabled) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={item.id} className={itemClassName}>
            {numbered && <NomorUrut index={index} grid={grid} />}
            <div className="min-w-0 flex-1">{item.content}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={order.map((item) => item.id)}
          strategy={grid ? rectSortingStrategy : verticalListSortingStrategy}
        >
          <div className={className}>
            {order.map((item, index) => (
              <SortableItem
                key={item.id}
                item={item}
                index={index}
                grid={grid}
                numbered={numbered}
                className={itemClassName}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-300">
          Gagal menyimpan urutan: {error}
        </p>
      )}
    </>
  );
}