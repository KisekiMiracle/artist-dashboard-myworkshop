"use client";

import { useRef, useState } from "react";

import { PipelineSchema } from "@/schemas";
import { CreateNewPipeline } from "@/actions/tasks/create-new-pipeline";

export default function NewPipelineForm() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    };

    const validatedFields = PipelineSchema.safeParse(values);

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
      const data = await CreateNewPipeline(validatedFields.data);
      setError(data?.error || "");
      setSuccess(data?.success || "");

      // Reset form on success
      if (data?.success) {
        (form.current as unknown as HTMLFormElement).reset();
      }
    } catch (err) {
      console.error("Something went wrong:", err);
      setError("Failed to create pipeline.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 w-86"
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
        {isPending ? "Creating..." : "Create New Pipeline"}
      </button>
    </form>
  );
}
