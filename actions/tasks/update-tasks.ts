"use server";

import { auth } from "@/auth";
import { client } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function UpdateTaskCategory(
  taskId: number,
  category: string,
  position: number,
  pipelineID: string,
  updateDate: string,
) {
  const session = await auth();

  await client.query(
    /* sql */ `
      UPDATE public.tasks
      SET category = $1, position = $2, "updateDate" = $5
      WHERE id = $3 AND owner = $4
    `,
    [category, position, taskId, session?.user.id, updateDate],
  );

  revalidatePath(`/workshop/pipelines/${pipelineID}`);

  return { success: true };
}
