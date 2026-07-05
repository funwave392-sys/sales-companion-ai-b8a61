"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardPenLine, History } from "lucide-react";

const links = [
  { href: "/", label: "日報を分析", icon: ClipboardPenLine },
  { href: "/history", label: "分析履歴", icon: History },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 rounded-full border border-line bg-white/90 p-1 shadow-sm">
      {links.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-forest text-white"
                : "text-slate-600 hover:bg-mint hover:text-forest"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
