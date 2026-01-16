"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import TablerSettings from "~iconify/tabler/settings";

export default function PipelineSettingsButton() {
  const pathname = usePathname();

  return (
    <Link
      href={`${pathname}/settings`}
      className="btn flex items-center gap-1 rounded-md border border-neutral-200 btn-outline btn-neutral"
    >
      <TablerSettings width={21} height={21} />
      <span>Settings</span>
    </Link>
  );
}
