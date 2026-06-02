-- Restaurant Website Admin Builder — initial schema, RLS, indexes, triggers

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_restaurant_member(p_restaurant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.restaurant_members rm
    WHERE rm.restaurant_id = p_restaurant_id
      AND rm.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_restaurant_owner(p_restaurant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.restaurant_members rm
    WHERE rm.restaurant_id = p_restaurant_id
      AND rm.user_id = auth.uid()
      AND rm.role = 'owner'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_restaurant_published(p_restaurant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.restaurants r
    WHERE r.id = p_restaurant_id
      AND r.is_published = true
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_restaurant()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.restaurant_members (restaurant_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner')
  ON CONFLICT (restaurant_id, user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name text,
  email text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE public.restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  phone text,
  address text,
  hours text,
  description text,
  logo_url text,
  hero_image_url text,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE public.restaurant_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'staff')),
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (restaurant_id, user_id)
);

CREATE TABLE public.menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants (id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants (id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.menu_categories (id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price numeric(10, 2),
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE public.notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants (id) ON DELETE CASCADE,
  title text NOT NULL,
  message text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL UNIQUE REFERENCES public.restaurants (id) ON DELETE CASCADE,
  template_id text NOT NULL DEFAULT 'classic',
  primary_color text NOT NULL DEFAULT '#b91c1c',
  background_color text NOT NULL DEFAULT '#fff7ed',
  button_style text NOT NULL DEFAULT 'rounded',
  show_gallery boolean NOT NULL DEFAULT true,
  show_notices boolean NOT NULL DEFAULT true,
  show_contact_form boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants (id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_type text,
  alt_text text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX idx_restaurants_owner_id ON public.restaurants (owner_id);
CREATE INDEX idx_restaurants_slug ON public.restaurants (slug);
CREATE INDEX idx_restaurants_is_published ON public.restaurants (is_published);

CREATE INDEX idx_restaurant_members_restaurant_id ON public.restaurant_members (restaurant_id);
CREATE INDEX idx_restaurant_members_user_id ON public.restaurant_members (user_id);

CREATE INDEX idx_menu_categories_restaurant_id ON public.menu_categories (restaurant_id);
CREATE INDEX idx_menu_items_restaurant_id ON public.menu_items (restaurant_id);
CREATE INDEX idx_menu_items_category_id ON public.menu_items (category_id);
CREATE INDEX idx_notices_restaurant_id ON public.notices (restaurant_id);
CREATE INDEX idx_site_settings_restaurant_id ON public.site_settings (restaurant_id);
CREATE INDEX idx_media_restaurant_id ON public.media (restaurant_id);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_restaurants_updated_at
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_menu_categories_updated_at
  BEFORE UPDATE ON public.menu_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_notices_updated_at
  BEFORE UPDATE ON public.notices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER on_restaurant_created
  AFTER INSERT ON public.restaurants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_restaurant();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- profiles ------------------------------------------------------------------

CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- restaurants ---------------------------------------------------------------

CREATE POLICY "restaurants_select_member_or_published"
  ON public.restaurants
  FOR SELECT
  TO anon, authenticated
  USING (
    public.is_restaurant_member(id)
    OR is_published = true
  );

CREATE POLICY "restaurants_insert_owner"
  ON public.restaurants
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "restaurants_update_member"
  ON public.restaurants
  FOR UPDATE
  TO authenticated
  USING (public.is_restaurant_member(id))
  WITH CHECK (public.is_restaurant_member(id));

CREATE POLICY "restaurants_delete_owner"
  ON public.restaurants
  FOR DELETE
  TO authenticated
  USING (public.is_restaurant_owner(id));

-- restaurant_members --------------------------------------------------------

CREATE POLICY "restaurant_members_select_member"
  ON public.restaurant_members
  FOR SELECT
  TO authenticated
  USING (public.is_restaurant_member(restaurant_id));

CREATE POLICY "restaurant_members_insert_owner"
  ON public.restaurant_members
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_restaurant_owner(restaurant_id));

CREATE POLICY "restaurant_members_update_owner"
  ON public.restaurant_members
  FOR UPDATE
  TO authenticated
  USING (public.is_restaurant_owner(restaurant_id))
  WITH CHECK (public.is_restaurant_owner(restaurant_id));

CREATE POLICY "restaurant_members_delete_owner"
  ON public.restaurant_members
  FOR DELETE
  TO authenticated
  USING (public.is_restaurant_owner(restaurant_id));

-- menu_categories -----------------------------------------------------------

CREATE POLICY "menu_categories_select_member_or_published"
  ON public.menu_categories
  FOR SELECT
  TO anon, authenticated
  USING (
    public.is_restaurant_member(restaurant_id)
    OR public.is_restaurant_published(restaurant_id)
  );

CREATE POLICY "menu_categories_insert_member"
  ON public.menu_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_restaurant_member(restaurant_id));

CREATE POLICY "menu_categories_update_member"
  ON public.menu_categories
  FOR UPDATE
  TO authenticated
  USING (public.is_restaurant_member(restaurant_id))
  WITH CHECK (public.is_restaurant_member(restaurant_id));

CREATE POLICY "menu_categories_delete_member"
  ON public.menu_categories
  FOR DELETE
  TO authenticated
  USING (public.is_restaurant_member(restaurant_id));

-- menu_items ----------------------------------------------------------------

CREATE POLICY "menu_items_select_member_or_published"
  ON public.menu_items
  FOR SELECT
  TO anon, authenticated
  USING (
    public.is_restaurant_member(restaurant_id)
    OR public.is_restaurant_published(restaurant_id)
  );

CREATE POLICY "menu_items_insert_member"
  ON public.menu_items
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_restaurant_member(restaurant_id));

CREATE POLICY "menu_items_update_member"
  ON public.menu_items
  FOR UPDATE
  TO authenticated
  USING (public.is_restaurant_member(restaurant_id))
  WITH CHECK (public.is_restaurant_member(restaurant_id));

CREATE POLICY "menu_items_delete_member"
  ON public.menu_items
  FOR DELETE
  TO authenticated
  USING (public.is_restaurant_member(restaurant_id));

-- notices -------------------------------------------------------------------

CREATE POLICY "notices_select_member_or_published"
  ON public.notices
  FOR SELECT
  TO anon, authenticated
  USING (
    public.is_restaurant_member(restaurant_id)
    OR public.is_restaurant_published(restaurant_id)
  );

CREATE POLICY "notices_insert_member"
  ON public.notices
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_restaurant_member(restaurant_id));

CREATE POLICY "notices_update_member"
  ON public.notices
  FOR UPDATE
  TO authenticated
  USING (public.is_restaurant_member(restaurant_id))
  WITH CHECK (public.is_restaurant_member(restaurant_id));

CREATE POLICY "notices_delete_member"
  ON public.notices
  FOR DELETE
  TO authenticated
  USING (public.is_restaurant_member(restaurant_id));

-- site_settings -------------------------------------------------------------

CREATE POLICY "site_settings_select_member_or_published"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (
    public.is_restaurant_member(restaurant_id)
    OR public.is_restaurant_published(restaurant_id)
  );

CREATE POLICY "site_settings_insert_member"
  ON public.site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_restaurant_member(restaurant_id));

CREATE POLICY "site_settings_update_member"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_restaurant_member(restaurant_id))
  WITH CHECK (public.is_restaurant_member(restaurant_id));

