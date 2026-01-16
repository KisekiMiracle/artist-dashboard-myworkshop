"use client";

import NewCategoryForm from "../form/new-category-form";
import TablerColumnInsertLeft from "~iconify/tabler/column-insert-left";

export default function NewCategoryButton() {
  return (
    <>
      <button
        type="button"
        className="flex items-center gap-1 border rounded-md btn btn-neutral"
        onClick={() =>
          (
            document.getElementById("new-cat-modal") as HTMLDialogElement
          ).showModal()
        }
      >
        <TablerColumnInsertLeft width={21} height={21} />
        <span>New Category</span>
      </button>
      <dialog id="new-cat-modal" className="modal">
        <div className="modal-box">
          <NewCategoryForm />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
