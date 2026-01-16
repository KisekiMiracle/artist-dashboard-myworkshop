"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface Props {
  label: string;
  icon: React.ReactElement;
  href: string;
}

export default function ButtonSideMenu({ label, icon, href }: Props) {
  const pathname = usePathname();
  const isActive = pathname.includes(href) && href !== "/workshop";

  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-2 px-6 py-4  hover:bg-white  hover:mx-4  hover:rounded-2xl hover:text-neutral-800   text-white transition-all duration-200",
        (isActive || (pathname === "/workshop" && href === "/workshop")) &&
          "bg-white text-neutral-800 mx-4 rounded-2xl",
      )}
    >
      {icon}
      <span className="overflow-x-hidden text-ellipsis whitespace-nowrap transition-all duration-200">
        {label}
      </span>
    </Link>
  );
}
