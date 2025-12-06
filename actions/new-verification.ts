"use server";

import { client } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export async function newVerification(token: string) {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) return { error: "Token does not exist!" };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "Token has expired!" };

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: "Email does not exist!" };

  await client.query(
    /* sql */ `
      UPDATE public.users
      SET "emailVerified" = $1, email = $2
      WHERE id = $3
    `,
    [new Date(), existingToken.email, existingUser.id]
  );

  await client.query(
    /* sql */ `
    DELETE FROM public."verificationToken"
    WHERE id = $1
    `,
    [existingToken.id]
  );

  return { success: "Email verified!" };
}
