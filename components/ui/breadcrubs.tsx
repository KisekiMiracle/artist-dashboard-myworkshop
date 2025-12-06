"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const items = pathname.split("/").filter((item) => item);
  const itemsPath = items.map((item, index) => {
    if (index > 0) {
      items[index] = items[index - 1] + "/" + items[index];
      return items[index];
    }
    return item;
  });

  return (
    <div className="text-sm breadcrumbs">
      <ul>
        {items.map((item, index) => (
          // eslint-disable-next-line react-hooks/purity
          <li key={`breadcrums-${index}-${Math.random().toFixed(2)}`}>
            <Link className="capitalize" href={`/${itemsPath[index]}`}>
              {item.split("/")[index]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
