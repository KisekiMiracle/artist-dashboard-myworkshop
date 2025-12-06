import { client } from "@/lib/db";

export async function getUserByEmail(email: string) {
  try {
    const user = await client.query(
      /* sql */ `
    SELECT * FROM public.users
    WHERE email = $1
  `,
      [email]
    );
    return user.rows[0] || null;
  } catch {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await client.query(
      /* sql */ `
    SELECT * FROM public.users
    WHERE id = $1
  `,
      [id]
    );
    return user.rows[0] || null;
  } catch {
    return null;
  }
}
