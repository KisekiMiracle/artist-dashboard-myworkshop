import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/lib/stores";
import { useSortable } from "@dnd-kit/sortable";

export default function DndCard({ task }: { task: Task }) {
  const id = task.id;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="active:z-9 active:isolate bg-white shadow-sm p-6 rounded-2xl hover:cursor-grab active:cursor-grabbing"
    >
      {task.title}
    </div>
  );
}
