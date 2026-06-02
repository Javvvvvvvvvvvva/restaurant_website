"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
import { createClient } from "@/lib/supabase/client";

export default function SignupForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("full_name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setErrorMessage("Please enter your email and password.");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || null,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setInfoMessage(
      "Account created. If email confirmation is required, check your inbox, then log in."
    );
    setIsLoading(false);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <Card className="w-full p-6 md:p-8">
        <SectionTitle
          title="Create Account"
          description="Start building your restaurant website in minutes."
        />

        <form className="space-y-4" onSubmit={handleSubmit}>
          {errorMessage ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-base text-red-800">
              {errorMessage}
            </p>
          ) : null}
          {infoMessage ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-base text-emerald-900">
              {infoMessage}
            </p>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="full_name" className="block text-base font-medium text-zinc-800">
              Owner Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              placeholder="Jane Kim"
              className="h-12 w-full rounded-lg border px-3 text-base"
            />
          </div>

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
              autoComplete="new-password"
              required
              minLength={6}
              placeholder="Choose a password"
              className="h-12 w-full rounded-lg border px-3 text-base"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-lg bg-emerald-700 text-lg font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-base text-zinc-700">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-emerald-700 underline">
            Log in
          </Link>
        </p>
      </Card>
    </main>
  );
}
