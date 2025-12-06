import MaterialSymbolsAddRounded from "~iconify/material-symbols/add-rounded";
import NewTaskForm from "../form/new-task-form";
import PopoverButton from "../popover/popover";

export default function NewCardButton() {
  return (
    <PopoverButton
      render={
        <div className="bg-indigo-100/70 p-1 rounded-sm text-indigo-700">
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
