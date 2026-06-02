import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActiveRestaurant = {
  id: string;
  name: string;
  slug: string;
};

export async function getActiveRestaurantForUser(): Promise<{
  restaurant: ActiveRestaurant | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { restaurant: null, error: "You must be logged in." };
  }

  const { data: membership, error: membershipError } = await supabase
    .from("restaurant_members")
    .select("restaurant_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    return { restaurant: null, error: membershipError.message };
  }

  if (!membership?.restaurant_id) {
    return { restaurant: null, error: null };
  }

  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("id, name, slug")
    .eq("id", membership.restaurant_id)
    .single();

  if (restaurantError || !restaurant) {
    return { restaurant: null, error: restaurantError?.message ?? "Restaurant not found." };
  }

  return { restaurant, error: null };
}

export async function requireActiveRestaurantId(): Promise<string> {
  const { restaurant } = await getActiveRestaurantForUser();

  if (!restaurant) {
    redirect("/dashboard");
  }

  return restaurant.id;
}
