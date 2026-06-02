"use server";

import { revalidatePath } from "next/cache";
import { getActiveRestaurantForUser } from "@/lib/restaurants/active-restaurant";
import { createClient } from "@/lib/supabase/server";

export type NoticeActionState = {
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

export async function createNotice(
  _prevState: NoticeActionState,
  formData: FormData
): Promise<NoticeActionState> {
  const restaurantResult = await getAuthenticatedRestaurantId();

  if ("error" in restaurantResult) {
    return { error: restaurantResult.error };
  }

  const title = String(formData.get("title") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const isActive = formData.get("is_active") === "on";

  if (!title) {
    return { error: "Notice title is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("notices").insert({
    restaurant_id: restaurantResult.restaurantId,
    title,
    message: message || null,
    is_active: isActive,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/notices");
  return { error: null };
}

export async function updateNotice(
  _prevState: NoticeActionState,
  formData: FormData
): Promise<NoticeActionState> {
  const restaurantResult = await getAuthenticatedRestaurantId();

  if ("error" in restaurantResult) {
    return { error: restaurantResult.error };
  }

  const noticeId = String(formData.get("notice_id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const isActive = formData.get("is_active") === "on";

  if (!noticeId) {
    return { error: "Notice not found." };
  }

  if (!title) {
    return { error: "Notice title is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("notices")
    .update({
      title,
      message: message || null,
      is_active: isActive,
    })
    .eq("id", noticeId)
    .eq("restaurant_id", restaurantResult.restaurantId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/notices");
  return { error: null };
}

export async function deleteNotice(
  _prevState: NoticeActionState,
  formData: FormData
): Promise<NoticeActionState> {
  const restaurantResult = await getAuthenticatedRestaurantId();

  if ("error" in restaurantResult) {
    return { error: restaurantResult.error };
  }

  const noticeId = String(formData.get("notice_id") ?? "").trim();

  if (!noticeId) {
    return { error: "Notice not found." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("notices")
    .delete()
    .eq("id", noticeId)
    .eq("restaurant_id", restaurantResult.restaurantId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/notices");
  return { error: null };
}

export async function toggleNoticeActive(
  _prevState: NoticeActionState,
  formData: FormData
): Promise<NoticeActionState> {
  const restaurantResult = await getAuthenticatedRestaurantId();

  if ("error" in restaurantResult) {
    return { error: restaurantResult.error };
  }

  const noticeId = String(formData.get("notice_id") ?? "").trim();

  if (!noticeId) {
    return { error: "Notice not found." };
  }

  const supabase = await createClient();
  const { data: notice, error: selectError } = await supabase
    .from("notices")
    .select("is_active")
    .eq("id", noticeId)
    .eq("restaurant_id", restaurantResult.restaurantId)
    .single();

  if (selectError || !notice) {
    return { error: selectError?.message ?? "Notice not found." };
  }

  const { error } = await supabase
    .from("notices")
    .update({ is_active: !notice.is_active })
    .eq("id", noticeId)
    .eq("restaurant_id", restaurantResult.restaurantId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/notices");
  return { error: null };
}
