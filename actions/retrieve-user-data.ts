"use server";

import { auth } from "@/auth";

export const retrieveUserData = async () => {
  const session = await auth();
  const user = session?.user;

  return user;
};
