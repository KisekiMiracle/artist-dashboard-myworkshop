"use server";

import { auth } from "@/auth";
import { client } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface UpdateTaskTagsProps {
  taskId: string;
  tagId: string;
  pipelineID: string;
  operation: "add" | "remove";
}

export async function UpdateTaskTags({
  taskId,
  tagId,
  pipelineID,
  operation,
}: UpdateTaskTagsProps) {
  const session = await auth();
  const user = session?.user;

  try {
    let query;
    let params;

    if (operation === "add") {
      query = /* sql */ `
        UPDATE public.tasks
        SET tags = COALESCE(tags, '[]'::jsonb) || (
          SELECT jsonb_build_array(tag)
          FROM public.pipelines,
            jsonb_array_elements(pipelines.tags) as tag
          WHERE pipelines.id = $1
            AND tag->>'id' = $2
          LIMIT 1
        )
        WHERE tasks.id = $3
          AND tasks.owner = $4
          AND NOT EXISTS (
            SELECT 1
            FROM jsonb_array_elements(COALESCE(tasks.tags, '[]'::jsonb)) as existing_tag
            WHERE existing_tag->>'id' = $2
          )
        RETURNING *;
      `;
      params = [pipelineID, tagId, taskId, user?.id];
    } else {
      query = /* sql */ `
        UPDATE public.tasks
        SET tags = (
          SELECT COALESCE(jsonb_agg(tag), '[]'::jsonb)
          FROM jsonb_array_elements(COALESCE(tasks.tags, '[]'::jsonb)) as tag
          WHERE tag->>'id' != $1
        )
        WHERE tasks.id = $2
          AND tasks.owner = $3
        RETURNING *;
      `;
      params = [tagId, taskId, user?.id];
    }

    const res = await client.query(query, params);

    revalidatePath(`/workshop/pipelines/${pipelineID}`);

    if (operation === "add" && res.rows.length === 0) {
      return { error: "Tag not found or already exists on task" };
    }

    return { success: true, task: res.rows[0] };
  } catch (error) {
    console.error("Database error:", error);
    return { error: `Failed to ${operation} tag` };
  }
}
