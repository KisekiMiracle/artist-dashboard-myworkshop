"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Task, useTaskStore } from "@/lib/stores";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

export default function DndProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const tasks = useTaskStore((state) => state.tasks) as Array<Task>;
  const setTasks = useTaskStore((state) => state.updateTasks);
  const updateDraggedTask = useTaskStore((state) => state.updateTaskCategory);

  const getTaskPosition = (id: string) =>
    tasks.findIndex((task: Task) => task.id === id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: { active: any; over: any }) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    const originalPos = getTaskPosition(active.id);
    const newPos = getTaskPosition(over.id);

    const newTaskArray = arrayMove(tasks, originalPos, newPos);

    console.log(active, over, newTaskArray);

    // updateDraggedTask(active.id, over.id);
    setTasks(newTaskArray);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragOver = (event: { active: any; over: any }) => {
    const { active, over } = event;
    console.log(active, over);

    if (active.id === over.id) return;

    const originalPos = getTaskPosition(active.id);
    const newPos = getTaskPosition(over.id);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      {children}
    </DndContext>
  );
}
