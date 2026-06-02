-- Multi-tenant restaurant admin builder schema and RLS.

create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  phone text,
  address text,
  hours text,
  description text,
  logo_url text,
  hero_image_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.restaurant_members (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'staff')),
  created_at timestamptz not null default timezone('utc', now()),
  unique (restaurant_id, user_id)
);

create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (id, restaurant_id)
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  category_id uuid,
  name text not null,
  description text,
  price numeric(10, 2) check (price is null or price >= 0),
  image_url text,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  foreign key (category_id, restaurant_id)
    references public.menu_categories (id, restaurant_id)
    on delete set null (category_id)
);

create table public.notices (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  title text not null,
  message text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null unique references public.restaurants (id) on delete cascade,
  template_id text not null default 'classic',
  primary_color text not null default '#b91c1c',
  background_color text not null default '#fff7ed',
  button_style text not null default 'rounded',
  show_gallery boolean not null default true,
  show_notices boolean not null default true,
  show_contact_form boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  file_url text not null,
  file_type text,
  alt_text text,
  created_at timestamptz not null default timezone('utc', now())
);

create index restaurants_owner_id_idx on public.restaurants (owner_id);
create index restaurants_slug_idx on public.restaurants (slug);
create index restaurants_published_idx on public.restaurants (is_published) where is_published = true;

create index restaurant_members_restaurant_id_idx on public.restaurant_members (restaurant_id);
create index restaurant_members_user_id_idx on public.restaurant_members (user_id);
create index restaurant_members_user_restaurant_role_idx on public.restaurant_members (user_id, restaurant_id, role);

