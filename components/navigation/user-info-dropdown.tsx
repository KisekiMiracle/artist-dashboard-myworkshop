"use client";

import Image from "next/image";
import { User } from "next-auth";
import { UserRole } from "@/next-auth";
import { retrieveUserData } from "@/actions/retrieve-user-data";
import { useState } from "react";

export default function UserDropdownInfo() {
  const [session, useSession] = useState<
    (User & { role: UserRole }) | undefined
  >();
  if (session === null || session === undefined) {
    retrieveUserData().then((session) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useSession(session);
    });
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          {session?.image && (
            <Image
              src={session?.image}
              width={36}
              height={36}
              alt="User Profile Picture"
            />
          )}
          <p className="flex flex-col justify-between h-full">
            <span className="font-semibold text-sm">{session?.name}</span>
            <span className="text-neutral-500 text-xs">
              Free Plan - {session?.role}
            </span>
          </p>
        </div>
        <hr />
      </div>
      <span className="text-sm">{session?.email}</span>
    </div>
  );
}
