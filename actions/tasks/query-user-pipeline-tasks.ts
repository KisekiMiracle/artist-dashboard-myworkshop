"use server";

import { Task } from "@/lib/stores";
import { auth } from "@/auth";
import { client } from "@/lib/db";

export async function QueryUserTasks() {
  const session = await auth();
  const user = session?.user;

  const res = await client.query(
    /* sql */ `
      SELECT * FROM public.tasks
      WHERE tasks.owner = $1
    `,
    [user?.id]
  );

  const tasks = res.rows as Task[];
  const grouped: Record<string, Task[]> = {};

  tasks.forEach((task) => {
    const status = task.category;

    // If this status doesn't exist yet, create empty array
    if (status && !grouped[status]) {
      grouped[status] = [];
    }

    // Add task to the appropriate status group
    if (status) {
      grouped[status].push(task);
    }
  });

  return grouped;
}
