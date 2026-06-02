"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="mt-4 h-12 w-full rounded-lg border border-zinc-300 bg-white text-lg font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-60"
    >
      {isLoading ? "Logging out..." : "Log Out"}
    </button>
  );
}
