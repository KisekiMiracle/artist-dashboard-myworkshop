"use client";

import MaterialSymbolsAddRounded from "~iconify/material-symbols/add-rounded";
import NewTaskForm from "../form/new-task-form";
import PopoverButton from "../popover/popover";

export default function NewTaskButton() {
  return (
    <PopoverButton
      render={
        <div className="bg-neutral-200/70 p-1 rounded-sm text-neutral-700">
          <MaterialSymbolsAddRounded width={21} height={21} />
        </div>
      }
      contents={<NewTaskForm />}
      side="bottom"
      align="end"
      disposeOnButtonClick={false}
    />
  );
}
