"use server";

import { auth } from "@/auth";
import { client } from "@/lib/db";

export default async function UpdatePipelineCategories(
  category: string,
  id: string,
) {
  const session = await auth();
  const user = session?.user;
  try {
    await client.query(
      /* sql */ `
    UPDATE public.pipelines
    SET categories = array_remove(categories, $1)
    WHERE id = $2 AND owner = $3
  `,
      [category, id, user?.id],
    );

    return { success: true };
  } catch (err) {
    return { success: false, error: "Could not delete that category." };
  }
}

export async function RearrangePipelineCategories(
  categories: string[],
  pipelineID: string,
) {
  const session = await auth();
  const user = session?.user;
  try {
    await client.query(
      /* sql */ `
    UPDATE public.pipelines
    SET categories = $1
    WHERE owner = $2 AND id = $3
  `,
      [categories, user?.id, pipelineID],
    );

    return { success: true };
  } catch (err) {
    return { success: false, error: "Could not update the category order." };
  }
}
