interface Props {
  fieldErrors: Record<string, string>;
  isPending: boolean;
}

/**
 * A form field for selecting a category.
 *
 * @param {{ fieldErrors: Record<string, string>, isPending: boolean }} props
 * @returns {JSX.Element} A form field for selecting a category
 */
export default function CategoryField({ fieldErrors, isPending }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="category" className="font-medium text-sm">
        Category
      </label>
      <input
        id="category"
        name="category"
        type="text"
        className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-1 transition-all duration-200 ${
          fieldErrors.category
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
        }`}
        disabled={isPending}
        defaultValue="category_1"
      />
      {fieldErrors.category && (
        <p className="mt-1 text-red-600 text-xs">{fieldErrors.category}</p>
      )}
    </div>
  );
}
