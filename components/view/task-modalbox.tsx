"use client";

import { Task, TaskTag } from "@/lib/stores";
import TextField from "../form/form-textfield";
import { useEffect, useRef, useState } from "react";
import { QueryPipelineCategories } from "@/actions/tasks/query-tasks-categories";
import { usePathname } from "next/navigation";
import { TaskSchema } from "@/schemas";
import { NewTaskTagButton, TaskTagObj } from "./tags-manager";
import { UpdateTaskTags } from "@/actions/tasks/update-task-tags";
import QueryTaskById from "@/actions/tasks/query-task-by-id";
import DashiconsText from "~iconify/dashicons/text";
import RichTextEditor from "../ui/rich-texteditor";

interface Props {
  taskID: string;
}

export default function TaskModalboxContents({ taskID }: Props) {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const pathname = usePathname();
  const pipelineID = pathname.split("/")[3];

  const [categories, setCategories] = useState<any>([]);
  const [task, setTask] = useState<Task>({} as Task);
  const [loadingInitialValues, setLoadingInitialValues] =
    useState<boolean>(false);

  const updateCategories = async () => {
    const data = await QueryPipelineCategories(pipelineID);
    setCategories(data as string[]);
  };
  const updateTask = async () => {
    const data = await QueryTaskById(taskID);
    setTask(data as Task);
  };

  useEffect(() => {
    updateCategories();
    updateTask();
    setLoadingInitialValues(true);
  }, []);

  const form = useRef(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    const values = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as string,
      priority: formData.get("priority") as string,
      category: formData.get("category") as string,
      dueDate: new Date(formData.get("dueDate") as string),
      pipelineId: pipelineID,
    };

    const validatedFields = TaskSchema.safeParse(values);

    if (!validatedFields.success) {
      const errors: Record<string, string> = {};
      validatedFields.error.issues.forEach((err) => {
        if (err.path[0]) {
          // Creates a new Key-Value pair
          errors[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(errors);
      setIsPending(false);
      return;
    }

    // try {
    //   const data = await CreateNewTask(validatedFields.data);
    //   setError(data?.error || "");
    //   setSuccess(data?.success || "");
    //
    //   // Reset form on success
    //   if (data?.success) {
    //     (form.current as unknown as HTMLFormElement).reset();
    //     window.location.reload();
    //   }
    // } catch (err) {
    //   console.error("Something went wrong:", err);
    //   setError("Failed to create task");
    // }
    // finally {
    //   setIsPending(false);
    // }
    //
    alert("This form was submitted. Should update this task.");
  };

  return (
    <div className="modal-box w-11/12 max-w-4xl">
      <form ref={form} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          field="title"
          fieldErrors={fieldErrors}
          isPending={false}
          defaultValue={task.title}
          className={
            "border-0 text-4xl font-bold focus:outline-none focus:ring-0 border-b-2 px-0 border-b-transparent  focus:border-b-blue-500 rounded-none"
          }
        />
        <div className="-mt-2 flex flex-wrap items-center gap-4">
          {!loadingInitialValues && <p>Loading...</p>}
          {loadingInitialValues && task.tags && task.tags.length > 0 ? (
            task.tags.map((tag) => (
              <TaskTagObj
                key={tag.id}
                id={tag.id}
                label={tag.name}
                icon={tag.icon}
                color={tag.color}
                deleteFromTask={async () => {
                  await UpdateTaskTags({
                    taskId: task.id,
                    tagId: tag.id,
                    pipelineID: pipelineID,
                    operation: "remove",
                  });
                  updateTask();
                }}
              />
            ))
          ) : (
            <span>No tags found</span>
          )}
          <NewTaskTagButton
            callback={(event) => {
              const hasTag = task.tags?.some(
                (tag) => tag.id === event.target?.selectedOptions[0].id,
              );

              const updateTaskTags = async () => {
                if (!hasTag)
                  await UpdateTaskTags({
                    taskId: task.id,
                    tagId: event.target?.selectedOptions[0].id,
                    pipelineID: pipelineID,
                    operation: "add",
                  });
                updateTask();
              };

              updateTaskTags();
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <DashiconsText width={21} height={21} />
            <h2 className="text-sm font-semibold">Description</h2>
          </div>
          <RichTextEditor />
        </div>
        <button type="submit" className="btn w-fit btn-neutral">
          Update
        </button>
      </form>
    </div>
  );
}
