"use client";

import { useActionState, useState } from "react";
import {
  updateSiteSettings,
  type DesignActionState,
} from "@/app/dashboard/design/actions";
import Card from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";
import {
  BACKGROUND_COLOR_PRESETS,
  BUTTON_STYLE_OPTIONS,
  PRIMARY_COLOR_PRESETS,
  TEMPLATE_OPTIONS,
} from "@/lib/design/constants";
import type { SiteSettings } from "@/types";

const initialState: DesignActionState = { error: null, success: false };

type DesignSettingsFormProps = {
  restaurantName: string;
  settings: SiteSettings;
  canEdit: boolean;
};

export default function DesignSettingsForm({
  restaurantName,
  settings,
  canEdit,
}: DesignSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(updateSiteSettings, initialState);
  const [templateId, setTemplateId] = useState(settings.template_id);
  const [primaryColor, setPrimaryColor] = useState(settings.primary_color);
  const [backgroundColor, setBackgroundColor] = useState(settings.background_color);
  const [buttonStyle, setButtonStyle] = useState(settings.button_style);

  return (
    <main className="space-y-4">
      <SectionTitle
        title="Design Settings"
        description={`Choose a simple look for ${restaurantName}.`}
      />

      {!canEdit ? (
        <Card>
          <p className="text-base text-amber-900">
            You can view design settings, but only the restaurant owner can save changes.
          </p>
        </Card>
      ) : null}

      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-base text-red-800">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-base text-emerald-900">
          Design settings saved.
        </p>
      ) : null}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="template_id" value={templateId} />
        <input type="hidden" name="primary_color" value={primaryColor} />
        <input type="hidden" name="background_color" value={backgroundColor} />
        <input type="hidden" name="button_style" value={buttonStyle} />

        <Card>
          <h2 className="text-xl font-semibold text-zinc-900">Template</h2>
          <p className="mt-1 text-base text-zinc-600">Pick a simple layout style.</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {TEMPLATE_OPTIONS.map((template) => {
              const selected = templateId === template;
              return (
                <button
                  key={template}
                  type="button"
                  disabled={!canEdit}
                  onClick={() => setTemplateId(template)}
                  className={`h-14 rounded-lg border text-lg font-medium disabled:opacity-60 ${
                    selected
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : "bg-zinc-50 text-zinc-900"
                  }`}
                >
                  {template.charAt(0).toUpperCase() + template.slice(1)}
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-zinc-900">Primary Color</h2>
          <p className="mt-1 text-base text-zinc-600">Used for buttons and highlights.</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {PRIMARY_COLOR_PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                disabled={!canEdit}
                aria-label={`Primary color ${color}`}
                onClick={() => setPrimaryColor(color)}
                className={`h-12 w-12 rounded-full border-4 shadow disabled:opacity-60 ${
                  primaryColor === color ? "border-emerald-700" : "border-white"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-zinc-900">Background Color</h2>
          <p className="mt-1 text-base text-zinc-600">Page background color.</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {BACKGROUND_COLOR_PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                disabled={!canEdit}
                aria-label={`Background color ${color}`}
                onClick={() => setBackgroundColor(color)}
                className={`h-12 w-12 rounded-full border-4 shadow disabled:opacity-60 ${
                  backgroundColor === color ? "border-emerald-700" : "border-zinc-300"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-zinc-900">Button Style</h2>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            {BUTTON_STYLE_OPTIONS.map((style) => {
              const selected = buttonStyle === style;
              return (
                <button
                  key={style}
                  type="button"
                  disabled={!canEdit}
                  onClick={() => setButtonStyle(style)}
                  className={`h-12 flex-1 border text-lg font-medium disabled:opacity-60 ${
                    style === "rounded" ? "rounded-lg" : "rounded-sm"
                  } ${
                    selected
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : "bg-zinc-50 text-zinc-900"
                  }`}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-zinc-900">Website Sections</h2>
          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-3 text-base text-zinc-800">
              <input
                type="checkbox"
                name="show_gallery"
                defaultChecked={settings.show_gallery}
                disabled={!canEdit}
                className="h-5 w-5"
              />
              Show photo gallery
            </label>
            <label className="flex items-center gap-3 text-base text-zinc-800">
              <input
                type="checkbox"
                name="show_notices"
                defaultChecked={settings.show_notices}
                disabled={!canEdit}
                className="h-5 w-5"
              />
              Show notices
            </label>
            <label className="flex items-center gap-3 text-base text-zinc-800">
              <input
                type="checkbox"
                name="show_contact_form"
                defaultChecked={settings.show_contact_form}
                disabled={!canEdit}
                className="h-5 w-5"
              />
              Show contact form
            </label>
          </div>
        </Card>

        <button
          type="submit"
          disabled={!canEdit || isPending}
          className="h-12 w-full rounded-lg bg-emerald-700 text-lg font-medium text-white hover:bg-emerald-800 disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {isPending ? "Saving..." : "Save Design Settings"}
        </button>
      </form>
    </main>
  );
}
