import { notFound } from "next/navigation";
import Image from "next/image";
import Card from "@/components/ui/card";
import {
  formatMenuPrice,
  getCategoryNameById,
  getMenuByRestaurantId,
  getNoticesByRestaurantId,
  getRestaurantBySlug,
} from "@/lib/placeholder-data";

type RestaurantPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PublicRestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = await params;
  const restaurant = getRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  const menuItems = getMenuByRestaurantId(restaurant.id);
  const activeNotices = getNoticesByRestaurantId(restaurant.id).filter(
    (notice) => notice.is_active
  );

  return (
    <main className="mx-auto w-full max-w-4xl space-y-4 px-4 py-6 md:py-10">
      <section className="overflow-hidden rounded-xl border bg-white">
        <Image
          src={restaurant.hero_image_url ?? "/vercel.svg"}
          alt={`${restaurant.name} dining room`}
          className="h-52 w-full object-cover md:h-72"
          width={1200}
          height={500}
        />
        <div className="space-y-2 p-4 md:p-6">
          <h1 className="text-3xl font-bold text-zinc-900 md:text-4xl">{restaurant.name}</h1>
          <p className="text-lg text-zinc-700">{restaurant.description}</p>
          <p className="text-lg text-zinc-800">{restaurant.hours}</p>
          <p className="text-base text-zinc-600">{restaurant.address}</p>
          <p className="text-base text-zinc-600">{restaurant.phone}</p>
        </div>
      </section>

      {activeNotices.length > 0 ? (
        <Card>
          <h2 className="text-2xl font-semibold text-zinc-900">Notices</h2>
          <div className="mt-3 space-y-3">
            {activeNotices.map((notice) => (
              <div key={notice.id} className="rounded-lg border bg-zinc-50 p-3">
                <h3 className="text-xl font-semibold text-zinc-900">{notice.title}</h3>
                <p className="text-lg text-zinc-700">{notice.message}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <Card>
        <h2 className="text-2xl font-semibold text-zinc-900">Menu</h2>
        <div className="mt-3 space-y-3">
          {menuItems.map((item) => (
            <article key={item.id} className="rounded-lg border bg-zinc-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-zinc-900">{item.name}</h3>
                <span className="text-xl font-semibold text-emerald-700">
                  {formatMenuPrice(item.price)}
                </span>
              </div>
              <p className="text-base text-zinc-600">
                {getCategoryNameById(item.category_id)}
              </p>
              {item.description ? <p className="mt-1 text-base text-zinc-700">{item.description}</p> : null}
            </article>
          ))}
        </div>
      </Card>
    </main>
  );
}
