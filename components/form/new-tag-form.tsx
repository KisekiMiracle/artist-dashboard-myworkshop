"use client";

import { useRef, useState } from "react";

import { TagSchema } from "@/schemas";
import { usePathname } from "next/navigation";
import { UpdateTags } from "@/actions/tasks/update-tags";
import { HexColorInput, HexColorPicker } from "react-colorful";
import TextField from "./form-textfield";

import TablerTag from "~iconify/tabler/tag";

interface Props {
  successCallback: () => void;
  returnCallback: () => void;
}

export default function NewTagForm({ successCallback, returnCallback }: Props) {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [color, setColor] = useState("#aabbcc");

  const pathname = usePathname();
  const pipelineID = pathname.split("/")[3];

  const form = useRef(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    const values = {
      id: crypto.randomUUID(),
      name: formData.get("name") as string,
      icon: formData.get("icon"),
      color: color,
    };

    console.log("values: ", values);

    const validatedFields = TagSchema.safeParse(values);

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
      const data = await UpdateTags({
        tags: [validatedFields.data],
        pipelineID: pipelineID,
        operation: "add",
      });
      setError(data?.error || "");
      setSuccess(data?.success || "");

      // Reset form on success
      if (data?.success) {
        (form.current as unknown as HTMLFormElement).reset();
        successCallback();
      }
    } catch (err) {
      console.error("Something went wrong:", err);
      setError("Failed to create tag!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={handleSubmit}
      ref={form}
    >
      <div className="flex flex-col gap-4">
        <TextField
          field="name"
          label="Name"
          fieldErrors={fieldErrors}
          isPending={isPending}
        />
        <span className="text-sm font-semibold">Icon</span>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 hover:cursor-pointer">
            <input
              type="radio"
              name="icon"
              className="radio border border-neutral-200"
              defaultChecked
              value="tag"
            />
            <TablerTag width={21} height={21} />
          </label>
          <label className="flex items-center gap-1 hover:cursor-pointer">
            <input
              type="radio"
              name="icon"
              className="radio border border-neutral-200"
            />
            <TablerTag width={21} height={21} />
          </label>
          <label className="flex items-center gap-1 hover:cursor-pointer">
            <input
              type="radio"
              name="icon"
              className="radio border border-neutral-200"
            />
            <TablerTag width={21} height={21} />
          </label>
          <label className="flex items-center gap-1 hover:cursor-pointer">
            <input
              type="radio"
              name="icon"
              className="radio border border-neutral-200"
            />
            <TablerTag width={21} height={21} />
          </label>
        </div>
        <span className="text-sm font-semibold">Color</span>
        <HexColorPicker color={color} onChange={setColor} />
        <HexColorInput color={color} onChange={setColor} />
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

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={returnCallback}
          className="btn rounded-md border-2 border-transparent bg-pink-600 text-white transition-all duration-150 btn-sm hover:border-pink-600 hover:bg-white hover:text-pink-600"
        >
          Cancel
        </button>
        <button
          className="btn rounded-md  bg-neutral-900 px-4 py-2 text-white transition-colors btn-sm btn-neutral hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create New Tag"}
        </button>
      </div>
    </form>
  );
}
