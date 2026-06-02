import Link from "next/link";
import Card from "@/components/ui/card";

const quickLinks = [
  { href: "/dashboard/menu", label: "Menu" },
  { href: "/dashboard/notices", label: "Notices" },
  { href: "/dashboard/design", label: "Design" },
  { href: "/dashboard/publish", label: "Publish" },
];

export default function DashboardQuickLinks() {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-zinc-900">Manage Your Website</h2>
      <p className="mt-1 text-base text-zinc-600">
        Choose a section to update your restaurant website.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex h-14 items-center justify-center rounded-lg bg-emerald-700 text-lg font-medium text-white hover:bg-emerald-800"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </Card>
  );
}
