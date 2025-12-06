"use client";

import PopoverButton from "../popover/popover";
import RiFilter3Fill from "~iconify/ri/filter-3-fill";

export default function FilterTasksButton() {
  return (
    <PopoverButton
      render={
        <div className="flex items-center gap-1 border border-neutral-200 rounded-md btn-outline btn btn-neutral">
          <RiFilter3Fill width={21} height={21} />
          <span>Filter</span>
        </div>
      }
      contents={<div>...</div>}
    />
  );
}
