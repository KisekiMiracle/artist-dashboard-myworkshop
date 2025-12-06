"use client";

import MdiPlus from "~iconify/mdi/plus";
export default function ViewNewTaskButton() {
  return (
    <button
      type="button"
      className="flex items-center gap-1 border rounded-md btn btn-neutral"
    >
      <MdiPlus width={21} height={21} />
      <span>New Task</span>
    </button>
  );
}
