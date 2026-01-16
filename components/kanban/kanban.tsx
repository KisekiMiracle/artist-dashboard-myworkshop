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
import { UpdateTaskCategory } from "@/actions/tasks/update-tasks";
import TaskColumnNewTaskButton from "./column-new-task-button";
import { RearrangePipelineCategories } from "@/actions/tasks/update-pipeline-categories";
import { cn } from "@/lib/utils";
import { Popover } from "@base-ui/react/popover";
import { ArrowSvg } from "../ui/popover-icons";
import styles from "@/components/ui/index.module.css";
import NewCategoryColumnButton from "./new-category-button";
import TaskModalboxContents from "../view/task-modalbox";

export function KanbanViewBoard() {
  const pathname = usePathname();
  const pipelineID = pathname.split("/")[3];
  const [isLoading, setIsLoading] = React.useState(true);
  const [columns, setColumns] = React.useState<Record<string, Task[]>>({});

  React.useEffect(() => {
    const updateColumns = async () => {
      setIsLoading(true);
      const data = await QueryUserTasks(pathname.split("/")[3]);
      setColumns(data as Record<string, Task[]>);
      setIsLoading(false);
    };
    updateColumns();
  }, []);

  const handleColumnChange = (
    value: React.SetStateAction<Record<string, Task[]>>,
  ) => {
    const newColumns = typeof value === "function" ? value(columns) : value;
    const updateDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setColumns(newColumns);

    Object.entries(newColumns).forEach(([category, tasks]) => {
      tasks.forEach((task, index) => {
        UpdateTaskCategory(
          Number(task.id),
          category,
          index,
          pipelineID,
          updateDate,
        );
      });
    });

    RearrangePipelineCategories(Object.keys(newColumns), pipelineID);
  };

  if (isLoading)
    return (
      <div className="flex items-center gap-1 text-xl font-bold">
        <span>Loading...</span>
      </div>
    );

  if (Object.keys(columns).length === 0) {
    return (
      <div>
        <p>
          No Tasks have been found. Start by creating a category and a Task!
        </p>
      </div>
    );
  }

  return (
    <Kanban
      value={columns}
      onValueChange={handleColumnChange}
      getItemValue={(item) => item.id}
    >
      <KanbanBoard
        className={cn(
          Object.entries(columns).length > 2
            ? "flex gap-4"
            : "grid grid-cols-3",
          "overflow-x-auto pb-8",
        )}
        style={{ maxWidth: "calc(100dvw - 390px)" }}
      >
        {Object.entries(columns).map(([columnValue, tasks]) => (
          <TaskColumn key={columnValue} value={columnValue} tasks={tasks} />
        ))}
        <NewCategoryColumnButton />
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
  const cardRef = React.useRef<HTMLDivElement>(null);
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const onClickHandler = (event: MouseEvent) => {
      event.stopPropagation();
      const isInteractable = () => {
        if (event.target)
          return (
            // @ts-ignore
            event.target.tagName === "INPUT" ||
            // @ts-ignore
            event.target.tagName === "BUTTON"
          );
      };

      if (isInteractable()) return;
      dialogRef.current?.showModal();
    };

    cardRef.current?.addEventListener("click", onClickHandler);

    return () => {
      cardRef.current?.removeEventListener("click", onClickHandler);
    };
  }, []);

  return (
    <>
      <KanbanItem
        className="rounded-md border bg-card p-3 shadow-xs hover:[&>div>div>div]:gap-2 hover:[&>div>div>div>form]:w-fit"
        key={task.id}
        value={task.id}
        asChild
        {...props}
      >
        <div ref={cardRef}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 ">
              <div className="flex items-center">
                {task.status !== "done" && (
                  <form className="w-0 overflow-hidden transition-all duration-150">
                    <label className="flex items-center">
                      <Popover.Root>
                        <Popover.Trigger openOnHover>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-success"
                            defaultChecked={false}
                          />
                        </Popover.Trigger>
                        <Popover.Portal>
                          <Popover.Positioner sideOffset={8}>
                            <Popover.Popup className={styles.Popup}>
                              <Popover.Arrow className={styles.Arrow}>
                                <ArrowSvg />
                              </Popover.Arrow>
                              <Popover.Description
                                className={styles.Description}
                              >
                                Mark this task as Complete
                              </Popover.Description>
                            </Popover.Popup>
                          </Popover.Positioner>
                        </Popover.Portal>
                      </Popover.Root>
                    </label>
                  </form>
                )}
                <span className="line-clamp-1 text-sm font-medium text-neutral-900!">
                  {task.title}
                </span>
              </div>
              <div>
                <Badge
                  variant={
                    task.priority === "high"
                      ? "destructive"
                      : task.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                  className="pointer-events-none h-5 rounded-sm px-1.5 text-[11px] capitalize"
                >
                  {task.priority}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {/* {task.assignee && (
              <div className="flex items-center gap-1">
                <div className="bg-primary/20 rounded-full size-2" />
                <span className="line-clamp-1">{task.assignee}</span>
              </div>
            )} */}
              {task.dueDate && (
                <p className="flex items-center gap-1">
                  <span className="font-bold">Due to:</span>
                  <time className="text-[10px] tabular-nums">
                    {task.dueDate.toString()}
                  </time>
                </p>
              )}
            </div>
            <div className="flex w-full justify-between">
              {/* <button className="bg-pink-600 px-4 py-1 rounded-sm w-fit text-white text-xs hover:cursor-pointer">
              Edit
            </button> */}
            </div>
          </div>
        </div>
      </KanbanItem>
      <dialog className="modal" ref={dialogRef}>
        <TaskModalboxContents taskID={task.id} />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
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
      className="flex h-fit min-w-md flex-col gap-4 border-none bg-transparent px-4"
    >
      <div className="flex items-center justify-between rounded-md bg-neutral-100 px-3 py-1">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-neutral-900!">
            {value}
          </span>
          <Badge variant="secondary" className="pointer-events-none rounded-sm">
            {tasks.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          {/* <NewTaskButton /> */}
          <KanbanColumnHandle asChild>
            <Button variant="ghost" size="icon">
              <GripVertical className="h-4 w-4" />
            </Button>
          </KanbanColumnHandle>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-0.5">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} asHandle />
        ))}
      </div>
      <TaskColumnNewTaskButton />
    </KanbanColumn>
  );
}
