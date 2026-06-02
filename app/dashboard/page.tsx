import { redirect } from "next/navigation";
import CreateRestaurantForm from "@/components/dashboard/create-restaurant-form";
import DashboardQuickLinks from "@/components/dashboard/dashboard-quick-links";
import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
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

  return (
    <main className="space-y-4">
      <SectionTitle
        title={`Welcome, ${welcomeName}`}
        description="Manage your website content from one simple dashboard."
      />

      <Card>
        <p className="text-base text-zinc-600">Signed in as</p>
        <p className="mt-1 text-lg font-medium text-zinc-900">{user.email}</p>

        <dl className="mt-4 space-y-3 text-base text-zinc-800">
          <div>
            <dt className="font-medium text-zinc-600">Restaurant Name</dt>
            <dd className="text-lg">{primaryRestaurant?.name}</dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-600">Website Address</dt>
            <dd className="text-lg">/r/{primaryRestaurant?.slug}</dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-600">Publish Status</dt>
            <dd className="text-lg font-semibold text-emerald-700">
              {primaryRestaurant?.is_published ? "Published" : "Draft"}
            </dd>
          </div>
        </dl>
      </Card>

      <DashboardQuickLinks />
    </main>
  );
}
