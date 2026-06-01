import Link from "next/link";
import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <Card className="w-full p-6 md:p-8">
        <SectionTitle
          title="Log In"
          description="Access your restaurant website dashboard."
        />

        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-base font-medium text-zinc-800">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="owner@example.com"
              className="h-12 w-full rounded-lg border px-3 text-base"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-base font-medium text-zinc-800"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              className="h-12 w-full rounded-lg border px-3 text-base"
            />
          </div>

          <button
            type="button"
            className="h-12 w-full rounded-lg bg-emerald-700 text-lg font-medium text-white hover:bg-emerald-800"
          >
            Log In
          </button>
        </form>

        <p className="mt-4 text-base text-zinc-700">
          New here?{" "}
          <Link href="/signup" className="font-medium text-emerald-700 underline">
            Create an account
          </Link>
        </p>
      </Card>
    </main>
  );
}
