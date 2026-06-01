import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
import { demoMenu, demoNotices, demoRestaurant } from "@/lib/placeholder-data";

export default function DashboardHomePage() {
  const activeNoticeCount = demoNotices.filter((notice) => notice.active).length;

  return (
    <main className="space-y-4">
      <SectionTitle
        title={`Welcome, ${demoRestaurant.name}`}
        description="Manage your website content from one simple dashboard."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <p className="text-base text-zinc-600">Menu Items</p>
          <p className="mt-1 text-3xl font-semibold text-zinc-900">{demoMenu.length}</p>
        </Card>
        <Card>
          <p className="text-base text-zinc-600">Active Notices</p>
          <p className="mt-1 text-3xl font-semibold text-zinc-900">{activeNoticeCount}</p>
        </Card>
        <Card>
          <p className="text-base text-zinc-600">Website Status</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700">Draft</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-zinc-900">Quick Tips</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
          <li>Update your restaurant info first.</li>
          <li>Add your top menu items with clear prices.</li>
          <li>Use notices for temporary updates like holiday hours.</li>
        </ul>
      </Card>
    </main>
  );
}
