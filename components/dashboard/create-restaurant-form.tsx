"use client";

import { useActionState } from "react";
import {
  createRestaurant,
  type CreateRestaurantState,
} from "@/app/dashboard/actions";
import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";

const initialState: CreateRestaurantState = { error: null };

export default function CreateRestaurantForm() {
  const [state, formAction, isPending] = useActionState(createRestaurant, initialState);

  return (
    <main className="space-y-4">
      <SectionTitle
        title="Create Your Restaurant"
        description="Set up your basic restaurant details to get started."
      />

      <Card className="p-6">
        <form action={formAction} className="space-y-4">
          {state.error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-base text-red-800">
              {state.error}
            </p>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="name" className="block text-base font-medium text-zinc-800">
              Restaurant Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="North Star Diner"
              className="h-12 w-full rounded-lg border px-3 text-base"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="block text-base font-medium text-zinc-800">
              Website Address (Slug)
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              placeholder="north-star-diner"
              className="h-12 w-full rounded-lg border px-3 text-base"
            />
            <p className="text-base text-zinc-600">
              Your public page will be at /r/your-slug
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-base font-medium text-zinc-800">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(612) 555-0182"
              className="h-12 w-full rounded-lg border px-3 text-base"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="block text-base font-medium text-zinc-800">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="102 Lake Street, Minneapolis, MN"
              className="h-12 w-full rounded-lg border px-3 text-base"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="hours" className="block text-base font-medium text-zinc-800">
              Hours
            </label>
            <input
              id="hours"
              name="hours"
              type="text"
              placeholder="Mon-Sat 11:00 AM - 9:00 PM"
              className="h-12 w-full rounded-lg border px-3 text-base"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-base font-medium text-zinc-800"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Tell customers about your restaurant."
              className="w-full rounded-lg border px-3 py-3 text-base"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="h-12 w-full rounded-lg bg-emerald-700 text-lg font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {isPending ? "Creating..." : "Create Restaurant"}
          </button>
        </form>
      </Card>
    </main>
  );
}
