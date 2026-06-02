"use server";

import { revalidatePath } from "next/cache";
import { isValidRestaurantSlug, slugifyRestaurantSlug } from "@/lib/restaurants/slug";
import { createClient } from "@/lib/supabase/server";

export type CreateRestaurantState = {
  error: string | null;
};

export async function createRestaurant(
  _prevState: CreateRestaurantState,
  formData: FormData
): Promise<CreateRestaurantState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a restaurant." };
  }

  const { data: existingMemberships, error: membershipError } = await supabase
    .from("restaurant_members")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  if (membershipError) {
    return { error: membershipError.message };
  }

  if (existingMemberships && existingMemberships.length > 0) {
    return { error: "You already have a restaurant linked to your account." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const hours = String(formData.get("hours") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) {
    return { error: "Restaurant name is required." };
  }

  const slug = slugifyRestaurantSlug(slugInput || name);

  if (!slug) {
    return { error: "Please enter a valid slug." };
  }

  if (!isValidRestaurantSlug(slug)) {
    return {
      error: "Slug can only use lowercase letters, numbers, and hyphens.",
    };
  }

  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .insert({
      owner_id: user.id,
      slug,
      name,
      phone: phone || null,
      address: address || null,
      hours: hours || null,
      description: description || null,
      is_published: false,
    })
    .select("id")
    .single();

  if (restaurantError) {
    if (restaurantError.code === "23505") {
      return { error: "That website address (slug) is already taken. Try another." };
    }

    return { error: restaurantError.message };
  }

  // DB trigger handle_new_restaurant creates restaurant_members (owner) and site_settings.
  const { data: siteSettings, error: siteSettingsError } = await supabase
    .from("site_settings")
    .select("id")
    .eq("restaurant_id", restaurant.id)
    .maybeSingle();

  if (siteSettingsError) {
    return { error: siteSettingsError.message };
  }

  if (!siteSettings) {
    const { error: insertSettingsError } = await supabase.from("site_settings").insert({
      restaurant_id: restaurant.id,
    });

    if (insertSettingsError) {
      return { error: insertSettingsError.message };
    }
  }

  revalidatePath("/dashboard");
  return { error: null };
}
