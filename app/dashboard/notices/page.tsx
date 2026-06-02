import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
import { demoNotices } from "@/lib/placeholder-data";

export default function NoticesPage() {
  return (
    <main>
      <SectionTitle
        title="Notices"
        description="Share updates such as holiday closures or special hours."
      />

      <div className="space-y-3">
        {demoNotices.map((notice) => (
          <Card key={notice.id}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">{notice.title}</h2>
                <p className="mt-1 text-base text-zinc-700">{notice.message}</p>
              </div>
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-base font-medium ${
                  notice.is_active
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-zinc-200 text-zinc-700"
                }`}
              >
                {notice.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <button
        type="button"
        className="mt-4 h-12 rounded-lg bg-emerald-700 px-5 text-lg font-medium text-white hover:bg-emerald-800"
      >
        Add Notice
      </button>
    </main>
  );
}
