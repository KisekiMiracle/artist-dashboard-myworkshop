import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task, useTaskStore } from "@/lib/stores";

import DndCard from "./dnd-card";

interface Props {
  category: string;
}
export default function DndColumn({ category }: Props) {
  const tasks = useTaskStore((state) => state.tasks) as Array<Task>;

  return (
    <div className="flex flex-col justify-start gap-2 min-w-36 h-full min-h-12">
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        {tasks
          .filter((task) => task.category === category)
          .map((task) => (
            <DndCard
              task={task}
              // eslint-disable-next-line react-hooks/purity
              key={`task-${task.id}-${Math.random().toFixed(2)}`}
            />
          ))}
      </SortableContext>
    </div>
  );
}
