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

  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-2 px-6 hover:px-8 py-4 border-l-4 border-l-transparent hover:border-l-white hover:[&>span]:w-full text-white transition-all duration-200",
        pathname === href && "border-l-4 border-l-white pr-8"
      )}
    >
      {icon}
      <span className="w-0 overflow-x-hidden text-ellipsis whitespace-nowrap transition-all duration-200">
        {label}
      </span>
    </Link>
  );
}
