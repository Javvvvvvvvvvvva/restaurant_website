import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center gap-4 px-4">
      <h1 className="text-3xl font-semibold text-zinc-900 md:text-4xl">
        Restaurant Website Builder
      </h1>
      <p className="text-lg text-zinc-700">
        Build and manage your restaurant website with a simple dashboard.
      </p>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-700 px-5 text-lg font-medium text-white hover:bg-emerald-800"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 text-lg font-medium text-zinc-900 hover:bg-zinc-100"
        >
          Create Account
        </Link>
      </div>

      <div className="mt-2 text-base text-zinc-600">
        Demo links:{" "}
        <Link href="/r/north-star-diner" className="underline">
          /r/north-star-diner
        </Link>{" "}
        and{" "}
        <Link href="/r/test-korean-restaurant" className="underline">
          /r/test-korean-restaurant
        </Link>
      </div>
    </main>
  );
}
