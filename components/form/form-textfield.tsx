import { cn } from "@/lib/utils";

interface Props {
  field: string;
  label?: string;
  fieldErrors: Record<string, string>;
  isPending: boolean;
  type?: "text" | "email" | "password" | "radio" | "textarea";
  defaultValue?: string;
  className?: string;
}

export default function TextField({
  field,
  label,
  fieldErrors,
  isPending,
  type = "text",
  defaultValue,
  className,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={field} className="font-medium text-sm">
          {label}
        </label>
      )}
      {type !== "textarea" && (
        <input
          id={field}
          name={field}
          type={type}
          className={cn(
            `border rounded-md px-3 py-2 focus:outline-none focus:ring-1 transition-all duration-200 ${
              fieldErrors[field]
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
            }`,
            className,
          )}
          defaultValue={defaultValue}
          disabled={isPending}
        />
      )}
      {type === "textarea" && (
        <textarea
          id={field}
          name={field}
          className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-1 transition-all duration-200 ${
            fieldErrors[field]
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
          }`}
          disabled={isPending}
        />
      )}
      {fieldErrors[field] && (
        <p className="mt-1 text-red-600 text-xs">{fieldErrors[field]}</p>
      )}
    </div>
  );
}
