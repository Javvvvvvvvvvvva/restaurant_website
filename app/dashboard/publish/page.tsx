import Link from "next/link";
import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
import { demoMenu, demoNotices, demoRestaurant } from "@/lib/placeholder-data";

export default function PublishPage() {
  const checklist = [
    { label: "Restaurant info completed", done: true },
    { label: `At least 3 menu items (current: ${demoMenu.length})`, done: demoMenu.length >= 3 },
    { label: `At least 1 active notice (current: ${demoNotices.filter((n) => n.active).length})`, done: demoNotices.some((n) => n.active) },
    { label: "Design template selected", done: true },
  ];

  return (
    <main className="space-y-4">
      <SectionTitle
        title="Publish Website"
        description="Review your checklist, then publish your public page."
      />

      <Card>
        <h2 className="text-xl font-semibold text-zinc-900">Readiness Checklist</h2>
        <ul className="mt-3 space-y-2">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center gap-3 text-lg">
              <span
                className={`inline-block h-3 w-3 rounded-full ${
                  item.done ? "bg-emerald-600" : "bg-amber-500"
                }`}
              />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-zinc-900">Public Page Preview</h2>
        <p className="mt-2 text-base text-zinc-700">
          Your public page URL will be:
        </p>
        <p className="mt-1 break-all text-lg font-medium text-emerald-700">
          /r/{demoRestaurant.slug}
        </p>
        <Link href={`/r/${demoRestaurant.slug}`} className="mt-3 inline-block text-base underline">
          Open public page preview
        </Link>
      </Card>

      <button
        type="button"
        className="h-12 rounded-lg bg-emerald-700 px-5 text-lg font-medium text-white hover:bg-emerald-800"
      >
        Publish Website
      </button>
    </main>
  );
}
