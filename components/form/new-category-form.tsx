"use client";

import { useRef, useState } from "react";

import { CategorySchema } from "@/schemas";
import { CreateNewCategory } from "@/actions/tasks/create-new-category";
import { usePathname } from "next/navigation";
import MdiCancelBold from "~iconify/mdi/cancel-bold";
import MaterialSymbolsAddRounded from "~iconify/material-symbols/add-rounded";
import { useNewCategoryColumnButtonForm } from "@/lib/stores";

interface Props {
  showCancelButton?: boolean;
}

export default function NewCategoryForm({ showCancelButton }: Props) {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const form = useRef(null);
  const pathname = usePathname();
  const pipelineID = pathname.split("/")[3];

  // @ts-ignore
  const hideForm = useNewCategoryColumnButtonForm((state) => state.hideForm);

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

    const validatedFields = CategorySchema.safeParse(values);

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
      const data = await CreateNewCategory(validatedFields.data, pipelineID);
      setError(data?.error || "");
      setSuccess(data?.success || "");

      // Reset form on success
      if (data?.success) {
        (form.current as unknown as HTMLFormElement).reset();
        window.location.reload();
      }
    } catch (err) {
      console.error("Something went wrong:", err);
      setError("Failed to create category.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 bg-white w-full min-w-xs"
      onSubmit={handleSubmit}
      ref={form}
    >
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium">
            Category Name
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
            <p className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {success}
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Submit Button */}
        <button
          className="btn rounded-md bg-neutral-900 px-4 py-2 text-white transition-colors btn-neutral hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create New Category"}
        </button>
        {showCancelButton && (
          <button
            type="button"
            className="rounded-md p-2 transition-all duration-150 hover:cursor-pointer hover:bg-neutral-100"
            onClick={hideForm}
          >
            <MdiCancelBold width={21} height={21} />
          </button>
        )}
      </div>
    </form>
  );
}
