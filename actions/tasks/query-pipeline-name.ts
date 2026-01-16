"use server";

import { auth } from "@/auth";
import { client } from "@/lib/db";

export default async function QueryPipelineName(id: string) {
  const session = await auth();
  const user = session?.user;

  const res = await client.query(
    /* sql */ `
      SELECT title FROM public.pipelines
      WHERE pipelines.id = $1 AND pipelines.owner = $2
    `,
    [id, user?.id],
  );

  return res.rows[0] || null;
}