CREATE POLICY "site_settings_delete_member"
  ON public.site_settings
  FOR DELETE
  TO authenticated
  USING (public.is_restaurant_member(restaurant_id));

-- media ---------------------------------------------------------------------

CREATE POLICY "media_select_member_or_published"
  ON public.media
  FOR SELECT
  TO anon, authenticated
  USING (
    public.is_restaurant_member(restaurant_id)
    OR public.is_restaurant_published(restaurant_id)
  );

CREATE POLICY "media_insert_member"
  ON public.media
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_restaurant_member(restaurant_id));

CREATE POLICY "media_update_member"
  ON public.media
  FOR UPDATE
  TO authenticated
  USING (public.is_restaurant_member(restaurant_id))
  WITH CHECK (public.is_restaurant_member(restaurant_id));

CREATE POLICY "media_delete_member"
  ON public.media
  FOR DELETE
  TO authenticated
  USING (public.is_restaurant_member(restaurant_id));

-- ---------------------------------------------------------------------------
-- Grants (RLS enforces access)
-- ---------------------------------------------------------------------------

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.restaurants TO anon, authenticated;
GRANT SELECT ON public.menu_categories TO anon, authenticated;
GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT SELECT ON public.notices TO anon, authenticated;
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT SELECT ON public.media TO anon, authenticated;

GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.restaurants TO authenticated;
GRANT ALL ON public.restaurant_members TO authenticated;
GRANT ALL ON public.menu_categories TO authenticated;
GRANT ALL ON public.menu_items TO authenticated;
GRANT ALL ON public.notices TO authenticated;
GRANT ALL ON public.site_settings TO authenticated;
GRANT ALL ON public.media TO authenticated;

GRANT EXECUTE ON FUNCTION public.is_restaurant_member(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_restaurant_owner(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_restaurant_published(uuid) TO anon, authenticated;
