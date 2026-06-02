"use client";

import { useActionState, useState } from "react";
import {
  createMenuCategory,
  createMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
  updateMenuItem,
  type MenuActionState,
} from "@/app/dashboard/menu/actions";
import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
import { formatMenuPrice } from "@/lib/menu/format-price";
import type { MenuCategory, MenuItem } from "@/types";

const initialState: MenuActionState = { error: null };

type MenuManagementProps = {
  restaurantName: string;
  categories: MenuCategory[];
  items: MenuItem[];
};

function getCategoryName(categories: MenuCategory[], categoryId: string | null): string {
  if (!categoryId) {
    return "Uncategorized";
  }

  return categories.find((category) => category.id === categoryId)?.name ?? "Uncategorized";
}

function MenuItemFields({
  categories,
  item,
  prefix,
}: {
  categories: MenuCategory[];
  item?: MenuItem;
  prefix: string;
}) {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor={`${prefix}-name`} className="block text-base font-medium text-zinc-800">
          Name
        </label>
        <input
          id={`${prefix}-name`}
          name="name"
          type="text"
          required
          defaultValue={item?.name ?? ""}
          className="h-12 w-full rounded-lg border px-3 text-base"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor={`${prefix}-description`}
          className="block text-base font-medium text-zinc-800"
        >
          Description
        </label>
        <textarea
          id={`${prefix}-description`}
          name="description"
          rows={3}
          defaultValue={item?.description ?? ""}
          className="w-full rounded-lg border px-3 py-3 text-base"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={`${prefix}-price`} className="block text-base font-medium text-zinc-800">
          Price
        </label>
        <input
          id={`${prefix}-price`}
          name="price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={item?.price ?? ""}
          placeholder="12.99"
          className="h-12 w-full rounded-lg border px-3 text-base"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor={`${prefix}-category`}
          className="block text-base font-medium text-zinc-800"
        >
          Category
        </label>
        <select
          id={`${prefix}-category`}
          name="category_id"
          defaultValue={item?.category_id ?? ""}
          className="h-12 w-full rounded-lg border px-3 text-base"
        >
          <option value="">Uncategorized</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-3 text-base text-zinc-800">
        <input
          type="checkbox"
          name="is_available"
          defaultChecked={item?.is_available ?? true}
          className="h-5 w-5"
        />
        Available on menu
      </label>
    </>
  );
}

function AddCategorySection() {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, isPending] = useActionState(createMenuCategory, initialState);

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-zinc-900">Categories</h2>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="h-12 rounded-lg bg-emerald-700 px-5 text-lg font-medium text-white hover:bg-emerald-800"
        >
          {showForm ? "Cancel" : "Add Category"}
        </button>
      </div>

      {showForm ? (
        <form action={formAction} className="mt-4 space-y-4">
          {state.error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-base text-red-800">
              {state.error}
            </p>
          ) : null}
          <div className="space-y-2">
            <label htmlFor="category-name" className="block text-base font-medium text-zinc-800">
              Category Name
            </label>
            <input
              id="category-name"
              name="name"
              type="text"
              required
              placeholder="Main Dishes"
              className="h-12 w-full rounded-lg border px-3 text-base"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="h-12 rounded-lg bg-emerald-700 px-5 text-lg font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save Category"}
          </button>
        </form>
      ) : null}
    </Card>
  );
}

function AddMenuItemSection({ categories }: { categories: MenuCategory[] }) {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, isPending] = useActionState(createMenuItem, initialState);

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-zinc-900">Add Menu Item</h2>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="h-12 rounded-lg bg-emerald-700 px-5 text-lg font-medium text-white hover:bg-emerald-800"
        >
          {showForm ? "Cancel" : "Add Menu Item"}
        </button>
      </div>

      {showForm ? (
        <form action={formAction} className="mt-4 space-y-4">
          {state.error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-base text-red-800">
              {state.error}
            </p>
          ) : null}
          <MenuItemFields categories={categories} prefix="new-item" />
          <button
            type="submit"
            disabled={isPending}
            className="h-12 rounded-lg bg-emerald-700 px-5 text-lg font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save Menu Item"}
          </button>
        </form>
      ) : null}
    </Card>
  );
}