create index menu_categories_restaurant_sort_idx on public.menu_categories (restaurant_id, sort_order);
create index menu_items_restaurant_sort_idx on public.menu_items (restaurant_id, sort_order);
create index menu_items_category_sort_idx on public.menu_items (category_id, sort_order);
create index notices_restaurant_id_idx on public.notices (restaurant_id);
create index site_settings_restaurant_id_idx on public.site_settings (restaurant_id);
create index media_restaurant_id_idx on public.media (restaurant_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.is_restaurant_member(p_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.restaurant_members rm
    where rm.restaurant_id = p_restaurant_id
      and rm.user_id = auth.uid()
  );
$$;

create or replace function public.is_restaurant_owner(p_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.restaurant_members rm
    where rm.restaurant_id = p_restaurant_id
      and rm.user_id = auth.uid()
      and rm.role = 'owner'
  );
$$;

create or replace function public.is_restaurant_published(p_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.restaurants r
    where r.id = p_restaurant_id
      and r.is_published = true
  );
$$;

create or replace function public.handle_new_restaurant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.restaurant_members (restaurant_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (restaurant_id, user_id) do nothing;

  insert into public.site_settings (restaurant_id)
  values (new.id)
  on conflict (restaurant_id) do nothing;

  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email
  )
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

create or replace function public.set_restaurant_publish_state()
returns trigger
language plpgsql
as $$
begin
  if old.owner_id <> new.owner_id then
    raise exception 'restaurant owner_id cannot be changed';
  end if;

  if new.is_published = true and old.is_published = false then
    new.published_at = timezone('utc', now());
  elsif new.is_published = false then
    new.published_at = null;
  end if;

  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger restaurants_set_publish_state
  before update on public.restaurants
  for each row execute function public.set_restaurant_publish_state();

create trigger restaurants_set_updated_at
  before update on public.restaurants
  for each row execute function public.set_updated_at();

create trigger restaurants_after_insert
  after insert on public.restaurants
  for each row execute function public.handle_new_restaurant();

create trigger users_after_insert
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger menu_categories_set_updated_at
  before update on public.menu_categories
  for each row execute function public.set_updated_at();

create trigger menu_items_set_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

create trigger notices_set_updated_at
  before update on public.notices
  for each row execute function public.set_updated_at();

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.restaurant_members enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.notices enable row level security;
alter table public.site_settings enable row level security;
alter table public.media enable row level security;

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy profiles_insert_own
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy restaurants_select_public_published
  on public.restaurants
  for select
  to anon
  using (is_published = true);

create policy restaurants_select_member_or_published
  on public.restaurants
  for select
  to authenticated
  using (
    is_published = true
    or public.is_restaurant_member(id)
  );

create policy restaurants_insert_owner
  on public.restaurants
  for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy restaurants_update_owner
  on public.restaurants
  for update
  to authenticated
  using (public.is_restaurant_owner(id))
  with check (public.is_restaurant_owner(id));

create policy restaurants_delete_owner
  on public.restaurants
  for delete
  to authenticated
  using (public.is_restaurant_owner(id));

create policy restaurant_members_select_member
  on public.restaurant_members
  for select
  to authenticated
  using (public.is_restaurant_member(restaurant_id));

create policy restaurant_members_insert_owner
  on public.restaurant_members
  for insert
  to authenticated
  with check (public.is_restaurant_owner(restaurant_id));

create policy restaurant_members_update_owner
  on public.restaurant_members
  for update
  to authenticated
  using (
    public.is_restaurant_owner(restaurant_id)
    and user_id <> auth.uid()
    and role <> 'owner'
  )
  with check (
    public.is_restaurant_owner(restaurant_id)
    and user_id <> auth.uid()
    and role = 'staff'
  );

create policy restaurant_members_delete_owner
  on public.restaurant_members
  for delete
  to authenticated
  using (
    public.is_restaurant_owner(restaurant_id)
    and user_id <> auth.uid()
    and role <> 'owner'
  );

create policy menu_categories_select_public_published
  on public.menu_categories
  for select
  to anon
  using (public.is_restaurant_published(restaurant_id));

create policy menu_categories_select_member_or_published
  on public.menu_categories
  for select
  to authenticated
  using (
    public.is_restaurant_published(restaurant_id)
    or public.is_restaurant_member(restaurant_id)
  );

create policy menu_categories_insert_member
  on public.menu_categories
  for insert
  to authenticated
  with check (public.is_restaurant_member(restaurant_id));

create policy menu_categories_update_member
  on public.menu_categories
  for update
  to authenticated
  using (public.is_restaurant_member(restaurant_id))
  with check (public.is_restaurant_member(restaurant_id));

create policy menu_categories_delete_member
  on public.menu_categories
  for delete
  to authenticated
  using (public.is_restaurant_member(restaurant_id));

create policy menu_items_select_public_published
  on public.menu_items
  for select
  to anon
  using (public.is_restaurant_published(restaurant_id));

create policy menu_items_select_member_or_published
  on public.menu_items
  for select
  to authenticated
  using (
    public.is_restaurant_published(restaurant_id)
    or public.is_restaurant_member(restaurant_id)
  );

create policy menu_items_insert_member
  on public.menu_items
  for insert
  to authenticated
  with check (public.is_restaurant_member(restaurant_id));

create policy menu_items_update_member
  on public.menu_items
  for update
  to authenticated
  using (public.is_restaurant_member(restaurant_id))
  with check (public.is_restaurant_member(restaurant_id));

create policy menu_items_delete_member
  on public.menu_items
  for delete
  to authenticated
  using (public.is_restaurant_member(restaurant_id));

create policy notices_select_public_published
  on public.notices
  for select
  to anon
  using (public.is_restaurant_published(restaurant_id));

create policy notices_select_member_or_published
  on public.notices
  for select
  to authenticated
  using (
    public.is_restaurant_published(restaurant_id)
    or public.is_restaurant_member(restaurant_id)
  );

create policy notices_insert_member
  on public.notices
  for insert
  to authenticated
  with check (public.is_restaurant_member(restaurant_id));

create policy notices_update_member
  on public.notices
  for update
  to authenticated
  using (public.is_restaurant_member(restaurant_id))
  with check (public.is_restaurant_member(restaurant_id));

create policy notices_delete_member
  on public.notices
  for delete
  to authenticated
  using (public.is_restaurant_member(restaurant_id));

create policy site_settings_select_public_published
  on public.site_settings
  for select
  to anon
  using (public.is_restaurant_published(restaurant_id));

create policy site_settings_select_member_or_published
  on public.site_settings
  for select
  to authenticated
  using (
    public.is_restaurant_published(restaurant_id)
    or public.is_restaurant_member(restaurant_id)
  );

create policy site_settings_insert_owner
  on public.site_settings
  for insert
  to authenticated
  with check (public.is_restaurant_owner(restaurant_id));

create policy site_settings_update_owner
  on public.site_settings
  for update
  to authenticated
  using (public.is_restaurant_owner(restaurant_id))
  with check (public.is_restaurant_owner(restaurant_id));

create policy site_settings_delete_owner
  on public.site_settings
  for delete
  to authenticated
  using (public.is_restaurant_owner(restaurant_id));

create policy media_select_public_published
  on public.media
  for select
  to anon
  using (public.is_restaurant_published(restaurant_id));

create policy media_select_member_or_published
  on public.media
  for select
  to authenticated
  using (
    public.is_restaurant_published(restaurant_id)
    or public.is_restaurant_member(restaurant_id)
  );

create policy media_insert_member
  on public.media
  for insert
  to authenticated
  with check (public.is_restaurant_member(restaurant_id));

create policy media_update_member
  on public.media
  for update
  to authenticated
  using (public.is_restaurant_member(restaurant_id))
  with check (public.is_restaurant_member(restaurant_id));

create policy media_delete_member
  on public.media
  for delete
  to authenticated
  using (public.is_restaurant_member(restaurant_id));

grant usage on schema public to anon, authenticated;

grant select on public.restaurants to anon, authenticated;
grant select on public.menu_categories to anon, authenticated;
grant select on public.menu_items to anon, authenticated;
grant select on public.notices to anon, authenticated;
grant select on public.site_settings to anon, authenticated;
grant select on public.media to anon, authenticated;

grant all on public.profiles to authenticated;
grant all on public.restaurants to authenticated;
grant all on public.restaurant_members to authenticated;
grant all on public.menu_categories to authenticated;
grant all on public.menu_items to authenticated;
grant all on public.notices to authenticated;
grant all on public.site_settings to authenticated;
grant all on public.media to authenticated;

grant execute on function public.is_restaurant_member(uuid) to authenticated;
grant execute on function public.is_restaurant_owner(uuid) to authenticated;
grant execute on function public.is_restaurant_published(uuid) to anon, authenticated;
