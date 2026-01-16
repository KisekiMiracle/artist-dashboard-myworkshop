"use client";

import { useEffect, useRef, useState } from "react";

import { CreateNewTask } from "@/actions/tasks/create-new-task";
import { TaskSchema } from "@/schemas";
import { usePathname } from "next/navigation";
import { QueryPipelineCategories } from "@/actions/tasks/query-tasks-categories";

export default function NewTaskForm() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const pathname = usePathname();
  const pipelineID = pathname.split("/")[3];

  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    const updateCategories = async () => {
      const data = await QueryPipelineCategories(pipelineID);
      setCategories(data as string[]);
    };
    updateCategories();
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

    try {
      const data = await CreateNewTask(validatedFields.data);
      setError(data?.error || "");
      setSuccess(data?.success || "");

      // Reset form on success
      if (data?.success) {
        (form.current as unknown as HTMLFormElement).reset();
        window.location.reload();
      }
    } catch (err) {
      console.error("Something went wrong:", err);
      setError("Failed to create task");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={handleSubmit}
      ref={form}
    >
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="font-medium text-sm">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-1 transition-all duration-200 ${
              fieldErrors.title
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
            }`}
            disabled={isPending}
          />
          {fieldErrors.title && (
            <p className="mt-1 text-red-600 text-xs">{fieldErrors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="font-medium text-sm">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-1 transition-all duration-200 ${
              fieldErrors.description
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
            }`}
            disabled={isPending}
          />
          {fieldErrors.description && (
            <p className="mt-1 text-red-600 text-xs">
              {fieldErrors.description}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <label htmlFor="status" className="font-medium text-sm">
            Status
          </label>
          <select
            id="status"
            name="status"
            className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-1 transition-all duration-200 ${
              fieldErrors.status
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
            }`}
            disabled={isPending}
            defaultValue="todo"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          {fieldErrors.status && (
            <p className="mt-1 text-red-600 text-xs">{fieldErrors.status}</p>
          )}
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-2">
          <label htmlFor="priority" className="font-medium text-sm">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-1 transition-all duration-200 ${
              fieldErrors.priority
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
            }`}
            disabled={isPending}
            defaultValue="low"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {fieldErrors.priority && (
            <p className="mt-1 text-red-600 text-xs">{fieldErrors.priority}</p>
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="font-medium text-sm">
            Category
          </label>
          <select
            id="category"
            name="category"
            className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-1 transition-all duration-200 ${
              fieldErrors.priority
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
            }`}
            disabled={isPending}
            defaultValue="low"
          >
            {categories &&
              categories.map((category: any) => {
                return (
                  <option
                    key={category.category + "_" + Math.random()}
                    value={category.category}
                  >
                    {category.category}
                  </option>
                );
              })}
          </select>
          {fieldErrors.category && (
            <p className="mt-1 text-red-600 text-xs">{fieldErrors.category}</p>
          )}
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-2">
          <label htmlFor="dueDate" className="font-medium text-sm">
            Due Date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-1 transition-all duration-200 ${
              fieldErrors.dueDate
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
            }`}
            disabled={isPending}
            defaultValue={new Date().toISOString().split("T")[0]}
          />
          {fieldErrors.dueDate && (
            <p className="mt-1 text-red-600 text-xs">{fieldErrors.dueDate}</p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 px-4 py-3 border border-red-200 rounded-md text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 px-4 py-3 border border-green-200 rounded-md text-green-800 text-sm">
          {success}
        </div>
      )}

      {/* Submit Button */}
      <button
        className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 px-4 py-2 rounded-md text-white transition-colors disabled:cursor-not-allowed btn btn-neutral"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Creating..." : "Create New Task"}
      </button>
    </form>
  );
}
