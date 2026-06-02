"use server";

import { revalidatePath } from "next/cache";
import { getActiveRestaurantForUser } from "@/lib/restaurants/active-restaurant";
import { createClient } from "@/lib/supabase/server";

export type MenuActionState = {
  error: string | null;
};

async function getAuthenticatedRestaurantId(): Promise<
  { restaurantId: string } | { error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const { restaurant, error } = await getActiveRestaurantForUser();

  if (error) {
    return { error };
  }

  if (!restaurant) {
    return { error: "No restaurant found. Create a restaurant first." };
  }

  return { restaurantId: restaurant.id };
}

function parsePrice(value: FormDataEntryValue | null): number | null | "invalid" {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return null;
  }

  const price = Number.parseFloat(raw);

  if (Number.isNaN(price) || price < 0) {
    return "invalid";
  }

  return price;
}

async function verifyCategoryBelongsToRestaurant(
  categoryId: string | null,
  restaurantId: string
): Promise<string | null> {
  if (!categoryId) {
    return null;
  }

  const supabase = await createClient();
  const { data: category, error } = await supabase
    .from("menu_categories")
    .select("id")
    .eq("id", categoryId)
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  if (error) {
    return error.message;
  }

  if (!category) {
    return "Please choose a valid category.";
  }

  return null;
}

export async function createMenuCategory(
  _prevState: MenuActionState,
  formData: FormData
): Promise<MenuActionState> {
  const restaurantResult = await getAuthenticatedRestaurantId();

  if ("error" in restaurantResult) {
    return { error: restaurantResult.error };
  }

  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return { error: "Category name is required." };
  }

  const supabase = await createClient();
  const { count, error: countError } = await supabase
    .from("menu_categories")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantResult.restaurantId);

  if (countError) {
    return { error: countError.message };
  }

  const { error } = await supabase.from("menu_categories").insert({
    restaurant_id: restaurantResult.restaurantId,
    name,
    sort_order: count ?? 0,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/menu");
  return { error: null };
}

export async function createMenuItem(
  _prevState: MenuActionState,
  formData: FormData
): Promise<MenuActionState> {
  const restaurantResult = await getAuthenticatedRestaurantId();

  if ("error" in restaurantResult) {
    return { error: restaurantResult.error };
  }

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryIdRaw = String(formData.get("category_id") ?? "").trim();
  const categoryId = categoryIdRaw || null;
  const isAvailable = formData.get("is_available") === "on";
  const price = parsePrice(formData.get("price"));

  if (!name) {
    return { error: "Menu item name is required." };
  }

  if (price === "invalid") {
    return { error: "Please enter a valid price." };
  }

  const categoryError = await verifyCategoryBelongsToRestaurant(
    categoryId,
    restaurantResult.restaurantId
  );

  if (categoryError) {
    return { error: categoryError };
  }

  const supabase = await createClient();
  const { count, error: countError } = await supabase
    .from("menu_items")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantResult.restaurantId);

  if (countError) {
    return { error: countError.message };
  }

  const { error } = await supabase.from("menu_items").insert({
    restaurant_id: restaurantResult.restaurantId,
    category_id: categoryId,
    name,
    description: description || null,
    price,
    is_available: isAvailable,
    sort_order: count ?? 0,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/menu");
  return { error: null };
}

export async function updateMenuItem(
  _prevState: MenuActionState,
  formData: FormData
): Promise<MenuActionState> {
  const restaurantResult = await getAuthenticatedRestaurantId();

  if ("error" in restaurantResult) {
    return { error: restaurantResult.error };
  }

  const itemId = String(formData.get("item_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryIdRaw = String(formData.get("category_id") ?? "").trim();
  const categoryId = categoryIdRaw || null;
  const isAvailable = formData.get("is_available") === "on";
  const price = parsePrice(formData.get("price"));

  if (!itemId) {
    return { error: "Menu item not found." };
  }

  if (!name) {
    return { error: "Menu item name is required." };
  }

  if (price === "invalid") {
    return { error: "Please enter a valid price." };
  }

  const categoryError = await verifyCategoryBelongsToRestaurant(
    categoryId,
    restaurantResult.restaurantId
  );

  if (categoryError) {
    return { error: categoryError };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("menu_items")
    .update({
      name,
      description: description || null,
      category_id: categoryId,
      price,
      is_available: isAvailable,
    })
    .eq("id", itemId)
    .eq("restaurant_id", restaurantResult.restaurantId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/menu");
  return { error: null };
}

export async function deleteMenuItem(
  _prevState: MenuActionState,
  formData: FormData
): Promise<MenuActionState> {
  const restaurantResult = await getAuthenticatedRestaurantId();

  if ("error" in restaurantResult) {
    return { error: restaurantResult.error };
  }

  const itemId = String(formData.get("item_id") ?? "").trim();

  if (!itemId) {
    return { error: "Menu item not found." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", itemId)
    .eq("restaurant_id", restaurantResult.restaurantId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/menu");
  return { error: null };
}

export async function toggleMenuItemAvailability(
  _prevState: MenuActionState,
  formData: FormData
): Promise<MenuActionState> {
  const restaurantResult = await getAuthenticatedRestaurantId();

  if ("error" in restaurantResult) {
    return { error: restaurantResult.error };
  }

  const itemId = String(formData.get("item_id") ?? "").trim();

  if (!itemId) {
    return { error: "Menu item not found." };
  }

  const supabase = await createClient();
  const { data: item, error: selectError } = await supabase
    .from("menu_items")
    .select("is_available")
    .eq("id", itemId)
    .eq("restaurant_id", restaurantResult.restaurantId)
    .single();

  if (selectError || !item) {
    return { error: selectError?.message ?? "Menu item not found." };
  }

  const { error } = await supabase
    .from("menu_items")
    .update({ is_available: !item.is_available })
    .eq("id", itemId)
    .eq("restaurant_id", restaurantResult.restaurantId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/menu");
  return { error: null };
}