function MenuItemCard({
  item,
  categories,
}: {
  item: MenuItem;
  categories: MenuCategory[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateAction, isUpdating] = useActionState(updateMenuItem, initialState);
  const [toggleState, toggleAction, isToggling] = useActionState(
    toggleMenuItemAvailability,
    initialState
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteMenuItem, initialState);

  const actionError = updateState.error ?? toggleState.error ?? deleteState.error;

  return (
    <Card>
      {actionError ? (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-base text-red-800">
          {actionError}
        </p>
      ) : null}

      {isEditing ? (
        <form action={updateAction} className="space-y-4">
          <input type="hidden" name="item_id" value={item.id} />
          <MenuItemFields categories={categories} item={item} prefix={`edit-${item.id}`} />
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isUpdating}
              className="h-12 flex-1 rounded-lg bg-emerald-700 text-lg font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="h-12 flex-1 rounded-lg border border-zinc-300 bg-white text-lg font-medium text-zinc-900 hover:bg-zinc-100"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-zinc-900">{item.name}</h3>
              <p className="text-base text-zinc-600">
                {getCategoryName(categories, item.category_id)}
              </p>
              {item.description ? (
                <p className="mt-1 text-base text-zinc-700">{item.description}</p>
              ) : null}
              <p className="mt-2 text-base font-medium text-zinc-800">
                {item.is_available ? "Available" : "Sold Out"}
              </p>
            </div>
            <p className="text-2xl font-semibold text-emerald-700">
              {formatMenuPrice(item.price)}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="h-12 rounded-lg border border-zinc-300 bg-white px-5 text-lg font-medium text-zinc-900 hover:bg-zinc-100"
            >
              Edit
            </button>

            <form action={toggleAction}>
              <input type="hidden" name="item_id" value={item.id} />
              <button
                type="submit"
                disabled={isToggling}
                className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-5 text-lg font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-60 sm:w-auto"
              >
                {isToggling
                  ? "Updating..."
                  : item.is_available
                    ? "Mark Sold Out"
                    : "Mark Available"}
              </button>
            </form>

            <form action={deleteAction}>
              <input type="hidden" name="item_id" value={item.id} />
              <button
                type="submit"
                disabled={isDeleting}
                className="h-12 w-full rounded-lg bg-red-700 px-5 text-lg font-medium text-white hover:bg-red-800 disabled:opacity-60 sm:w-auto"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </form>
          </div>
        </>
      )}
    </Card>
  );
}

export default function MenuManagement({
  restaurantName,
  categories,
  items,
}: MenuManagementProps) {
  return (
    <main className="space-y-4">
      <SectionTitle
        title="Menu Management"
        description={`Manage menu items for ${restaurantName}.`}
      />

      {categories.length > 0 ? (
        <Card>
          <p className="text-base text-zinc-600">Your categories</p>
          <p className="mt-1 text-lg text-zinc-900">
            {categories.map((category) => category.name).join(", ")}
          </p>
        </Card>
      ) : (
        <Card>
          <p className="text-base text-zinc-700">
            Add a category first (for example: Main, Appetizer, Drinks).
          </p>
        </Card>
      )}

      <AddCategorySection />
      <AddMenuItemSection categories={categories} />

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-zinc-900">Menu Items</h2>
        {items.length === 0 ? (
          <Card>
            <p className="text-base text-zinc-700">No menu items yet. Add your first item above.</p>
          </Card>
        ) : (
          items.map((item) => (
            <MenuItemCard key={item.id} item={item} categories={categories} />
          ))
        )}
      </div>
    </main>
  );
}
