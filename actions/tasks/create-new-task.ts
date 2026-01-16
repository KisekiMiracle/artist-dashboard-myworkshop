"use server";

import * as z from "zod";

import { TaskSchema } from "@/schemas";
import { auth } from "@/auth";
import { client } from "@/lib/db";
import { refresh, revalidatePath } from "next/cache";

export async function CreateNewTask(values: z.infer<typeof TaskSchema>) {
  const validatedFields = TaskSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log("Validation errors:", validatedFields.error);
    return { error: "Invalid Fields!" };
  }

  const {
    title,
    description,
    status,
    priority,
    category,
    dueDate,
    pipelineId,
  } = validatedFields.data;

  try {
    const session = await auth();
    const res = await client.query(
      /* sql */ `
    INSERT INTO public.tasks (title, description, status, priority, category, "creationDate", "dueDate", "pipelineID", owner)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id
  `,
      [
        title,
        description,
        status,
        priority,
        category,
        new Date(),
        dueDate,
        pipelineId,
        session?.user.id,
      ],
    );

    const id = res.rows[0].id;

    if (!id) {
      return { error: "Something went wrong." };
    }

    revalidatePath("/workshop/pipelines/[slug]", "layout");
    refresh();

    return { success: "Created New Task Successfully!" };
  } catch (error) {
    console.error("Database error:", error);
    return { error: "Something went wrong." };
  }
}
