import Link from "next/link";
import { redirect } from "next/navigation";
import MenuManagement from "@/components/dashboard/menu/menu-management";
import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
import { getActiveRestaurantForUser } from "@/lib/restaurants/active-restaurant";
import { createClient } from "@/lib/supabase/server";
import type { MenuCategory, MenuItem } from "@/types";

export default async function MenuManagementPage() {
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
        <SectionTitle title="Menu Management" description="We could not load your restaurant." />
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
          title="Menu Management"
          description="Create your restaurant before adding menu items."
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

  const { data: categories, error: categoriesError } = await supabase
    .from("menu_categories")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("sort_order", { ascending: true });

  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("sort_order", { ascending: true });

  if (categoriesError || itemsError) {
    return (
      <main className="space-y-4">
        <SectionTitle title="Menu Management" description="We could not load your menu." />
        <Card>
          <p className="text-base text-red-800">
            {categoriesError?.message ?? itemsError?.message}
          </p>
        </Card>
      </main>
    );
  }

  return (
    <MenuManagement
      restaurantName={restaurant.name}
      categories={(categories ?? []) as MenuCategory[]}
      items={(items ?? []) as MenuItem[]}
    />
  );
}
