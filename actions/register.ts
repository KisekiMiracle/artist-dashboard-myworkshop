"use server";

import * as z from "zod";

import { RegisterSchema } from "@/schemas";
import bcrypt from "bcrypt";
import { client } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields) return { error: "Invalid Fields!" };
  // @ts-expect-error <->
  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) return { error: "Email is already taken!" };

  await client.query(
    /* sql */ `
    INSERT INTO public.users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
    [name, email, hashedPassword]
  );

  const verificationToken = await generateVerificationToken(email);

  if (!verificationToken) {
    return { error: "Failed to generate verification token" };
  }

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent!" };
};
