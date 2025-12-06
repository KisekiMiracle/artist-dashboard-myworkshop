import { client } from "@/lib/db";

export async function getVerificationTokenByToken(token: string) {
  try {
    const verificationToken = await client.query(
      /* sql */ `
        SELECT * FROM public."verificationToken"
        WHERE token = $1
      `,
      [token]
    );

    return verificationToken.rows[0] || null;
  } catch {
    return null;
  }
}

export async function getVerificationTokenByEmail(email: string) {
  try {
    const verificationToken = await client.query(
      /* sql */ `
        SELECT * FROM public."verificationToken"
        WHERE email = $1
      `,
      [email]
    );

    return verificationToken.rows[0] || null;
  } catch {
    return null;
  }
}
