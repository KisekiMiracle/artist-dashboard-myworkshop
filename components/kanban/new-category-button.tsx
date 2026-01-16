"use client";

import NewCategoryForm from "../form/new-category-form";
import { useNewCategoryColumnButtonForm } from "@/lib/stores";
import TablerColumnInsertLeft from "~iconify/tabler/column-insert-left";

export default function NewCategoryColumnButton() {
  // @ts-ignore
  const showForm = useNewCategoryColumnButtonForm((state) => state.form);
  // @ts-ignore
  const setShowForm = useNewCategoryColumnButtonForm((state) => state.showForm);

  return showForm ? (
    <NewCategoryForm showCancelButton={true} />
  ) : (
    <button
      type="button"
      onClick={() => setShowForm(true)}
      className="btn btn-neutral w-fit flex items-center gap-1"
    >
      <TablerColumnInsertLeft width={21} height={21} />
      Add a New Category
    </button>
  );
}
