"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tabActive, tabInactive } from "@/lib/ui";

export function TabNav({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <nav className="border-b border-white/10 bg-white/[0.02] backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl gap-1.5 overflow-x-auto px-4 py-2.5 sm:px-6">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`whitespace-nowrap ${active ? tabActive : tabInactive}`}>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
