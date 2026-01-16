"use client";

import { useRef } from "react";
import MdiPlus from "~iconify/mdi/plus";
import NewTaskForm from "../form/new-task-form";

export default function ViewNewTaskButton() {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-1 border rounded-md btn btn-neutral"
        onClick={() => ref.current?.showModal()}
      >
        <MdiPlus width={21} height={21} />
        <span>New Task</span>
      </button>
      <dialog className="modal" ref={ref}>
        <div className="modal-box">
          <NewTaskForm />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
