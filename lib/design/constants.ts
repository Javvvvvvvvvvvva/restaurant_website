export const TEMPLATE_OPTIONS = ["classic", "warm", "minimal"] as const;

export const PRIMARY_COLOR_PRESETS = [
  "#b91c1c",
  "#14532d",
  "#9a3412",
  "#1d4ed8",
  "#6d28d9",
] as const;

export const BACKGROUND_COLOR_PRESETS = [
  "#fff7ed",
  "#ffffff",
  "#f8fafc",
  "#fef3c7",
] as const;

export const BUTTON_STYLE_OPTIONS = ["rounded", "square"] as const;

export const DEFAULT_SITE_SETTINGS = {
  template_id: "classic",
  primary_color: "#b91c1c",
  background_color: "#fff7ed",
  button_style: "rounded",
  show_gallery: true,
  show_notices: true,
  show_contact_form: false,
} as const;
