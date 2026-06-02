import Link from "next/link";
import { redirect } from "next/navigation";
import DesignSettingsForm from "@/components/dashboard/design/design-settings-form";
import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
import { DEFAULT_SITE_SETTINGS } from "@/lib/design/constants";
import { getActiveRestaurantForUser } from "@/lib/restaurants/active-restaurant";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types";

export default async function DesignSettingsPage() {
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
        <SectionTitle title="Design Settings" description="We could not load your restaurant." />
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
          title="Design Settings"
          description="Create your restaurant before choosing a design."
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

  const { data: membership, error: membershipError } = await supabase
    .from("restaurant_members")
    .select("role")
    .eq("restaurant_id", restaurant.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (membershipError) {
    return (
      <main className="space-y-4">
        <SectionTitle title="Design Settings" description="We could not verify your access." />
        <Card>
          <p className="text-base text-red-800">{membershipError.message}</p>
        </Card>
      </main>
    );
  }

  const canEdit = membership?.role === "owner";

  const { data: initialSettings, error: settingsError } = await supabase
    .from("site_settings")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .maybeSingle();

  if (settingsError) {
    return (
      <main className="space-y-4">
        <SectionTitle title="Design Settings" description="We could not load design settings." />
        <Card>
          <p className="text-base text-red-800">{settingsError.message}</p>
        </Card>
      </main>
    );
  }

  let siteSettings = initialSettings;

  if (!siteSettings && canEdit) {
    const { data: createdSettings, error: createError } = await supabase
      .from("site_settings")
      .insert({
        restaurant_id: restaurant.id,
        ...DEFAULT_SITE_SETTINGS,
      })
      .select("*")
      .single();

    if (createError) {
      return (
        <main className="space-y-4">
          <SectionTitle title="Design Settings" description="We could not create design settings." />
          <Card>
            <p className="text-base text-red-800">{createError.message}</p>
          </Card>
        </main>
      );
    }

    siteSettings = createdSettings;
  }

  if (!siteSettings) {
    return (
      <main className="space-y-4">
        <SectionTitle
          title="Design Settings"
          description="Design settings are not available yet."
        />
        <Card>
          <p className="text-base text-amber-900">
            Only the restaurant owner can set up design settings. Please ask the owner to open
            this page first.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <DesignSettingsForm
      restaurantName={restaurant.name}
      settings={siteSettings as SiteSettings}
      canEdit={canEdit}
    />
  );
}
