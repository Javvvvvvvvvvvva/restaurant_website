import type { ReactNode } from "react";
import Link from "next/link";
import DashboardNav from "@/components/dashboard/dashboard-nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[260px_1fr] md:py-6">
        <aside className="rounded-xl border bg-white p-4">
          <Link href="/dashboard" className="mb-4 block text-2xl font-semibold text-zinc-900">
            Restaurant Admin
          </Link>
          <p className="mb-4 text-base text-zinc-600">Simple tools to manage your website.</p>
          <DashboardNav />
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
