import { client } from "./db";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid";

export async function generateVerificationToken(email: string) {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // drops token after one hour

  const existingtoken = await getVerificationTokenByEmail(email);

  if (existingtoken) {
    await client.query(
      /* sql */ `
        DELETE FROM public."verificationToken"
        WHERE id = $1
      `,
      [existingtoken.id]
    );
  }

  const verificationToken = await client.query(
    /* sql */ `
    INSERT INTO public."verificationToken" (email, expires, token)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
    [email, expires, token]
  );

  return verificationToken.rows[0] || null;
}
