"use client";

import { useActionState, useState } from "react";
import {
  createNotice,
  deleteNotice,
  toggleNoticeActive,
  updateNotice,
  type NoticeActionState,
} from "@/app/dashboard/notices/actions";
import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
import type { Notice } from "@/types";

const initialState: NoticeActionState = { error: null };

type NoticesManagementProps = {
  restaurantName: string;
  notices: Notice[];
};

function NoticeFields({ notice, prefix }: { notice?: Notice; prefix: string }) {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor={`${prefix}-title`} className="block text-base font-medium text-zinc-800">
          Title
        </label>
        <input
          id={`${prefix}-title`}
          name="title"
          type="text"
          required
          defaultValue={notice?.title ?? ""}
          placeholder="Holiday Hours"
          className="h-12 w-full rounded-lg border px-3 text-base"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={`${prefix}-message`} className="block text-base font-medium text-zinc-800">
          Message
        </label>
        <textarea
          id={`${prefix}-message`}
          name="message"
          rows={4}
          defaultValue={notice?.message ?? ""}
          placeholder="We are closed on July 4th."
          className="w-full rounded-lg border px-3 py-3 text-base"
        />
      </div>

      <label className="flex items-center gap-3 text-base text-zinc-800">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={notice?.is_active ?? true}
          className="h-5 w-5"
        />
        Show this notice on your website
      </label>
    </>
  );
}

function AddNoticeSection() {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, isPending] = useActionState(createNotice, initialState);

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-zinc-900">Add a Notice</h2>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="h-12 rounded-lg bg-emerald-700 px-5 text-lg font-medium text-white hover:bg-emerald-800"
        >
          {showForm ? "Cancel" : "Add Notice"}
        </button>
      </div>

      {showForm ? (
        <form action={formAction} className="mt-4 space-y-4">
          {state.error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-base text-red-800">
              {state.error}
            </p>
          ) : null}
          <NoticeFields prefix="new-notice" />
          <button
            type="submit"
            disabled={isPending}
            className="h-12 rounded-lg bg-emerald-700 px-5 text-lg font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save Notice"}
          </button>
        </form>
      ) : null}
    </Card>
  );
}

function NoticeCard({ notice }: { notice: Notice }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateAction, isUpdating] = useActionState(updateNotice, initialState);
  const [toggleState, toggleAction, isToggling] = useActionState(toggleNoticeActive, initialState);
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteNotice, initialState);

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
          <input type="hidden" name="notice_id" value={notice.id} />
          <NoticeFields notice={notice} prefix={`edit-${notice.id}`} />
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
              <h3 className="text-xl font-semibold text-zinc-900">{notice.title}</h3>
              {notice.message ? (
                <p className="mt-1 text-base text-zinc-700">{notice.message}</p>
              ) : null}
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

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="h-12 rounded-lg border border-zinc-300 bg-white px-5 text-lg font-medium text-zinc-900 hover:bg-zinc-100"
            >
              Edit
            </button>

            <form action={toggleAction}>
              <input type="hidden" name="notice_id" value={notice.id} />
              <button
                type="submit"
                disabled={isToggling}
                className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-5 text-lg font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-60 sm:w-auto"
              >
                {isToggling
                  ? "Updating..."
                  : notice.is_active
                    ? "Mark Inactive"
                    : "Mark Active"}
              </button>
            </form>

            <form action={deleteAction}>
              <input type="hidden" name="notice_id" value={notice.id} />
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

export default function NoticesManagement({
  restaurantName,
  notices,
}: NoticesManagementProps) {
  return (
    <main className="space-y-4">
      <SectionTitle
        title="Notices"
        description={`Share updates for ${restaurantName}, such as holiday hours or specials.`}
      />

      <AddNoticeSection />

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-zinc-900">Your Notices</h2>
        {notices.length === 0 ? (
          <Card>
            <p className="text-base text-zinc-700">
              No notices yet. Add your first notice above.
            </p>
          </Card>
        ) : (
          notices.map((notice) => <NoticeCard key={notice.id} notice={notice} />)
        )}
      </div>
    </main>
  );
}
