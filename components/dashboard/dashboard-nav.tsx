"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/restaurant", label: "Restaurant Info" },
  { href: "/dashboard/menu", label: "Menu Management" },
  { href: "/dashboard/notices", label: "Notices" },
  { href: "/dashboard/design", label: "Design Settings" },
  { href: "/dashboard/publish", label: "Publish" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard navigation" className="space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-lg px-3 py-3 text-lg transition ${
              isActive
                ? "bg-emerald-700 text-white"
                : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
