"use client";
import { usePathname } from "next/navigation";
import HeaderHome from "@/components/HeaderHome";
import HeaderGlobal from "@/components/HeaderGlobal";

export default function HeaderSwitcher() {
  const pathname = usePathname();
  if (pathname === "/") return <HeaderHome />;
  return <HeaderGlobal />;
}
