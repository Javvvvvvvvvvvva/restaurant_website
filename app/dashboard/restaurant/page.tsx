import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
import { demoRestaurant } from "@/lib/placeholder-data";

export default function RestaurantInfoPage() {
  return (
    <main>
      <SectionTitle
        title="Restaurant Info"
        description="Keep your name, contact details, and hours up to date."
      />

      <Card className="p-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-base font-medium text-zinc-700">Restaurant Name</p>
            <p className="mt-1 rounded-lg border bg-zinc-50 p-3 text-lg">{demoRestaurant.name}</p>
          </div>
          <div>
            <p className="text-base font-medium text-zinc-700">Phone</p>
            <p className="mt-1 rounded-lg border bg-zinc-50 p-3 text-lg">{demoRestaurant.phone}</p>
          </div>
          <div>
            <p className="text-base font-medium text-zinc-700">Address</p>
            <p className="mt-1 rounded-lg border bg-zinc-50 p-3 text-lg">
              {demoRestaurant.address}
            </p>
          </div>
          <div>
            <p className="text-base font-medium text-zinc-700">Business Hours</p>
            <p className="mt-1 rounded-lg border bg-zinc-50 p-3 text-lg">{demoRestaurant.hours}</p>
          </div>
          <div>
            <p className="text-base font-medium text-zinc-700">Description</p>
            <p className="mt-1 rounded-lg border bg-zinc-50 p-3 text-lg">
              {demoRestaurant.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mt-5 h-12 rounded-lg bg-emerald-700 px-5 text-lg font-medium text-white hover:bg-emerald-800"
        >
          Save Restaurant Info
        </button>
      </Card>
    </main>
  );
}
