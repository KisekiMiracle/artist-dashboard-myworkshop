"use client";

import { useState } from "react";
import MdiCancelBold from "~iconify/mdi/cancel-bold";
import MaterialSymbolsAddRounded from "~iconify/material-symbols/add-rounded";

export default function TaskColumnNewTaskButton() {
  const [showInputField, setShowInputField] = useState(false);

  return showInputField ? (
    <form className="flex flex-col gap-1">
      <label aria-label="Task title">
        <textarea
          className="w-full"
          rows={3}
          placeholder="Input a title for this new task."
        />
      </label>
      <div className="flex items-center gap-2">
        <button type="submit" className="btn btn-neutral">
          Add Card
        </button>
        <button
          type="button"
          className="rounded-md p-2 transition-all duration-150 hover:cursor-pointer hover:bg-neutral-100"
          onClick={() => setShowInputField(false)}
        >
          <MdiCancelBold width={21} height={21} />
        </button>
      </div>
    </form>
  ) : (
    <button
      type="button"
      className="btn flex items-center justify-start gap-1 btn-neutral"
      onClick={() => setShowInputField(true)}
    >
      <MaterialSymbolsAddRounded width={21} height={21} />
      <span>Add a New Card</span>
    </button>
  );
}
