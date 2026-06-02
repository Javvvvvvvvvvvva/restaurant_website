import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
import { getSiteSettingsByRestaurantId, demoRestaurant } from "@/lib/placeholder-data";

const templateOptions = ["classic", "warm", "minimal"] as const;
const colorOptions = ["#14532d", "#9a3412", "#1d4ed8", "#6d28d9"];

export default function DesignSettingsPage() {
  const siteSettings = getSiteSettingsByRestaurantId(demoRestaurant.id);

  return (
    <main className="space-y-4">
      <SectionTitle
        title="Design Settings"
        description="Choose a simple template and color style for your website."
      />

      <Card>
        <h2 className="text-xl font-semibold text-zinc-900">Template</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {templateOptions.map((template) => {
            const selected = siteSettings?.template_id === template;
            return (
              <button
                key={template}
                type="button"
                className={`h-12 rounded-lg border text-lg font-medium ${
                  selected
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "bg-zinc-50 text-zinc-900"
                }`}
              >
                {template.charAt(0).toUpperCase() + template.slice(1)}
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-zinc-900">Primary Color</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {colorOptions.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Select color ${color}`}
              className="h-12 w-12 rounded-full border-4 border-white shadow"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </Card>

      <button
        type="button"
        className="h-12 rounded-lg bg-emerald-700 px-5 text-lg font-medium text-white hover:bg-emerald-800"
      >
        Save Design Settings
      </button>
    </main>
  );
}
