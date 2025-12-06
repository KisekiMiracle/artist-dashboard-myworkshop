"use server";

import { auth } from "@/auth";
import { client } from "@/lib/db";

export async function QueryPipelineCategories() {
  const session = await auth();
  const user = session?.user;

  const res = await client.query(
    /* sql */ `
      SELECT * FROM public.tasks
      WHERE tasks.owner = $1
    `,
    [user?.id]
  );

  return res.rows || null;
}
