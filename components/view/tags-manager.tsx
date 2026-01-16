"use client";

import { QueryPipelineTags } from "@/actions/tasks/query-user-pipeline-tags";
import { UpdateTags } from "@/actions/tasks/update-tags";
import { TaskTag } from "@/lib/stores";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import TablerTag from "~iconify/tabler/tag";
import TablerTagsFilled from "~iconify/tabler/tags-filled";
import TablerTagPlus from "~iconify/tabler/tag-plus";
import NewTagForm from "../form/new-tag-form";
import CheckTagUsageOnTask from "@/actions/tasks/check-tag-usage-on-task";
import TablerTextCaption from "~iconify/tabler/text-caption";

export function TagManagerButton() {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className="btn rounded-md btn-neutral"
        onClick={() => ref.current?.showModal()}
      >
        <TablerTagsFilled width={21} height={21} />
        <span>Manage Tags</span>
      </button>
      <dialog ref={ref} className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <TagManager />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export function TagManager() {
  const [tags, setTags] = useState<TaskTag[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const pipelineID = pathname.split("/")[3];

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const data = await QueryPipelineTags(pipelineID);
      setTags(data.tags as TaskTag[]);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [pipelineID]);

  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0">
        <h1 className="text-2xl font-bold">Tag Manager</h1>
        <hr />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {isLoading ? (
          <span>Loading...</span>
        ) : tags && tags.length > 0 ? (
          tags.map((tag) => (
            <TaskTagObj
              key={tag.id}
              id={tag.id}
              label={tag.name}
              icon={tag.icon}
              color={tag.color}
              usage_count={tag.usage_count}
              onDelete={fetchTags} // Pass refetch function
            />
          ))
        ) : (
          <span>No tags found</span>
        )}
      </div>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          type="button"
          disabled={isLoading}
        >
          Add New Tag
        </button>
      ) : (
        <NewTagForm
          returnCallback={() => setShowForm(false)}
          successCallback={fetchTags}
        />
      )}
      <Toaster />
    </div>
  );
}

interface TaskTagProps {
  id: string;
  label: string;
  icon: string;
  color: string;
  usage_count?: number;
  onDelete?: () => Promise<void>;
  deleteFromTask?: () => Promise<void>;
}

export function TaskTagObj({
  id,
  label,
  icon,
  color,
  onDelete,
  deleteFromTask,
  usage_count,
}: TaskTagProps) {
  const pathname = usePathname();
  const pipelineID = pathname.split("/")[3];
  const [isDeleting, setIsDeleting] = useState(false);

  const isInUse = async () => {
    return await CheckTagUsageOnTask({ pipelineID, tagId: id });
  };

  const deleteTag = async () => {
    if (await isInUse()) {
      toast.error(`Cannot delete "${label}" - it's currently being used.`, {
        duration: 2000,
      });
      return;
    }

    setIsDeleting(true);
    try {
      await UpdateTags({
        tags: [{ id, name: label, icon, color }],
        pipelineID: pipelineID,
        operation: "remove",
      });

      // Call the parent's refetch function instead of reloading
      if (onDelete) await onDelete();
    } catch (error) {
      console.error("Error deleting tag:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 rounded-sm border border-neutral-300 px-2 py-1 transition-all duration-150 hover:border-blue-500">
      <div className="flex items-center gap-1">
        <TagIcon iconLabel={icon} />
        <span className="text-sm font-bold">{label}</span>
      </div>
      {onDelete && (
        <button
          type="button"
          className="btn btn-circle btn-ghost btn-sm "
          onClick={deleteTag}
          disabled={isDeleting}
          title={"Delete tag"}
        >
          {isDeleting ? "..." : "x"}
        </button>
      )}
      {deleteFromTask && (
        <button
          type="button"
          className="btn btn-circle btn-ghost btn-sm "
          onClick={deleteFromTask}
          disabled={isDeleting}
          title={"Delete tag"}
        >
          {isDeleting ? "..." : "x"}
        </button>
      )}
    </div>
  );
}

interface RenderTagProps {
  iconLabel: string;
}

function TagIcon({ iconLabel }: RenderTagProps) {
  const [icon, setIcon] = useState<React.ReactNode | null>(null);

  const findIcon = () => {
    switch (iconLabel) {
      case "tag":
        return <TablerTag width={21} height={21} />;
      default:
        return <TablerTag width={21} height={21} />;
    }
  };

  useEffect(() => {
    setIcon(findIcon());
  }, [iconLabel]);

  return <>{icon}</>;
}

interface NewTaskTagButtonProps {
  callback: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function NewTaskTagButton({ callback }: NewTaskTagButtonProps) {
  const [showForm, setShowForm] = useState(false);

  const [tags, setTags] = useState<TaskTag[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const pipelineID = pathname.split("/")[3];

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const data = await QueryPipelineTags(pipelineID);
      setTags(data.tags as TaskTag[]);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [pipelineID]);

  const ref = useRef<HTMLSelectElement>(null);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return !showForm ? (
    <button
      className="btn flex items-center gap-2 rounded-md btn-neutral"
      onClick={() => {
        setShowForm(true);
        fetchTags();
      }}
    >
      <TablerTagPlus width={21} height={21} />
      <span>Add Tag</span>
    </button>
  ) : (
    <div className="flex items-center gap-2">
      <select
        name="task-tags"
        id="task-tags"
        onChange={callback}
        defaultValue="Select a Tag"
        className="select"
        ref={ref}
      >
        <option disabled={true}>Select a Tag</option>
        {tags &&
          tags.map((tag) => (
            <option key={tag.id} id={tag.id}>
              {tag.name}
            </option>
          ))}
      </select>
      <button
        onClick={() => setShowForm(false)}
        className="btn btn-circle btn-ghost btn-sm"
      >
        ✕
      </button>
    </div>
  );
}
