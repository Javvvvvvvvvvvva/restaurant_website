import { redirect } from "next/navigation";
import CreateRestaurantForm from "@/components/dashboard/create-restaurant-form";
import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
import { demoMenu, demoNotices } from "@/lib/placeholder-data";
import { createClient } from "@/lib/supabase/server";

type RestaurantSummary = {
  name: string;
  slug: string;
  is_published: boolean;
};

function getRestaurantFromMembership(
  membership: { restaurants: RestaurantSummary | RestaurantSummary[] | null }
): RestaurantSummary | null {
  if (!membership.restaurants) {
    return null;
  }

  return Array.isArray(membership.restaurants)
    ? (membership.restaurants[0] ?? null)
    : membership.restaurants;
}

export default async function DashboardHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: memberships, error: membershipsError } = await supabase
    .from("restaurant_members")
    .select("role, restaurants(name, slug, is_published)")
    .eq("user_id", user.id);

  if (membershipsError) {
    return (
      <main className="space-y-4">
        <SectionTitle title="Dashboard" description="We could not load your restaurant." />
        <Card>
          <p className="text-base text-red-800">{membershipsError.message}</p>
        </Card>
      </main>
    );
  }

  const memberRows = memberships ?? [];

  if (memberRows.length === 0) {
    return <CreateRestaurantForm />;
  }

  const primaryRestaurant = getRestaurantFromMembership(memberRows[0]);
  const welcomeName = primaryRestaurant?.name ?? "your restaurant";
  const activeNoticeCount = demoNotices.filter((notice) => notice.is_active).length;

  return (
    <main className="space-y-4">
      <SectionTitle
        title={`Welcome, ${welcomeName}`}
        description="Manage your website content from one simple dashboard."
      />

      <Card>
        <p className="text-base text-zinc-600">Signed in as</p>
        <p className="mt-1 text-lg font-medium text-zinc-900">{user.email}</p>
        <p className="mt-3 text-base text-zinc-700">
          Restaurant: <span className="font-medium">{primaryRestaurant?.name}</span>
        </p>
        <p className="mt-1 text-base text-zinc-700">
          Public page: /r/{primaryRestaurant?.slug}
        </p>
        <p className="mt-1 text-base text-zinc-700">
          Status: {primaryRestaurant?.is_published ? "Published" : "Draft (not public yet)"}
        </p>
      </Card>

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
          <p className="mt-1 text-2xl font-semibold text-emerald-700">
            {primaryRestaurant?.is_published ? "Published" : "Draft"}
          </p>
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
