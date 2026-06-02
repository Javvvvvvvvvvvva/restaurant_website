"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setErrorMessage("Please enter your email and password.");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <Card className="w-full p-6 md:p-8">
        <SectionTitle
          title="Log In"
          description="Access your restaurant website dashboard."
        />

        <form className="space-y-4" onSubmit={handleSubmit}>
          {errorMessage ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-base text-red-800">
              {errorMessage}
            </p>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-base font-medium text-zinc-800">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
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
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter password"
              className="h-12 w-full rounded-lg border px-3 text-base"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-lg bg-emerald-700 text-lg font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Log In"}
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
