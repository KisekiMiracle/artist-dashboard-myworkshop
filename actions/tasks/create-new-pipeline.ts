"use server";

import * as z from "zod";

import { PipelineSchema } from "@/schemas";
import { auth } from "@/auth";
import { client } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function CreateNewTask(values: z.infer<typeof PipelineSchema>) {
  const validatedFields = PipelineSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log("Validation errors:", validatedFields.error);
    return { error: "Invalid Fields!" };
  }

  const { title } = validatedFields.data;

  try {
    const session = await auth();
    const res = await client.query(
      /* sql */ `
    INSERT INTO public.tasks (title, owner)
    VALUES ($1, $2)
    RETURNING id
  `,
      [title, session?.user.id]
    );

    const id = res.rows[0].id;

    if (!id) {
      return { error: "Something went wrong." };
    }

    revalidatePath("/workshop/pipelines"); // Update cached posts

    return { success: "Created New Pipeline Successfully!" };
  } catch (error) {
    console.error("Database error:", error);
    return { error: "Something went wrong." };
  }
}
