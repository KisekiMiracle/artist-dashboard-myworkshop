"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MdiArrowBack from "~iconify/mdi/arrow-back";

interface Props {
  href?: string;
}

export default function BackLink({ href }: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => (!href ? router.back() : router.push(href))}
      className="flex items-center justify-center font-bold hover:cursor-pointer"
    >
      <MdiArrowBack width={36} height={36} className="font-extrabold" />
    </button>
  );
}
