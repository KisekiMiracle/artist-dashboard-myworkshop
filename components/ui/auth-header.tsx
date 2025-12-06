"use client";

import Link from "next/link";
import MdiLightArrowLeft from "~iconify/mdi-light/arrow-left";

export default function AuthHeader() {
  return (
    <div className="flex justify-between items-center py-8 w-full">
      <span>MyWorkshop</span>
      <Link href="/" className="flex items-center gap-1">
        <MdiLightArrowLeft width={21} height={21} />
        <span>Back to Main Page</span>
      </Link>
    </div>
  );
}
