"use client";

import { useEffect, useState } from "react";

import { Badge } from "../ui/badge";
import FluentMdl2DateTime2 from "~iconify/fluent-mdl2/date-time-2";
import { QueryUserTasks } from "@/actions/tasks/query-user-pipeline-tasks";
import TablerAtom2Filled from "~iconify/tabler/atom-2-filled";
import TablerCategory from "~iconify/tabler/category";
import TablerClipboardText from "~iconify/tabler/clipboard-text";
import TablerFileDescription from "~iconify/tabler/file-description";
import { Task } from "@/lib/stores";
import { usePathname } from "next/navigation";

interface ListItemProps {
  task: Task;
}

function ListItem({ task }: ListItemProps) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const creationDate = new Date(task.creationDate as Date);
  const updateDate = new Date(task.updateDate as Date);
  const dueDate = new Date(task.dueDate as Date);

  return (
    <tr className="border-t border-t-neutral-200! text-xs text-neutral-700">
      <td className="font-normal!">{task.title}</td>
      {/* <td>{task.description}</td> */}
      <td>
        <Badge
          variant={
            task.priority === "high"
              ? "destructive"
              : task.priority === "medium"
                ? "default"
                : "secondary"
          }
          className="pointer-events-none h-5 rounded-sm px-1.5 text-[11px] capitalize"
        >
          {task.priority}
        </Badge>
      </td>
      <td>{task.category}</td>
      <td>{creationDate?.toLocaleDateString("en-US", options)}</td>
      <td>
        {!task.updateDate
          ? "-"
          : updateDate?.toLocaleDateString("en-US", options)}
      </td>
      <td>{dueDate?.toLocaleDateString("en-US", options)}</td>
      <td>
        <button type="button" className="btn btn-xs btn-neutral">
          Edit
        </button>
      </td>
    </tr>
  );
}

export default function ListView() {
  const pathname = usePathname();
  const pipelineID = pathname.split("/")[3];
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState<Record<string, Task[]>>({});

  useEffect(() => {
    const updateColumns = async () => {
      setIsLoading(true);
      const data = await QueryUserTasks(pipelineID);
      setRows(data as Record<string, Task[]>);
      setIsLoading(false);
    };
    updateColumns();
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center gap-1 text-xl font-bold">
        <span>Loading...</span>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="table border-collapse! overflow-hidden rounded-md table-sm">
        <thead className="text-md bg-muted/50 text-neutral-800">
          <tr>
            <th>
              <div className="flex items-center gap-1">
                <TablerClipboardText width={16} height={16} /> Title
              </div>
            </th>
            {/* <th> */}
            {/*   <div className="flex items-center gap-1"> */}
            {/*     <TablerFileDescription width={16} height={16} /> Description */}
            {/*   </div> */}
            {/* </th> */}
            <th>
              <div className="flex items-center gap-1">
                <TablerAtom2Filled width={16} height={16} /> Priority
              </div>
            </th>
            <th>
              <div className="flex items-center gap-1">
                <TablerCategory width={16} height={16} /> Category
              </div>
            </th>
            <th>
              <div className="flex items-center gap-1">
                <FluentMdl2DateTime2 width={16} height={16} />
                Creation Date
              </div>
            </th>
            <th>
              <div className="flex items-center gap-1">
                <FluentMdl2DateTime2 width={16} height={16} />
                Update Date
              </div>
            </th>
            <th>
              <div className="flex items-center gap-1">
                <FluentMdl2DateTime2 width={16} height={16} />
                Due Date
              </div>
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {Object.entries(rows).map(([_columnValue, tasks]) =>
            tasks.map((task) => <ListItem key={task.id} task={task} />),
          )}
        </tbody>
      </table>
    </div>
  );
}
