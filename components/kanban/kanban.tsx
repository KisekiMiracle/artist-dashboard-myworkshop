"use client";

import * as React from "react";

import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanItem,
  KanbanOverlay,
} from "@/components/ui/kanban";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import NewTaskButton from "./new-task-button";
import { QueryUserTasks } from "@/actions/tasks/query-user-pipeline-tasks";
import { Task } from "@/lib/stores";
import { usePathname } from "next/navigation";

const COLUMN_TITLES: Record<string, string> = {
  category_1: "Untitled Category",
  category_2: "Another Untitled Category",
  review: "Review",
  done: "Done",
};

export function KanbanViewBoard() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(true);
  const [columns, setColumns] = React.useState<Record<string, Task[]>>({});

  React.useEffect(() => {
    const updateColumns = async () => {
      setIsLoading(true);
      const data = await QueryUserTasks();
      setColumns(data as Record<string, Task[]>);
      setIsLoading(false);
    };
    updateColumns();
  }, []);

  const handleColumnChange = (
    value: React.SetStateAction<Record<string, Task[]>>
  ) => {
    setColumns(value);
    console.log(value);
  };

  if (isLoading)
    return (
      <div className="flex items-center gap-1 font-bold text-xl">
        <span>Loading...</span>
      </div>
    );

  return (
    <Kanban
      value={columns}
      onValueChange={handleColumnChange}
      getItemValue={(item) => item.id}
    >
      <KanbanBoard className="grid grid-cols-3 auto-rows-fr">
        {Object.entries(columns).map(([columnValue, tasks]) => (
          <TaskColumn key={columnValue} value={columnValue} tasks={tasks} />
        ))}
      </KanbanBoard>
      <KanbanOverlay>
        {({ value, variant }) => {
          if (variant === "column") {
            const tasks = columns[value] ?? [];

            return <TaskColumn value={value} tasks={tasks} />;
          }

          const task = Object.values(columns)
            .flat()
            .find((task) => task.id === value);

          if (!task) return null;

          return <TaskCard task={task} />;
        }}
      </KanbanOverlay>
    </Kanban>
  );
}

interface TaskCardProps
  extends Omit<React.ComponentProps<typeof KanbanItem>, "value"> {
  task: Task;
}

function TaskCard({ task, ...props }: TaskCardProps) {
  return (
    <KanbanItem key={task.id} value={task.id} asChild {...props}>
      <div className="bg-card shadow-xs p-3 border rounded-md">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center gap-2">
            <span className="font-medium text-neutral-900! text-sm line-clamp-1">
              {task.title}
            </span>
            <div>
              <Badge
                variant={
                  task.priority === "high"
                    ? "destructive"
                    : task.priority === "medium"
                    ? "default"
                    : "secondary"
                }
                className="px-1.5 rounded-sm h-5 text-[11px] capitalize pointer-events-none"
              >
                {task.priority}
              </Badge>
            </div>
          </div>
          <div className="flex justify-between items-center text-muted-foreground text-xs">
            {/* {task.assignee && (
              <div className="flex items-center gap-1">
                <div className="bg-primary/20 rounded-full size-2" />
                <span className="line-clamp-1">{task.assignee}</span>
              </div>
            )} */}
            {task.dueDate && (
              <p className="flex items-center gap-1">
                <span className="font-bold">Due to:</span>
                <time className="tabular-nums text-[10px]">
                  {task.dueDate.toString()}
                </time>
              </p>
            )}
          </div>
          <div className="flex justify-between w-full">
            {/* <button className="bg-pink-600 px-4 py-1 rounded-sm w-fit text-white text-xs hover:cursor-pointer">
              Edit
            </button> */}
          </div>
        </div>
      </div>
    </KanbanItem>
  );
}

interface TaskColumnProps
  extends Omit<React.ComponentProps<typeof KanbanColumn>, "children"> {
  tasks: Task[];
}

function TaskColumn({ value, tasks, ...props }: TaskColumnProps) {
  return (
    <KanbanColumn
      value={value}
      {...props}
      className="flex flex-col gap-4 bg-transparent p-0 border-none"
    >
      <div className="flex justify-between items-center bg-neutral-100 p-2 px-3 rounded-md">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-900! text-lg">
            {COLUMN_TITLES[value]}
          </span>
          <Badge variant="secondary" className="rounded-sm pointer-events-none">
            {tasks.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <NewTaskButton />
        </div>
      </div>
      <div className="flex flex-col gap-4 p-0.5">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} asHandle />
        ))}
      </div>
    </KanbanColumn>
  );
}
