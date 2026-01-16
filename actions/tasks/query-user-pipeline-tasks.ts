"use server";

import { Task } from "@/lib/stores";
import { auth } from "@/auth";
import { client } from "@/lib/db";

export async function QueryUserTasks(pipelineID: string) {
  const session = await auth();
  const user = session?.user;

  const res = await client.query(
    /* sql */ `
      SELECT 
        cat as category,
        COALESCE(
          json_agg(
            json_build_object(
              'id', tasks.id,
              'owner', tasks.owner,
              'title', tasks.title,
              'description', tasks.description,
              'status', tasks.status,
              'priority', tasks.priority,
              'category', tasks.category,
              'position', COALESCE(tasks.position, 0),
              'dueDate', tasks."dueDate",
              'creationDate', tasks."creationDate",
              'updateDate', tasks."updateDate",
              'pipelineID', tasks."pipelineID",
              'tags', COALESCE(tasks.tags, '[]'::jsonb)::json
            )
            ORDER BY COALESCE(tasks.position, 0) ASC
          ) FILTER (WHERE tasks.id IS NOT NULL),
          '[]'::json
        ) as tasks
      FROM public.pipelines
      CROSS JOIN LATERAL unnest(pipelines.categories) WITH ORDINALITY as u(cat, ord)
      LEFT JOIN public.tasks 
        ON tasks."pipelineID" = pipelines.id 
        AND tasks.category = cat
        AND tasks.owner = $1
      WHERE pipelines.id = $2
      GROUP BY cat, ord
      ORDER BY ord ASC
    `,
    [user?.id, pipelineID],
  );

  // Transform array result to grouped object format
  const grouped: Record<string, Task[]> = {};

  res.rows.forEach((row) => {
    grouped[row.category] = row.tasks;
  });

  return grouped;
}
