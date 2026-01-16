"use server";

import * as z from "zod";

import { CategorySchema } from "@/schemas";
import { auth } from "@/auth";
import { client } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function CreateNewCategory(
  values: z.infer<typeof CategorySchema>,
  pipelineID: string,
) {
  const validatedFields = CategorySchema.safeParse(values);

  if (!validatedFields.success) {
    console.log("Validation errors:", validatedFields.error);
    return { error: "Invalid Fields!" };
  }

  const { title } = validatedFields.data;

  try {
    const session = await auth();
    const res = await client.query(
      /* sql */ `
        SELECT 
          cat as category
        FROM public.pipelines
        CROSS JOIN LATERAL unnest(pipelines.categories) WITH ORDINALITY as u(cat, ord)
        WHERE pipelines.owner = $1 
          AND pipelines.id = $2
        GROUP BY cat, ord
        ORDER BY ord ASC;
      `,
      [session?.user.id, pipelineID],
    );

    const categoryExists = res.rows.some((row) => row.category === title);

    if (categoryExists) {
      return { error: "Category already exists!" };
    }

    await client.query(
      /* sql */ `
        UPDATE public.pipelines
        SET categories = array_append(categories, $1)
        WHERE id = $2 AND owner = $3
      `,
      [title, pipelineID, session?.user.id],
    );

    revalidatePath(`/workshop/pipelines/${pipelineID}`);

    return { success: "Created New Category Successfully!" };
  } catch (error) {
    console.error("Database error:", error);
    return { error: "Something went wrong." };
  }
}
