"use server";

import { signOut } from "@/auth";

export default async function LogOut() {
  await signOut();
  console.log("User signed out");
}
