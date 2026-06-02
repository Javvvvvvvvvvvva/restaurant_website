"use server";

import { revalidatePath } from "next/cache";
import {
  BUTTON_STYLE_OPTIONS,
  TEMPLATE_OPTIONS,
} from "@/lib/design/constants";
import { getActiveRestaurantForUser } from "@/lib/restaurants/active-restaurant";
import { createClient } from "@/lib/supabase/server";

export type DesignActionState = {
  error: string | null;
  success: boolean;
};

async function getOwnerRestaurantId(): Promise<{ restaurantId: string } | { error: string }> {
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

  const { data: membership, error: membershipError } = await supabase
    .from("restaurant_members")
    .select("role")
    .eq("restaurant_id", restaurant.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (membershipError) {
    return { error: membershipError.message };
  }

  if (membership?.role !== "owner") {
    return {
      error: "Only the restaurant owner can change design settings. Please ask the owner to update this page.",
    };
  }

  return { restaurantId: restaurant.id };
}

function isAllowedTemplate(value: string): boolean {
  return TEMPLATE_OPTIONS.includes(value as (typeof TEMPLATE_OPTIONS)[number]);
}

function isAllowedButtonStyle(value: string): boolean {
  return BUTTON_STYLE_OPTIONS.includes(value as (typeof BUTTON_STYLE_OPTIONS)[number]);
}

function isHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export async function updateSiteSettings(
  _prevState: DesignActionState,
  formData: FormData
): Promise<DesignActionState> {
  const restaurantResult = await getOwnerRestaurantId();

  if ("error" in restaurantResult) {
    return { error: restaurantResult.error, success: false };
  }

  const templateId = String(formData.get("template_id") ?? "").trim();
  const primaryColor = String(formData.get("primary_color") ?? "").trim();
  const backgroundColor = String(formData.get("background_color") ?? "").trim();
  const buttonStyle = String(formData.get("button_style") ?? "").trim();
  const showGallery = formData.get("show_gallery") === "on";
  const showNotices = formData.get("show_notices") === "on";
  const showContactForm = formData.get("show_contact_form") === "on";

  if (!isAllowedTemplate(templateId)) {
    return { error: "Please choose a valid template.", success: false };
  }

  if (!isAllowedButtonStyle(buttonStyle)) {
    return { error: "Please choose a valid button style.", success: false };
  }

  if (!isHexColor(primaryColor) || !isHexColor(backgroundColor)) {
    return { error: "Please choose valid colors.", success: false };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      template_id: templateId,
      primary_color: primaryColor,
      background_color: backgroundColor,
      button_style: buttonStyle,
      show_gallery: showGallery,
      show_notices: showNotices,
      show_contact_form: showContactForm,
    })
    .eq("restaurant_id", restaurantResult.restaurantId);

  if (error) {
    if (error.code === "42501" || error.message.toLowerCase().includes("policy")) {
      return {
        error:
          "Only the restaurant owner can change design settings. Please ask the owner to update this page.",
        success: false,
      };
    }

    return { error: error.message, success: false };
  }

  revalidatePath("/dashboard/design");
  return { error: null, success: true };
}
