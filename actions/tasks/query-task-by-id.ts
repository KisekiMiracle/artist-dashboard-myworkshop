"use server";

import { auth } from "@/auth";
import { client } from "@/lib/db";

export default async function QueryTaskById(id: string) {
  const session = await auth();
  const user = session?.user;

  const res = await client.query(
    /* sql */ `
      SELECT * FROM public.tasks
      WHERE tasks.id = $1 AND tasks.owner = $2
    `,
    [id, user?.id],
  );

  return res.rows[0] || null;
}
