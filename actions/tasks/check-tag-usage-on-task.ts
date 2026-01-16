"use server";

import { auth } from "@/auth";
import { client } from "@/lib/db";

interface Props {
  pipelineID: string;
  tagId: string;
}

export default async function CheckTagUsageOnTask({
  pipelineID,
  tagId,
}: Props) {
  const session = await auth();
  const user = session?.user;

  try {
    const res = await client.query(
      /* sql */ `
        SELECT EXISTS (
          SELECT 1
          FROM public.tasks
          WHERE tasks."pipelineID" = $1
            AND tasks.owner = $2
            AND EXISTS (
              SELECT 1
              FROM jsonb_array_elements(COALESCE(tasks.tags, '[]'::jsonb)) as tag
              WHERE tag->>'id' = $3
            )
        ) as is_used
      `,
      [pipelineID, user?.id, tagId],
    );

    return res.rows[0].is_used;
  } catch (error) {
    console.error("Database error:", error);
    return false;
  }
}
