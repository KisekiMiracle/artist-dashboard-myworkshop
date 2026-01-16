"use client";

import { QueryPipelineCategories } from "@/actions/tasks/query-tasks-categories";
import UpdatePipelineCategories from "@/actions/tasks/update-pipeline-categories";
import BackLink from "@/components/ui/back-link";
import Breadcrumbs from "@/components/ui/breadcrubs";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import TablerCategory from "~iconify/tabler/category";
import TablerTrash from "~iconify/tabler/trash";

export default function Page() {
  const [categories, setCategories] = useState<
    Array<{ category: string; task_count: number }>
  >([]);

  const pathname = usePathname();
  const pipelineID = pathname.split("/")[3];

  const fetchCategories = async () => {
    const categories = await QueryPipelineCategories(pipelineID);
    setCategories(categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex w-full flex-col overflow-x-hidden px-8 py-8">
      <div>
        <Breadcrumbs />
        <hr />
      </div>
      <div className="mt-8 flex items-center gap-2">
        <BackLink />
        <h1 className="text-3xl font-bold">PIPELINE SETTINGS</h1>
      </div>
      <div className="mt-4 grid grid-cols-2">
        <form className="flex flex-col gap-2 overflow-x-auto">
          <table className="table border-collapse overflow-hidden rounded-sm table-sm">
            <thead>
              <tr>
                <th className="px-0">
                  <div className="flex items-center gap-1 text-neutral-800">
                    <TablerCategory width={21} height={21} />
                    <span>Category</span>
                  </div>
                </th>
                <th />
              </tr>
              <tr className="h-1 w-full border-b border-neutral-200" />
              <tr className="h-2" />
            </thead>
            <tbody>
              {categories &&
                categories.map((category) => (
                  <tr key={category.category + Math.random()}>
                    <td className="px-0">{category.category}</td>
                    <td className="px-0 text-right">
                      <CategoryInput
                        category={category.category}
                        taskCount={category.task_count}
                        isSingleCategory={categories.length === 1}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}

interface CategoryInputProps {
  category: string;
  taskCount: number;
  isSingleCategory: boolean;
}

function CategoryInput({
  category,
  taskCount,
  isSingleCategory,
}: CategoryInputProps) {
  const pathname = usePathname();
  const pipelineID = pathname.split("/")[3];

  return (
    <div className="flex justify-end">
      <CategoryInputButton
        disabled={taskCount > 0}
        isSingleCategory={isSingleCategory}
        category={category}
        pipelineID={pipelineID}
      />
    </div>
  );
}

interface CategoryInputButtonProps {
  disabled: boolean;
  category: string;
  pipelineID: string;
  isSingleCategory: boolean;
}

function CategoryInputButton({
  disabled,
  category,
  pipelineID,
  isSingleCategory,
}: CategoryInputButtonProps) {
  const deleteCategory = async () => {
    const res = await UpdatePipelineCategories(category, pipelineID);
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.error);
    }
  };

  return (
    <div
      className={disabled || isSingleCategory ? "tooltip tooltip-left" : ""}
      data-tip={
        isSingleCategory
          ? "You cannot have zero categories!"
          : "You cannot delete a non-empty category!"
      }
    >
      <button
        type="button"
        className={cn(
          "px-2 py-1 bg-pink-600 text-white! flex items-center gap-1 rounded-sm text-2xs font-bold hover:cursor-pointer",
          (disabled || isSingleCategory) &&
            "opacity-50 hover:cursor-not-allowed",
        )}
        disabled={disabled || isSingleCategory}
        onClick={deleteCategory}
      >
        <TablerTrash width={16} height={16} />
        Delete
      </button>
    </div>
  );
}
