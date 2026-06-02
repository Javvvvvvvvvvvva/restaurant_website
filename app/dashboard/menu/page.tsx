import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
import { demoMenu, formatMenuPrice, getCategoryNameById } from "@/lib/placeholder-data";

export default function MenuManagementPage() {
  return (
    <main>
      <SectionTitle
        title="Menu Management"
        description="Add or update menu items with category and price."
      />

      <div className="space-y-3">
        {demoMenu.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">{item.name}</h2>
                <p className="text-base text-zinc-600">
                  {getCategoryNameById(item.category_id)}
                </p>
                {item.description ? (
                  <p className="mt-1 text-base text-zinc-700">{item.description}</p>
                ) : null}
              </div>
              <p className="text-2xl font-semibold text-emerald-700">
                {formatMenuPrice(item.price)}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <button
        type="button"
        className="mt-4 h-12 rounded-lg bg-emerald-700 px-5 text-lg font-medium text-white hover:bg-emerald-800"
      >
        Add Menu Item
      </button>
    </main>
  );
}
