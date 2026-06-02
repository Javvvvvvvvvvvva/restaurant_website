export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
};

export type Restaurant = {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  phone: string | null;
  address: string | null;
  hours: string | null;
  description: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type RestaurantMemberRole = "owner" | "staff";

export type RestaurantMember = {
  id: string;
  restaurant_id: string;
  user_id: string;
  role: RestaurantMemberRole;
  created_at: string;
};

export type MenuCategory = {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type MenuItem = {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Notice = {
  id: string;
  restaurant_id: string;
  title: string;
  message: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: string;
  restaurant_id: string;
  template_id: string;
  primary_color: string;
  background_color: string;
  button_style: string;
  show_gallery: boolean;
  show_notices: boolean;
  show_contact_form: boolean;
  created_at: string;
  updated_at: string;
};

export type Media = {
  id: string;
  restaurant_id: string;
  file_url: string;
  file_type: string | null;
  alt_text: string | null;
  created_at: string;
};
