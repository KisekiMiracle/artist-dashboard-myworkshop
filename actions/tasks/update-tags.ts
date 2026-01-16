"use server";

import { auth } from "@/auth";
import { client } from "@/lib/db";
import { TaskTag } from "@/lib/stores";
import { revalidatePath } from "next/cache";

interface Props {
  operation: "add" | "remove";
  tags: TaskTag[];
  pipelineID: string;
}

export async function UpdateTags({ tags, pipelineID, operation }: Props) {
  const session = await auth();
  const user = session?.user;
  let query;
  let params;

  if (operation === "add") {
    query = /* sql */ `
      UPDATE public.pipelines
      SET tags = COALESCE(tags, '[]'::jsonb) || $1::jsonb
      WHERE id = $2 AND owner = $3
      RETURNING *
    `;
    params = [JSON.stringify(tags), pipelineID, user?.id];
  } else if (operation === "remove") {
    // Remove tags by filtering out matching IDs
    const tagIds = tags.map((tag) => tag.id);
    query = /* sql */ `
      UPDATE public.pipelines
      SET tags = (
        SELECT jsonb_agg(tag)
        FROM jsonb_array_elements(COALESCE(tags, '[]'::jsonb)) AS tag
        WHERE NOT (tag->>'id' = ANY($1::text[]))
      )
      WHERE id = $2 AND owner = $3
      RETURNING *
    `;
    params = [tagIds, pipelineID, user?.id];
  } else return { error: "Could not create this Tag!" };

  await client.query(query, params);

  revalidatePath(`/workshop/pipelines/${pipelineID}`);

  return { success: "Tag created successfully!" };
}
