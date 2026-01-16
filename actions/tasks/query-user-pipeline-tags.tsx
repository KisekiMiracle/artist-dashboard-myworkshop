"use server";

import { auth } from "@/auth";
import { client } from "@/lib/db";

export async function QueryPipelineTags(pipelineID: string) {
  const session = await auth();
  const user = session?.user;

  const res = await client.query(
    /* sql */ `
      SELECT 
        tag.value->>'id' as id,
        tag.value->>'name' as name,
        tag.value->>'icon' as icon,
        tag.value->>'color' as color,
        COUNT(tasks.id) as usage_count
      FROM public.pipelines
      CROSS JOIN LATERAL jsonb_array_elements(COALESCE(pipelines.tags, '[]'::jsonb)) as tag
      LEFT JOIN public.tasks 
        ON tasks."pipelineID" = pipelines.id
        AND tasks.tags ? (tag.value->>'id')
      WHERE pipelines.id = $1 AND pipelines.owner = $2
      GROUP BY tag.value->>'id', tag.value->>'name', tag.value->>'icon', tag.value->>'color'
    `,
    [pipelineID, user?.id],
  );

  return { tags: res.rows };
}
