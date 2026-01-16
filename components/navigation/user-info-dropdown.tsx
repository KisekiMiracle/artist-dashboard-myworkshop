"use client";

import LogOut from "@/actions/logout";
import { retrieveUserData } from "@/actions/retrieve-user-data";
import { cn } from "@/lib/utils";
import { UserRole } from "@/next-auth";
import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import MaterialSymbolsLogoutRounded from "~iconify/material-symbols/logout-rounded";
import TablerSettings from "~iconify/tabler/settings";

export default function UserDropdownInfo() {
  const [session, useSession] = useState<
    (User & { role: UserRole }) | undefined
  >();

  useEffect(() => {
    if (session === null || session === undefined) {
      retrieveUserData().then((session) => {
        useSession(session);
      });
    }
  }, []);

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
          <p className="flex h-full flex-col justify-between">
            <span className="text-sm font-semibold">{session?.name}</span>
            <span className="text-xs text-neutral-500">
              Free Plan - {session?.role}
            </span>
          </p>
        </div>
        <hr />
      </div>
      <button type="button" className="flex flex-col gap-1 py-2">
        <Link
          className="flex items-center gap-1 rounded-sm border border-neutral-300 px-2 py-1 text-xs text-neutral-600 transition-all duration-200 hover:bg-neutral-100"
          href="/workshop/profile"
        >
          <TablerSettings width={16} height={16} />
          User Settings
        </Link>
      </button>
      <form
        action={() => {
          LogOut();
        }}
      >
        <button
          type="submit"
          className="flex w-full items-center gap-1 rounded-sm border border-pink-300 px-2 py-1 text-xs text-pink-600  transition-all duration-200 hover:cursor-pointer hover:bg-pink-50"
        >
          <MaterialSymbolsLogoutRounded width={16} height={16} />
          <span className="text-ellipsis whitespace-nowrap  transition-all duration-200">
            Log Out
          </span>
        </button>
      </form>
    </div>
  );
}
