"use server";

import { auth } from "@/auth";
import { client } from "@/lib/db";

export async function QueryPipelineCategories(id: string) {
  const session = await auth();
  const user = session?.user;

  const res = await client.query(
    /* sql */ `
    SELECT 
      cat as category,
      COUNT(tasks.id) as task_count
    FROM public.pipelines
    CROSS JOIN LATERAL unnest(pipelines.categories) WITH ORDINALITY as u(cat, ord)
    LEFT JOIN public.tasks 
      ON tasks."pipelineID" = pipelines.id 
      AND tasks.category = cat
    WHERE pipelines.owner = $1 
      AND pipelines.id = $2 
    GROUP BY cat, ord
    ORDER BY ord ASC
    `,
    [user?.id, id],
  );

  return res.rows || null;
}
