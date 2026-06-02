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

  // owner_id always comes from the authenticated session — never from the form.
  const ownerId = user.id;
  const restaurantPayload = {
    owner_id: ownerId,
    slug,
    name,
    phone: phone || null,
    address: address || null,
    hours: hours || null,
    description: description || null,
    is_published: false,
  };

  // Insert without RETURNING so RLS only needs INSERT policy here.
  // Requires: restaurants_insert_owner (owner_id = auth.uid()).
  const { error: restaurantError } = await supabase
    .from("restaurants")
    .insert(restaurantPayload);

  if (restaurantError) {
    if (restaurantError.code === "23505") {
      return { error: "That website address (slug) is already taken. Try another." };
    }

    return { error: restaurantError.message };
  }

  // Load the new row by owner + slug.
  // Requires: restaurants SELECT where owner_id = auth.uid() (or member / published).
  const { data: restaurant, error: restaurantSelectError } = await supabase
    .from("restaurants")
    .select("id")
    .eq("owner_id", ownerId)
    .eq("slug", slug)
    .single();

  if (restaurantSelectError || !restaurant) {
    return {
      error:
        restaurantSelectError?.message ??
        "Restaurant was created but could not be loaded. Please refresh the page.",
    };
  }

  const { data: existingMember, error: existingMemberError } = await supabase
    .from("restaurant_members")
    .select("id")
    .eq("restaurant_id", restaurant.id)
    .eq("user_id", ownerId)
    .maybeSingle();

  if (existingMemberError) {
    return { error: existingMemberError.message };
  }

  if (!existingMember) {
    // Requires: restaurant_members_insert_initial_owner OR DB trigger handle_new_restaurant.
    const { error: memberInsertError } = await supabase.from("restaurant_members").insert({
      restaurant_id: restaurant.id,
      user_id: ownerId,
      role: "owner",
    });

    if (memberInsertError) {
      return { error: memberInsertError.message };
    }
  }

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
