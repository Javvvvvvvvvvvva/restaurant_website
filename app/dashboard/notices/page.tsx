import Link from "next/link";
import { redirect } from "next/navigation";
import NoticesManagement from "@/components/dashboard/notices/notices-management";
import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
import { getActiveRestaurantForUser } from "@/lib/restaurants/active-restaurant";
import { createClient } from "@/lib/supabase/server";
import type { Notice } from "@/types";

export default async function NoticesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { restaurant, error } = await getActiveRestaurantForUser();

  if (error) {
    return (
      <main className="space-y-4">
        <SectionTitle title="Notices" description="We could not load your restaurant." />
        <Card>
          <p className="text-base text-red-800">{error}</p>
        </Card>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="space-y-4">
        <SectionTitle
          title="Notices"
          description="Create your restaurant before adding notices."
        />
        <Card>
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-700 px-5 text-lg font-medium text-white hover:bg-emerald-800"
          >
            Go to Dashboard
          </Link>
        </Card>
      </main>
    );
  }

  const { data: notices, error: noticesError } = await supabase
    .from("notices")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false });

  if (noticesError) {
    return (
      <main className="space-y-4">
        <SectionTitle title="Notices" description="We could not load your notices." />
        <Card>
          <p className="text-base text-red-800">{noticesError.message}</p>
        </Card>
      </main>
    );
  }

  return (
    <NoticesManagement
      restaurantName={restaurant.name}
      notices={(notices ?? []) as Notice[]}
    />
  );
}
